import React, {useCallback, useReducer, useRef} from "react";
import {addContact} from "../globals/client_functions";
import {Contact} from "../protos/contacts_pb";
import {useNavigate} from "react-router-dom";

export default function AddContactPage() {
    const nav = useNavigate();
    // refs to the input elements
    const name_ref = useRef<HTMLInputElement>(null);
    const email_ref = useRef<HTMLInputElement>(null);
    const phone_ref = useRef<HTMLInputElement>(null);
    // todo: create a custom hook to handle the error message
    // the error message
    const [error, setError] = useReducer((_ : string | null, newError : string | null) => {
        // if the error is null, return null
        if (newError === null) return null;
        // otherwise, return the error and clear it after 5 seconds
        setTimeout(() => setError(null), 5000);
        return newError;
    }, null)

    // function to handle the submit button
    const addContactHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // prevent the default action
        e.preventDefault();
        // get the values from the refs
        const name = name_ref.current?.value;
        const email = email_ref.current?.value;
        const phone = phone_ref.current?.value;
        // todo : perform some extra client side validation
        // if the values are present
        if (name && email && phone) {
            // create a Contact object
            const contact = new Contact();
            contact.setName(name);
            contact.setEmail(email);
            contact.setPhone(phone);

            // send the values to the server
            addContact(`${localStorage.getItem('jwt_token')}`,contact).then((res) => {
                // if the response is successful, redirect to the contacts page with success message
                nav('/contacts', {state: {success: "Contact added successfully"}});
            }).catch((err) => {
                // otherwise, set the error message
                setError(err.message);
            });
        }
        // otherwise, set the error message
        else {
            setError("Please fill in all the fields");
        }
    }, [nav]);


    return (
        <div className="add-contact">
            <h1>Add Contact</h1>
            {error && <p className="error">{error}</p>}
            <div className="add-contact-form">
                <div className='name-input'>
                    <label htmlFor="name">Name</label>
                    <input ref={name_ref} type="text" id="name"/>
                </div>
                <div className='email-input'>
                    <label htmlFor="email">Email</label>
                    <input ref={email_ref} type="text" id="email"/>
                </div>
                <div className='phone-input'>
                    <label htmlFor="phone">Phone</label>
                    <input ref={phone_ref} type="text" id="phone"/>
                </div>
                <button className="add-contact-button">Add Contact</button>
            </div>
        </div>
    );
}