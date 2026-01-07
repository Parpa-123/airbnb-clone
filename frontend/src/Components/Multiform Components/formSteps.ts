import { type FieldValues } from "react-hook-form";

export interface Option {
    label: string;
    value: string | number;
}

export interface StepField {
    name: keyof FieldValues;
    label: string;
    type?: string;
    rules: object;
    options?: Option[];
    optionsKey?:
    'propertyTypes' |
    'amenities' |
    'guestCounts' |
    'bedroomCounts' |
    'bedCounts' |
    'bathroomCounts';
    accept?: string;
}

export interface Step {
    title: string;
    fields: StepField[];
}

// This function receives API options and returns form steps
export const createFormSteps = (apiOptions: any): Step[] => {
    return [
        {
            title: "Property Details",
            fields: [
                {
                    name: "title",
                    label: "Property Title",
                    type: "text",
                    rules: { required: true },
                },
                {
                    name: "property_type",
                    label: "Property Type",
                    type: "select",
                    options: apiOptions?.property_options || [],
                    rules: { required: true },
                },
            ]
        },
        {
            title: "Property Features",
            fields: [
                {
                    name: "max_guests",
                    label: "Maximum Guests",
                    type: "select",
                    options: apiOptions?.guest_options || [],
                    rules: { required: true }
                },
                {
                    name: "bhk_choice",
                    label: "Bedroom Count (BHK)",
                    type: "select",
                    options: apiOptions?.bedroom_options || [],
                    rules: { required: true }
                },
                {
                    name: "bed_choice",
                    label: "Bed Count",
                    type: "select",
                    options: apiOptions?.bed_options || [],
                    rules: { required: true }
                },
                {
                    name: "bathrooms",
                    label: "Bathrooms",
                    type: "select",
                    options: apiOptions?.bathroom_options || [],
                    rules: { required: true }
                },
            ]
        },
        {
            title: "Property Location",
            fields: [
                {
                    name: "country",
                    label: "Country",
                    type: "select",
                    rules: { required: true }
                },
                {
                    name: "city",
                    label: "City",
                    type: "select",
                    rules: { required: true }
                },
                {
                    name: "address",
                    label: "Address",
                    type: "text",
                    rules: { required: true }
                },
            ]
        },
        {
            title: "Property Description",
            fields: [
                {
                    name: "description",
                    label: "Description",
                    type: "textarea",
                    rules: { required: true }
                },
            ]
        },
        {
            title: "Property Amenities",
            fields: [
                {
                    name: "amenities",
                    label: "Amenities",
                    type: "checkbox",
                    options: apiOptions?.aminities || [],
                    rules: { required: true }
                },
            ]
        },
        {
            title: "Property Pricing",
            fields: [
                {
                    name: "price_per_night",
                    label: "Price Per Night",
                    type: "number",
                    rules: { required: true }
                },
            ]
        },
        {
            title: "Guest Policies",
            fields: [
                {
                    name: "allows_children",
                    label: "Allow Children (Ages 2-12)",
                    type: "checkbox_single",
                    rules: { required: false }
                },
                {
                    name: "allows_infants",
                    label: "Allow Infants (Under 2)",
                    type: "checkbox_single",
                    rules: { required: false }
                },
                {
                    name: "allows_pets",
                    label: "Allow Pets",
                    type: "checkbox_single",
                    rules: { required: false }
                },
            ]
        },
        {
            title: "Property Images",
            fields: [
                {
                    name: "images",
                    label: "Images",
                    type: "file",
                    accept: "image/*",
                    rules: { required: true, maxFiles: 5 }
                }
            ]
        },
    ];
};