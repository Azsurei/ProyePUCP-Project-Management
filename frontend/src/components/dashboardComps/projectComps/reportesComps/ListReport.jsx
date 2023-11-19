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
import { Cronograma } from "@/../public/icons/Cronograma";
import { Risks } from "@/../public/icons/Risks";
import { AdvanceProject } from "@/../public/icons/AdvanceProject";
import { dbDateToDisplayDate } from "@/common/dateFunctions";

function ReporteCard({ report, onClick }) {
    const colorOptions = {
        Presupuesto: "success",
        EDT: "warning",
        Cronograma: "secondary",
        Riesgos: "danger",
        "Avance general": "primary",
        "Grupos de proyectos": "primary",
        // Agrega más opciones según sea necesario
    };
    return (
        <li
            className="ReportCard bg-mainBackground hover:bg-[#eeeeee] dark:hover:bg-opacity-10"
            onClick={onClick}
        >
            <div className="flex flex-col justify-between">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2">
                        <p className="font-semibold text-lg">{report.nombre}</p>
                        <Chip
                            className="capitalize mt-1 mb-1"
                            size="md"
                            variant="flat"
                            color={colorOptions[report.nombreHerramienta]}
                        >
                            {report.nombreHerramienta}
                        </Chip>
                    </div>
                    <p className="font-medium">
                        {dbDateToDisplayDate(report.fechaCreacion)}
                    </p>
                </div>

                <div className="flex flex-row justify-between flex-1">
                    <div className="flex flex-col justify-center flex-1">
                        <p className="font-medium">Creado por: </p>
                            <div className="flex flex-row items-center gap-1">
                                <Avatar
                                    className="transition-transform w-[2.5rem] min-w-[2.5rem] h-[2.5rem] min-h-[2.5rem] bg-mainUserIcon"
                                    src={report.imgLink}
                                />
                                <p className="">{report.nombresUsuario}</p>
                            </div>
                    </div>
                    {/* <img
                            className="w-160 h-150"
                            src="/icons/budget.svg"
                        /> */}
                    {/* {props.tipo === "Presupuesto" && (
                            <BudgetIcon />
                        )} */}
                    {report.idHerramienta === 2 && <TaskIcon />}
                    {/* {props.tipo === "Cronograma" && (
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
                        )} */}
                </div>
            </div>
        </li>
    );
}

//Aqui es la lista de Proyectos

export default function ListReport({ listReportes, handleViewReport }) {
    //const {sessionData, setSession} = useContext(SessionContext);

    function handleClick(proy_id, proy_name) {
        // router.push("/dashboard/" + proy_name + "=" + proy_id);
    }

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
        },
    ];

    return (
        <ul className="ListReport">
            {listReportes.map((report) => {
                return (
                    <ReporteCard
                        key={report.idReporteXProyecto}
                        report={report}
                        onClick={() => {
                            handleViewReport(report.idReporteXProyecto, report.fileId);
                        }}
                    ></ReporteCard>
                );
            })}
        </ul>
    );
}
