import React, {useCallback, useReducer, useRef} from "react";
import {addContact} from "../globals/client_functions";
import {Contact, ContactID} from "../protos/contacts_pb";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";


export default function ContactViewPage({
                                           page_title,
                                           submitFunction,
                                       }: { page_title: string, submitFunction: (access_token: string,contact: Contact,dispatch : any) => Promise<Contact | ContactID>, contact?: Contact }): React.ReactElement {
    const nav = useNavigate();
    const dispatch = useDispatch();
    // refs to the input elements
    const name_ref = useRef<HTMLInputElement>(null);
    const email_ref = useRef<HTMLInputElement>(null);
    const phone_ref = useRef<HTMLInputElement>(null);
    // todo: create a custom hook to handle the error message
    // the error message
    const [error, setError] = useReducer((_: string | null, newError: string | null) => {
        // if the error is null, return null
        if (newError === null) return null;
        // otherwise, return the error and clear it after 5 seconds
        setTimeout(() => setError(null), 5000);
        return newError;
    }, null)
    // check if an id is present in the params, if so then it is an edit page, get the contact from the store
    const id = useParams().id;
    const contact = useSelector((state: any) => id ? state.contacts[id] : null);

    // function to handle the submit button
    const submitHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
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
            // if the id is present, set the id
            if (id) contact.setId(id);

            console.log('submit handler called');
            // send the values to the server
            submitFunction(`${localStorage.getItem('jwt_token')}`, contact, dispatch).then((res) => {
                // if the response is successful, redirect to the contacts page with success message
                nav('/contacts', {state: {success: "Contact added successfully"}});
                console.log('function called');
            }).catch((err) => {
                // otherwise, set the error message
                console.error(err);
                setError(err.message);
            });
        }
        // otherwise, set the error message
        else {
            setError("Please fill in all the fields");
        }
    }, [nav,submitFunction,dispatch]);


    return (
        <div className="add-contact">
            <h1>{page_title}</h1>
            {error && <p className="error">{error}</p>}
            <div className="add-contact-form">
                <div className="name-input">
                    <label htmlFor="name">Name</label>
                    <input ref={name_ref} type="text" id="name" defaultValue={contact?.name}/>
                </div>
                <div className="email-input">
                    <label htmlFor="email">Email</label>
                    <input ref={email_ref} type="text" id="email" defaultValue={contact?.email}/>
                </div>
                <div className="phone-input">
                    <label htmlFor="phone">Phone</label>
                    <input ref={phone_ref} type="text" id="phone" defaultValue={contact?.phone}/>
                </div>
                <button onClick={submitHandler} className="add-contact-button">{page_title}</button>
            </div>
        </div>
    );
}