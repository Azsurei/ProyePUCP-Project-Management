"use client";

import { useState, useContext, useEffect } from "react";
import { SmallLoadingScreen } from "../../layout";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    Accordion,
    AccordionItem,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Button,
    Chip,
    Card,
    CardBody,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Divider,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/../public/icons/VerticalDotsIcon";

axios.defaults.withCredentials = true;

const dataSprints = [
    {
        id: 1,
        nombre: "Sin Sprint",
        descripcion: "Descripcion del sprint 3",
        tareas: [
            {
                id: 9,
                sumilla: "Sumilla de tarea 9",
                fechaInicio: "2021-09-18",
                fechaFin: "2021-09-25",
                estado: "No iniciado",
            },
            {
                id: 10,
                sumilla: "Sumilla de tarea 10",
                fechaInicio: "2021-09-18",
                fechaFin: "2021-09-25",
                estado: "No iniciado",
            },
        ],
    },
    {
        id: 2,
        nombre: "Sprint 1",
        descripcion: "Descripcion del sprint 1",
        fechaInicio: "2021-09-04",
        fechaFin: "2021-09-11",
        estado: "No iniciado",
        tareas: [
            {
                id: 1,
                sumilla: "Sumilla de tarea 1",
                fechaInicio: "2021-09-04",
                fechaFin: "2021-09-11",
                estado: "No iniciado",
            },
            {
                id: 2,
                sumilla: "Sumilla de tarea 2",
                fechaInicio: "2021-09-04",
                fechaFin: "2021-09-11",
                estado: "No iniciado",
            },
            {
                id: 3,
                sumilla: "Sumilla de tarea 3",
                fechaInicio: "2021-09-04",
                fechaFin: "2021-09-11",
                estado: "No iniciado",
            },
            {
                id: 4,
                sumilla: "Sumilla de tarea 4",
                fechaInicio: "2021-09-04",
                fechaFin: "2021-09-11",
                estado: "No iniciado",
            },
            {
                id: 5,
                sumilla: "Sumilla de tarea 5",
                fechaInicio: "2021-09-04",
                fechaFin: "2021-09-11",
                estado: "No iniciado",
            },
        ],
    },
    {
        id: 3,
        nombre: "Sprint 2",
        descripcion: "Descripcion del sprint 2",
        fechaInicio: "2021-09-11",
        fechaFin: "2021-09-18",
        estado: "No iniciado",
        tareas: [
            {
                id: 6,
                sumilla: "Sumilla de tarea 6",
                fechaInicio: "2021-09-11",
                fechaFin: "2021-09-18",
                estado: "No iniciado",
            },
            {
                id: 7,
                sumilla: "Sumilla de tarea 7",
                fechaInicio: "2021-09-11",
                fechaFin: "2021-09-18",
                estado: "No iniciado",
            },
            {
                id: 8,
                sumilla: "Sumilla de tarea 8",
                fechaInicio: "2021-09-11",
                fechaFin: "2021-09-18",
                estado: "No iniciado",
            },
        ],
    },
    {
        id: 4,
        nombre: "Sprint 3",
        descripcion: "Descripcion del sprint 2",
        fechaInicio: "2021-09-11",
        fechaFin: "2021-09-18",
        estado: "Completado",
        tareas: [
            {
                id: 11,
                sumilla: "Sumilla de tarea 6",
                fechaInicio: "2021-09-11",
                fechaFin: "2021-09-18",
                estado: "No iniciado",
            },
            {
                id: 12,
                sumilla: "Sumilla de tarea 7",
                fechaInicio: "2021-09-11",
                fechaFin: "2021-09-18",
                estado: "No iniciado",
            },
            {
                id: 13,
                sumilla: "Sumilla de tarea 8",
                fechaInicio: "2021-09-11",
                fechaFin: "2021-09-18",
                estado: "No iniciado",
            },
        ],
    },
];

export default function Kanban(props) {
    // Variables de proyecto global
    const router = useRouter();
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    // Decodificacion de URL
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    // Variables principales
    const [sprints, setSprints] = useState([]);

    // Manejo de carga de datos
    const getSprints = async () => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/Backlog/SprintBacklog/listarSprints/` +
                    projectId
            );
            // setSprints(response.data);
            setSprints(dataSprints);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingSmall(false);
        }
    };

    useEffect(() => {
        getSprints();
    }, []);

    // Componente
    return (
        <div className="flex flex-col py-4 lg:px-8 gap-4">
            <div className="flex flex-row items-center justify-between">
                <h3 className="montserrat text-[#172B4D] text-2xl font-semibold">
                    Sprints actuales
                </h3>
                <Button radius="sm" className="bg-[#172B4D] text-white text-md">
                    Crear Sprint
                </Button>
            </div>
            <Divider className="mb-2" />

            {dataSprints
                .filter(
                    (sprint) =>
                        sprint.estado !== "Completado" &&
                        sprint.nombre !== "Sin Sprint"
                ) // Filter out incomplete sprints
                .map((sprint) => (
                    <Accordion key={sprint.id} variant="shadow">
                        <AccordionItem
                            key={sprint.id}
                            aria-label={sprint.nombre}
                            title={sprint.nombre}
                            subtitle={`${sprint.fechaInicio} - ${sprint.fechaFin}`}
                            className="montserrat font-semibold"
                            startContent={<DropdownSprint />}
                        >
                            <div className="flex flex-col gap-4 px-10 mb-2">
                                {sprint.tareas.map((tarea) => (
                                    <CardTask
                                        key={tarea.id}
                                        sumilla={tarea.sumilla}
                                        fechaInicio={tarea.fechaInicio}
                                        fechaFin={tarea.fechaFin}
                                        estado={tarea.estado}
                                    />
                                ))}
                            </div>
                        </AccordionItem>
                    </Accordion>
                ))}
            {dataSprints
                .filter((sprint) => sprint.nombre === "Sin Sprint") // Filter out incomplete sprints
                .map((sprint) => (
                    <Accordion key={sprint.id} variant="shadow">
                        <AccordionItem
                            key={sprint.id}
                            aria-label={sprint.nombre}
                            title={sprint.nombre}
                            className="montserrat font-semibold p-1"
                        >
                            <div className="flex flex-col gap-4 px-10 mb-2">
                                {sprint.tareas.map((tarea) => (
                                    <CardTask
                                        key={tarea.id}
                                        sumilla={tarea.sumilla}
                                        fechaInicio={tarea.fechaInicio}
                                        fechaFin={tarea.fechaFin}
                                        estado={tarea.estado}
                                    />
                                ))}
                            </div>
                        </AccordionItem>
                    </Accordion>
                ))}

            <div className="flex flex-row items-center justify-between mt-4">
                <h3 className="montserrat text-[#172B4D] text-2xl font-semibold">
                    Sprints completados
                </h3>
            </div>
            <Divider className="mb-2" />

            {dataSprints
                .filter((sprint) => sprint.estado === "Completado") // Filter out completed sprints
                .map((sprint) => (
                    <Accordion key={sprint.id} variant="shadow">
                        <AccordionItem
                            key={sprint.id}
                            aria-label={sprint.nombre}
                            title={sprint.nombre}
                            subtitle={`${sprint.fechaInicio} - ${sprint.fechaFin}`}
                            className="montserrat font-semibold"
                            startContent={<DropdownSprint />}
                        >
                            <div className="flex flex-col gap-4 px-10 mb-2">
                                {sprint.tareas.map((tarea) => (
                                    <CardTask
                                        key={tarea.id}
                                        sumilla={tarea.sumilla}
                                        fechaInicio={tarea.fechaInicio}
                                        fechaFin={tarea.fechaFin}
                                        estado={tarea.estado}
                                    />
                                ))}
                            </div>
                        </AccordionItem>
                    </Accordion>
                ))}
        </div>
    );
}

function CardTask(props) {
    const { sumilla, fechaInicio, fechaFin, estado } = props;

    return (
        <div className="flex flex-row items-center justify-center gap-4 p-2 px-4 bg-[#F5F5F5] rounded-md">
            <p className="flex-1 grow-[3]">{sumilla}</p>
            <p className="flex-1 grow-[2]">{`Desde: ${fechaInicio} - Hasta: ${fechaFin}`}</p>
            <Chip
                className="capitalize roboto"
                color="default"
                size="sm"
                variant="flat"
            >
                {estado}
            </Chip>
        </div>
    );
}
function DropdownSprint(props) {
    return (
        <div className="relative flex justify-end items-center gap-2">
            <Dropdown
                placement="bottom-start"
                className="bg-background border-1 border-default-200"
            >
                <DropdownTrigger>
                    <Button
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="light"
                        className="flex items-center justify-center"
                    >
                        <VerticalDotsIcon className="text-default-400" />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu disabledKeys={["start", "complete"]}>
                    <DropdownSection title="Opciones" showDivider>
                        <DropdownItem key={"edit"}>Editar Sprint</DropdownItem>
                        <DropdownItem key={"delete"} color="danger">
                            Eliminar Sprint
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection title="Sprints">
                        <DropdownItem key={"start"} color="primary">
                            Iniciar Sprint
                        </DropdownItem>
                        <DropdownItem key={"complete"} color="success">
                            Completar Sprint
                        </DropdownItem>
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}
