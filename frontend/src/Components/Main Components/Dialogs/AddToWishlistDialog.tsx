import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import axiosInstance from "../../../services/connect";
import { showSuccess, showError, showInfo, extractErrorMessage, MESSAGES } from "../../../utils/toastMessages";
import type { Listing, Wishlist, PaginatedResponse } from "../../../types";
import { extractResults } from "../../../utils/pagination";

interface AddToWishlistDialogProps {
    listing: Listing | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const AddToWishlistDialog: React.FC<AddToWishlistDialogProps> = ({
    listing,
    open,
    onOpenChange,
}) => {
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);
    const [selectedWishlists, setSelectedWishlists] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            (async () => {
                try {
                    const res = await axiosInstance.get<Wishlist[] | PaginatedResponse<Wishlist>>("/wishlist/");
                    setWishlists(extractResults(res.data));
                } catch {
                    setWishlists([]);
                    showError(MESSAGES.WISHLIST.FETCH_FAILED);
                }
            })();
        }
    }, [open]);

    const handleCheckboxChange = (slug: string) => {
        setSelectedWishlists((prev) =>
            prev.includes(slug)
                ? prev.filter((s) => s !== slug)
                : [...prev, slug]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!listing) {
            showError(MESSAGES.WISHLIST.NO_LISTING);
            return;
        }

        if (selectedWishlists.length === 0) {
            showInfo("Select at least one wishlist");
            return;
        }

        try {
            await axiosInstance.post("/wishlist/bulk-add-to-wishlist/", {
                listing: listing.title_slug,
                wishlist: selectedWishlists,
            });

            showSuccess(MESSAGES.WISHLIST.ADD_SUCCESS);
            onOpenChange(false);
            setSelectedWishlists([]);
        } catch (err: unknown) {
            showError(extractErrorMessage(err, "Failed to add to wishlist"));
        }
    };

    const safeWishlists = Array.isArray(wishlists) ? wishlists : [];

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

                <Dialog.Content
                    className="
            fixed top-1/2 left-1/2
            w-[90vw] max-w-sm
            -translate-x-1/2 -translate-y-1/2
            bg-white rounded-2xl p-6 shadow-2xl z-50
          "
                >
                    <Dialog.Title className="text-lg font-semibold text-gray-900 mb-1">
                        Add to wishlist
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-gray-500 mb-4">
                        Choose which wishlist to save this property to.
                    </Dialog.Description>

                    {safeWishlists.length === 0 ? (
                        <p className="text-sm text-gray-500 py-4 text-center">
                            No wishlists yet. Create one in your wishlists page first.
                        </p>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-3 max-h-60 overflow-y-auto"
                        >
                            {safeWishlists.map((wl) => (
                                <label
                                    key={wl.slug}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedWishlists.includes(wl.slug)}
                                        onChange={() => handleCheckboxChange(wl.slug)}
                                        className="h-4 w-4 rounded text-brand focus:ring-brand"
                                    />
                                    <span className="text-sm font-medium text-gray-800">{wl.name}</span>
                                </label>
                            ))}

                            <div className="mt-6 flex justify-end gap-3 pt-2 border-t border-gray-100">
                                <Dialog.Close asChild>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </Dialog.Close>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-hover cursor-pointer transition-colors shadow-sm"
                                    style={{ backgroundColor: "var(--color-brand)" }}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default AddToWishlistDialog;
