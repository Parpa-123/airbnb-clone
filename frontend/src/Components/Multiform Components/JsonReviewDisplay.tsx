
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
        bhk_choice,
        bed_choice,
        bathrooms,
        price_per_night,
        allows_children,
        allows_infants,
        allows_pets,
        amenities = [],
        images = []
    } = data;

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 h-[650px] flex flex-col overflow-hidden">
            {/* Fixed Header */}
            <div className="p-6 sm:p-8 pb-4 shrink-0 border-b border-gray-100 bg-white">
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Images Preview */}
                {images.length > 0 && (
                    <div className="h-64 sm:h-80 w-full bg-gray-100 relative overflow-hidden group">
                        <img
                            src={URL.createObjectURL(images[0].image)}
                            alt="Main preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                            +{images.length - 1} more photos
                        </div>
                    </div>
                )}

                <div className="p-6 sm:p-8 space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-100 pb-6">
                        <div>
                            <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm uppercase tracking-wider mb-2">
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

                    {/* Description */}
                    <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
                        {description}
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-gray-100">
                        <StatItem icon={<FaUsers />} label="Guests" value={max_guests} />
                        <StatItem icon={<FaHome />} label="Bedrooms" value={bhk_choice} />
                        <StatItem icon={<FaBed />} label="Beds" value={bed_choice} />
                        <StatItem icon={<FaBath />} label="Baths" value={bathrooms} />
                    </div>

                    {/* Policies & Amenities */}
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
                                        <FaCheck className="text-green-500 text-xs" /> {am}
                                    </span>
                                )) : <span className="text-gray-400 italic">No amenities selected</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Footer Actions */}
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
                    className="px-8 py-3 bg-linear-to-r from-[#FF385C] to-[#e03050] 
                        text-white font-semibold rounded-xl hover:from-[#e03050] hover:to-[#c02848] 
                        transition-all duration-300 shadow-lg hover:shadow-xl 
                        transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
};

// Helper Components
const StatItem = ({ icon, label, value }: { icon: any, label: string, value: any }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl text-center">
        <div className="text-2xl text-rose-500 mb-2">{icon}</div>
        <div className="font-bold text-gray-900 text-lg">{value}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
);

const PolicyItem = ({ allowed, label, icon }: { allowed: any, label: string, icon: any }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${allowed ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
        <div className={`${allowed ? 'text-green-600' : 'text-red-500'}`}>{icon}</div>
        <span className={`flex-1 font-medium ${allowed ? 'text-green-800' : 'text-red-800'}`}>{label}</span>
        {allowed ? <FaCheck className="text-green-600" /> : <div className="text-red-500 text-sm font-bold">✕</div>}
    </div>
);

export default JsonReviewDisplay;
