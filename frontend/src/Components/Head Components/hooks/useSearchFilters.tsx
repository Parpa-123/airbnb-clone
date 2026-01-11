import { useState } from "react";
import { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { useFilterContext } from "../../../services/filterContext";
import type { ListingFilters } from "../../../services/filterContext";
import type { GuestCounts } from "../components/GuestSelector";

/**
 * Custom hook to manage search filters and state
 * Centralizes all search-related logic
 */
export const useSearchFilters = () => {
    const navigate = useNavigate();
    const { setFilters } = useFilterContext();

    const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
    const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
    const [guests, setGuests] = useState<GuestCounts>({
        adults: 1,
        children: 0,
        infants: 0,
        pets: 0,
    });

    const handleCheckInChange = (date: Dayjs | null) => {
        setCheckIn(date);
        setFilters((prev: ListingFilters) => ({
            ...prev,
            check_in: date ? date.format("YYYY-MM-DD") : undefined,
        }));
    };

    const handleCheckOutChange = (date: Dayjs | null) => {
        setCheckOut(date);
        setFilters((prev: ListingFilters) => ({
            ...prev,
            check_out: date ? date.format("YYYY-MM-DD") : undefined,
        }));
    };

    const handleGuestsChange = (newGuests: GuestCounts) => {
        setGuests(newGuests);
        setFilters((prev: ListingFilters) => ({
            ...prev,
            max_guests__gte: newGuests.adults > 0 ? newGuests.adults : undefined,
            has_pets: newGuests.pets > 0 ? true : undefined,
            has_children: newGuests.children > 0 ? true : undefined,
        }));
    };

    const handleCountryChange = (country: string) => {
        setFilters((prev: ListingFilters) => ({
            ...prev,
            country: country || undefined,
        }));
    };

    const handleCityChange = (city: string) => {
        setFilters((prev: ListingFilters) => ({
            ...prev,
            city: city || undefined,
        }));
    };

    const clearFilters = () => {
        setCheckIn(null);
        setCheckOut(null);
        setGuests({
            adults: 1,
            children: 0,
            infants: 0,
            pets: 0,
        });
        setFilters({});
    };

    const handleSearch = () => {
        navigate("/");
    };

    return {
        checkIn,
        checkOut,
        guests,
        handleCheckInChange,
        handleCheckOutChange,
        handleGuestsChange,
        handleCountryChange,
        handleCityChange,
        clearFilters,
        handleSearch,
    };
};
