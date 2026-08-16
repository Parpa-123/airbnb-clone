import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import GuestSelector from "../GuestSelector";
import type { GuestCounts } from "../GuestSelector";
import { showWarning } from "../../../../utils/toastMessages";
import { FiSearch, FiMapPin, FiCalendar, FiUsers, FiX } from "react-icons/fi";

interface MobileSearchProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    country?: string;
    city?: string;
    checkIn: Dayjs | null;
    checkOut: Dayjs | null;
    guests: GuestCounts;
    onCheckInChange: (date: Dayjs | null) => void;
    onCheckOutChange: (date: Dayjs | null) => void;
    onGuestsChange: (guests: GuestCounts) => void;
    onCountryChange: (country: string) => void;
    onCityChange: (city: string) => void;
    onClearFilters: () => void;
    onSearch: () => void;
}

const MobileSearch: React.FC<MobileSearchProps> = ({
    open,
    onOpenChange,
    country = "",
    city = "",
    checkIn,
    checkOut,
    guests,
    onCheckInChange,
    onCheckOutChange,
    onGuestsChange,
    onCountryChange,
    onCityChange,
    onClearFilters,
    onSearch,
}) => {
    const handleCheckInChange = (date: Dayjs | null) => {
        if (date && checkOut && (date.isAfter(checkOut) || date.isSame(checkOut))) {
            showWarning("Check-in date must be before check-out date");
            return;
        }
        onCheckInChange(date);
    };

    const handleCheckOutChange = (date: Dayjs | null) => {
        if (date && checkIn && (date.isBefore(checkIn) || date.isSame(checkIn))) {
            showWarning("Check-out date must be after check-in date");
            return;
        }
        onCheckOutChange(date);
    };

    const hasActiveFilters = Boolean(
        country ||
        city ||
        checkIn ||
        checkOut ||
        guests.adults > 1 ||
        guests.children > 0 ||
        guests.infants > 0 ||
        guests.pets > 0
    );

    const titleSummary = country && city
        ? `${city}, ${country}`
        : city || country || "Where to?";

    const dateSummary = checkIn && checkOut
        ? `${checkIn.format("MMM D")} – ${checkOut.format("MMM D")}`
        : checkIn
            ? `From ${checkIn.format("MMM D")}`
            : "Any week";

    const totalGuests = guests.adults + guests.children;
    const guestSummary = totalGuests > 1 ? `${totalGuests} guests` : "Add guests";

    const subtitleSummary = `${dateSummary} · ${guestSummary}`;

    return (
        <div className="flex smd:hidden flex-1 justify-center">
            <Dialog.Root open={open} onOpenChange={onOpenChange}>
                <Dialog.Trigger asChild>
                    <button className="flex items-center gap-3 w-full max-w-sm px-4 py-2.5 border border-gray-200 hover:border-gray-300 bg-white rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm shrink-0"
                            style={{ backgroundColor: "var(--color-brand)" }}
                        >
                            <FiSearch className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                                {titleSummary}
                            </div>
                            <div className="text-xs text-gray-500 font-normal truncate">
                                {subtitleSummary}
                            </div>
                        </div>
                    </button>
                </Dialog.Trigger>

                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 animate-in fade-in-0" />

                    <Dialog.Content className="fixed inset-x-3 top-16 z-50 max-w-lg mx-auto bg-white border border-gray-200 rounded-3xl shadow-2xl p-5 space-y-4 max-h-[85vh] overflow-y-auto text-gray-800 animate-in fade-in-0 zoom-in-95">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <Dialog.Title className="text-lg font-bold text-gray-900">
                                Search filters
                            </Dialog.Title>
                            <Dialog.Close className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
                                <Cross2Icon className="w-5 h-5" />
                            </Dialog.Close>
                        </div>

                        <div className="space-y-4">
                            {/* Destination */}
                            <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    <FiMapPin className="w-3.5 h-3.5 text-brand" />
                                    <span>Where</span>
                                </div>
                                <input
                                    value={country}
                                    placeholder="Country"
                                    className="w-full bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                                    onChange={(e) => onCountryChange(e.target.value)}
                                />
                                <input
                                    value={city}
                                    placeholder="City"
                                    className="w-full bg-white border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                                    onChange={(e) => onCityChange(e.target.value)}
                                />
                            </div>

                            {/* Dates */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                        <FiCalendar className="w-3.5 h-3.5 text-brand" />
                                        <span>When</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <DatePicker
                                            label="Check in"
                                            value={checkIn}
                                            onChange={handleCheckInChange}
                                            minDate={dayjs()}
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    sx: {
                                                        "& .MuiInputBase-root": {
                                                            backgroundColor: "#fff",
                                                            borderRadius: "0.75rem",
                                                            color: "#111827",
                                                            "& fieldset": { borderColor: "#e5e7eb" },
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                        <DatePicker
                                            label="Check out"
                                            value={checkOut}
                                            onChange={handleCheckOutChange}
                                            minDate={checkIn ? checkIn.add(1, "day") : dayjs()}
                                            slotProps={{
                                                textField: {
                                                    size: "small",
                                                    sx: {
                                                        "& .MuiInputBase-root": {
                                                            backgroundColor: "#fff",
                                                            borderRadius: "0.75rem",
                                                            color: "#111827",
                                                            "& fieldset": { borderColor: "#e5e7eb" },
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </LocalizationProvider>

                            {/* Guests */}
                            <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                                    <FiUsers className="w-3.5 h-3.5 text-brand" />
                                    <span>Who</span>
                                </div>
                                <GuestSelector guests={guests} onGuestsChange={onGuestsChange} />
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            {hasActiveFilters ? (
                                <button
                                    onClick={onClearFilters}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors underline cursor-pointer"
                                >
                                    <FiX className="w-3.5 h-3.5" />
                                    <span>Clear all</span>
                                </button>
                            ) : <div />}

                            <button
                                onClick={() => {
                                    onSearch();
                                    onOpenChange(false);
                                }}
                                className="flex items-center gap-2 bg-brand text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-hover shadow-md cursor-pointer transition-all"
                                style={{ backgroundColor: "var(--color-brand)" }}
                            >
                                <FiSearch className="w-4 h-4" />
                                <span>Search</span>
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default MobileSearch;
