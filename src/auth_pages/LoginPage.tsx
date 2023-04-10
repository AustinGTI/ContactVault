import React, {useCallback, useEffect, useRef, useState} from "react";
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
    // ? CONSTANTS AND STATES
    // initialize the refs for the username and password inputs
    const username_ref = useRef<HTMLInputElement>(null);
    const password_ref = useRef<HTMLInputElement>(null);
    // initialize the message object that holds the message to be displayed and its type
    const [message, setMessage] = useState<MessageObject | null>(null);
    // initialize hook functions in use in the component
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    // ? FUNCTIONS
    // function to perform basic client side validation of the login request
    const loginRequestValidation = useCallback((username: string, password: string) : {valid: boolean, error: string | null} => {
        // confirm that the username is at least 3 characters long
        if (username.length < 3) {
            return {valid: false, error: 'Username must be at least 3 characters long'};
        }
        // confirm that the password is at least 3 characters long
        if (password.length < 3) {
            return {valid: false, error: 'Password must be at least 3 characters long'};
        }
        // if all the checks pass, return valid
        return {valid: true, error: null};
    }, []);


    // the function to send the login request to the server
    const handleSubmit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        // prevent the default action
        e.preventDefault();
        // get the username and password from the refs
        const username = username_ref.current?.value;
        const password = password_ref.current?.value;

        // check that both the username and password are not empty
        if (username && password) {
            // perform client side validation
            const {valid, error} = loginRequestValidation(username, password);

            // if the validation is not valid, set the error message to the message state
            if (!valid) {
                setMessage({type: MessageType.ERROR, message: error ?? 'An error occurred'});
                return;
            }
            // otherwise, send the login request using the client function for login
            login(username, password, dispatch).then((_: LoginResponse) => {
                // if the response is successful, redirect to the contacts page with message of type success
                navigate('/contacts', {
                    state: {
                        message_obj: {
                            type: MessageType.SUCCESS,
                            message: "Login successful. Welcome back!"
                        }
                    }
                });
            }).catch((err: RpcError) => {
                // otherwise, set the error message to the message state
                setMessage({type: MessageType.ERROR, message: err.message});
            });
        }
        // if the username or password is empty, set an error message to the message state
        else {
            setMessage({type: MessageType.ERROR, message: "Please enter both a username and password"});
        }
    }, [username_ref, password_ref, loginRequestValidation, navigate, dispatch]);

    // ? EFFECTS
    // on mount check if there is a message in the location state and set it to the message state if so
    useEffect(() => {
        if (location.state) {
            setMessage(location.state.message_obj);
            // clear the location state after setting the message state
            navigate('/login', {});
        }
    }, [location.state,navigate]);

    // ? RENDER
    return (
        <div className="login-page">
            <div className="logo">
                <Logo height={100}/>
            </div>
            <div className="form login-form">
                <h1>Login To Leta Contacts Site.</h1>
                <MessageBox message_obj={message}/>
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