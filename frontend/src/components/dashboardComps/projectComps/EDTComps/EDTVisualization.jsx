"use client";
import { createContext, useState } from "react";
import HeaderWithButtonsSamePage from "./HeaderWithButtonsSamePage";
import ListElementsEDT from "./ListElementsEDT";
import TreeGraphComponent from "@/app/dashboard/[project]/EDT/TreeGraphComponent";
import {Tab, Tabs} from "@nextui-org/react";

export const OpenMenuContext = createContext();

export default function EDTVisualization({
    projectName,
    projectId,
    ListComps,
    handlerGoToNew,
    handleVerDetalle,
    refreshComponentsEDT,
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

    console.log(ListComps);

    return (
        <div className="EDT">
            <HeaderWithButtonsSamePage
                haveReturn={false}
                haveAddNew={true}
                handlerAddNew={handlerGoToNew}
                newPrimarySon={ListComps.length + 1}
                breadcrump={"Inicio / Proyectos / " + projectName}
                btnText={"Nuevo componente"}
            >
                EDT y diccionario EDT
            </HeaderWithButtonsSamePage>


            <Tabs aria-label="Options" radius="full" color="warning">
                <Tab key="dropdown" title="Vista lista" className="montserrat text-blue-900">
                    {ListComps.length !== 0 && (
                        <p className="font-[Montserrat] text-lg font-medium text-slate-500">
                            Presiona en uno de los componentes para ver a sus
                            componentes hijos
                        </p>
                    )}

                    {ListComps.length === 0 ? (
                        <div className="missingScrenContainer">
                            <img
                                src="/images/missing_EDTComponents.svg"
                                alt="w"
                                className="imgMissing"
                            />
                            <p className="msgMissing">
                                {" "}
                                Aún no has agregado un elemento a tu EDT!
                            </p>
                        </div>
                    ) : (
                        <OpenMenuContext.Provider
                            value={{
                                openMenuId,
                                toggleMenu,
                                handlerGoToNew,
                                handleVerDetalle,
                            }}
                        >
                            <ListElementsEDT
                                listData={ListComps}
                                initialMargin={0}
                                refreshComponentsEDT={refreshComponentsEDT}
                            ></ListElementsEDT>
                        </OpenMenuContext.Provider>
                    )}
                </Tab>
                <Tab key="tree" title="Vista arbol" className="montserrat text-blue-900">
                    {ListComps.length !== 0 && (
                        <p className="font-[Montserrat] text-lg font-medium text-slate-500">
                            Observa la lista de arbol
                        </p>
                    )}
                    <div className="m-8">
                        <TreeGraphComponent data={ListComps} />
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
}
