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
                    <button className="flex items-center gap-3 w-full max-w-sm px-4 py-2.5 border border-white/20 glass rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-shadow cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            className="w-5 h-5 text-slate-200"
                            fill="currentColor"
                        >
                            <path d="M13 0c7.18 0 13 5.82 13 13 0 2.868-.929 5.519-2.502 7.669l7.916 7.917-2.828 2.828-7.917-7.916A12.942 12.942 0 0 1 13 26C5.82 26 0 20.18 0 13S5.82 0 13 0zm0 4a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"></path>
                        </svg>
                        <div className="flex-1 text-left">
                            <div className="text-sm font-semibold text-white">Where to?</div>
                            <div className="text-xs text-slate-300">Anywhere · Any week · Add guests</div>
                        </div>
                    </button>
                </Dialog.Trigger>

                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 pointer-events-none" />

                    <Dialog.Content className="fixed inset-x-4 top-20 z-50 max-w-lg mx-auto bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5 pointer-events-auto text-white">
                        <div className="flex items-center justify-between mb-4">
                            <Dialog.Title className="text-xl font-semibold">Search</Dialog.Title>
                            <Dialog.Close className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition-colors text-white">
                                <Cross2Icon className="w-5 h-5" />
                            </Dialog.Close>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Where</label>
                                <input
                                    placeholder="Country"
                                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                    onChange={(e) => onCountryChange(e.target.value)}
                                />
                                <input
                                    placeholder="City"
                                    className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all mt-2"
                                    onChange={(e) => onCityChange(e.target.value)}
                                />
                            </div>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">When</label>
                                    <div className="space-y-3">
                                        <DatePicker
                                            label="Check in"
                                            value={checkIn}
                                            onChange={handleCheckInChange}
                                            minDate={dayjs()}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    size: "small",
                                                    sx: {
                                                        "& .MuiInputBase-root": {
                                                            backgroundColor: "rgba(255,255,255,0.05)",
                                                            borderRadius: "0.75rem",
                                                            color: "white",
                                                            "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                                                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                                            "&.Mui-focused fieldset": { borderColor: "#a855f7" },
                                                        },
                                                        "& .MuiInputLabel-root": { color: "#94a3b8" },
                                                        "& .MuiIconButton-root": { color: "white" }
                                                    }
                                                },
                                                popper: {
                                                    disablePortal: true,
                                                    sx: {
                                                        "& .MuiPaper-root": {
                                                            backgroundColor: "#0f172a",
                                                            color: "#fff",
                                                            border: "1px solid rgba(255,255,255,0.1)",
                                                        },
                                                        "& .MuiPickersDay-root": {
                                                            color: "#e2e8f0",
                                                            "&.Mui-selected": { backgroundColor: "#a855f7" },
                                                            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                                                        },
                                                        "& .MuiIconButton-root": { color: "#e2e8f0" },
                                                        "& .MuiTypography-root": { color: "#94a3b8" },
                                                    }
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
                                                    sx: {
                                                        "& .MuiInputBase-root": {
                                                            backgroundColor: "rgba(255,255,255,0.05)",
                                                            borderRadius: "0.75rem",
                                                            color: "white",
                                                            "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                                                            "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                                                            "&.Mui-focused fieldset": { borderColor: "#a855f7" },
                                                        },
                                                        "& .MuiInputLabel-root": { color: "#94a3b8" },
                                                        "& .MuiIconButton-root": { color: "white" }
                                                    }
                                                },
                                                popper: {
                                                    disablePortal: true,
                                                    sx: {
                                                        "& .MuiPaper-root": {
                                                            backgroundColor: "#0f172a",
                                                            color: "#fff",
                                                            border: "1px solid rgba(255,255,255,0.1)",
                                                        },
                                                        "& .MuiPickersDay-root": {
                                                            color: "#e2e8f0",
                                                            "&.Mui-selected": { backgroundColor: "#a855f7" },
                                                            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                                                        },
                                                        "& .MuiIconButton-root": { color: "#e2e8f0" },
                                                        "& .MuiTypography-root": { color: "#94a3b8" },
                                                    }
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </LocalizationProvider>

                            <div>
                                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Who</label>
                                <div className="p-2 border border-white/10 rounded-xl bg-white/5">
                                    <GuestSelector guests={guests} onGuestsChange={onGuestsChange} />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClearFilters}
                                    className="flex-1 border border-white/20 text-slate-200 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    Clear filters
                                </button>

                                <Dialog.Close asChild>
                                    <button
                                        onClick={onSearch}
                                        className="flex-1 bg-gradient-to-r from-rose-400 to-purple-500 text-white py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
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
