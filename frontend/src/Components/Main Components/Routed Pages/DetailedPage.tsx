import React, {
  useEffect,
  useState,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../public/connect";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ListMap from "../../../services/MapService";

/* ----------------------------- INTERFACES ----------------------------- */

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

/* --------------------------- COMPONENT --------------------------- */

const DetailedPage = () => {
  const { id } = useParams();

  const [listingDetail, setListingDetail] = useState<ListingDetail | null>(null);
  const [photos, setPhotos] = useState<ListingImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openFull, setOpenFull] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  /* Swiper Navigation Refs */
  const mainPrev = useRef<HTMLButtonElement>(null);
  const mainNext = useRef<HTMLButtonElement>(null);

  const fullPrev = useRef<HTMLButtonElement>(null);
  const fullNext = useRef<HTMLButtonElement>(null);
  const fullSwiperRef = useRef<any>(null);

  /* --------------------- KEYBOARD SHORTCUTS --------------------- */
  useEffect(() => {
    if (!openFull) return;

    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenFull(false);
      if (e.key === "ArrowLeft") fullSwiperRef.current?.slidePrev();
      if (e.key === "ArrowRight") fullSwiperRef.current?.slideNext();
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [openFull]);

  /* ----------------------- FETCH DATA ----------------------- */

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axiosInstance.get<ListingDetail>(
          `/listings/${Number(id)}/`
        );
        setListingDetail(res.data);
        setPhotos(res.data.images);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  if (!listingDetail) return <p>No data found.</p>;

  /* --------------------------- RENDER --------------------------- */

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Title */}
      <h1 className="text-3xl font-semibold">{listingDetail.title}</h1>
      <p className="text-gray-600 text-sm">
        {listingDetail.city}, {listingDetail.country}
      </p>

      {/* ----------------------- MAIN SWIPER ----------------------- */}
      <div className="mt-6 airbnb-swiper relative">

        <button ref={mainPrev} className="airbnb-arrow airbnb-arrow-prev cursor-pointer">‹</button>
        <button ref={mainNext} className="airbnb-arrow airbnb-arrow-next cursor-pointer">›</button>

        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: mainPrev.current,
            nextEl: mainNext.current,
          }}
          pagination={{ clickable: true }}
          onInit={(swiper) => {
            if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
              swiper.params.navigation.prevEl = mainPrev.current;
              swiper.params.navigation.nextEl = mainNext.current;
            }
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          {photos.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="w-full h-[450px] overflow-hidden rounded-xl cursor-pointer"
                onClick={() => {
                  setStartIndex(idx);
                  setOpenFull(true);
                }}
              >
                <img src={img.image} alt={img.name} className="w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* --------------------- FULLSCREEN MODAL --------------------- */}
      {openFull && (
        <div className="fixed inset-0 bg-black/90 z-9999 flex justify-center items-center">

          <button ref={fullPrev} className="airbnb-arrow airbnb-arrow-prev cursor-pointer">‹</button>
          <button ref={fullNext} className="airbnb-arrow airbnb-arrow-next cursor-pointer">›</button>

          <Swiper
            modules={[Pagination, Navigation]}
            initialSlide={startIndex}
            pagination={{ clickable: true }}
            navigation={{
              prevEl: fullPrev.current,
              nextEl: fullNext.current,
            }}
            onInit={(swiper) => {
              if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                swiper.params.navigation.prevEl = fullPrev.current;
                swiper.params.navigation.nextEl = fullNext.current;
              }
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            onSwiper={(swiper) => (fullSwiperRef.current = swiper)}
            className="w-full h-full"
          >
            {photos.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="flex justify-center items-center w-full h-full">
                  <img
                    src={img.image}
                    className="max-w-[95%] max-h-[95%] rounded-lg object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

         
        </div>
      )}

      {/* ----------------------- PAGE CONTENT ----------------------- */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="md:col-span-2">
          <div className="airbnb-host-card">
            <img
              src={listingDetail.host.avatar || "https://via.placeholder.com/80"}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <p className="text-xl font-semibold">Hosted by {listingDetail.host.username}</p>
              <p className="text-gray-500 text-sm">
                {listingDetail.max_guests} guests • {listingDetail.bed_choice} beds •{" "}
                {listingDetail.bhk_choice} BHK • {listingDetail.bathrooms} baths
              </p>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-6">About this place</h2>
          <p className="text-gray-700 leading-relaxed">{listingDetail.description}</p>

          <h2 className="text-xl font-semibold mt-6 mb-3">What this place offers</h2>
          <div className="grid grid-cols-2 gap-3">
            {listingDetail.amenities.map((a) => (
              <div key={a.name} className="text-gray-600">
                {a.display_name}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4">
          <div className="airbnb-price-box">
            <h2 className="text-2xl font-semibold">
              ${listingDetail.price_per_night}
              <span className="text-sm"> / night</span>
            </h2>

            <button className="mt-6 w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition font-semibold">
              Reserve
            </button>

            <p className="text-gray-500 text-sm mt-2 text-center">You won't be charged yet</p>
          </div>

          <ListMap city={listingDetail.city} country={listingDetail.country} />
        </div>
      </div>
    </div>
  );
};

export default DetailedPage;
