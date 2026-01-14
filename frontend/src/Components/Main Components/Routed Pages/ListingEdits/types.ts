export interface Host {
    username: string;
    avatar: string | null;
}

export interface ListingImage {
    name: string;
    image: string;
    uploaded_at: string;
}

export interface Amenity {
    name: string;
    display_name: string;

}

export interface ListingEditData {

    id: number;
    host: Host;
    title: string;
    title_slug: string;
    country: string;
    city: string;
    property_type: string;
    property_type_display: string;
    max_guests: number;
    bhk_choice: number;
    bed_choice: number;
    bathrooms: number;
    price_per_night: string;
    images: ListingImage[];
    created_at: string;

    description: string;
    address: string;
    updated_at: string;
    amenities: Amenity[];

    allows_children: boolean;
    allows_infants: boolean;
    allows_pets: boolean;
}

export interface ListingUpdatePayload {
    title?: string;
    description?: string;
    address?: string;
    country?: string;
    city?: string;
    property_type?: string;
    max_guests?: number;
    bhk_choice?: number;
    bed_choice?: number;
    bathrooms?: number;
    price_per_night?: number | string;
    amenities?: string[];

    allows_children?: boolean;
    allows_infants?: boolean;
    allows_pets?: boolean;

}
