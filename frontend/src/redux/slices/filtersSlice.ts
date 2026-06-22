import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ListingFilters {
    country?: string;
    city?: string;
    property_type?: string;
    price_per_night__lte?: number;
    price_per_night__gte?: number;
    max_guests__lte?: number;
    max_guests__gte?: number;
    check_in?: string;
    check_out?: string;
    has_pets?: boolean;
    has_children?: boolean;
}

interface FiltersState {
    filters: ListingFilters;
}

const initialState: FiltersState = {
    filters: {},
};

const filtersSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        updateFilters: (state, action: PayloadAction<Partial<ListingFilters>>) => {
            state.filters = {
                ...state.filters,
                ...action.payload,
            };
        },
        clearFilters: (state) => {
            state.filters = {};
        },
    },
});

export const { updateFilters, clearFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
