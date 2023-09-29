"use client";

import React from "react";
import Link from "next/link";
import "@/styles/Button.css";

function Button({ href = '#', text, iconBefore, iconAfter, onClick, className }) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <Link href={href}>
            <button
                className={`button ${className}`}
                type="button"
                onClick={handleClick}
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
        </Link>
    );
}

export default Button;
