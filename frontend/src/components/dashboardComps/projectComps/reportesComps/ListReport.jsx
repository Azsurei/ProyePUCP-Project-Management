"use client";

import "@/styles/dashboardStyles/projectStyles/reportesStyles/ListReport.css";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SessionContext } from "@/app/dashboard/layout";
import { Avatar, Chip } from "@nextui-org/react";
axios.defaults.withCredentials = true;
import { BudgetIcon } from "@/../public/icons/BudgetIcon";
import { TaskIcon } from "@/../public/icons/TaskIcon";
import { GroupProject } from "@/../public/icons/GroupProject";
import {Cronograma} from "@/../public/icons/Cronograma";
import {Risks} from "@/../public/icons/Risks";
import {AdvanceProject} from "@/../public/icons/AdvanceProject";
function ReporteCard(props) {
    const creationDate = new Date(props.fecha);

    // Formatea las fechas
    const formattedStartDate = creationDate.toLocaleDateString();

    const colorOptions = {
        "Presupuesto": "success",
        "Entregables": "warning",
        "Cronograma": "secondary",
        "Riesgos": "danger",
        "Avance general": "primary",
        "Grupos de proyectos": "primary",
        // Agrega más opciones según sea necesario
    };
    return (
        <li className="ReportCard bg-mainBackground hover:bg-[#eeeeee] dark:hover:bg-opacity-10" onClick={props.onClick}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="cardTitleReport mt-1 mb-1">{props.name}</p>
                    <div className="cardMembersReport flex items-center gap-4 mt-1 mb-1"> 
                        <Avatar 
                            className="transition-transform w-[2.5rem] min-w-[2.5rem] h-[2.5rem] min-h-[2.5rem] bg-mainUserIcon"
                            src = "https://i.pravatar.cc/150?u=a042581f4e29026024d"
                        />
                        <p className="capitalize">
                            {props.usuario}
                        </p>
                    </div>
                    <Chip
                        className="capitalize mt-1 mb-1"
                        size="md"
                        variant="flat"
                        color = {colorOptions[props.tipo]}
                    >
                    {props.tipo}
                    </Chip>
                    <p className="cardDatesReport">
                        {formattedStartDate}
                    </p>
                </div>
                <div className="text-center flex items-center">
                    {/* <img
                        className="w-160 h-150"
                        src="/icons/budget.svg"
                    /> */}
                    {props.tipo === "Presupuesto" && (
                        <BudgetIcon />
                    )}
                    {props.tipo === "Entregables" && (
                        <TaskIcon />
                    )}
                    {props.tipo === "Cronograma" && (
                        <Cronograma />
                    )}
                    {props.tipo === "Riesgos" && (
                        <Risks />
                    )}
                    {props.tipo === "Avance general" && (
                        <AdvanceProject />
                    )}
                    {props.tipo === "Grupos de proyectos" && (
                        <GroupProject />
                    )}
                    
                </div>
            </div>
            
        </li>
    );
}

//Aqui es la lista de Proyectos

export default function ListReport(props) {
    //const {sessionData, setSession} = useContext(SessionContext);

    const router = useRouter();
    const { filterValue, onSearchChange } = props;
    function handleClick(proy_id, proy_name) {
        // router.push("/dashboard/" + proy_name + "=" + proy_id);
    }

    const [isLoading, setIsLoading] = useState(true); //loading screen seteada por defecto
    // const [ListReportes, setListReportes] = useState([]);

    // useEffect(() => {
    //     let proyectsArray;
    //     const stringURL =
    //         process.env.NEXT_PUBLIC_BACKEND_URL +
    //         "/api/proyecto/listarProyectos";

    //     axios
    //         .get(stringURL)
    //         .then(function (response) {
    //             console.log(response);
    //             proyectsArray = response.data.proyectos;

    //             proyectsArray = proyectsArray.map((proyect) => {
    //                 return {
    //                     id: proyect.idProyecto,
    //                     name: proyect.nombre,
    //                     dateStart: proyect.fechaInicio,
    //                     dateEnd: proyect.fechaFin,
    //                     members: proyect.miembros,
    //                     roleId: proyect.idRol,
    //                     roleName: proyect.nombrerol,
    //                 };
    //             });

    //             setListComps(proyectsArray);
    //             console.log(proyectsArray);
    //             setIsLoading(false);
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }, []);
    const ListReportes = [
        {
            id: 1,
            name: "Reporte 1",
            usuario: "Juan Perez",
            tipo: "Presupuesto",
            fecha: "2021-10-10",
        },
        {
            id: 2,
            name: "Reporte 2",
            usuario: "Juan Perez",
            tipo: "Entregables",
            fecha: "2021-10-10",
        },
        {
            id: 3,
            name: "Reporte 3",
            usuario: "Juan Perez",
            tipo: "Cronograma",
            fecha: "2021-10-10",
        },
        {
            id: 4,
            name: "Reporte 4",
            usuario: "Juan Perez",
            tipo: "Riesgos",
            fecha: "2021-10-10",
        },
        {
            id: 5,
            name: "Reporte 5",
            usuario: "Juan Perez",
            tipo: "Avance general",
            fecha: "2021-10-10",
        },
        {
            id: 6,
            name: "Reporte 6",
            usuario: "Juan Perez",
            tipo: "Grupos de proyectos",
            fecha: "2021-10-10",
        }
        
    ];
    // const filteredProjects = ListReportes.filter((component) => {
    //     const projectName = component.name.toLowerCase();
    //     return projectName.includes(filterValue.toLowerCase());
    // });
    return (
        <ul className="ListReport">
            {ListReportes.map((component) => {
                return (
                    <ReporteCard
                        key={component.id}
                        name={component.name}
                        usuario={component.usuario}
                        tipo={component.tipo}
                        fecha={component.fecha}
                        onClick={() => {
                            // const updSessionData = {...sessionData};
                            // updSessionData.rolInProject = component.roleId;
                            // setSession(updSessionData);
                            handleClick(component.id, component.name);
                        }}
                    ></ReporteCard>
                );
            })}
        </ul>
    );
}
