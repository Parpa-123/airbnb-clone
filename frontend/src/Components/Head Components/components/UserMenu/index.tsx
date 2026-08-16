import React from "react";
import { Link } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaBars } from "react-icons/fa";
import {
    FiUser,
    FiBriefcase,
    FiMessageSquare,
    FiHeart,
    FiHome,
    FiCalendar,
    FiPlusCircle,
    FiLogOut,
    FiLogIn,
    FiUserPlus,
} from "react-icons/fi";
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
            {/* Direct List Home Button */}
            <button
                onClick={onHostingClick}
                className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 rounded-full transition-colors cursor-pointer"
            >
                <span>{user?.is_host ? "Host an experience" : "Airbnb your home"}</span>
            </button>

            {/* Direct Wishlist Button for logged-in users */}
            {user && (
                <Link
                    to="/me/wishlist"
                    className="hidden lg:flex items-center justify-center w-10 h-10 text-gray-600 hover:text-brand hover:bg-gray-100/80 rounded-full transition-colors cursor-pointer"
                    title="Wishlists"
                >
                    <FiHeart className="w-5 h-5" />
                </Link>
            )}

            {/* Direct Messages Button for logged-in users */}
            {user && (
                <Link
                    to="/messages"
                    className="hidden lg:flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-full transition-colors cursor-pointer"
                    title="Messages"
                >
                    <FiMessageSquare className="w-5 h-5" />
                </Link>
            )}

            {/* User Menu Dropdown */}
            <DropdownMenu.Root open={menuOpen} onOpenChange={onMenuOpenChange}>
                <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-3 pl-3.5 pr-1.5 py-1.5 border border-gray-200 hover:border-gray-300 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer group">
                        <FaBars className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                            />
                        ) : (
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-inner"
                                style={{ backgroundColor: "var(--color-brand)" }}
                            >
                                {user?.username?.[0]?.toUpperCase() || <FiUser className="w-4 h-4 text-white" />}
                            </div>
                        )}
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        sideOffset={10}
                        align="end"
                        className="z-50 w-64 py-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12)] text-gray-800 animate-in fade-in-0 zoom-in-95"
                    >
                        {!user ? (
                            <>
                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onLoginClick();
                                    }}
                                    className="flex items-center gap-3 mx-1.5 px-3.5 py-2.5 text-sm font-semibold text-gray-900 rounded-xl hover:bg-gray-100 cursor-pointer outline-none transition-colors"
                                >
                                    <FiLogIn className="w-4 h-4 text-brand" />
                                    <span>Log in</span>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onSignupClick();
                                    }}
                                    className="flex items-center gap-3 mx-1.5 px-3.5 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer outline-none transition-colors"
                                >
                                    <FiUserPlus className="w-4 h-4 text-gray-500" />
                                    <span>Sign up</span>
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator className="my-1.5 h-px bg-gray-100" />

                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onHostingClick();
                                    }}
                                    className="flex items-center gap-3 mx-1.5 px-3.5 py-2.5 text-sm text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer outline-none transition-colors"
                                >
                                    <FiPlusCircle className="w-4 h-4 text-gray-500" />
                                    <span>List your home</span>
                                </DropdownMenu.Item>
                            </>
                        ) : (
                            <>
                                {/* User Info Card */}
                                <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user.username}
                                    </p>
                                    {user.email && (
                                        <p className="text-xs text-gray-500 truncate mt-0.5">
                                            {user.email}
                                        </p>
                                    )}
                                    {user.is_host && (
                                        <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-red-50 text-brand rounded-full border border-red-100">
                                            Host
                                        </span>
                                    )}
                                </div>

                                <DropdownMenu.Item asChild>
                                    <Link
                                        to="/me"
                                        onClick={handleMenuClose}
                                        className="flex items-center gap-3 mx-1.5 px-3.5 py-2 text-sm font-medium text-gray-800 rounded-xl hover:bg-gray-100 cursor-pointer outline-none transition-colors"
                                    >
                                        <FiUser className="w-4 h-4 text-gray-500" />
                                        <span>Account & Profile</span>
                                    </Link>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item asChild>
                                    <Link
                                        to="bookings"
                                        onClick={handleMenuClose}
                                        className="flex items-center gap-3 mx-1.5 px-3.5 py-2 text-sm font-medium text-gray-800 rounded-xl hover:bg-gray-100 cursor-pointer outline-none transition-colors"
                                    >
                                        <FiBriefcase className="w-4 h-4 text-gray-500" />
                                        <span>Trips & Bookings</span>
                                    </Link>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item asChild>
                                    <Link
                                        to="/messages"
                                        onClick={handleMenuClose}
                                        className="flex items-center gap-3 mx-1.5 px-3.5 py-2 text-sm font-medium text-gray-800 rounded-xl hover:bg-gray-100 cursor-pointer outline-none transition-colors"
                                    >
                                        <FiMessageSquare className="w-4 h-4 text-gray-500" />
                                        <span>Messages</span>
                                    </Link>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item asChild>
                                    <Link
                                        to="/me/wishlist"
                                        onClick={handleMenuClose}
                                        className="flex items-center gap-3 mx-1.5 px-3.5 py-2 text-sm font-medium text-gray-800 rounded-xl hover:bg-gray-100 cursor-pointer outline-none transition-colors"
                                    >
                                        <FiHeart className="w-4 h-4 text-gray-500" />
                                        <span>Wishlists</span>
                                    </Link>
                                </DropdownMenu.Item>

                                {user?.is_host && (
                                    <>
                                        <DropdownMenu.Separator className="my-1.5 h-px bg-gray-100" />
                                        <DropdownMenu.Item asChild>
                                            <Link
                                                to="/me/listings"
                                                onClick={handleMenuClose}
                                                className="flex items-center gap-3 mx-1.5 px-3.5 py-2 text-sm font-medium text-gray-800 rounded-xl hover:bg-gray-100 cursor-pointer outline-none transition-colors"
                                            >
                                                <FiHome className="w-4 h-4 text-gray-500" />
                                                <span>Manage Listings</span>
                                            </Link>
                                        </DropdownMenu.Item>
                                        <DropdownMenu.Item asChild>
                                            <Link
                                                to="/me/host/bookings"
                                                onClick={handleMenuClose}
                                                className="flex items-center gap-3 mx-1.5 px-3.5 py-2 text-sm font-medium text-gray-800 rounded-xl hover:bg-gray-100 cursor-pointer outline-none transition-colors"
                                            >
                                                <FiCalendar className="w-4 h-4 text-gray-500" />
                                                <span>Reservations</span>
                                            </Link>
                                        </DropdownMenu.Item>
                                    </>
                                )}

                                <DropdownMenu.Separator className="my-1.5 h-px bg-gray-100" />

                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onHostingClick();
                                    }}
                                    className="flex items-center gap-3 mx-1.5 px-3.5 py-2 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer outline-none transition-colors"
                                >
                                    <FiPlusCircle className="w-4 h-4 text-gray-500" />
                                    <span>Airbnb your home</span>
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator className="my-1.5 h-px bg-gray-100" />

                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onLogoutClick();
                                    }}
                                    className="flex items-center gap-3 mx-1.5 px-3.5 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 cursor-pointer outline-none transition-colors"
                                >
                                    <FiLogOut className="w-4 h-4 text-red-500" />
                                    <span>Log out</span>
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
