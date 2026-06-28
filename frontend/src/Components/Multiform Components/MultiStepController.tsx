import { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import useOptionsService from "../../services/optionsService";
import { createFormSteps } from "./formSteps";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, resetForm, type EntireFormData } from "../../redux/slices/formSlice";
import axiosInstance from "../../services/connect";
import { showSuccess, showError, extractErrorMessage, MESSAGES } from "../../utils/toastMessages";
import { useAuth } from "../Head Components/hooks/useAuth";
import JsonReviewDisplay from "./JsonReviewDisplay";

interface RootState {
    form: EntireFormData;
}

interface MultiStepControllerProps {
    onClose?: () => void;
}

const MultiStepController = ({ onClose }: MultiStepControllerProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [reviewMode, setReviewMode] = useState(false);
    
    const { user } = useAuth();

    const formData = useSelector((state: RootState) => state.form);
    const dispatch = useDispatch();

    const { options, loading, error, fetchOptions } = useOptionsService();

    useEffect(() => { if (user) fetchOptions(); }, [user]);

    const handleFormSubmit = async (data: EntireFormData) => {
        try {
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("address", data.address);
            formData.append("country", data.country);
            formData.append("city", data.city);
            formData.append("property_type", data.property_type);
            formData.append("max_guests", data.max_guests.toString());
            formData.append("bedrooms", data.bedrooms.toString());
            formData.append("beds", data.beds.toString());
            formData.append("bathrooms", data.bathrooms.toString());
            formData.append("price_per_night", data.price_per_night.toString());

            formData.append("allows_children", String(data.allows_children ?? true));
            formData.append("allows_infants", String(data.allows_infants ?? true));
            formData.append("allows_pets", String(data.allows_pets ?? false));

            if (data.amenities && data.amenities.length > 0) {
                data.amenities.forEach((amenity) => {
                    formData.append(`amenities`, amenity);
                });
            }

            if (data.images && data.images.length > 0) {
                data.images.forEach((img, index) => {
                    formData.append(`images[${index}]file`, img.image);
                    formData.append(`images[${index}]name`, img.name);
                });
            }

            await axiosInstance.post("/listings/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            showSuccess(MESSAGES.LISTING.CREATE_SUCCESS);
            dispatch(resetForm());
            onClose?.();
        } catch (error: any) {
            console.error("=== Listing Creation Error ===");
            console.error("Full error:", error);
            console.error("Response data:", error?.response?.data);
            console.error("Response status:", error?.response?.status);

            showError(extractErrorMessage(error, "Failed to create listing"));
        }
    };

    const formSteps = createFormSteps(options);
    const totalSteps = formSteps.length;
    const isFinalStep = currentStep === totalSteps - 1;

    const handleNext = (data: Partial<EntireFormData>) => {
        dispatch(updateForm(data));

        if (currentStep === totalSteps - 1) {
            setReviewMode(true);
            return;
        }

        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (reviewMode) {
            setReviewMode(false);
            return;
        }
        setCurrentStep((prev) => prev - 1);

    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                <p className="text-xl font-medium mb-2">Please login to register a property</p>
                <p className="text-sm text-gray-400">You need to be logged in to list your property</p>
            </div>
        );
    }

    if (!user?.phone) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 max-w-md mx-auto text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-5">
                    <span className="text-3xl">⚠️</span>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">Phone Number Required</h2>
                <p className="text-gray-500 mb-6 leading-relaxed">
                    A verified phone number is required to list a property. Please add one from your <strong>profile settings</strong> before continuing.
                </p>
                <button
                    onClick={onClose}
                    className="px-8 py-3 bg-brand text-white font-semibold rounded-xl hover:brightness-95 transition-all cursor-pointer"
                >
                    Got it
                </button>
            </div>
        );
    }

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
            <JsonReviewDisplay
                data={formData}
                title="Review & Submit"
                onBack={handleBack}
                onSubmit={() => handleFormSubmit(formData)}
                submitLabel="Submit ✓"
                backLabel="← Back"
            />
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
