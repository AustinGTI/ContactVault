import {createSlice} from "@reduxjs/toolkit";
import {Contact} from "../protos/contacts_pb";

type ContactsState = {
    [id: string]: Contact
}

// the contacts slice of the redux store
const contacts_slice = createSlice({
    name: 'contacts',
    initialState: {} as ContactsState,
    reducers: {
        addContactRedux: (state, action: { payload: Contact }) => {
            state[action.payload.getId()] = action.payload;
        },
        updateContactRedux: (state, action: { payload: Contact }) => {
            state[action.payload.getId()] = action.payload;
        },
        deleteContactRedux: (state, action: { payload: string }) => {
            delete state[action.payload];
        },
        syncContactsRedux: (state, action: { payload: Contact[] }) => {
            // delete all contacts from the slice
            Object.keys(state).forEach((key) => {
                delete state[key];
            });
            // add all contacts from the list
            action.payload.forEach((contact) => {
                state[contact.getId()] = contact;
            });
        },
        clearContactsRedux: (state) => {
            Object.keys(state).forEach((key) => {
                delete state[key];
            });
        }
    }
});


export const contactsReducer = contacts_slice.reducer;
export const {addContactRedux, updateContactRedux, deleteContactRedux, syncContactsRedux, clearContactsRedux} = contacts_slice.actions;
