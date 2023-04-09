import {createSlice} from "@reduxjs/toolkit";

type UserState = {
    id: string | null,
    username: string | null,
}

// the user slice of the redux store
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

export const userReducer = user_slice.reducer;
export const {setUserRedux, clearUserRedux} = user_slice.actions;