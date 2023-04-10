import React, {useCallback, useEffect, useReducer, useRef, useState} from "react";
import {LoginResponse} from "../protos/auth_pb";
import {RpcError} from "grpc-web";
import {login} from "../globals/client_functions";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import '../styles/global_styles.scss'
import '../styles/login_page.scss'
import {ReactComponent as Logo} from "../assets/leta-logo.svg";
import {MessageBox, MessageObject, MessageType} from "../globals/global_components";

// the login page
export default function LoginPage() {
    // ? constants and states
    // the refs for the username and password inputs
    const username_ref = useRef<HTMLInputElement>(null);
    const password_ref = useRef<HTMLInputElement>(null);
    // the current message to display
    const [message, setMessage] = useState<MessageObject | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // ? functions
    // the function to handle the submit button
    const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // prevent the default action
        e.preventDefault();
        // get the username and password from the refs
        const username = username_ref.current?.value;
        const password = password_ref.current?.value;
        // if the username and password are present
        if (username && password) {
            // send the username and password to the server using web gRPC
            login(username, password, dispatch).then((res: LoginResponse) => {
                // if the response is successful, redirect to the contacts page with success message
                navigate('/contacts', {state: {message: "Login successful"}});
            }).catch((err: RpcError) => {
                // otherwise, set the error message
                console.error(err);
                setMessage({type: MessageType.ERROR, message: err.message});
            });
        } else {
            setMessage({type: MessageType.ERROR, message: "Please enter both a username and password"});
        }
    }, [username_ref, password_ref]);

    // ? effects
    // onmount check if there is a message in the location state and set it to the message state if so
    useEffect(() => {
        if (location.state) {
            setMessage(location.state.message_obj);
            // clear the location state
            navigate('/login', {});
        }
    }, [location.state]);

    // ? render
    return (
        <div className="login-page">
            <div className='logo'>
                <Logo height={100}/>
            </div>
            <div className="form login-form">
                <h1>Login To Leta Contacts Site.</h1>
                <MessageBox message_obj={message} />
                <div className={'input-box username-input'}>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" ref={username_ref} required/>
                </div>
                <div className={'input-box password-input'}>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" ref={password_ref} required/>
                </div>
                <div className={'submit-btn'}>
                    <button onClick={handleSubmit}>Log In</button>
                </div>
            </div>
        </div>
    );
}