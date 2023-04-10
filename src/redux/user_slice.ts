import {createSlice} from "@reduxjs/toolkit";

// ReduxUser is a type that is used to store user information in the redux store
type UserState = {
    id: string | null,
    username: string | null,
}

// the user slice of the redux store with set and clear operations to manage user information
const user_slice = createSlice({
    name: 'user',
    initialState: {id: null,username : null} as UserState,
    reducers: {
        setUserRedux: (state, action: { payload: UserState }) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
        },
        clearUserRedux: (state) => {
            state.id = null;
            state.username = null;
        },
    }
});

// export the reducer and actions
export const userReducer = user_slice.reducer;
export const {setUserRedux, clearUserRedux} = user_slice.actions;