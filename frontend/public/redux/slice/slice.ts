import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Interface for working with images in the form (before submission)
export interface ImageWithName {
    name: string;
    image: File;
}

// Interface for submitting images to backend (after conversion to base64)
export interface ImageData {
    name: string;
    image_data: string;
}

// Main form data interface matching backend schema
export interface EntireFormData {
    title: string;
    property_type: string;
    max_guests: number;
    bhk_choice: number;
    bed_choice: number;
    bathrooms: number;
    country: string;
    city: string;
    address: string;
    description: string;
    amenities: string[];
    price_per_night: number;
    images: ImageWithName[];
}

const initialState: EntireFormData = {
    title: "",
    property_type: "",
    max_guests: 0,
    bhk_choice: 0,
    bed_choice: 0,
    bathrooms: 0,
    country: "",
    city: "",
    address: "",
    description: "",
    amenities: [],
    price_per_night: 0,
    images: [],
};

const slice = createSlice({
    name: "form",
    initialState,
    reducers: {
        updateForm: (state, action: PayloadAction<Partial<EntireFormData>>) => {
            return {
                ...state,
                ...action.payload
            }
        },

        resetForm: () => initialState
    }
})

export const { updateForm, resetForm } = slice.actions
export default slice.reducer
