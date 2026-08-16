import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import GuestSelector from "../GuestSelector";
import type { GuestCounts } from "../GuestSelector";
import { showWarning } from "../../../../utils/toastMessages";
import { FiSearch, FiMapPin, FiX } from "react-icons/fi";

interface DesktopSearchProps {
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

const DesktopSearch: React.FC<DesktopSearchProps> = ({
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

    const destinationLabel = country && city
        ? `${city}, ${country}`
        : city || country || "Anywhere";

    return (
        <div className="hidden smd:flex items-center border border-gray-200 hover:border-gray-300 bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 pl-2 pr-1.5 py-1">
            {/* Destination Dropdown */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100/80 rounded-full transition-colors cursor-pointer max-w-[160px] truncate outline-none">
                        <span className="truncate">{destinationLabel}</span>
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        sideOffset={12}
                        align="start"
                        className="z-50 w-80 p-5 bg-white/95 backdrop-blur-md border border-gray-200 rounded-3xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] animate-in fade-in-0 zoom-in-95"
                    >
                        <DropdownMenu.Label className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">
                            <FiMapPin className="w-3.5 h-3.5 text-brand" />
                            <span>Destination</span>
                        </DropdownMenu.Label>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-500 mb-1">Country</label>
                                <input
                                    value={country}
                                    placeholder="e.g. United States, France"
                                    className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                                    onChange={(e) => onCountryChange(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-gray-500 mb-1">City</label>
                                <input
                                    value={city}
                                    placeholder="e.g. Paris, Tokyo"
                                    className="w-full bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
                                    onChange={(e) => onCityChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Divider */}
            <div className="h-5 w-px bg-gray-200 mx-1" />

            {/* Date Pickers */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex items-center">
                    <DatePicker
                        label=""
                        value={checkIn}
                        onChange={handleCheckInChange}
                        minDate={dayjs()}
                        maxDate={checkOut ? checkOut.subtract(1, "day") : undefined}
                        slotProps={{
                            textField: {
                                placeholder: "Add dates",
                                variant: "standard",
                                InputProps: { disableUnderline: true },
                                sx: {
                                    width: "110px",
                                    "& .MuiInputBase-root": {
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        padding: "4px 12px",
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "#f9fafb",
                                            borderRadius: "20px",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        fontSize: "0.825rem",
                                        padding: 0,
                                        cursor: "pointer",
                                        color: checkIn ? "#111827" : "#6b7280",
                                        fontWeight: checkIn ? 600 : 400,
                                        "&::placeholder": { color: "#6b7280", opacity: 1 },
                                    },
                                    "&::before": {
                                        content: '"Check in"',
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        color: "#111827",
                                        marginBottom: "1px",
                                    },
                                },
                            },
                            popper: {
                                sx: {
                                    "& .MuiPaper-root": {
                                        borderRadius: "24px",
                                        backgroundColor: "#fff",
                                        color: "#111827",
                                        border: "1px solid #e5e7eb",
                                        boxShadow: "0 12px 36px rgba(0,0,0,0.12)",
                                        marginTop: "8px",
                                    },
                                    "& .MuiPickersDay-root": {
                                        color: "#111827",
                                        "&.Mui-selected": {
                                            backgroundColor: "var(--color-brand)",
                                            "&:hover": { backgroundColor: "var(--color-brand-hover)" },
                                        },
                                        "&:hover": { backgroundColor: "#f3f4f6" },
                                    },
                                    "& .MuiIconButton-root": { color: "#111827" },
                                    "& .MuiTypography-root": { color: "#6b7280" },
                                },
                            },
                        }}
                    />

                    {/* Divider */}
                    <div className="h-5 w-px bg-gray-200 mx-1" />

                    <DatePicker
                        label=""
                        value={checkOut}
                        onChange={handleCheckOutChange}
                        minDate={checkIn ? checkIn.add(1, "day") : dayjs()}
                        slotProps={{
                            textField: {
                                placeholder: "Add dates",
                                variant: "standard",
                                InputProps: { disableUnderline: true },
                                sx: {
                                    width: "110px",
                                    "& .MuiInputBase-root": {
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        padding: "4px 12px",
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "#f9fafb",
                                            borderRadius: "20px",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        fontSize: "0.825rem",
                                        padding: 0,
                                        cursor: "pointer",
                                        color: checkOut ? "#111827" : "#6b7280",
                                        fontWeight: checkOut ? 600 : 400,
                                        "&::placeholder": { color: "#6b7280", opacity: 1 },
                                    },
                                    "&::before": {
                                        content: '"Check out"',
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        color: "#111827",
                                        marginBottom: "1px",
                                    },
                                },
                            },
                            popper: {
                                sx: {
                                    "& .MuiPaper-root": {
                                        borderRadius: "24px",
                                        backgroundColor: "#fff",
                                        color: "#111827",
                                        border: "1px solid #e5e7eb",
                                        boxShadow: "0 12px 36px rgba(0,0,0,0.12)",
                                        marginTop: "8px",
                                    },
                                    "& .MuiPickersDay-root": {
                                        color: "#111827",
                                        "&.Mui-selected": {
                                            backgroundColor: "var(--color-brand)",
                                            "&:hover": { backgroundColor: "var(--color-brand-hover)" },
                                        },
                                        "&:hover": { backgroundColor: "#f3f4f6" },
                                    },
                                    "& .MuiIconButton-root": { color: "#111827" },
                                    "& .MuiTypography-root": { color: "#6b7280" },
                                },
                            },
                        }}
                    />
                </div>
            </LocalizationProvider>

            {/* Divider */}
            <div className="h-5 w-px bg-gray-200 mx-1" />

            {/* Guest Selector */}
            <GuestSelector guests={guests} onGuestsChange={onGuestsChange} />

            {/* Clear Filters Button */}
            {hasActiveFilters && (
                <button
                    onClick={onClearFilters}
                    className="flex items-center gap-1 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    title="Clear filters"
                >
                    <FiX className="w-4 h-4" />
                </button>
            )}

            {/* Search Button */}
            <button
                onClick={onSearch}
                className="bg-brand text-white p-2.5 ml-1.5 rounded-full hover:brightness-105 active:scale-95 transition-all shadow-[0_2px_8px_rgba(255,56,92,0.35)] cursor-pointer flex items-center justify-center group"
                style={{ backgroundColor: "var(--color-brand)" }}
                title="Search"
            >
                <FiSearch className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
        </div>
    );
};

export default DesktopSearch;
