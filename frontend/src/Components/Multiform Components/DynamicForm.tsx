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
    defaultValues: {
      ...formData,
      amenities: formData?.amenities ?? [],
      images: formData?.images ?? [],
    },
  });

  return (
    <form
      onSubmit={handleSubmit(handleNext)}
      className="
        relative   
        w-full max-w-3xl mx-auto
        bg-linear-to-br from-white to-gray-50
        rounded-2xl shadow-2xl
        border border-gray-100
        h-[450px]
        flex flex-col
        overflow-visible
      "
    >
      {/* Fixed Header */}
      <div className="p-8 pb-6 shrink-0 border-b border-gray-100">
        <h2 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {step.title}
        </h2>
      </div>

      {/* Scrollable Content Area (ONLY fields scroll) */}
      <div className="flex-1 overflow-y-auto px-8 py-2 custom-scrollbar">
        <div className="space-y-6">
          {step.fields.map((field) => (
            <ReusableTextField
              key={field.name}
              {...field}
              control={control}
            />
          ))}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="p-8 pt-6 shrink-0 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          {stepIndex > 0 && (
            <button
              type="button"
              onClick={handleBack}
              className="
                px-8 py-3
                border-2 border-gray-300 text-gray-700
                font-medium rounded-xl
                hover:bg-gray-50 hover:border-gray-400
                transition-all duration-200
                shadow-sm hover:shadow-md
              "
            >
              ← Back
            </button>
          )}

          <button
            type="submit"
            className="
              ml-auto px-8 py-3
              bg-linear-to-r from-[#FF385C] to-[#e03050]
              text-white font-semibold rounded-xl
              hover:from-[#e03050] hover:to-[#c02848]
              transition-all duration-300
              shadow-lg hover:shadow-xl
              transform hover:scale-105 active:scale-95
              cursor-pointer
            "
          >
            {isLastStep ? "Submit ✓" : "Next →"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DynamicForm;
