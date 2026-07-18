import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

import Loading from "../../Loading";
import axiosInstance from "../../../services/connect";
import type { Booking, Listing, PaginatedResponse } from "../../../types";
import { extractResults } from "../../../utils/pagination";
import { showError } from "../../../utils/toastMessages";

const statusStyles: Record<string, string> = {
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  ongoing: "bg-sky-50 text-sky-700 ring-sky-600/20",
};

const HostBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedListing = searchParams.get("listing") ?? "";

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const [bookingsResponse, listingsResponse] = await Promise.all([
          axiosInstance.get<Booking[] | PaginatedResponse<Booking>>("/bookings/host/", {
            params: selectedListing ? { listing: selectedListing } : undefined,
          }),
          axiosInstance.get<Listing[] | PaginatedResponse<Listing>>("/listings/private/"),
        ]);
        setBookings(extractResults(bookingsResponse.data));
        setListings(extractResults(listingsResponse.data));
      } catch (error) {
        console.error("Failed to fetch host reservations", error);
        showError("Unable to load your reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedListing]);

  const changeListing = (listingId: string) => {
    setSearchParams(listingId ? { listing: listingId } : {});
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand">Hosting</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">Reservations</h1>
            <p className="mt-2 text-gray-500">See who is staying at your places and when.</p>
          </div>

          <label className="w-full sm:w-72">
            <span className="mb-1 block text-sm font-medium text-gray-700">Property</span>
            <select
              value={selectedListing}
              onChange={(event) => changeListing(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="">All properties</option>
              {listings.map((listing) => (
                <option key={listing.id} value={listing.id}>{listing.title}</option>
              ))}
            </select>
          </label>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-brand/30 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">No reservations yet</h2>
            <p className="mt-2 text-sm text-gray-500">Confirmed reservations for your properties will appear here.</p>
            <Link to="/me/listings" className="mt-5 inline-flex rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-hover">
              Manage listings
            </Link>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[minmax(14rem,1.6fr)_minmax(10rem,1fr)_minmax(11rem,1.1fr)_7rem_6rem] gap-4 border-b border-gray-200 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 lg:grid">
              <span>Property</span><span>Guest</span><span>Stay</span><span>Guests</span><span>Status</span>
            </div>
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => {
                const image = booking.listing.images?.[0]?.image;
                const duration = booking.duration_nights ?? dayjs(booking.end_date).diff(dayjs(booking.start_date), "day");
                const guestTotal = (booking.adults ?? 1) + (booking.children ?? 0) + (booking.infants ?? 0);
                const statusClass = statusStyles[booking.status.toLowerCase()] ?? "bg-gray-100 text-gray-700 ring-gray-500/20";

                return (
                  <article key={booking.id} className="grid gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(14rem,1.6fr)_minmax(10rem,1fr)_minmax(11rem,1.1fr)_7rem_6rem] lg:items-center">
                    <Link to={`/${booking.listing.title_slug}`} className="flex min-w-0 items-center gap-3 group">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : null}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900 group-hover:text-brand">{booking.listing.title}</p>
                        <p className="truncate text-sm text-gray-500">{booking.listing.city}, {booking.listing.country}</p>
                      </div>
                    </Link>

                    <div className="flex items-center gap-2">
                      {booking.guest.avatar ? <img src={booking.guest.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">{booking.guest.username[0]?.toUpperCase()}</span>}
                      <span className="font-medium text-gray-800">{booking.guest.username}</span>
                    </div>

                    <div>
                      <p className="font-medium text-gray-900">{dayjs(booking.start_date).format("MMM D")} – {dayjs(booking.end_date).format("MMM D, YYYY")}</p>
                      <p className="mt-0.5 text-sm text-gray-500">{duration} {duration === 1 ? "night" : "nights"}</p>
                    </div>

                    <p className="text-sm text-gray-700">{guestTotal} {guestTotal === 1 ? "guest" : "guests"}</p>
                    <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusClass}`}>{booking.status}</span>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostBookings;
