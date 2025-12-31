import React, { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import axiosInstance from "../../../../public/connect"
import { showSuccess, showError, extractErrorMessage, MESSAGES } from "../../../utils/toastMessages"

interface CancelBookingButtonProps {
    bookingId: number
    onSuccess?: () => void
    variant?: "inline" | "full-width"
    buttonText?: string
}

const CancelBookingButton: React.FC<CancelBookingButtonProps> = ({
    bookingId,
    onSuccess,
    variant = "inline",
    buttonText = "Cancel"
}) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleCancelBooking = async () => {
        try {
            setLoading(true)
            await axiosInstance.delete(`bookings/delete/${bookingId}/`)
            showSuccess(MESSAGES.BOOKING.CANCEL_SUCCESS)
            setDialogOpen(false)

            // Call the callback if provided
            if (onSuccess) {
                onSuccess()
            }
        } catch (error: any) {
            showError(extractErrorMessage(error, "Failed to cancel booking"))
        } finally {
            setLoading(false)
        }
    }

    const buttonClassName =
        variant === "full-width"
            ? "w-full rounded-lg bg-red-500 text-white py-2 font-medium hover:bg-red-600 transition cursor-pointer"
            : "text-sm font-medium text-black hover:underline cursor-pointer"

    return (
        <>
            <button
                className={buttonClassName}
                onClick={() => setDialogOpen(true)}
                disabled={loading}
            >
                {buttonText}
            </button>

            {/* Confirmation Dialog */}
            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 w-full max-w-md shadow-xl z-50">
                        <Dialog.Title className="text-xl font-semibold mb-2">
                            Cancel Booking?
                        </Dialog.Title>
                        <Dialog.Description className="text-gray-600 mb-6">
                            Are you sure you want to cancel this booking? This action cannot be undone.
                        </Dialog.Description>

                        <div className="flex gap-3 justify-end">
                            <Dialog.Close asChild>
                                <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium cursor-pointer">
                                    Keep Booking
                                </button>
                            </Dialog.Close>
                            <button
                                onClick={handleCancelBooking}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? "Cancelling..." : "Yes, Cancel Booking"}
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}

export default CancelBookingButton
