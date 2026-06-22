import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import axiosInstance from "../../../services/connect";
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
                <Dialog.Overlay className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999]" />

                <Dialog.Content
                    className="
            fixed top-1/2 left-1/2
            w-[90vw] max-w-sm
            -translate-x-1/2 -translate-y-1/2
            glass-card border border-white/10 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] bg-slate-900/90 text-slate-200 rounded-2xl z-[1000]
          "
                >
                    <Dialog.Title className="text-xl font-semibold mb-4 text-white">
                        Add to wishlist
                    </Dialog.Title>

                    {wishlists.length === 0 ? (
                        <p className="text-sm text-slate-400">
                            No wishlists yet. Create one first.
                        </p>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2"
                        >
                            {wishlists.map((wl) => (
                                <label
                                    key={wl.slug}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/5"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedWishlists.includes(wl.slug)}
                                        onChange={() => handleCheckboxChange(wl.slug)}
                                        className="h-4 w-4 accent-purple-500 bg-slate-800 border-white/20 rounded"
                                    />
                                    <span className="text-sm font-medium text-slate-200">{wl.name}</span>
                                </label>
                            ))}

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-white/10">
                                <Dialog.Close asChild>
                                    <button
                                        type="button"
                                        className="px-4 py-2 border border-white/10 rounded-lg text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                </Dialog.Close>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-400 hover:to-pink-400 border border-white/10 rounded-lg cursor-pointer transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
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
