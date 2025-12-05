import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../public/connect";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ListMap from "../../../services/MapService";

export interface Host {
  username: string;
  avatar: string | null;
}

export interface Amenity {
  name: string;
  display_name: string;
}

export interface ListingImage {
  name: string;
  image: string;
  uploaded_at: string;
}

export interface ListingDetail {
  host: Host;
  title: string;
  title_slug: string;
  country: string;
  city: string;
  property_type: string;
  property_type_display: string;
  max_guests: number;
  bhk_choice: number;
  bed_choice: number;
  bathrooms: number;
  price_per_night: string;
  images: ListingImage[];
  created_at: string;
  description: string;
  address: string;
  updated_at: string;
  amenities: Amenity[];
}

const DetailedPage = () => {
  const { id } = useParams();

  const [listingDetail, setListingDetail] = useState<ListingDetail | null>(null);
  const [photos, setPhotos] = useState<ListingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Fetch listing
  useEffect(() => {
    const fetchListingDetail = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get<ListingDetail>(`/listings/${Number(id)}/`);
        setListingDetail(res.data);
        setPhotos(res.data.images);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetail();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  if (!listingDetail) return <p>No data found.</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Title */}
      <h1 className="text-3xl font-semibold mb-1">{listingDetail.title}</h1>
      <p className="text-gray-600 text-sm">
        {listingDetail.city}, {listingDetail.country}
      </p>

      {/* Swiper */}
      <div className="mt-6 airbnb-swiper">
        {/* Left Arrow */}
        <button
          className="airbnb-arrow airbnb-arrow-prev cursor-pointer"
          ref={prevRef}
        >
          <span className="airbnb-arrow-icon cursor-pointer">‹</span>
        </button>

        {/* Right Arrow */}
        <button
          className="airbnb-arrow airbnb-arrow-next cursor-pointer"
          ref={nextRef}
        >
          <span className="airbnb-arrow-icon">›</span>
        </button>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          pagination={{ clickable: true }}
          onInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          className="airbnb-pagination"
        >
          {photos.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={img.image}
                alt={img.name}
                className="w-full h-[450px] object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Main Layout */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="md:col-span-2 airbnb-section">

          {/* Host Section */}
          <div className="airbnb-host-card">
            <img
              src={listingDetail.host.avatar || "https://via.placeholder.com/80"}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-xl font-semibold">
                Hosted by {listingDetail.host.username}
              </p>
              <p className="text-gray-500 text-sm">
                {listingDetail.max_guests} guests • {listingDetail.bed_choice} beds •{" "}
                {listingDetail.bhk_choice} BHK • {listingDetail.bathrooms} baths
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">About this place</h2>
            <p className="text-gray-700 leading-relaxed">
              {listingDetail.description}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xl font-semibold mb-3">What this place offers</h2>

            <div className="grid grid-cols-2 gap-3">
              {listingDetail.amenities.map((amenity) => (
                <div key={amenity.name} className="flex items-center gap-2">
                  <span className="text-gray-600">{amenity.display_name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT — Price + Map */}
        <div className="flex flex-col gap-4">

          {/* Price Box */}
          <div className="airbnb-price-box">
            <h2 className="text-2xl font-semibold">
              ${listingDetail.price_per_night}
              <span className="text-sm"> / night</span>
            </h2>

            <button className="mt-6 w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition font-semibold cursor-pointer focus:outline-none">
              Reserve
            </button>

            <p className="text-gray-500 text-sm mt-2 text-center">
              You won't be charged yet
            </p>
          </div>

          {/* Map */}
          <ListMap
            city={listingDetail.city}
            country={listingDetail.country}
          />
        </div>

      </div>
    </div>
  );
};

export default DetailedPage;
