import React from 'react';
import '../../../../styles/dashboardStyles/projectStyles/actaConstStyles/Button.css';

const Button = ({
                    text,
                    size = 'medium',
                    type = 'primary',
                    imgSrc,
                    imgPosition = 'before',
                    onClick,
                    isDisabled = false,
                    isContained = false,
                    hasLink = false
                }) => {
    const buttonClass = `btn ${type} ${size}${isContained ? ' contained' : ''}${hasLink ? ' link-btn' : ''}`;

    return (
        <button className={buttonClass} onClick={onClick} disabled={isDisabled}>
            {imgSrc && imgPosition === 'before' && <img src={imgSrc} alt="icon" />}
            {text}
            {imgSrc && imgPosition === 'after' && <img src={imgSrc} alt="icon" />}
        </button>
    );
};


export default Button;
