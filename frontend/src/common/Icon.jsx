import React from 'react';
import Image from "next/image";

const Icon = ({ source, size }) => {
    // Define size based on props
    const sizes = {
        small: '16px',
        medium: '24px',
        large: '32px',
        xlarge: '48px'
    };

    // If the size isn't one of the expected values, default to 'medium'
    const iconSize = sizes[size] || sizes.medium;

    return (
        <Image
            src={source}
            alt="Icon"
            style={{
                width: iconSize,
                height: iconSize
            }}
        />
    );
};

export default Icon;