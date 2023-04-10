## Overview

The Leta Contacts App is a simple frontend web app that enables users to manage a list of contacts. The app is built using React with TypeScript, and it utilizes React Router for multipage functionality. The state management is handled using Redux Toolkit and Redux Persist to maintain contact and user session state. JWT tokens are managed through localStorage, and the client-server communication is implemented using gRPC-Web, with the server hosted on GitHub at '[GitHub - Leta-io/grpc-contacts-server](https://github.com/Leta-io/grpc-contacts-server)'.

# Pages

## 1. Login Page `/login`

### Usage

To use the login page, enter the default username and password ('admin' and 'admin') into the login form and click the Login button.

### Functionality

* The login page is a single component that renders a form with two inputs for the username and password, and a login button. The `useRef` hook is used to keep track of the username and password entered by the user. When the login button is clicked, a client server function is called with the username and password. 

* If the promise is resolved, the JWT tokens are stored in local storage and the user details are stored in a Redux store. The user is then navigated to the contacts list page. If the login is unsuccessful, an error message is displayed to the user.



## 2. Contacts List Page `/contacts`

### Usage

The contacts list page or dashboard is at the relative url `/contacts`.To access the contact list page, the user must be logged in. After logging in, they will be redirected to this page. The contact list will be displayed with the details of each contact shown in a separate pane.

### Functionality

- The contact list page displays a list of contact panes. Each pane shows the details of a single contact, including their name, phone number and email address.
- The page has an "Add Contact" button that redirects the user to the Add Contacts page.
- The header of the page displays the username of the logged-in user and has a dropdown button that allows the user to log out.
- Each contact pane has an "Edit" button that opens the edit contact page and a "Delete" button that activates a modal prompt for a deletion confirmation.
- On mount, the page pulls the current list of contacts from the server using the token from the login page as an authorization. The contacts are then synchronized to the redux store and passed to the contact pane component for rendering.
- Deleting a contact makes a delete request to the server, refreshes the contact list, and updates the redux store.
- Logging out clears the localStorage of the access and refresh token, clears the redux store of user and contact details, and navigates back to the login page.

## 3. Add Contact Page `/contacts/add`

### Usage

To add a new contact to the list, navigate to the Contacts List page and click the "Add Contact" button. This will redirect you to the Add Contact page.

On the Add Contact page, fill in the contact's name, email, and phone number. Click the "Save Contact" button to save the contact to the list. If you wish to cancel the action, click the "Cancel" button to return to the Contacts List page.

### Functionality

* The Add Contact page renders a form component with inputs for name, email, and phone number. The inputs are linked to useRef hooks for easy access to their values. Validation is performed to ensure that the name is unique and that the email and phone number values are valid.

* When the "Save Contact" button is clicked, a request is made to the server to add the contact to the list using the jwt_token as a header for authorization. If the request is resolved, the redux store is updated with the new contact details and the page redirects back to the Contacts List page. A success message is then displayed at the top of the list, and the new contact is visible in the list.

## 4. Edit Contact Page `/contacts/:id`

### Usage

To access the Edit Contact page, click on the edit button for the contact you wish to edit on the Contact List page. This will take you to the Edit Contact page, which displays a pre-populated form with the contact's current details.

Fill in any fields that you wish to update and click the "Save Contact" button to save the changes. You can also click the "Cancel" button to return to the Contact List page without saving any changes.

### Functionality

* The Edit Contact page works similarly to the Add Contact page, but with pre-populated form fields based on the contact being edited.

* When the "Save Contact" button is clicked, validation is carried out to make sure that the phone value is a valid phone, email is valid email, and the name is unique among the other contacts in the list. If the validation passes, an update request is made to the server with the jwt_token as header to update the contact's details, and the redux store is updated on resolve.

* After the update is successful, the page navigates back to the Contact List page, where a success message is displayed at the top of the list.
