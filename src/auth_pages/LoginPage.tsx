import React, {useCallback, useReducer, useRef} from "react";
import {AuthServiceClient} from "../protos/AuthServiceClientPb";
import {LoginRequest, LoginResponse} from "../protos/auth_pb";
import {RpcError} from "grpc-web";
import {login} from "../globals/client_functions";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import '../styles/global_styles.scss'
import '../styles/login_page.scss'
import Logo from "../assets/Logo";
import {Header} from "../globals/global_components";

export default function LoginPage() {
    // ? constants and states
    // the refs for the username and password inputs
    const username_ref = useRef<HTMLInputElement>(null);
    const password_ref = useRef<HTMLInputElement>(null);
    // the current error message
    const [error, setError] = useReducer((_: string | null, newError: string | null) => {
        // if the error is null, return null
        if (newError === null) return null;
        // otherwise, return the error and clear it after 5 seconds
        setTimeout(() => setError(null), 5000);
        return newError;
    }, null)
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                navigate('/contacts', {state: {success: "Login successful"}});
            }).catch((err: RpcError) => {
                // otherwise, set the error message
                console.error(err);
                setError(err.message);
            });
        } else {
            setError("Please enter both a username and password");
        }
    }, [username_ref, password_ref]);

    // ? render
    return (
        <div className="login-page">
            <div className='logo'>
                <Logo height={100}/>
            </div>
            <div className="login-form">
                <h1>Login To Leta Contacts Site.</h1>
                <div className='error-box'>
                   <p>{error}</p>
                </div>
                <div className={'username-input'}>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" ref={username_ref} required/>
                </div>
                <div className={'password-input'}>
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