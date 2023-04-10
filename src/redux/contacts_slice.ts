import {createSlice} from "@reduxjs/toolkit";
import {Contact} from "../protos/contacts_pb";

// ReduxContact is a type that is used to store contacts in the redux store
type ReduxContact = {
    id: string,
    name: string,
    email: string,
    phone: string,
}

// ContactsState is an object that maps contact ID strings to ReduxContact objects
type ContactsState = {
    [id: string]: ReduxContact
}


// function to convert a Contact Object to a ReduxContact Object
export function contactToReduxContact(contact: Contact): ReduxContact {
    return {
        id: contact.getId(),
        name: contact.getName(),
        email: contact.getEmail(),
        phone: contact.getPhone(),
    }
}


// the contacts slice of the redux store with CRUD operations to manage contacts
const contacts_slice = createSlice({
    name: 'contacts',
    initialState: {} as ContactsState,
    reducers: {
        addContactRedux: (state, action: { payload: ReduxContact }) => {
            state[action.payload.id] = action.payload;
        },
        updateContactRedux: (state, action: { payload: ReduxContact }) => {
            state[action.payload.id] = action.payload;
        },
        deleteContactRedux: (state, action: { payload: string }) => {
            delete state[action.payload];
        },
        syncContactsRedux: (state, action: { payload: ReduxContact[] }) => {
            // delete all contacts from the slice
            Object.keys(state).forEach((key) => {
                delete state[key];
            });
            // add all contacts from the list
            action.payload.forEach((contact) => {
                state[contact.id] = contact;
            });
        },
        clearContactsRedux: (state) => {
            Object.keys(state).forEach((key) => {
                delete state[key];
            });
        }
    }
});


// export the contacts slice reducer and the actions
export const contactsReducer = contacts_slice.reducer;
export const {addContactRedux, updateContactRedux, deleteContactRedux, syncContactsRedux, clearContactsRedux} = contacts_slice.actions;
