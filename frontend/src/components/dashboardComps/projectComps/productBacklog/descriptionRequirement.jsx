import React from "react";
import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";

export default function DescriptionRequeriment({ name, onNameChange }) {
  return (
    <div className="containerDescription">
      <textarea
        rows="2"
        id="customPlaceholderInput9"
        className="customPlaceholderInput"
        placeholder="Escribe aquí"
        maxLength="200"
        value={name} // Mostrar el valor proporcionado en la prop
        onChange={(e) => onNameChange(e.target.value)} // Manejar cambios en el textarea
      />
    </div>
  );
}