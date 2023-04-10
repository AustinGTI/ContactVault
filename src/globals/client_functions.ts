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

// function to login a user
export function login(username: string, password: string, dispatch: any): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
        const request = new LoginRequest();
        request.setUsername(username);
        request.setPassword(password);
        const client = new AuthServiceClient(HOST, null, null);
        client.login(request, {}, (err, response) => {
            if (err) {
                reject(err);
            } else {
                // check if the status code is not 200
                if (response.getStatus() !== 200) {
                    reject(new Error(response.getError()));
                }
                // if the status code is 200, store the tokens in local storage
                else {
                    localStorage.setItem("jwt_token", response.getJwttoken());
                    localStorage.setItem("refresh_token", response.getRefreshtoken());
                    // on login, call userMe to get user details and store them in the redux store
                    userMe(response.getJwttoken(), dispatch).then((_) => resolve(response)).catch(reject);
                }
            }
        });
    });
}

// function to logout a user
export function logout(dispatch: any): Promise<void> {
    // remove tokens from local storage
    return new Promise((resolve, reject) => {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("refresh_token");
        // clear the redux store
        dispatch(clearUserRedux());
        dispatch(clearContactsRedux());
        resolve();
    });
}

// function to refresh access token
export function refreshAccessToken(): Promise<RefreshAccessTokenResponse> {
    return new Promise((resolve, reject) => {
        // check if there is a refresh token in local storage
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
            reject(new Error("No refresh token found"));
        } else {
            const request = new RefreshAccessTokenRequest();
            request.setRefreshtoken(refreshToken);
            const client = new AuthServiceClient(HOST, null, null);
            client.refreshAccessToken(request, {}, (err, response) => {
                if (err) {
                    reject(err);
                } else {
                    localStorage.setItem("jwt_token", response.getAccesstoken());
                    resolve(response);
                }
            });
        }
    });
}

// function to get user details
export function userMe(accessToken: string, dispatch: any, attempt_refresh: boolean = true): Promise<UserResponse> {
    return new Promise((resolve, reject) => {
        const request = new UserRequest();
        const client = new AuthServiceClient(HOST, null, null);
        client.userMe(request, {'authorization': accessToken}, (err, response) => {
            if (err) {
                err.message = "Session has likely expired, please login again";
                if (attempt_refresh) {
                    // if there is an error, it means the access token is invalid, try to refresh it
                    refreshAccessToken().then((response) => {
                            // if refresh token is valid, try again with the new access token
                            if (response.getStatus() === 200) {
                                userMe(response.getAccesstoken(), dispatch, false).then(resolve).catch(reject);
                            }
                            // else, the session has likely expired, reject the promise
                            else {
                                reject(err);
                            }
                        }
                    ).catch((_) => {
                        // if refresh token is invalid, reject the promise
                        reject(err);
                    });
                } else {
                    reject(err);
                }
            } else {
                // on success, store user details in the redux store
                dispatch(setUserRedux({id: response.getId(), username: response.getUsername()}));
                resolve(response);
            }
        });
    });
}

// endregion

// region CONTACTS FUNCTIONS

// function to get all contacts
export function getContacts(accessToken: string, dispatch: any, attempt_refresh: boolean = true): Promise<ContactList> {
    return new Promise((resolve, reject) => {
        const client = new ContactServiceClient(HOST, null, null);
        client.getContacts(new ContactList(), {'authorization': accessToken}, (err, response) => {
            if (err) {
                err.message = "Session has likely expired, please login again";
                if (attempt_refresh) {
                    // if there is an error, it means the access token is invalid, try to refresh it
                    refreshAccessToken().then((response) => {
                            // if refresh token is valid, try again with the new access token
                            if (response.getStatus() === 200) {
                                getContacts(response.getAccesstoken(), dispatch, false).then(resolve).catch(reject);
                            }
                            // else, the session has likely expired, reject the promise
                            else {
                                reject(err);
                            }
                        }
                    ).catch((_) => {
                        // if refresh token is invalid, reject the promise
                        reject(err);
                    });
                } else {
                    reject(err);
                }
            } else {
                // on success, store contacts in the redux store
                const contacts_list = response.getContactsList().map((contact) => contactToReduxContact(contact));
                dispatch(syncContactsRedux(contacts_list));
                resolve(response);
            }
        });
    });
}

// function to add a contact
export function addContact(accessToken: string, contact: Contact, dispatch: any, attempt_refresh: boolean = true): Promise<ContactID> {
    return new Promise((resolve, reject) => {
        const client = new ContactServiceClient(HOST, null, null);
        client.addContact(contact, {'authorization': accessToken}, (err, response) => {
            if (err) {
                err.message = "Session has likely expired, please login again";
                if (attempt_refresh) {
                    // if there is an error, it means the access token is invalid, try to refresh it
                    refreshAccessToken().then((response) => {
                            // if refresh token is valid, try again with the new access token
                            if (response.getStatus() === 200) {
                                addContact(response.getAccesstoken(), contact, dispatch, false).then(resolve).catch(reject);
                            }
                            // else, the session has likely expired, reject the promise
                            else {
                                reject(err);
                            }
                        }
                    ).catch((_) => {
                        // if refresh token is invalid, reject the promise
                        reject(err);
                    });
                } else {
                    reject(err);
                }
            } else {
                // on success, add the contact to the redux store
                contact.setId(response.getId());
                dispatch(addContactRedux(contactToReduxContact(contact)));
                resolve(response);
            }
        });
    });
}

// function to update a contact
export function updateContact(accessToken: string, contact: Contact, dispatch: any, attempt_refresh: boolean = true): Promise<Contact> {
    return new Promise((resolve, reject) => {
        const client = new ContactServiceClient(HOST, null, null);
        client.updateContact(contact, {'authorization': accessToken}, (err, response) => {
            if (err) {
                err.message = "Session has likely expired, please login again";
                if (attempt_refresh) {
                    // if there is an error, it means the access token is invalid, try to refresh it
                    refreshAccessToken().then((response) => {
                            // if refresh token is valid, try again with the new access token
                            if (response.getStatus() === 200) {
                                updateContact(response.getAccesstoken(), contact, dispatch, false).then(resolve).catch(reject);
                            }
                            // else, the session has likely expired, reject the promise
                            else {
                                reject(err);
                            }
                        }
                    ).catch((_) => {
                        // if refresh token is invalid, reject the promise
                        reject(err);
                    });
                } else {
                    reject(err);
                }
            } else {
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
        const client = new ContactServiceClient(HOST, null, null);
        client.deleteContact(contact_id, {'authorization': accessToken}, (err, response) => {
            if (err) {
                err.message = "Session has likely expired, please login again";
                if (attempt_refresh) {
                    // if there is an error, it means the access token is invalid, try to refresh it
                    refreshAccessToken().then((response) => {
                            // if refresh token is valid, try again with the new access token
                            if (response.getStatus() === 200) {
                                deleteContact(response.getAccesstoken(), contact_id, dispatch, false).then(resolve).catch(reject);
                            }
                            // else, the session has likely expired, reject the promise
                            else {
                                reject(err);
                            }
                        }
                    ).catch((_) => {
                        // if refresh token is invalid, reject the promise
                        reject(err);
                    });
                } else {
                    reject(err);
                }
            } else {
                // on success, delete the contact from the redux store
                dispatch(deleteContactRedux(contact_id.getId()));
                resolve(response);
            }
        });
    });
}

// endregion
