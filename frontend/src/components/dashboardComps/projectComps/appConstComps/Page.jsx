import React from 'react';
import '../../../../styles/dashboardStyles/projectStyles/actaConstStyles/Page.css';

export default function Page({ children, margin, backgroundColor, backgroundImage }) {
    const containerStyle = {
        margin,
        backgroundColor,
        backgroundImage: `url(${backgroundImage})`,
    };

    return (
        <div className="page-container" style={containerStyle}>
            {children}
        </div>
    );
}
