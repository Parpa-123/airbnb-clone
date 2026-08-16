import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { StarRating } from "./StarRating";
import dayjs from "dayjs";

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

const ReviewSlider = React.memo(({ reviews }: ReviewSliderProps) => {
    if (!reviews?.length) {
        return (
            <p className="text-gray-500 mt-4 text-sm">
                No reviews yet. Be the first to review this place!
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
                    <div className="border border-gray-200 rounded-2xl p-5 h-full bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm text-gray-900">
                                {r.user.username}
                            </span>
                            <span className="text-xs text-gray-500">
                                {dayjs(r.created_at).format('MMM D, YYYY')}
                            </span>
                        </div>

                        <StarRating value={Number(r.avg_rating)} readonly />

                        <p className="mt-3 text-gray-700 text-sm leading-relaxed line-clamp-4">
                            {r.review}
                        </p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
});

export default ReviewSlider;
