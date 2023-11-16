"use client";
import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";
import React from "react";
import { useState } from "react";
import { Textarea } from "@nextui-org/react";

export default function ContainerResponsePlans({
    indice,
    updateResponsePlansField,
    responsePlans,
    functionRemove,
    isDisabled = false,
}) {
    const inputId1 = `customPlaceholderResponsePlansInput1-${indice}`;

    const [isTextTooLong1, setIsTextTooLong1] = useState(false);

    const handleInputChange = (value) => {
        updateResponsePlansField(indice, value);
    };

    const isTextTooLong = (value) => {
        setIsTextTooLong1(value.length > 400);
    };

    return (
        <div className="containerBack">
            <Textarea
                className="paddingTop custom-label"
                label={`Plan de respuesta ${indice}`}
                labelPlacement="outside"
                id={inputId1}
                isInvalid={isTextTooLong1}
                errorMessage={
                    isTextTooLong1
                        ? "El texto debe ser como máximo de 400 caracteres."
                        : ""
                }
                variant={!isDisabled ? "bordered" : "flat"}
                placeholder="Escribe aquí"
                maxLength="450"
                onChange={(e) => {
                    handleInputChange(e.target.value);
                    isTextTooLong(e.target.value);
                }}
                value={responsePlans.responsePlans}
                {...(isDisabled ? { isReadOnly: true } : {})}
            />
            {!isDisabled && (
                <img
                    src="/icons/icon-trash.svg"
                    alt="Eliminar"
                    className="iconDelete2"
                    onClick={() => {
                        console.log(indice - 1);
                        functionRemove(indice - 1);
                    }}
                />
            )}
        </div>
    );
}
