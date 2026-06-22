import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import ListMap from "../../../services/MapService";
import ReviewSlider from "../../Review Components/ReviewSlider";

import PhotoGalleryDialog from "./DetailedPageComponents/PhotoGalleryDialog";
import ReviewDialog from "./DetailedPageComponents/ReviewDialog";
import BookingCard from "./DetailedPageComponents/BookingCard";
import { useListingDetails } from "./DetailedPageComponents/useListingDetails";
import { useSelector } from "react-redux";
import { type RootState } from "../../../redux/store/store";
import { getOrCreateListingRoom } from "../../../services/chatService";
import { showError } from "../../../utils/toastMessages";

import AmenitiesDisplay from "./DetailedPageComponents/AmenitiesDisplay";

import type { DatePickerRef } from "../../../types";

const DetailedPage: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const datePickerRef = useRef<DatePickerRef | null>(null);
  const { filters } = useSelector((state: RootState) => state.filters);

  const { listing, reviews, loading, submitReview } = useListingDetails(slug);

  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openPhotoGallery, setOpenPhotoGallery] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{
    checkIn: string | null;
    checkOut: string | null;
  }>({ checkIn: null, checkOut: null });

  useEffect(() => {
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");
    const sixDaysLater = dayjs().add(6, "day").format("YYYY-MM-DD");

    setSelectedDates({
      checkIn: filters.check_in || tomorrow,
      checkOut: filters.check_out || sixDaysLater,
    });
  }, [filters.check_in, filters.check_out]);

  const handleReviewSubmit = useCallback(async (payload: Parameters<typeof submitReview>[0]) => {
    const success = await submitReview(payload);
    if (success) {
      setOpenReviewDialog(false);
    }
  }, [submitReview]);

  const handleContactHost = useCallback(async () => {
    if (!listing?.id) return;

    if (!localStorage.getItem("accessToken")) {
      showError("Please log in to contact the host");
      return;
    }

    try {
      const room = await getOrCreateListingRoom(listing.id);
      navigate(`/messages/${room.id}`);
    } catch {
      showError("Unable to open chat for this listing");
    }
  }, [listing?.id, navigate]);

  if (loading || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
          <p className="font-medium tracking-widest uppercase text-sm">Loading Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-12 text-slate-200">
      {/* Back Button */}
      <NavLink
        to=".."
        className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors mb-6 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span className="font-medium">Back to discovery</span>
      </NavLink>

      {/* Header Info */}
      <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-2">{listing.title}</h1>
      <p className="text-slate-400 hover:text-white transition cursor-pointer text-lg">
        {listing.city}, {listing.country}
      </p>

      {/* Hero Image / Gallery */}
      <div className="mt-8">
        <PhotoGalleryDialog
          images={listing.images}
          title={listing.title}
          open={openPhotoGallery}
          onOpenChange={setOpenPhotoGallery}
        />
      </div>

      {/* Main Layout */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-16 relative">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-12">
          {/* Host Info */}
          <div className="border-b border-white/10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <p className="text-2xl font-semibold text-white">
                  Experience hosted by {listing.host.username}
                </p>
                <p className="text-slate-400 mt-2 text-lg">
                  {listing.max_guests} guests · {listing.bed_choice} beds ·{" "}
                  {listing.bhk_choice} bedrooms · {listing.bathrooms} baths
                </p>
              </div>
              <button
                type="button"
                onClick={handleContactHost}
                className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md font-medium transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer"
              >
                Contact host
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="py-2 border-b border-white/10 pb-12">
            <h2 className="text-3xl font-semibold mb-6 text-white tracking-tight">About this space</h2>
            <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <AmenitiesDisplay amenities={listing.amenities} />

          {/* Location */}
          <div id="location" className="py-2 border-b border-white/10 pb-12">
            <h2 className="text-3xl font-semibold mb-8 text-white tracking-tight">Location</h2>
            <div className="rounded-2xl overflow-hidden glass border border-white/10 shadow-2xl relative h-[400px]">
                <ListMap city={listing.city} country={listing.country} />
            </div>
          </div>

          {/* Reviews */}
          <div id="reviews" className="py-2 mt-4 relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <h2 className="text-3xl font-semibold text-white tracking-tight">Guest feedback</h2>
              <button
                onClick={() => setOpenReviewDialog(true)}
                className="px-6 py-3 border border-white/20 rounded-xl font-medium text-white hover:bg-white/10 glass shadow-lg transition-all cursor-pointer"
              >
                Share your experience
              </button>
            </div>

            <ReviewSlider reviews={reviews} />

            <ReviewDialog
              open={openReviewDialog}
              onOpenChange={setOpenReviewDialog}
              onSubmit={handleReviewSubmit}
            />
          </div>
        </div>

        {/* Right Column: Booking Card Sticky */}
        <div className="relative">
            <div className="sticky top-32">
                <BookingCard
                pricePerNight={listing.price_per_night}
                listingId={listing.id}
                datePickerRef={datePickerRef}
                selectedDates={selectedDates}
                onDatesChange={setSelectedDates}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedPage;
