import React, { useEffect, useRef, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import axiosInstance from "../../../../public/connect";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { showError, MESSAGES } from "../../../utils/toastMessages";

import ListMap from "../../../services/MapService";
import DatePickerValue from "../DatePicker";
import { reserveAndPay } from "../../../services/reserveAndPay";

import ReviewSlider, { type Review } from "../../Review Components/ReviewSlider";
import { StarRating } from "../../Review Components/StarRating";




import type { ListingDetail, DatePickerRef } from "../../../types";
import dayjs from "dayjs";



const DetailedPage: React.FC = () => {
  const { slug } = useParams();
  const datePickerRef = useRef<DatePickerRef | null>(null);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [openPhotoGallery, setOpenPhotoGallery] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ checkIn: string | null, checkOut: string | null }>({ checkIn: null, checkOut: null });
  const [ratings, setRatings] = useState({
    accuracy: 0,
    communication: 0,
    cleanliness: 0,
    location: 0,
    check_in: 0,
    value: 0,
  });

  /* ----------------------- FETCH LISTING ----------------------- */

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        const res = await axiosInstance.get<ListingDetail>(
          `/listings/${slug}/`
        );
        setListing(res.data);
      } catch {
        showError(MESSAGES.LISTING.LOAD_FAILED);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  /* ----------------------- FETCH REVIEWS ----------------------- */

  useEffect(() => {
    if (!listing?.id) return;

    (async () => {
      try {
        const res = await axiosInstance.get(`/reviews/${slug}`);
        setReviews(res.data);
      } catch {
        showError(MESSAGES.REVIEW.FETCH_FAILED);
      }
    })();
  }, [listing?.id]);

  /* ----------------------- SUBMIT REVIEW ----------------------- */

  const handleReviewSubmit = async (formData: FormData) => {
    try {
      const payload = {
        review: formData.get("review"),
        ...ratings,
      };

      const res = await axiosInstance.post(
        `/reviews/${slug}`,
        payload
      );

      setReviews(res.data.reviews);
      setOpenReviewDialog(false);

      setRatings({
        accuracy: 0,
        communication: 0,
        cleanliness: 0,
        location: 0,
        check_in: 0,
        value: 0,
      });
    } catch {
      showError(MESSAGES.REVIEW.SUBMIT_FAILED);
    }
  };

  /* ----------------------- INITIALIZE DATES ----------------------- */

  useEffect(() => {
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
    const sixDaysLater = dayjs().add(6, 'day').format('YYYY-MM-DD');
    setSelectedDates({ checkIn: tomorrow, checkOut: sixDaysLater });
  }, []);

  /* ----------------------- LOADING ----------------------- */

  if (loading || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  /* --------------------------- RENDER --------------------------- */

  return (
    <div className="max-w-[1120px] mx-auto px-6 py-8">
      {/* Back Button */}
      <NavLink
        to=".."
        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FF385C] transition-colors mb-4 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-medium">Back</span>
      </NavLink>

      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-900">
        {listing.title}
      </h1>
      <p className="text-gray-600 underline">
        {listing.city}, {listing.country}
      </p>

      {/* Images Grid - Airbnb Style */}
      <div className="mt-6 relative">
        <div className="grid grid-cols-4 gap-2 h-[420px] rounded-xl overflow-hidden">
          {/* Main Large Image */}
          <div className="col-span-2 row-span-2">
            <img
              src={listing.images[0]?.image}
              alt={listing.images[0]?.name || 'Main'}
              className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition"
              onClick={() => setOpenPhotoGallery(true)}
            />
          </div>

          {/* Four Smaller Images */}
          {listing.images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="col-span-1 row-span-1">
              <img
                src={img.image}
                alt={img.name}
                className="w-full h-full object-cover cursor-pointer hover:brightness-90 transition"
                onClick={() => setOpenPhotoGallery(true)}
              />
            </div>
          ))}
        </div>

        {/* View All Photos Button */}
        <button
          onClick={() => setOpenPhotoGallery(true)}
          className="absolute bottom-4 right-4 bg-white border border-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition cursor-pointer flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          View all photos
        </button>

        {/* Photo Gallery Dialog */}
        <Dialog.Root open={openPhotoGallery} onOpenChange={setOpenPhotoGallery}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/90 z-50" />
            <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto">
              <div className="min-h-screen px-4 py-8">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title className="text-2xl font-semibold text-white">
                      {listing.title}
                    </Dialog.Title>
                    <Dialog.Close className="text-white hover:text-gray-300 transition cursor-pointer">
                      <Cross2Icon className="w-6 h-6" />
                    </Dialog.Close>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {listing.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.image}
                        alt={img.name}
                        className="w-full rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {/* Main layout */}
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
            <h2 className="text-xl font-semibold mb-3">
              About this place
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          <div id="amenities" className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">
              Amenities
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {listing.amenities.map((a) => (
                <div key={a.name} className="text-gray-700">
                  ✓ {a.display_name}
                </div>
              ))}
            </div>
          </div>

          <div id="location" className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">
              Location
            </h2>
            <ListMap city={listing.city} country={listing.country} />
          </div>

          {/* ---------------- REVIEWS ---------------- */}
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

            {/* Review Dialog */}
            <Dialog.Root
              open={openReviewDialog}
              onOpenChange={setOpenReviewDialog}
            >
              <Dialog.Content asChild>
                <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
                  <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative">
                    <Dialog.Close className="absolute top-4 right-4 cursor-pointer">
                      <Cross2Icon />
                    </Dialog.Close>

                    <Dialog.Title className="text-xl font-semibold mb-1">
                      Write a review
                    </Dialog.Title>
                    <Dialog.Description className="text-gray-500 mb-4">
                      Share your experience with future guests.
                    </Dialog.Description>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReviewSubmit(
                          new FormData(e.currentTarget)
                        );
                      }}
                      className="space-y-5"
                    >
                      <textarea
                        name="review"
                        required
                        placeholder="What did you like? Anything to improve?"
                        className="w-full border rounded-xl p-3 h-28 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />

                      {(
                        [
                          ["accuracy", "Accuracy"],
                          ["communication", "Communication"],
                          ["cleanliness", "Cleanliness"],
                          ["location", "Location"],
                          ["check_in", "Check-in"],
                          ["value", "Value"],
                        ] as const
                      ).map(([key, label]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium">{label}</span>
                          <StarRating
                            value={ratings[key]}
                            onChange={(v) =>
                              setRatings((r) => ({
                                ...r,
                                [key]: v,
                              }))
                            }
                          />
                        </div>
                      ))}

                      <button
                        type="submit"
                        className="w-full bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-600 transition cursor-pointer"
                      >
                        Submit review
                      </button>
                    </form>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Root>
          </div>
        </div>

        {/* RIGHT – BOOKING */}
        <div className="sticky top-24 h-fit">
          <div className="border rounded-xl shadow-lg p-6 bg-white">
            <h2 className="text-xl font-semibold">
              ${listing.price_per_night}
              <span className="text-base font-normal text-gray-600">
                {" "}
                / night
              </span>
            </h2>

            <div className="mt-5 border rounded-lg overflow-hidden">
              <DatePickerValue
                ref={datePickerRef}
                onChange={(dates) => setSelectedDates(dates)}
              />
            </div>

            <div className="mt-5">
              <button
                onClick={async () => {
                  try {
                    setBookingLoading(true);
                    await reserveAndPay({
                      listingId: listing.id,
                      checkIn:
                        datePickerRef.current?.getDates()?.checkIn,
                      checkOut:
                        datePickerRef.current?.getDates()?.checkOut,
                    });
                  } catch (err: any) {
                    showError(MESSAGES.BOOKING.BOOKING_FAILED);
                  } finally {
                    setBookingLoading(false);
                  }
                }}
                disabled={bookingLoading}
                className="w-full bg-linear-to-r from-[#E61E4D] to-[#D70466] text-white py-3.5 rounded-lg font-semibold disabled:opacity-60 cursor-pointer"
              >
                {bookingLoading ? "Processing..." : "Reserve"}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 mt-3">
              You won’t be charged yet
            </p>
          </div>
          {/* Price Calculation */}
          {selectedDates.checkIn && selectedDates.checkOut && (() => {
            const { checkIn, checkOut } = selectedDates;
            if (!checkIn || !checkOut) return null;
            const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day');
            const pricePerNight = Number(listing.price_per_night);
            const totalPrice = pricePerNight * nights;
            return (
              <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between"><span>Check-in:</span><span>{dayjs(checkIn).format('MMM D, YYYY')}</span></div>
                <div className="flex justify-between"><span>Check-out:</span><span>{dayjs(checkOut).format('MMM D, YYYY')}</span></div>
                <div className="flex justify-between pt-2 border-t"><span>${pricePerNight.toFixed(2)} × {nights} nights</span><span>${totalPrice.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold pt-2 border-t"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default DetailedPage;
