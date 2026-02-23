import React from "react";

const Loading: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                { }
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#22C55E] animate-spin"></div>
                </div>

                { }
                <p className="text-gray-600 font-medium animate-pulse">
                    Loading...
                </p>
            </div>
        </div>
    );
};

export default Loading;
