import React from "react";

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
    );
};

export default Loading;
