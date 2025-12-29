// Shared types for Listings and Bookings across the application

export interface ListingImage {
    name?: string;
    image: string;
}

export interface Host {
    username: string;
    avatar: string;
}

export interface Guest {
    id: number;
    username: string;
    email: string;
}

export interface Listing {
    id: number;
    title: string;
    title_slug: string;
    city: string;
    country: string;
    property_type_display: string;
    max_guests: number;
    bhk_choice?: number;
    bed_choice?: number;
    bathrooms?: number;
    price_per_night: string;
    images: ListingImage[];
    created_at?: string;
    host: Host;
}

export interface Booking {
    id: number;
    guest: Guest;
    listing: Listing;
    start_date: string;
    end_date: string;
    total_price: string;
    status: "confirmed" | "pending" | "cancelled" | "failed";
}

export type BookingStatus = Booking["status"];
