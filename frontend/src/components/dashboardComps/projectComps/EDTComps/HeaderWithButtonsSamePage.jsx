import "@/styles/dashboardStyles/projectStyles/EDTStyles/HeaderWithButtons.css";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/ButtonAddNew.css";
import ButtonAddNew from "./ButtonAddNew";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { UpdateIcon } from "@/components/equipoComps/UpdateIcon";

export default function HeaderWithButtonsSamePage({
    breadcrump,
    children,
    haveReturn,
    handlerReturn,
    haveAddNew,
    handlerAddNew,
    newPrimarySon,
    btnText,
}) {
    return (
        <div id="HeaderWithButtons">
            <p id="HeaderBreadcrumb">{breadcrump}</p>
            <div id="HeaderXbuttonXBackContainer">
                <div id="HeaderXBackContainer">
                    <p id="MainHeader">{children}</p>
                    {haveReturn && (
                        <img
                            src="/icons/icon-goBack.svg"
                            alt=""
                            id="HeaderIconGoBack"
                            onClick={handlerReturn}
                        />
                    )}
                </div>
                {haveAddNew && (
                    <button
                        onClick={() => handlerAddNew(newPrimarySon, 1)}
                        className="ButtonAddNew"
                    >
                        {btnText}
                    </button>
                )}
            </div>
        </div>
    );
}
