import React, {useCallback, useRef, useState} from "react";
import {Contact, ContactID} from "../protos/contacts_pb";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {Header, MessageBox, MessageObject, MessageType} from "../globals/global_components";

import '../styles/contacts_view_page.scss';


export default function ContactViewPage({
                                            page_title,
                                            submitFunction,
                                        }: { page_title: string, submitFunction: (access_token: string, contact: Contact, dispatch: any) => Promise<Contact | ContactID>, contact?: Contact }): React.ReactElement {
    const nav = useNavigate();
    const dispatch = useDispatch();
    // refs to the input elements
    const name_ref = useRef<HTMLInputElement>(null);
    const email_ref = useRef<HTMLInputElement>(null);
    const phone_ref = useRef<HTMLInputElement>(null);
    // todo: create a custom hook to handle the error message
    // the message
    const [message, setMessage] = useState<MessageObject | null>(null);
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
                nav('/contacts', {state: {message_obj: {message: "Contact saved successfully", type: MessageType.SUCCESS}}});
                console.log('function called');
            }).catch((err) => {
                // otherwise, set the error message
                console.error(err);
                setMessage({message: "An error occurred. Kindly try again later", type: MessageType.ERROR});
            });
        }
        // otherwise, set the error message
        else {
            setMessage({message: "Please fill all the fields", type: MessageType.ERROR});
        }
    }, [nav, submitFunction, dispatch]);


    return (
        <>
            <Header title={''}/>
            <div className="contact-page">
                <div className="form contact-form">
                    <h1>{page_title}</h1>
                    <MessageBox message_obj={message}/>
                    <div className="input-box name-input">
                        <label htmlFor="name">Name</label>
                        <input ref={name_ref} type="text" id="name" defaultValue={contact?.name}/>
                    </div>
                    <div className="input-box email-input">
                        <label htmlFor="email">Email</label>
                        <input ref={email_ref} type="text" id="email" defaultValue={contact?.email}/>
                    </div>
                    <div className="input-box phone-input">
                        <label htmlFor="phone">Phone</label>
                        <input ref={phone_ref} type="text" id="phone" defaultValue={contact?.phone}/>
                    </div>
                    <div className="btn-box">
                        <button onClick={() => nav('/contacts')} className="cancel-button">Cancel</button>
                        <button onClick={submitHandler} className="add-contact-button">{page_title}</button>
                    </div>
                </div>
            </div>
        </>
    );
}