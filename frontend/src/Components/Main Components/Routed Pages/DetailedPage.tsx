import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../public/connect";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { toast } from "react-toastify";

import ListMap from "../../../services/MapService";
import DatePickerValue from "../DatePicker";
import { reserveAndPay } from "../../../services/reserveAndPay";

import ReviewSlider, { type Review } from "../../Review Components/ReviewSlider";
import { StarRating } from "../../Review Components/StarRating";

/* --------------------------- TYPES --------------------------- */

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

type DatePickerRef = {
  getDates: () => { checkIn: string | null; checkOut: string | null };
  getDateObjects: () => { checkIn: any | null; checkOut: any | null };
};

/* --------------------------- COMPONENT --------------------------- */

const DetailedPage: React.FC = () => {
  const { slug } = useParams();
  const datePickerRef = useRef<DatePickerRef | null>(null);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [openReviewDialog, setOpenReviewDialog] = useState(false);
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
        toast.error("Failed to load listing");
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
        toast.error("Failed to fetch reviews");
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
      toast.error("Failed to submit review");
    }
  };

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
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-900">
        {listing.title}
      </h1>
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

          <div className="py-6 border-b">
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

          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">
              Location
            </h2>
            <ListMap city={listing.city} country={listing.country} />
          </div>

          {/* ---------------- REVIEWS ---------------- */}
          <div className="py-10 border-t mt-10 relative">
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
              <DatePickerValue ref={datePickerRef} />
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
                    toast.error("Booking failed");
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
        </div>
      </div>
    </div>
  );
};

export default DetailedPage;
