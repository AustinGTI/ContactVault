import React, {useCallback, useEffect, useState} from "react";
import {ReactComponent as Logo} from "../assets/leta-logo.svg";
import {ReactComponent as ProfileIcon} from "../assets/profile-icon.svg";
import {ReactComponent as DropdownIcon} from "../assets/dropdown-icon.svg";
import {useSelector} from "react-redux";
import {logout} from "./client_functions";
import {useNavigate} from "react-router-dom";
import '../styles/header.scss';
import {ReactComponent as CancelIcon} from "../assets/cancel-icon.svg";
import {exitSite} from "./global_functions";

// an enum for the type of message
export const enum MessageType {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info'
}
// a type for a message object
export type MessageObject = {
    message: string,
    type: MessageType
}

// a component for the header section of logged in pages
export function Header({title}: { title: string }): React.ReactElement {
    // get the user from the redux store
    const user = useSelector((state: any) => state.user);
    console.log(user);
    const [show_dropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    // function to handle the logout button
    const handleLogout = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        exitSite(navigate, 'You have logged out successfully.', MessageType.SUCCESS);
    }, [navigate]);
    return (
        <div className="header-box">
            <div className="logo-box"><Logo height={100}/></div>
            <div className="title-box">{title}</div>
            <div className="profile-box">
                <ProfileIcon height={20}/>
                <div className="user-box">{user.username ?? 'User'}</div>
                <div className="dropdown-btn" onClick={() => setShowDropdown(!show_dropdown)}>
                    <DropdownIcon height={7} style={{transform: show_dropdown ? 'rotate(180deg) translateY(2px)' : ''}}/>
                </div>
                {show_dropdown &&
                    <div className="dropdown-box">
                        <div className="logout-btn" onClick={handleLogout}>Logout</div>
                    </div>
                }
            </div>
        </div>
    );
}


// a modal component to confirm deletion
export function DeleteModal({
                                setShow,
                                deleteFunction
                            }: { setShow: (state: boolean) => void, deleteFunction: () => void }): React.ReactElement {
    // function to handle the deletion of a contact
    const handleDelete = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // call the delete function
        deleteFunction();
        // close the modal
        setShow(false);
    }, [deleteFunction, setShow]);
    return (
        <div className={'modal delete-modal'}>
            <div className="form modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this contact?</p>
                <div className="modal-buttons">
                    <button onClick={() => setShow(false)}>Cancel</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
}


// a component to display a message box and a button for closing the message box
export function MessageBox({message_obj}: { message_obj: MessageObject | null }): React.ReactElement {
    const [visible, setVisible] = useState<boolean>(false);
    const [messageTimeout, setMessageTimeout] = useState<NodeJS.Timeout | null>(null);
    // a useEffect to set visible to true if there is a message with a 5s timer to set visible to false
    useEffect(() => {
        if (message_obj) {
            setVisible(true);
            // clear the timeout if there is one to make sure timeouts don't stack
            if (messageTimeout) clearTimeout(messageTimeout as NodeJS.Timeout);
            setMessageTimeout(setTimeout(() => setVisible(false), 5000));
        }
    }, [message_obj]);
    if (!visible) return <></>;
    return (
        <div className={`message-box ${message_obj?.type}`}>
            <div className="message">{message_obj?.message}</div>
            <div className="close-btn" onClick={() => setVisible(false)}>
                <CancelIcon height={12}/>
            </div>
        </div>
    );


}