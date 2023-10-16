import React from "react";
import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";
import { Textarea } from "@nextui-org/react";

export default function DescriptionRequeriment({ name, onNameChange }) {
    const isTextTooLong = name.length > 400;

    return (
        <div className="containerDescription">
            <Textarea
                required
                isInvalid={isTextTooLong}
                errorMessage={
                    isTextTooLong
                        ? "El texto debe ser como máximo de 400 caracteres."
                        : ""
                }
                variant={isTextTooLong ? "bordered" : "default"}
                id="customPlaceholderInput9"
                className="customPlaceholderInput"
                placeholder="Escribe aquí"
                maxLength="450"
                value={name} // Mostrar el valor proporcionado en la prop
                onChange={(e) => onNameChange(e.target.value)} // Manejar cambios en el textarea
            />
        </div>
    );
}
