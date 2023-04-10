import React, {useCallback, useEffect, useRef, useState} from "react";
import {ReactComponent as Logo} from "../assets/leta-logo.svg";
import {ReactComponent as ProfileIcon} from "../assets/profile-icon.svg";
import {ReactComponent as DropdownIcon} from "../assets/dropdown-icon.svg";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import '../styles/header.scss';
import {ReactComponent as CancelIcon} from "../assets/cancel-icon.svg";
import {exitSite} from "./global_functions";

// region ENUMS AND TYPES

// an enum for the type of message
export const enum MessageType {
    SUCCESS = 'success',
    ERROR = 'error',
    // INFO = 'info'
}

// a type for a message object
export type MessageObject = {
    message: string,
    type: MessageType
}

// endregion

// region COMPONENTS

// a component for the header section of logged in pages
export function Header({title}: { title: string }): React.ReactElement {
    // ? CONSTANTS AND STATES
    // get the user from the redux store
    const user = useSelector((state: any) => state.user);
    // initialize the state for the visibility of the dropdown menu
    const [show_dropdown, setShowDropdown] = useState(false);
    // initialize the hook functions in use in the component
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ? FUNCTIONS
    // function to call the exit site function on click of the logout button
    const handleLogout = useCallback((_: React.MouseEvent<HTMLDivElement>) => {
        exitSite(navigate, dispatch, 'You have logged out successfully.', MessageType.SUCCESS);
    }, [navigate, dispatch]);

    // ? RENDER
    return (
        <div className="header-box">
            <div className="logo-box"><Logo height={100}/></div>
            <div className="title-box">{title}</div>
            <div className="profile-box">
                <ProfileIcon height={20}/>
                <div className="user-box">{user.username ?? 'User'}</div>
                <div className="dropdown-btn" onClick={() => setShowDropdown(!show_dropdown)}>
                    <DropdownIcon height={7}
                                  style={{transform: show_dropdown ? 'rotate(180deg) translateY(2px)' : ''}}/>
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
    // ? FUNCTIONS
    // function to call the delete function and close the modal on click of the delete button
    const handleDelete = useCallback((_: React.MouseEvent<HTMLButtonElement>) => {
        deleteFunction();
        setShow(false);
    }, [deleteFunction, setShow]);

    // ? RENDER
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
    // ? CONSTANTS AND STATES
    // initialize the state for the tracking the visibility of the message box and the timeout of the message box
    const [visible, setVisible] = useState<boolean>(false);
    const [messageTimeout, setMessageTimeout] = useState<NodeJS.Timeout | null>(null);
    // initialize a ref to track the previous message object so that the message will only be displayed the first time a new message is received
    const prev_message_obj = useRef<MessageObject | null>(null);

    // ? EFFECTS
    // a useEffect to set visible to true if there is a message with a 5s timer to set visible to false
    useEffect(() => {
            if (message_obj !== prev_message_obj.current) {
                setVisible(true);
                // clear the timeout if there is one to make sure timeouts don't stack
                if (messageTimeout) clearTimeout(messageTimeout as NodeJS.Timeout);
                setMessageTimeout(setTimeout(() => setVisible(false), 5000));
                prev_message_obj.current = message_obj;
            }
        },
        [message_obj, messageTimeout]);

    // ? RENDER
    // return an empty fragment if the message box is not visible
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

// endregion