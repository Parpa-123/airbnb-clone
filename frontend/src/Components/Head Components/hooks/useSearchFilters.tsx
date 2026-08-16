import { useState } from "react";
import { type Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateFilters, clearFilters as clearFiltersAction } from "../../../redux/slices/filtersSlice";
import type { RootState } from "../../../redux/store/store";
import type { GuestCounts } from "../components/GuestSelector";

export const useSearchFilters = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { filters } = useSelector((state: RootState) => state.filters);

    const [country, setCountry] = useState<string>(filters.country || "");
    const [city, setCity] = useState<string>(filters.city || "");
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
        dispatch(updateFilters({
            check_in: date ? date.format("YYYY-MM-DD") : undefined,
        }));
    };

    const handleCheckOutChange = (date: Dayjs | null) => {
        setCheckOut(date);
        dispatch(updateFilters({
            check_out: date ? date.format("YYYY-MM-DD") : undefined,
        }));
    };

    const handleGuestsChange = (newGuests: GuestCounts) => {
        setGuests(newGuests);
        dispatch(updateFilters({
            max_guests__gte: newGuests.adults > 0 ? newGuests.adults : undefined,
            has_pets: newGuests.pets > 0 ? true : undefined,
            has_children: newGuests.children > 0 ? true : undefined,
        }));
    };

    const handleCountryChange = (val: string) => {
        setCountry(val);
        dispatch(updateFilters({
            country: val || undefined,
        }));
    };

    const handleCityChange = (val: string) => {
        setCity(val);
        dispatch(updateFilters({
            city: val || undefined,
        }));
    };

    const clearFilters = () => {
        setCountry("");
        setCity("");
        setCheckIn(null);
        setCheckOut(null);
        setGuests({
            adults: 1,
            children: 0,
            infants: 0,
            pets: 0,
        });
        dispatch(clearFiltersAction());
    };

    const handleSearch = () => {
        navigate("/");
    };

    return {
        country,
        city,
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
