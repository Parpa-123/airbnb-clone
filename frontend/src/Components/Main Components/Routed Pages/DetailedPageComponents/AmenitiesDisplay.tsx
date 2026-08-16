import React from "react";

interface Amenity {
    name: string;
    display_name: string;
}

interface AmenitiesDisplayProps {
    amenities: Amenity[];
}

const AmenitiesDisplay = React.memo(({ amenities }: AmenitiesDisplayProps) => {
    if (!amenities || amenities.length === 0) return null;

    return (
        <div id="amenities" className="py-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-tight">
                What this place offers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {amenities.map((a) => (
                    <div
                        key={a.name}
                        className="flex items-center gap-3 text-gray-800 bg-gray-50/80 border border-gray-200/80 px-4 py-3 rounded-xl hover:bg-gray-100/80 transition-colors"
                    >
                        <span className="text-gray-900 font-bold text-base">✓</span>
                        <span className="font-medium text-sm text-gray-800">{a.display_name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default AmenitiesDisplay;
