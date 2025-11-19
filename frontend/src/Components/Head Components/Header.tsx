import React, { useState } from 'react';
import Img from '../../assets/image.png';
import { FaGlobe, FaBars, FaQuestionCircle, FaUser, FaTimes } from 'react-icons/fa';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';

const Header: React.FC = () => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
        <DropdownMenu.Root open={isOpen} onOpenChange={setOpen}>
          <DropdownMenu.Trigger asChild>
            <FaBars className="text-xl cursor-pointer text-gray-700 hover:text-black transition" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="bottom"
              align="end"
              className="bg-white rounded-md shadow-xl p-2 w-60 text-sm border border-gray-200"
            >
              {/* Help Center */}
              <DropdownMenu.Item className="p-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-gray-100 text-gray-700">
                <FaQuestionCircle />
                Help Center
              </DropdownMenu.Item>

              <hr className="my-2" />

              {/* Become a Host */}
              <DropdownMenu.Item className="p-2 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-medium">Become a Host</span>
                    <span className="text-xs text-gray-500">Lorem ipsum dolor sit amet.</span>
                  </div>
                  <FaUser />
                </div>
              </DropdownMenu.Item>

              <hr className="my-2" />

              {/* Options */}
              <DropdownMenu.Item className="p-2 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700">
                Refer a Host
              </DropdownMenu.Item>

              <DropdownMenu.Item className="p-2 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700">
                Find a Co-Host
              </DropdownMenu.Item>

              <hr className="my-2" />

              {/* Sign in — triggers dialog */}
              <DropdownMenu.Item
                onSelect={(e) => {
                  e.preventDefault();
                  setOpen(false);        // close dropdown first
                  setDialogOpen(true);   // open dialog
                }}
                className="p-2 rounded-md cursor-pointer hover:bg-gray-100 text-gray-700"
              >
                Sign in or Log In
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Dialog Root */}
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

            <Dialog.Content
              className="
                fixed left-1/2 top-1/2 
                -translate-x-1/2 -translate-y-1/2 
                bg-white p-6 rounded-lg shadow-xl 
                w-[90%] max-w-sm 
                border border-gray-200
              "
            >
              <Dialog.Title className="text-lg font-semibold mb-2 text-gray-800">
                Login or Sign in
              </Dialog.Title>

              <Dialog.Description className="text-sm text-gray-600 mb-4">
                Enter your credentials below to access your account.
              </Dialog.Description>

              <hr className="mb-4" />

              <form className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="border border-gray-300 p-2 rounded-md"
                />
                <input
                  type="password"
                  placeholder="Enter your Password"
                  className="border border-gray-300 p-2 rounded-md"
                />
                <button className="bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800 transition">
                  Continue
                </button>
              </form>

              {/* Close Button */}
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
