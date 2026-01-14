export interface LoginType {
  username: string;
  password: string;
}

export interface SignupType extends LoginType {
  email: string;
  phone: string;
}

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  phone: string;
  avatar: string | null;
  is_host: boolean;
}

export interface ListingFilters {
  country?: string;
  city?: string;
  property_type?: string;
  price_per_night__gte?: number;
  price_per_night__lte?: number;
  max_guests__gte?: number;
  max_guests__lte?: number;
}
