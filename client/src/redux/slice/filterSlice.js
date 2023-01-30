import { createSlice } from '@reduxjs/toolkit';

const postSlice = createSlice({
    name: 'filter',
    initialState: {
        category: {
            currentCategory: null,
        },
        search: {
            title: null,
        },
        linkSearch: {
            link: null,
        },
        district: {
            currentDistrict: null,
        },
        price: {
            priceGte: null,
            priceLte: null,
        },
        area: {
            areaGte: null,
            areaLte: null,
        },
        filterResult: {
            post: null,
            pagination: null,
        },
        sort: {
            link: null,
        },
    },
    reducers: {
        currentCategory: (state, action) => {
            state.category.currentCategory = action.payload;
        },
        searchText: (state, action) => {
            state.search.title = action.payload || null;
        },
        searchLink: (state, action) => {
            state.linkSearch.link = action.payload ? action.payload : null;
        },
        currentDistrict: (state, action) => {
            state.district.currentDistrict = action.payload;
        },
        priceRange: (state, action) => {
            state.price.priceGte = action.payload ? action.payload[0] : null;
            state.price.priceLte = action.payload ? action.payload[1] : null;
        },
        areaRange: (state, action) => {
            state.area.areaGte = action.payload ? action.payload[0] : null;
            state.area.areaLte = action.payload ? action.payload[1] : null;
        },
        filterResult: (state, action) => {
            state.filterResult.post = action.payload
                ? action.payload.post
                : null;
            state.filterResult.pagination = action.payload
                ? action.payload.pagination
                : null;
        },
        sortLink: (state, action) => {
            state.sort.link = action.payload ? action.payload : null;
        },
    },
});

export const {
    currentCategory,
    searchText,
    searchLink,
    currentDistrict,
    priceRange,
    areaRange,
    filterResult,
    sortLink,
} = postSlice.actions;
export default postSlice.reducer;
