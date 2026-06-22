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
            <div className="relative rounded-xl overflow-hidden glass-card group cursor-pointer border border-white/10 hover:border-white/20 hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)] transition-all duration-300">
                {/* Image Section */}
                <div className="relative aspect-4/3 bg-slate-800">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt={listing.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 text-sm">
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
                            className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 hover:bg-white/20 shadow cursor-pointer transition-all hover:scale-110"
                        >
                            <FaHeart
                                size={18}
                                className={isFavorited ? "text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]" : "text-slate-300 hover:text-rose-400 transition-colors"}
                            />
                        </button>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-5">
                    <h3 className="text-lg font-semibold truncate text-white">
                        {listing.title}
                    </h3>

                    <p className="text-sm text-slate-400 mt-0.5">
                        {listing.city}, {listing.country}
                    </p>

                    <p className="text-sm text-slate-400 mt-2 line-clamp-1">
                        {listing.property_type_display} · {listing.bhk_choice} BHK · {listing.bed_choice} Beds · {listing.bathrooms} Bath
                    </p>

                    <p className="mt-4 text-lg font-bold text-white flex items-baseline gap-1">
                        ${listing.price_per_night}
                        <span className="text-sm font-medium text-slate-400">/ night</span>
                    </p>

                    {showHost && (
                        <div className="flex items-center mt-5 pt-4 border-t border-white/10">
                            <img
                                src={listing.host.avatar || "https://placehold.co/100?text=User"}
                                alt={listing.host.username}
                                className="w-8 h-8 rounded-full object-cover border border-white/20"
                            />
                            <p className="ml-3 text-sm font-medium text-slate-300">
                                {listing.host.username}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
});

export default ListingCard;
