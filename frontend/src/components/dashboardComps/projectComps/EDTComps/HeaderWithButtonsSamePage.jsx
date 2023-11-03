import "@/styles/dashboardStyles/projectStyles/EDTStyles/HeaderWithButtons.css";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/ButtonAddNew.css";
import ButtonAddNew from "./ButtonAddNew";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { UpdateIcon } from "@/components/equipoComps/UpdateIcon";

function ReturnIcon({onClick}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-[26px] h-[26px] mt-[0.12rem] p-[3px] rounded-[100%] hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
            onClick={onClick}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
        </svg>
    );
}

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
                    <p id="MainHeader" className="text-mainHeaders">
                        {children}
                    </p>
                    {haveReturn && (
                        // <img
                        //     src="/icons/icon-goBack.svg"
                        //     alt=""
                        //     id="HeaderIconGoBack"
                        //     onClick={handlerReturn}
                        // />
                        <ReturnIcon onClick={handlerReturn}/>
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
