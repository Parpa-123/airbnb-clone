import { configureStore } from "@reduxjs/toolkit";
import formReducer from "../slices/formSlice";
import authReducer from "../slices/authSlice";
import filtersReducer from "../slices/filtersSlice";
import { api } from "../api/apiSlice";

export const store = configureStore({
    reducer: {
        form: formReducer,
        auth: authReducer,
        filters: filtersReducer,
        [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
