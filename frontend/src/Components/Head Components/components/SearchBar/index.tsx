import React from "react";
import MobileSearch from "./MobileSearch";
import DesktopSearch from "./DesktopSearch";
import { Dayjs } from "dayjs";
import type { GuestCounts } from "../GuestSelector";

interface SearchBarProps {
    shouldHide: boolean;
    country?: string;
    city?: string;
    checkIn: Dayjs | null;
    checkOut: Dayjs | null;
    guests: GuestCounts;
    mobileSearchOpen: boolean;
    onMobileSearchOpenChange: (open: boolean) => void;
    onCheckInChange: (date: Dayjs | null) => void;
    onCheckOutChange: (date: Dayjs | null) => void;
    onGuestsChange: (guests: GuestCounts) => void;
    onCountryChange: (country: string) => void;
    onCityChange: (city: string) => void;
    onClearFilters: () => void;
    onSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    shouldHide,
    country = "",
    city = "",
    checkIn,
    checkOut,
    guests,
    mobileSearchOpen,
    onMobileSearchOpenChange,
    onCheckInChange,
    onCheckOutChange,
    onGuestsChange,
    onCountryChange,
    onCityChange,
    onClearFilters,
    onSearch,
}) => {
    if (shouldHide) {
        return null;
    }

    return (
        <>
            <MobileSearch
                open={mobileSearchOpen}
                onOpenChange={onMobileSearchOpenChange}
                country={country}
                city={city}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                onCheckInChange={onCheckInChange}
                onCheckOutChange={onCheckOutChange}
                onGuestsChange={onGuestsChange}
                onCountryChange={onCountryChange}
                onCityChange={onCityChange}
                onClearFilters={onClearFilters}
                onSearch={onSearch}
            />

            <DesktopSearch
                country={country}
                city={city}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                onCheckInChange={onCheckInChange}
                onCheckOutChange={onCheckOutChange}
                onGuestsChange={onGuestsChange}
                onCountryChange={onCountryChange}
                onCityChange={onCityChange}
                onClearFilters={onClearFilters}
                onSearch={onSearch}
            />
        </>
    );
};

export default SearchBar;
