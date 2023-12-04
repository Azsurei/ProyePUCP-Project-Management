"use client";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reporteTareasStyles/ListTareasReporte.css";
import {
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "public/icons/VerticalDotsIcon";
import { Collapse } from "react-collapse";
import { useContext, useState } from "react";
import GroupUserIconsReporte from "./GroupUserIconsReporte";
import { dbDateToDisplayDate } from "@/common/dateFunctions";
import { TaskSelector } from "@/app/dashboard/[project]/reportes/reporteTareas/[reportId]/page";

function CardTarea({ tarea, leftMargin }) {
    const { selectedTask, handleSetSelectedTask } = useContext(TaskSelector);

    const tieneHijos = true;

    const formattedStartDate = new Date(tarea.fechaInicio);
    const formattedEndDate = new Date(tarea.fechaFin);
    const duracion =
        formattedStartDate.toLocaleDateString() +
        " - " +
        formattedEndDate.toLocaleDateString();

    const [hijosIsOpen, setHijosIsOpen] = useState(false);

    const toggleOpen = () => {
        setHijosIsOpen(!hijosIsOpen);
    };

    return (
        <div className="containerCardYHijo">
            <div
                className={
                    "tareaCard " +
                    (selectedTask?.idTarea === tarea.idTarea
                        ? " bg-slate-200 dark:bg-slate-700"
                        : "bg-white dark:bg-mainBackground")
                }
                onClick={() => {
                    handleSetSelectedTask(tarea);
                }}
            >
                <div className="containerGeneralData">
                    <div className="containerNombreTarea">
                        {tarea.tareasHijas.length !== 0 && (
                            <div
                                className="containerChevron"
                                onClick={toggleOpen}
                            >
                                <img src="/icons/chevron-down.svg" />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <p>{tarea.sumillaTarea}</p>
                            {tarea.tareasPosteriores.length !== 0 && (
                                <p className="text-bold text-sm capitalize text-default-400">
                                    {tarea.tareasPosteriores.length +
                                        (tarea.tareasPosteriores.length > 1
                                            ? " tareas posteriores"
                                            : " tarea posterior")}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="containerSelectedUsers">
                        {tarea.idEquipo !== null ? (
                            <div className="tareaContainerSubteam">
                                <img src="/icons/sideBarDropDown_icons/sbdd14.svg"></img>
                                <p>{tarea.equipo.nombre}</p>
                            </div>
                        ) : (
                            <GroupUserIconsReporte
                                idTarea={tarea.idTarea}
                                listUsers={tarea.usuarios}
                            ></GroupUserIconsReporte>
                        )}
                    </div>

                    <div className="containerTareaState gap-2">
                        {/* <p className="bg-primary-200" id="labelTareaState">
                        {tarea.nombreTareaEstado}
                    </p> */}

                        <Chip
                            className="capitalize"
                            color={tarea.colorTareaEstado}
                            size="sm"
                            variant="flat"
                        >
                            {tarea.nombreTareaEstado}
                        </Chip>

                        <p>{tarea.porcentajeProgreso}%</p>
                    </div>
                    <div className="containerTareaDuracion ">
                        <p>
                            {dbDateToDisplayDate(tarea.fechaInicio) === ""
                                ? "Dependiente"
                                : dbDateToDisplayDate(tarea.fechaInicio)}
                        </p>
                        <p>{dbDateToDisplayDate(tarea.fechaFin)}</p>
                    </div>
                </div>
            </div>

            <Collapse isOpened={hijosIsOpen}>
                {tarea.tareasHijas.length !== 0 && (
                    <ListTareasReporte
                        listTareas={tarea.tareasHijas}
                        leftMargin={"40px"}
                    ></ListTareasReporte>
                )}
            </Collapse>
        </div>
    );
}

export default function ListTareasReporte({ listTareas, leftMargin }) {
    return (
        <div className="tareasListContainer" style={{ marginLeft: leftMargin }}>
            {listTareas.map((tarea) => {
                return (
                    <CardTarea
                        key={tarea.idTarea}
                        tarea={tarea}
                        leftMargin={leftMargin}
                    ></CardTarea>
                );
            })}
        </div>
    );
}
