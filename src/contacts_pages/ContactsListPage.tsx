import React, {useCallback, useEffect} from "react";
import {ContactServiceClient} from "../protos/ContactsServiceClientPb";
import {Contact, ContactID, ContactList, Empty} from "../protos/contacts_pb";
import {Navigate, useNavigate} from "react-router-dom";
import {deleteContact, getContacts} from "../globals/client_functions";


// a component to display a single contact pane
function ContactPane({contact}: { contact: Contact }): React.ReactElement {
    const navigate = useNavigate();
    // function to handle the edit contact button
    const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // redirect to the edit contact page
        navigate(`/contacts/${contact.getId()}`);
    }, [contact, navigate]);

    // function to handle the delete contact button
    const handleDelete = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        //
        console.log('delete');
    }, []);

    // function to handle the deletion of a contact
    const deleteCurrContact = useCallback(() => {
        // create a contactId object
        const contact_id = new ContactID();
        contact_id.setId(contact.getId());
        deleteContact(`${localStorage.getItem('jwt_token')}`, contact_id).then(() => {
            // refresh the page
            navigate('/contacts');
        }).catch((err) => {
            // if there is an error, redirect to the login page
            navigate('/login');
            console.log(err);
        });
    }, [contact, navigate]);
    return (
        <>
            <div className="contact-pane">
                <h2>{contact.getName()}</h2>
                <p>{contact.getEmail()}</p>
                <p>{contact.getPhone()}</p>
                {/* button to edit the contact */}
                <button onClick={handleEdit}>Edit</button>
                {/* button to delete the contact */}
                <button>Delete</button>
            </div>
            {/* modal to confirm deletion */}
        </>
    );
}


export default function ContactsListPage(): React.ReactElement {
    const [contacts, setContacts] = React.useState<Contact[]>([]);
    const navigate = useNavigate();

    // function to handle adding a new contact
    const addContactHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // redirect to the add contact page
        navigate('/contacts/add');
    }, [navigate]);

    // retrieve the contacts from the server on mount
    useEffect(() => {
        // presence of the jwt token is checked in the Auth component
        getContacts(`${localStorage.getItem('jwt_token')}`).then((contact_list) => {
            setContacts(contact_list.getContactsList());
        }).catch((err) => {
            // if there is an error, redirect to the login page
            navigate('/login');
            console.log(err);
        });
    }, [navigate]);

    return (
        <div className="contacts">
            <h1>Contacts</h1>
            {/* button to add a new contact */}
            <button className="add-contact-button" onClick={addContactHandler}>Add Contact</button>
            <div className="contacts-list">
                {contacts.length ? contacts.map((contact) => {
                    return <ContactPane contact={contact} key={contact.getId()}/>
                }) : <p>No contacts yet</p>}
            </div>
        </div>
    );
}