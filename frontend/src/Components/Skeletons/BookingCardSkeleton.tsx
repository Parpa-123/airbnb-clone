import React from "react";

export const BookingCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-5 border border-gray-200 rounded-2xl bg-white animate-pulse">
      {/* Thumbnail */}
      <div className="w-full sm:w-48 h-36 bg-gray-200 rounded-xl flex-shrink-0" />

      {/* Info */}
      <div className="flex-1 space-y-3 py-1">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-6 bg-gray-200 rounded-full w-20" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="flex gap-3 pt-2">
          <div className="h-9 bg-gray-200 rounded-lg w-28" />
          <div className="h-9 bg-gray-200 rounded-lg w-28" />
        </div>
      </div>
    </div>
  );
};

export const BookingListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <BookingCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default BookingCardSkeleton;
