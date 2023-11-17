"use client";
import {
    Button,
    Tabs,
    Tab,
} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
import CardContribuyente from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardContribuyente";
import PieChart from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/PieChart";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import MyDynamicTable from "@/components/DynamicTable";
import { dbDateToDisplayDate } from "@/common/dateFunctions";
import  ReportePresupuesto  from "@/components/dashboardComps/projectComps/reportesComps/reporteGrupoProyectos/ReportePresupuesto";
import ReporteAlcance from "@/components/dashboardComps/projectComps/reportesComps/reporteGrupoProyectos/ReporteAlcance";
import ReporteCronograma from "@/components/dashboardComps/projectComps/reportesComps/reporteGrupoProyectos/ReporteCronograma";
import MyCombobox from "@/components/ComboBox";
import { useRouter } from "next/navigation";
import { setId } from "@material-tailwind/react/components/Tabs/TabsContext";
import { SessionContext } from "@/app/dashboard/layout";
axios.defaults.withCredentials = true;

export default function ReporteGrupoProyectos(props) {
    const [isClient, setIsClient] = useState(false);
    const [proyecto1, setProyecto1] = useState([]);
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
    // const [selectedGrupoProyecto, setSelectedGrupoProyecto,] = useState("");
    const [selectedGrupoProyectoId, setSelectedGrupoProyectoId,] = useState("");
    const selectedGrupoProyecto = props.params.reporteGrupoProyectos;
    const pruebaURl = "http://localhost:8080/api/proyecto/grupoProyectos/listarGruposProyecto"
    const [isId, setIsId] = useState(false);
    useEffect(() => {
        if(selectedGrupoProyecto !== undefined){
            setIsId(true);
        }
        setIsClient(true);
    }, [selectedGrupoProyecto]);

    

   
    // useEffect(() => {
    //     setIsClient(true);
    // }, []);
    return (
        <>
        <div className="divHistorialReportes"> 
            <div className="flex-1">
                    <Breadcrumbs>
                        <BreadcrumbsItem href="/" text="Inicio" />
                        <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    </Breadcrumbs>
                {isId && (<div className="reporteGrupoProyectos h-screen">
                    <div className="titleHistorialReporte text-mainHeaders">
                        Nombre Proyecto
                    </div>
                    <Tabs aria-label="Options" color="warning">
                        <Tab key="photos" title="Alcance">
                            <ReporteAlcance isClient={isClient} groupProject={selectedGrupoProyecto}/>
                        </Tab>
                        <Tab key="music" title="Cronograma">
                            <ReporteCronograma isClient={isClient} groupProject={selectedGrupoProyecto}/>
                        </Tab>
                        <Tab key="presupuesto" title="Presupuesto">
                            <ReportePresupuesto isClient={isClient} groupProject={selectedGrupoProyecto}/>
                        </Tab>
                    </Tabs>
                </div>
                )}
            </div>
        
        </div>
        
        </>
    );
}