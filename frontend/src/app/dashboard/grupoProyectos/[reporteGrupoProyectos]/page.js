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
import { is } from "date-fns/locale";
axios.defaults.withCredentials = true;

export default function ReporteGrupoProyectos(props) {
    const [isClient, setIsClient] = useState(false);
    const [proyectos, setProyectos] = useState([]);
    const [proyectosPresupuesto, setProyectosPresupuesto] = useState([]);
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
        console.log("Grupo proyecto: ", selectedGrupoProyecto)
    }, [selectedGrupoProyecto]);
    const calcularTotales = (proyectos) => {
        return proyectos.map((proyecto) => {
          const totalIngresos = proyecto.ingresos.reduce((total, ingreso) => total + ingreso.monto, 0);
          const totalEgresos = proyecto.egresos.reduce((total, egreso) => total + egreso.costoReal, 0);
          const disponible = totalIngresos - totalEgresos;
    
          return {
            ...proyecto,
            totalIngresos,
            totalEgresos,
            disponible
          };
        });
      };
    
    useEffect(() => {
        setIsClient(false);
        // setIsLoadingSmall(true);
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/grupoProyectos/listarDatosProyectosXGrupo/${selectedGrupoProyecto}`);
              console.log("Id Grupo: ", selectedGrupoProyecto);
              const data = response.data.proyectos;
              console.log(`Estos son los proyectos:`, data);
              setProyectos(data);
              setIsClient(true);
            //   setIsLoadingSmall(false);
            } catch (error) {
              console.error('Error al obtener los proyectos 1:', error);
            }
          };
            fetchData();
    }, [isId]);
    const DataProyectos = async () => {
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/grupoProyectos/listarProyectosXGrupo/${selectedGrupoProyecto}`);
              console.log("Id Grupo: ", selectedGrupoProyecto);
              const data = response.data.proyectos;
             
              // setProyectos(response.data.proyectos);
              const proyectosConTotales = calcularTotales(data);
              console.log("Paso1: ");
              setProyectosPresupuesto(proyectosConTotales);
              console.log(`Estos son los proyectos Presupuesto:`, data);
              setIsClient(true);
            } catch (error) {
              console.error('Error al obtener los proyectos 2:', error);
            }
          };
            fetchData();
    };
    useEffect(() => {
        console.log("Grupo proyecto: ", props.groupProject);
        setIsClient(false);
        // DataTable(idPresupuestoPrimerDato);
        DataProyectos();
        console.log("Proyectos Final", proyectos);
        
      }, [ isId]);
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
                        <BreadcrumbsItem href="/dashboard/grupoProyectos" text="Grupo de Proyectos" />
                    </Breadcrumbs>
                {isId && (<div className="reporteGrupoProyectos h-screen">
                    <div className="titleHistorialReporte text-mainHeaders">
                        Reporte de Grupo de Proyectos
                    </div>
                    <Tabs aria-label="Options" color="warning">
                        <Tab key="photos" title="Alcance">
                            <ReporteAlcance isClient={isClient} groupProject={selectedGrupoProyecto} proyectos={proyectos}/>
                        </Tab>
                        <Tab key="music" title="Cronograma">
                            <ReporteCronograma isClient={isClient} groupProject={selectedGrupoProyecto} proyectos={proyectos}/>
                        </Tab>
                        <Tab key="presupuesto" title="Presupuesto">
                            <ReportePresupuesto isClient={isClient} groupProject={selectedGrupoProyecto} proyectos={proyectosPresupuesto}/>
                        </Tab>
                    </Tabs>
                </div>
                )}
            </div>
        
        </div>
        
        </>
    );
}