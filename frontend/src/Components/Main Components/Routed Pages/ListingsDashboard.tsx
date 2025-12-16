import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../public/connect";
import type { Listing } from "./PublicListings";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";

const ListingsDashboard: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axiosInstance.get("/listings/private/");
        setListings(res.data);
      } catch (error: any) {
        toast.error("Failed to fetch listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  /* ---------------- DELETE LISTING ---------------- */
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this listing? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/listings/${id}/delete/`);
      setListings((prev) => prev.filter((l) => l.id !== id));
      toast.success("Listing removed successfully");
    } catch (error) {
      toast.error("Failed to remove listing");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        Loading your listings...
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        You haven’t listed any places yet
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Your Listings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {listings.length} active listing
          {listings.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing) => {
          const coverImage = listing.images?.[0]?.image;

          return (
            <div key={listing.id} className="group">
              {/* Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={listing.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No image
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  {/* Edit */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/me/listings/${listing.id}/edit`);
                    }}
                    className="cursor-pointer bg-white/90 hover:bg-white text-gray-800 text-xs px-3 py-1 rounded-md shadow"
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(listing.id);
                    }}
                    className="cursor-pointer bg-red-500/90 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md shadow"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Content (clickable) */}
              <NavLink to={`/${listing.title_slug}`}>
                <div className="mt-3 space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {listing.city}, {listing.country}
                  </h3>

                  <p className="text-sm text-gray-500 truncate">
                    {listing.property_type_display}
                  </p>

                  <p className="text-sm text-gray-500">
                    {listing.bed_choice} bed · {listing.bathrooms} bath
                  </p>

                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">
                      ${listing.price_per_night}
                    </span>{" "}
                    <span className="text-gray-500">night</span>
                  </p>
                </div>
              </NavLink>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListingsDashboard;
