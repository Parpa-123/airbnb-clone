import { configureStore } from "@reduxjs/toolkit";
import formReducer from "../slice/slice";
import { api } from "../api/apiSlice";

export const store = configureStore({
    reducer: {
        form: formReducer,
        [api.reducerPath] : api.reducer
    },
    middleware : (get) => get().concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
