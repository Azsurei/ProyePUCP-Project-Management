"use client"
import React from "react";
import { SmallLoadingScreen } from "../layout";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { useContext } from "react";
import { Button } from "@nextui-org/react";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
export default function Reportes(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    return (
        <div className="divHistorialReportes">
             <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId}  text={projectName}/>
                    <BreadcrumbsItem href="" text="Historial de Reportes" />
            </Breadcrumbs>
            <div className="historialReportes">
                <div className="headHistorialReportes">
                    <div className="titleHistorialReporte">Historial de Reportes</div>
                    <Button color="primary" startContent={<PlusIcon />} className="btnCreateReporte">
                            Nuevo
                    </Button>
                       
                </div>
                
            </div>
        </div>
    );
}