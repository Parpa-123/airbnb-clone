import { useState, useEffect } from "react";
import DynamicForm from "./DynamicForm";
import useOptionsService from "../../services/optionsService";
import { createFormSteps } from "./formSteps";

export interface EntireFormData {
    property_type: string;
    guest_count: number;
    bedroom_count: number;
    bed_count: number;
    bathroom_count: number;
    country: string;
    city: string;
    address: string;
    description: string;
    amenities: string[];
    price: number;
    images: File[];
}

const initialData: EntireFormData = {
    property_type: "",
    guest_count: 0,
    bedroom_count: 0,
    bed_count: 0,
    bathroom_count: 0,
    country: "",
    city: "",
    address: "",
    description: "",
    amenities: [],
    price: 0,
    images: [],
};

const MultiStepController = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState(initialData);

    const { options, loading, error, fetchOptions } = useOptionsService();

    useEffect(() => {
        fetchOptions();
    }, []);

    const formSteps = createFormSteps(options);
    const isLastStep = currentStep === formSteps.length - 1;

    const handleNext = (data: Partial<EntireFormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => setCurrentStep((prev) => prev - 1);

    if (loading) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl text-gray-700">
                    Loading form options...
                </h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center space-y-4">
                <h2 className="text-2xl font-semibold text-red-600">Error</h2>
                <p className="text-gray-700">{error}</p>

                <button
                    onClick={() => fetchOptions()}
                    className="px-6 py-2 bg-[#FF385C] text-white rounded-lg 
                               hover:bg-[#e03050] transition"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (isLastStep) {
        return (
            <div className="max-w-xl mx-auto p-8 bg-white 
                            border border-gray-200 
                            rounded-xl shadow space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Review & Submit
                </h2>

                <button
                    onClick={() => console.log("Submitting:", formData)}
                    className="px-6 py-2 bg-[#FF385C] text-white rounded-lg 
                               hover:bg-[#e03050] transition shadow"
                >
                    Submit
                </button>
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
            isLastStep={isLastStep}
        />
    );
};

export default MultiStepController;
