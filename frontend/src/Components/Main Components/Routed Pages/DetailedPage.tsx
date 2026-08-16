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
import DetailedPageSkeleton from "../../Skeletons/DetailedPageSkeleton";

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
    return <DetailedPageSkeleton />;
  }

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-8">
      {/* Back Button */}
      <NavLink
        to=".."
        className="inline-flex items-center gap-2 text-gray-600 hover:text-brand transition-colors mb-4 group font-medium text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 group-hover:-translate-x-1 transition-transform text-gray-600 group-hover:text-brand"
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
        <span>Back to discovery</span>
      </NavLink>

      {/* Header Info */}
      <div className="space-y-1 mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
          {listing.title}
        </h1>
        <p className="text-sm text-gray-600 underline font-medium">
          {listing.city}, {listing.country}
        </p>
      </div>

      {/* Hero Image / Gallery */}
      <PhotoGalleryDialog
        images={listing.images}
        title={listing.title}
        open={openPhotoGallery}
        onOpenChange={setOpenPhotoGallery}
      />

      {/* Main Layout */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        {/* Left Column */}
        <div className="md:col-span-2">
          {/* Host Info */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Hosted by {listing.host.username}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {listing.max_guests} guests · {listing.beds} beds ·{" "}
                  {listing.bedrooms} bedrooms · {listing.bathrooms} baths
                </p>
              </div>
              <button
                type="button"
                onClick={handleContactHost}
                className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90 cursor-pointer shadow-sm"
                style={{ backgroundColor: "var(--color-brand)" }}
              >
                Contact host
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              About this place
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <AmenitiesDisplay amenities={listing.amenities} />

          {/* Location */}
          <div id="location" className="py-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Where you’ll be
            </h2>
            <p className="text-sm text-gray-600 mb-3 font-medium">
              {listing.city}, {listing.country}
            </p>
            <ListMap city={listing.city} country={listing.country} />
          </div>

          {/* Reviews */}
          <div id="reviews" className="py-8 border-t border-gray-200 mt-8 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Reviews</h2>
              <button
                onClick={() => {
                  if (!localStorage.getItem("accessToken")) {
                    showError("Please log in to write a review");
                    return;
                  }
                  setOpenReviewDialog(true);
                }}
                className="px-4 py-2 border border-gray-900 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition cursor-pointer"
              >
                Write a review
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
          <div className="sticky top-28">
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
