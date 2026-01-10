import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import axiosInstance from "../../../../../public/connect";
import { showSuccess, showError, showWarning, MESSAGES } from "../../../../utils/toastMessages";
import BookingCard from "../../Cards/BookingCard";
import Loading from "../../../Loading";
import { useGetBookingsQuery } from "../../../../../public/redux/api/apiSlice";
import type { Booking } from "../../../../types";

const BookingsOverview = () => {
    const { data: bookings = [], isLoading, refetch } = useGetBookingsQuery(undefined);
    const [searchParams, setSearchParams] = useSearchParams();

    const orderId = searchParams.get("order_id");

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
                const res = await axiosInstance.get(`/bookings/${bookingId}/`);
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
                    refetch(); // Reload bookings after confirmation using RTK Query
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
            } catch (err: unknown) {
                console.error("Payment status check error:", err);
                console.error("Error response:", err.response?.data);
                clearInterval(intervalId);
                showError(MESSAGES.BOOKING.PAYMENT_STATUS_FAILED);
            }
        };

        checkPaymentStatus(); // Immediate check
        intervalId = window.setInterval(checkPaymentStatus, 2000);

        return () => clearInterval(intervalId);
    }, [orderId, refetch, setSearchParams]);

    if (isLoading) {
        return <Loading />;
    }

    if (!bookings.length) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                    No trips booked yet
                </h2>
                <p className="text-gray-500">
                    Start exploring places and book your first stay 🧳
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">All Bookings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking: Booking) => (
                    <BookingCard
                        key={booking.id}
                        booking={booking}
                        onCancelSuccess={refetch}
                    />
                ))}
            </div>
        </div>
    );
};

export default BookingsOverview;
