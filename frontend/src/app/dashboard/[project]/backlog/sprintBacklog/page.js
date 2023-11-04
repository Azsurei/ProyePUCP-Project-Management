"use client";

import { useMemo, useState, useContext, useEffect } from "react";
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
import { toast, Toaster } from "sonner";

import {
    Input,
    Textarea,
    Accordion,
    AccordionItem,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Button,
    Chip,
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
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
                idSprint: 1,
                sumilla: "Sumilla de tarea 9",
                fechaInicio: "2021-09-18",
                fechaFin: "2021-09-25",
                estado: "No iniciado",
            },
            {
                id: 10,
                idSprint: 1,
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
                idSprint: 2,
                sumilla: "Sumilla de tarea 1",
                fechaInicio: "2021-09-04",
                fechaFin: "2021-09-11",
                estado: "No iniciado",
            },
            {
                id: 2,
                idSprint: 2,
                sumilla: "Sumilla de tarea 2",
                fechaInicio: "2021-09-04",
                fechaFin: "2021-09-11",
                estado: "No iniciado",
            },
            {
                id: 3,
                idSprint: 2,
                sumilla: "Sumilla de tarea 3",
                fechaInicio: "2021-09-04",
                fechaFin: "2021-09-11",
                estado: "No iniciado",
            },
            {
                id: 4,
                idSprint: 2,
                sumilla: "Sumilla de tarea 4",
                fechaInicio: "2021-09-04",
                fechaFin: "2021-09-11",
                estado: "No iniciado",
            },
            {
                id: 5,
                idSprint: 2,
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
                idSprint: 3,
                sumilla: "Sumilla de tarea 6",
                fechaInicio: "2021-09-11",
                fechaFin: "2021-09-18",
                estado: "No iniciado",
            },
            {
                id: 7,
                idSprint: 3,
                sumilla: "Sumilla de tarea 7",
                fechaInicio: "2021-09-11",
                fechaFin: "2021-09-18",
                estado: "No iniciado",
            },
            {
                id: 8,
                idSprint: 3,
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
                idSprint: 4,    
                sumilla: "Sumilla de tarea 6",
                fechaInicio: "2021-09-11",
                fechaFin: "2021-09-18",
                estado: "No iniciado",
            },
            {
                id: 12,
                idSprint: 4,
                sumilla: "Sumilla de tarea 7",
                fechaInicio: "2021-09-11",
                fechaFin: "2021-09-18",
                estado: "No iniciado",
            },
            {
                id: 13,
                idSprint: 4,
                sumilla: "Sumilla de tarea 8",
                fechaInicio: "2021-09-11",
                fechaFin: "2021-09-18",
                estado: "No iniciado",
            },
        ],
    },
];

export default function SprintBacklog(props) {
    // Variables de proyecto global
    const router = useRouter();
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    // Variables de modales
    const {
        isOpen: isModalCreateOpen,
        onOpen: onModalCreateOpen,
        onOpenChange: onModalCreateChange,
    } = useDisclosure();

    // Decodificacion de URL
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    // Variables principales
    const [sprints, setSprints] = useState([]);
    const [sprintsResumed, setSprintsResumed] = useState([]); // [idSprint, nombreSprint, estado]

    // Manejo de carga de datos
    const getSprints = async () => {
        setIsLoadingSmall(true);
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/Backlog/SprintBacklog/listarSprints/` +
                    projectId
            );
            setSprints(response.data);
            setSprintsResumed(
                response.data.map((sprint) => ({
                    id: sprint.id,
                    nombre: sprint.nombre,
                    estado: sprint.estado,
                }))
            );
        } catch (error) {
            console.log(error);
        } finally {
            setSprints(dataSprints);
            setSprintsResumed(
                dataSprints.map((sprint) => ({
                    id: sprint.id,
                    nombre: sprint.nombre,
                    estado: sprint.estado,
                }))
            );
            setIsLoadingSmall(false);
        }
    };
    
    useEffect(() => {
        getSprints();
    }, []);

    // Manejo de creación de sprint
    function createSprint(newSprint) {
        return new Promise((resolve, reject) => {
            axios
                .put(
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                        `/api/proyecto/Backlog/SprintBacklog/crearSprint/` +
                        projectId,
                    {
                        sprint: newSprint,
                    }
                )
                .then((response) => {
                    console.log(response);
                    resolve();
                })
                .catch((error) => {
                    console.error("Error al crear el sprint: ", error);
                    reject(error);
                });
        });
    }

    const handleCreate = async (newSprint) => {
        try {
            await createSprint(newSprint);
            toast.success("El sprint se ha creado exitosamente.");
            getSprints();
            return true;
        } catch (e) {
            toast.error("Error al crear el sprint.");
            return true;
        }
    };

    // Componente
    return (
        <>
            <div className="flex flex-col py-4 lg:px-8 gap-4 mt-4">
                <div className="flex flex-row items-center justify-between">
                    <h3 className="montserrat text-[#172B4D] text-2xl font-semibold">
                        Sprints actuales
                    </h3>
                    <Button
                        radius="sm"
                        className="bg-[#172B4D] text-white text-md"
                        onPress={onModalCreateOpen}
                    >
                        Crear Sprint
                    </Button>
                </div>
                <Divider className="mb-2" />

                {sprints
                    .filter(
                        (sprint) =>
                            sprint.estado !== "Completado" &&
                            sprint.nombre !== "Sin Sprint"
                    )
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
                                            idSprint={tarea.idSprint}
                                            sumilla={tarea.sumilla}
                                            fechaInicio={tarea.fechaInicio}
                                            fechaFin={tarea.fechaFin}
                                            estado={tarea.estado}
                                            sprints={sprintsResumed}
                                        />
                                    ))}
                                </div>
                            </AccordionItem>
                        </Accordion>
                    ))}
                {sprints
                    .filter((sprint) => sprint.nombre === "Sin Sprint")
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
                                            idSprint={tarea.idSprint}
                                            sumilla={tarea.sumilla}
                                            fechaInicio={tarea.fechaInicio}
                                            fechaFin={tarea.fechaFin}
                                            estado={tarea.estado}
                                            sprints={sprintsResumed}
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

                {sprints
                    .filter((sprint) => sprint.estado === "Completado")
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
                                            idSprint={tarea.idSprint}
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
            <Toaster richColors closeButton={true} />
            <ModalCrearSprint
                isOpen={isModalCreateOpen}
                onOpenChange={onModalCreateChange}
                handleCreate={handleCreate}
            />
        </>
    );
}

function CardTask(props) {
    const { idSprint, sumilla, fechaInicio, fechaFin, estado, sprints } = props;

    function getChipColorAndText(estado) {
        switch (estado) {
            case 0:
                return { colorChip: "default", textoChip: "No Iniciado" };
            case 1:
                return { colorChip: "primary", textoChip: "Activo" };
            case 2:
                return { colorChip: "success", textoChip: "Finalizado" };
            default:
                return { colorChip: "default", textoChip: "No Iniciado" };
        }
    }
    const { colorChip, textoChip } = getChipColorAndText(estado);

    return (
        <div className="flex sm:flex-row flex-col items-center justify-center gap-4 p-2 px-4 bg-[#F5F5F5] dark:bg-mainSidebar rounded-md">
            <p className="flex-1 grow-[6]">{sumilla}</p>
            <p className="flex-1 grow-[4]">{`Desde: ${fechaInicio} - Hasta: ${fechaFin}`}</p>
            <div className="flex flex-1 grow-[2] justify-center items-center">
                <Chip
                    className="capitalize roboto"
                    color={colorChip}
                    size="sm"
                    variant="flat"
                >
                    {textoChip}
                </Chip>
            </div>

            <div className="flex flex-row">
                <Button isIconOnly variant="light">
                    <img
                        src="/icons/eye.svg"
                        alt="Ver tarea"
                        className="w-4/6 h-4/6"
                    />
                </Button>
                {sprints && (
                    <DropdownTask idSprintActual={idSprint} sprints={sprints} />
                )}
            </div>
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
function DropdownTask(props) {
    const { idSprintActual, sprints } = props;
    const unfinishedSprints = sprints.filter((sprint) => sprint.estado !== "Completado");

    return (
        <div className="relative flex justify-end items-center gap-2">
            <Dropdown
                placement="bottom-end"
                className="bg-background border-1 border-default-200"
            >
                <DropdownTrigger>
                    <Button isIconOnly variant="light">
                        <img
                            src="/icons/changeSprint.svg"
                            alt="Alternar de Sprint"
                            className="w-4/6 h-4/6"
                        />
                    </Button>
                </DropdownTrigger>
                <DropdownMenu disabledKeys={[idSprintActual.toString()]}>
                    <DropdownSection title="Cambiar de sprint" showDivider>
                        {unfinishedSprints.map((sprint) => (
                            <DropdownItem key={sprint.id}>
                                {sprint.nombre}
                            </DropdownItem>
                        ))}
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}
function ModalCrearSprint({ isOpen, onOpenChange, handleCreate }) {
    // Variables de formulario
    const [newSprint, setNewSprint] = useState({
        nombre: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
    });
    const [statusForm, setStatusForm] = useState("init");
    const [errorForm, setErrorForm] = useState(null);

    // Control de flujo de variables de formulario
    const nombreInvalid = useMemo(() => {
        return newSprint.nombre === "" ? true : false;
    }, [newSprint.nombre]);

    const descripcionInvalid = useMemo(() => {
        console.log(newSprint.descripcion.length);
        return newSprint.descripcion.length > 200 ? true : false;
    }, [newSprint.descripcion]);

    const fechaInicioInvalid = useMemo(() => {
        return newSprint.fechaInicio === "" ? true : false;
    }, [newSprint.fechaInicio]);

    const fechaFinInvalid = useMemo(() => {
        return newSprint.fechaFin === "" ? true : false;
    }, [newSprint.fechaFin]);

    const errorFechas = useMemo(() => {
        if (newSprint.fechaInicio !== "" && newSprint.fechaFin !== "") {
            const fechaInicio = new Date(newSprint.fechaInicio);
            const fechaFin = new Date(newSprint.fechaFin);
            if (fechaInicio >= fechaFin) {
                setErrorForm(
                    "La fecha de inicio debe ser menor a la fecha de fin."
                );
                return true;
            } else {
                setErrorForm(null);
                return false;
            }
        }
    }, [newSprint.fechaInicio, newSprint.fechaFin]);

    const disabledButtons = useMemo(() => {
        if (statusForm === "valid" && errorForm === null) {
            return false;
        } else {
            return true;
        }
    }, [statusForm, errorForm]);

    useEffect(() => {
        if (
            nombreInvalid ||
            descripcionInvalid ||
            fechaInicioInvalid ||
            fechaFinInvalid ||
            newSprint.nombre === "" ||
            newSprint.fechaInicio === "" ||
            newSprint.fechaFin === "" ||
            errorFechas
        ) {
            setStatusForm("init");
        } else {
            setStatusForm("valid");
        }
    }, [newSprint]);

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
        >
            <ModalContent>
                {(onClose) => {
                    const endCreate = async () => {
                        setStatusForm("loading");
                        try {
                            const response = await handleCreate(newSprint);
                            if (response) {
                                // Considerar que aqui se debe verificar que el response sea correcto
                                setStatusForm("init");
                                setNewSprint({
                                    nombre: "",
                                    descripcion: "",
                                    fechaInicio: "",
                                    fechaFin: "",
                                });
                                onClose();
                            } else {
                                setStatusForm("valid");
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Crear nuevo Sprint
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Nombre del Sprint"
                                    labelPlacement="outside"
                                    placeholder="Ej. Sprint 1"
                                    variant="bordered"
                                    radius="sm"
                                    value={newSprint.nombre}
                                    onChange={(e) =>
                                        setNewSprint({
                                            ...newSprint,
                                            nombre: e.target.value,
                                        })
                                    }
                                    isRequired={true}
                                />
                                <Textarea
                                    label="Descripción del Sprint"
                                    labelPlacement="outside"
                                    placeholder="Agregar una descripción del Sprint"
                                    variant="bordered"
                                    radius="sm"
                                    value={newSprint.descripcion}
                                    errorMessage={
                                        descripcionInvalid &&
                                        "La descripción debe ser como máximo 200 caracteres."
                                    }
                                    onChange={(e) =>
                                        setNewSprint({
                                            ...newSprint,
                                            descripcion: e.target.value,
                                        })
                                    }
                                />
                                <div className="flex flex-col items-start gap-1.5">
                                    <label className="text-sm font-medium after:content-['*'] after:text-danger after:ml-0.5">
                                        Fecha Inicio
                                    </label>
                                    <input
                                        type="date"
                                        id="fechaInicio"
                                        className="font-BlinkMacSystemFont text-sm font-normal text-foreground-500 shadow-sm px-3 py-2 gap-3 border-medium rounded-lg border-default-200 hover:border-default-400 focus:border-defaut-700 active:border-defaut-700"
                                        name="fechaInicio"
                                        onChange={(e) =>
                                            setNewSprint({
                                                ...newSprint,
                                                fechaInicio: e.target.value,
                                            })
                                        }
                                        required
                                    ></input>
                                </div>

                                <div className="flex flex-col items-start gap-2">
                                    <label className="text-sm font-medium after:content-['*'] after:text-danger after:ml-0.5">
                                        Fecha Fin
                                    </label>
                                    <input
                                        type="date"
                                        id="fechaFin"
                                        className="font-BlinkMacSystemFont text-sm font-normal text-foreground-500 shadow-sm px-3 py-2 gap-3 border-medium rounded-lg border-default-200 hover:border-default-400 focus:border-defaut-700 active:border-defaut-700"
                                        name="fechaFin"
                                        onChange={(e) =>
                                            setNewSprint({
                                                ...newSprint,
                                                fechaFin: e.target.value,
                                            })
                                        }
                                        required
                                    ></input>
                                </div>

                                {errorForm && (
                                    <p className="text-tiny text-danger">
                                        {errorForm}
                                    </p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant="light"
                                    onPress={onClose}
                                    isDisabled={statusForm === "loading"}
                                >
                                    Cerrar
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={endCreate}
                                    className="bg-[#172B4D] text-white text-md"
                                    isDisabled={disabledButtons}
                                    isLoading={statusForm === "loading"}
                                >
                                    Crear
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );
}
