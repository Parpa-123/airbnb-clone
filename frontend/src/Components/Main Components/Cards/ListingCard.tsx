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
            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                {/* Image + Heart */}
                <div className="relative aspect-4/3 bg-gray-100">
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
                                className={isFavorited ? "text-[#FF385C]" : "text-gray-400 hover:text-[#FF385C]"}
                            />
                        </button>
                    )}
                </div>

                {/* Info */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">
                        {listing.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {listing.city}, {listing.country}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                        {listing.property_type_display} · {listing.bhk_choice} BHK · {listing.bed_choice} Beds · {listing.bathrooms} Bath
                    </p>

                    <p className="mt-3 text-md font-semibold">
                        ${listing.price_per_night}{" "}
                        <span className="text-sm text-gray-500 font-normal">night</span>
                    </p>

                    {showHost && (
                        <div className="flex items-center mt-4">
                            <img
                                src={listing.host.avatar ?? ""}
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
