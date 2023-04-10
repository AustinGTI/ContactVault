import React, {useCallback, useRef, useState} from "react";
import {Contact, ContactID} from "../protos/contacts_pb";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Header, MessageBox, MessageObject, MessageType} from "../globals/global_components";

import '../styles/contacts_view_page.scss';


// a component to display the contact view page which serves as both the add contact page and the edit contact page
export default function ContactViewPage({
                                            page_title,
                                            submitFunction,
                                        }: { page_title: string, submitFunction: (access_token: string, contact: Contact, dispatch: any) => Promise<Contact | ContactID>, contact?: Contact }): React.ReactElement {
    // ? STATES AND CONSTANTS
    // initialize the refs for the input fields
    const name_ref = useRef<HTMLInputElement>(null);
    const email_ref = useRef<HTMLInputElement>(null);
    const phone_ref = useRef<HTMLInputElement>(null);
    // initialize the message state holding the message to be displayed and type of message
    const [message, setMessage] = useState<MessageObject | null>(null);
    // initialize the hook functions in use in the component
    const nav = useNavigate();
    const dispatch = useDispatch();
    // check if an id is present in the params, if so then it is an edit page, get the contact from the store
    const id = useParams().id;
    const all_contacts = useSelector((state: any) => state.contacts);
    const contact = id ? all_contacts[id] : undefined;

    // ? FUNCTIONS
    // function to perform client side validation of the contact
    const contactValidation = useCallback((name: string, email: string, phone: string) : {valid: boolean, error: string | null} => {
        // check that the name is at least 3 characters long
        if (name.length < 3) {
            return {valid: false, error: 'Name must be at least 3 characters long'};
        }
        // check that this name does not already exist in the store and is not the name of the contact being edited
        if ((!contact || name !== contact.name) && Object.keys(all_contacts).some((key: string) => all_contacts[key].name === name)){
            return {valid: false, error: 'A contact with this name already exists'};
        }
        // check that the email follows a conventional email format
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return {valid: false, error: 'Invalid email'};
        }
        // check that the phone number follows a conventional phone number format
        // 10 digits if it starts with 0, 10 to 12 digits after the + if it starts with +
        if (!phone.match(/^(\+([0-9]{10,12}))|(0[0-9]{9})$/)) {
            return {valid: false, error: 'Invalid phone number'};
        }
        // if all the checks pass, return valid
        return {valid: true, error: null};
    }, [all_contacts, contact]);


    // function to make the submit request to the server (add or edit) on submit button click
    const submitHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // prevent the default action
        e.preventDefault();
        // get the values from the refs
        const name = name_ref.current?.value;
        const email = email_ref.current?.value;
        const phone = phone_ref.current?.value;
        // todo : perform some extra client side validation
        // if all the fields are filled
        if (name && email && phone) {
            // perform client side validation
            const {valid, error} = contactValidation(name, email, phone);
            // if the validation fails, set the error message and return
            if (!valid) {
                setMessage({message: error ?? 'An error occurred', type: MessageType.ERROR});
                return;
            }

            // otherwise, create a new contact object and set the values
            const contact = new Contact();
            contact.setName(name);
            contact.setEmail(email);
            contact.setPhone(phone);
            // if the id is present, the contact is being edited, set the id to identify the contact to be edited to the server
            if (id) contact.setId(id);

            // send the request to the server
            submitFunction(`${localStorage.getItem('jwt_token')}`, contact, dispatch).then((_) => {
                // if the response is successful, redirect to the contacts page with success message
                nav('/contacts', {state: {message_obj: {message: "Contact saved successfully", type: MessageType.SUCCESS}}});
                console.log('function called');
            }).catch((err) => {
                // otherwise, set an error message
                console.error(err);
                setMessage({message: "An error occurred. Kindly try again later", type: MessageType.ERROR});
            });
        }
        // if any of the fields are empty, prompt the user to fill all the fields
        else {
            setMessage({message: "Please fill all the fields", type: MessageType.ERROR});
        }
    }, [nav, submitFunction, dispatch, id, contactValidation]);


    // ? RENDER
    return (
        <>
            <Header title={''}/>
            <div className="contact-page">
                <div className="form contact-form">
                    <h1>{page_title}</h1>
                    <MessageBox message_obj={message}/>
                    <div className="input-box name-input">
                        <label htmlFor="name">Name</label>
                        <input ref={name_ref} type="text" id="name" defaultValue={contact?.name} max={30}/>
                    </div>
                    <div className="input-box email-input">
                        <label htmlFor="email">Email</label>
                        <input ref={email_ref} type="text" id="email" defaultValue={contact?.email} max={30}/>
                    </div>
                    <div className="input-box phone-input">
                        <label htmlFor="phone">Phone</label>
                        <input ref={phone_ref} type="text" id="phone" defaultValue={contact?.phone} max={30}/>
                    </div>
                    <div className="btn-box">
                        <button onClick={() => nav('/contacts')} className="cancel-button">Cancel</button>
                        <button onClick={submitHandler} className="add-contact-button">Save Contact</button>
                    </div>
                </div>
            </div>
        </>
    );
}