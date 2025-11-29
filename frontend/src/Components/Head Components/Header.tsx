import React, { useState } from "react";
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
  const [isOutDialog, setOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDropDownOpen, setDropDown] = useState(false);

  if(localStorage.getItem('accessToken'))
  {
    ;(async () =>{
      try {
        const res = await axiosInstance.get('/me/');
        setAcc(res.data.username)
      } catch (error:any) {
        toast.error('Sign in Again');
      }
    })()
  }

  const handSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const conf_password = String(formData.get("conf_password"));
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

      // Create user
      await axiosInstance.post("/create/", signData);

      // Auto login
      const res = await axiosInstance.post("/token/", {
        username: signData.username,
        password: signData.password,
      });

      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);

      setAcc(signData.username);
      setSignupOpen(false);
      toast.success("Account created successfully!");

    } catch (error: any) {
      toast.error(error?.response?.data?.email?.[0] || "Signup failed");
    } finally {
      setLoading(false);
    }
  };


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

  /* ------------------------------
      LOGOUT HANDLER
  ------------------------------*/
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAcc(null);
    toast.info("Logged out");
  };

  return (
    <nav className="px-6 py-4 flex items-center justify-between bg-white shadow-md">
      {/* Left Section - Logo */}
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

        {/* DROPDOWN MENU */}
        <DropdownMenu.Root open={isDropDownOpen} onOpenChange={setDropDown}>
          <DropdownMenu.Trigger asChild>
            <FaBars className="text-xl cursor-pointer text-gray-700 hover:text-black transition" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="bottom"
              align="end"
              className="bg-white rounded-xl shadow-xl p-3 w-60 text-sm border border-gray-200"
            >
              <DropdownMenu.Item className="p-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-100 text-gray-700">
                <FaQuestionCircle />
                Help Center
              </DropdownMenu.Item>

              <hr className="my-2" />

              {/* Auth Options */}
              {!acc ? (
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
              ) : (
                <DropdownMenu.Item
                  onSelect={() => {
                    setDropDown(false);
                    setOut(true);
                  }}
                  className="p-2 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700"
                >
                  Logout ({acc})
                </DropdownMenu.Item>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* SIGNUP MODAL */}
        <Dialog.Root open={isSignupOpen} onOpenChange={setSignupOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            <Dialog.Content
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-sm border border-gray-300"
            >
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

        {/* LOGIN MODAL */}
        <Dialog.Root open={isLoginOpen} onOpenChange={setLoginOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            <Dialog.Content
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-sm border border-gray-300"
            >
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

        {/* LOGOUT CONFIRMATION MODAL */}
        <Dialog.Root open={isOutDialog} onOpenChange={setOut}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            <Dialog.Content
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-sm border border-gray-300 flex flex-col gap-4"
            >
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Logout
              </Dialog.Title>

              <p className="text-gray-600 text-sm">
                Are you sure you want to log out?
              </p>

              <div className="flex justify-end gap-3 mt-4">

                {/* Cancel */}
                <Dialog.Close asChild>
                  <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                    Cancel
                  </button>
                </Dialog.Close>

                {/* Confirm Logout */}
                <Dialog.Close asChild>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </Dialog.Close>

              </div>

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
