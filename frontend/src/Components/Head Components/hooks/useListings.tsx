import { useState, useEffect } from "react";
import type { ListingFilters } from "../types";
import { fetchListings } from "../services/listing.service";
import { useFilterContext } from "../../../services/filterContext";

export function useListings(initialFilters: ListingFilters = {}) {
  const { filters, setFilters } = useFilterContext();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchListings(filters);
        if (mounted) setListings(data);
      } catch (e) {
        console.error("fetchListings error", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [filters]);

  return { filters, setFilters, listings, loading };
}
