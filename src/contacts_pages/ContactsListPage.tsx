import React, {useCallback, useEffect} from "react";
import {ContactServiceClient} from "../protos/ContactsServiceClientPb";
import {Empty} from "../protos/contacts_pb";
import {Navigate, useNavigate} from "react-router-dom";

type Contact = { id: string, name: string, email: string, phone: string };
type ContactsList = Contact[];



// a component to display a single contact pane
function ContactPane({contact} : {contact : Contact}) : React.ReactElement {
    return (
        <div className="contact-pane">
            <h2>{contact.name}</h2>
            <p>{contact.email}</p>
            <p>{contact.phone}</p>
        </div>
    );
}


export default function ContactsListPage() : React.ReactElement {
    const [contacts, setContacts] = React.useState<ContactsList>([]);
    const navigate = useNavigate();

    // function to handle adding a new contact
    const addContactHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // redirect to the add contact page
        navigate('/contacts/add');
    }, [navigate]);

    // retrieve the contacts from the server on mount
    useEffect(() => {
        const client = new ContactServiceClient("http://localhost:8080");
        const request = new Empty();
        const jwt_token = localStorage.getItem('jwt_token');
        const metadata = jwt_token ? {authorization: jwt_token} : null;
        client.getContacts(request, metadata, (err, res) => {
            if (err) {
                console.error(err);
            } else {
                const contacts = res.getContactsList().map((contact) => {
                    return {
                        id: contact.getId(),
                        name: contact.getName(),
                        email: contact.getEmail(),
                        phone: contact.getPhone(),
                    };
                });
                setContacts(contacts);
                console.log('contacts set', contacts);
            }
        });
    }, []);
    return (
        <div className="contacts">
            <h1>Contacts</h1>
            {/* button to add a new contact */}
            <button className="add-contact-button" onClick={addContactHandler}>Add Contact</button>
            <div className="contacts-list">
                {contacts.length ? contacts.map((contact) => {
                    return <ContactPane contact={contact} key={contact.id}/>
                }) : <p>No contacts yet</p>}
            </div>
        </div>
    );
}