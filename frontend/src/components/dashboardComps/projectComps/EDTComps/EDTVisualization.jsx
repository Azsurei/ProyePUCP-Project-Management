"use client";
import {createContext, useContext, useState} from "react";
import HeaderWithButtonsSamePage from "./HeaderWithButtonsSamePage";
import ListElementsEDT from "./ListElementsEDT";
import TreeGraphComponent from "@/app/dashboard/[project]/EDT/TreeGraphComponent";
import { Button, Spinner, Tab, Tabs } from "@nextui-org/react";
import { toast } from "sonner";
import axios from "axios";
import { saveAs } from "file-saver";
import EmptyBoxIcon from "@/components/EmptyBoxIcon";
axios.defaults.withCredentials = true;
import {SessionContext} from "@/app/dashboard/layout";

export const OpenMenuContext = createContext();

export default function EDTVisualization({
    projectName,
    projectId,
    ListComps,
    handlerGoToNew,
    handleVerDetalle,
    refreshComponentsEDT,
    isListLoading,
     selectedTab,
     setSelectedTab
}) {
    const [openMenuId, setOpenMenuId] = useState(null);
    const { sessionData } = useContext(SessionContext);

    console.log("Selected tab: ")
    console.log(selectedTab);

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

    const [isExportLoading, setIsExportLoading] = useState(false);
    async function handlerExport() {
        try {
            setIsExportLoading(true);
            const exportURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/EDT/descargarExcelEDT";

            const response = await axios.post(
                exportURL,
                {
                    componentes: ListComps,
                },
                {
                    responseType: "blob", // Important for binary data
                }
            );

            setTimeout(() => {
                const today = new Date();

                let day = today.getDate();
                let month = today.getMonth() + 1;
                let year = today.getFullYear();

                day = day < 10 ? "0" + day : day;
                month = month < 10 ? "0" + month : month;

                // Create the formatted date string
                let formattedDate = `${day}_${month}_${year}`;

                const fileName =
                    projectName.split(" ").join("") +
                    "_EDT_" +
                    formattedDate +
                    ".xlsx";
                console.log(fileName);
                saveAs(response.data, fileName);

                setIsExportLoading(false);
                toast.success("Se exporto el EDT con exito");
            }, 500);
        } catch (error) {
            setIsExportLoading(false);
            toast.error("Error al exportar tu EDT");
            console.log(error);
        }
    }

    return (
        <div className="EDT">
            <HeaderWithButtonsSamePage
                haveReturn={false}
                haveAddNew={sessionData.rolNameInProject !== "Supervisor"}
                handlerAddNew={handlerGoToNew}
                newPrimarySon={ListComps.length + 1}
                breadcrump={"Inicio / Proyectos / " + projectName}
                btnText={"Nuevo componente"}
                haveExport={true}
                handlerExport={async () => {
                    await handlerExport();
                }}
                isExportDisabled={ListComps.length === 0}
                isExportLoading={isExportLoading}
            >
                EDT y diccionario EDT
            </HeaderWithButtonsSamePage>

            {isListLoading === true ? (
                <div className="flex-1 flex justify-center items-center">
                    <Spinner size="lg" />
                </div>
            ) : null}

            {isListLoading === false ? (
                <Tabs
                    aria-label="Options"
                    selectedKey={selectedTab}
                    onSelectionChange={setSelectedTab}
                    radius="full"
                    color="warning">
                    <Tab
                        key="dropdown"
                        title="Vista lista"
                        className="montserrat text-blue-900 flex-1"
                    >
                        {ListComps.length !== 0 && (
                            <p className="font-[Montserrat] text-lg font-medium text-slate-500">
                                Presiona en uno de los componentes para ver a
                                sus componentes hijos
                            </p>
                        )}

                        {ListComps.length === 0 ? (
                            <div className="w-full h-full flex justify-center items-center flex-col gap-7">
                                <div className="flex flex-col gap-3">
                                    <p className="m-0 font-medium text-black text-xl">
                                        Tu EDT aún no cuenta con componentes
                                    </p>
                                    <EmptyBoxIcon width={200} height={200} />
                                </div>
                                {
                                    sessionData.rolNameInProject !== "Supervisor" && (
                                        <Button
                                            className="bg-F0AE19 text-white font-medium"
                                            size="md"
                                            onPress={() => {
                                                handlerGoToNew(ListComps.length + 1, 1);
                                            }}
                                        >
                                            Empieza ahora
                                        </Button>
                                    )
                                }

                            </div>
                        ) : (
                            <div className="flex flex-col">
                                <div
                                    className="flex flex-row py-[.4rem] px-[1rem] 
                                bg-mainSidebar rounded-xl text-sm tracking-wider 
                                items-center mt-5 text-[#a1a1aa] gap-2"
                                >
                                    <p className="w-1/3">NOMBRE</p>
                                    <p className="flex-1">FECHAS</p>
                                </div>
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
                                        refreshComponentsEDT={
                                            refreshComponentsEDT
                                        }
                                    ></ListElementsEDT>
                                </OpenMenuContext.Provider>
                            </div>
                        )}
                    </Tab>
                    <Tab
                        key="tree"
                        title="Vista arbol"
                        className="montserrat text-blue-900"
                    >
                        {ListComps.length !== 0 && (
                            <p className="font-[Montserrat] text-lg font-medium text-slate-500">
                                Interactua con el arbol de EDT y realice zoom
                                con los controles.
                            </p>
                        )}
                        <div className="m-8">
                            <OpenMenuContext.Provider
                                value={{
                                    openMenuId,
                                    toggleMenu,
                                    handlerGoToNew,
                                    handleVerDetalle,
                                }}
                            >
                                <TreeGraphComponent
                                    projectName={projectName}
                                    data={ListComps}
                                />
                            </OpenMenuContext.Provider>
                        </div>
                    </Tab>
                </Tabs>
            ) : null}
        </div>
    );
}
