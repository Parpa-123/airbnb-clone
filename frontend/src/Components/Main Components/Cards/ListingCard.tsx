import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import type { Listing } from "../../../types";

interface ListingCardProps {
    listing: Listing;
    onHeartClick?: (listing: Listing) => void;
    isFavorited?: boolean;
    showHost?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = React.memo(({
    listing,
    onHeartClick,
    isFavorited = false,
    showHost = true,
}) => {
    const coverImage = listing.images?.[0]?.image;

    return (
        <Link to={`/${listing.title_slug}`}>
            <div className="relative rounded-xl overflow-hidden border-none cursor-pointer group">
                { }
                <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt={listing.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            No image
                        </div>
                    )}

                    {onHeartClick && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onHeartClick(listing);
                            }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow cursor-pointer transition hover:scale-105"
                        >
                            <FaHeart
                                size={18}
                                className={isFavorited ? "text-brand" : "text-gray-400 hover:text-brand"}
                                style={{ color: isFavorited ? "var(--color-brand)" : undefined }}
                            />
                        </button>
                    )}
                </div>

                { }
                <div className="pt-3">
                    <h3 className="text-[15px] font-semibold text-gray-900 truncate">
                        {listing.title}
                    </h3>

                    <p className="text-[15px] text-gray-500 mt-0.5">
                        {listing.city}, {listing.country}
                    </p>

                    <p className="text-[15px] text-gray-500 mt-0.5 truncate">
                        {listing.property_type_display} · {listing.bhk_choice} BHK · {listing.bed_choice} Beds
                    </p>

                    <p className="mt-1 text-[15px] text-gray-900 font-semibold">
                        ${listing.price_per_night}{" "}
                        <span className="font-normal text-gray-900">night</span>
                    </p>

                    {showHost && (
                        <div className="flex items-center mt-4">
                            <img
                                src={listing.host.avatar || "https://placehold.co/100?text=User"}
                                alt={listing.host.username}
                                className="w-8 h-8 rounded-full object-cover bg-gray-200"
                            />
                            <p className="ml-3 text-sm text-gray-700">
                                Host: {listing.host.username}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
});

export default ListingCard;
