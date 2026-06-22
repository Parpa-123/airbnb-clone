import axiosInstance from "../../../services/connect";
import type { ListingFilters } from "../../../redux/slices/filtersSlice";
import type { Listing, PaginatedResponse } from "../../../types";
import { extractResults } from "../../../utils/pagination";

export async function fetchListings(filters: ListingFilters) {
  const res = await axiosInstance.get<Listing[] | PaginatedResponse<Listing>>(
    "/listings/public/",
    { params: filters }
  );
  return extractResults(res.data);
}
