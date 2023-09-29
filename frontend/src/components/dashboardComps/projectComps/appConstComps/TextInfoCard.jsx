import React from "react";
import CardItem from "./CardItem";
import "../../../../styles/dashboardStyles/projectStyles/actaConstStyles/TextInfoCard.css";

const TextInfoCard = ({ title, data }) => {
    const isSingleItem = data.length === 1;

    return (
        <div className="project-card">
            <h2 className="project-card__title">{title}</h2>
            {data.map((item, index) => (
                <CardItem
                    key={index}
                    label={item.label}
                    value={item.value}
                    fullWidth={isSingleItem}  // Pass the condition as a prop
                />
            ))}
        </div>
    );
};

export default TextInfoCard;

