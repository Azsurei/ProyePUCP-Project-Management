import React from 'react';
import '../../../../styles/dashboardStyles/projectStyles/actaConstStyles/Title.css';

const Title = ({ children, alignment = 'left', margin = '20px 20px 20px' }) => {
    const titleStyle = {
        textAlign: alignment,
        margin: margin,
    };

    return (
        <h2 className="title" style={titleStyle}>
            {children}
        </h2>
    );
};

export default Title;