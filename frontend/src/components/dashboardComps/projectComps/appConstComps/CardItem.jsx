import React from "react";
import "../../../../styles/dashboardStyles/projectStyles/actaConstStyles/CardItem.css";

const CardItem = ({ label, value }) => {
    return (
        <div className="card-item">
            <div className="card-item__label">{label}</div>
            <div className="card-item__value">{value}</div>
        </div>
    );
};
export default CardItem;
