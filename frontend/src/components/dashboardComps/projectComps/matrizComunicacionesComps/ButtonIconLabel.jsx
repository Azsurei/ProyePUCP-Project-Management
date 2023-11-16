import "@/styles/dashboardStyles/projectStyles/MComunicationStyles/ButtonIconLabel.css";
import React from "react";
import {Button} from "@nextui-org/react";

export default function ButtonIconLabel({icon,label1,label2,className,onClickFunction, isDisabled=false}) {
    return (
        <Button color="primary" className={`${className} ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`} onClick={!isDisabled ? onClickFunction : undefined}>
            <img src={icon} className="iconoMC"/>
            <div className="labelMC">
                {label1}
            </div>
        </Button>
    )
}