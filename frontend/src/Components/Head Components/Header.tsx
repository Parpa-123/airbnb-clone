import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import {
  FaBars,
  FaGlobe,
  FaQuestionCircle,
  FaTimes,
} from "react-icons/fa";

import Img from "../../assets/image.png";
import { resetForm } from "../../../public/redux/slice/slice";
import MultiStepController from "../Multiform Components/MultiStepController";
import { useAuth } from "./hooks/useAuth";
import { useFilterContext } from "../../services/filterContext";
import SignupDialog from "./components/dialogs/SignupDialog";
import ReusableDialog from "./components/ui/ReusableDialog";
import { useNavigate, Link } from "react-router-dom";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { user, loading, doLogin, doSignup, logout } = useAuth();
  const { setFilters } = useFilterContext();
  const navigate = useNavigate();

  // dialogs
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [hostingOpen, setHostingOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!hostingOpen) dispatch(resetForm());
  }, [hostingOpen, dispatch]);

  const confirmLogout = () => {
    logout();
    setLogoutOpen(false);
    setMenuOpen(false);
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

            {/* Central Search Bar - Airbnb Style */}
            <div className="hidden md:flex items-center gap-0 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
              {/* Where */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
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
                        placeholder="Search destinations"
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

              {/* Check in placeholder */}
              <button className="px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                Any week
              </button>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-300" />

              {/* Guests */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="px-6 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                    Add guests
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    sideOffset={8}
                    align="end"
                    className="z-50 w-80 p-6 bg-white border border-gray-200 rounded-3xl shadow-xl"
                  >
                    <DropdownMenu.Label className="text-xs font-semibold text-gray-900 mb-4">
                      Who's coming?
                    </DropdownMenu.Label>

                    <div className="space-y-3">
                      <input
                        type="number"
                        min={1}
                        placeholder="Number of guests"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF385C] transition"
                        onChange={(e) =>
                          setFilters((p: any) => ({
                            ...p,
                            max_guests__gte:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              {/* Search Button */}
              <button className="bg-[#FF385C] text-white p-2 rounded-full m-1 hover:bg-[#E31C5F] transition-colors cursor-pointer">
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

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Airbnb your home */}
              <button
                onClick={() => setHostingOpen(true)}
                className="hidden lg:block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                {user?.is_host ? "List your home" : "Airbnb your home"}
              </button>

              {/* Wishlist */}
              <Link
                to="/me/wishlist"
                className="hidden lg:block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                Wishlist
              </Link>

              {/* Globe */}
              <button className="p-3 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                <FaGlobe className="w-4 h-4 text-gray-700" />
              </button>

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

                        <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />

                        <DropdownMenu.Item className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none">
                          <div className="flex items-center gap-2">
                            <FaQuestionCircle className="text-gray-600" />
                            <span>Help Center</span>
                          </div>
                        </DropdownMenu.Item>
                      </>
                    ) : (
                      <>
                        <DropdownMenu.Item
                          onSelect={() => {
                            setMenuOpen(false);
                            navigate(`/me`);
                          }}
                          className="px-4 py-3 text-sm font-medium hover:bg-gray-50 cursor-pointer outline-none"
                        >
                          Profile
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          onSelect={() => {
                            setMenuOpen(false);
                            navigate(`bookings`);
                          }}
                          className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                        >
                          Trips
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          onSelect={() => {
                            setMenuOpen(false);
                            navigate(`/me/wishlist`);
                          }}
                          className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                        >
                          Wishlists
                        </DropdownMenu.Item>

                        {user?.is_host && (
                          <DropdownMenu.Item
                            onSelect={() => {
                              setMenuOpen(false);
                              navigate(`/me/listings`);
                            }}
                            className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                          >
                            Manage listings
                          </DropdownMenu.Item>
                        )}

                        <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />

                        <DropdownMenu.Item
                          onSelect={() => {
                            setMenuOpen(false);
                            setHostingOpen(true);
                          }}
                          className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                        >
                          {user?.is_host ? "List your home" : "Airbnb your home"}
                        </DropdownMenu.Item>

                        <DropdownMenu.Item className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none">
                          <div className="flex items-center gap-2">
                            <FaQuestionCircle className="text-gray-600" />
                            <span>Help Center</span>
                          </div>
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
      </nav>

      {/* ================= SIGNUP ================= */}
      <SignupDialog
        open={signupOpen}
        setOpen={setSignupOpen}
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
            onClick={confirmLogout}
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
