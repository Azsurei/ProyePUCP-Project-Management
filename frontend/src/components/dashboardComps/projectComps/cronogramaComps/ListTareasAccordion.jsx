import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/ListTareas.css";
import GroupUserIcons from "./GroupUserIcons";
import {
    Accordion,
    AccordionItem,
    Button,
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "public/icons/VerticalDotsIcon";

function CardTareaAccordion({ tarea, leftMargin }) {
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
            {/* {tarea.tareasHijas !== null && (
                <ListTareasAccordion
                    listTareas={tarea.tareasHijas}
                    leftMargin={"20px"}
                ></ListTareasAccordion>
            )} */}
        </div>
    );
}

function CadaAcordion({tareasHijas}) {
    return (
        <Accordion>
            <AccordionItem></AccordionItem>
        </Accordion>
    );
}

export default function ListTareasAccordion({ listTareas, leftMargin }) {
    return (
        <Accordion className="ml-10">
            {listTareas.map((tarea) => {
                return (
                    <AccordionItem
                        title={
                            <CardTareaAccordion
                                key={tarea.idTarea}
                                tarea={tarea}
                                leftMargin={leftMargin}
                            ></CardTareaAccordion>
                        }
                    >
                        {tarea.tareasHijas !== null && (
                            <ListTareasAccordion listTareas={tarea.tareasHijas} leftMargin={"20px"}></ListTareasAccordion>
                        )}
                    </AccordionItem>
                );
            })}
        </Accordion>
    );
}
