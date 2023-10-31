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

const statusList = [
    {
        id: 1,
        itemKey: "1",
        texto: "No iniciado",
        color: "default",
    },
    {
        id: 2,
        itemKey: "2",
        texto: "En progreso",
        color: "primary",
    },
    {
        id: 3,
        itemKey: "3",
        texto: "Atrasado",
        color: "danger",
    },
    {
        id: 4,
        itemKey: "4",
        texto: "Finalizado",
        color: "success",
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
    const [sprints, setSprints] = useState([]); // ID, nombre, descripcion, fecha inicio, fecha fin, estado
    const [tasks, setTasks] = useState([]); // User stories

    // Manejo de carga de datos
    const getSprints = async () => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/autoEvaluacion/listarSprints/` +
                    projectId
            );
            setSprints(data);
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
                    Crear sprint
                </Button>
            </div>
            <Divider className="mb-2" />
            <Accordion variant="splitted" className="px-0">
                <AccordionItem
                    key="1"
                    aria-label="Sprint 2"
                    title="Sprint 2"
                    subtitle="04/09/2023 - 11/09/2023"
                    className="montserrat font-semibold mb-4"
                    startContent={
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
                                    >
                                        <VerticalDotsIcon className="text-default-400" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disabledKeys={["start", "complete"]}
                                >
                                    <DropdownSection
                                        title="Opciones"
                                        showDivider
                                    >
                                        <DropdownItem key={"edit"}>
                                            Editar Sprint
                                        </DropdownItem>
                                        <DropdownItem
                                            key={"delete"}
                                            color="danger"
                                        >
                                            Eliminar Sprint
                                        </DropdownItem>
                                    </DropdownSection>
                                    <DropdownSection title="Sprints">
                                        <DropdownItem
                                            key={"start"}
                                            color="primary"
                                        >
                                            Iniciar Sprint
                                        </DropdownItem>
                                        <DropdownItem
                                            key={"complete"}
                                            color="success"
                                        >
                                            Completar Sprint
                                        </DropdownItem>
                                    </DropdownSection>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    }
                >
                    <div className="flex flex-col gap-4 px-10 mb-2">
                        <CardTask />
                        <CardTask />
                        <CardTask />
                        <CardTask />
                        <CardTask />
                    </div>
                </AccordionItem>
                <AccordionItem
                    key="2"
                    aria-label="Sprint 3"
                    title="Sprint 3"
                    subtitle="11/09/2023 - 18/09/2023"
                    className="montserrat font-semibold mb-4"
                    startContent={
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
                                    >
                                        <VerticalDotsIcon className="text-default-400" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu disabledKeys={["complete"]}>
                                    <DropdownSection
                                        title="Opciones"
                                        showDivider
                                    >
                                        <DropdownItem key={"edit"}>
                                            Editar Sprint
                                        </DropdownItem>
                                        <DropdownItem
                                            key={"delete"}
                                            color="danger"
                                        >
                                            Eliminar Sprint
                                        </DropdownItem>
                                    </DropdownSection>
                                    <DropdownSection title="Sprints">
                                        <DropdownItem
                                            key={"start"}
                                            color="primary"
                                        >
                                            Iniciar Sprint
                                        </DropdownItem>
                                        <DropdownItem
                                            key={"complete"}
                                            color="success"
                                        >
                                            Completar Sprint
                                        </DropdownItem>
                                    </DropdownSection>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    }
                >
                    <div className="flex flex-col gap-4 px-10 mb-2">
                        <CardTask />
                        <CardTask />
                        <CardTask />
                    </div>
                </AccordionItem>
                <AccordionItem
                    key="3"
                    aria-label="SprintVoid"
                    title="Sin Sprint"
                    className="montserrat font-semibold mb-4"
                >
                    <div className="flex flex-col gap-4 px-10 mb-2">
                        <CardTask />
                        <CardTask />
                    </div>
                </AccordionItem>
            </Accordion>
            <div className="flex flex-row items-center justify-between">
                <h3 className="montserrat text-[#172B4D] text-2xl font-semibold">
                    Sprints completados
                </h3>
            </div>
            <Divider className="mb-2" />
            <Accordion variant="splitted" className="px-0">
                <AccordionItem
                    key="1"
                    aria-label="Sprint 1"
                    title="Sprint 1"
                    subtitle="04/09/2023 - 11/09/2023"
                    className="montserrat font-semibold mb-4"
                    startContent={
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
                                    >
                                        <VerticalDotsIcon className="text-default-400" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disabledKeys={["start", "complete"]}
                                >
                                    <DropdownSection
                                        title="Opciones"
                                        showDivider
                                    >
                                        <DropdownItem key={"edit"}>
                                            Editar Sprint
                                        </DropdownItem>
                                        <DropdownItem
                                            key={"delete"}
                                            color="danger"
                                        >
                                            Eliminar Sprint
                                        </DropdownItem>
                                    </DropdownSection>
                                    <DropdownSection title="Sprints">
                                        <DropdownItem
                                            key={"start"}
                                            color="primary"
                                        >
                                            Iniciar Sprint
                                        </DropdownItem>
                                        <DropdownItem
                                            key={"complete"}
                                            color="success"
                                        >
                                            Completar Sprint
                                        </DropdownItem>
                                    </DropdownSection>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    }
                >
                    <div className="flex flex-col gap-4 px-10 mb-2">
                        <CardTask />
                        <CardTask />
                        <CardTask />
                        <CardTask />
                        <CardTask />
                    </div>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

function CardTask(props) {
    return (
        <div className="flex flex-row items-center justify-center gap-4 p-2 px-4 bg-[#F5F5F5] rounded-md">
            <p className="flex-1 grow-[3]">Titulo de tarea</p>
            <p className="flex-1 grow-[2]"># horas</p>
            <Chip
                className="capitalize roboto"
                color="default"
                size="sm"
                variant="flat"
            >
                No iniciado
            </Chip>
        </div>
    );
}