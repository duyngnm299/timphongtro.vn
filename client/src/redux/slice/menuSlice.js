import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
    name: 'menu',
    initialState: {
        menu: {
            currentMenu: null,
        },
    },
    reducers: {
        currentMenu: (state, action) => {
            state.menu.currentMenu = action.payload;
        },
    },
});

export const { currentMenu } = postSlice.actions;
export default postSlice.reducer;
