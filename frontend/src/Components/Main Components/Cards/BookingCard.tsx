import React from "react";
import { Link } from "react-router-dom";
import type { Booking, BookingStatus } from "../../../types";
import CancelBookingButton from "../Buttons/CancelBookingButton";
import dayjs from "dayjs";

const statusStyles: Record<BookingStatus, string> = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
    failed: "bg-red-100 text-red-700",
    paid: "bg-green-100 text-green-700",
    refunded: "bg-gray-100 text-gray-700",
    CONFIRMED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
    FAILED: "bg-red-100 text-red-700",
    COMPLETED: "bg-blue-100 text-blue-700",
};

interface BookingCardProps {
    booking: Booking;
    onCancelSuccess?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = React.memo(({
    booking,
    onCancelSuccess,
}) => {
    const coverImage =
        booking.listing.images?.[0]?.image ||
        "https://via.placeholder.com/400x300";

    return (
        <div className="rounded-2xl border hover:shadow-lg transition overflow-hidden">
            { }
            <div className="h-48 bg-gray-200">
                <img
                    src={coverImage}
                    alt={booking.listing.title}
                    className="w-full h-full object-cover"
                />
            </div>

            { }
            <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                        {booking.listing.title}
                    </h3>

                    <span
                        className={`text-xs px-2 py-1 rounded-full capitalize whitespace-nowrap ${statusStyles[booking.status]}`}
                    >
                        {booking.status}
                    </span>
                </div>

                <p className="text-sm text-gray-500">
                    {booking.listing.city}, {booking.listing.country} ·{" "}
                    {booking.listing.property_type_display}
                </p>

                {booking.listing.address && (
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {booking.listing.address}
                    </p>
                )}
                <p className="text-sm text-gray-600">
                    {dayjs(booking.start_date).format('MMM D, YYYY')} →{" "}
                    {dayjs(booking.end_date).format('MMM D, YYYY')}
                </p>

                <div className="pt-2 flex items-center justify-between">
                    <p className="font-semibold">
                        ${Math.abs(Number(booking.total_price))}
                    </p>

                    <button className="text-sm font-medium text-rose-600 hover:underline cursor-pointer">
                        <Link to={`/bookings/details/${booking.id}`}>View details</Link>
                    </button>

                    {onCancelSuccess && (
                        <CancelBookingButton
                            bookingId={booking.id}
                            onSuccess={onCancelSuccess}
                        />
                    )}
                </div>
            </div>
        </div>
    );
});

export default BookingCard;
