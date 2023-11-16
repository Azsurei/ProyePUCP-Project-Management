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
    isDisabled = false,
}) {
    const isTextTooLong = como.length > 400;
    const isTextTooLong2 = quiero.length > 400;
    const isTextTooLong3 = para.length > 400;
    return (
        <div>
            <Textarea
                className="paddingTop"
                required
                label="Como..."
                labelPlacement="outside"
                isInvalid={isTextTooLong}
                errorMessage={
                    isTextTooLong
                        ? "El texto debe ser como máximo de 400 caracteres."
                        : ""
                }
                variant={!isDisabled ? "bordered" : "flat"}
                id="customPlaceholderInput1"
                placeholder="Escribe aquí"
                maxLength="450"
                value={como}
                onChange={(e) => onComoChange(e.target.value)}
                {...(isDisabled ? { isReadOnly: true } : {})}
            />
            <Textarea
                className="paddingTop"
                required
                label="Quiero..."
                labelPlacement="outside"
                isInvalid={isTextTooLong2}
                errorMessage={
                    isTextTooLong2
                        ? "El texto debe ser como máximo de 400 caracteres."
                        : ""
                }
                variant={!isDisabled ? "bordered" : "flat"}
                id="customPlaceholderInput2"
                placeholder="Escribe aquí"
                maxLength="450"
                value={quiero}
                onChange={(e) => onQuieroChange(e.target.value)}
                {...(isDisabled ? { isReadOnly: true } : {})}
            />
            <Textarea
                className="paddingTop"
                label="Para..."
                labelPlacement="outside"
                required
                isInvalid={isTextTooLong3}
                errorMessage={
                    isTextTooLong3
                        ? "El texto debe ser como máximo de 400 caracteres."
                        : ""
                }
                variant={!isDisabled ? "bordered" : "flat"}
                id="customPlaceholderInput3"
                placeholder="Escribe aquí"
                maxLength="450"
                value={para}
                onChange={(e) => onParaChange(e.target.value)}
                {...(isDisabled ? { isReadOnly: true } : {})}
            />
        </div>
    );
}
