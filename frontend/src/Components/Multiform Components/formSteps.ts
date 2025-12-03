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
}

export interface Step {
    title: string;
    fields: StepField[];
}

// This function receives API options and returns form steps
export const createFormSteps = (apiOptions: any): Step[] => {
    return [
        {
            title: "Property Type",
            fields: [
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
                    name: "guest_count",
                    label: "Guest Count",
                    type: "select",
                    options: apiOptions?.guest_options || [],
                    rules: { required: true }
                },
                {
                    name: "bedroom_count",
                    label: "Bedroom Count",
                    type: "select",
                    options: apiOptions?.bedroom_options || [],
                    rules: { required: true }
                },
                {
                    name: "bed_count",
                    label: "Bed Count",
                    type: "select",
                    options: apiOptions?.bed_options || [],
                    rules: { required: true }
                },
                {
                    name: "bathroom_count",
                    label: "Bathroom Count",
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
                    type: "text",
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
                    options: apiOptions?.amenities || [],
                    rules: { required: true }
                },
            ]
        },
        {
            title: "Property Pricing",
            fields: [
                {
                    name: "price",
                    label: "Price",
                    type: "number",
                    rules: { required: true }
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
                    rules: { required: true }
                },
            ]
        },
    ];
};
