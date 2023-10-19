import React from "react";
import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";
import { Textarea } from "@nextui-org/react";

export default function DescriptionRequeriment({ name, onNameChange }) {
    const isTextTooLong = name.length > 400;

    return (
            <Textarea
                label="Nombre de la historia de usuario"
                labelPlacement="outside"
                isRequired
                isInvalid={isTextTooLong}
                errorMessage={
                    isTextTooLong
                        ? "El texto debe ser como máximo de 400 caracteres."
                        : ""
                }
                variant="bordered" 
                id="customPlaceholderInput9"
                placeholder="Escribe aquí"
                className="custom-label"
                maxLength="450"
                value={name} // Mostrar el valor proporcionado en la prop
                onChange={(e) => onNameChange(e.target.value)} // Manejar cambios en el textarea
                
            />
    );
}
