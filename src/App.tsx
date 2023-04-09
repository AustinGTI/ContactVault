import React, {useState} from 'react';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import LoginPage from "./auth_pages/LoginPage";
import ContactsListPage from "./contacts_pages/ContactsListPage";
import AddContactPage from "./contacts_pages/AddContactPage";
import EditContactPage from "./contacts_pages/EditContactPage";
import {AuthServiceClient} from "./protos/AuthServiceClientPb";
import {UserRequest} from "./protos/auth_pb";


// component to check if the user is logged in
function Auth({children} : {children : React.ReactElement}) : React.ReactElement {
    // check if both the jwt token and refresh token are present
    if (localStorage.getItem('jwt_token') && localStorage.getItem('refresh_token')) {
        return children;
    }
    // otherwise, redirect to the login page
    return <Navigate to={'/login'}/>;
}

// the main app component
function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* login page */}
                <Route path="login" element={<LoginPage/>}/>
                {/* all contacts page */}
                <Route path="contacts" element={<Auth><ContactsListPage/></Auth>}/>
                {/* add contact page */}
                <Route path="contacts/add" element={<AddContactPage/>}/>
                {/* edit contact page */}
                <Route path="contacts/:id" element={<EditContactPage/>}/>
                {/* 404 page */}
                <Route path="*" element={<div>404</div>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
