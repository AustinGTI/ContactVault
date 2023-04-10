import {logout} from "./client_functions";
import {NavigateFunction} from "react-router-dom";
import {MessageObject, MessageType} from "./global_components";

// a function for logging out of the site and returning to the login page and flashing a message
export function exitSite(navigator: NavigateFunction ,message?: string, message_type?: MessageType) {
    const message_obj: MessageObject | undefined = (message && message_type) ? {message, type: message_type} : undefined;
    logout().then(() => {
        navigator('/login', message_obj ? {state: {message_obj}} : {});
    });
}