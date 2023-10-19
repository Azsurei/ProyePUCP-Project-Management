import React from "react";
import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";
import { Textarea } from "@nextui-org/react";

export default function ContainerAsWantFor({
    como,
    quiero,
    para,
    onComoChange,
    onQuieroChange,
    onParaChange,
}) {
    const isTextTooLong = como.length > 400;
    const isTextTooLong2 = quiero.length > 400;
    const isTextTooLong3 = para.length > 400;
    return (
        <div className="containerDescription">
            <div className="customInput">
                <label
                    htmlFor="customPlaceholderInput1"
                    className="placeholderLabel"
                >
                    Como...
                </label>
                <Textarea
                    required
                    isInvalid={isTextTooLong}
                    errorMessage={
                        isTextTooLong
                            ? "El texto debe ser como máximo de 400 caracteres."
                            : ""
                    }
                    variant={isTextTooLong ? "bordered" : "default"}
                    id="customPlaceholderInput1"
                    className="customPlaceholderInput"
                    placeholder="Escribe aquí"
                    maxLength="450"
                    value={como}
                    onChange={(e) => onComoChange(e.target.value)}
                />
            </div>
            <div className="customInput">
                <label
                    htmlFor="customPlaceholderInput2"
                    className="placeholderLabel"
                >
                    Quiero...
                </label>
                <Textarea
                    required
                    isInvalid={isTextTooLong2}
                    errorMessage={
                        isTextTooLong2
                            ? "El texto debe ser como máximo de 400 caracteres."
                            : ""
                    }
                    variant={isTextTooLong2 ? "bordered" : "default"}
                    id="customPlaceholderInput2"
                    className="customPlaceholderInput"
                    placeholder="Escribe aquí"
                    maxLength="450"
                    value={quiero}
                    onChange={(e) => onQuieroChange(e.target.value)}
                />
            </div>
            <div className="customInput">
                <label
                    htmlFor="customPlaceholderInput3"
                    className="placeholderLabel"
                >
                    Para...
                </label>
                <Textarea
                    required
                    isInvalid={isTextTooLong3}
                    errorMessage={
                        isTextTooLong3
                            ? "El texto debe ser como máximo de 400 caracteres."
                            : ""
                    }
                    variant={isTextTooLong3 ? "bordered" : "default"}
                    id="customPlaceholderInput3"
                    className="customPlaceholderInput"
                    placeholder="Escribe aquí"
                    maxLength="450"
                    value={para}
                    onChange={(e) => onParaChange(e.target.value)}
                />
            </div>
        </div>
    );
}
