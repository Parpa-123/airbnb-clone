import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, NavLink } from "react-router-dom";
import dayjs from "dayjs";

import ListMap from "../../../services/MapService";
import ReviewSlider from "../../Review Components/ReviewSlider";

import PhotoGalleryDialog from "./DetailedPageComponents/PhotoGalleryDialog";
import ReviewDialog from "./DetailedPageComponents/ReviewDialog";
import BookingCard from "./DetailedPageComponents/BookingCard";
import { useListingDetails } from "./DetailedPageComponents/useListingDetails";
import { useFilterContext } from "../../../services/filterContext";

import AmenitiesDisplay from "./DetailedPageComponents/AmenitiesDisplay";

import type { DatePickerRef } from "../../../types";

const DetailedPage: React.FC = () => {
  const { slug } = useParams();
  const datePickerRef = useRef<DatePickerRef | null>(null);
  const { filters } = useFilterContext();

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



  if (loading || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-8">
      { }
      <NavLink
        to=".."
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2563EB] transition-colors mb-4 group"
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
        <span className="font-medium">Back</span>
      </NavLink>

      { }
      <h1 className="text-2xl font-semibold text-gray-900">{listing.title}</h1>
      <p className="text-gray-600 underline">
        {listing.city}, {listing.country}
      </p>

      { }
      <PhotoGalleryDialog
        images={listing.images}
        title={listing.title}
        open={openPhotoGallery}
        onOpenChange={setOpenPhotoGallery}
      />

      { }
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-12">
        { }
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

          <AmenitiesDisplay amenities={listing.amenities} />

          <div id="location" className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <ListMap city={listing.city} country={listing.country} />
          </div>

          { }
          <div id="reviews" className="py-10 border-t mt-10 relative">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Reviews</h2>
              <button
                onClick={() => setOpenReviewDialog(true)}
                className="px-4 py-2 border border-black rounded-lg font-medium hover:bg-gray-50 cursor-pointer"
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

        { }
        <BookingCard
          pricePerNight={listing.price_per_night}
          listingId={listing.id}
          datePickerRef={datePickerRef}
          selectedDates={selectedDates}
          onDatesChange={setSelectedDates}
        />
      </div>
    </div>
  );
};

export default DetailedPage;
