import React, { useEffect, useState, type FormEvent } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import GuestSelector from "./components/GuestSelector";
import type { GuestCounts } from "./components/GuestSelector";
import Img from "../../assets/image.png";
import { resetForm } from "../../../public/redux/slice/slice";
import MultiStepController from "../Multiform Components/MultiStepController";
import { useAuth } from "./hooks/useAuth";
import { useFilterContext } from "../../services/filterContext";
import SignupDialog from "./components/dialogs/SignupDialog";
import ReusableDialog from "./components/ui/ReusableDialog";
import { useNavigate, Link } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toastMessages";
import axiosInstance from "../../../public/connect";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { user, loading, doLogin, doSignup, logout } = useAuth();
  const { setFilters } = useFilterContext();
  const navigate = useNavigate();

  const location = useLocation();

  const searchHide = ['/bookings', '/me']

  const shouldHideSearch = searchHide.some(path => location.pathname.startsWith(path));


  // dialogs
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [hostingOpen, setHostingOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
  const [guests, setGuests] = useState<GuestCounts>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  useEffect(() => {
    if (!hostingOpen) dispatch(resetForm());
  }, [hostingOpen, dispatch]);

  const confirmLogout = () => {
    logout();
    setLogoutOpen(false);
    setMenuOpen(false);
  };

  const confirmResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("Username") as string;
    const newPass = formData.get("NewPassword") as string;
    const confirmPass = formData.get("ConfirmPassword") as string;

    if (!username) {
      showError("Username is required");
      return;
    }

    if (newPass !== confirmPass) {
      showError("Passwords do not match");
      return;
    }

    if (!newPass || newPass.length < 8) {
      showError("Password must be at least 8 characters");
      return;
    }

    try {
      await axiosInstance.patch("/me/", {
        username: username,
        password: newPass,
      });
      showSuccess("Password reset successfully");
      setResetPasswordOpen(false);
      setMenuOpen(false);
    } catch (error) {
      showError("Failed to reset password");
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <img src={Img} alt="Logo" className="h-8 cursor-pointer" />
            </Link>

            {/* Reset Password Dialog - Triggered from Login */}
            <Dialog.Root open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-none" />
                <Dialog.Content className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-96 bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto">
                  <div className="flex items-center justify-between mb-4">
                    <Dialog.Title className="text-xl font-semibold">Reset Password</Dialog.Title>
                    <Dialog.Close className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                      <Cross2Icon className="w-5 h-5" />
                    </Dialog.Close>
                  </div>

                  {/* Reset Password Form */}
                  <form onSubmit={confirmResetPassword} className="space-y-4">
                    <div>
                      <label htmlFor="Username" className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        id="Username"
                        name="Username"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                        placeholder="Enter your username"
                      />
                    </div>

                    <div>
                      <label htmlFor="NewPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="NewPassword"
                        name="NewPassword"
                        required
                        minLength={8}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label htmlFor="ConfirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="ConfirmPassword"
                        name="ConfirmPassword"
                        required
                        minLength={8}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                        placeholder="Confirm new password"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#FF385C] text-white py-3 rounded-lg font-semibold hover:bg-[#E31C5F] transition-colors cursor-pointer"
                    >
                      Reset Password
                    </button>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            {/* Central Search Bar - Mobile-First Responsive */}

            {/* Mobile Search Button - Shows on mobile, hidden on smd+ */}
            {!shouldHideSearch && (
              <div className="flex smd:hidden flex-1 justify-center">
                <Dialog.Root>
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
                    {/* Overlay with pointer-events: none - allows portaled DatePicker/Popover to receive events */}
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-none" />

                    {/* Content panel with pointer-events: auto - only this layer is interactive */}
                    <Dialog.Content className="fixed inset-x-4 top-20 z-50 max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-6 space-y-5 pointer-events-auto"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-xl font-semibold">Search</Dialog.Title>
                        <Dialog.Close className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                          <Cross2Icon className="w-5 h-5" />
                        </Dialog.Close>
                      </div>

                      {/* Mobile Search Form - Stacked Layout */}
                      <div className="space-y-4">
                        {/* Location */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-900 mb-2">Where</label>
                          <input
                            placeholder="Country"
                            className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C] transition"
                            onChange={(e) =>
                              setFilters((p: any) => ({
                                ...p,
                                country: e.target.value || undefined,
                              }))
                            }
                          />
                          <input
                            placeholder="City"
                            className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C] transition mt-2"
                            onChange={(e) =>
                              setFilters((p: any) => ({
                                ...p,
                                city: e.target.value || undefined,
                              }))
                            }
                          />
                        </div>

                        {/* Dates */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <div>
                            <label className="block text-xs font-semibold text-gray-900 mb-2">When</label>
                            <div className="space-y-2">
                              <DatePicker
                                label="Check in"
                                value={checkIn}
                                onChange={(date) => {
                                  if (date && checkOut && (date.isAfter(checkOut) || date.isSame(checkOut))) {
                                    alert("Check-in date must be before check-out date");
                                    return;
                                  }
                                  setCheckIn(date);
                                  setFilters((p: any) => ({
                                    ...p,
                                    check_in: date ? date.format("YYYY-MM-DD") : undefined,
                                  }));
                                }}
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
                                onChange={(date) => {
                                  if (date && checkIn && (date.isBefore(checkIn) || date.isSame(checkIn))) {
                                    alert("Check-out date must be after check-in date");
                                    return;
                                  }
                                  setCheckOut(date);
                                  setFilters((p: any) => ({
                                    ...p,
                                    check_out: date ? date.format("YYYY-MM-DD") : undefined,
                                  }));
                                }}
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

                        {/* Guests */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-900 mb-2">Who</label>
                          <GuestSelector
                            guests={guests}
                            onGuestsChange={(newGuests) => {
                              setGuests(newGuests);
                              setFilters((p: any) => ({
                                ...p,
                                max_guests__gte: newGuests.adults > 0 ? newGuests.adults : undefined,
                                has_pets: newGuests.pets > 0 ? true : undefined,
                                has_children: newGuests.children > 0 ? true : undefined,
                              }));
                            }}
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                          {/* Clear Filters Button */}
                          <button
                            type="button"
                            onClick={() => {
                              // Reset all filters
                              setCheckIn(null);
                              setCheckOut(null);
                              setGuests({
                                adults: 1,
                                children: 0,
                                infants: 0,
                                pets: 0,
                              });
                              setFilters({});
                            }}
                            className="flex-1 border-2 border-gray-300 text-gray-700 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            Clear filters
                          </button>

                          {/* Search Button */}
                          <Dialog.Close asChild>
                            <button
                              onClick={() => navigate("/")}
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
            )}

            {/* Tablet/Desktop Search Bar - Hidden on mobile, shows on smd+ */}
            {!shouldHideSearch && (
              <div className="hidden smd:flex items-center gap-0 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                {/* Where */}
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
                          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C] transition"
                          onChange={(e) =>
                            setFilters((p: any) => ({
                              ...p,
                              country: e.target.value || undefined,
                            }))
                          }
                        />

                        <input
                          placeholder="City"
                          className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C] transition"
                          onChange={(e) =>
                            setFilters((p: any) => ({
                              ...p,
                              city: e.target.value || undefined,
                            }))
                          }
                        />
                      </div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300" />

                {/* Dates - Check-in & Check-out */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="flex items-center gap-0">
                    {/* Check-in DatePicker */}
                    <DatePicker
                      label=""
                      value={checkIn}
                      onChange={(date) => {
                        if (date && checkOut && (date.isAfter(checkOut) || date.isSame(checkOut))) {
                          alert("Check-in date must be before check-out date");
                          return;
                        }
                        setCheckIn(date);
                        setFilters((p: any) => ({
                          ...p,
                          check_in: date ? date.format("YYYY-MM-DD") : undefined,
                        }));
                      }}
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
                                backgroundColor: "#FF385C",
                                "&:hover": {
                                  backgroundColor: "#E31C5F",
                                },
                              },
                            },
                          },
                        },
                      }}
                    />

                    {/* Divider */}
                    <div className="h-6 w-px bg-gray-300" />

                    {/* Check-out DatePicker */}
                    <DatePicker
                      label=""
                      value={checkOut}
                      onChange={(date) => {
                        if (date && checkIn && (date.isBefore(checkIn) || date.isSame(checkIn))) {
                          alert("Check-out date must be after check-in date");
                          return;
                        }
                        setCheckOut(date);
                        setFilters((p: any) => ({
                          ...p,
                          check_out: date ? date.format("YYYY-MM-DD") : undefined,
                        }));
                      }}
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
                                backgroundColor: "#FF385C",
                                "&:hover": {
                                  backgroundColor: "#E31C5F",
                                },
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </LocalizationProvider>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300" />

                {/* Guests - Using GuestSelector */}
                <GuestSelector
                  guests={guests}
                  onGuestsChange={(newGuests) => {
                    setGuests(newGuests);

                    setFilters((p: any) => ({
                      ...p,
                      max_guests__gte: newGuests.adults > 0 ? newGuests.adults : undefined,
                      has_pets: newGuests.pets > 0 ? true : undefined,
                      has_children: newGuests.children > 0 ? true : undefined,
                    }));
                  }}
                />

                {/* Clear Filters Button - Only show if any filters are active */}
                {(checkIn || checkOut || guests.adults > 1 || guests.children > 0 || guests.infants > 0 || guests.pets > 0) && (
                  <>
                    <div className="h-6 w-px bg-gray-300" />
                    <button
                      onClick={() => {
                        setCheckIn(null);
                        setCheckOut(null);
                        setGuests({
                          adults: 1,
                          children: 0,
                          infants: 0,
                          pets: 0,
                        });
                        setFilters({});
                      }}
                      className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                      title="Clear all filters"
                    >
                      Clear
                    </button>
                  </>
                )}

                {/* Search Button */}
                <button
                  onClick={() => navigate("/")}
                  className="bg-[#FF385C] text-white p-2 rounded-full m-1 hover:bg-[#E31C5F] transition-colors cursor-pointer"
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
            )}



            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Airbnb your home */}
              <button
                onClick={() => setHostingOpen(true)}
                className="hidden lg:block px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                {user?.is_host ? "List your home" : "Airbnb your home"}
              </button>

              {/* Wishlist */}
              <Link
                to="/me/wishlist"
                className="hidden lg:block px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                Wishlist
              </Link>



              {/* User Menu */}
              <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-3 pl-3 pr-2 py-1 border border-gray-300 rounded-full hover:shadow-md transition-shadow cursor-pointer">
                    <FaBars className="w-4 h-4 text-gray-700" />
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    sideOffset={8}
                    align="end"
                    className="z-50 w-60 py-2 bg-white border border-gray-200 rounded-xl shadow-xl"
                  >
                    {!user ? (
                      <>
                        <DropdownMenu.Item
                          onSelect={() => {
                            setMenuOpen(false);
                            setLoginOpen(true);
                          }}
                          className="px-4 py-3 text-sm font-medium hover:bg-gray-50 cursor-pointer outline-none"
                        >
                          Log in
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          onSelect={() => {
                            setMenuOpen(false);
                            setSignupOpen(true);
                          }}
                          className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                        >
                          Sign up
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          onSelect={() => {
                            setMenuOpen(false);
                            setHostingOpen(true);
                          }}
                          className="lg:hidden px-4 py-3 text-sm font-medium hover:bg-gray-50 cursor-pointer outline-none"
                        >
                          Airbnb your home
                        </DropdownMenu.Item>


                      </>
                    ) : (
                      <>
                        <DropdownMenu.Item asChild>
                          <Link
                            to="/me"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-3 text-sm font-medium hover:bg-gray-50 cursor-pointer outline-none"
                          >
                            Profile
                          </Link>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item asChild>
                          <Link
                            to="bookings"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                          >
                            Trips
                          </Link>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item asChild>
                          <Link
                            to="/me/wishlist"
                            onClick={() => setMenuOpen(false)}
                            className="lg:hidden block px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                          >
                            Wishlists
                          </Link>
                        </DropdownMenu.Item>

                        {user?.is_host && (
                          <DropdownMenu.Item asChild>
                            <Link
                              to="/me/listings"
                              onClick={() => setMenuOpen(false)}
                              className="block px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                            >
                              Manage listings
                            </Link>
                          </DropdownMenu.Item>
                        )}

                        <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />

                        <DropdownMenu.Item
                          onSelect={() => {
                            setMenuOpen(false);
                            setHostingOpen(true);
                          }}
                          className="lg:hidden px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                        >
                          {user?.is_host ? "List your home" : "Airbnb your home"}
                        </DropdownMenu.Item>



                        <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />

                        <DropdownMenu.Item
                          onSelect={() => {
                            setMenuOpen(false);
                            setLogoutOpen(true);
                          }}
                          className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                        >
                          Log out
                        </DropdownMenu.Item>
                      </>
                    )}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        </div>
      </nav >

      {/* ================= SIGNUP ================= */}
      < SignupDialog
        open={signupOpen}
        onOpenChange={setSignupOpen}
        loading={loading}
        onSubmit={async (fd) => {
          const pwd = String(fd.get("password"));
          const conf = String(fd.get("conf_password"));
          if (pwd !== conf) throw new Error("Passwords do not match");

          await doSignup({
            username: String(fd.get("username")),
            email: String(fd.get("email")),
            password: pwd,
          });
        }}
      />

      {/* ================= LOGIN ================= */}
      <ReusableDialog open={loginOpen} onOpenChange={setLoginOpen}>
        <h3 className="text-lg font-semibold mb-4">Log In</h3>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await doLogin({
              username: String(fd.get("login_username")),
              password: String(fd.get("login_password")),
            });
            setLoginOpen(false);
          }}
        >
          <input
            name="login_username"
            placeholder="Username"
            className="w-full border p-2 rounded-md"
            required
          />
          <input
            name="login_password"
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded-md"
            required
          />

          <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 cursor-pointer">
            {loading ? "Loading..." : "Log In"}
          </button>
        </form>
        <span>Don't have an account? <span onClick={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }} className="text-blue-600 cursor-pointer">Sign Up</span></span>
        <span>Forgot password? <span onClick={() => {
          setLoginOpen(false);
          setResetPasswordOpen(true);
        }} className="text-blue-600 cursor-pointer">Forgot Password</span></span>
      </ReusableDialog>

      {/* ================= LOGOUT ================= */}
      <ReusableDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <h3 className="text-lg font-semibold mb-2">Logout</h3>
        <p className="text-sm text-gray-600">
          Are you sure you want to log out?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setLogoutOpen(false)}
            className="px-4 py-2 border rounded-md cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              confirmLogout();
              navigate("/");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </ReusableDialog>

      {/* ================= HOSTING ================= */}
      <Dialog.Root open={hostingOpen} onOpenChange={setHostingOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[95%] max-w-4xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 z-50">
            <Dialog.Title className="text-2xl font-bold mb-2">
              {user?.is_host ? "List More Places" : "Become a Host"}
            </Dialog.Title>

            <Dialog.Description className="text-sm text-gray-600 mb-6">
              List your property and start earning.
            </Dialog.Description>

            <MultiStepController />

            <Dialog.Close asChild>
              <button
                onClick={() => dispatch(resetForm())}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>



      <Outlet />
    </>
  );
};

export default Header;
