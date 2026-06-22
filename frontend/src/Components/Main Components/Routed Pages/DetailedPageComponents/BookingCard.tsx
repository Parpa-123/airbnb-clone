import React, { useState } from "react";
import dayjs from "dayjs";
import DatePickerValue from "../../DatePicker";
import {
    createBookingHold,
    createPaymentOrder,
    redirectToCashfree,
} from "../../../../services/reserveAndPay";
import { showApiError, MESSAGES } from "../../../../utils/toastMessages";
import type { DatePickerRef } from "../../../../types";

interface BookingCardProps {
    pricePerNight: number | string;
    listingId: number;
    datePickerRef: React.RefObject<DatePickerRef | null>;
    selectedDates: { checkIn: string | null; checkOut: string | null };
    onDatesChange: (dates: { checkIn: string | null; checkOut: string | null }) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
    pricePerNight,
    listingId,
    datePickerRef,
    selectedDates,
    onDatesChange,
}) => {
    const [bookingLoading, setBookingLoading] = useState(false);
    const [heldBookingId, setHeldBookingId] = useState<number | null>(null);
    const [holdExpiresAt, setHoldExpiresAt] = useState<string | null>(null);
    const [secondsLeft, setSecondsLeft] = useState<number>(0);
    const price = Number(pricePerNight);

    const formatCountdown = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    React.useEffect(() => {
        if (!holdExpiresAt) {
            setSecondsLeft(0);
            return;
        }

        const getRemainingSeconds = () => {
            const msLeft = new Date(holdExpiresAt).getTime() - Date.now();
            return Math.max(0, Math.floor(msLeft / 1000));
        };

        setSecondsLeft(getRemainingSeconds());
        const intervalId = window.setInterval(() => {
            setSecondsLeft(getRemainingSeconds());
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [holdExpiresAt]);

    React.useEffect(() => {
        if (holdExpiresAt && secondsLeft <= 0) {
            setHoldExpiresAt(null);
            setHeldBookingId(null);
        }
    }, [holdExpiresAt, secondsLeft]);

    React.useEffect(() => {
        setHoldExpiresAt(null);
        setHeldBookingId(null);
    }, [listingId, selectedDates.checkIn, selectedDates.checkOut]);

    const handleReserve = async () => {
        try {
            setBookingLoading(true);
            const checkIn = datePickerRef.current?.getDates()?.checkIn;
            const checkOut = datePickerRef.current?.getDates()?.checkOut;

            let bookingId = heldBookingId;

            if (!bookingId) {
                const booking = await createBookingHold({
                    listingId,
                    checkIn,
                    checkOut,
                });
                bookingId = booking.id;
                setHeldBookingId(booking.id);
                if (booking.hold_expires_at) {
                    setHoldExpiresAt(booking.hold_expires_at);
                }
            }

            const payment = await createPaymentOrder(bookingId);
            redirectToCashfree(payment.payment_session_id);
        } catch (error) {
            showApiError(error, MESSAGES.BOOKING.BOOKING_FAILED);
        } finally {
            setBookingLoading(false);
        }
    };

    const priceBreakdown = React.useMemo(() => {
        const { checkIn, checkOut } = selectedDates;
        if (!checkIn || !checkOut) return null;

        const nights = dayjs(checkOut).diff(dayjs(checkIn), "day");
        const totalPrice = price * nights;

        return (
            <div className="mt-6 pt-6 border-t border-white/10 space-y-3 text-slate-300">
                <div className="flex justify-between">
                    <span>Check-in:</span>
                    <span className="text-white">{dayjs(checkIn).format("MMM D, YYYY")}</span>
                </div>
                <div className="flex justify-between">
                    <span>Check-out:</span>
                    <span className="text-white">{dayjs(checkOut).format("MMM D, YYYY")}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-white/10 mt-2">
                    <span>
                        ${price.toFixed(2)} × {nights} nights
                    </span>
                    <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-4 border-t border-white/10 text-white text-lg">
                    <span>Total</span>
                    <span className="text-purple-400">${totalPrice.toFixed(2)}</span>
                </div>
            </div>
        );
    }, [selectedDates, price]);

    return (
        <div className="sticky top-24 h-fit">
            <div className="glass-card border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-8">
                <h2 className="text-3xl font-bold text-white tracking-tight flex items-baseline">
                    ${price}
                    <span className="text-lg font-medium text-slate-400 ml-1">/ night</span>
                </h2>

                <div className="mt-6 border border-white/10 rounded-xl overflow-hidden glass bg-slate-900/50">
                    <DatePickerValue ref={datePickerRef} onChange={onDatesChange} />
                </div>

                <div className="mt-6">
                    <button
                        onClick={handleReserve}
                        disabled={bookingLoading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-60 cursor-pointer transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                    >
                        {bookingLoading
                            ? "Processing..."
                            : heldBookingId && secondsLeft > 0
                                ? "Continue to payment"
                                : "Reserve"}
                    </button>
                </div>

                {holdExpiresAt && secondsLeft > 0 ? (
                    <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200 glass">
                        <p className="font-semibold flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                            </span>
                            Hold active: {formatCountdown(secondsLeft)} remaining
                        </p>
                        <p className="text-xs mt-1.5 text-amber-200/80">
                            Complete payment before this timer ends to keep these dates.
                        </p>
                    </div>
                ) : null}

                <p className="text-center text-sm text-slate-400 mt-4">
                    You won't be charged yet
                </p>

                {selectedDates.checkIn && selectedDates.checkOut && priceBreakdown}
            </div>
        </div>
    );
};

export default BookingCard;
