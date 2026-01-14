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

    useEffect(() => {
        if (!orderId) return;

        const bookingIdMatch = orderId.match(/^booking_(\d+)_/);
        if (!bookingIdMatch) {
            console.error("Invalid order_id format:", orderId);
            return;
        }

        const bookingId = bookingIdMatch[1];
        let intervalId: number;
        let attemptCount = 0;
        const MAX_ATTEMPTS_BEFORE_VERIFY = 5;

        const checkPaymentStatus = async () => {
            try {
                attemptCount++;

                if (attemptCount > MAX_ATTEMPTS_BEFORE_VERIFY) {
                    console.log("Webhook may have failed, using manual verification...");
                    const verifyRes = await axiosInstance.post(`/bookings/payments/verify/`, {
                        booking_id: bookingId
                    });

                    const verifyStatus = verifyRes.data.status;

                    if (verifyStatus === "paid") {
                        clearInterval(intervalId);
                        showSuccess(MESSAGES.BOOKING.PAYMENT_SUCCESS);
                        refetch();
                        setSearchParams({});
                        return;
                    } else if (verifyStatus === "failed") {
                        clearInterval(intervalId);
                        showError(MESSAGES.BOOKING.PAYMENT_FAILED);
                        setSearchParams({});
                        return;
                    }

                } else {

                    const res = await axiosInstance.get(`/bookings/${bookingId}/`);
                    const booking = res.data;

                    if (!booking || !booking.status) {
                        console.warn("Booking or status not found in response:", booking);
                        return;
                    }

                    const bookingStatus = booking.status.toUpperCase();

                    if (bookingStatus === "CONFIRMED") {
                        clearInterval(intervalId);
                        showSuccess(MESSAGES.BOOKING.PAYMENT_SUCCESS);
                        refetch();
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
                }
            } catch (err: any) {
                console.error("Payment status check error:", err);
                console.error("Error response:", err.response?.data);
                clearInterval(intervalId);
                showError(MESSAGES.BOOKING.PAYMENT_STATUS_FAILED);
            }
        };

        checkPaymentStatus();
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
