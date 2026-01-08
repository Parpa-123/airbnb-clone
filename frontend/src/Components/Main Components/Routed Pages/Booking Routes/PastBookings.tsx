import { useGetBookingsQuery } from "../../../../../public/redux/api/apiSlice";
import BookingCard from "../../Cards/BookingCard";
import Loading from "../../../Loading";
import dayjs from "dayjs";
import type { Booking } from "../../../../types";

const PastBookings = () => {
    const { data: bookings = [], isLoading, refetch } = useGetBookingsQuery(undefined);

    // Filter for past bookings (check-out date in the past and status is CONFIRMED or COMPLETED)
    const pastBookings = bookings.filter((booking: Booking) => {
        const checkOutDate = dayjs(booking.end_date);
        const today = dayjs().startOf('day');

        return (
            checkOutDate.isBefore(today) &&
            (booking.status === "CONFIRMED" || booking.status === "COMPLETED")
        );
    });

    if (isLoading) {
        return <Loading />;
    }

    if (!pastBookings.length) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                    No past trips
                </h2>
                <p className="text-gray-500">
                    Your completed adventures will appear here 📸
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Past Trips</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastBookings.map((booking: Booking) => (
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

export default PastBookings;
