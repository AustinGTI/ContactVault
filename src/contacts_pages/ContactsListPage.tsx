import React, {useCallback, useEffect, useState} from "react";
import {ContactServiceClient} from "../protos/ContactsServiceClientPb";
import {Contact, ContactID, ContactList, Empty} from "../protos/contacts_pb";
import {useNavigate} from "react-router-dom";
import {deleteContact, getContacts} from "../globals/client_functions";
import {useDispatch} from "react-redux";
import {DeleteModal} from "../globals/global_components";


// a component to display a single contact pane
function ContactPane({contact, setContacts}: { contact: Contact, setContacts: (contacts: Contact[]) => void }): React.ReactElement {
    // constants
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [show_modal, setShowModal] = useState<boolean>(false);

    // function to handle the edit contact button
    const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // redirect to the edit contact page
        navigate(`/contacts/${contact.getId()}`);
    }, [contact, navigate]);

    // function to handle the deletion of a contact
    const deleteCurrContact = useCallback(() => {
        // create a contactId object
        const contact_id = new ContactID();
        contact_id.setId(contact.getId());
        deleteContact(`${localStorage.getItem('jwt_token')}`, contact_id, dispatch).then(() => {
            // refresh the page by reloading the contacts
            getContacts(`${localStorage.getItem('jwt_token')}`, dispatch).then((contact_list) => {
                // set the contacts
                setContacts(contact_list.getContactsList());
                // hide the modal
                setShowModal(false);
            }).catch((err) => {
                // if there is an error, redirect to the login page
                navigate('/login');
                console.log(err);
            });
        }).catch((err) => {
            // if there is an error, redirect to the login page
            navigate('/login');
            console.log(err);
        });
    }, [contact, navigate, dispatch, setContacts, setShowModal]);
    return (
        <>
            <div className="contact-pane">
                <h2>{contact.getName()}</h2>
                <p>{contact.getEmail()}</p>
                <p>{contact.getPhone()}</p>
                {/* button to edit the contact */}
                <button onClick={handleEdit}>Edit</button>
                {/* button to delete the contact */}
                <button onClick={() => setShowModal(true)}>Delete</button>
            </div>
            {/* modal to confirm deletion */}
            {show_modal && <DeleteModal setShow={setShowModal} deleteFunction={deleteCurrContact}/>}
        </>
    );
}


export default function ContactsListPage(): React.ReactElement {
    const [contacts, setContacts] = React.useState<Contact[]>([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // function to handle adding a new contact
    const addContactHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // redirect to the add contact page
        navigate('/contacts/add');
    }, [navigate]);

    // retrieve the contacts from the server on mount
    useEffect(() => {
        // presence of the jwt token is checked in the Auth component
        getContacts(`${localStorage.getItem('jwt_token')}`,dispatch).then((contact_list) => {
            setContacts(contact_list.getContactsList());
        }).catch((err) => {
            // if there is an error, redirect to the login page
            navigate('/login');
            console.log(err);
        });
    }, [navigate, dispatch]);

    return (
        <div className="contacts">
            <h1>Contacts</h1>
            {/* button to add a new contact */}
            <button className="add-contact-button" onClick={addContactHandler}>Add Contact</button>
            <div className="contacts-list">
                {contacts.length ? contacts.map((contact) => {
                    return <ContactPane contact={contact} key={contact.getId()} setContacts={setContacts}/>
                }) : <p>No contacts yet</p>}
            </div>
        </div>
    );
}