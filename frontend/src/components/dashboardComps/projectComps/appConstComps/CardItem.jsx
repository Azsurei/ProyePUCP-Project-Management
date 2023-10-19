import React, { useState } from "react";
import "../../../../styles/dashboardStyles/projectStyles/actaConstStyles/CardItem.css";

const CardItem = ({ label, value, fullWidth, isEditing, isCancel, onChange }) => {
    // Local state to hold the input's value
    const [inputValue, setInputValue] = useState(value);

    const handleInputChange = (e) => {
        // Update the local state
        setInputValue(e.target.value);
        // Notify the parent of the change
        onChange(e.target.value, label);
    };

    return (
        <div className={`card-item ${fullWidth ? 'full-width' : ''}`}>
            <div className="card-item__label">{label}</div>
            <div className="card-item__value">
                {isEditing ? (
                    // If in editing mode, render input field
                    <input
                        className="editable-input"
                        value={inputValue}  // Use the local state as the value
                        onChange={handleInputChange}  // Use the local handler for changes
                    />
                ) : (
                    // If not in editing mode, display the static value
                    isCancel? value:inputValue
                )}
            </div>
        </div>
    );
};

export default CardItem;