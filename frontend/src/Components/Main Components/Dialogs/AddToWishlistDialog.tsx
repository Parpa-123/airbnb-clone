import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import axiosInstance from "../../../../public/connect";
import { showSuccess, showError, showInfo, extractErrorMessage, MESSAGES } from "../../../utils/toastMessages";
import type { Listing, Wishlist } from "../../../types";

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
                    const res = await axiosInstance.get<Wishlist[]>("/wishlist/");
                    setWishlists(res.data);
                } catch {
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

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
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

                    {wishlists.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No wishlists yet. Create one first.
                        </p>
                    ) : (
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
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default AddToWishlistDialog;
