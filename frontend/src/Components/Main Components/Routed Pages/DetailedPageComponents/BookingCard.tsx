import React, { useState } from "react";
import dayjs from "dayjs";
import DatePickerValue from "../../DatePicker";
import { reserveAndPay } from "../../../../services/reserveAndPay";
import { showError, MESSAGES } from "../../../../utils/toastMessages";
import type { DatePickerRef } from "../../../../types";

interface BookingCardProps {
    pricePerNight: number | string;
    listingId: number;
    datePickerRef: React.RefObject<DatePickerRef | null>;
    selectedDates: { checkIn: string | null; checkOut: string | null };
    onDatesChange: (dates: { checkIn: string | null; checkOut: string | null }) => void;
}

/**
 * Sticky booking card with date picker, reserve button, and price breakdown.
 */
const BookingCard: React.FC<BookingCardProps> = ({
    pricePerNight,
    listingId,
    datePickerRef,
    selectedDates,
    onDatesChange,
}) => {
    const [bookingLoading, setBookingLoading] = useState(false);
    const price = Number(pricePerNight);

    const handleReserve = async () => {
        try {
            setBookingLoading(true);
            await reserveAndPay({
                listingId,
                checkIn: datePickerRef.current?.getDates()?.checkIn,
                checkOut: datePickerRef.current?.getDates()?.checkOut,
            });
        } catch {
            showError(MESSAGES.BOOKING.BOOKING_FAILED);
        } finally {
            setBookingLoading(false);
        }
    };

    const renderPriceBreakdown = () => {
        const { checkIn, checkOut } = selectedDates;
        if (!checkIn || !checkOut) return null;

        const nights = dayjs(checkOut).diff(dayjs(checkIn), "day");
        const totalPrice = price * nights;

        return (
            <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span>{dayjs(checkIn).format("MMM D, YYYY")}</span>
                </div>
                <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span>{dayjs(checkOut).format("MMM D, YYYY")}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                    <span>
                        ${price.toFixed(2)} × {nights} nights
                    </span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="sticky top-24 h-fit">
            <div className="border rounded-xl shadow-lg p-6 bg-white">
                <h2 className="text-xl font-semibold">
                    ${price}
                    <span className="text-base font-normal text-gray-600"> / night</span>
                </h2>

                <div className="mt-5 border rounded-lg overflow-hidden">
                    <DatePickerValue ref={datePickerRef} onChange={onDatesChange} />
                </div>

                <div className="mt-5">
                    <button
                        onClick={handleReserve}
                        disabled={bookingLoading}
                        className="w-full bg-linear-to-r from-[#E61E4D] to-[#D70466] text-white py-3.5 rounded-lg font-semibold disabled:opacity-60 cursor-pointer"
                    >
                        {bookingLoading ? "Processing..." : "Reserve"}
                    </button>
                </div>

                <p className="text-center text-sm text-gray-600 mt-3">
                    You won't be charged yet
                </p>
            </div>

            {selectedDates.checkIn && selectedDates.checkOut && renderPriceBreakdown()}
        </div>
    );
};

export default BookingCard;
