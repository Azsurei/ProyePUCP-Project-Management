"use client";
import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/ListTareas.css";
import GroupUserIcons from "./GroupUserIcons";
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
import { useState } from "react";

function CardTarea({
    tarea,
    leftMargin,
    handleVerDetalle,
    handleEdit,
    handleAddNewSon,
    handleDelete,
}) {
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
            <div className="tareaCard">
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
                            <GroupUserIcons
                                idTarea={tarea.idTarea}
                                listUsers={tarea.usuarios}
                                beImg={tarea.idTarea === 51}
                            ></GroupUserIcons>
                        )}
                    </div>

                    <div className="containerTareaState">
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
                    </div>
                    <div className="containerTareaDuracion">
                        <p>{duracion}</p>
                    </div>
                </div>

                <div className="contaienrMas Opciones relative flex justify-end items-center gap-2">
                    <Dropdown aria-label="droMenTareasMain">
                        <DropdownTrigger aria-label="droMenTareasTrigger">
                            
                                <Button
                                
                                    size="md"
                                    radius="sm"
                                    variant="flat"
                                    color="default"
                                    className="ButtonMore"
                                >
                                    <p className="lblVerOpciones">Ver opciones</p>
                                    <VerticalDotsIcon className="icnVerOpciones text-black-300" />
                                </Button>
                            
                        </DropdownTrigger>
                        <DropdownMenu aria-label="droMenTareas">
                            <DropdownItem
                                aria-label="addSon"
                                onClick={() => {
                                    handleAddNewSon(tarea);
                                }}
                            >
                                Agregar hijo
                            </DropdownItem>
                            <DropdownItem
                                aria-label="seeDetail"
                                onClick={() => {
                                    handleVerDetalle(tarea);
                                }}
                            >
                                Ver detalle
                            </DropdownItem>
                            <DropdownItem
                                aria-label="edit"
                                onClick={() => {
                                    handleEdit(tarea);
                                }}
                            >
                                Editar
                            </DropdownItem>
                            <DropdownItem
                                aria-label="delete"
                                className="text-danger"
                                color="danger"
                                onClick={() => {
                                    handleDelete(tarea);
                                }}
                            >
                                Eliminar
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            <Collapse isOpened={hijosIsOpen}>
                {tarea.tareasHijas.length !== 0 && (
                    <ListTareas
                        listTareas={tarea.tareasHijas}
                        leftMargin={"40px"}
                        handleVerDetalle={handleVerDetalle}
                        handleEdit={handleEdit}
                        handleAddNewSon={handleAddNewSon}
                        handleDelete={handleDelete}
                    ></ListTareas>
                )}
            </Collapse>
        </div>
    );
}

export default function ListTareas({
    listTareas,
    leftMargin,
    handleVerDetalle,
    handleEdit,
    handleAddNewSon,
    handleDelete,
}) {
    return (
        <div className="tareasListContainer" style={{ marginLeft: leftMargin }}>
            {listTareas.map((tarea) => {
                return (
                    <CardTarea
                        key={tarea.idTarea}
                        tarea={tarea}
                        leftMargin={leftMargin}
                        handleVerDetalle={handleVerDetalle}
                        handleEdit={handleEdit}
                        handleAddNewSon={handleAddNewSon}
                        handleDelete={handleDelete}
                    ></CardTarea>
                );
            })}
        </div>
    );
}
