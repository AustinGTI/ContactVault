import React from "react";
import '../styles/status_code_error_page.scss';

// a set of common error status codes and their corresponding messages
const STATUS_CODE_MESSAGES : {[code: number] : string} = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Page Not Found",
    500: "Internal Server Error",
}


// a component to display a status code error page given the status code
export default function StatusCodeErrorPage({status_code} : {status_code:number}) : React.ReactElement {
    // ? CONSTANTS AND STATES
    // if the status code is not in the status code messages, set it to 500
    if (!(status_code in STATUS_CODE_MESSAGES)) {
        status_code = 500;
    }
    // ? RENDER
    // return the jsx to render
    return (
        <div className="status-code-error-page">
            <h1>{status_code}</h1>
            <p>{STATUS_CODE_MESSAGES[status_code]}</p>
        </div>
    );


}