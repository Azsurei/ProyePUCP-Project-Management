"use client"
import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";
import React from "react";
import { useState } from "react";
import { Textarea } from "@nextui-org/react";
import e from "cors";

export default function ContainerScenario({ indice, onUpdateScenario}) {
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
        <div className="containerDescription">
            <div className="customInput">
                <label
                    htmlFor={inputId1}
                    className="placeholderLabel"
                >{`Escenario ${indice}:`}</label>
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
                        handleInputChange("scenario", e.target.value);
                        isTextTooLong("scenario", e.target.value);
                    }}
                />
            </div>
            <div className="customInput">
                <label htmlFor={inputId2} className="placeholderLabel">
                    Dado que...
                </label>
                <Textarea
                    id={inputId2}
                    isInvalid={isTextTooLong2}
                    errorMessage={
                        isTextTooLong2
                            ? "El texto debe ser como máximo de 400 caracteres."
                            : ""
                    }
                    variant={isTextTooLong2 ? "bordered" : "default"}
                    className="customPlaceholderInput"
                    placeholder="Escribe aquí"
                    maxLength="450"
                    onChange={(e) => {
                        handleInputChange("dadoQue", e.target.value);
                        isTextTooLong("dadoQue", e.target.value);
                    }}
                />
            </div>
            <div className="customInput">
                <label htmlFor={inputId3} className="placeholderLabel">
                    Cuando...
                </label>
                <Textarea
                    id={inputId3}
                    isInvalid={isTextTooLong3}
                    errorMessage={
                        isTextTooLong3
                            ? "El texto debe ser como máximo de 400 caracteres."
                            : ""
                    }
                    variant={isTextTooLong3 ? "bordered" : "default"}
                    className="customPlaceholderInput"
                    placeholder="Escribe aquí"
                    maxLength="450"
                    onChange={(e) => {
                        handleInputChange("cuando", e.target.value);
                        isTextTooLong("cuando", e.target.value);
                    }}
                />
            </div>
            <div className="customInput">
                <label htmlFor={inputId4} className="placeholderLabel">
                    Entonces...
                </label>
                <Textarea
                    id={inputId4}
                    isInvalid={isTextTooLong4}
                    errorMessage={
                        isTextTooLong4
                            ? "El texto debe ser como máximo de 400 caracteres."
                            : ""
                    }
                    variant={isTextTooLong4 ? "bordered" : "default"}
                    className="customPlaceholderInput"
                    placeholder="Escribe aquí"
                    maxLength="450"
                    onChange={(e) => {
                        handleInputChange("entonces", e.target.value);
                        isTextTooLong("entonces", e.target.value);
                    }}
                />
            </div>
        </div>
    );
}
