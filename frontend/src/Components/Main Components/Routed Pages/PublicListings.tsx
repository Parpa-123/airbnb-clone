import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../public/connect";
import { showError, extractErrorMessage } from "../../../utils/toastMessages";

import { useFilterContext } from "../../../services/filterContext";
import type { Listing } from "../../../types";
import ListingCard from "../Cards/ListingCard";
import AddToWishlistDialog from "../Dialogs/AddToWishlistDialog";
import Loading from "../../Loading";

/* ---------------- COMPONENT ---------------- */

const PublicListings: React.FC = () => {
  const { filters } = useFilterContext();

  const [listings, setListings] = useState<Listing[]>([]);
  const [activeListing, setActiveListing] = useState<Listing | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FETCH LISTINGS ---------------- */

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

        const res = await axiosInstance.get<Listing[]>(url);
        setListings(res.data);
      } catch (err: unknown) {
        showError(extractErrorMessage(err, "Failed to load listings"));
        setError(extractErrorMessage(err, "Failed to load listings"));
      } finally {
        setLoading(false);
      }
    })();
  }, [filters]);

  /* ---------------- HANDLERS ---------------- */

  const openWishlistDialog = (listing: Listing) => {
    setActiveListing(listing);
    setDialogOpen(true);
  };

  /* ---------------- RENDER ---------------- */

  if (loading) return <Loading />;

  if (error)
    return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">Public Listings</h2>

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
