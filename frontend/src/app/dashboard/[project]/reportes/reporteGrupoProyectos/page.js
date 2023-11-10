"use client";
import CardTareaDisplay from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardTareaDisplay";
import {
    Button,
    Chip,
    CircularProgress,
    Divider,
    Progress,
    Tabs,
    Tab,
    Card,
    CardBody,
    Input,
    Pagination,
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { HerramientasInfo, SmallLoadingScreen } from "../../layout";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
import CardContribuyente from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardContribuyente";
import PieChart from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/PieChart";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import MyDynamicTable from "@/components/DynamicTable";
import { dbDateToDisplayDate } from "@/common/dateFunctions";
import  ReportePresupuesto  from "@/components/dashboardComps/projectComps/reportesComps/reporteGrupoProyectos/ReportePresupuesto";
import ReporteAlcance from "@/components/dashboardComps/projectComps/reportesComps/reporteGrupoProyectos/ReporteAlcance";
import ReporteCronograma from "@/components/dashboardComps/projectComps/reportesComps/reporteGrupoProyectos/ReporteCronograma";
axios.defaults.withCredentials = true;

export default function ReporteGrupoProyectos(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    
    const [isClient, setIsClient] = useState(false);
    const [proyecto1, setProyecto1] = useState([]);
    useEffect(() => {
        setIsLoadingSmall(false);
        setIsClient(true);
    }, [projectId]);

    

   
    // useEffect(() => {
    //     setIsClient(true);
    // }, []);
    return (
        <div className="divHistorialReportes"> 
            <div className="flex-1">
                    <Breadcrumbs>
                        <BreadcrumbsItem href="/" text="Inicio" />
                        <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                        <BreadcrumbsItem
                            href={"/dashboard/" + projectName + "=" + projectId}
                            text={projectName}
                        />
                        <BreadcrumbsItem href="" text="Historial de Reportes" />
                    </Breadcrumbs>
                <div className="reporteGrupoProyectos">
                    <div className="titleHistorialReporte text-mainHeaders">
                        Nombre Proyecto
                    </div>
                    <Tabs aria-label="Options" color="warning">
                        <Tab key="photos" title="Alcance">
                            <ReporteAlcance isClient={isClient}/>
                        </Tab>
                        <Tab key="music" title="Cronograma">
                            <ReporteCronograma isClient={isClient}/>
                        </Tab>
                        <Tab key="presupuesto" title="Presupuesto">
                            <ReportePresupuesto isClient={isClient}/>
                        </Tab>
                    </Tabs>
                </div>
            </div>

        </div>
    );
}