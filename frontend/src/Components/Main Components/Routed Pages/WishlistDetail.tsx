import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../public/connect";
import { showError, extractErrorMessage } from "../../../utils/toastMessages";
import type { Listing } from "../../../types";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import ListingCard from "../Cards/ListingCard";

const WishlistDetail: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [wishlistName, setWishlistName] = useState<string>("");

  const { slug } = useParams();
  const navigate = useNavigate();

  /* ---------------- HANDLERS ---------------- */

  const handleRemove = async (listing: Listing) => {
    try {
      await axiosInstance.delete(`/wishlist/${slug}/delete/${listing.title_slug}`);
      setListings((prev) => prev.filter((l) => l.id !== listing.id));
    } catch (err: any) {
      showError(extractErrorMessage(err, "Failed to remove from wishlist"));
    }
  };

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`/wishlist/${slug}`);
        setListings(res.data.listings);
        setWishlistName(res.data.name || "Wishlist");
      } catch (err: any) {
        showError(extractErrorMessage(err, "Failed to load wishlist"));
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
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onHeartClick={handleRemove}
              isFavorited={true}
              showHost={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistDetail;
