"use client";
import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";
import React from "react";
import { useState } from "react";
import { Textarea } from "@nextui-org/react";

export default function ContainerScenario({
    indice,
    onUpdateScenario,
    scenario,
    functionRemove,
}) {
    const inputId1 = `customPlaceholderScenarioInput1-${indice}`;
    const inputId2 = `customPlaceholderScenarioInput2-${indice}`;
    const inputId3 = `customPlaceholderScenarioInput3-${indice}`;
    const inputId4 = `customPlaceholderScenarioInput4-${indice}`;
    const [isTextTooLong1, setIsTextTooLong1] = useState(false);
    const [isTextTooLong2, setIsTextTooLong2] = useState(false);
    const [isTextTooLong3, setIsTextTooLong3] = useState(false);
    const [isTextTooLong4, setIsTextTooLong4] = useState(false);

    const handleInputChange = (field, value) => {
        onUpdateScenario(indice, field, value);
    };

    const isTextTooLong = (field, value) => {
        if (field === "scenario") {
            setIsTextTooLong1(value.length > 400);
        } else if (field === "dadoQue") {
            setIsTextTooLong2(value.length > 400);
        } else if (field === "cuando") {
            setIsTextTooLong3(value.length > 400);
        } else if (field === "entonces") {
            setIsTextTooLong4(value.length > 400);
        }
    };

    return (
        <div>
            <Textarea
                className="paddingTop"
                label={`Escenario ${indice}:`}
                labelPlacement="outside"
                type="text"
                id={inputId1}
                isInvalid={isTextTooLong1}
                errorMessage={
                    isTextTooLong1
                        ? "El texto debe ser como máximo de 400 caracteres."
                        : ""
                }
                variant="bordered"
                placeholder="Escribe aquí"
                maxLength="450"
                onChange={(e) => {
                    handleInputChange("scenario", e.target.value);
                    isTextTooLong("scenario", e.target.value);
                }}
                value={scenario.scenario}
            />

            <Textarea
                className="paddingTop"
                label="Dado que..."
                labelPlacement="outside"
                id={inputId2}
                isInvalid={isTextTooLong2}
                errorMessage={
                    isTextTooLong2
                        ? "El texto debe ser como máximo de 400 caracteres."
                        : ""
                }
                variant="bordered"
                placeholder="Escribe aquí"
                maxLength="450"
                onChange={(e) => {
                    handleInputChange("dadoQue", e.target.value);
                    isTextTooLong("dadoQue", e.target.value);
                }}
                value={scenario.dadoQue}
            />
            <Textarea
                className="paddingTop"
                label="Cuando..."
                labelPlacement="outside"
                id={inputId3}
                isInvalid={isTextTooLong3}
                errorMessage={
                    isTextTooLong3
                        ? "El texto debe ser como máximo de 400 caracteres."
                        : ""
                }
                variant="bordered"
                placeholder="Escribe aquí"
                maxLength="450"
                onChange={(e) => {
                    handleInputChange("cuando", e.target.value);
                    isTextTooLong("cuando", e.target.value);
                }}
                value={scenario.cuando}
            />

            <Textarea
                className="paddingTop custom-label"
                label="Entonces..."
                labelPlacement="outside"
                id={inputId4}
                isInvalid={isTextTooLong4}
                errorMessage={
                    isTextTooLong4
                        ? "El texto debe ser como máximo de 400 caracteres."
                        : ""
                }
                variant="bordered"
                placeholder="Escribe aquí"
                maxLength="450"
                onChange={(e) => {
                    handleInputChange("entonces", e.target.value);
                    isTextTooLong("entonces", e.target.value);
                }}
                value={scenario.entonces}
            />

            <img
                src="/icons/icon-cross.svg"
                alt="Eliminar"
                className="iconDelete2"
                onClick={() => {
                    functionRemove(indice - 1);
                }}
            />
        </div>
    );
}
