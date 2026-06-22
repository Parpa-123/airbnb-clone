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
            {/* Hosting Link */}
            <button
                onClick={onHostingClick}
                className="hidden lg:block px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
                {user ? (user.is_host ? "List your home" : "Airbnb your home") : "List Your Home"}
            </button>

            {/* Wishlist Link */}
            <Link
                to="/me/wishlist"
                className="hidden lg:block px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
                Wishlist
            </Link>

            {/* User Menu Dropdown */}
            <DropdownMenu.Root open={menuOpen} onOpenChange={onMenuOpenChange}>
                <DropdownMenu.Trigger asChild>
                    <button className="flex items-center gap-3 pl-3 pr-2 py-1 border border-white/20 glass rounded-full hover:shadow-[0_0_15px_rgba(251,113,133,0.3)] transition-all cursor-pointer">
                        <FaBars className="w-4 h-4 text-slate-200" />
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-inner">
                                {user?.username?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        sideOffset={8}
                        align="end"
                        className="z-50 w-60 py-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl text-slate-200"
                    >
                        {!user ? (
                            <>
                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onLoginClick();
                                    }}
                                    className="px-4 py-3 text-sm font-medium hover:bg-white/10 cursor-pointer outline-none transition-colors"
                                >
                                    Log in
                                </DropdownMenu.Item>

                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onSignupClick();
                                    }}
                                    className="px-4 py-3 text-sm hover:bg-white/10 cursor-pointer outline-none transition-colors"
                                >
                                    Sign up
                                </DropdownMenu.Item>

                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onHostingClick();
                                    }}
                                    className="lg:hidden px-4 py-3 text-sm font-medium hover:bg-white/10 cursor-pointer outline-none transition-colors"
                                >
                                    List Your Home
                                </DropdownMenu.Item>
                            </>
                        ) : (
                            <>
                                <DropdownMenu.Item asChild>
                                    <Link
                                        to="/me"
                                        onClick={handleMenuClose}
                                        className="block px-4 py-3 text-sm font-medium hover:bg-white/10 cursor-pointer outline-none transition-colors"
                                    >
                                        Profile
                                    </Link>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item asChild>
                                    <Link
                                        to="bookings"
                                        onClick={handleMenuClose}
                                        className="block px-4 py-3 text-sm hover:bg-white/10 cursor-pointer outline-none transition-colors"
                                    >
                                        Trips
                                    </Link>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item asChild>
                                    <Link
                                        to="/messages"
                                        onClick={handleMenuClose}
                                        className="block px-4 py-3 text-sm hover:bg-white/10 cursor-pointer outline-none transition-colors"
                                    >
                                        Messages
                                    </Link>
                                </DropdownMenu.Item>

                                <DropdownMenu.Item asChild>
                                    <Link
                                        to="/me/wishlist"
                                        onClick={handleMenuClose}
                                        className="lg:hidden block px-4 py-3 text-sm hover:bg-white/10 cursor-pointer outline-none transition-colors"
                                    >
                                        Wishlists
                                    </Link>
                                </DropdownMenu.Item>

                                {user?.is_host && (
                                    <DropdownMenu.Item asChild>
                                        <Link
                                            to="/me/listings"
                                            onClick={handleMenuClose}
                                            className="block px-4 py-3 text-sm hover:bg-white/10 cursor-pointer outline-none transition-colors"
                                        >
                                            Manage listings
                                        </Link>
                                    </DropdownMenu.Item>
                                )}

                                <DropdownMenu.Separator className="my-2 h-px bg-white/10" />

                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onHostingClick();
                                    }}
                                    className="lg:hidden px-4 py-3 text-sm hover:bg-white/10 cursor-pointer outline-none transition-colors"
                                >
                                    {user?.is_host ? "List your home" : "Airbnb your home"}
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator className="my-2 h-px bg-white/10" />

                                <DropdownMenu.Item
                                    onSelect={() => {
                                        handleMenuClose();
                                        onLogoutClick();
                                    }}
                                    className="px-4 py-3 text-sm hover:bg-white/10 cursor-pointer outline-none transition-colors"
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
