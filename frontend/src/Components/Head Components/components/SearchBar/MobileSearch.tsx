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

interface MobileSearchProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
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

    return (
        <div className="flex smd:hidden flex-1 justify-center">
            <Dialog.Root open={open} onOpenChange={onOpenChange}>
                <Dialog.Trigger asChild>
                    <button className="flex items-center gap-3 w-full max-w-sm px-4 py-2.5 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            className="w-5 h-5 text-gray-600"
                            fill="currentColor"
                        >
                            <path d="M13 0c7.18 0 13 5.82 13 13 0 2.868-.929 5.519-2.502 7.669l7.916 7.917-2.828 2.828-7.917-7.916A12.942 12.942 0 0 1 13 26C5.82 26 0 20.18 0 13S5.82 0 13 0zm0 4a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"></path>
                        </svg>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-semibold text-gray-900">Where to?</div>
                            <div className="text-xs text-gray-500">Anywhere · Any week · Add guests</div>
                        </div>
                    </button>
                </Dialog.Trigger>

                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-none" />

                    <Dialog.Content className="fixed inset-x-4 top-20 z-50 max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-6 space-y-5 pointer-events-auto">
                        <div className="flex items-center justify-between mb-4">
                            <Dialog.Title className="text-xl font-semibold">Search</Dialog.Title>
                            <Dialog.Close className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                                <Cross2Icon className="w-5 h-5" />
                            </Dialog.Close>
                        </div>

                        {}
                        <div className="space-y-4">
                            {}
                            <div>
                                <label className="block text-xs font-semibold text-gray-900 mb-2">Where</label>
                                <input
                                    placeholder="Country"
                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C] transition"
                                    onChange={(e) => onCountryChange(e.target.value)}
                                />
                                <input
                                    placeholder="City"
                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C] transition mt-2"
                                    onChange={(e) => onCityChange(e.target.value)}
                                />
                            </div>

                            {}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-900 mb-2">When</label>
                                    <div className="space-y-2">
                                        <DatePicker
                                            label="Check in"
                                            value={checkIn}
                                            onChange={handleCheckInChange}
                                            minDate={dayjs()}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: "small",
                                                },
                                                popper: {
                                                    disablePortal: true,
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
                                                    fullWidth: true,
                                                    size: "small",
                                                },
                                                popper: {
                                                    disablePortal: true,
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </LocalizationProvider>

                            {}
                            <div>
                                <label className="block text-xs font-semibold text-gray-900 mb-2">Who</label>
                                <GuestSelector guests={guests} onGuestsChange={onGuestsChange} />
                            </div>

                            {}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClearFilters}
                                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                    Clear filters
                                </button>

                                <Dialog.Close asChild>
                                    <button
                                        onClick={onSearch}
                                        className="flex-1 bg-[#FF385C] text-white py-3.5 rounded-lg font-semibold hover:bg-[#E31C5F] transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 32 32"
                                                className="w-4 h-4"
                                                fill="currentColor"
                                            >
                                                <path d="M13 0c7.18 0 13 5.82 13 13 0 2.868-.929 5.519-2.502 7.669l7.916 7.917-2.828 2.828-7.917-7.916A12.942 12.942 0 0 1 13 26C5.82 26 0 20.18 0 13S5.82 0 13 0zm0 4a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"></path>
                                            </svg>
                                            Search
                                        </div>
                                    </button>
                                </Dialog.Close>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
};

export default MobileSearch;
