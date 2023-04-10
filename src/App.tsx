import React from 'react';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "./auth_pages/LoginPage";
import ContactsListPage from "./contacts_pages/ContactsListPage";
import ContactViewPage from "./contacts_pages/ContactViewPage";
import {addContact, updateContact} from "./globals/client_functions";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {persistStore, persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import {userReducer} from "./redux/user_slice";
import {contactsReducer} from "./redux/contacts_slice";
import {Provider, useSelector} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import StatusCodeErrorPage from "./error_pages/status_code_error_page";

// region REDUX CONFIGURATION
const persistConfig = {
    key: 'root',
    storage
}
const rootReducer = combineReducers({
    user: userReducer,
    contacts: contactsReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

// the redux store configuration
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

const persistor = persistStore(store);
// endregion

// component to check if the user is logged in and redirect to the login page if not
function Auth({children}: { children: React.ReactElement }): React.ReactElement {
    // get the user from the redux store
    const user = useSelector((state: any) => state.user);
    // if both the jwt token and the refresh token are not in the local storage, redirect to the login page
    if (!(localStorage.getItem('jwt_token') && localStorage.getItem('refresh_token'))) {
        return <Navigate to={'/login'}/>;
    }
    // if the user id and the user name are not set in the redux store, redirect to the login page
    if (!(user.id && user.name)) {
        return <Navigate to={'/login'}/>;
    }
    // otherwise, user is logged in, return the child component
    return children;
}

// the main app component
function App() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor} loading={null}>
                <BrowserRouter>
                    <Routes>
                        {/* login page */}
                        <Route path="login" element={<LoginPage/>}/>
                        {/* all contacts page */}
                        <Route path="contacts" element={<Auth><ContactsListPage/></Auth>}/>
                        {/* add contact page */}
                        <Route path="contacts/add"
                               element={<ContactViewPage page_title="Add Contact" submitFunction={addContact}/>}/>
                        {/* edit contact page */}
                        <Route path="contacts/:id"
                               element={<ContactViewPage page_title="Edit Contact" submitFunction={updateContact}/>}/>
                        {/* 404 page */}
                        <Route path="*" element={<StatusCodeErrorPage status_code={404}/>}/>
                    </Routes>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    );
}

export default App;
