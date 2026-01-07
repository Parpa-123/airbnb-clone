/**
 * Complete API-Compatible Type Definitions
 * Matches Django backend serializers exactly (listings/serializers.py)
 */

// ============ Backend Serializer Response Types ============

/**
 * HostSerializer - User data for listing host
 * Fields: ["username", "avatar"]
 */
export interface Host {
    username: string;
    avatar: string | null;
}

/**
 * ListingImageSerializer - Image data from backend
 * Fields: ["name", "image", "uploaded_at"]
 * Note: "image" is a URL string, not a File object
 */
export interface ListingImage {
    name: string;
    image: string;  // URL to the uploaded image file (unique identifier)
    uploaded_at: string;
}

/**
 * AmenitySerializer - Amenity data
 * Fields: ["name", "display_name"]
 */
export interface Amenity {
    name: string;
    display_name: string;

}

/**
 * ListingDetailSerializer - Complete listing data returned from GET /listings/<id>/edit/
 * Combines ListingSerializer + additional detail fields
 * This is what CreateUpdateListSerializer.to_representation() returns
 */
export interface ListingEditData {
    // From ListingSerializer (base fields)
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
    price_per_night: string;  // DecimalField returns as string in JSON
    images: ListingImage[];
    created_at: string;  // ISO datetime string

    // From ListingDetailSerializer (extended fields)
    description: string;
    address: string;
    updated_at: string;  // ISO datetime string
    amenities: Amenity[];

    // Guest policy fields
    allows_children: boolean;
    allows_infants: boolean;
    allows_pets: boolean;
}

/**
 * Payload for PATCH requests to /listings/<id>/edit/
 * Only includes user-editable fields (excludes read-only fields)
 */
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
    amenities?: string[];  // Array of amenity name codes (e.g., ["wifi", "parking"])
    // Guest policy fields
    allows_children?: boolean;
    allows_infants?: boolean;
    allows_pets?: boolean;
    // Note: images are handled separately via FormData with multipart/form-data
}
