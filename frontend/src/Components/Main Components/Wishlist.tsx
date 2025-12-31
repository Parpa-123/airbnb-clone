import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FaPlusCircle, FaEllipsisH } from "react-icons/fa";
import axiosInstance from "../../../public/connect";
import { showSuccess, showError, extractErrorMessage, MESSAGES } from "../../utils/toastMessages";
import { Link } from "react-router-dom";
import type { WishlistItem } from "../../types";

/* ---------------- COMPONENT ---------------- */

const Wishlist: React.FC = () => {
  const [wishlistName, setWishlistName] = useState("");
  const [wishlists, setWishlists] = useState<WishlistItem[]>([]);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/wishlist/");
        setWishlists(res.data);
      } catch (err: any) {
        showError(extractErrorMessage(err, "Failed to load wishlists"));
      }
    })();
  }, []);

  /* ---------------- ACTIONS ---------------- */

  const createWishlist = async () => {
    try {
      const res = await axiosInstance.post("/wishlist/", {
        name: wishlistName,
      });
      setWishlists((prev) => [...prev, res.data]);
      showSuccess(MESSAGES.WISHLIST.CREATE_SUCCESS(wishlistName));
      setWishlistName("");
    } catch (err: any) {
      showError(extractErrorMessage(err, "Failed to create wishlist"));
    }
  };

  const deleteWishlist = async (slug: string) => {
    try {
      await axiosInstance.delete(`/wishlist/${slug}/`);
      setWishlists((prev) => prev.filter((item) => item.slug !== slug));
      showSuccess(MESSAGES.WISHLIST.DELETE_SUCCESS);
    } catch (err: any) {
      showError(extractErrorMessage(err, "Failed to delete wishlist"));
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <Dialog.Root>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Wishlists</h2>

          {wishlists.length > 0 && (
            <Dialog.Trigger asChild>
              <button className="flex items-center gap-2 text-[#FF385C] hover:opacity-80 cursor-pointer">
                <FaPlusCircle size={22} />
                <span className="text-sm font-medium">Add</span>
              </button>
            </Dialog.Trigger>
          )}
        </div>

        {/* Empty State */}
        {wishlists.length === 0 && (
          <Dialog.Trigger asChild>
            <div className="flex flex-col items-center justify-center h-[60vh] cursor-pointer text-center">
              <FaPlusCircle size={96} className="text-[#FF385C]" />
              <p className="mt-6 text-lg font-medium text-[#FF385C]">
                Create your first wishlist
              </p>
            </div>
          </Dialog.Trigger>
        )}

        {/* Wishlist Grid */}
        {wishlists.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {wishlists.map((wishlist) => (
              <div
                key={wishlist.slug}
                className="group relative cursor-pointer"
              >
                {/* Cover Image */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-200">
                  <img
                    src={
                      wishlist.cover_image ||
                      "https://images.unsplash.com/random/800x600?house"
                    }
                    alt={wishlist.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Dropdown Menu */}
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow hover:bg-white cursor-pointer">
                        <FaEllipsisH />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        sideOffset={8}
                        className="w-40 bg-white border rounded-lg shadow-lg p-1"
                      >
                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm rounded hover:bg-gray-100 cursor-pointer"
                        >
                          Edit
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm rounded text-red-600 hover:bg-red-50 cursor-pointer"
                          onClick={() => deleteWishlist(wishlist.slug)}
                        >
                          Delete
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>

                {/* Info */}
                {<Link to={`/wishlist/${wishlist.slug}`}><div className="mt-3">
                  <p className="text-lg font-semibold text-gray-900">
                    {wishlist.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {wishlist.count ?? 0} saved
                  </p>
                </div></Link>}
              </div>
            ))}
          </div>
        )}

        {/* Create Wishlist Dialog */}
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg">
            <Dialog.Title className="text-xl font-semibold mb-2">
              Create Wishlist
            </Dialog.Title>

            <input
              value={wishlistName}
              onChange={(e) => setWishlistName(e.target.value)}
              placeholder="e.g. Mountain Retreats"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FF385C]"
            />

            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild onClick={() => setWishlistName("")}>
                <button className="px-4 py-2 border rounded-lg cursor-pointer">
                  Cancel
                </button>
              </Dialog.Close>

              <Dialog.Close asChild>
                <button
                  onClick={createWishlist}
                  disabled={!wishlistName.trim()}
                  className="px-4 py-2 bg-[#FF385C] text-white rounded-lg disabled:opacity-50 cursor-pointer"
                >
                  Create
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div >
  );
};

export default Wishlist;
