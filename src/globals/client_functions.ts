import {
    LoginRequest,
    LoginResponse,
    RefreshAccessTokenRequest,
    RefreshAccessTokenResponse, UserRequest,
    UserResponse
} from "../protos/auth_pb";
import {AuthServiceClient} from "../protos/AuthServiceClientPb";
import {Contact, ContactID, ContactList, Empty} from "../protos/contacts_pb";
import {ContactServiceClient} from "../protos/ContactsServiceClientPb";
import {
    addContactRedux,
    clearContactsRedux, contactToReduxContact,
    deleteContactRedux,
    syncContactsRedux,
    updateContactRedux
} from "../redux/contacts_slice";
import {clearUserRedux, setUserRedux} from "../redux/user_slice";

// region CONSTANTS
const HOST = "http://localhost:8080";

// region AUTHENTICATION FUNCTIONS

// function to send login request to the server
export function login(username: string, password: string, dispatch: any): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
        // initialize a login request and set the username and password
        const request = new LoginRequest();
        request.setUsername(username);
        request.setPassword(password);
        // initialize a client and set the host, then send the request
        const client = new AuthServiceClient(HOST, null, null);
        client.login(request, {}, (err, response) => {
            if (err) {
                // if there is an error, reject the promise
                reject(err);
            } else {
                // if there is no error, check the status code, if not 200, reject the promise
                if (response.getStatus() !== 200) {
                    reject(new Error(response.getError()));
                }
                // if the status code is 200, store the tokens in local storage and call userMe to get user details and store them in the redux store
                else {
                    localStorage.setItem("jwt_token", response.getJwttoken());
                    localStorage.setItem("refresh_token", response.getRefreshtoken());
                    userMe(response.getJwttoken(), dispatch).then((_) => resolve(response)).catch(reject);
                }
            }
        });
    });
}

// function to log out a user by clearing the local storage and the redux store of user and contact data
export function logout(dispatch: any): Promise<void> {
    return new Promise((resolve, _) => {
        // clear the local storage of the tokens (access and refresh)
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("refresh_token");
        // clear the redux store of both user and contact data
        dispatch(clearUserRedux());
        dispatch(clearContactsRedux());
        // resolve the promise
        resolve();
    });
}

// function to make a refresh access token request to the server
export function refreshAccessToken(): Promise<RefreshAccessTokenResponse> {
    return new Promise((resolve, reject) => {
        // check if there is a refresh token in local storage, if not, reject the promise
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
            reject(new Error("No refresh token found"));
        } else {
            // if there is a refresh token, initialize a refresh access token request and set the refresh token
            const request = new RefreshAccessTokenRequest();
            request.setRefreshtoken(refreshToken);
            // initialize a client and set the host, then send the request
            const client = new AuthServiceClient(HOST, null, null);
            client.refreshAccessToken(request, {}, (err, response) => {
                if (err) {
                    // if there is an error, reject the promise
                    reject(err);
                } else {
                    // if there is no error, check the status code, if not 200, reject the promise
                    if (response.getStatus() !== 200) {
                        reject(new Error(response.getError()));
                    }
                    // if the status code is 200, store the new access token in local storage and resolve the promise
                    else {
                        localStorage.setItem("jwt_token", response.getAccesstoken());
                        resolve(response);
                    }
                }
            });
        }
    });
}

// function to make a userMe request to the server to get user details and store them in the redux store
export function userMe(accessToken: string, dispatch: any, attempt_refresh: boolean = true): Promise<UserResponse> {
    return new Promise((resolve, reject) => {
        // initialize a userMe request and a client, then send the request (set the access token in the headers)
        const request = new UserRequest();
        const client = new AuthServiceClient(HOST, null, null);
        client.userMe(request, {'authorization': accessToken}, (err, response) => {
            if (err) {
                err.message = "Session has likely expired, please login again";
                // if there is an error, it could be because the access token is expired, try to refresh it and run the function again
                if (attempt_refresh) {
                    refreshAccessToken().then((response) => {
                            userMe(response.getAccesstoken(), dispatch, false).then(resolve).catch(reject);
                        }
                    ).catch((_) => {
                        // if refresh token is invalid, reject the promise
                        reject(err);
                    });
                }
                // if attempting to refresh the access token failed, the session is likely expired, reject the promise
                else {
                    reject(err);
                }
            } else {
                // on success, store user details in the redux store and resolve the promise
                dispatch(setUserRedux({id: response.getId(), username: response.getUsername()}));
                resolve(response);
            }
        });
    });
}

// endregion


// region CONTACTS FUNCTIONS

// function to make a request to the server to get all contacts
export function getContacts(accessToken: string, dispatch: any, attempt_refresh: boolean = true): Promise<ContactList> {
    return new Promise((resolve, reject) => {
        // initialize a client and send the request (set the access token in the headers)
        const client = new ContactServiceClient(HOST, null, null);
        client.getContacts(new ContactList(), {'authorization': accessToken}, (err, response) => {
            if (err) {
                err.message = "Session has likely expired, please login again";
                // attempt a refresh loop to get a new access token
                if (attempt_refresh) {
                    refreshAccessToken().then((response) => {
                                getContacts(response.getAccesstoken(), dispatch, false).then(resolve).catch(reject);
                        }
                    ).catch((_) => {
                        // if refresh attempt fails, reject the promise
                        reject(err);
                    });
                }
                // if access token is still invalid after refresh, the session has possibly expired, reject the promise
                else {
                    reject(err);
                }
            } else {
                // on success, store contacts in the redux store and resolve the promise
                const contacts_list = response.getContactsList().map((contact) => contactToReduxContact(contact));
                dispatch(syncContactsRedux(contacts_list));
                resolve(response);
            }
        });
    });
}

// function to make a request to the server to add a contact
export function addContact(accessToken: string, contact: Contact, dispatch: any, attempt_refresh: boolean = true): Promise<ContactID> {
    return new Promise((resolve, reject) => {
        // initialize a client and send the request (set the access token in the headers)
        const client = new ContactServiceClient(HOST, null, null);
        client.addContact(contact, {'authorization': accessToken}, (err, response) => {
            if (err) {
                err.message = "Session has likely expired, please login again";
                // on error, attempt a refresh loop to get a new access token
                if (attempt_refresh) {
                    refreshAccessToken().then((response) => {
                                addContact(response.getAccesstoken(), contact, dispatch, false).then(resolve).catch(reject);
                        }
                    ).catch((_) => {
                        // if refresh attempt fails, reject the promise
                        reject(err);
                    });
                }
                // if access token is still invalid, the session has possibly expired, reject the promise
                else {
                    reject(err);
                }
            } else {
                // on success, add the contact to the redux store and resolve the promise
                contact.setId(response.getId());
                dispatch(addContactRedux(contactToReduxContact(contact)));
                resolve(response);
            }
        });
    });
}

// function to make a request to the server to update a contact
export function updateContact(accessToken: string, contact: Contact, dispatch: any, attempt_refresh: boolean = true): Promise<Contact> {
    return new Promise((resolve, reject) => {
        // initialize a client and send the request (set the access token in the headers)
        const client = new ContactServiceClient(HOST, null, null);
        client.updateContact(contact, {'authorization': accessToken}, (err, response) => {
            if (err) {
                err.message = "Session has likely expired, please login again";
                // on error, attempt a refresh loop to get a new access token
                if (attempt_refresh) {
                    // if there is an error, it means the access token is invalid, try to refresh it
                    refreshAccessToken().then((response) => {
                                updateContact(response.getAccesstoken(), contact, dispatch, false).then(resolve).catch(reject);
                        }
                    ).catch((_) => {
                        // if refresh attempt fails, reject the promise
                        reject(err);
                    });
                } else {
                    // if access token is still invalid, the session has possibly expired, reject the promise
                    reject(err);
                }
            }
            else {
                // on success, update the contact in the redux store
                dispatch(updateContactRedux(contactToReduxContact(response)));
                resolve(response);
            }
        });
    });
}

// function to delete a contact
export function deleteContact(accessToken: string, contact_id: ContactID, dispatch: any, attempt_refresh: boolean = true): Promise<Empty> {
    return new Promise((resolve, reject) => {
        // initialize a client and send the request (set the access token in the headers)
        const client = new ContactServiceClient(HOST, null, null);
        client.deleteContact(contact_id, {'authorization': accessToken}, (err, response) => {
            if (err) {
                err.message = "Session has likely expired, please login again";
                // on error, attempt a refresh loop to get a new access token
                if (attempt_refresh) {
                    refreshAccessToken().then((response) => {
                                deleteContact(response.getAccesstoken(), contact_id, dispatch, false).then(resolve).catch(reject);
                        }
                    ).catch((_) => {
                        // if refresh attempt fails, reject promise
                        reject(err);
                    });
                } else {
                    // if access token is still invalid, the session has possibly expired, reject the promise
                    reject(err);
                }
            } else {
                // on success, delete the contact from the redux store and resolve the promise
                dispatch(deleteContactRedux(contact_id.getId()));
                resolve(response);
            }
        });
    });
}

// endregion
