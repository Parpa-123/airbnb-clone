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

/* --------------------------------- Types --------------------------------- */
interface LoginType {
  username: string;
  password: string;
}

interface SigninType extends LoginType {
  email: string;
}

/* -------------------------------- Component ------------------------------- */
const Header: React.FC = () => {
  const [acc, setAcc] = useState<string | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isOutDialog, setOut] = useState(false);
  const [isDropDownOpen, setDropDown] = useState(false);
  const [hosting, setHosting] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ------------------------------ Load User -------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    axiosInstance
      .get("/me/")
      .then((res) => setAcc(res.data.username))
      .catch(() => toast.error("Sign in Again"));
  }, []);

  /* ------------------------------- Signup ---------------------------------- */
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const confirmPassword = String(fd.get("conf_password"));
    const data: SigninType = {
      username: String(fd.get("username")),
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    };

    if (data.password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/create/", data);

      const res = await axiosInstance.post("/token/", {
        username: data.username,
        password: data.password,
      });

      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);
      setAcc(data.username);

      setSignupOpen(false);
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.email?.[0] || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------- Login ---------------------------------- */
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

      setAcc(data.username);
      setLoginOpen(false);
      toast.success("Logged in!");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------------------- Logout -------------------------------- */
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAcc(null);
    toast.info("Logged out");
  };

  /* ============================ RETURN JSX ================================ */

  return (
    <nav className="px-6 py-4 flex items-center justify-between bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={Img} alt="Site Logo" className="h-10 w-auto" />
      </div>

      {/* Links */}
      <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
        <li className="cursor-pointer hover:text-black">Home</li>
        <li className="cursor-pointer hover:text-black">Experience</li>
        <li className="cursor-pointer hover:text-black">Services</li>
      </ul>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {/* Become a Host */}
        <Dialog.Root open={hosting} onOpenChange={setHosting} modal={false}>
          <Dialog.Trigger asChild>
            <span className="cursor-pointer text-sm text-gray-700 hover:text-black">
              Become a host
            </span>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

            <Dialog.Content className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white rounded-xl shadow-xl p-6 max-w-lg w-[90%]
              border border-gray-200
            ">
              <Dialog.Title className="text-xl font-semibold mb-3">
                Become a Host
              </Dialog.Title>

              {/* FIXED: Swapped statements */}
              <Dialog.Description className="text-sm text-gray-600 mb-5">
                {!acc
                  ? "List your property and start earning."
                  : "Sign up to become a host and start listing your property."}
              </Dialog.Description>

              <MultiStepController />

              <Dialog.Close asChild>
                <button className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Close
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Globe Icon */}
        <FaGlobe className="text-xl cursor-pointer text-gray-700 hover:text-black" />

        {/* Dropdown Menu */}
        <DropdownMenu.Root open={isDropDownOpen} onOpenChange={setDropDown}>
          <DropdownMenu.Trigger asChild>
            <FaBars className="text-xl cursor-pointer text-gray-700 hover:text-black" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="
              bg-white rounded-xl shadow-xl p-3 w-60 text-sm 
              border border-gray-200
            ">
              <DropdownMenu.Item className="p-2 rounded-md flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
                <FaQuestionCircle />
                Help Center
              </DropdownMenu.Item>

              <hr className="my-2" />

              {!acc ? (
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
                  onSelect={() => {
                    setDropDown(false);
                    setOut(true);
                  }}
                  className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                >
                  Logout ({acc})
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Signup Dialog */}
        <Dialog.Root open={isSignupOpen} onOpenChange={setSignupOpen} modal={false}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

            <Dialog.Content className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm border border-gray-300
            ">
              <Dialog.Title className="text-lg font-semibold mb-3">
                Create Account
              </Dialog.Title>

              <form className="flex flex-col gap-4" onSubmit={handleSignup}>
                <input name="username" type="text" placeholder="Username" className="border p-2 rounded-md" required />
                <input name="email" type="email" placeholder="Email" className="border p-2 rounded-md" required />
                <input name="password" type="password" placeholder="Password" className="border p-2 rounded-md" required />
                <input name="conf_password" type="password" placeholder="Confirm Password" className="border p-2 rounded-md" required />

                <button className="bg-black text-white py-2 rounded-md hover:bg-gray-800 flex justify-center">
                  {loading ? <FaSpinner className="animate-spin" /> : "Sign Up"}
                </button>
              </form>

              <Dialog.Close asChild>
                <button className="absolute top-4 right-4">
                  <FaTimes className="text-xl text-gray-700 hover:text-black" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Login Dialog */}
        <Dialog.Root open={isLoginOpen} onOpenChange={setLoginOpen} modal={false}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

            <Dialog.Content className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm border border-gray-300
            ">
              <Dialog.Title className="text-lg font-semibold mb-3">
                Log In
              </Dialog.Title>

              <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                <input name="login_username" type="text" placeholder="Username" className="border p-2 rounded-md" required />
                <input name="login_password" type="password" placeholder="Password" className="border p-2 rounded-md" required />

                <button className="bg-black text-white py-2 rounded-md hover:bg-gray-800 flex justify-center">
                  {loading ? <FaSpinner className="animate-spin" /> : "Log In"}
                </button>
              </form>

              <Dialog.Close asChild>
                <button className="absolute top-4 right-4">
                  <FaTimes className="text-xl text-gray-700 hover:text-black" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Logout Confirmation */}
        <Dialog.Root open={isOutDialog} onOpenChange={setOut} modal={false}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

            <Dialog.Content className="
              fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm border border-gray-300 flex flex-col gap-4
            ">
              <Dialog.Title className="text-lg font-semibold">Logout</Dialog.Title>

              <p className="text-gray-600 text-sm">
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

              <Dialog.Close asChild>
                <button className="absolute top-4 right-4">
                  <FaTimes className="text-xl text-gray-700 hover:text-black" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

      </div>
    </nav>
  );
};

export default Header;
