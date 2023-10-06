"use client";
import { createContext, useState } from "react";
import HeaderWithButtonsSamePage from "./HeaderWithButtonsSamePage";
import ListElementsEDT from "./ListElementsEDT";

export const OpenMenuContext = createContext();

export default function EDTVisualization({
    projectName,
    projectId,
    ListComps,
    handlerGoToNew,
    handleVerDetalle,
    refreshComponentsEDT
}) {
    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleMenu = (id) => {
        if (openMenuId === id) {
            setOpenMenuId(null);
            console.log("CERRANDO MENU DE ID = " + id);
        } else {
            setOpenMenuId(id);
            console.log("abriendo menu de id = " + id);
        }
    };

    return (
        <div className="EDT">
            <HeaderWithButtonsSamePage
                haveReturn={false}
                haveAddNew={true}
                handlerAddNew={handlerGoToNew}
                newPrimarySon={ListComps.length + 1}
                breadcrump={"Inicio / Proyectos / Proyect X"}
                btnText={"Agregar nueva fase"}
            >
                EDT y diccionario EDT
            </HeaderWithButtonsSamePage>
            <div className="componentSearchContainer">
                <input type="text" />
                <button>Buscar</button>
            </div>

            {ListComps.length === 0 ? (
                <div className="missingScrenContainer">
                    <img src="/images/missing_EDTComponents.svg" alt="w" className="imgMissing"/>
                    <p className="msgMissing"> Aún no has agregado un elemento a tu EDT!</p>
                </div>
            ) : (
                <OpenMenuContext.Provider
                    value={{ openMenuId, toggleMenu, handlerGoToNew , handleVerDetalle}}
                >
                    <ListElementsEDT
                        listData={ListComps}
                        initialMargin={0}
                        refreshComponentsEDT={refreshComponentsEDT}
                    ></ListElementsEDT>
                </OpenMenuContext.Provider>
            )}
        </div>
    );
}
