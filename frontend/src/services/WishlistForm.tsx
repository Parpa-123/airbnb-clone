import { useState } from "react";
import axiosInstance from "../../public/connect";
import type { Wishlist, Listing } from "../Components/Main Components/Routed Pages/PublicListings";
import { toast } from "react-toastify";

interface WishlistFormProps {
  wishlist: Wishlist;
  listing: Listing;
  onSuccess?: () => void;
}

const WishlistForm = ({ wishlist, listing, onSuccess }: WishlistFormProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);

    if (!checked) {
      // If unchecking, just update local state (no API call for removal)
      return;
    }

    // Add to wishlist
    setIsSubmitting(true);
    try {
      await axiosInstance.patch(`/wishlist/${wishlist.slug}/`, {
        listing: listing.id,
      });
      toast.success(`Added to ${wishlist.name}`);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
      setIsChecked(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={isSubmitting}
        className="w-4 h-4 disabled:opacity-50"
      />
      <span className={isSubmitting ? "opacity-50" : ""}>
        {wishlist.name}
      </span>
    </label>
  );
};

export default WishlistForm;