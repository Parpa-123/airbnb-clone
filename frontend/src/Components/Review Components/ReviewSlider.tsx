import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { StarRating } from "./StarRating";
import dayjs from "dayjs";

/* --------------------------- TYPES --------------------------- */

export interface User {
    email: string;
    username: string;
}

export interface Review {
    id: number;
    avg_rating: string;
    listing: number;
    created_at: string;
    updated_at: string;
    review: string;
    accuracy: number;
    communication: number;
    cleanliness: number;
    location: number;
    check_in: number;
    value: number;
    user: User;
}

interface ReviewSliderProps {
    reviews: Review[];
}

/* --------------------------- COMPONENT --------------------------- */

const ReviewSlider: React.FC<ReviewSliderProps> = ({ reviews }) => {
    if (!reviews?.length) {
        return (
            <p className="text-gray-500 mt-4">
                No reviews yet.
            </p>
        );
    }

    return (
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={24}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            className="pb-10"
        >
            {reviews.map((r) => (
                <SwiperSlide key={r.id}>
                    <div className="border rounded-2xl p-5 h-full bg-white">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">
                                {r.user.username}
                            </span>
                            <span className="text-sm text-gray-400">
                                {dayjs(r.created_at).format('MMM D, YYYY')}
                            </span>
                        </div>

                        {/* Avg rating */}
                        <StarRating value={Number(r.avg_rating)} readonly />

                        {/* Review text */}
                        <p className="mt-3 text-gray-700 line-clamp-4">
                            {r.review}
                        </p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ReviewSlider;
