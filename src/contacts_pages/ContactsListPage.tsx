import React, {useCallback, useEffect, useState} from "react";
import {Contact, ContactID} from "../protos/contacts_pb";
import {useLocation, useNavigate} from "react-router-dom";
import {deleteContact, getContacts} from "../globals/client_functions";
import {useDispatch} from "react-redux";
import {DeleteModal, Header, MessageBox, MessageObject, MessageType} from "../globals/global_components";
import '../styles/contacts_list_page.scss';
import {exitSite} from "../globals/global_functions";


// a component to display a single contact pane
function ContactPane({
                         contact,
                         setContacts,
                         setMessage
                     }: { contact: Contact, setContacts: (contacts: Contact[]) => void, setMessage: (message: MessageObject) => void }): React.ReactElement {
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
                setMessage({message: 'Contact deleted successfully', type: MessageType.SUCCESS});
            }).catch((err) => {
                // if there is an error, redirect to the login page
                exitSite(navigate, 'There has been an error. Kindly try again later', MessageType.ERROR);
            });
        }).catch((err) => {
            // if there is an error, redirect to the login page
            exitSite(navigate, 'There has been an error. Kindly try again later', MessageType.ERROR);
        });
    }, [contact, navigate, dispatch, setContacts, setShowModal]);
    return (
        <>
            <div className="contact-pane">
                <div className="top-box">
                    <h2>{contact.getName()}</h2>
                    <p>{contact.getPhone()}</p>
                </div>
                <div className="bottom-box">
                    <p>{contact.getEmail()}</p>
                    {/* button to edit the contact */}
                    <button onClick={handleEdit}>Edit</button>
                    {/* button to delete the contact */}
                    <button onClick={() => setShowModal(true)}>Delete</button>
                </div>
            </div>
            {/* modal to confirm deletion */}
            {show_modal && <DeleteModal setShow={setShowModal} deleteFunction={deleteCurrContact}/>}
        </>
    );
}


export default function ContactsListPage(): React.ReactElement {
    const [contacts, setContacts] = React.useState<Contact[]>([]);
    const [message, setMessage] = useState<MessageObject | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // function to handle adding a new contact
    const addContactHandler = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // redirect to the add contact page
        navigate('/contacts/add');
    }, [navigate]);

    // retrieve the contacts from the server on mount and check for any messages in location state
    useEffect(() => {
        // presence of the jwt token is checked in the Auth component
        getContacts(`${localStorage.getItem('jwt_token')}`, dispatch).then((contact_list) => {
            setContacts(contact_list.getContactsList());
        }).catch((err) => {
            // if there is an error, exit the site and display the error message
            exitSite(navigate, err.message, MessageType.ERROR);
        });
        // check for any messages in location state
        if (location.state) {
            // set the message
            setMessage(location.state.message_obj);
            // remove the message from location state
            navigate('/contacts', {});
        }
    }, [navigate, dispatch, location.state]);

    return (
        <>
            <Header title="All Contacts"/>
            <div className="contacts">
                {/* button to add a new contact */}
                <div className="btn-box">
                    <button className="add-contact-btn" onClick={addContactHandler}>
                        Add Contact
                    </button>
                    <MessageBox message_obj={message}/>
                </div>
                <div className="contacts-list">
                    {contacts.length ? contacts.map((contact) => {
                        return <ContactPane contact={contact} key={contact.getId()} setContacts={setContacts} setMessage={setMessage}/>
                    }) : <p>No contacts yet</p>}
                </div>
            </div>
        </>
    );
}