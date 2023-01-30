import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
    name: 'message',
    initialState: {
        message: {
            msg: null,
        },
        socket: {
            sk: null,
        },
        conversation: {
            conv: null,
        },
    },
    reducers: {
        newMessage: (state, action) => {
            state.message.msg = action.payload ? action.payload : null;
        },
        currentSocket: (state, action) => {
            state.socket.sk = action.payload || null;
        },
        currentConversation: (state, action) => {
            state.conversation.conv = action.payload || null;
        },
    },
});

export const { newMessage, currentSocket, currentConversation } =
    messageSlice.actions;
export default messageSlice.reducer;
