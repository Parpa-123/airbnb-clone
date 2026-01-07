import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaEllipsisH } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { WishlistItem } from "../../../types";

interface WishlistCardProps {
    wishlist: WishlistItem;
    onDelete?: (slug: string) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = React.memo(({
    wishlist,
    onDelete,
}) => {
    return (
        <Link to={`/wishlist/${wishlist.slug}`}>
            <div className="group relative cursor-pointer">
                {/* Cover Image */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-200">
                    <img
                        src={
                            wishlist.cover_image ||
                            "https://images.unsplash.com/random/800x600?house"
                        }
                        alt={wishlist.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Dropdown Menu */}
                    {onDelete && (
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild>
                                <button
                                    onClick={(e) => e.preventDefault()}
                                    className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow hover:bg-white cursor-pointer"
                                >
                                    <FaEllipsisH />
                                </button>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content
                                    sideOffset={8}
                                    className="w-40 bg-white border rounded-lg shadow-lg p-1 z-50"
                                >
                                    <DropdownMenu.Item
                                        className="px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer outline-none"
                                    >
                                        Edit
                                    </DropdownMenu.Item>
                                    <DropdownMenu.Item
                                        className="px-3 py-2 text-sm rounded text-red-600 hover:bg-red-50 cursor-pointer outline-none"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onDelete(wishlist.slug);
                                        }}
                                    >
                                        Delete
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    )}
                </div>

                {/* Info */}
                <div className="mt-3 space-y-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {wishlist.name}
                    </h3>
                    {wishlist.count !== undefined && (
                        <p className="text-sm text-gray-500">
                            {wishlist.count} {wishlist.count === 1 ? "saved" : "saved"}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
});

export default WishlistCard;
