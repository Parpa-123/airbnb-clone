import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../public/connect";
import { type ListingImage } from "./DetailedPage";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";




export interface Listing {
  id: number;
  host: {
    username: string;
    avatar: string;
  };
  title: string;
  title_slug: string;
  country: string;
  city: string;
  property_type_display: string;
  max_guests: number;
  bhk_choice: number;
  bed_choice: number;
  bathrooms: number;
  price_per_night: string;
  images: ListingImage[];
  created_at: string;
}



const PublicListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch listings
  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get<Listing[]>("/listings/public/");
        setListings(response.data);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message;
        toast.error(msg);
        setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading listings...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">Public Listings</h2>

      {listings.length === 0 && (
        <p className="text-gray-600">No listings available.</p>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {listings.map((item) => (
          <Link to={`/${item.title_slug}`}>
            <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
              
              {/* Image */}
              {item.images?.length > 0 && (
                <img
                  src={item.images[0].image}
                  alt={item.title}
                  className="w-full h-60 object-cover"
                />
              )}

              <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-semibold truncate">{item.title}</h3>

                {/* Location */}
                <p className="text-sm text-gray-500">
                  {item.city}, {item.country}
                </p>

                {/* Details */}
                <p className="text-sm text-gray-600 mt-1">
                  {item.property_type_display} · {item.bhk_choice} BHK · {item.bed_choice} Beds · {item.bathrooms} Bath
                </p>

                {/* Price */}
                <p className="text-md font-semibold mt-3">
                  ${item.price_per_night}{" "}
                  <span className="text-sm text-gray-500 font-normal">night</span>
                </p>

                {/* Host */}
                <div className="flex items-center mt-4">
                  <img
                    src={item.host.avatar}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <p className="ml-3 text-sm text-gray-700">
                    Host: {item.host.username}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};


export default PublicListings;
