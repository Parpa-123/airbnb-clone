import React from "react";
import { Link } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaBars } from "react-icons/fa";
import type { UserProfile } from "../../types/index";

interface UserMenuProps {
    user: UserProfile | null;
    menuOpen: boolean;
    onMenuOpenChange: (open: boolean) => void;
    onLoginClick: () => void;
    onSignupClick: () => void;
    onHostingClick: () => void;
    onLogoutClick: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
    user,
    menuOpen,
    onMenuOpenChange,
    onLoginClick,
    onSignupClick,
    onHostingClick,
    onLogoutClick,
}) => {
    const handleMenuClose = () => onMenuOpenChange(false);

    return (
        <div className="flex items-center gap-2">
            {/* Airbnb your home */}
            <button
                onClick={onHostingClick}
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

            {/* User Menu Dropdown */}
            <DropdownMenu.Root open={menuOpen} onOpenChange={onMenuOpenChange}>
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
                                        handleMenuClose();
                                        onLoginClick();
                                    }}
                                    className="px-4 py-3 text-sm font-medium hover:bg-gray-50 cursor-pointer outline-none"
                                >
                                    Log in
                                </DropdownMenu.Item>

                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onSignupClick();
                                    }}
                                    className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                                >
                                    Sign up
                                </DropdownMenu.Item>

                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onHostingClick();
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
                                        onClick={handleMenuClose}
                                        className="block px-4 py-3 text-sm font-medium hover:bg-gray-50 cursor-pointer outline-none"
                                    >
                                        Profile
                                    </Link>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item asChild>
                                    <Link
                                        to="bookings"
                                        onClick={handleMenuClose}
                                        className="block px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                                    >
                                        Trips
                                    </Link>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item asChild>
                                    <Link
                                        to="/me/wishlist"
                                        onClick={handleMenuClose}
                                        className="lg:hidden block px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                                    >
                                        Wishlists
                                    </Link>
                                </DropdownMenu.Item>

                                {user?.is_host && (
                                    <DropdownMenu.Item asChild>
                                        <Link
                                            to="/me/listings"
                                            onClick={handleMenuClose}
                                            className="block px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                                        >
                                            Manage listings
                                        </Link>
                                    </DropdownMenu.Item>
                                )}

                                <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />

                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onHostingClick();
                                    }}
                                    className="lg:hidden px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer outline-none"
                                >
                                    {user?.is_host ? "List your home" : "Airbnb your home"}
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator className="my-2 h-px bg-gray-200" />

                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onLogoutClick();
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
    );
};

export default UserMenu;
