

export interface Host {
    username: string;
    avatar: string | null;
}

export interface Guest {
    username: string;
    avatar: string | null;
    is_host?: boolean;
}

export interface User {
    email: string;
    username: string;
}

// ============ Listing Types ============

export interface ListingImage {
    name: string;
    image: string;
    uploaded_at?: string;
}

export interface Amenity {
    name: string;
    display_name: string;
}


export interface Listing {
    id: number;
    host: Host;
    title: string;
    title_slug: string;
    country: string;
    city: string;
    property_type?: string;
    property_type_display: string;
    max_guests: number;
    bhk_choice: number;
    bed_choice: number;
    bathrooms: number;
    price_per_night: string;
    images: ListingImage[];
    created_at?: string;
}


export interface ListingDetail extends Listing {
    description: string;
    address?: string;
    amenities: Amenity[];
    updated_at?: string;
}


export type BookingStatus = "confirmed" | "pending" | "cancelled" | "failed" | "paid" | "refunded" | "CONFIRMED" | "PENDING" | "CANCELLED" | "FAILED" | "COMPLETED";

export interface Booking {
    id: number;
    guest: Guest;
    listing: Listing;
    start_date: string;
    end_date: string;
    total_price: string;
    status: BookingStatus;
}

export interface Wishlist {
    slug: string;
    name: string;
}

export interface WishlistItem {
    slug: string;
    name: string;
    count?: number;
    cover_image?: string | null;
}

export interface Review {
    id: number;
    avg_rating: string;
    listing: number;
    created_at: string;
    updated_at: string;
    review: string;
    accuracy: number;
    communication: number;
    cleanliness: number;
    location: number;
    check_in: number;
    value: number;
    user: User;
}

export type DatePickerRef = {
    getDates: () => { checkIn: string | null; checkOut: string | null };
    getDateObjects: () => { checkIn: any | null; checkOut: any | null };
};

