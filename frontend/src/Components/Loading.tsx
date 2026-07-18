import React from "react";
import Spinner from "./Spinner";

const Loading: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Spinner size="lg" />
        </div>
    );
};

export default Loading;
