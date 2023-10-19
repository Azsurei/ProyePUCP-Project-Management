import React from "react";

function Card({ children, fill = false, padding = "p-4" }) {
    const widthClass = fill ? "w-full" : "w-auto";

    return (
        <div
            className={`bg-white shadow-md rounded-md overflow-hidden ${widthClass} mb-4 ${padding} flex items-center justify-center`}
        >
            {children}
        </div>
    );
}

export default Card;
