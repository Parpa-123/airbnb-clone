import React, { useState } from "react";
import Img from "../../assets/image.png";
import {
  FaGlobe,
  FaBars,
  FaQuestionCircle,
  FaUser,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import axiosInstance from "../../../public/connect";
import { toast } from "react-toastify";

interface LoginType {
  username: string;
  password: string;
}

interface SigninType extends LoginType {
  email: string;
}

const Header: React.FC = () => {
  const [acc, setAcc] = useState<string | null>(null);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDropDownOpen, setDropDown] = useState(false);

  // SIGNUP HANDLER
  const handSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const conf_password = String(formData.get("conf_password") || "");

    const signData: SigninType = {
      username: String(formData.get("username")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
    };

    if (signData.password !== conf_password) {
      toast.error("Passwords Don't Match");
      return;
    }

    try {
      setLoading(true);

      // Create account
      await axiosInstance.post("/create/", signData);

      // Auto-login (username-based)
      const res = await axiosInstance.post("/token/", {
        username: signData.username,
        password: signData.password,
      });

      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);

      toast.success(`Welcome ${signData.username}`);
      setAcc(signData.username);
      setSignupOpen(false);
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.username?.[0] ||
        error?.response?.data?.email?.[0] ||
        "Signup failed";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN HANDLER
  const handleLoginForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const loginData: LoginType = {
      username: String(formData.get("login_username")),
      password: String(formData.get("login_password")),
    };

    try {
      setLoading(true);
      const res = await axiosInstance.post("/token/", loginData);

      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);

      setAcc(loginData.username);
      setLoginOpen(false);
      toast.success("Logged in!");

    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="px-6 py-4 flex items-center justify-between bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={Img} alt="Site Logo" className="h-10 w-auto object-contain" />
      </div>

      {/* Nav Links */}
      <ul className="hidden md:flex flex-row gap-6 text-sm font-medium text-gray-700">
        <li className="cursor-pointer hover:text-black transition">Home</li>
        <li className="cursor-pointer hover:text-black transition">Experience</li>
        <li className="cursor-pointer hover:text-black transition">Services</li>
      </ul>

      {/* Right Section */}
      <div className="flex flex-row items-center gap-4">
        <span className="cursor-pointer text-sm text-gray-700 hover:text-black transition">
          Become a host
        </span>

        <FaGlobe className="text-xl cursor-pointer text-gray-700 hover:text-black transition" />

        {/* Dropdown */}
        <DropdownMenu.Root open={isDropDownOpen} onOpenChange={setDropDown}>
          <DropdownMenu.Trigger asChild>
            <FaBars className="text-xl cursor-pointer text-gray-700 hover:text-black transition" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="bottom"
              align="end"
              className="bg-white rounded-md shadow-xl p-2 w-60 text-sm border border-gray-200"
            >
              <DropdownMenu.Item className="p-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-100 text-gray-700">
                <FaQuestionCircle />
                Help Center
              </DropdownMenu.Item>

              <hr className="my-2" />

              {/* LOGIN & SIGNUP */}
              {!acc && (
                <>
                  <DropdownMenu.Item
                    onSelect={() => {
                      setDropDown(false);
                      setLoginOpen(true);
                    }}
                    className="p-2 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700"
                  >
                    Log In
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    onSelect={() => {
                      setDropDown(false);
                      setSignupOpen(true);
                    }}
                    className="p-2 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700"
                  >
                    Sign Up
                  </DropdownMenu.Item>
                </>
              )}

              {/* LOGOUT */}
              {acc && (
                <DropdownMenu.Item
                  onSelect={() => {
                    setAcc(null);
                    localStorage.clear();
                    toast.info("Logged out");
                  }}
                  className="p-2 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700"
                >
                  Logout ({acc})
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* SIGNUP POPUP */}
        <Dialog.Root open={isSignupOpen} onOpenChange={setSignupOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-sm border border-gray-200">
              <Dialog.Title className="text-lg font-semibold mb-3">
                Create Account
              </Dialog.Title>

              <form className="flex flex-col gap-4" onSubmit={handSignin}>
                <input name="username" type="text" placeholder="Username" required className="border border-gray-300 p-2 rounded-md" />
                <input name="email" type="email" placeholder="Email" required className="border border-gray-300 p-2 rounded-md" />
                <input name="password" type="password" placeholder="Password" required className="border border-gray-300 p-2 rounded-md" />
                <input name="conf_password" type="password" placeholder="Confirm Password" required className="border border-gray-300 p-2 rounded-md" />

                <button type="submit" className="bg-black text-white py-2 rounded-md hover:bg-gray-800 transition flex justify-center">
                  {loading ? <FaSpinner className="animate-spin" /> : "Sign Up"}
                </button>
              </form>

              <Dialog.Close asChild>
                <button className="absolute top-4 right-4">
                  <FaTimes className="text-xl text-gray-700 hover:text-black cursor-pointer" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>


        {/* LOGIN POPUP */}
        <Dialog.Root open={isLoginOpen} onOpenChange={setLoginOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-sm border border-gray-200">
              <Dialog.Title className="text-lg font-semibold mb-3">
                Log In
              </Dialog.Title>

              <form className="flex flex-col gap-4" onSubmit={handleLoginForm}>
                <input name="login_username" type="text" placeholder="Username" required className="border border-gray-300 p-2 rounded-md" />
                <input name="login_password" type="password" placeholder="Password" required className="border border-gray-300 p-2 rounded-md" />

                <button type="submit" className="bg-black text-white py-2 rounded-md hover:bg-gray-800 transition flex justify-center">
                  {loading ? <FaSpinner className="animate-spin" /> : "Log In"}
                </button>
              </form>

              <Dialog.Close asChild>
                <button className="absolute top-4 right-4">
                  <FaTimes className="text-xl text-gray-700 hover:text-black cursor-pointer" />
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
