import axiosInstance from "../../../../public/connect";
import type { ListingFilters } from "../../../services/filterContext";

export async function fetchListings(filters: ListingFilters) {
  const res = await axiosInstance.get("/listings/public/", { params: filters });
  return res.data;
}
