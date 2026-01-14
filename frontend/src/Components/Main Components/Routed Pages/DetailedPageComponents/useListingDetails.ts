import { useState, useEffect } from "react";
import axiosInstance from "../../../../../public/connect";
import { showError, MESSAGES } from "../../../../utils/toastMessages";
import type { ListingDetail } from "../../../../types";
import type { Review } from "../../../Review Components/ReviewSlider";

interface ReviewPayload {
    review: FormDataEntryValue | null;
    accuracy: number;
    communication: number;
    cleanliness: number;
    location: number;
    check_in: number;
    value: number;
}

interface UseListingDetailsResult {
    listing: ListingDetail | null;
    reviews: Review[];
    loading: boolean;
    submitReview: (payload: ReviewPayload) => Promise<boolean>;
}

export function useListingDetails(slug: string | undefined): UseListingDetailsResult {
    const [listing, setListing] = useState<ListingDetail | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        (async () => {
            try {
                const res = await axiosInstance.get<ListingDetail>(`/listings/${slug}/`);
                setListing(res.data);
            } catch {
                showError(MESSAGES.LISTING.LOAD_FAILED);
            } finally {
                setLoading(false);
            }
        })();
    }, [slug]);

    useEffect(() => {
        if (!listing?.id) return;

        (async () => {
            try {
                const res = await axiosInstance.get(`/reviews/${slug}`);
                setReviews(res.data);
            } catch {
                showError(MESSAGES.REVIEW.FETCH_FAILED);
            }
        })();
    }, [listing?.id, slug]);

    const submitReview = async (payload: ReviewPayload): Promise<boolean> => {
        try {
            const res = await axiosInstance.post(`/reviews/${slug}`, payload);
            setReviews(res.data.reviews);
            return true;
        } catch {
            showError(MESSAGES.REVIEW.SUBMIT_FAILED);
            return false;
        }
    };

    return { listing, reviews, loading, submitReview };
}
