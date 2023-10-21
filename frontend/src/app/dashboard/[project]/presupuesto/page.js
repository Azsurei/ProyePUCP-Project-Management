"use client"
import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";

import "@/styles/dashboardStyles/projectStyles/presupuesto/presupuesto.css";
import TableBudget from "@/components/tableBudget";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

axios.defaults.withCredentials = true;
import {
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
  } from "@nextui-org/react";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { SmallLoadingScreen } from "../layout";
import {ExportIcon} from "@/../public/icons/ExportIcon";



export default function Presupuesto(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    
    console.log(projectId);
    console.log(projectName);
    //const router=userRouter();

    useEffect(() => {
        const stringURL =
            "http://localhost:8080/api/proyecto/cronograma/listarPresupuesto";

        axios
            .post(stringURL, { idProyecto: projectId })
            .then(function (response) {
                const cronogramaData = response.data.cronograma;
                console.log(cronogramaData);
                setCronogramaId(cronogramaData.idCronograma);
                if (
                    cronogramaData.fechaInicio === null ||
                    cronogramaData.fechaFin === null
                ) {
                    //setModalFirstTime(true);
                    onOpen();
                } else {
                    const tareasURL =
                        "http://localhost:8080/api/proyecto/cronograma/listarTareasXidProyecto/" +
                        projectId;
                    axios
                        .get(tareasURL)
                        .then(function (response) {
                            setListTareas(response.data.tareas);
                            console.log(response.data.tareas);
                            setIsLoadingSmall(false);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }

                //setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);







    const [filterValue, setFilterValue] = React.useState("");

    useEffect(()=>{setIsLoadingSmall(false)},[])
    return (
        //Presupuesto/Ingreso
        <div className="mainDivPresupuesto">

                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId}  text={projectName}/>
                    <BreadcrumbsItem href="" text="Presupuesto" />

                </Breadcrumbs>

                <div className="presupuesto">
                    <div className="titlePresupuesto">Presupuesto</div>

                    <div className="buttonsPresu">
                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}>
                                <button className="btnCommon btnFlujo btnDisabled btnSelected sm:w-1 sm:h-1" type="button" disabled>Flujo</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Historial"}>
                                <button className="btnCommon btnHistorial sm:w-1 sm:h-1" type="button">Historial</button> 
                        </Link>
                        
                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Ingreso"}>
                                <button className="btnCommon btnIngreso sm:w-1 sm:h-1" type="button">Ingresos</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Egresos"}>
                                <button className="btnCommon btnEgreso sm:w-1 sm:h-1" type="button">Egresos</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Estimacion"}>
                                <button className="btnCommon btnEstimacion sm:w-1 sm:h-1" type="button">Estimacion</button>
                        </Link>

                        <Button color="primary" startContent={<ExportIcon />} className="btnExportPresupuesto">
                            Exportar
                        </Button>
                    </div>

                    <div className="subtitlePresupuesto">Flujo de Caja Enero - Junio</div>
                    


                    <TableBudget> </TableBudget>


                
                </div>
        </div>
    );
}



