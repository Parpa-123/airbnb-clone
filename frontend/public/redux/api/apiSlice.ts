import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import axiosInstance from "../../connect";

export const api = createApi({
    reducerPath: "api",
    baseQuery: axiosBaseQuery({ axiosInstance: axiosInstance }),
    tagTypes: ["Bookings"],
    endpoints: (builder) => ({
        getBookings: builder.query({
            query: () => ({
                url: "bookings/view",
                method: "GET"
            }),
            providesTags: ["Bookings"],
        }),

    })
})

export const { useGetBookingsQuery } = api;
