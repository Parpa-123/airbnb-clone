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
        <div className="hidden smd:flex items-center gap-0 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
            { }
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="px-4 xz:px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                        Anywhere
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        sideOffset={8}
                        align="start"
                        className="z-50 w-80 p-6 bg-white border border-gray-200 rounded-3xl shadow-xl"
                    >
                        <DropdownMenu.Label className="text-xs font-semibold text-gray-900 mb-4">
                            Where to?
                        </DropdownMenu.Label>

                        <div className="space-y-3">
                            <input
                                placeholder="Which Country"
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition"
                                onChange={(e) => onCountryChange(e.target.value)}
                            />

                            <input
                                placeholder="City"
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition"
                                onChange={(e) => onCityChange(e.target.value)}
                            />
                        </div>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            { }
            <div className="h-6 w-px bg-gray-300" />

            { }
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex items-center gap-0">
                    { }
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
                                InputProps: {
                                    disableUnderline: true,
                                },
                                sx: {
                                    width: "110px",
                                    "& .MuiInputBase-root": {
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                                            borderRadius: "24px",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        fontSize: "0.875rem",
                                        padding: 0,
                                        cursor: "pointer",
                                        color: checkIn ? "#222" : "#717171",
                                        "&::placeholder": {
                                            color: "#717171",
                                            opacity: 1,
                                        },
                                    },
                                    "&::before": {
                                        content: '"Check in"',
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "#222",
                                        marginBottom: "2px",
                                    },
                                },
                            },
                            popper: {
                                sx: {
                                    "& .MuiPaper-root": {
                                        borderRadius: "24px",
                                        boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                                        marginTop: "8px",
                                    },
                                    "& .MuiPickersDay-root": {
                                        "&.Mui-selected": {
                                            backgroundColor: "#2563EB",
                                            "&:hover": {
                                                backgroundColor: "#1D4ED8",
                                            },
                                        },
                                    },
                                },
                            },
                        }}
                    />

                    { }
                    <div className="h-6 w-px bg-gray-300" />

                    { }
                    <DatePicker
                        label=""
                        value={checkOut}
                        onChange={handleCheckOutChange}
                        minDate={checkIn ? checkIn.add(1, "day") : dayjs()}
                        slotProps={{
                            textField: {
                                placeholder: "Add date",
                                variant: "standard",
                                InputProps: {
                                    disableUnderline: true,
                                },
                                sx: {
                                    width: "110px",
                                    "& .MuiInputBase-root": {
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                        "&:hover": {
                                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                                            borderRadius: "24px",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        fontSize: "0.875rem",
                                        padding: 0,
                                        cursor: "pointer",
                                        color: checkOut ? "#222" : "#717171",
                                        "&::placeholder": {
                                            color: "#717171",
                                            opacity: 1,
                                        },
                                    },
                                    "&::before": {
                                        content: '"Check out"',
                                        fontSize: "0.75rem",
                                        fontWeight: 600,
                                        color: "#222",
                                        marginBottom: "2px",
                                    },
                                },
                            },
                            popper: {
                                sx: {
                                    "& .MuiPaper-root": {
                                        borderRadius: "24px",
                                        boxShadow: "0 4px 32px rgba(0,0,0,0.15)",
                                        marginTop: "8px",
                                    },
                                    "& .MuiPickersDay-root": {
                                        "&.Mui-selected": {
                                            backgroundColor: "#2563EB",
                                            "&:hover": {
                                                backgroundColor: "#1D4ED8",
                                            },
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </LocalizationProvider>

            { }
            <div className="h-6 w-px bg-gray-300" />

            { }
            <GuestSelector guests={guests} onGuestsChange={onGuestsChange} />

            { }
            {hasActiveFilters && (
                <>
                    <div className="h-6 w-px bg-gray-300" />
                    <button
                        onClick={onClearFilters}
                        className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                        title="Clear all filters"
                    >
                        Clear
                    </button>
                </>
            )}

            { }
            <button
                onClick={onSearch}
                className="bg-[#2563EB] text-white p-2 rounded-full m-1 hover:bg-[#1D4ED8] transition-colors cursor-pointer"
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
