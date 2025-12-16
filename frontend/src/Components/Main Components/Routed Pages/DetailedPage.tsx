import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../../public/connect";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ListMap from "../../../services/MapService";
import DatePickerValue from "../DatePicker";
import { toast } from "react-toastify";

/* ----------------------------- INTERFACES ----------------------------- */

export interface Host {
  username: string;
  avatar: string | null;
}

export interface Amenity {
  name: string;
  display_name: string;
}

export interface ListingImage {
  name: string;
  image: string;
  uploaded_at: string;
}

export interface ListingDetail {
  id: number;
  host: Host;
  title: string;
  title_slug: string;
  country: string;
  city: string;
  property_type: string;
  property_type_display: string;
  max_guests: number;
  bhk_choice: number;
  bed_choice: number;
  bathrooms: number;
  price_per_night: string;
  images: ListingImage[];
  created_at: string;
  description: string;
  address: string;
  updated_at: string;
  amenities: Amenity[];
}

/* --------------------------- REF TYPE --------------------------- */

type DatePickerRef = {
  getDates: () => { checkIn: string | null; checkOut: string | null };
  getDateObjects: () => { checkIn: any; checkOut: any };
};

/* --------------------------- COMPONENT --------------------------- */

const DetailedPage: React.FC = () => {

  const location = useLocation();
  const host_type = location.state?.type;

  const { slug } = useParams();

  const datePickerRef = useRef<DatePickerRef | null>(null);

  const [listingDetail, setListingDetail] = useState<ListingDetail | null>(null);
  const [photos, setPhotos] = useState<ListingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openFull, setOpenFull] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const mainPrev = useRef<HTMLButtonElement>(null);
  const mainNext = useRef<HTMLButtonElement>(null);

  const fullPrev = useRef<HTMLButtonElement>(null);
  const fullNext = useRef<HTMLButtonElement>(null);

  // keep as `any` to avoid Swiper type friction
  const fullSwiperRef = useRef<any>(null);

  /* --------------------- KEYBOARD SHORTCUTS --------------------- */
  useEffect(() => {
    if (!openFull) return;

    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenFull(false);
      if (e.key === "ArrowLeft") fullSwiperRef.current?.slidePrev();
      if (e.key === "ArrowRight") fullSwiperRef.current?.slideNext();
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [openFull]);

  /* ----------------------- FETCH DATA ----------------------- */

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axiosInstance.get<ListingDetail>(`/listings/${slug}/`);
        setListingDetail(res.data);
        setPhotos(res.data.images || []);
      } catch (err: any) {
        setError(err?.message ?? "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadData();
  }, [slug]);

  /* ----------------------- RESERVE HANDLER ----------------------- */
  const handleReserve = async () => {
    if (!listingDetail) {
      toast.error("Listing not loaded yet.");
      return;
    }

    const dates = datePickerRef.current?.getDates?.();
    const start_date = dates?.checkIn ?? null;
    const end_date = dates?.checkOut ?? null;

    if (!start_date || !end_date) {
      toast.error("Please select both check-in and check-out dates.");
      return;
    }

    // Basic validation: end must be after start (YYYY-MM-DD lexicographic check works)
    if (end_date <= start_date) {
      toast.error("Check-out must be after check-in.");
      return;
    }

    try {
      // NOTE: serializer earlier used field name "listing" — adjust if your backend expects different key (e.g. listings_id)
      const payload = {
        listing: listingDetail.id,
        start_date,
        end_date,
      };

      await axiosInstance.post("/bookings/create/", payload);

      toast.success("Booking created successfully.");
    } catch (err: any) {
      // Prefer server message if available
      const msg = err?.response?.data?.detail ?? err?.message ?? "Something went wrong.";
      toast.error(msg);
    }
  };

  if (loading) return <p className="flex items-center justify-center min-h-screen text-gray-600">Loading…</p>;
  if (error) return <p className="flex items-center justify-center min-h-screen text-red-600">Error: {error}</p>;
  if (!listingDetail) return <p className="flex items-center justify-center min-h-screen text-gray-600">No data found.</p>;

  /* --------------------------- RENDER --------------------------- */

  return (
    <div className="max-w-[1120px] mx-auto px-6 lg:px-10 py-6">
      {/* Title */}
      <h1 className="text-[26px] leading-[30px] font-semibold text-gray-900 mb-1">{listingDetail.title}</h1>
      <p className="text-gray-700 text-sm font-normal underline">
        {listingDetail.city}, {listingDetail.country}
      </p>

      {/* MAIN SWIPER */}
      <div className="mt-6 relative">
        <button
          ref={mainPrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white hover:scale-105 shadow-lg rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 backdrop-blur-sm cursor-pointer"
          aria-label="Previous"
        >
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          ref={mainNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white hover:scale-105 shadow-lg rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 backdrop-blur-sm cursor-pointer"
          aria-label="Next"
        >
          <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: mainPrev.current,
            nextEl: mainNext.current,
          }}
          pagination={{ clickable: true }}
          onBeforeInit={(swiper) => {
            if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
              // assign DOM refs before init
              (swiper.params.navigation as any).prevEl = mainPrev.current;
              (swiper.params.navigation as any).nextEl = mainNext.current;
            }
          }}
          onInit={(swiper) => {
            swiper.navigation?.init();
            swiper.navigation?.update();
          }}
          className="rounded-xl overflow-hidden"
        >
          {photos.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="w-full h-[450px] overflow-hidden cursor-pointer group"
                onClick={() => {
                  setStartIndex(idx);
                  setOpenFull(true);
                }}
              >
                <img
                  src={img.image}
                  alt={img.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* FULLSCREEN MODAL */}
      {openFull && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex justify-center items-center"
          onClick={() => setOpenFull(false)}
        >
          <button
            ref={fullPrev}
            className="absolute left-6 z-20 bg-white/90 hover:bg-white hover:scale-105 shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 backdrop-blur-sm cursor-pointer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Previous full"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            ref={fullNext}
            className="absolute right-6 z-20 bg-white/90 hover:bg-white hover:scale-105 shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200 backdrop-blur-sm cursor-pointer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Next full"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div onClick={(e) => e.stopPropagation()} className="w-full h-full">
            <Swiper
              modules={[Pagination, Navigation]}
              initialSlide={startIndex}
              pagination={{ clickable: true }}
              navigation={{
                prevEl: fullPrev.current,
                nextEl: fullNext.current,
              }}
              onBeforeInit={(swiper) => {
                if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                  (swiper.params.navigation as any).prevEl = fullPrev.current;
                  (swiper.params.navigation as any).nextEl = fullNext.current;
                }
              }}
              onInit={(swiper) => {
                swiper.navigation?.init();
                swiper.navigation?.update();
              }}
              onSwiper={(swiper) => (fullSwiperRef.current = swiper)}
              className="w-full h-full"
            >
              {photos.map((img, i) => (
                <SwiperSlide key={i}>
                  <div className="flex justify-center items-center w-full h-full">
                    <img
                      src={img.image}
                      alt={img.name}
                      className="max-w-[90%] max-h-[90%] rounded-lg object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <button
            onClick={() => setOpenFull(false)}
            className="absolute top-6 right-6 z-20 text-white hover:bg-white/10 rounded-full p-2 transition-colors duration-200 cursor-pointer"
            aria-label="Close full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* PAGE CONTENT */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
        {/* LEFT SIDE */}
        <div className="md:col-span-2">
          {/* Host Card */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            <img
              src={listingDetail.host.avatar || "https://via.placeholder.com/80"}
              alt="Host Avatar"
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="text-[22px] font-semibold text-gray-900">Hosted by {listingDetail.host.username}</p>
              <p className="text-gray-600 text-[15px] mt-0.5">
                {listingDetail.max_guests} guests · {listingDetail.bed_choice} beds ·{" "}
                {listingDetail.bhk_choice} bedrooms · {listingDetail.bathrooms} baths
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="py-8 border-b border-gray-200">
            <h2 className="text-[22px] font-semibold text-gray-900 mb-4">About this place</h2>
            <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-line">{listingDetail.description}</p>
          </div>

          {/* Amenities */}
          <div className="py-8 border-b border-gray-200">
            <h2 className="text-[22px] font-semibold text-gray-900 mb-6">What this place offers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listingDetail.amenities.map((a) => (
                <div key={a.name} className="flex items-center gap-3 text-gray-900 text-[15px]">
                  <svg className="w-6 h-6 shrink-0 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {a.display_name}
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="py-8">
            <h2 className="text-[22px] font-semibold text-gray-900 mb-4">Where you'll be</h2>
            <div className="rounded-xl overflow-hidden">
              <ListMap city={listingDetail.city} country={listingDetail.country} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Sticky Price Card */}
        <div className="flex flex-col gap-6 md:pl-6">
          <div className="sticky top-24">
            <div className="border border-gray-300 rounded-xl shadow-xl p-6 bg-white">
              {/* Price */}
              <h2 className="text-[22px] font-semibold text-gray-900 flex items-baseline gap-1">
                <span>${listingDetail.price_per_night}</span>
                <span className="text-base font-normal text-gray-600">night</span>
              </h2>

              {/* Date Picker */}
              <div className="mt-6 border border-gray-300 rounded-lg overflow-hidden">
                <DatePickerValue ref={datePickerRef} />
              </div>

              {/* Reserve Button */}
              <button
                className="mt-5 w-full bg-linear-to-r from-[#E61E4D] to-[#D70466] text-white py-3.5 rounded-lg text-base font-semibold hover:from-[#D01346] hover:to-[#C00357] transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                onClick={handleReserve}
              >
                Reserve
              </button>

              <p className="text-gray-600 text-sm mt-3 text-center">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedPage;
