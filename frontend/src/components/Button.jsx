'use client';

import React from "react";
import Link from "next/link";
import "@/styles/Button.css";

function Button({ href, text, onClick }) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <Link href={href}>
            <button className="button" type="button" onClick={handleClick}>
                {text}
            </button>
        </Link>
    );
}

export default Button;