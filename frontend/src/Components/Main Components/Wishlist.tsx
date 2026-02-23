import React, { useEffect, useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FaPlusCircle } from "react-icons/fa";
import axiosInstance from "../../../public/connect";
import { showSuccess, showError, extractErrorMessage, MESSAGES } from "../../utils/toastMessages";
import type { WishlistItem } from "../../types";
import WishlistCard from "./Cards/WishlistCard";

const Wishlist: React.FC = () => {
  const [wishlistName, setWishlistName] = useState("");
  const [wishlists, setWishlists] = useState<WishlistItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/wishlist/");
        setWishlists(res.data);
      } catch (err: unknown) {
        showError(extractErrorMessage(err, "Failed to load wishlists"));
      }
    })();
  }, []);

  const createWishlist = useCallback(async () => {
    try {
      const res = await axiosInstance.post("/wishlist/", {
        name: wishlistName,
      });
      setWishlists((prev) => [...prev, res.data]);
      showSuccess(MESSAGES.WISHLIST.CREATE_SUCCESS(wishlistName));
      setWishlistName("");
    } catch (err: unknown) {
      showError(extractErrorMessage(err, "Failed to create wishlist"));
    }
  }, [wishlistName]);

  const deleteWishlist = useCallback(async (slug: string) => {
    try {
      await axiosInstance.delete(`/wishlist/${slug}/`);
      setWishlists((prev) => prev.filter((item) => item.slug !== slug));
      showSuccess(MESSAGES.WISHLIST.DELETE_SUCCESS);
    } catch (err: unknown) {
      showError(extractErrorMessage(err, "Failed to delete wishlist"));
    }
  }, []);

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <Dialog.Root>
        { }
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold">Wishlists</h2>

          {wishlists.length > 0 && (
            <Dialog.Trigger asChild>
              <button className="flex items-center gap-2 text-[#2563EB] hover:opacity-80 cursor-pointer">
                <FaPlusCircle size={22} />
                <span className="text-sm font-medium">Add</span>
              </button>
            </Dialog.Trigger>
          )}
        </div>

        { }
        {wishlists.length === 0 && (
          <Dialog.Trigger asChild>
            <div className="flex flex-col items-center justify-center h-[60vh] cursor-pointer text-center">
              <FaPlusCircle size={96} className="text-[#2563EB]" />
              <p className="mt-6 text-lg font-medium text-[#2563EB]">
                Create your first wishlist
              </p>
            </div>
          </Dialog.Trigger>
        )}

        { }
        {wishlists.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {wishlists.map((wishlist) => (
              <WishlistCard
                key={wishlist.slug}
                wishlist={wishlist}
                onDelete={deleteWishlist}
              />
            ))}
          </div>
        )}

        { }
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
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2563EB]"
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
                  className="px-4 py-2 bg-[#2563EB] text-white rounded-lg disabled:opacity-50 cursor-pointer"
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
