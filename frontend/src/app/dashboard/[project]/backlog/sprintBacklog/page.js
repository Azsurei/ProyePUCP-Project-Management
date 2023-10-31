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
    Card,
    CardBody,
} from "@nextui-org/react";
import { VerticalDotsIcon } from "@/../public/icons/VerticalDotsIcon";

axios.defaults.withCredentials = true;

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
        <div className="flex flex-col py-4">
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
                    <div className="flex flex-col gap-4 px-2 mb-2">
                        <Card shadow="none" className="bg-[#EEEEEE]">
                            <CardBody>
                                <div>Historia 1</div>
                            </CardBody>
                        </Card>
                        <Card shadow="none" className="bg-[#EEEEEE]">
                            <CardBody>
                                <div>Historia 3</div>
                            </CardBody>
                        </Card>
                        <Card shadow="none" className="bg-[#EEEEEE]">
                            <CardBody>
                                <div>Historia 5</div>
                            </CardBody>
                        </Card>
                        <Card shadow="none" className="bg-[#EEEEEE]">
                            <CardBody>
                                <div>Historia 8</div>
                            </CardBody>
                        </Card>
                        <Card shadow="none" className="bg-[#EEEEEE]">
                            <CardBody>
                                <div>Historia 10</div>
                            </CardBody>
                        </Card>
                    </div>
                </AccordionItem>
                <AccordionItem
                    key="2"
                    aria-label="Sprint 2"
                    title="Sprint 2"
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
                    <div className="flex flex-col gap-4 px-2 mb-2">
                        <Card shadow="none" className="bg-[#EEEEEE]">
                            <CardBody>
                                <div>Historia 2</div>
                            </CardBody>
                        </Card>
                        <Card shadow="none" className="bg-[#EEEEEE]">
                            <CardBody>
                                <div>Historia 6</div>
                            </CardBody>
                        </Card>
                        <Card shadow="none" className="bg-[#EEEEEE]">
                            <CardBody>
                                <div>Historia 9</div>
                            </CardBody>
                        </Card>
                    </div>
                </AccordionItem>
                <AccordionItem
                    key="3"
                    aria-label="Backlog"
                    title="Backlog"
                    className="montserrat font-semibold mb-4"
                >
                    <div className="flex flex-col gap-4 px-2 mb-2">
                        <Card shadow="none" className="bg-[#EEEEEE]">
                            <CardBody>
                                <div>Historia 4</div>
                            </CardBody>
                        </Card>
                        <Card shadow="none" className="bg-[#EEEEEE]">
                            <CardBody>
                                <div>Historia 7</div>
                            </CardBody>
                        </Card>
                    </div>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
