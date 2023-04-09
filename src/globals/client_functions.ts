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
import {useDispatch} from "react-redux";
import {
    addContactRedux,
    clearContactsRedux,
    deleteContactRedux,
    syncContactsRedux,
    updateContactRedux
} from "../redux/contacts_slice";
import {clearUserRedux, setUserRedux} from "../redux/user_slice";

// region CONSTANTS
const HOST = "http://localhost:8080";

// region AUTHENTICATION FUNCTIONS

// function to login a user
export function login(username: string, password: string): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
        const request = new LoginRequest();
        request.setUsername(username);
        request.setPassword(password);
        const client = new AuthServiceClient(HOST, null, null);
        client.login(request, {}, (err, response) => {
            if (err) {
                reject(err);
            } else {
                // on login, call userMe to get user details and store them in the redux store
                userMe(response.getJwttoken()).then((_) => resolve(response)).catch(reject);
            }
        });
    });
}

// function to logout a user
export function logout(): Promise<void> {
    // remove tokens from local storage
    return new Promise((resolve, reject) => {
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("refresh_token");
        // clear redux store
        const dispatch = useDispatch();
        dispatch(clearContactsRedux());
        dispatch(clearUserRedux());
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
export function userMe(accessToken: string, attempt_refresh: boolean = true): Promise<UserResponse> {
    return new Promise((resolve, reject) => {
        const dispatch = useDispatch();
        const request = new UserRequest();
        const client = new AuthServiceClient(HOST, null, null);
        client.userMe(request, {'authorization': accessToken}, (err, response) => {
            if (err) {
                if (attempt_refresh) {
                    // if there is an error, it means the access token is invalid, try to refresh it
                    refreshAccessToken().then((response) => {
                            // if refresh token is valid, try again with the new access token
                            userMe(response.getAccesstoken(),false).then(resolve).catch(reject);
                        }
                    ).catch((_) => {
                        // if refresh token is invalid, reject the promise
                        reject(err);
                    });
                } else {
                    reject(err);
                }
            } else {
                // store the user data in the redux store
                dispatch(setUserRedux({id: response.getId(), username: response.getUsername()}))
                resolve(response);
            }
        });
    });
}

// endregion

// region CONTACTS FUNCTIONS

// function to get all contacts
export function getContacts(accessToken: string, attempt_refresh: boolean = true): Promise<ContactList> {
    return new Promise((resolve, reject) => {
        const dispatch = useDispatch();
        const client = new ContactServiceClient(HOST, null, null);
        client.getContacts(new ContactList(), {'authorization': accessToken}, (err, response) => {
            if (err) {
                if (attempt_refresh) {
                    // if there is an error, it means the access token is invalid, try to refresh it
                    refreshAccessToken().then((response) => {
                            // if refresh token is valid, try again with the new access token
                            getContacts(response.getAccesstoken(),false).then(resolve).catch(reject);
                        }
                    ).catch((_) => {
                        // if refresh token is invalid, reject the promise
                        reject(err);
                    });
                } else {
                    reject(err);
                }
            } else {
                // if the contacts were fetched successfully, sync the redux state with the response
                dispatch(syncContactsRedux(response.getContactsList()));
                resolve(response);
            }
        });
    });
}

// function to add a contact
export function addContact(accessToken: string, contact: Contact,attempt_refresh: boolean = true): Promise<ContactID> {
    return new Promise((resolve, reject) => {
        const dispatch = useDispatch();
        const client = new ContactServiceClient(HOST, null, null);
        client.addContact(contact, {'authorization': accessToken}, (err, response) => {
            if (err) {
                if (attempt_refresh) {
                    // if there is an error, it means the access token is invalid, try to refresh it
                    refreshAccessToken().then((response) => {
                            // if refresh token is valid, try again with the new access token
                            // if it is the second attempt, do not try to refresh the token again simply reject the promise
                            addContact(response.getAccesstoken(), contact, false).then(resolve).catch(reject);
                        }
                    ).catch((_) => {
                        // if refresh token is invalid, reject the promise
                        reject(err);
                    });
                } else {
                    reject(err);
                }
            } else {
                contact.setId(response.getId());
                // if the contact was added successfully, update the contacts redux state
                dispatch(addContactRedux(contact));

                resolve(response);
            }
        });
    });
}

// function to update a contact
export function updateContact(accessToken: string, contact: Contact,attempt_refresh: boolean = true): Promise<Contact> {
    return new Promise((resolve, reject) => {
        const dispatch = useDispatch();
        const client = new ContactServiceClient(HOST, null, null);
        client.updateContact(contact, {'authorization': accessToken}, (err, response) => {
            if (err) {
                if (attempt_refresh) {
                    // if there is an error, it means the access token is invalid, try to refresh it
                    refreshAccessToken().then((response) => {
                            // if refresh token is valid, try again with the new access token
                            updateContact(response.getAccesstoken(), contact,false).then(resolve).catch(reject);
                        }
                    ).catch((_) => {
                        // if refresh token is invalid, reject the promise
                        reject(err);
                    });
                } else {
                    reject(err);
                }
            } else {
                // if the contact was updated successfully, update the contacts redux state
                dispatch(updateContactRedux(contact));
                resolve(response);
            }
        });
    });
}

// function to delete a contact
export function deleteContact(accessToken: string, contact_id: ContactID,attempt_refresh: boolean = true): Promise<Empty> {
    return new Promise((resolve, reject) => {
        const dispatch = useDispatch();
        const client = new ContactServiceClient(HOST, null, null);
        client.deleteContact(contact_id, {'authorization': accessToken}, (err, response) => {
            if (err) {
                if (attempt_refresh) {
                    // if there is an error, it means the access token is invalid, try to refresh it
                    refreshAccessToken().then((response) => {
                            // if refresh token is valid, try again with the new access token
                            deleteContact(response.getAccesstoken(), contact_id, false).then(resolve).catch(reject);
                        }
                    ).catch((_) => {
                        // if refresh token is invalid, reject the promise
                        reject(err);
                    });
                } else {
                    reject(err);
                }
            } else {
                // if the contact was deleted successfully, update the contacts redux state
                dispatch(deleteContactRedux(contact_id.getId()));
                resolve(response);
            }
        });
    });
}

// endregion
