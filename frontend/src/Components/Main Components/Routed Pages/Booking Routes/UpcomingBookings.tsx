import { useGetBookingsQuery } from "../../../../../public/redux/api/apiSlice";
import BookingCard from "../../Cards/BookingCard";
import Loading from "../../../Loading";
import dayjs from "dayjs";
import type { Booking } from "../../../../types";

const UpcomingBookings = () => {
    const { data: bookings = [], isLoading, refetch } = useGetBookingsQuery(undefined);


    const upcomingBookings = bookings.filter((booking: Booking) => {
        const checkInDate = dayjs(booking.start_date);
        const today = dayjs().startOf('day');

        return (
            (booking.status === "CONFIRMED" || booking.status === "PENDING") &&
            (checkInDate.isAfter(today) || checkInDate.isSame(today, 'day'))
        );
    });

    if (isLoading) {
        return <Loading />;
    }

    if (!upcomingBookings.length) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                    No upcoming trips
                </h2>
                <p className="text-gray-500">
                    Time to plan your next adventure! ✈️
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Upcoming Trips</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingBookings.map((booking: Booking) => (
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

export default UpcomingBookings;
