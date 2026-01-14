import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../../public/connect";
import { showSuccess, showError, extractErrorMessage, MESSAGES } from "../../../../utils/toastMessages";
import useOptionsService from "../../../../services/optionsService";
import type { ListingEditData } from "./types";

export function useListingPatch() {
    const { id } = useParams<{ id: string }>();
    const [listing, setListing] = useState<ListingEditData | null>(null);
    const [loading, setLoading] = useState(true);
    const { options, fetchOptions } = useOptionsService();

    const fetchListing = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/listings/${Number(id)}/edit/`);
            setListing(res.data);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        fetchListing();
    }, [fetchListing]);

    const onPatch = useCallback(async (payload: Partial<ListingEditData> | FormData) => {
        if (!listing || !id) return;

        const previous = listing;

        if (!(payload instanceof FormData)) {
            setListing((prev) => ({
                ...prev!,
                ...payload,
            } as ListingEditData));
        }

        try {
            await axiosInstance.patch(
                `/listings/${id}/edit/`,
                payload,
                payload instanceof FormData
                    ? { headers: { "Content-Type": "multipart/form-data" } }
                    : undefined
            );

            showSuccess(MESSAGES.LISTING.UPDATE_SUCCESS);

            if (payload instanceof FormData) {
                await fetchListing();
            }


        } catch (error) {
            setListing(previous);
            showError(extractErrorMessage(error, MESSAGES.LISTING.UPDATE_FAILED));
        }
    }, [listing, id, fetchListing]);

    return { listing, loading, options, onPatch };
}
