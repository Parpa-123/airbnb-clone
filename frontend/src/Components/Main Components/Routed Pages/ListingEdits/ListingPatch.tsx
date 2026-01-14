import { NavLink } from "react-router-dom";
import { EditableSection, ListingImagesComponents } from "./Components";
import { useListingPatch } from "./useListingPatch";
import { FormInput, FormSelect, FormCheckbox, FormTextarea } from "./FormFields";

const ListingEditPage = () => {
    const { listing, loading, options, onPatch } = useListingPatch();

    if (loading || !listing) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin inline-block w-10 h-10 border-4 border-gray-300 border-t-[#FF385C] rounded-full mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading listing details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
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

                <div className="space-y-6">
                    <EditableSection
                        title="Property details"
                        fields={["title", "property_type"]}
                        listing={listing}
                        onPatch={onPatch}
                    >
                        {(register) => (
                            <>
                                <FormInput label="Title" name="title" register={register} />
                                <FormSelect
                                    label="Property type"
                                    name="property_type"
                                    register={register}
                                    selectOptions={options?.property_options}
                                />
                            </>
                        )}
                    </EditableSection>

                    <EditableSection
                        title="Property features"
                        fields={["max_guests", "bhk_choice", "bed_choice", "bathrooms"]}
                        listing={listing}
                        onPatch={onPatch}
                    >
                        {(register) => (
                            <>
                                <FormSelect
                                    label="Max guests"
                                    name="max_guests"
                                    register={register}
                                    options={{ valueAsNumber: true }}
                                    selectOptions={options?.guest_options}
                                />
                                <FormSelect
                                    label="BHK"
                                    name="bhk_choice"
                                    register={register}
                                    options={{ valueAsNumber: true }}
                                    selectOptions={options?.bedroom_options}
                                />
                                <FormSelect
                                    label="Beds"
                                    name="bed_choice"
                                    register={register}
                                    options={{ valueAsNumber: true }}
                                    selectOptions={options?.bed_options}
                                />
                                <FormSelect
                                    label="Bathrooms"
                                    name="bathrooms"
                                    register={register}
                                    options={{ valueAsNumber: true }}
                                    selectOptions={options?.bathroom_options}
                                />
                            </>
                        )}
                    </EditableSection>

                    <EditableSection
                        title="Guest policies"
                        fields={["allows_children", "allows_infants", "allows_pets"]}
                        listing={listing}
                        onPatch={onPatch}
                    >
                        {(register) => (
                            <div className="md:col-span-2 space-y-4">
                                <FormCheckbox label="Allows children" name="allows_children" register={register} />
                                <FormCheckbox label="Allows infants" name="allows_infants" register={register} />
                                <FormCheckbox label="Allows pets" name="allows_pets" register={register} />
                            </div>
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
                                <FormInput label="Country" name="country" register={register} />
                                <FormInput label="City" name="city" register={register} />
                                <FormInput label="Address" name="address" register={register} className="md:col-span-2" />
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
                            <FormInput
                                label="Price Per Night ($)"
                                name="price_per_night"
                                register={register}
                                type="number"
                                options={{ valueAsNumber: true }}
                                className="md:col-span-2"
                            />
                        )}
                    </EditableSection>

                    <EditableSection
                        title="Description"
                        fields={["description"]}
                        listing={listing}
                        onPatch={onPatch}
                    >
                        {(register) => (
                            <FormTextarea
                                label="Description"
                                name="description"
                                register={register}
                                className="md:col-span-2"
                            />
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
                                    {options?.amenities?.map((opt) => {
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
