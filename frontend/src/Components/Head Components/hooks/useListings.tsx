import { useState, useEffect } from "react";
import { fetchListings } from "../services/listing_service";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../../redux/store/store";
import { updateFilters } from "../../../redux/slices/filtersSlice";

export function useListings() {
  const { filters } = useSelector((state: RootState) => state.filters);
  const dispatch = useDispatch();

  const setFilters = (newFilters: any) => {
    if (typeof newFilters === "function") {
      // In case callback function is used
      dispatch(updateFilters(newFilters(filters)));
    } else {
      dispatch(updateFilters(newFilters));
    }
  };

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
