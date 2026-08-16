import React from "react";

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-pulse space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-gray-200">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded-lg w-48" />
          <div className="h-4 bg-gray-200 rounded w-64" />
        </div>
        <div className="h-10 bg-gray-200 rounded-xl w-36" />
      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="border border-gray-200 rounded-2xl p-4 bg-white space-y-4">
            <div className="w-full aspect-[16/10] bg-gray-200 rounded-xl" />
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <div className="h-9 bg-gray-200 rounded-lg flex-1" />
              <div className="h-9 bg-gray-200 rounded-lg w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
