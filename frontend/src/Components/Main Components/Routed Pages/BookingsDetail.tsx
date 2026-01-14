import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../public/connect";
import type { Booking } from "../../../types";
import CancelBookingButton from "../Buttons/CancelBookingButton";
import Loading from "../../Loading";
import dayjs from "dayjs";

const BookingDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await axiosInstance.get(`/bookings/detail/${Number(id)}/`);
                setBooking(res.data);
            } catch (error) {
                console.error("Failed to fetch booking", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id]);

    if (loading) return <Loading />;

    if (!booking) {
        return <div className="p-8 text-center">Booking not found</div>;
    }

    const nights = dayjs(booking.end_date).diff(dayjs(booking.start_date), 'day');

    const totalPrice =
        Number(booking.listing.price_per_night) * nights;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
            {}
            <div>
                <h1 className="text-2xl font-semibold">Your booking is confirmed</h1>
                <p className="text-gray-600">Here are the details of your stay</p>
            </div>

            {}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <img
                    src={booking.listing.images[0]?.image}
                    alt={booking.listing.title}
                    className="h-64 w-full object-cover"
                />

                <div className="p-6 space-y-2">
                    <h2 className="text-xl font-semibold">
                        {booking.listing.title}
                    </h2>
                    <p className="text-gray-600">
                        {booking.listing.city}, {booking.listing.country}
                    </p>
                    <p className="text-sm text-gray-500">
                        Hosted by {booking.listing.host.username}
                    </p>
                </div>
            </div>

            {}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: "Check-in", value: dayjs(booking.start_date).format('MMM D, YYYY') },
                    { label: "Check-out", value: dayjs(booking.end_date).format('MMM D, YYYY') },
                    { label: "Duration", value: `${nights} nights` },
                    { label: "Guests", value: booking.listing.max_guests },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="bg-white rounded-xl p-4 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className="font-semibold">{item.value}</p>
                    </div>
                ))}
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {}
                <div className="bg-white rounded-xl p-6 shadow-sm md:col-span-2">
                    <h3 className="font-semibold mb-4">Price breakdown</h3>

                    <div className="flex justify-between text-sm mb-2">
                        <span>
                            ${booking.listing.price_per_night} × {nights} nights
                        </span>
                        <span>${totalPrice}</span>
                    </div>

                    <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${totalPrice}</span>
                    </div>
                </div>

                {}
                <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
                    <button
                        onClick={() =>
                            navigate(`/${booking.listing.title_slug}`)
                        }
                        className="w-full rounded-lg border border-gray-300 py-2 font-medium hover:bg-gray-50 cursor-pointer"
                    >
                        View property
                    </button>

                    <CancelBookingButton
                        bookingId={booking.id}
                        variant="full-width"
                        buttonText="Cancel booking"
                        onSuccess={() => navigate('/bookings')}
                    />
                </div>
            </div>

            {}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border border-blue-100">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">Price Calculation Details</h3>

                <div className="space-y-3">
                    {}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Check-in Date:</span>
                        <span className="font-medium text-gray-900">
                            {dayjs(booking.start_date).format('MMMM D, YYYY')}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Check-out Date:</span>
                        <span className="font-medium text-gray-900">
                            {dayjs(booking.end_date).format('MMMM D, YYYY')}
                        </span>
                    </div>

                    <div className="border-t border-blue-200 my-3"></div>

                    {}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Number of Nights:</span>
                        <span className="font-medium text-gray-900">{nights}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price per Night:</span>
                        <span className="font-medium text-gray-900">
                            ${Number(booking.listing.price_per_night).toFixed(2)}
                        </span>
                    </div>

                    <div className="border-t border-blue-200 my-3"></div>

                    {}
                    <div className="bg-white/60 rounded-lg p-3 text-sm">
                        <div className="text-gray-600 mb-1">Calculation:</div>
                        <div className="font-mono text-indigo-700">
                            ${Number(booking.listing.price_per_night).toFixed(2)} × {nights} nights = ${totalPrice.toFixed(2)}
                        </div>
                    </div>

                    {}
                    <div className="border-t border-blue-200 my-3"></div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg text-gray-900">Total Amount:</span>
                        <span className="font-bold text-2xl text-indigo-600">
                            ${totalPrice.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;
