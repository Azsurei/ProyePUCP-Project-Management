import React from "react";
import CardItem from "./CardItem";
import "../../../../styles/dashboardStyles/projectStyles/actaConstStyles/TextInfoCard.css";

const TextInfoCard = ({title, data, isEditing, isCancel, handleDataChange, dataKey }) => {
    const isSingleItem = data.length === 1;

    return (
        <div className="project-card">
            <h2 className="project-card__title">{title}</h2>
            {data.map((item, index) => (
                <CardItem
                    key={index}
                    label={item.label}
                    value={item.value}
                    fullWidth={isSingleItem}
                    isEditing={isEditing}
                    onChange={(newValue) => handleDataChange(newValue, item.label, dataKey)}
                />
            ))}
        </div>
    );
};


export default TextInfoCard;


