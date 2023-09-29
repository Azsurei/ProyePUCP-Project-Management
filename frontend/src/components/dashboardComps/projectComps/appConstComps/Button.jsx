import React from 'react';
import '../../../../styles/dashboardStyles/projectStyles/actaConstStyles/Button.css';

const Button = ({
                    text,
                    size = 'medium',
                    type = 'primary',
                    imgSrc,
                    imgPosition = 'before',
                    onClick
                }) => {
    return (
        <button className={`btn ${type} ${size}`} onClick={onClick}>
            {imgSrc && imgPosition === 'before' && <img src={imgSrc} alt="icon" />}
            {text}
            {imgSrc && imgPosition === 'after' && <img src={imgSrc} alt="icon" />}
        </button>
    );
};

export default Button;
