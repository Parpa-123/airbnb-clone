import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import axiosInstance from "../../services/connect";
import type { Booking, Listing, ListingDetail, WishlistItem, Review, PaginatedResponse } from "../../types";

export const api = createApi({
    reducerPath: "api",
    baseQuery: axiosBaseQuery({ axiosInstance: axiosInstance }),
    tagTypes: ["Bookings", "Listings", "Wishlist", "Reviews"],
    endpoints: (builder) => ({
        getBookings: builder.query<Booking[], void>({
            query: () => ({
                url: "bookings/view/",
                method: "GET"
            }),
            transformResponse: (response: Booking[] | PaginatedResponse<Booking>) =>
                Array.isArray(response) ? response : response.results ?? [],
            providesTags: ["Bookings"],
        }),
        getListings: builder.query<PaginatedResponse<Listing>, any>({
            query: (params) => ({
                url: "listings/public/",
                method: "GET",
                params: params
            }),
            providesTags: ["Listings"],
        }),
        getListingDetail: builder.query<ListingDetail, string>({
            query: (titleSlug) => ({
                url: `listings/${titleSlug}/`,
                method: "GET"
            }),
            providesTags: (_result, _error, arg) => [{ type: "Listings", id: arg }],
        }),
        getWishlists: builder.query<WishlistItem[], void>({
            query: () => ({
                url: "wishlist/",
                method: "GET"
            }),
            providesTags: ["Wishlist"],
        }),
        getWishlistDetail: builder.query<{ listings: Listing[]; name: string }, string>({
            query: (slug) => ({
                url: `wishlist/${slug}/`,
                method: "GET"
            }),
            providesTags: (_result, _error, arg) => [{ type: "Wishlist", id: arg }],
        }),
        deleteFromWishlist: builder.mutation<void, { slug: string; titleSlug: string }>({
            query: ({ slug, titleSlug }) => ({
                url: `wishlist/${slug}/delete/${titleSlug}`,
                method: "DELETE"
            }),
            invalidatesTags: (_result, _error, arg) => ["Wishlist", { type: "Wishlist", id: arg.slug }],
        }),
        bulkAddToWishlist: builder.mutation<void, { name: string; listings: string[] }>({
            query: (payload) => ({
                url: "wishlist/bulk-add-to-wishlist/",
                method: "POST",
                data: payload
            }),
            invalidatesTags: ["Wishlist"],
        }),
        getReviews: builder.query<PaginatedResponse<Review>, string>({
            query: (titleSlug) => ({
                url: `reviews/${titleSlug}/`,
                method: "GET"
            }),
            providesTags: (_result, _error, arg) => [{ type: "Reviews", id: arg }],
        }),
        createReview: builder.mutation<Review, { titleSlug: string; payload: any }>({
            query: ({ titleSlug, payload }) => ({
                url: `reviews/${titleSlug}/`,
                method: "POST",
                data: payload
            }),
            invalidatesTags: (_result, _error, arg) => [{ type: "Reviews", id: arg.titleSlug }],
        })
    })
});

export const {
    useGetBookingsQuery,
    useGetListingsQuery,
    useGetListingDetailQuery,
    useGetWishlistsQuery,
    useGetWishlistDetailQuery,
    useDeleteFromWishlistMutation,
    useBulkAddToWishlistMutation,
    useGetReviewsQuery,
    useCreateReviewMutation
} = api;
