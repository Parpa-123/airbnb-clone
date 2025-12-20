import React, { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import axiosInstance from "../../../../public/connect";
import { toast } from "react-toastify";
import type { Listing } from "./PublicListings";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaArrowLeft, FaPlus, FaEllipsisH } from "react-icons/fa";

const WishlistDetail: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [wishlistName, setWishlistName] = useState<string>("");

  const { slug } = useParams();
  const navigate = useNavigate();

  /* ---------------- FETCH ---------------- */

  const delFunc = async (id: string) => {
    try {
      await axiosInstance.delete(`/wishlist/${slug}/delete/${id}`);
      navigate("/me/wishlist");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`/wishlist/${slug}`);
        setListings(res.data.listings);
        setWishlistName(res.data.name || "Wishlist");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || err.message);
      }
    })();
  }, [slug]);

  /* ---------------- RENDER ---------------- */

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="text-2xl font-semibold">{wishlistName}</h1>
            <p className="text-sm text-gray-500">
              {listings.length} saved
            </p>
          </div>
        </div>

        
      </div>

      {/* ---------- EMPTY STATE ---------- */}
      {listings.length === 0 && (
        <div className="flex items-center justify-center h-[50vh] text-gray-500">
          No listings saved yet
        </div>
      )}

      {/* ---------- LISTINGS GRID ---------- */}
      {listings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            const coverImage = listing.images?.[0]?.image;

            return (
              <div
                key={listing.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/${listing.title_slug}`)}
              >
                {/* Image */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-200">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={listing.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No image
                    </div>
                  )}

                  {/* Heart (remove from wishlist) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info("Remove from wishlist");
                    }}
                    className="absolute top-3 left-3 bg-white rounded-full p-2 shadow hover:scale-105 transition"
                  >
                    <FaHeart className="text-[#FF385C]" />
                  </button>

                  {/* Property Type */}
                  <span className="absolute bottom-3 left-3 bg-white text-xs px-3 py-1 rounded-full shadow">
                    Entire home
                  </span>
                </div>

                {/* Info */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {listing.title}
                    </h3>

                    {/* Dropdown Menu */}
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
                        >
                          <FaEllipsisH className="text-gray-600" size={14} />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content
                          sideOffset={5}
                          className="w-40 bg-white border rounded-lg shadow-lg p-1 z-50"
                        >
                          <DropdownMenu.Item
                            className="px-3 py-2 text-sm rounded text-red-600 hover:bg-red-50 cursor-pointer outline-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              delFunc(listing.title_slug);
                              
                            }}
                          >
                            Remove
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </div>

                  <p className="text-sm text-gray-500">
                    {listing.city}, {listing.country}
                  </p>

                  <p className="text-sm text-gray-500">
                    {listing.bed_choice} beds · {listing.max_guests} guests
                  </p>

                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">
                      ${listing.price_per_night}
                    </span>{" "}
                    night
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
};

export default WishlistDetail;
