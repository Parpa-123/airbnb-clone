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
  const [isLoginOpen, setLoginOpen] = useState<boolean>(false);
  const [isSignupOpen, setSignupOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDropDownOpen, setDropDown] = useState<boolean>(false);

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

      const res = await axiosInstance.post("/create/", signData);

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

              <DropdownMenu.Item className="p-2 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-medium">Become a Host</span>
                    <span className="text-xs text-gray-500">
                      Lorem ipsum dolor sit amet.
                    </span>
                  </div>
                  <FaUser />
                </div>
              </DropdownMenu.Item>

              <hr className="my-2" />

              {/* LOGIN + SIGNUP (Only when not logged in) */}
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

              {/* LOGOUT (Only when logged in) */}
              {acc && (
                <DropdownMenu.Item
                  onSelect={() => {
                    setAcc(null);
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

        {/* SIGNUP DIALOG */}
        <Dialog.Root open={isSignupOpen} onOpenChange={setSignupOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-sm border border-gray-200">
              <Dialog.Title className="text-lg font-semibold mb-2">
                Sign Up
              </Dialog.Title>

              <form className="flex flex-col gap-4 mt-4" onSubmit={handSignin}>
                
                {/* Username */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700">Username</label>
                  <input
                    name="username"
                    type="text"
                    required
                    className="border border-gray-300 p-2 rounded-md"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="border border-gray-300 p-2 rounded-md"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="border border-gray-300 p-2 rounded-md"
                  />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700">Confirm Password</label>
                  <input
                    name="conf_password"
                    type="password"
                    required
                    className="border border-gray-300 p-2 rounded-md"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-black text-white py-2 rounded-md hover:bg-gray-800 transition flex justify-center"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : "Create Account"}
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
