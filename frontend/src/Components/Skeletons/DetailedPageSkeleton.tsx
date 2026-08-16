import React from "react";

export const DetailedPageSkeleton: React.FC = () => {
  return (
    <div className="max-w-[1120px] mx-auto px-6 py-8 animate-pulse">
      {/* Back button placeholder */}
      <div className="h-5 bg-gray-200 rounded w-20 mb-4" />

      {/* Header title */}
      <div className="space-y-2 mb-6">
        <div className="h-8 bg-gray-200 rounded-lg w-3/5" />
        <div className="h-4 bg-gray-200 rounded-md w-1/3" />
      </div>

      {/* Hero photo gallery skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden h-[380px] md:h-[450px] mb-8 bg-gray-200">
        <div className="md:col-span-2 h-full bg-gray-300" />
        <div className="hidden md:grid grid-rows-2 gap-2 h-full">
          <div className="bg-gray-300" />
          <div className="bg-gray-300" />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-2 h-full">
          <div className="bg-gray-300" />
          <div className="bg-gray-300" />
        </div>
      </div>

      {/* Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left 2 Cols: Details & Amenities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48" />
              <div className="h-4 bg-gray-200 rounded w-64" />
            </div>
            <div className="w-14 h-14 bg-gray-200 rounded-full" />
          </div>

          <div className="space-y-3 py-4 border-b border-gray-200">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>

          <div className="space-y-4 pt-4">
            <div className="h-6 bg-gray-200 rounded w-36" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-gray-200 rounded-lg" />
              <div className="h-10 bg-gray-200 rounded-lg" />
              <div className="h-10 bg-gray-200 rounded-lg" />
              <div className="h-10 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Booking Card Box */}
        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-7 bg-gray-200 rounded w-28" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
            <div className="h-24 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
            <div className="space-y-2 pt-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedPageSkeleton;
