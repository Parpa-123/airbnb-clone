interface JsonReviewDisplayProps {
    data: any;
    title?: string;
    onBack: () => void;
    onSubmit: () => void;
    submitLabel?: string;
    backLabel?: string;
}

const JsonReviewDisplay = ({
    data,
    title = "Review & Submit",
    onBack,
    onSubmit,
    submitLabel = "Submit ✓",
    backLabel = "← Back"
}: JsonReviewDisplayProps) => {
    return (
        <div className="max-w-3xl mx-auto p-8 bg-linear-to-br from-white to-gray-50 
            border border-gray-100 rounded-2xl shadow-2xl space-y-6">
            <h2 className="text-3xl font-bold bg-linear-to-r from-gray-900 to-gray-600 
                bg-clip-text text-transparent">{title}</h2>

            <pre className="bg-linear-to-br from-gray-50 to-gray-100 p-6 rounded-xl 
                border-2 border-gray-200 shadow-inner text-sm overflow-auto max-h-96 
                custom-scrollbar">
                {JSON.stringify(data, null, 2)}
            </pre>

            <div className="flex justify-between gap-4 pt-4">
                <button
                    onClick={onBack}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium 
                        rounded-xl hover:bg-gray-50 hover:border-gray-400 
                        transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                >
                    {backLabel}
                </button>

                <button
                    onClick={onSubmit}
                    className="px-8 py-3 bg-linear-to-r from-[#FF385C] to-[#e03050] 
                        text-white font-semibold rounded-xl hover:from-[#e03050] hover:to-[#c02848] 
                        transition-all duration-300 shadow-lg hover:shadow-xl 
                        transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
};

export default JsonReviewDisplay;
