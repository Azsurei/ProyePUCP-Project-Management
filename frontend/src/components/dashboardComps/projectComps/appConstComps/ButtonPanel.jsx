import React from 'react';
import '../../../../styles/dashboardStyles/projectStyles/actaConstStyles/ButtonPanel.css';

const ButtonPanel = ({ children }) => {
    return (
        <div className="buttonPanel">
            {children}
        </div>
    );
};

export default ButtonPanel;
