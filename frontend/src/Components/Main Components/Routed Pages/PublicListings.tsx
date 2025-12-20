import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../public/connect";
import { type ListingImage } from "./DetailedPage";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import * as Dialog from "@radix-ui/react-dialog";
import WishlistForm from "../../../services/WishlistForm";

/* ---------------- TYPES ---------------- */

export interface Wishlist {
  slug: string;
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

/* ---------------- COMPONENT ---------------- */

const PublicListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);

  const [activeListing, setActiveListing] = useState<Listing | null>(null);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FETCH LISTINGS ---------------- */

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get<Listing[]>("/listings/public/");
        setListings(res.data);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message;
        toast.error(msg);
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
    setActiveListing(listing);
    setOpen(true);
  };

  /* ---------------- RENDER ---------------- */

  if (loading) return <div className="p-6 text-gray-600">Loading listings...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

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
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow"
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

      {/* ---------------- RADIX DIALOG ---------------- */}
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

            <div className="space-y-3 max-h-60 overflow-y-auto">
              <form action="">
              {activeListing && wishlists.map((wl) => (
                <WishlistForm
                  key={wl.slug}
                  wishlist={wl}
                  listing={activeListing}
                  onSuccess={() => setOpen(false)}
                />
              ))}
              </form>
            </div>

            <div className="mt-6 flex justify-end">
              <Dialog.Close asChild>
                <button className="px-4 py-2 border rounded-lg">
                  Close
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default PublicListings;
