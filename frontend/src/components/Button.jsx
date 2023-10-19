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
    const handleClick = (event) => {
        if (onClick) {
            onClick(event);
        }
    };


    const appearances = {
        default: {
            default: "bg-[#091E420F] text-[#172B4D] border-transparent",
            hover: "hover:bg-[#091E4224]",
            active: "active:bg-[#091E424F]",
            disabled: "bg-[#091E4208] text-[#091E424F] cursor-not-allowed",
        },
        primary: {
            default: "bg-[#172B4D] text-[#FFFFFF] border-transparent",
            hover: "hover:bg-[#09326C]",
            active: "active:bg-[#101E35]",
            disabled: "bg-[#091E4208] text-[#091E424F] cursor-not-allowed",
        },
        secondary: {
            default: "bg-[#F0AE19] text-[#FFFFFF] border-transparent",
            hover: "hover:bg-[#FFC644]",
            active: "active:bg-[#DEA420]",
            disabled: "bg-[#091E4208] text-[#091E424F] cursor-not-allowed",
        },
        subtle: {
            default: "bg-transparent text-[#172B4D] border-transparent",
            hover: "hover:bg-[#091E4224]",
            active: "active:bg-[#091E424F]",
            disabled: "bg-transparent text-[#9CA3AF] cursor-not-allowed",
        },
        link: {
            default: "bg-transparent text-[#0C66E4] border-transparent no-underline",
            hover: "hover:text-[#0055CC] hover:underline",
            active: "active:text-[#004BB3] active:underline",
            disabled: "bg-transparent text-[#091E424F] cursor-not-allowed",
        },
        danger: {
            default: "bg-[#CA3521] text-[#FFFFFF] border-transparent",
            hover: "hover:bg-[#AE2A19]",
            active: "active:bg-[#601E16]",
            disabled: "bg-[#091E4208] text-[#091E424F] cursor-not-allowed",
        },
    };

    // Inserción de estilos
    const buttonStyles = [
        "font-medium",
        "py-2",
        "px-2",
        "rounded-md",
        "inline-flex justify-center",
        fullWidth ? "w-full" : "",
        !isDisabled
            ? appearances[appearance].default
            : appearances[appearance].disabled,
        !isDisabled && `${appearances[appearance].hover}`,
        !isDisabled && `${appearances[appearance].active}`,
        className,
    ];

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
            className={buttonStyles.join(" ")}
            type={buttonType}
            onClick={() => onClick()}
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

    return href && !isDisabled ? (
        <Link className={fullWidth ? "w-full" : ""} href={href}>
            {button}
        </Link>
    ) : (
        button
    );
}

export default Button;
