import { useForm } from "react-hook-form";
import ReusableTextField from "./ReusableTextField";
import type { Step } from "./formSteps";

interface DynamicFormProps {
    stepIndex: number;
    step: Step;
    formData: any;
    handleNext: (data: any) => void;
    handleBack: () => void;
    isLastStep: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
    stepIndex,
    step,
    formData,
    handleNext,
    handleBack,
    isLastStep,
}) => {

    const { handleSubmit, control } = useForm({
        defaultValues: formData,
    });

    return (
        <form
            onSubmit={handleSubmit((data) => handleNext(data))}
            className="w-full max-w-2xl mx-auto bg-white
                       p-8 rounded-xl shadow-sm 
                       border border-gray-200 space-y-6"
        >
            <h2 className="text-2xl font-semibold text-gray-900">
                {step.title}
            </h2>

            <div className="space-y-5">
                {step.fields.map((field) => (
                    <ReusableTextField
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        type={field.type}
                        options={field.options}
                        rules={field.rules}
                        control={control}
                    />
                ))}
            </div>

            <div className="flex items-center justify-between pt-4">
                {stepIndex > 0 && (
                    <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-2.5 border border-gray-300 
                                   text-gray-700 rounded-lg 
                                   hover:bg-gray-100 
                                   transition"
                    >
                        Back
                    </button>
                )}

                <button
                    type="submit"
                    className="ml-auto px-6 py-2.5 bg-[#FF385C] text-white 
                               rounded-lg hover:bg-[#e03050] transition shadow"
                >
                    {isLastStep ? "Submit" : "Next"}
                </button>
            </div>
        </form>
    );
};

export default DynamicForm;
