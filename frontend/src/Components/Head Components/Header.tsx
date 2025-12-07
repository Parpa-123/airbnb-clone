import React, { useState, useEffect } from "react";
import Img from "../../assets/image.png";
import {
  FaGlobe,
  FaBars,
  FaQuestionCircle,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import axiosInstance from "../../../public/connect";
import { toast } from "react-toastify";
import MultiStepController from "../Multiform Components/MultiStepController";
import { Outlet } from "react-router-dom";

/* ----------------------------- Types ----------------------------- */
interface LoginType {
  username: string;
  password: string;
}

interface SignupType extends LoginType {
  email: string;
}

interface UserProfile {
  email: string;
  username: string;
  phone: string;
  avatar: string | null;
  is_host: boolean;
}

/* ------------------------- Reusable Input ------------------------ */
const Input = ({ ...props }) => (
  <input {...props} className="border p-2 rounded-md" required />
);

/* ------------------------ Reusable Dialog ------------------------ */
const ReusableDialog = ({ open, setOpen, children }: any) => (
  <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <Dialog.Content
        className="
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm border border-gray-300
        "
      >
        {children}

        <Dialog.Close asChild>
          <button className="absolute top-4 right-4">
            <FaTimes className="text-xl text-gray-700 hover:text-black" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

/* ---------------------------- Component --------------------------- */

const Header: React.FC = () => {
  /* ----------------------- Local State ----------------------- */
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isLogoutDialog, setLogoutDialog] = useState(false);
  const [isDropDownOpen, setDropDown] = useState(false);
  const [hosting, setHosting] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------------------- Load Profile ------------------------ */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axiosInstance
      .get("/me/")
      .then((res) => setUser(res.data as UserProfile))
      .catch(() => toast.error("Session expired — Please sign in again"));
  }, []);

  /* ------------------------- Signup --------------------------- */
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const password = String(fd.get("password"));
    const confirmPassword = String(fd.get("conf_password"));

    if (password !== confirmPassword)
      return toast.error("Passwords don't match");

    const data: SignupType = {
      username: String(fd.get("username")),
      email: String(fd.get("email")),
      password,
    };

    try {
      setLoading(true);
      await axiosInstance.post("/create/", data);

      const tokenRes = await axiosInstance.post("/token/", data);
      localStorage.setItem("accessToken", tokenRes.data.access);
      localStorage.setItem("refreshToken", tokenRes.data.refresh);

      const profile = await axiosInstance.get("/me/");
      setUser(profile.data);
      setSignupOpen(false);

      toast.success("Account created!");
    } catch (error: any) {
      toast.error(error?.response?.data?.email?.[0] || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------- Login --------------------------- */
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const data: LoginType = {
      username: String(fd.get("login_username")),
      password: String(fd.get("login_password")),
    };

    try {
      setLoading(true);

      const res = await axiosInstance.post("/token/", data);
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);

      const profile = await axiosInstance.get("/me/");
      setUser(profile.data);

      setLoginOpen(false);
      toast.success("Logged in!");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------- Logout -------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    toast.info("Logged out");
  };

  /* ============================ JSX ============================ */

  return (
    <>
      <nav className="px-6 py-4 flex items-center justify-between bg-white shadow-md">
        {/* Logo */}
        <img src={Img} className="h-10" />

        {/* Nav Links */}
        <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <li className="cursor-pointer hover:text-black">Home</li>
          <li className="cursor-pointer hover:text-black">Experience</li>
          <li className="cursor-pointer hover:text-black">Services</li>
        </ul>

        <div className="flex items-center gap-4">
          {/* Hosting Button */}
          <span
            className="cursor-pointer text-sm text-gray-700 hover:text-black"
            onClick={() => setHosting(true)}
          >
            {user?.is_host ? "List More Places" : "Become a Host"}
          </span>

          {/* Globe */}
          <FaGlobe className="text-xl cursor-pointer hover:text-black" />

          {/* Dropdown */}
          <DropdownMenu.Root
            open={isDropDownOpen}
            onOpenChange={setDropDown}
          >
            <DropdownMenu.Trigger asChild>
              <FaBars className="text-xl cursor-pointer hover:text-black" />
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white rounded-xl shadow-xl p-3 w-60 text-sm border border-gray-200">
                <DropdownMenu.Item className="p-2 rounded-md hover:bg-gray-100 flex items-center gap-2">
                  <FaQuestionCircle /> Help Center
                </DropdownMenu.Item>

                <hr className="my-2" />

                {!user ? (
                  <>
                    <DropdownMenu.Item
                      onSelect={() => {
                        setDropDown(false);
                        setLoginOpen(true);
                      }}
                      className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                      Log In
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                      onSelect={() => {
                        setDropDown(false);
                        setSignupOpen(true);
                      }}
                      className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                      Sign Up
                    </DropdownMenu.Item>
                  </>
                ) : (
                  <DropdownMenu.Item
                    onSelect={() => setLogoutDialog(true)}
                    className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    Logout ({user.username})
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </nav>

      {/* ---------- Signup Dialog ---------- */}
      <ReusableDialog open={isSignupOpen} setOpen={setSignupOpen}>
        <Dialog.Title className="text-lg font-semibold mb-3">
          Create Account
        </Dialog.Title>

        <form className="flex flex-col gap-4" onSubmit={handleSignup}>
          <Input name="username" placeholder="Username" />
          <Input name="email" type="email" placeholder="Email" />
          <Input name="password" type="password" placeholder="Password" />
          <Input name="conf_password" type="password" placeholder="Confirm Password" />

          <button className="bg-black text-white py-2 rounded-md hover:bg-gray-800 flex justify-center">
            {loading ? <FaSpinner className="animate-spin" /> : "Sign Up"}
          </button>
        </form>
      </ReusableDialog>

      {/* ---------- Login Dialog ---------- */}
      <ReusableDialog open={isLoginOpen} setOpen={setLoginOpen}>
        <Dialog.Title className="text-lg font-semibold mb-3">
          Log In
        </Dialog.Title>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <Input name="login_username" placeholder="Username" />
          <Input name="login_password" type="password" placeholder="Password" />

          <button className="bg-black text-white py-2 rounded-md flex justify-center hover:bg-gray-800">
            {loading ? <FaSpinner className="animate-spin" /> : "Log In"}
          </button>
        </form>
      </ReusableDialog>

      {/* ---------- Logout Dialog ---------- */}
      <ReusableDialog open={isLogoutDialog} setOpen={setLogoutDialog}>
        <Dialog.Title className="text-lg font-semibold">Logout</Dialog.Title>
        <p className="text-sm text-gray-600">
          Are you sure you want to log out?
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <Dialog.Close asChild>
            <button className="px-4 py-2 border rounded-md hover:bg-gray-100">
              Cancel
            </button>
          </Dialog.Close>

          <Dialog.Close asChild>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </Dialog.Close>
        </div>
      </ReusableDialog>

      {/* Hosting Dialog (unchanged layout) */}
      <Dialog.Root open={hosting} onOpenChange={setHosting}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md" />
          <Dialog.Content
            className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white rounded-2xl shadow-2xl p-4 max-w-4xl w-[95%]
            "
          >
            <Dialog.Title className="text-2xl font-bold mb-2">
              {user?.is_host ? "List More Places" : "Become a Host"}
            </Dialog.Title>

            <Dialog.Description className="text-sm text-gray-600 mb-6">
              {user
                ? "List your property and start earning."
                : "Sign up to become a host and start listing your property."}
            </Dialog.Description>

            <MultiStepController />

            <Dialog.Close asChild>
              <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
                <FaTimes className="text-xl" />
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
