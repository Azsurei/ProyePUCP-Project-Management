import React from "react";

function TextField({
    iconBefore,
    iconAfter,
    width,
    fullWidth = false,
    ...props
}) {
    const inputWidth = width ? `${width}px` : "auto";
    const containerWidth = fullWidth ? "w-full" : "";

    const inputStyle = {
        borderRadius: "5px",
        border: "2px solid var(--color-border-input, rgba(9, 30, 66, 0.14))",
        width: inputWidth,
    };

    return (
        <div
            className={`montserrat flex flex-row border border-gray-300 rounded-md py-2 px-4 ${containerWidth}`}
            style={inputStyle}
        >
            {iconBefore && (
                <div className="inset-y-0 left-0 mr-2 flex items-center pointer-events-none">
                    {iconBefore}
                </div>
            )}
            <input
                type="text"
                {...props}
                className="w-full flex-grow truncate focus:outline-none"
            />
            {iconAfter && (
                <div className="inset-y-0 right-0 ml-2 flex items-center pointer-events-none">
                    {iconAfter}
                </div>
            )}
        </div>
    );
}

export default TextField;
