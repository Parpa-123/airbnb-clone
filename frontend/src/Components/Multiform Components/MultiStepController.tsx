import { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import useOptionsService from "../../services/optionsService";
import { createFormSteps } from "./formSteps";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, type EntireFormData } from "../../../public/redux/slice/slice";
import axiosInstance from "../../../public/connect";
import { toast } from "react-toastify";

interface RootState {
    form: EntireFormData;
}

const MultiStepController = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [reviewMode, setReviewMode] = useState(false);

    const formData = useSelector((state: RootState) => state.form);
    const dispatch = useDispatch();

    const { options, loading, error, fetchOptions } = useOptionsService();

    useEffect(() => { fetchOptions(); }, []);

    const handleFormSubmit = async (data: EntireFormData) => {
        try {
            const formData = new FormData();

            // Append all text fields
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("address", data.address);
            formData.append("country", data.country);
            formData.append("city", data.city);
            formData.append("property_type", data.property_type);
            formData.append("max_guests", data.max_guests.toString());
            formData.append("bhk_choice", data.bhk_choice.toString());
            formData.append("bed_choice", data.bed_choice.toString());
            formData.append("bathrooms", data.bathrooms.toString());
            formData.append("price_per_night", data.price_per_night.toString());

            // Append amenities as JSON array
            if (data.amenities && data.amenities.length > 0) {
                data.amenities.forEach((amenity) => {
                    formData.append(`amenities`, amenity);
                });
            }

            // Append image files directly with their names
            if (data.images && data.images.length > 0) {
                data.images.forEach((img, index) => {
                    formData.append(`images[${index}]file`, img.image);
                    formData.append(`images[${index}]name`, img.name);
                });
            }


            // Debug: Log FormData contents
            console.log("=== Submitting Listing Form ===");
            console.log("Form data:", data);
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            await axiosInstance.post("/listings/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Listing created successfully");
        } catch (error: any) {
            console.error("=== Listing Creation Error ===");
            console.error("Full error:", error);
            console.error("Response data:", error?.response?.data);
            console.error("Response status:", error?.response?.status);

            const errorMsg = error?.response?.data?.message ||
                error?.response?.data?.detail ||
                JSON.stringify(error?.response?.data) ||
                "Failed to create listing";
            console.log(errorMsg);
            toast.error(errorMsg);
        }
    };

    const formSteps = createFormSteps(options);
    const totalSteps = formSteps.length;
    const isFinalStep = currentStep === totalSteps - 1;

    const handleNext = (data: Partial<EntireFormData>) => {
        dispatch(updateForm(data));

        // If it's the final step → switch to review mode
        if (currentStep === totalSteps - 1) {
            setReviewMode(true);
            return;
        }

        // Otherwise go to next form step
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (reviewMode) {
            setReviewMode(false);
            return;
        }
        setCurrentStep((prev) => prev - 1);

    };

    if (loading) return <p className="text-center py-10">Loading...</p>;

    if (error)
        return (
            <div className="text-center p-6">
                <p className="text-red-600">{error}</p>
                <button onClick={fetchOptions} className="btn-primary cursor-pointer">
                    Retry
                </button>
            </div>
        );


    if (reviewMode) {
        return (
            <div className="max-w-3xl mx-auto p-8 bg-linear-to-br from-white to-gray-50 
                border border-gray-100 rounded-2xl shadow-2xl space-y-6">
                <h2 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 
                    bg-clip-text text-transparent">Review & Submit</h2>

                <pre className="bg-linear-to-br from-gray-50 to-gray-100 p-6 rounded-xl 
                    border-2 border-gray-200 shadow-inner text-sm overflow-auto max-h-96 
                    custom-scrollbar">
                    {JSON.stringify(formData, null, 2)}
                </pre>

                <div className="flex justify-between gap-4 pt-4">
                    <button
                        onClick={handleBack}
                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium 
                            rounded-xl hover:bg-gray-50 hover:border-gray-400 
                            transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                    >
                        ← Back
                    </button>

                    <button
                        onClick={() => handleFormSubmit(formData)}
                        className="px-8 py-3 bg-linear-to-r from-[#FF385C] to-[#e03050] 
                            text-white font-semibold rounded-xl hover:from-[#e03050] hover:to-[#c02848] 
                            transition-all duration-300 shadow-lg hover:shadow-xl 
                            transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        Submit ✓
                    </button>
                </div>
            </div>
        );
    }


    return (
        <DynamicForm
            stepIndex={currentStep}
            step={formSteps[currentStep]}
            formData={formData}
            handleNext={handleNext}
            handleBack={handleBack}
            isLastStep={isFinalStep}
        />
    );
};

export default MultiStepController;
