import React from "react";
import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";
import { Textarea } from "@nextui-org/react";

export default function DescriptionRequeriment({
    name,
    onNameChange,
    isDisabled = false,
}) {
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
            variant={!isDisabled ? "bordered" : "flat"}
            id="customPlaceholderInput9"
            placeholder="Escribe aquí"
            className="nombreLabel"
            maxLength="450"
            value={name} // Mostrar el valor proporcionado en la prop
            onChange={(e) => onNameChange(e.target.value)} // Manejar cambios en el textarea
            {...(isDisabled ? { isReadOnly: true } : {})}
        />
    );
}
