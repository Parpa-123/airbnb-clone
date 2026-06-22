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
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[9998] bg-slate-900/95 backdrop-blur-xl transition-opacity" />
                <Dialog.Content className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="glass-card border border-white/10 w-full max-w-lg rounded-3xl p-8 relative shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <Dialog.Close className="absolute top-6 right-6 cursor-pointer text-slate-400 hover:text-white bg-white/5 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-md transition-all border border-white/10">
                            <Cross2Icon className="w-5 h-5" />
                        </Dialog.Close>

                        <Dialog.Title className="text-2xl font-bold text-white mb-2 tracking-tight pr-10">
                            Write a review
                        </Dialog.Title>
                        <Dialog.Description className="text-slate-400 mb-6">
                            Share your experience with future guests.
                        </Dialog.Description>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <textarea
                                name="review"
                                required
                                placeholder="What did you like? Anything to improve?"
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500 glass transition-all resize-none"
                            />

                            <div className="space-y-4">
                                {RATING_LABELS.map(([key, label]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <span className="text-slate-300 font-medium">{label}</span>
                                        <StarRating
                                            value={ratings[key]}
                                            onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all cursor-pointer mt-2"
                            >
                                Submit review
                            </button>
                        </form>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ReviewDialog;
