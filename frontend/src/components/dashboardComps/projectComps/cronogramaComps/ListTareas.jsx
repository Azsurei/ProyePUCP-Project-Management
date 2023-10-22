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

function CardTarea({ tarea, leftMargin }) {
    const tieneHijos = true;

    const formattedStartDate = new Date(tarea.fechaInicio);
    const formattedEndDate = new Date(tarea.fechaFin);
    const duracion =
        formattedStartDate.toLocaleDateString() +
        " - " +
        formattedEndDate.toLocaleDateString();
    return (
        <div className="containerCardYHijo">
            <div className="tareaCard">
                {tieneHijos && (
                    <div className="containerChevron">
                        <img src="/icons/chevron-down.svg" />
                    </div>
                )}

                <div className="containerGeneralData">
                    <div className="containerNombreTarea">
                        <p>{tarea.sumillaTarea}</p>
                        {tarea.cantPosteriores !== 0 && (
                            <p className="text-bold text-sm capitalize text-default-400">
                                3 tareas posteriores
                            </p>
                        )}
                    </div>

                    <div className="containerSelectedUsers">
                        <GroupUserIcons></GroupUserIcons>
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

                <div className="relative flex justify-end items-center gap-2">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                size="md"
                                radius="sm"
                                variant="flat"
                                color="default"
                            >
                                Ver opciones
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem>Ver detalle</DropdownItem>
                            <DropdownItem>Editar</DropdownItem>
                            <DropdownItem>Eliminar</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
            {tarea.tareasHijas !== null && (
                <ListTareas
                    listTareas={tarea.tareasHijas}
                    leftMargin={"20px"}
                ></ListTareas>
            )}
        </div>
    );
}

export default function ListTareas({ listTareas, leftMargin }) {
    return (
        <div className="tareasListContainer" style={{marginLeft: leftMargin}}>
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
