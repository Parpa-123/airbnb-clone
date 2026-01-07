import { toast, type ToastOptions } from "react-toastify";

/**
 * Extracts an error message from an API error response.
 * Handles various DRF error formats:
 * - ValidationError: { field: ["error message"] }
 * - detail: "error message"  
 * - message: "error message"
 * - non_field_errors: ["error message"]
 */
export const extractErrorMessage = (error: any, fallback: string = "An error occurred"): string => {
    const data = error?.response?.data;

    if (!data) return error?.message || fallback;

    // Handle direct message/detail strings
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.detail) return data.detail;

    // Handle non_field_errors array
    if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
        return data.non_field_errors[0];
    }

    // Handle validation errors: { field_name: ["error message"] }
    const firstKey = Object.keys(data)[0];
    if (firstKey && Array.isArray(data[firstKey])) {
        return `${firstKey}: ${data[firstKey][0]}`;
    }

    // Fallback to JSON stringified response
    try {
        const jsonStr = JSON.stringify(data);
        return jsonStr !== "{}" ? jsonStr : fallback;
    } catch {
        return fallback;
    }
};

// Default toast options
const defaultOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 4000,
};

/**
 * Toast utility functions
 */
export const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
};

export const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
};

export const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
};

export const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options });
};

/**
 * Show error from API error response, extracting the message automatically
 */
export const showApiError = (error: any, fallback?: string) => {
    showError(extractErrorMessage(error, fallback));
};

// Predefined messages for common actions
export const MESSAGES = {
    AUTH: {
        LOGIN_SUCCESS: "Logged in!",
        LOGOUT: "Logged out",
        SIGNUP_SUCCESS: "Account created!",
        PROFILE_UPDATED: "Profile updated!",
        PROFILE_LOAD_FAILED: "Failed to load profile",
    },
    BOOKING: {
        CANCEL_SUCCESS: "Booking cancelled successfully",
        PAYMENT_SUCCESS: "Payment confirmed! Your booking is now active.",
        PAYMENT_FAILED: "Payment failed. Please try again.",
        PAYMENT_STATUS_FAILED: "Failed to check payment status.",
        BOOKING_FAILED: "Booking failed",
        FETCH_FAILED: "Failed to load bookings",
    },
    LISTING: {
        CREATE_SUCCESS: "Listing created successfully",
        UPDATE_SUCCESS: "Listing updated",
        DELETE_SUCCESS: "Listing removed successfully",
        FETCH_FAILED: "Failed to fetch listings",
        UPDATE_FAILED: "Failed to update listing",
        LOAD_FAILED: "Failed to load listing",
    },
    WISHLIST: {
        CREATE_SUCCESS: (name: string) => `${name} created successfully`,
        DELETE_SUCCESS: "Wishlist deleted successfully",
        ADD_SUCCESS: "Added to wishlist ❤️",
        FETCH_FAILED: "Failed to load wishlists",
        NO_LISTING: "No listing selected",
    },
    REVIEW: {
        SUBMIT_FAILED: "Failed to submit review",
        FETCH_FAILED: "Failed to fetch reviews",
    },
} as const;
