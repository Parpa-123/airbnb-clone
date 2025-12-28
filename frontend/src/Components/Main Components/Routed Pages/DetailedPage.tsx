import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axiosInstance from "../../../../public/connect";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ListMap from "../../../services/MapService";
import DatePickerValue from "../DatePicker";
import { toast } from "react-toastify";
import { reserveAndPay } from "../../../services/reserveAndPay";

/* ----------------------------- INTERFACES ----------------------------- */

interface Host {
  username: string;
  avatar: string | null;
}

interface Amenity {
  name: string;
  display_name: string;
}

interface ListingImage {
  name: string;
  image: string;
}

interface ListingDetail {
  id: number;
  host: Host;
  title: string;
  city: string;
  country: string;
  price_per_night: string;
  description: string;
  max_guests: number;
  bhk_choice: number;
  bed_choice: number;
  bathrooms: number;
  amenities: Amenity[];
  images: ListingImage[];
}

/* --------------------------- DATE PICKER REF --------------------------- */

type DatePickerRef = {
  getDates: () => { checkIn: string | null; checkOut: string | null };
};

/* --------------------------- COMPONENT --------------------------- */

const DetailedPage: React.FC = () => {
  const { slug } = useParams();
  const location = useLocation();

  const datePickerRef = useRef<DatePickerRef | null>(null);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  /* ----------------------- FETCH LISTING ----------------------- */

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axiosInstance.get<ListingDetail>(`/listings/${slug}/`);
        setListing(res.data);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchListing();
  }, [slug]);

  /* ----------------------- HANDLE BOOKING ----------------------- */

  const handleBooking = async () => {
    const dates = datePickerRef.current?.getDates?.();

    if (!listing || !dates?.checkIn || !dates?.checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    try {
      setBookingLoading(true);
      await axiosInstance.post("/bookings/create/", {
        listing: listing.id,
        start_date: dates.checkIn,
        end_date: dates.checkOut,
      });

      toast.success("Booking created successfully!");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || err?.message || "Booking failed";
      toast.error(errorMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  /* ----------------------- LOADING STATES ----------------------- */

  if (loading) {
    return <p className="min-h-screen flex items-center justify-center">Loading…</p>;
  }

  if (error || !listing) {
    return (
      <p className="min-h-screen flex items-center justify-center text-red-600">
        {error ?? "Listing not found"}
      </p>
    );
  }

  /* --------------------------- RENDER --------------------------- */

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-8">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-900">{listing.title}</h1>
      <p className="text-gray-600 underline">
        {listing.city}, {listing.country}
      </p>

      {/* Images */}
      <div className="mt-6">
        <Swiper modules={[Navigation, Pagination]} pagination={{ clickable: true }}>
          {listing.images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={img.image}
                alt={img.name}
                className="w-full h-[420px] object-cover rounded-xl"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Content */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* LEFT */}
        <div className="md:col-span-2">
          <div className="border-b pb-6">
            <p className="text-lg font-semibold">
              Hosted by {listing.host.username}
            </p>
            <p className="text-gray-600 mt-1">
              {listing.max_guests} guests · {listing.bed_choice} beds ·{" "}
              {listing.bhk_choice} bedrooms · {listing.bathrooms} baths
            </p>
          </div>

          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-3">About this place</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
              {listing.amenities.map((a) => (
                <div key={a.name} className="text-gray-700">
                  ✓ {a.display_name}
                </div>
              ))}
            </div>
          </div>

          <div className="py-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <ListMap city={listing.city} country={listing.country} />
          </div>
        </div>

        {/* RIGHT – PRICE CARD */}
        <div className="sticky top-24 h-fit">
          <div className="border rounded-xl shadow-lg p-6 bg-white">
            <h2 className="text-xl font-semibold">
              ${listing.price_per_night}
              <span className="text-base font-normal text-gray-600"> / night</span>
            </h2>

            <div className="mt-5 border rounded-lg overflow-hidden">
              <DatePickerValue ref={datePickerRef} />
            </div>

            <div className="mt-5">
              <button
                onClick={async () => {
                  try {
                    setBookingLoading(true);
                    await reserveAndPay({
                      listingId: listing.id,
                      checkIn: datePickerRef.current?.getDates()?.checkIn,
                      checkOut: datePickerRef.current?.getDates()?.checkOut,
                    });
                  } catch (err: any) {
                    console.error("Booking error:", err);
                    console.error("Error details:", err.response?.data);
                    const errorMsg = err.response?.data?.detail ||
                      JSON.stringify(err.response?.data) ||
                      err.message ||
                      "Booking failed";
                    toast.error(errorMsg);
                  } finally {
                    setBookingLoading(false);
                  }
                }}
                disabled={bookingLoading}
                className="w-full bg-linear-to-r from-[#E61E4D] to-[#D70466] text-white py-3.5 rounded-lg text-base font-semibold hover:from-[#D01346] hover:to-[#C00357] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:opacity-60"
              >
                {bookingLoading ? "Processing..." : "Reserve"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-3">
              You won’t be charged yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedPage;
