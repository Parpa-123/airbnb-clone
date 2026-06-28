import React, { useEffect, useState } from "react";
import axiosInstance from "../../../services/connect";
import { showError, extractErrorMessage } from "../../../utils/toastMessages";

import { useSelector } from "react-redux";
import { type RootState } from "../../../redux/store/store";
import type { Listing, PaginatedResponse } from "../../../types";
import ListingCard from "../Cards/ListingCard";
import AddToWishlistDialog from "../Dialogs/AddToWishlistDialog";
import Loading from "../../Loading";
import { extractResults } from "../../../utils/pagination";

const PublicListings: React.FC = () => {
  const { filters } = useSelector((state: RootState) => state.filters);

  const [nearbyListings, setNearbyListings] = useState<Listing[]>([]);
  const [nearbyCity, setNearbyCity] = useState<string | null>(null);

  const [listings, setListings] = useState<Listing[]>([]);
  const [activeListing, setActiveListing] = useState<Listing | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        const ipData = await ipRes.json();
        if (ipData && ipData.city) {
          setNearbyCity(ipData.city);
          const res = await axiosInstance.get<Listing[] | PaginatedResponse<Listing>>(`/listings/public/?city=${ipData.city}`);
          setNearbyListings(extractResults(res.data));
        }
      } catch (err) {
        // Silently ignore tracking prevention blocks for IP lookup
        console.warn("Could not fetch nearby listings (IP block or network issue).");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (filters.country) params.append("country", filters.country);
        if (filters.city) params.append("city", filters.city);
        if (filters.property_type)
          params.append("property_type", filters.property_type);
        if (filters.price_per_night__gte)
          params.append(
            "price_per_night__gte",
            filters.price_per_night__gte.toString()
          );
        if (filters.price_per_night__lte)
          params.append(
            "price_per_night__lte",
            filters.price_per_night__lte.toString()
          );
        if (filters.max_guests__gte)
          params.append(
            "max_guests__gte",
            filters.max_guests__gte.toString()
          );
        if (filters.max_guests__lte)
          params.append(
            "max_guests__lte",
            filters.max_guests__lte.toString()
          );
        if (filters.check_in)
          params.append("check_in", filters.check_in.toString());
        if (filters.check_out)
          params.append("check_out", filters.check_out.toString());
        if (filters.has_pets)
          params.append("has_pets", filters.has_pets.toString());
        if (filters.has_children)
          params.append("has_children", filters.has_children.toString());

        const url = params.toString()
          ? `/listings/public/?${params.toString()}`
          : "/listings/public/";

        const res = await axiosInstance.get<Listing[] | PaginatedResponse<Listing>>(url);
        setListings(extractResults(res.data));
      } catch (err: unknown) {
        showError(extractErrorMessage(err, "Failed to load listings"));
        setError(extractErrorMessage(err, "Failed to load listings"));
      } finally {
        setLoading(false);
      }
    })();
  }, [filters]);

  const openWishlistDialog = (listing: Listing) => {
    setActiveListing(listing);
    setDialogOpen(true);
  };

  if (loading) return <Loading />;

  if (error)
    return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="px-6 py-10">
      
      {/* Near You Section */}
      {nearbyListings.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <span className="text-green-500">✨</span> Stays near {nearbyCity}
          </h3>
          <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-6 custom-scrollbar">
            {nearbyListings.map((item) => (
              <div key={`nearby-${item.id}`} className="min-w-[320px] w-80 flex-shrink-0 snap-start">
                <ListingCard
                  listing={item}
                  onHeartClick={openWishlistDialog}
                  showHost={true}
                />
              </div>
            ))}
          </div>
          <div className="w-full h-px bg-gray-200 mt-6" />
        </div>
      )}

      {/* Main Discover Section */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Public Listings</h2>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-2xl mx-auto">
          <svg
            className="w-24 h-24 text-gray-300 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No Properties Found
          </h3>
          <p className="text-gray-500 max-w-md">
            No properties match your search criteria. Try adjusting your filters
            or check back later for new listings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {listings.map((item) => (
            <ListingCard
              key={item.id}
              listing={item}
              onHeartClick={openWishlistDialog}
              showHost={true}
            />
          ))}
        </div>
      )}

      {/* Wishlist Dialog */}
      <AddToWishlistDialog
        listing={activeListing}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default PublicListings;
