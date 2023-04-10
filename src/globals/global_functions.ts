import {logout} from "./client_functions";
import {NavigateFunction} from "react-router-dom";
import {MessageObject, MessageType} from "./global_components";

// a function for logging out of the site and returning to the login page and flashing a message if provided.
export function exitSite(navigator: NavigateFunction,dispatch: any ,message?: string, message_type?: MessageType) {
    // if a message is provided, create a message object
    const message_obj: MessageObject | undefined = (message && message_type) ? {message, type: message_type} : undefined;
    // call the logout function and then navigate to the login page on resolve
    logout(dispatch).then(() => {
        navigator('/login', message_obj ? {state: {message_obj}} : {});
    });
}