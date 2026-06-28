import { FaMapMarkerAlt, FaHome, FaUsers, FaBed, FaBath, FaPaw, FaChild, FaBaby, FaCheck, FaDollarSign } from "react-icons/fa";

interface JsonReviewDisplayProps {
    data: any;
    title?: string;
    onBack: () => void;
    onSubmit: () => void;
    submitLabel?: string;
    backLabel?: string;
}

const JsonReviewDisplay = ({
    data,
    title = "Review & Submit",
    onBack,
    onSubmit,
    submitLabel = "Submit ✓",
    backLabel = "← Back"
}: JsonReviewDisplayProps) => {

    const {
        title: propTitle,
        description,
        country,
        city,
        address,
        property_type,
        max_guests,
        bedrooms,
        beds,
        bathrooms,
        price_per_night,
        allows_children,
        allows_infants,
        allows_pets,
        amenities = [],
        images = []
    } = data;

    return (
        <div className="w-full h-full flex flex-col">
            { }
            <div className="p-6 sm:p-8 pb-4 shrink-0 border-b border-gray-100 bg-white">
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            </div>

            { }
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                { }
                {images.length > 0 && (
                    <div className="h-64 sm:h-80 w-full bg-gray-100 relative overflow-hidden group">
                        <img
                            src={URL.createObjectURL(images[0].image)}
                            alt="Main preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                            +{images.length - 1} more photos
                        </div>
                    </div>
                )}

                <div className="p-6 sm:p-8 space-y-8">
                    { }
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-100 pb-6">
                        <div>
                            <div className="flex items-center gap-2 text-brand font-semibold text-sm uppercase tracking-wider mb-2">
                                <FaHome /> {property_type}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{propTitle}</h3>
                            <div className="flex items-center text-gray-500">
                                <FaMapMarkerAlt className="mr-2" />
                                {address}, {city}, {country}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-gray-900 flex items-center justify-end">
                                <FaDollarSign className="text-xl text-gray-400" />{price_per_night}
                            </div>
                            <span className="text-gray-500 text-sm">per night</span>
                        </div>
                    </div>

                    { }
                    <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
                        {description}
                    </div>

                    { }
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-gray-100">
                        <StatItem icon={<FaUsers />} label="Guests" value={max_guests} />
                        <StatItem icon={<FaHome />} label="Bedrooms" value={bedrooms} />
                        <StatItem icon={<FaBed />} label="Beds" value={beds} />
                        <StatItem icon={<FaBath />} label="Baths" value={bathrooms} />
                    </div>

                    { }
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4 text-lg">Guest Policies</h4>
                            <div className="space-y-3">
                                <PolicyItem allowed={allows_children} label="Children allowed" icon={<FaChild />} />
                                <PolicyItem allowed={allows_infants} label="Infants allowed" icon={<FaBaby />} />
                                <PolicyItem allowed={allows_pets} label="Pets allowed" icon={<FaPaw />} />
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 mb-4 text-lg">Amenities</h4>
                            <div className="flex flex-wrap gap-2">
                                {amenities.length > 0 ? amenities.map((am: string, i: number) => (
                                    <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm border border-gray-200 flex items-center gap-2">
                                        <FaCheck className="text-brand text-xs" /> {am}
                                    </span>
                                )) : <span className="text-gray-400 italic">No amenities selected</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            { }
            <div className="p-6 sm:p-8 pt-4 shrink-0 border-t border-gray-100 bg-white flex justify-between gap-4">
                <button
                    onClick={onBack}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium
                        rounded-xl hover:bg-gray-50 hover:border-gray-400
                        transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                    {backLabel}
                </button>

                <button
                    onClick={onSubmit}
                    className="px-8 py-3 text-white font-semibold rounded-xl hover:opacity-95 transition-opacity shadow-sm cursor-pointer"
                    style={{ backgroundColor: "var(--color-brand)" }}
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
};

const StatItem = ({ icon, label, value }: { icon: any, label: string, value: any }) => (
    <div className="flex flex-col items-center justify-center p-3 border border-gray-100 rounded-xl text-center bg-gray-50/40">
        <div className="text-xl text-brand mb-1">{icon}</div>
        <div className="font-semibold text-gray-900 text-base">{value}</div>
        <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{label}</div>
    </div>
);

const PolicyItem = ({ allowed, label, icon }: { allowed: any, label: string, icon: any }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/20 text-sm text-gray-700">
        <div className={allowed ? "text-brand" : "text-gray-400"}>{icon}</div>
        <span className="flex-1 font-medium">{label}</span>
        {allowed ? (
            <FaCheck className="text-brand text-xs" />
        ) : (
            <span className="text-gray-400 text-xs font-bold">✕</span>
        )}
    </div>
);

export default JsonReviewDisplay;
