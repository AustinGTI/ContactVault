import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./auth_pages/LoginPage";
import ContactsListPage from "./contacts_pages/ContactsListPage";
import AddContactPage from "./contacts_pages/AddContactPage";
import EditContactPage from "./contacts_pages/EditContactPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* login page */}
                <Route path="login" element={<LoginPage/>}/>
                {/* all contacts page */}
                <Route path="contacts" element={<ContactsListPage/>}/>
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
