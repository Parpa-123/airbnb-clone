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
        <div id="amenities" className="py-8 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Amenities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amenities.map((a) => (
                    <div key={a.name} className="flex items-center gap-3 text-slate-300 bg-white/5 border border-white/5 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">
                        <span className="text-purple-400 font-bold">✓</span>
                        <span className="font-medium">{a.display_name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default AmenitiesDisplay;
