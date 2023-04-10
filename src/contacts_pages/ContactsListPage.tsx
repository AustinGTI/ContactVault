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
    // ? STATES AND CONSTANTS
    // initialize the hook functions in use in the component
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // initialize the state to hold the visibility of the delete modal
    const [show_modal, setShowModal] = useState<boolean>(false);

    // ? FUNCTIONS
    // the function to navigate to the edit contact page for this contact on click of the edit button
    const handleEdit = useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        // redirect to the edit contact page
        navigate(`/contacts/${contact.getId()}`);
    }, [contact, navigate]);

    // function to send the delete request to the server and refresh the contacts list on click of the delete button
    const deleteThisContact = useCallback(() => {
        // create a contactId object with the id of the contact to be deleted
        const contact_id = new ContactID();
        contact_id.setId(contact.getId());

        // send the delete request to the server
        deleteContact(`${localStorage.getItem('jwt_token')}`, contact_id, dispatch).then(() => {
            // on success, refresh the page by reloading the contacts, hiding the modal and displaying a success message
            getContacts(`${localStorage.getItem('jwt_token')}`, dispatch).then((contact_list) => {
                setContacts(contact_list.getContactsList());
                setShowModal(false);
                setMessage({message: 'Contact deleted successfully', type: MessageType.SUCCESS});
            }).catch((err) => {
                // if there is an error, exit the site and display the error message
                exitSite(navigate, dispatch, err.message, MessageType.ERROR);
            });
        }).catch((err) => {
            // if there is an error, exit the site and display the error message
            exitSite(navigate, dispatch, err.message, MessageType.ERROR);
        });
    }, [contact, navigate, dispatch, setContacts, setShowModal, setMessage]);

    // ? RENDER
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
                    <button className="edit-btn" onClick={handleEdit}>Edit</button>
                    {/*<IconButton title='Edit' icon={<EditIcon height={30}/>} onClick={handleEdit}/>*/}

                    {/* button to delete the contact */}
                    <button className="delete-btn" onClick={() => setShowModal(true)}>Delete</button>
                    {/*<IconButton title={'Delete'} icon={<DeleteIcon height={30}/>} onClick={() => setShowModal(true)}/>*/}
                </div>
            </div>
            {/* modal to confirm deletion, only visible if show modal is true */}
            {show_modal && <DeleteModal setShow={setShowModal} deleteFunction={deleteThisContact}/>}
        </>
    );
}


export default function ContactsListPage(): React.ReactElement {
    // ? STATES AND CONSTANTS
    // initialize the states to hold the contacts and the message
    const [contacts, setContacts] = React.useState<Contact[] | null>(null);
    const [message, setMessage] = useState<MessageObject | null>(null);
    // initialize the hook functions in use in the component
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // ? FUNCTIONS
    // function to redirect to the add contact page on click of the add contact button
    const addContactHandler = useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        navigate('/contacts/add');
    }, [navigate]);

    //? EFFECTS
    // retrieve the contacts from the server on mount and check for any messages in location state
    useEffect(() => {
        getContacts(`${localStorage.getItem('jwt_token')}`, dispatch).then((contact_list) => {
            // on success, set the contacts
            setContacts(contact_list.getContactsList());
        }).catch((err) => {
            // if there is an error, exit the site and display the error message
            exitSite(navigate, dispatch, err.message, MessageType.ERROR);
        });
        // check for any messages in location state, if there are any, set the message and remove the message from location state
        if (location.state) {
            setMessage(location.state.message_obj);
            navigate('/contacts', {});
        }
    }, [navigate, dispatch, location.state]);

    // ? RENDER
    // define the jsx to render in the contacts list div
    let contacts_box_jsx;
    // if the contacts are null, it means that the contacts are still being retrieved from the server, so display a loading message
    if (contacts === null) {
        contacts_box_jsx =
            <div className="no-contacts-box">
                <h1>Loading...</h1>
            </div>;
    }
    // if the contacts are not null and the contact list is empty, display a message indicating that there are no contacts
    else if (!contacts.length) {
        contacts_box_jsx =
            <div className="no-contacts-box">
                <h1>No Contacts Yet... :(</h1>
                <p>Use the 'Add Contact' button above to add some.</p>
            </div>;
    }
    // if there are contacts, display them as contact panes
    else {
        contacts_box_jsx =
            contacts.map((contact) => {
                return <ContactPane contact={contact} key={contact.getId()} setContacts={setContacts}
                                    setMessage={setMessage}/>
            });
    }


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
                <div className="contacts-list">{contacts_box_jsx}</div>
            </div>
        </>
    );
}