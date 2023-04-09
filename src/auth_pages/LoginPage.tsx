import React, {useCallback, useReducer, useRef} from "react";
import {AuthServiceClient} from "../protos/AuthServiceClientPb";
import {LoginRequest,LoginResponse} from "../protos/auth_pb";
import {RpcError} from "grpc-web";

export default function LoginPage() {
    // ? constants and states
    // the refs for the username and password inputs
    const username_ref = useRef<HTMLInputElement>(null);
    const password_ref = useRef<HTMLInputElement>(null);
    // the current error message
    const [error, setError] = useReducer((_ : string | null, newError : string | null) => {
        // if the error is null, return null
        if (newError === null) return null;
        // otherwise, return the error and clear it after 5 seconds
        setTimeout(() => setError(null), 5000);
        return newError;
    }, null)

    // ? functions
    // the function to handle the submit button
    const handleSubmit = useCallback((e:React.MouseEvent<HTMLButtonElement>) => {
        // prevent the default action
        e.preventDefault();
        // get the username and password from the refs
        const username = username_ref.current?.value;
        const password = password_ref.current?.value;
        // if the username and password are present
        if (username && password) {
            // send the username and password to the server using web gRPC
            const client = new AuthServiceClient("http://localhost:8080");
            const request = new LoginRequest();
            request.setUsername(username);
            request.setPassword(password);
            client.login(request, {}, (err: RpcError, res: LoginResponse) => {
                if (err) {
                    console.error(err);
                    setError(err.message);
                } else {
                    // the possible response status codes
                    enum LoginStatus { SUCCESS = 200, INVALID_CREDENTIALS = 401}
                    console.log(res);
                    // check if the login was successful
                    if (res.getStatus() === LoginStatus.SUCCESS) {
                        // store the jwt token and refresh token in local storage
                        localStorage.setItem('jwt_token', res.getJwttoken());
                        localStorage.setItem('refresh_token', res.getRefreshtoken());
                        // redirect to the contacts page
                        window.location.href = '/contacts';
                    }
                    else if (res.getStatus() === LoginStatus.INVALID_CREDENTIALS) {
                        setError(res.getError());
                    }
                    else {
                        setError("Unknown error");
                    }
                }
            });
        }
        else{
            setError("Please enter both a username and password");
        }
    }, [username_ref, password_ref]);

    // ? render
    return (
        <div className="login">
            <h1>Login</h1>
            {error && <p className="error-txt">{error}</p>}
            <div className={'username-input'}>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" ref={username_ref}/>
            </div>
            <div className={'password-input'}>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" ref={password_ref}/>
            </div>
            <div className={'submit-btn'}>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}