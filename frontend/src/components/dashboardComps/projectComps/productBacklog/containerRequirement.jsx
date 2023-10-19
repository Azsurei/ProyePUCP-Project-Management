"use client";
import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";
import React from "react";
import { useState } from "react";
import { Textarea } from "@nextui-org/react";

export default function ContainerRequirement({
    indice,
    updateRequirementField,
    requirement,
    functionRemove
}) {
    const inputId1 = `customPlaceholderRequirementInput1-${indice}`;

    const [isTextTooLong1, setIsTextTooLong1] = useState(false);

    const handleInputChange = (value) => {
        updateRequirementField(indice, value);
    };

    const isTextTooLong = (value) => {
        setIsTextTooLong1(value.length > 400);
    };

    return (
        <div className="containerDescription">
            <div className="customInput">
                <label
                    htmlFor={inputId1}
                    className="placeholderLabel"
                >{`Requerimiento ${indice}`}</label>
                <Textarea
                    id={inputId1}
                    isInvalid={isTextTooLong1}
                    errorMessage={
                        isTextTooLong1
                            ? "El texto debe ser como máximo de 400 caracteres."
                            : ""
                    }
                    variant={isTextTooLong1 ? "bordered" : "default"}
                    className="customPlaceholderInput"
                    placeholder="Escribe aquí"
                    maxLength="450"
                    onChange={(e) => {
                        handleInputChange(e.target.value);
                        isTextTooLong(e.target.value);
                    }}
                    value={requirement.requirement}
                />
                <img
                    src="/icons/icon-cross.svg"
                    alt="Eliminar"
                    className="iconDelete"
                    onClick={() => {
                        console.log(indice-1);
                        functionRemove(indice - 1);
                    }}
                />
            </div>
        </div>
    );
}
