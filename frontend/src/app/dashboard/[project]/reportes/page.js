"use client";
import React, { useEffect, useState } from "react";
import { SmallLoadingScreen } from "../layout";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { useContext } from "react";
import { Button } from "@nextui-org/react";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import ReportTypeCard from "@/components/dashboardComps/projectComps/reportesComps/ReportTypeCard";
export default function Reportes(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [screenState, setScreenState] = useState(0);
    //0 para la vista de reportes generados previamente
    //1 para la vista de seleccion de tipo de nuevo reporte

    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    //esta sera la pantalla de vista de reportes generados y la pantalla para crear uno nuevo (seleccionar cual)

    return (
        <div className="divHistorialReportes">
            {screenState === 0 && (
                <div className="flex-1 border border-green-400">
                    <Breadcrumbs>
                        <BreadcrumbsItem href="/" text="Inicio" />
                        <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                        <BreadcrumbsItem
                            href={"/dashboard/" + projectName + "=" + projectId}
                            text={projectName}
                        />
                        <BreadcrumbsItem href="" text="Historial de Reportes" />
                    </Breadcrumbs>
                    <div className="historialReportes">
                        <div className="headHistorialReportes">
                            <div className="titleHistorialReporte text-mainHeaders">
                                Historial de Reportes
                            </div>
                            <Button
                                color="primary"
                                startContent={<PlusIcon />}
                                className="btnCreateReporte"
                                onClick={() => {
                                    setScreenState(1);
                                }}
                            >
                                Nuevo
                            </Button>
                        </div>
                    </div>

                    <div className="mt-5 ">
                        aqui vera los reportes rpeviamente generados (cards)
                    </div>
                </div>
            )}

            {screenState === 1 && (
                <div className="flex-1 flex flex-col">
                    <HeaderWithButtonsSamePage
                        haveReturn={true}
                        haveAddNew={false}
                        handlerReturn={() => {
                            setScreenState(0);
                        }}
                        breadcrump={
                            "Inicio / Proyectos / " +
                            projectName +
                            " / Historial de Reportes"
                        }
                    >
                        Crea un nuevo reporte
                    </HeaderWithButtonsSamePage>

                    <div className="flex flex-row gap-5 flex-1 mt-3">
                        <ReportTypeCard />
                        <ReportTypeCard />
                        <ReportTypeCard />
                        <ReportTypeCard />
                    </div>
                </div>
            )}
        </div>
    );
}
