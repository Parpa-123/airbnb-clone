import React from "react";

interface ListingCardSkeletonProps {
  count?: number;
}

export const ListingCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col space-y-3 animate-pulse">
      {/* Image container skeleton */}
      <div className="w-full aspect-[4/3] bg-gray-200 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Details skeleton */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded-md w-2/3" />
          <div className="h-4 bg-gray-200 rounded-md w-10" />
        </div>
        <div className="h-3.5 bg-gray-200 rounded-md w-1/2" />
        <div className="h-3.5 bg-gray-200 rounded-md w-1/3" />
        <div className="flex items-center gap-1 pt-1">
          <div className="h-4 bg-gray-200 rounded-md w-16" />
          <div className="h-3 bg-gray-200 rounded-md w-12" />
        </div>
      </div>
    </div>
  );
};

export const ListingGridSkeleton: React.FC<ListingCardSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ListingCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default ListingCardSkeleton;
