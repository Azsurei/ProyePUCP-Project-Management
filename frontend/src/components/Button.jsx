"use client";

import React from "react";
import Link from "next/link";

function Button({
    buttonType = "button",
    text = "Button",
    id,
    name,
    value,
    href,
    tabIndex,
    appearance,
    onClick,
    isDisabled = false,
    iconBefore,
    iconAfter,
    dataAttributes,
    className,
}) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const button = (
        <button
            className={`bg-slate-200 font-medium py-2 px-2 rounded-md ${className}`}
            type={buttonType}
            onClick={handleClick}
            disabled={isDisabled}
            id={id}
            name={name}
            value={value}
            tabIndex={tabIndex}
            {...dataAttributes}
        >
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
        </button>
    );

    return href && !isDisabled ? <Link href={href}>{button}</Link> : button;
}

export default Button;
