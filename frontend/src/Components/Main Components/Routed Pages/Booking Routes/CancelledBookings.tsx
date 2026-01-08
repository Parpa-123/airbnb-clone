import { useGetBookingsQuery } from "../../../../../public/redux/api/apiSlice";
import BookingCard from "../../Cards/BookingCard";
import Loading from "../../../Loading";
import type { Booking } from "../../../../types";

const CancelledBookings = () => {
    const { data: bookings = [], isLoading, refetch } = useGetBookingsQuery(undefined);

    // Filter for cancelled bookings
    const cancelledBookings = bookings.filter((booking: Booking) => {
        return booking.status === "CANCELLED" || booking.status === "FAILED";
    });

    if (isLoading) {
        return <Loading />;
    }

    if (!cancelledBookings.length) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                    No cancelled bookings
                </h2>
                <p className="text-gray-500">
                    You haven't cancelled any trips 👍
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Cancelled Bookings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledBookings.map((booking: Booking) => (
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

export default CancelledBookings;
