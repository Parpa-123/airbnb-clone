import React, { useEffect, useState } from "react"
import axiosInstance from "../../../../public/connect"
import { toast } from "react-toastify"
import { Link, useSearchParams } from "react-router-dom"
import CancelBookingButton from "../Buttons/CancelBookingButton"

/* =======================
   Interfaces
======================= */

interface Guest {
  username: string
  avatar: string | null
  is_host: boolean
}

interface Host {
  username: string
  avatar: string | null
}

interface ListingImage {
  name: string
  image: string
}

interface Listing {
  id: number
  title: string
  city: string
  country: string
  property_type_display: string
  title_slug: string
  price_per_night: string
  images: ListingImage[]
  host: Host
}

interface Booking {
  id: number,
  guest: Guest,
  listing: Listing,
  start_date: string,
  end_date: string,
  total_price: string,
  status: "confirmed" | "pending" | "cancelled"
}

/* =======================
   Helpers
======================= */

const statusStyles: Record<Booking["status"], string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
}

/* =======================
   Component
======================= */

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  const orderId = searchParams.get("order_id");

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("bookings/view/")
      setBookings(response.data)
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load bookings"
      )
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch of bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  // Payment status polling when order_id is present
  useEffect(() => {
    if (!orderId) return;

    // Extract booking ID from order_id format: "booking_1_abc123" -> "1"
    const bookingIdMatch = orderId.match(/^booking_(\d+)_/);
    if (!bookingIdMatch) {
      console.error("Invalid order_id format:", orderId);
      return;
    }

    const bookingId = bookingIdMatch[1];
    let intervalId: number;

    const checkPaymentStatus = async () => {
      try {
        const res = await axiosInstance.get(
          `/bookings/${bookingId}/`
        );

        const booking = res.data;

        // Check if booking and status exist
        if (!booking || !booking.status) {
          console.warn("Booking or status not found in response:", booking);
          return;
        }

        const bookingStatus = booking.status.toUpperCase();

        if (bookingStatus === "CONFIRMED") {
          clearInterval(intervalId);
          toast.success("Payment confirmed! Your booking has been created.");
          await fetchBookings(); // Reload bookings after confirmation
          // Remove order_id from URL
          setSearchParams({});
        }

        if (bookingStatus === "FAILED") {
          clearInterval(intervalId);
          toast.error("Payment failed. Please try again.");
          setSearchParams({});
        }

        if (bookingStatus === "CANCELLED") {
          clearInterval(intervalId);
          toast.warning("Payment was cancelled.");
          setSearchParams({});
        }
      } catch (err: any) {
        console.error("Payment status check error:", err);
        console.error("Error response:", err.response?.data);
        clearInterval(intervalId);
        toast.error("Failed to check payment status.");
      }
    };

    checkPaymentStatus(); // Immediate check
    intervalId = window.setInterval(checkPaymentStatus, 2000);

    return () => clearInterval(intervalId);
  }, [orderId]);

  /* =======================
     Loading State
  ======================= */

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  /* =======================
     Empty State
  ======================= */

  if (!bookings.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-2">
          No trips booked yet
        </h2>
        <p className="text-gray-500">
          Start exploring places and book your first stay 🧳
        </p>
      </div>
    )
  }

  /* =======================
     Main UI
  ======================= */

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8">Your trips</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking, index) => {
          const coverImage =
            booking.listing.images?.[0]?.image ||
            "https://via.placeholder.com/400x300"

          return (
            <div
              key={index}
              className="rounded-2xl border hover:shadow-lg transition overflow-hidden"
            >
              {/* Image */}
              <div className="h-48 bg-gray-200">
                <img
                  src={coverImage}
                  alt={booking.listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                    {booking.listing.title}
                  </h3>

                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize whitespace-nowrap ${statusStyles[booking.status]
                      }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500">
                  {booking.listing.city}, {booking.listing.country} ·{" "}
                  {booking.listing.property_type_display}
                </p>

                <p className="text-sm text-gray-600">
                  {new Date(booking.start_date).toLocaleDateString()} →{" "}
                  {new Date(booking.end_date).toLocaleDateString()}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <p className="font-semibold">
                    ${Math.abs(Number(booking.total_price))}
                  </p>

                  <button className="text-sm font-medium text-rose-600 hover:underline cursor-pointer">
                    <Link to={`/bookings/details/${booking.id}`}>View details</Link>
                  </button>
                  <CancelBookingButton
                    bookingId={booking.id}
                    onSuccess={fetchBookings}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Bookings
