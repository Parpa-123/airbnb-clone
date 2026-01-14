import React from "react";

interface Amenity {
    name: string;
    display_name: string;
}

interface AmenitiesDisplayProps {
    amenities: Amenity[];
}

const AmenitiesDisplay = React.memo(({ amenities }: AmenitiesDisplayProps) => {
    return (
        <div id="amenities" className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-3">
                {amenities.map((a) => (
                    <div key={a.name} className="text-gray-700">
                        ✓ {a.display_name}
                    </div>
                ))}
            </div>
        </div>
    );
});

export default AmenitiesDisplay;
