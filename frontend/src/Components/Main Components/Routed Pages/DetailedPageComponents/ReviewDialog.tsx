import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { StarRating } from "../../../Review Components/StarRating";

type RatingKeys = "accuracy" | "communication" | "cleanliness" | "location" | "check_in" | "value";

interface ReviewPayload {
    review: FormDataEntryValue | null;
    accuracy: number;
    communication: number;
    cleanliness: number;
    location: number;
    check_in: number;
    value: number;
}

interface ReviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (payload: ReviewPayload) => Promise<void>;
}

const RATING_LABELS: [RatingKeys, string][] = [
    ["accuracy", "Accuracy"],
    ["communication", "Communication"],
    ["cleanliness", "Cleanliness"],
    ["location", "Location"],
    ["check_in", "Check-in"],
    ["value", "Value"],
];

/**
 * Dialog for submitting a review with star ratings.
 */
const ReviewDialog: React.FC<ReviewDialogProps> = ({ open, onOpenChange, onSubmit }) => {
    const [ratings, setRatings] = useState<Record<RatingKeys, number>>({
        accuracy: 0,
        communication: 0,
        cleanliness: 0,
        location: 0,
        check_in: 0,
        value: 0,
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await onSubmit({
            review: formData.get("review"),
            ...ratings,
        });
        // Reset ratings after successful submit
        setRatings({
            accuracy: 0,
            communication: 0,
            cleanliness: 0,
            location: 0,
            check_in: 0,
            value: 0,
        });
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Content asChild>
                <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative">
                        <Dialog.Close className="absolute top-4 right-4 cursor-pointer">
                            <Cross2Icon />
                        </Dialog.Close>

                        <Dialog.Title className="text-xl font-semibold mb-1">
                            Write a review
                        </Dialog.Title>
                        <Dialog.Description className="text-gray-500 mb-4">
                            Share your experience with future guests.
                        </Dialog.Description>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <textarea
                                name="review"
                                required
                                placeholder="What did you like? Anything to improve?"
                                className="w-full border rounded-xl p-3 h-28 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            />

                            {RATING_LABELS.map(([key, label]) => (
                                <div key={key} className="flex items-center justify-between">
                                    <span className="font-medium">{label}</span>
                                    <StarRating
                                        value={ratings[key]}
                                        onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
                                    />
                                </div>
                            ))}

                            <button
                                type="submit"
                                className="w-full bg-rose-500 text-white py-3 rounded-xl font-semibold hover:bg-rose-600 transition cursor-pointer"
                            >
                                Submit review
                            </button>
                        </form>
                    </div>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default ReviewDialog;
