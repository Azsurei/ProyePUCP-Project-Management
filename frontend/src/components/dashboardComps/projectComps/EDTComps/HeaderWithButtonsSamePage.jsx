import "@/styles/dashboardStyles/projectStyles/EDTStyles/HeaderWithButtons.css";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/ButtonAddNew.css";
import ButtonAddNew from "./ButtonAddNew";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import { UpdateIcon } from "@/components/equipoComps/UpdateIcon";

function ReturnIcon({ onClick }) {
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

function ExportIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m6-6H6"
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
    haveExport = false,
    isExportLoading = false,
    handlerExport,
    isExportDisabled = false,
    isAddNewDisabled = false,
}) {
    return (
        <div id="HeaderWithButtons">
            <p id="HeaderBreadcrumb">{breadcrump}</p>
            <div id="HeaderXbuttonXBackContainer" className="items-center">
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
                        <ReturnIcon onClick={handlerReturn} />
                    )}
                </div>
                <div className="flex flex-row items-center gap-3">
                    {haveExport && (
                        <Button
                            color="success"
                            className="text-white font-semibold"
                            startContent={!isExportLoading && <ExportIcon />}
                            onPress={()=>{handlerExport()}}
                            isLoading={isExportLoading}
                            isDisabled={isExportDisabled}
                        >
                            Exportar
                        </Button>
                    )}
                    {haveAddNew && (
                        <Button
                            onClick={() => handlerAddNew(newPrimarySon, 1)}
                            //className="ButtonAddNew"
                            className="bg-F0AE19 text-white font-semibold"
                            startContent={<PlusIcon/>}
                            isDisabled={isAddNewDisabled}
                        >
                            {btnText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
