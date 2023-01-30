import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false,
        },
        register: {
            isFetching: false,
            error: false,
            currentUser: null,
        },
        update: {
            currentUser: null,
            isFetching: false,
            error: false,
        },
        rememberAccount: {
            username: null,
            password: null,
        },
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state, action) => {
            state.login.isFetching = false;
            state.login.error = action.payload;
        },

        // Register
        registerStart: (state) => {
            state.register.isFetching = true;
        },
        registerSuccess: (state, action) => {
            state.register.isFetching = false;
            state.register.error = false;
            state.register.currentUser = action.payload;
        },
        registerFailed: (state, action) => {
            state.register.isFetching = false;
            state.register.error = action.payload;
        },
        // Logout
        logOutStart: (state) => {
            state.login.isFetching = true;
        },
        logOutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentUser = null;
            state.update.currentUser = null;
            state.login.error = false;
            // localStorage.removeItem('persist:root');
        },
        logOutFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        updatedStart: (state) => {
            state.update.isFetching = true;
        },
        updatedUser: (state, action) => {
            state.update.isFetching = false;
            state.update.currentUser = action.payload;
            state.update.error = false;
        },
        rememberAccount: (state, action) => {
            console.log(action.payload);
            state.rememberAccount.username = action.payload
                ? action.payload[0]
                : null;
            state.rememberAccount.password = action.payload
                ? action.payload[1]
                : null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailed,
    registerStart,
    registerSuccess,
    registerFailed,
    logOutStart,
    logOutSuccess,
    logOutFailed,
    updatedStart,
    updatedUser,
    rememberAccount,
} = authSlice.actions;
export default authSlice.reducer;
