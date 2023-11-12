import "@/styles/dashboardStyles/projectStyles/MComunicationStyles/ButtonIconLabel.css";
import React from "react";
import {Button} from "@nextui-org/react";

export default function IconLabel({icon,label1,label2,className,onClickFunction, isDisabled=false}) {
    return (
        <Button color="primary" className={className} onClick={!isDisabled ? onClickFunction : undefined}>
            <img src={icon} className="iconoMC"/>
            <div className="labelMC">
                {label1}{/* <span>{label2}</span> */}
            </div>
        </Button>
    )
}