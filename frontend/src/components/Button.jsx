"use client";

import React from "react";
import Link from "next/link";

function Button({
    buttonType = "button",
    text,
    id,
    name,
    value,
    href,
    tabIndex,
    appearance = "default",
    iconBefore,
    iconAfter,
    fullWidth = false,
    onClick,
    isDisabled = false,
    isLoading = false,
    dataAttributes,
    className,
}) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const appearances = {
        default:
            "bg-[#091E420F] text-[#172B4D] hover:bg-[#091E4224] active:bg-[#091E424F]",
        primary: "bg-blue-500 text-white",
        secondary: "bg-gray-300 text-gray-800",
    };

    const widthContainer = `inline-flex justify-center ${
        fullWidth ? "w-full" : ""
    }`;

    const buttonContent = isLoading ? (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
    ) : (
        <>
            {iconBefore && (
                <div className="inset-y-0 left-0 mr-2 flex items-center pointer-events-none">
                    {iconBefore}
                </div>
            )}
            {text}
            {iconAfter && (
                <div className="inset-y-0 right-0 ml-2 flex items-center pointer-events-none">
                    {iconAfter}
                </div>
            )}
        </>
    );

    const button = (
        <button
            className={`${appearances[appearance]} font-medium py-2 px-2 rounded-md ${widthContainer} ${className}`}
            type={buttonType}
            onClick={handleClick}
            disabled={isDisabled}
            id={id}
            name={name}
            value={value}
            tabIndex={tabIndex}
            {...dataAttributes}
        >
            {buttonContent}
        </button>
    );

    return href && !isDisabled ? <Link href={href}>{button}</Link> : button;
}

export default Button;
