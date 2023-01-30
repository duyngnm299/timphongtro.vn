import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import postReducer from '../slice/postSlice';
import filterReducer from '../slice/filterSlice';
import menuReducer from '../slice/menuSlice';
import messageReducer from '../slice/messageSlice';
import adminReducer from '../slice/adminSlice';
// import userReducer from './userSlice';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};
const rootReducer = combineReducers({
    auth: authReducer,
    post: postReducer,
    filter: filterReducer,
    menu: menuReducer,
    message: messageReducer,
    admin: adminReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export let persistor = persistStore(store);
