import React, {useCallback, useState} from "react";
import Logo from "../assets/Logo";
import {useSelector} from "react-redux";
import '../styles/header.scss';
import {logout} from "./client_functions";
import {useNavigate} from "react-router-dom";


// a component for the header section of logged in pages
export function Header({title} : {title: string}): React.ReactElement {
    // get the user from the redux store
    const user = useSelector((state: any) => state.user);
    console.log(user);
    const [show_dropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    // function to handle the logout button
    const handleLogout = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        logout().then(() => {
            navigate('/login', {state: {success: "Logout successful"}});
        }).catch((err: Error) => {
            console.error(err);
        });
    }, [navigate]);
    return (
        <div className="header-box">
            <div className="logo-box"><Logo height={100}/></div>
            <div className="title-box">{title}</div>
            <div className="profile-box">
                {/*todo : maybe add a user icon here*/}
                <div className="user-box">{user.username ?? 'User'}</div>
                <div className="dropdown-btn" onClick={()=>setShowDropdown(!show_dropdown)}>%</div>
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