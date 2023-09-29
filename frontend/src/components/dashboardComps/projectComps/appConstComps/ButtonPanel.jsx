import React from 'react';
import '../../../../styles/dashboardStyles/projectStyles/actaConstStyles/ButtonPanel.css';

const ButtonPanel = ({ children, margin = '0', align = 'left' }) => {
    return (
        <div className={`buttonPanel ${align}`} style={{ margin }}>
            {children}
        </div>
    );
};

export default ButtonPanel;
