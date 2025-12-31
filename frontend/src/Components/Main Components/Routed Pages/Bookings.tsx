import { useEffect, useState } from "react"
import axiosInstance from "../../../../public/connect"
import { showSuccess, showError, showWarning, extractErrorMessage, MESSAGES } from "../../../utils/toastMessages"
import { useSearchParams } from "react-router-dom"
import type { Booking } from "../../../types"
import BookingCard from "../Cards/BookingCard"

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
      showError(extractErrorMessage(error, MESSAGES.BOOKING.FETCH_FAILED))
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
          showSuccess(MESSAGES.BOOKING.PAYMENT_SUCCESS);
          await fetchBookings(); // Reload bookings after confirmation
          // Remove order_id from URL
          setSearchParams({});
        }

        if (bookingStatus === "FAILED") {
          clearInterval(intervalId);
          showError(MESSAGES.BOOKING.PAYMENT_FAILED);
          setSearchParams({});
        }

        if (bookingStatus === "CANCELLED") {
          clearInterval(intervalId);
          showWarning("Payment was cancelled.");
          setSearchParams({});
        }
      } catch (err: any) {
        console.error("Payment status check error:", err);
        console.error("Error response:", err.response?.data);
        clearInterval(intervalId);
        showError(MESSAGES.BOOKING.PAYMENT_STATUS_FAILED);
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
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onCancelSuccess={fetchBookings}
          />
        ))}
      </div>
    </div>
  )
}

export default Bookings
