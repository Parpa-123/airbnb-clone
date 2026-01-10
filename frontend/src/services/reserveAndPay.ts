import axiosInstance from "../../public/connect";

/* ----------------------------- TYPES ----------------------------- */

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

/* ----------------------------- FUNCTION ----------------------------- */

export const reserveAndPay = async ({
    listingId,
    checkIn,
    checkOut,
}: ReserveAndPayParams): Promise<void> => {
    try {
        // 1️⃣ Create booking
        const bookingRes = await axiosInstance.post<BookingResponse>("/bookings/create/", {
            listing: listingId,
            start_date: checkIn || null,
            end_date: checkOut || null,
        });

        const bookingId = bookingRes.data.id;

        // 2️⃣ Create Cashfree order
        const paymentRes = await axiosInstance.post<PaymentResponse>(
            "/bookings/payments/create-order/",
            { booking_id: bookingId }
        );

        const { payment_session_id } = paymentRes.data;

        // 3️⃣ Initialize Cashfree v3 SDK
        const cashfree = window.Cashfree({
            mode: "sandbox", // Change to "production" for live
        });

        // 4️⃣ Open hosted checkout page
        cashfree.checkout({
            paymentSessionId: payment_session_id,
            redirectTarget: "_self",
        });

        // ❗ Payment confirmation happens via webhook
        // User will be redirected back after payment
    } catch (error: unknown) {
        console.error("Payment error:", error);
        console.error("Error response:", error.response?.data);
        throw error;
    }
};
