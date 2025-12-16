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
import { useListings } from "./hooks/useListings";
import SignupDialog from "./components/dialogs/SignupDialog";
import ReusableDialog from "./components/ui/ReusableDialog";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { user, loading, doLogin, doSignup, logout } = useAuth();
  const { setFilters } = useListings({});
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
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <img src={Img} alt="Logo" className="h-10" />

        {/* ================= DESKTOP FILTERS ================= */}
        <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          {/* Where To */}
          <li>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="px-3 py-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                  Where To
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={6}
                  align="start"
                  className="z-50 w-72 p-4 bg-white border rounded-lg shadow-xl space-y-3"
                >
                  <DropdownMenu.Label className="font-semibold">
                    Location
                  </DropdownMenu.Label>

                  <input
                    placeholder="Country"
                    className="w-full border px-3 py-2 rounded-md"
                    onChange={(e) =>
                      setFilters((p: any) => ({
                        ...p,
                        country: e.target.value || undefined,
                      }))
                    }
                  />

                  <input
                    placeholder="City"
                    className="w-full border px-3 py-2 rounded-md"
                    onChange={(e) =>
                      setFilters((p: any) => ({
                        ...p,
                        city: e.target.value || undefined,
                      }))
                    }
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </li>

          {/* Guests */}
          <li>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="px-3 py-2 border rounded-md hover:bg-gray-50 cursor-pointer">
                  The Troupe
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={6}
                  align="start"
                  className="z-50 w-72 p-4 bg-white border rounded-lg shadow-xl space-y-3"
                >
                  <DropdownMenu.Label className="font-semibold">
                    Guests
                  </DropdownMenu.Label>

                  <input
                    type="number"
                    min={1}
                    placeholder="Min guests"
                    className="w-full border px-3 py-2 rounded-md"
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

                  <input
                    type="number"
                    min={1}
                    placeholder="Max guests"
                    className="w-full border px-3 py-2 rounded-md"
                    onChange={(e) =>
                      setFilters((p: any) => ({
                        ...p,
                        max_guests__lte:
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                      }))
                    }
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </li>
        </ul>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setHostingOpen(true)}
            className="text-sm hover:text-black cursor-pointer"
          >
            {user?.is_host ? "List More Places" : "Become a Host"}
          </button>

          <FaGlobe className="text-xl cursor-pointer hover:text-black" />

          {/* ================= USER MENU ================= */}
          <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenu.Trigger asChild>
              <FaBars className="text-xl cursor-pointer hover:text-black" />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={6}
                align="end"
                className="z-50 w-60 p-3 bg-white border rounded-xl shadow-2xl text-sm"
              >
                <DropdownMenu.Item className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100">
                  <FaQuestionCircle /> Help Center
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />

                {!user ? (
                  <>
                    <DropdownMenu.Item
                      onSelect={() => {
                        setMenuOpen(false);
                        setLoginOpen(true);
                      }}
                      className="p-2 rounded-md hover:bg-gray-100"
                    >
                      Log In
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                      onSelect={() => {
                        setMenuOpen(false);
                        setSignupOpen(true);
                      }}
                      className="p-2 rounded-md hover:bg-gray-100"
                    >
                      Sign Up
                    </DropdownMenu.Item>
                  </>
                ) : (
                  <>
                    <DropdownMenu.Item
                      onSelect={() => {
                        setMenuOpen(false);
                        setLogoutOpen(true);
                      }}
                      className="p-2 rounded-md hover:bg-gray-100"
                    >
                      Logout ({user.username})
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />
                    <DropdownMenu.Item
                      onSelect={() => {
                        setMenuOpen(false);
                        navigate(`/me`);
                      }}
                      className="p-2 rounded-md hover:bg-gray-100"
                    >
                      My Profile
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />
                    <DropdownMenu.Item
                      onSelect={() => {
                        setMenuOpen(false);
                        navigate(`bookings`);
                      }}
                      className="p-2 rounded-md hover:bg-gray-100"
                    >
                      My Bookings
                    </DropdownMenu.Item>
                    {user?.is_host && (
                      <DropdownMenu.Item
                        onSelect={() => {
                          setMenuOpen(false);
                          navigate(`/me/listings`);
                        }}
                        className="p-2 rounded-md hover:bg-gray-100"
                      >
                        My Listings
                      </DropdownMenu.Item>
                    )}
                  </>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
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
