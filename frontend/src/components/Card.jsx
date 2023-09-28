import React from "react";

function Card({ children, fill = false, padding = 4 }) {
    const widthClass = fill ? "w-full" : "max-w-md";
    const paddingClass = `p-${padding}`;

    return (
        <div
            className={`bg-white shadow-md rounded-md overflow-hidden ${widthClass} mb-4 ${paddingClass}`}
        >
            {children}
        </div>
    );
}

export default Card;
