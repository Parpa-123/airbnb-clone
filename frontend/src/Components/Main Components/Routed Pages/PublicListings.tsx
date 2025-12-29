import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../public/connect";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import * as Dialog from "@radix-ui/react-dialog";

import { useFilterContext } from "../../../services/filterContext";

/* ---------------- TYPES ---------------- */

export interface ListingImage {
  image: string;
  name: string;
}

export interface Listing {
  id: number;
  host: {
    username: string;
    avatar: string;
  };
  title: string;
  title_slug: string;
  country: string;
  city: string;
  property_type_display: string;
  max_guests: number;
  bhk_choice: number;
  bed_choice: number;
  bathrooms: number;
  price_per_night: string;
  images: ListingImage[];
  created_at: string;
}

interface Wishlist {
  slug: string;
  name: string;
}

/* ---------------- COMPONENT ---------------- */

const PublicListings: React.FC = () => {
  const { filters } = useFilterContext();

  const [listings, setListings] = useState<Listing[]>([]);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlists, setSelectedWishlists] = useState<string[]>([]);

  const [activeListing, setActiveListing] = useState<Listing | null>(null);
  const [open, setOpen] = useState(false);

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

        const url = params.toString()
          ? `/listings/public/?${params.toString()}`
          : "/listings/public/";

        const res = await axiosInstance.get<Listing[]>(url);
        setListings(res.data);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message;
        toast.error(msg);
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, [filters]);

  /* ---------------- FETCH WISHLISTS ---------------- */

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get<Wishlist[]>("/wishlist/");
        setWishlists(res.data);
      } catch {
        toast.error("Failed to load wishlists");
      }
    })();
  }, []);

  /* ---------------- HANDLERS ---------------- */

  const openWishlistDialog = (listing: Listing) => {
    if (wishlists.length === 0) {
      toast.info("Please create a wishlist first to add listings");
      return;
    }
    setActiveListing(listing);
    setSelectedWishlists([]);
    setOpen(true);
  };

  const handleCheckboxChange = (slug: string) => {
    setSelectedWishlists((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activeListing) {
      toast.error("No listing selected");
      return;
    }

    if (selectedWishlists.length === 0) {
      toast.info("Select at least one wishlist");
      return;
    }

    try {
      await axiosInstance.post("/wishlist/bulk-add-to-wishlist/", {
        listing: activeListing.title_slug,
        wishlist: selectedWishlists,
      });

      toast.success("Added to wishlist ❤️");
      setOpen(false);
      setSelectedWishlists([]);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to add to wishlist";
      toast.error(msg);
    }
  };

  /* ---------------- RENDER ---------------- */

  if (loading)
    return <div className="p-6 text-gray-600">Loading listings...</div>;

  if (error)
    return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">Public Listings</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {listings.map((item) => (
          <Link key={item.id} to={`/${item.title_slug}`}>
            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer">
              {/* Image + Heart */}
              {item.images?.length > 0 && (
                <div className="relative">
                  <img
                    src={item.images[0].image}
                    alt={item.title}
                    className="w-full h-60 object-cover"
                  />

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openWishlistDialog(item);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow cursor-pointer"
                  >
                    <FaHeart
                      size={18}
                      className="text-gray-500 hover:text-[#FF385C]"
                    />
                  </button>
                </div>
              )}

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold truncate">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {item.city}, {item.country}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  {item.property_type_display} · {item.bhk_choice} BHK ·{" "}
                  {item.bed_choice} Beds · {item.bathrooms} Bath
                </p>

                <p className="mt-3 text-md font-semibold">
                  ${item.price_per_night}{" "}
                  <span className="text-sm text-gray-500 font-normal">
                    night
                  </span>
                </p>

                <div className="flex items-center mt-4">
                  <img
                    src={item.host.avatar}
                    alt={item.host.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <p className="ml-3 text-sm text-gray-700">
                    Host: {item.host.username}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ---------------- WISHLIST MODAL ---------------- */}

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" />

          <Dialog.Content
            className="
              fixed top-1/2 left-1/2
              w-[90vw] max-w-sm
              -translate-x-1/2 -translate-y-1/2
              bg-white rounded-xl p-6 shadow-xl
            "
          >
            <Dialog.Title className="text-lg font-semibold mb-4">
              Add to wishlist
            </Dialog.Title>

            <form
              onSubmit={handleSubmit}
              className="space-y-3 max-h-60 overflow-y-auto"
            >
              {wishlists.map((wl) => (
                <label
                  key={wl.slug}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedWishlists.includes(wl.slug)}
                    onChange={() => handleCheckboxChange(wl.slug)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{wl.name}</span>
                </label>
              ))}

              <div className="mt-6 flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </Dialog.Close>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FF385C] text-white rounded-lg cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default PublicListings;
