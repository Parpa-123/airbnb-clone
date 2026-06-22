import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import GuestSelector from "../GuestSelector";
import type { GuestCounts } from "../GuestSelector";

interface DesktopSearchProps {
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
            alert("Check-in date must be before check-out date");
            return;
        }
        onCheckInChange(date);
    };

    const handleCheckOutChange = (date: Dayjs | null) => {
        if (date && checkIn && (date.isBefore(checkIn) || date.isSame(checkIn))) {
            alert("Check-out date must be after check-in date");
            return;
        }
        onCheckOutChange(date);
    };

    const hasActiveFilters =
        checkIn ||
        checkOut ||
        guests.adults > 1 ||
        guests.children > 0 ||
        guests.infants > 0 ||
        guests.pets > 0;

    return (
        <div className="hidden smd:flex items-center gap-0 border border-white/20 glass rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-shadow duration-300 cursor-pointer">
            {/* Anywhere Dropdown */}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="px-4 xz:px-6 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
                        Anywhere
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        sideOffset={12}
                        align="start"
                        className="z-50 w-80 p-6 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
                    >
                        <DropdownMenu.Label className="text-xs font-semibold text-slate-300 mb-4 uppercase tracking-wider">
                            Where to?
                        </DropdownMenu.Label>

                        <div className="space-y-4">
                            <input
                                placeholder="Which Country"
                                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                onChange={(e) => onCountryChange(e.target.value)}
                            />

                            <input
                                placeholder="City"
                                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                onChange={(e) => onCityChange(e.target.value)}
                            />
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Divider */}
            <div className="h-6 w-px bg-white/20" />

            {/* Date Pickers */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex items-center gap-0">
                    <DatePicker
                        label=""
                        value={checkIn}
                        onChange={handleCheckInChange}
                        minDate={dayjs()}
                        maxDate={checkOut ? checkOut.subtract(1, "day") : undefined}
                        slotProps={{
                            textField: {
                                placeholder: "Add date",
                                variant: "standard",
                                InputProps: { disableUnderline: true },
                                sx: {
                                    width: "110px",
                                    "& .MuiInputBase-root": {
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                            borderRadius: "24px",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        fontSize: "0.875rem",
                                        padding: 0,
                                        cursor: "pointer",
                                        color: checkIn ? "#fff" : "#94a3b8",
                                        "&::placeholder": { color: "#94a3b8", opacity: 1 },
                                    },
                                    "&::before": {
                                        content: '"Check in"',
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "#e2e8f0",
                                        marginBottom: "2px",
                                    },
                                },
                            },
                            popper: {
                                sx: {
                                    "& .MuiPaper-root": {
                                        borderRadius: "24px",
                                        backgroundColor: "#0f172a",
                                        color: "#fff",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                                        marginTop: "8px",
                                    },
                                    "& .MuiPickersDay-root": {
                                        color: "#e2e8f0",
                                        "&.Mui-selected": {
                                            backgroundColor: "#a855f7",
                                            "&:hover": { backgroundColor: "#9333ea" },
                                        },
                                        "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                                    },
                                    "& .MuiIconButton-root": { color: "#e2e8f0" },
                                    "& .MuiTypography-root": { color: "#94a3b8" },
                                },
                            },
                        }}
                    />

                    {/* Divider */}
                    <div className="h-6 w-px bg-white/20" />

                    <DatePicker
                        label=""
                        value={checkOut}
                        onChange={handleCheckOutChange}
                        minDate={checkIn ? checkIn.add(1, "day") : dayjs()}
                        slotProps={{
                            textField: {
                                placeholder: "Add date",
                                variant: "standard",
                                InputProps: { disableUnderline: true },
                                sx: {
                                    width: "110px",
                                    "& .MuiInputBase-root": {
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                            borderRadius: "24px",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        fontSize: "0.875rem",
                                        padding: 0,
                                        cursor: "pointer",
                                        color: checkOut ? "#fff" : "#94a3b8",
                                        "&::placeholder": { color: "#94a3b8", opacity: 1 },
                                    },
                                    "&::before": {
                                        content: '"Check out"',
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "#e2e8f0",
                                        marginBottom: "2px",
                                    },
                                },
                            },
                            popper: {
                                sx: {
                                    "& .MuiPaper-root": {
                                        borderRadius: "24px",
                                        backgroundColor: "#0f172a",
                                        color: "#fff",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                                        marginTop: "8px",
                                    },
                                    "& .MuiPickersDay-root": {
                                        color: "#e2e8f0",
                                        "&.Mui-selected": {
                                            backgroundColor: "#a855f7",
                                            "&:hover": { backgroundColor: "#9333ea" },
                                        },
                                        "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                                    },
                                    "& .MuiIconButton-root": { color: "#e2e8f0" },
                                    "& .MuiTypography-root": { color: "#94a3b8" },
                                },
                            },
                        }}
                    />
                </div>
            </LocalizationProvider>

            {/* Divider */}
            <div className="h-6 w-px bg-white/20" />

            {/* Guest Selector */}
            <GuestSelector guests={guests} onGuestsChange={onGuestsChange} />

            {/* Clear Filters Button */}
            {hasActiveFilters && (
                <>
                    <div className="h-6 w-px bg-white/20" />
                    <button
                        onClick={onClearFilters}
                        className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                        title="Clear all filters"
                    >
                        Clear
                    </button>
                </>
            )}

            {/* Search Button */}
            <button
                onClick={onSearch}
                className="bg-gradient-to-r from-rose-400 to-purple-500 text-white p-2 rounded-full m-1 hover:opacity-90 hover:scale-105 transition-all shadow-md cursor-pointer"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                    className="w-4 h-4"
                    fill="currentColor"
                >
                    <path d="M13 0c7.18 0 13 5.82 13 13 0 2.868-.929 5.519-2.502 7.669l7.916 7.917-2.828 2.828-7.917-7.916A12.942 12.942 0 0 1 13 26C5.82 26 0 20.18 0 13S5.82 0 13 0zm0 4a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"></path>
                </svg>
            </button>
        </div>
    );
};

export default DesktopSearch;
