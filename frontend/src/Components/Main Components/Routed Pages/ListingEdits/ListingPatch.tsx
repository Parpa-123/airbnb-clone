import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import axiosInstance from "../../../../../public/connect";
import { showSuccess, showError, MESSAGES } from "../../../../utils/toastMessages";
import { EditableSection, ListingImagesComponents } from "./Components";
import useOptionsService from "../../../../services/optionsService";
import type { ListingEditData } from "./types";

const ListingEditPage = () => {
    const { id } = useParams<{ id: string }>();

    const [listing, setListing] = useState<ListingEditData | null>(null);

    const { options, fetchOptions } = useOptionsService();

    useEffect(() => {
        fetchOptions();
    }, []);

    /* ---------------- FETCH LISTING ---------------- */
    const fetchListing = async () => {
        const res = await axiosInstance.get(`/listings/${Number(id)}/edit/`);
        setListing(res.data);
    };

    useEffect(() => {
        fetchListing();
    }, [id]);

    /* ---------------- PATCH HANDLER ---------------- */
    const onPatch = async (
        payload: Partial<ListingEditData> | FormData
    ) => {
        if (!listing) {
            return;
        }

        const previous = listing;

        // optimistic UI update (only for JSON payloads, not for FormData image uploads)
        if (!(payload instanceof FormData)) {
            setListing((prev: ListingEditData | null) => ({
                ...prev!,
                ...payload
            } as ListingEditData));
        }

        try {
            await axiosInstance.patch(
                `/listings/${id}/edit/`,
                payload,
                payload instanceof FormData
                    ? { headers: { "Content-Type": "multipart/form-data" } }
                    : undefined
            );

            showSuccess(MESSAGES.LISTING.UPDATE_SUCCESS);

            // Refetch listing data after FormData updates (for images)
            if (payload instanceof FormData) {
                await fetchListing();
            }
        }
        catch (err) {
            setListing(previous);
            showError(MESSAGES.LISTING.UPDATE_FAILED);
        }
    };

    if (!listing) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin inline-block w-10 h-10 border-4 border-gray-300 border-t-[#FF385C] rounded-full mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading listing details...</p>
                </div>
            </div>
        );
    }

    /* ---------------- RENDER ---------------- */
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <NavLink
                        to=".."
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FF385C] transition-colors mb-4 group"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium">Back</span>
                    </NavLink>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Listing</h1>
                    <p className="text-gray-600">Update your property details and information</p>
                </div>

                {/* Form Sections */}
                <div className="space-y-6">
                    <EditableSection
                        title="Property details"
                        fields={["title", "property_type"]}
                        listing={listing}
                        onPatch={onPatch}
                    >
                        {(register) => (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                    <input
                                        {...register("title")}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Property type</label>
                                    <select
                                        {...register("property_type")}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all bg-white"
                                    >
                                        {options?.property_options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </EditableSection>

                    <EditableSection
                        title="Property features"
                        fields={[
                            "max_guests",
                            "bhk_choice",
                            "bed_choice",
                            "bathrooms"
                        ]}
                        listing={listing}
                        onPatch={onPatch}
                    >
                        {(register) => (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max guests</label>
                                    <select
                                        {...register("max_guests", { valueAsNumber: true })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all bg-white"
                                    >
                                        {options?.guest_options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">BHK</label>
                                    <select
                                        {...register("bhk_choice", { valueAsNumber: true })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all bg-white"
                                    >
                                        {options?.bedroom_options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Beds</label>
                                    <select
                                        {...register("bed_choice", { valueAsNumber: true })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all bg-white"
                                    >
                                        {options?.bed_options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                                    <select
                                        {...register("bathrooms", { valueAsNumber: true })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all bg-white"
                                    >
                                        {options?.bathroom_options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </EditableSection>

                    <EditableSection
                        title="Guest policies"
                        fields={[
                            "allows_children",
                            "allows_infants",
                            "allows_pets",
                        ]}
                        listing={listing}
                        onPatch={onPatch}
                    >
                        {(register) => (
                            <>
                                <div className="md:col-span-2 space-y-4">
                                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:border-[#FF385C] hover:bg-gray-50 transition-all cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register("allows_children")}
                                            className="w-4 h-4 text-[#FF385C] border-gray-300 rounded focus:ring-[#FF385C] focus:ring-2"
                                        />
                                        <span className="text-sm text-gray-700">Allows children</span>
                                    </label>

                                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:border-[#FF385C] hover:bg-gray-50 transition-all cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register("allows_infants")}
                                            className="w-4 h-4 text-[#FF385C] border-gray-300 rounded focus:ring-[#FF385C] focus:ring-2"
                                        />
                                        <span className="text-sm text-gray-700">Allows infants</span>
                                    </label>

                                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:border-[#FF385C] hover:bg-gray-50 transition-all cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register("allows_pets")}
                                            className="w-4 h-4 text-[#FF385C] border-gray-300 rounded focus:ring-[#FF385C] focus:ring-2"
                                        />
                                        <span className="text-sm text-gray-700">Allows pets</span>
                                    </label>
                                </div>
                            </>
                        )}
                    </EditableSection>

                    <EditableSection
                        title="Location"
                        fields={["country", "city", "address"]}
                        listing={listing}
                        onPatch={onPatch}
                    >
                        {(register) => (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                    <input
                                        {...register("country")}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input
                                        {...register("city")}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <input
                                        {...register("address")}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                                    />
                                </div>
                            </>
                        )}
                    </EditableSection>

                    <EditableSection
                        title="Pricing"
                        fields={["price_per_night"]}
                        listing={listing}
                        onPatch={onPatch}
                    >
                        {(register) => (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Night ($)</label>
                                <input
                                    type="number"
                                    {...register("price_per_night", { valueAsNumber: true })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                                />
                            </div>
                        )}
                    </EditableSection>

                    <EditableSection
                        title="Description"
                        fields={["description"]}
                        listing={listing}
                        onPatch={onPatch}
                    >
                        {(register) => (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    {...register("description")}
                                    rows={5}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all resize-none"
                                />
                            </div>
                        )}
                    </EditableSection>

                    <EditableSection
                        title="Amenities"
                        fields={["amenities"]}
                        listing={listing}
                        onPatch={onPatch}
                    >
                        {(register) => (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {options?.aminities?.map((opt) => {
                                        const isChecked = listing.amenities.some(
                                            (amenity) => amenity.name === opt.value
                                        );

                                        return (
                                            <label
                                                key={opt.value}
                                                className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg hover:border-[#FF385C] hover:bg-gray-50 transition-all cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={opt.value}
                                                    {...register("amenities")}
                                                    defaultChecked={isChecked}
                                                    className="w-4 h-4 text-[#FF385C] border-gray-300 rounded focus:ring-[#FF385C] focus:ring-2"
                                                />
                                                <span className="text-sm text-gray-700">{opt.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </EditableSection>

                    <ListingImagesComponents
                        images={listing.images}
                        onUpload={onPatch}
                    />
                </div>
            </div>
        </div>
    );
};

export default ListingEditPage;
