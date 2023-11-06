"use client";

import { useMemo, useState, useContext, useEffect } from "react";
import { SmallLoadingScreen, HerramientasInfo } from "../../layout";
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

axios.defaults.withCredentials = true;

let idBacklog = 0;
let idCronograma = 0;

// Funciones de API
const getSprints = async () => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/backlog/listarSprintsXIdBacklogcronograma/` +
                    idBacklog + `/` + idCronograma  
            )
            .then((response) => {
                console.log(response);
                resolve(response.data.sprints);
            })
            .catch((error) => {
                console.error(
                    "Error al obtener los datos de sprints: ",
                    error
                );
                reject(error);
            });
    });
};
const createSprint = async (newSprint) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/backlog/insertarSprint`,
                {
                    idProductBacklog: idBacklog,
                    nombre: newSprint.nombre,
                    descripcion: newSprint.descripcion,
                    fechaInicio: newSprint.fechaInicio,
                    fechaFin: newSprint.fechaFin,
                    estado: 1,
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
};
const deleteSprint = async (idSprint) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/backlog/eliminarSprint/` +
                    idSprint
            )
            .then((response) => {
                console.log(response);
                resolve();
            })
            .catch((error) => {
                console.error("Error al eliminar el sprint: ", error);
                reject(error);
            });
    });
};
const updateStatusSprint = async (idSprint, estado) => {
    return new Promise((resolve, reject) => {
        axios
            .put(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/backlog/actualizarEstadoSprint`,
                {
                    idSprint: idSprint,
                    estado: estado,
                }
            )
            .then((response) => {
                console.log(response);
                resolve();
            })
            .catch((error) => {
                console.error(
                    "Error al actualizar el estado del sprint: ",
                    error
                );
                reject(error);
            });
    });
};
const updateSprint = async (sprint) => {
    return new Promise((resolve, reject) => {
        axios
            .put(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/backlog/actualizarSprint/` +
                    sprint.id,
                {
                    sprint: sprint,
                }
            )
            .then((response) => {
                console.log(response);
                resolve(true);
            })
            .catch((error) => {
                console.error("Error al actualizar el sprint: ", error);
                reject(error);
            });
    });
};

// Función principal
export default function SprintBacklog(props) {
    // Variables de proyecto global
    const router = useRouter();
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { herramientasInfo } = useContext(HerramientasInfo);
    [idBacklog, idCronograma] = herramientasInfo
        .filter((item) => [1, 4].includes(item.idHerramienta))
        .map((item) => item.idHerramientaCreada);

    // Decodificacion de URL
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    // Variables de modales
    const {
        isOpen: isModalCreateOpen,
        onOpen: onModalCreateOpen,
        onOpenChange: onModalCreateChange,
    } = useDisclosure();
    const {	
        isOpen: isModalInitOpen,
        onOpen: onModalInitOpen,
        onOpenChange: onModalInitChange,
    } = useDisclosure();
    const {	
        isOpen: isModalFinishOpen,
        onOpen: onModalFinishOpen,
        onOpenChange: onModalFinishChange,
    } = useDisclosure();


    // Variables principales
    const [sprints, setSprints] = useState([]);
    const [statusInterface, setStatusInterface] = useState("inactive"); // ["active", "inactive"]
    const [idSelectedSprint, setIdSelectedSprint] = useState(null);

    // Funciones principales
    const handleGet = async () => {
        setIsLoadingSmall(true);
        try {
            const sprints = await getSprints();
            setSprints(sprints);
            setIsLoadingSmall(false);
        } catch (e) {
            toast.error("Error al obtener los datos de los sprints.");
            console.log(e);
        }
    };
    const handleCreate = async (newSprint) => {
        try {
            await createSprint(newSprint);
            toast.success("El sprint se ha creado exitosamente.");
            await handleGet();
            return true;
        } catch (e) {
            toast.error("Error al crear el sprint.");
            return false;
        }
    };
    const handleStart = async () => {
        try {
            await updateStatusSprint(idSelectedSprint, 2);
            toast.success("El sprint se ha iniciado exitosamente.");
            await handleGet();
        } catch (e) {
            toast.error("Error al iniciar el sprint.");
        } finally {
            setIdSelectedSprint(null);
        }
    };
    const handleFinish = async () => {
        try {
            await updateStatusSprint(idSelectedSprint, 3);
            toast.success("El sprint se ha finalizado exitosamente.");
            await handleGet();
        } catch (e) {
            toast.error("Error al finalizar el sprint.");
        } finally {
            setIdSelectedSprint(null);
        }
    };

    // Efectos de renderizado
    useEffect(() => {
        handleGet();
    }, []);
    useEffect(() => {
        if (sprints.filter((sprint) => sprint.estado === 2).length === 1) {
            setStatusInterface("active");
        } else {
            setStatusInterface("inactive");
        }
    }, [sprints]);

    // Componente
    return (
        <>
            <div className="flex flex-col py-4 lg:px-8 gap-4 mt-4">
                <div className="flex flex-row items-center justify-between">
                    <h3 className="montserrat text-[#172B4D] text-2xl font-semibold">
                        Sprint actual
                    </h3>
                    {sprints.filter((sprint) => sprint.estado === 2).length ===
                        1 && (
                        <Button
                            radius="sm"
                            className="bg-[#172B4D] text-white text-md"
                            onPress={() => {
                                const selectedSprint = sprints.find(
                                    (sprint) => sprint.estado === 2
                                );
                                if (selectedSprint) {
                                    setIdSelectedSprint(
                                        selectedSprint.idSprint
                                    );
                                    onModalFinishOpen();
                                }
                            }}
                        >
                            Finalizar Sprint
                        </Button>
                    )}
                </div>
                <Divider className="mb-2" />

                {sprints
                    .filter((sprint) => sprint.estado === 2)
                    .map((sprint) => (
                        <div key={sprint.idSprint}>
                            <Accordion key={sprint.id} variant="shadow">
                                <AccordionItem
                                    key={sprint.idSprint}
                                    aria-label={sprint.nombre}
                                    title={sprint.nombre}
                                    subtitle={`${dateFormat(
                                        sprint.fechaInicio
                                    )} - ${dateFormat(sprint.fechaFin)}`}
                                    className="montserrat font-semibold p-1"
                                >
                                    <div className="px-10">
                                        <div className="flex flex-row items-center justify-between">
                                            <p>
                                                Descripción:{" "}
                                                {sprint.descripcion}
                                            </p>
                                            <div className="flex flex-row gap-4">
                                                <Button
                                                    radius="sm"
                                                    className="roboto text-md"
                                                    variant="flat"
                                                >
                                                    Editar Sprint
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 my-4 items-center">
                                            {sprint.tareas.length === 0 ? (
                                                <>
                                                    <Divider className="w-full" />
                                                    <p className="text-default-500 font-medium">
                                                        Actualmente no hay
                                                        tareas asignadas a este
                                                        sprint.
                                                    </p>
                                                </>
                                            ) : (
                                                sprint.tareas.map((tarea) => (
                                                    <div key={tarea.idTarea}>
                                                        <CardTask
                                                            tarea={tarea}
                                                            sprints={sprints}
                                                        />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    ))}
                {sprints.filter((sprint) => sprint.estado === 2).length ===
                    0 && (
                    <div className="flex items-center justify-center my-6">
                        <p className="roboto text-default-400">
                            No existe un sprint activo en el proyecto.
                        </p>
                    </div>
                )}

                <div className="flex flex-row items-center justify-between mt-4">
                    <h3 className="montserrat text-[#172B4D] text-2xl font-semibold">
                        Sprints del proyecto
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
                    .filter((sprint) => sprint.estado === 1)
                    .map((sprint) => (
                        <div key={sprint.idSprint}>
                            <Accordion key={sprint.id} variant="shadow">
                                <AccordionItem
                                    key={sprint.id}
                                    aria-label={sprint.nombre}
                                    title={sprint.nombre}
                                    subtitle={`${dateFormat(
                                        sprint.fechaInicio
                                    )} - ${dateFormat(sprint.fechaFin)}`}
                                    className="montserrat font-semibold p-1"
                                >
                                    <div className="px-10">
                                        <div className="flex flex-row items-center justify-between">
                                            <p>
                                                Descripción:{" "}
                                                {sprint.descripcion}
                                            </p>
                                            <div className="flex flex-row gap-4">
                                                <Button
                                                    radius="sm"
                                                    className="roboto text-md"
                                                    variant="flat"
                                                >
                                                    Editar Sprint
                                                </Button>
                                                <Button
                                                    radius="sm"
                                                    className="roboto bg-[#172B4D] text-white text-md"
                                                    isDisabled={
                                                        statusInterface ===
                                                        "active"
                                                    }
                                                    onPress={() => {
                                                        setIdSelectedSprint(
                                                            sprint.idSprint
                                                        );
                                                        onModalInitOpen();
                                                    }}
                                                >
                                                    Iniciar Sprint
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 my-4 items-center">
                                            {sprint.tareas.length === 0 ? (
                                                <>
                                                    <Divider className="w-full" />
                                                    <p className="text-default-500 font-medium">
                                                        Actualmente no hay
                                                        tareas asignadas a este
                                                        sprint.
                                                    </p>
                                                </>
                                            ) : (
                                                sprint.tareas.map((tarea) => (
                                                    <div key={tarea.idTarea}>
                                                        <CardTask
                                                            tarea={tarea}
                                                            sprints={sprints}
                                                        />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    ))}
                {sprints
                    .filter((sprint) => sprint.idSprint === 0)
                    .map((sprint) => (
                        <div key={sprint.idSprint}>
                            <Accordion key={sprint.id} variant="shadow">
                                <AccordionItem
                                    key={sprint.id}
                                    aria-label={sprint.nombre}
                                    title={sprint.nombre}
                                    className="montserrat font-semibold p-1"
                                >
                                    <div className="flex flex-col gap-4 px-10 mb-4">
                                        {sprint.tareas.length === 0 ? (
                                            <>
                                                <Divider className="w-full" />
                                                <p className="text-default-500 font-medium">
                                                    Actualmente no hay tareas
                                                    asignadas a este sprint.
                                                </p>
                                            </>
                                        ) : (
                                            sprint.tareas.map((tarea) => (
                                                <div key={tarea.idTarea}>
                                                    <CardTask
                                                        tarea={tarea}
                                                        sprints={sprints}
                                                    />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    ))}

                <div className="flex flex-row items-center justify-between mt-4">
                    <h3 className="montserrat text-[#172B4D] text-2xl font-semibold">
                        Sprints completados
                    </h3>
                </div>
                <Divider className="mb-2" />

                {sprints
                    .filter((sprint) => sprint.estado === 3)
                    .map((sprint) => (
                        <div key={sprint.idSprint}>
                            <Accordion key={sprint.id} variant="shadow">
                                <AccordionItem
                                    key={sprint.id}
                                    aria-label={sprint.nombre}
                                    title={sprint.nombre}
                                    subtitle={`${dateFormat(
                                        sprint.fechaInicio
                                    )} - ${dateFormat(sprint.fechaFin)}`}
                                    className="montserrat font-semibold p-1"
                                >
                                    <div className="px-10">
                                        <div className="flex flex-row items-center justify-between">
                                            <p>
                                                Descripción:{" "}
                                                {sprint.descripcion}
                                            </p>
                                            <div className="flex flex-row gap-4">
                                                <Button
                                                    radius="sm"
                                                    className="roboto text-md"
                                                    variant="flat"
                                                >
                                                    Editar Sprint
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4 my-4 items-center">
                                            {sprint.tareas.length === 0 ? (
                                                <>
                                                    <Divider className="w-full" />
                                                    <p className="text-default-500 font-medium">
                                                        Actualmente no hay
                                                        tareas asignadas a este
                                                        sprint.
                                                    </p>
                                                </>
                                            ) : (
                                                sprint.tareas.map((tarea) => (
                                                    <div key={tarea.idTarea}>
                                                        <CardTask
                                                            tarea={tarea}
                                                        />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    ))}
                {sprints.filter((sprint) => sprint.estado === 3).length ===
                    0 && (
                    <div className="flex items-center justify-center my-6">
                        <p className="roboto text-default-400">
                            No existen sprints completados en el proyecto.
                        </p>
                    </div>
                )}
            </div>
            <Toaster richColors closeButton={true} />
            <ModalCrearSprint
                isOpen={isModalCreateOpen}
                onOpenChange={onModalCreateChange}
                handleCreate={handleCreate}
            />
            <ModalIniciarSprint
                isOpen={isModalInitOpen}
                onOpenChange={onModalInitChange}
                handleStart={handleStart}
            />
            <ModalFinalizarSprint
                isOpen={isModalFinishOpen}
                onOpenChange={onModalFinishChange}
                handleFinish={handleFinish}
            />
        </>
    );
}

// Funciones de modulación
function CardTask(props) {
    const { tarea, sprints } = props;

    return (
        <div className="flex sm:flex-row flex-col items-center justify-center gap-4 p-2 px-4 bg-[#F5F5F5] dark:bg-mainSidebar rounded-md">
            <p className="flex-1 grow-[6]">{tarea.sumillaTarea}</p>
            <p className="flex-1 grow-[4]">{`Inicio: ${dateFormat(tarea.fechaInicio)} - Fin: ${dateFormat(tarea.fechaFin)}`}</p>
            <div className="flex flex-1 grow-[2] justify-center items-center">
                <Chip
                    className="capitalize roboto"
                    color={tarea.colorTareaEstado}
                    size="sm"
                    variant="flat"
                >
                    {tarea.nombreTareaEstado}
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
                    <DropdownTask idSprintActual={tarea.idSprint} sprints={sprints} />
                )}
            </div>
        </div>
    );
}
function DropdownTask(props) {
    const { idSprintActual, sprints } = props;
    const unfinishedSprints = sprints.filter((sprint) => sprint.estado !== 3);

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
                            <DropdownItem aria-label={sprint.nombre} key={sprint.idSprint}>
                                {sprint.nombre}
                            </DropdownItem>
                        ))}
                    </DropdownSection>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}

// Funciones de modales
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
function ModalIniciarSprint({ isOpen, onOpenChange, handleStart }) {
    // Variables generales
    const [isSending, setIsSending] = useState(false);

    // Componente de modal
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
        >
            <ModalContent>
                {(onClose) => {
                    const endSave = async () => {
                        setIsSending(true);
                        await handleStart();
                        setIsSending(false);
                        onClose();
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Guardar cambios
                            </ModalHeader>
                            <ModalBody>
                                <p>¿Seguro que desea iniciar este sprint en el proyecto?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="font-[Roboto] bg-[#172B4D] text-[#FFFFFF]"
                                    onPress={endSave}
                                    isLoading={isSending}
                                    isDisabled={isSending}
                                >
                                    Iniciar
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );
}
function ModalFinalizarSprint({ isOpen, onOpenChange, handleFinish }) {
    // Variables generales
    const [isSending, setIsSending] = useState(false);

    // Componente de modal
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
        >
            <ModalContent>
                {(onClose) => {
                    const endSave = async () => {
                        setIsSending(true);
                        await handleFinish();
                        setIsSending(false);
                        onClose();
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Guardar cambios
                            </ModalHeader>
                            <ModalBody>
                                <p>¿Seguro que desea finalizar este sprint?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="font-[Roboto] bg-[#172B4D] text-[#FFFFFF]"
                                    onPress={endSave}
                                    isLoading={isSending}
                                    isDisabled={isSending}
                                >
                                    Iniciar
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );
}

// Funciones de utilidad
function dateFormat(fechaOriginal) {
    const fecha = new Date(fechaOriginal);
    const dia = fecha.getDate().toString().padStart(2, '0'); 
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
    const año = fecha.getFullYear();
    const fechaFormateada = `${dia}-${mes}-${año}`;
  
    return fechaFormateada;
}