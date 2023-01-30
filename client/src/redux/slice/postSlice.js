import { NightShelter } from '@mui/icons-material';
import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
    name: 'post',
    initialState: {
        post: {
            currentPost: null,
        },
        saved: {
            changeSaved: false,
        },
        removed: {
            isRemove: false,
            postId: null,
        },
        modal: {
            show: false,
        },
        isEditPost: {
            isEdit: false,
        },
        editPost: {
            currentPost: null,
        },
        postList: {
            list: null,
        },
        previewPost: {
            post: null,
        },
        closePreviewPost: {
            isClose: false,
        },
    },
    reducers: {
        currentPost: (state, action) => {
            state.post.currentPost = action.payload;
        },
        savedPostItemChange: (state) => {
            state.saved.changeSaved = !state.saved.changeSaved;
        },
        removedItem: (state, action) => {
            state.removed.isRemove = !state.removed.isRemove;
            state.removed.postId = action.payload;
        },
        changeModal: (state) => {
            state.modal.show = !state.modal.show;
        },
        isEditPost: (state) => {
            state.isEditPost.isEdit = !state.isEditPost.isEdit;
        },
        editPost: (state, action) => {
            console.log(action.payload);
            state.editPost.currentPost = action.payload;
        },
        postListOfUser: (state, action) => {
            state.postList.list = action.payload ? action.payload : null;
        },
        previewPost: (state, action) => {
            state.previewPost.post = action.payload;
        },
        closePreviewPost: (state) => {
            state.closePreviewPost.isClose = !state.closePreviewPost.isClose;
        },
    },
});

export const {
    currentPost,
    savedPostItemChange,
    removedItem,
    changeModal,
    isEditPost,
    editPost,
    postListOfUser,
    previewPost,
    closePreviewPost,
} = postSlice.actions;
export default postSlice.reducer;
