import axiosInstance from "./connect";

export interface ReserveAndPayParams {
    listingId: number;
    checkIn?: string | null;
    checkOut?: string | null;
}

interface BookingResponse {
    id: number;
    listing: number;
    start_date: string;
    end_date: string;
    status?: string;
    created_at?: string;
    hold_expires_at?: string | null;
}

interface PaymentResponse {
    payment_session_id: string;
    order_id: string;
}

interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank";
}

interface CashfreeInstance {
    checkout: (options: CashfreeCheckoutOptions) => void;
}

declare global {
    interface Window {
        Cashfree: (config: { mode: "sandbox" | "production" }) => CashfreeInstance;
    }
}

export const reserveAndPay = async ({
    listingId,
    checkIn,
    checkOut,
}: ReserveAndPayParams): Promise<void> => {
    try {

        const booking = await createBookingHold({
            listingId,
            checkIn,
            checkOut,
        });
        const payment = await createPaymentOrder(booking.id);
        redirectToCashfree(payment.payment_session_id);

    } catch (error: any) {
        console.error("Payment error:", error);
        console.error("Error response:", error.response?.data);
        throw error;
    }
};

export const createBookingHold = async ({
    listingId,
    checkIn,
    checkOut,
}: ReserveAndPayParams): Promise<BookingResponse> => {
    const bookingRes = await axiosInstance.post<BookingResponse>("/bookings/create/", {
        listing: listingId,
        start_date: checkIn || null,
        end_date: checkOut || null,
    });
    return bookingRes.data;
};

export const createPaymentOrder = async (bookingId: number): Promise<PaymentResponse> => {
    const paymentRes = await axiosInstance.post<PaymentResponse>(
        "/bookings/payments/create-order/",
        { booking_id: bookingId }
    );
    return paymentRes.data;
};

export const redirectToCashfree = (paymentSessionId: string): void => {
    const cashfree = window.Cashfree({
        mode: "sandbox",
    });

    cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
    });
};
