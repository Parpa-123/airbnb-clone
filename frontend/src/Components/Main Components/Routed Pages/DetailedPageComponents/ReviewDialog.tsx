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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative shadow-2xl">
                        <Dialog.Close className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition cursor-pointer p-1 rounded-full hover:bg-gray-100">
                            <Cross2Icon className="w-5 h-5" />
                        </Dialog.Close>

                        <Dialog.Title className="text-xl font-semibold text-gray-900 mb-1">
                            Write a review
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-gray-500 mb-4">
                            Share your experience with future guests.
                        </Dialog.Description>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea
                                name="review"
                                required
                                placeholder="What did you like? Anything to improve?"
                                className="w-full border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl p-3 h-28 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand text-sm resize-none"
                            />

                            <div className="space-y-2.5 pt-1">
                                {RATING_LABELS.map(([key, label]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="font-medium text-sm text-gray-800">{label}</span>
                                        <StarRating
                                            value={ratings[key]}
                                            onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand text-white py-3 rounded-xl font-semibold hover:bg-brand-hover transition cursor-pointer shadow-sm mt-2"
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
