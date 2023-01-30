import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        adminLogin: {
            currentUser: null,
        },
        updateAdmin: {
            currentUser: null,
        },
        editUser: {
            user: null,
        },
        currentMenu: {
            menu: null,
        },
        post: {
            currentPost: null,
        },
        censor: {
            isCensor: false,
        },
        revenue: {
            data: null,
        },
        totalRevenue: {
            total: null,
        },
        deletePost: {
            isDeleted: false,
        },
    },
    reducers: {
        adminLoginSuccess: (state, action) => {
            state.adminLogin.currentUser = action.payload;
        },
        updatedSuccess: (state, action) => {
            state.updateAdmin.currentUser = action.payload;
        },
        adminLogOutSuccess: (state) => {
            state.adminLogin.currentUser = null;
            state.updateAdmin.currentUser = null;
        },
        editedUser: (state, action) => {
            state.editUser.user = action.payload || null;
        },
        currentMenu: (state, action) => {
            state.currentMenu.menu = action.payload || null;
        },
        detailPost: (state, action) => {
            state.post.currentPost = action.payload || null;
        },
        censorPost: (state) => {
            state.censor.isCensor = !state.censor.isCensor;
        },
        detailRevenue: (state, action) => {
            console.log(action.payload);
            state.revenue.data = action.payload || null;
        },
        revenueTotal: (state, action) => {
            state.totalRevenue.total = action.payload || null;
        },
        adminDeletedPost: (state) => {
            state.deletePost.isDeleted = !state.deletePost.isDeleted;
        },
    },
});

export const {
    adminLoginSuccess,
    editedUser,
    currentMenu,
    detailPost,
    updatedSuccess,
    adminLogOutSuccess,
    censorPost,
    detailRevenue,
    revenueTotal,
    adminDeletedPost,
} = adminSlice.actions;
export default adminSlice.reducer;
