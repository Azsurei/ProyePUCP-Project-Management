"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { SmallLoadingScreen } from "../layout";
import { SessionContext } from "../../layout";
import axios from "axios";

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Textarea,
    Input,
    Radio,
    RadioGroup,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Divider,
    Chip,
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { Toaster, toast } from "sonner";

axios.defaults.withCredentials = true;

export default function autoevaluacionEquipo(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { sessionData } = useContext(SessionContext);

    const userId = sessionData.idUsuario.toString();
    const rol = sessionData.rolInProject;
    console.log(rol);

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    // Componente
    return (
        <div className="flex flex-col p-8 w-full h-full">
            <Toaster richColors closeButton={true} />
            <div className="space-x-4 mb-2">
                <Breadcrumbs>
                    <BreadcrumbsItem
                        href="/dashboard"
                        text={"Inicio"}
                    ></BreadcrumbsItem>
                    <BreadcrumbsItem text={"Proyectos"}></BreadcrumbsItem>
                    <BreadcrumbsItem text={projectName}></BreadcrumbsItem>
                </Breadcrumbs>
            </div>
            <h2 className="space-x-4 mb-2 montserrat text-[#172B4D] font-bold text-3xl text-gray-700">
                Autoevaluación del equipo
            </h2>
            {rol === 3 && (
                <MemberInterfaceEvaluation
                    projectId={projectId}
                    userId={userId}
                    setIsLoadingSmall={setIsLoadingSmall}
                />
            )}
            {rol !== 3 && (
                <ManagerInterfaceEvaluation
                    projectId={projectId}
                    userId={userId}
                    setIsLoadingSmall={setIsLoadingSmall}
                />
            )}
        </div>
    );
}

function MemberInterfaceEvaluation({ projectId, userId, setIsLoadingSmall }) {
    // Variables generales
    const [initialEvaluations, setInitialEvaluations] = useState([]);
    const [usersEvaluation, setUsersEvaluation] = useState(initialEvaluations);
    const [autoEvaluation, setAutoEvaluation] = useState([]);
    const [statusForm, setStatusForm] = useState("initial"); // "initial", "modified"

    const {
        isOpen: isModalGuardarEvaluacionUsuarioOpen,
        onOpen: onModalGuardarEvaluacionUsuarioOpen,
        onOpenChange: onModalGuardarEvaluacionUsuarioChange,
    } = useDisclosure();

    // Manejo de carga de datos
    const getEvaluation = async () => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/autoEvaluacion/listarAutoEvaluacion/` +
                    projectId +
                    `/` +
                    userId
            );

            console.log(response.status);
            if (response.status === 200) {
                const evaluaciones = response.data.evaluados;
                const autoEvaluacion = response.data.autoEvaluacion[0];

                setInitialEvaluations(evaluaciones);
                setUsersEvaluation(evaluaciones);

                autoEvaluacion.fechaInicio = autoEvaluacion.fechaInicio.split('T')[0];
                autoEvaluacion.fechaFin = autoEvaluacion.fechaFin.split('T')[0];
                setAutoEvaluation(autoEvaluacion);
            } else if (response.status === 204) {
                setStatusForm("empty");
            }
        } catch (error) {
            console.error("Error al obtener las evaluaciones.", error);
        } finally {
            setIsLoadingSmall(false);
        }
    };

    useEffect(() => {
        getEvaluation();
    }, []);

    // Manejo de guardado de datos
    function guardarEvaluacionUsuario() {
        return new Promise((resolve, reject) => {
            axios
                .put(
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                        `/api/proyecto/autoEvaluacion/actualizarAutoEvaluacion`,
                    {
                        evaluados: usersEvaluation,
                    }
                )
                .then((response) => {
                    console.log(response);
                    resolve();
                })
                .catch((error) => {
                    console.error("Error al guardar las evaluaciones: ", error);
                    reject(error);
                });
        });
    }

    const handleGuardarEvaluacionUsuario = async () => {
        try {
            await guardarEvaluacionUsuario();
            setInitialEvaluations(usersEvaluation);
            toast.success("La autoevaluación se ha guardado exitosamente.");
        } catch (e) {
            toast.error("Ha ocurrido un error al guardar la autoevaluación.");
        }
    };

    // Manejo de cambios en los datos
    const handleCriterionRatingChange = (
        idUsuarioEvaluado,
        idCriterioEvaluacion,
        nuevoPuntaje
    ) => {
        setUsersEvaluation((prevState) => {
            return prevState.map((item) => {
                if (item.idUsuarioEvaluado === idUsuarioEvaluado) {
                    const criterioIndex = item.criterios.findIndex(
                        (criterio) =>
                            criterio.idCriterioEvaluacion ===
                            idCriterioEvaluacion
                    );

                    if (criterioIndex !== -1) {
                        const newCriterios = [...item.criterios];
                        newCriterios[criterioIndex] = {
                            ...newCriterios[criterioIndex],
                            nota: nuevoPuntaje,
                        };

                        return {
                            ...item,
                            criterios: newCriterios,
                        };
                    }
                }
                return item;
            });
        });
    };

    const handleCommentChange = (idUsuarioEvaluado, nuevaObservacion) => {
        setUsersEvaluation((prevState) => {
            return prevState.map((item) => {
                if (item.idUsuarioEvaluado === idUsuarioEvaluado) {
                    return { ...item, observaciones: nuevaObservacion };
                }
                return item;
            });
        });
    };

    // Verificaciones
    useEffect(() => {
        if (
            JSON.stringify(usersEvaluation) !==
            JSON.stringify(initialEvaluations)
        ) {
            setStatusForm("modified");
        } else {
            setStatusForm("initial");
        }
    }, [usersEvaluation, initialEvaluations]);

    // Renderizado de miembro
    const cardEvaluacion = (member) => {
        return (
            <Card className="w-full">
                <CardHeader className="bg-[#172B4D] text-[#FFFFFF] montserrat text-2xl font-medium p-4">
                    <h3>
                        {member.nombreEvaluado} {member.apellidoEvaluado}
                    </h3>
                </CardHeader>
                <CardBody className="bg-[#EAEAEA]">
                    <div className="flex flex-col gap-6 mb-6">
                        <h4 className="montserrat font-semibold">
                            Criterios de evaluación:
                        </h4>
                        {member.criterios.map((criterio) => (
                            <div
                                key={criterio.idCriterioEvaluacion}
                                className="flex flex-row flex-wrap xl:flex-nowrap justify-between montserrat ml-8"
                            >
                                <div>
                                    <label className="w-full font-medium break-words">
                                        {criterio.criterio}:
                                    </label>
                                </div>
                                <RadioGroup
                                    orientation="horizontal"
                                    defaultValue={criterio.nota.toString()}
                                    onChange={(e) =>
                                        handleCriterionRatingChange(
                                            member.idUsuarioEvaluado,
                                            criterio.idCriterioEvaluacion,
                                            parseInt(e.target.value)
                                        )
                                    }
                                >
                                    <Radio
                                        value="1"
                                        className="2xl:mr-20 xl:mr-12 lg:mr-8"
                                    >
                                        1
                                    </Radio>
                                    <Radio
                                        value="2"
                                        className="2xl:mr-20 xl:mr-12 lg:mr-8"
                                    >
                                        2
                                    </Radio>
                                    <Radio
                                        value="3"
                                        className="2xl:mr-20 xl:mr-12 lg:mr-8"
                                    >
                                        3
                                    </Radio>
                                    <Radio
                                        value="4"
                                        className="2xl:mr-20 xl:mr-12 lg:mr-8"
                                    >
                                        4
                                    </Radio>
                                    <Radio
                                        value="5"
                                        className="2xl:mr-20 xl:mr-12 lg:mr-8"
                                    >
                                        5
                                    </Radio>
                                </RadioGroup>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <h4 className="montserrat font-semibold">
                            Observaciones:
                        </h4>
                        <Textarea
                            variant="faded"
                            placeholder="Registre algunas observaciones..."
                            defaultValue={member.observaciones}
                            onChange={(e) =>
                                handleCommentChange(
                                    member.idUsuarioEvaluado,
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </CardBody>
            </Card>
        );
    };

    // Componente de autoevaluación de miembros
    return (
        <>
            {statusForm === "empty" && (
                <div className="flex flex-col flex-1 items-center justify-center gap-4 w-full">
                    <img
                        src="/images/magic_search.svg"
                        alt="Autoevaluacion inactiva"
                    />
                    <p className="font-[Montserrat] text-xl">
                        No existe una autoevaluación activa
                    </p>
                    <p className="font-[Montserrat] text-xl">
                        Un supervisor o jefe de proyecto debe activar una
                        autoevaluación
                    </p>
                </div>
            )}
            {statusForm !== "empty" && (
                <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-right sm:gap-10 gap-4 mb-4">
                        <h3 className="montserrat text-[#172B4D] text-2xl font-semibold">
                            {autoEvaluation.nombre}
                        </h3>
                        <p className="flex flex-col sm:flex-row gap-3">
                            <span className="font-semibold">
                                {"Fecha de inicio: "} 
                            </span>
                            {autoEvaluation.fechaInicio}
                            <span className="font-semibold">
                                {"Fecha de fin: "} 
                            </span>
                            {autoEvaluation.fechaFin}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-right sm:gap-10 gap-4 mb-4">
                        <p className="text-justify">
                            Califique a cada uno de sus compañeros del 1 al 5,
                            incluyendo su propio trabajo. Siendo el 1 la
                            calificación más baja y 5 la calificación más alta
                        </p>
                        <Button
                            className="bg-[#172B4D] text-[#FFFFFF]"
                            onPress={onModalGuardarEvaluacionUsuarioOpen}
                            isDisabled={statusForm === "initial"}
                        >
                            Enviar
                        </Button>
                    </div>
                    <div className="flex flex-col justify-between items-center gap-8 mb-4">
                        {usersEvaluation.map((user) => (
                            <div
                                key={user.idUsuarioEvaluado}
                                className="w-full"
                            >
                                {cardEvaluacion(user)}
                            </div>
                        ))}
                    </div>
                </>
            )}

            <ModalGuardarEvaluacionUsuario
                isOpen={isModalGuardarEvaluacionUsuarioOpen}
                onOpenChange={onModalGuardarEvaluacionUsuarioChange}
                handleSave={handleGuardarEvaluacionUsuario}
            />
            <Toaster richColors closeButton={true} />
        </>
    );
}
function ManagerInterfaceEvaluation({ projectId, userId, setIsLoadingSmall }) {
    // Variables globales
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [evaluacion, setEvaluacion] = useState(null);
    const [activeEvaluation, setActiveEvaluation] = useState(false); // "initial", "empty", "created", "modified", "sending", "error"
    const [statusInterface, setStatusInterface] = useState("principal"); // "principal", "details", "launching", "finishing"

    const {
        isOpen: isModalCrearEvaluacionProyectoOpen,
        onOpen: onModalCrearEvaluacionProyectoOpen,
        onOpenChange: onModalCrearEvaluacionProyectoChange,
    } = useDisclosure();

    // Manejo de carga de datos
    const getEvaluations = async () => {
        setIsLoadingSmall(true);
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/autoEvaluacion/listarTodasAutoEvaluacion/` +
                    projectId
            );
            console.log(response.data.autoEvaluaciones);
            if (response.status === 200) {
                const evaluaciones = response.data.autoEvaluaciones;
                setEvaluaciones(evaluaciones);
                const activeEvaluation = evaluaciones.some(
                    (evaluacion) => evaluacion.estado === 1
                );
                setActiveEvaluation(activeEvaluation);
            }
        } catch (error) {
            console.error(
                "Error al obtener las evaluaciones del proyecto.",
                error
            );
        } finally {
            setIsLoadingSmall(false);
        }
    };

    useEffect(() => {
        getEvaluations();
    }, []);

    // Manejo de creación de autoevaluacion
    function createEvaluation(newEvaluation) {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                        `/api/proyecto/autoEvaluacion/crearAutoEvaluacion`,
                    {
                        idProyecto: projectId,
                        nombre: newEvaluation.nombreEvaluacion,
                        criterio1: newEvaluation.criterio1,
                        criterio2: newEvaluation.criterio2,
                        criterio3: newEvaluation.criterio3,
                        criterio4: newEvaluation.criterio4,
                        fechaInicio: newEvaluation.fechaInicio,
                        fechaFin: newEvaluation.fechaFin,
                    }
                )
                .then((response) => {
                    console.log(response);
                    resolve();
                })
                .catch((error) => {
                    console.error("Error al crear la autoevaluacion: ", error);
                    reject(error);
                });
        });
    }

    const handleCreate = async (newEvaluation) => {
        try {
            console.log(newEvaluation);
            await createEvaluation(newEvaluation);
            toast.success("La autoevaluación se ha creado exitosamente.");
            getEvaluations();
            return true;
        } catch (e) {
            toast.error("Error al crear la autoevaluación.");
            return false;
        }
    };

    // Manejo de lanzado de autoevaluacion
    function launchEvaluation(idAutoEvaluacionXProyecto) {
        return new Promise((resolve, reject) => {
            console.log("Lanzando...");
            axios
                .put(
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                        `/api/proyecto/autoEvaluacion/activarAutoEvaluacion`,
                    {
                        idProyecto: projectId,
                        idAutoEvaluacionXProyecto: idAutoEvaluacionXProyecto,
                    }
                )
                .then((response) => {
                    console.log(response);
                    resolve();
                })
                .catch((error) => {
                    console.error("Error al lanzar la autoevaluacion: ", error);
                    reject(error);
                });
        });
    }

    const handleLaunch = async (idAutoEvaluacionXProyecto) => {
        try {
            setStatusInterface("launching");
            await launchEvaluation(idAutoEvaluacionXProyecto);
            toast.success("La autoevaluación se ha lanzado exitosamente.");
            getEvaluations();
        } catch (e) {
            toast.error("Error al lanzar la autoevaluación.");
        } finally {
            setStatusInterface("principal");
        }
    };

    // Manejo de finalizado de autoevaluacion
    function finishEvaluation(idAutoEvaluacionXProyecto) {
        return new Promise((resolve, reject) => {
            console.log("Finalizando...");
            axios
                .put(
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                        `/api/proyecto/autoEvaluacion/finalizarAutoEvaluacion/`,
                    {
                        idAutoEvaluacionXProyecto: idAutoEvaluacionXProyecto,
                    }
                )
                .then((response) => {
                    console.log(response);
                    resolve();
                })
                .catch((error) => {
                    console.error(
                        "Error al finalizar la autoevaluacion: ",
                        error
                    );
                    reject(error);
                });
        });
    }

    const handleFinish = async (idAutoEvaluacionXProyecto) => {
        try {
            setStatusInterface("finishing");
            await finishEvaluation(idAutoEvaluacionXProyecto);
            toast.success("La autoevaluación se ha finalizado.");
            getEvaluations();
        } catch (e) {
            toast.error("Error al finalizar la autoevaluación.");
        } finally {
            setStatusInterface("principal");
        }
    };

    // Manejo de visualización de autoevaluacion
    function resultEvaluation(idAutoEvaluacionXProyecto) {
        return new Promise((resolve, reject) => {
            console.log("Obteniendo resultados...");
            axios
                .get(
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                        `/api/proyecto/autoEvaluacion/listarAutoEvaluacionNotas/` +
                        idAutoEvaluacionXProyecto
                )
                .then((response) => {
                    console.log(response);
                    setEvaluacion(response.data.miembros);
                    resolve();
                })
                .catch((error) => {
                    console.error(
                        "Error al obtener los resultados de la autoevaluacion: ",
                        error
                    );
                    reject(error);
                });
        });
    }            

    const handleView = async (idAutoEvaluacionXProyecto) => {
        try {
            setIsLoadingSmall(true);
            await resultEvaluation(idAutoEvaluacionXProyecto);
            setStatusInterface("details");
        } catch (e) {
            toast.error("Error al obtener los datos de la autoevaluación.");
        } finally {
            setIsLoadingSmall(false);
        }
    };

    const closeResultEvaluation = () => {
        setStatusInterface("principal");
        setEvaluacion(null);
    };

    const cardResultEvaluation = (member) => {
        return (
            <Card className="w-full">
                <CardHeader className="bg-[#172B4D] text-[#FFFFFF] montserrat text-2xl font-medium p-4">
                    <h3>
                        {member.nombres} {member.apellidos}
                    </h3>
                </CardHeader>
                <CardBody className="bg-[#EAEAEA]">
                    <div className="flex flex-col gap-6 mb-6">
                        <h4 className="montserrat font-semibold">
                            Criterios de evaluación:
                        </h4>
                        {member.notas.map((criterio) => (
                            <div className="flex flex-row flex-wrap xl:flex-nowrap justify-between montserrat ml-8">
                                <div>
                                    <label className="w-full font-medium break-words">
                                        {criterio.criterio}:
                                    </label>
                                    <p className="w-full font-normal break-words">
                                        {criterio.Promedio} / 5
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <h4 className="montserrat font-semibold">
                            Observaciones:
                        </h4>
                        {member.observaciones &&
                        member.observaciones.some(
                            (observacion) => observacion.observaciones !== null
                        ) ? (
                            member.observaciones.map((observacion, index) =>
                                observacion.observaciones !== null ? (
                                    <Textarea
                                        key={`observacion_${index}`}
                                        isDisabled={true}
                                        variant="faded"
                                        defaultValue={observacion.observaciones}
                                    />
                                ) : null
                            )
                        ) : (
                            <p className="p-4">No hay observaciones enviadas.</p>
                        )}
                    </div>
                </CardBody>
            </Card>
        );
    };

    return (
        <>
            {statusInterface === "details" && (
                <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-right sm:gap-10 gap-4 mb-4">
                        <h3 className="montserrat text-[#172B4D] text-2xl font-semibold">
                            Resultados de autoevaluación
                        </h3>
                        <Button
                            className="bg-[#172B4D] text-[#FFFFFF]"
                            onPress={closeResultEvaluation}
                        >
                            Regresar
                        </Button>
                    </div>
                    {evaluacion.map((user) => (
                        <div key={user.idUsuarioEvaluado} className="w-full">
                            {cardResultEvaluation(user)}
                        </div>
                    ))}
                </>
            )}
            {statusInterface !== "details" && (
                <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-right sm:gap-10 gap-4">
                        <p className="text-justify">
                            En esta sección puede crear autoevaluaciones
                            personalizadas para el proyecto.
                        </p>
                        <Button
                            className="bg-[#172B4D] text-[#FFFFFF]"
                            onPress={onModalCrearEvaluacionProyectoOpen}
                        >
                            Crear
                        </Button>
                    </div>

                    <div className="flex flex-col py-4 lg:px-8 gap-4">
                        <h3 className="montserrat text-[#172B4D] text-2xl font-semibold">
                            Autoevaluación activa
                        </h3>
                        <Divider className="mb-2" />
                        {evaluaciones
                            .filter((evaluacion) => evaluacion.estado === 1)
                            .map((evaluacion) => (
                                <div key={evaluacion.idAutoEvaluacionXProyecto}>
                                    <CardAutoevaluacion
                                        evaluacion={evaluacion}
                                        activeEvaluation={activeEvaluation}
                                        statusInterface={statusInterface}
                                        handleFinish={() =>
                                            handleFinish(
                                                evaluacion.idAutoEvaluacionXProyecto
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        {evaluaciones.filter(
                            (evaluacion) => evaluacion.estado === 1
                        ).length === 0 && (
                            <div className="flex items-center justify-center my-6">
                                <p className="roboto text-default-400">
                                    No existe una autoevaluación activa para el
                                    proyecto actual.
                                </p>
                            </div>
                        )}
                        <h3 className="montserrat text-[#172B4D] text-2xl font-semibold mt-2">
                            Autoevaluaciones del proyecto
                        </h3>
                        <Divider className="mb-2" />
                        {evaluaciones
                            .filter((evaluacion) => evaluacion.estado === 0)
                            .map((evaluacion) => (
                                <div key={evaluacion.idAutoEvaluacionXProyecto}>
                                    <CardAutoevaluacion
                                        evaluacion={evaluacion}
                                        activeEvaluation={activeEvaluation}
                                        statusInterface={statusInterface}
                                        handleLaunch={() =>
                                            handleLaunch(
                                                evaluacion.idAutoEvaluacionXProyecto
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        {evaluaciones
                            .filter((evaluacion) => evaluacion.estado === 2)
                            .map((evaluacion) => (
                                <div key={evaluacion.idAutoEvaluacionXProyecto}>
                                    <CardAutoevaluacion
                                        evaluacion={evaluacion}
                                        activeEvaluation={activeEvaluation}
                                        statusInterface={statusInterface}
                                        handleView={() =>
                                            handleView(
                                                evaluacion.idAutoEvaluacionXProyecto
                                            )
                                        }
                                    />
                                </div>
                            ))}
                        {evaluaciones.filter(
                            (evaluacion) =>
                                evaluacion.estado === 0 ||
                                evaluacion.estado === 2
                        ).length === 0 && (
                            <div className="flex items-center justify-center my-6">
                                <p className="roboto text-default-400">
                                    No existen autoevaluaciones guardadas para
                                    el proyecto actual.
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}

            <ModalCrearEvaluacionProyecto
                isOpen={isModalCrearEvaluacionProyectoOpen}
                onOpenChange={onModalCrearEvaluacionProyectoChange}
                handleCreate={handleCreate}
            />
            <Toaster richColors closeButton={true} />
        </>
    );
}

function CardAutoevaluacion({
    evaluacion,
    handleView,
    handleLaunch,
    handleFinish,
    activeEvaluation,
    statusInterface,
}) {
    const fechaInicio = new Date(evaluacion.fechaInicio);
    const fechaFin = new Date(evaluacion.fechaFin);
    const formatoFecha = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    const fechaInicioFormateada = fechaInicio.toLocaleDateString(
        "es-PE",
        formatoFecha
    );
    const fechaFinFormateada = fechaFin.toLocaleDateString(
        "es-PE",
        formatoFecha
    );
    const rangoFechasFormateado = `${fechaInicioFormateada} - ${fechaFinFormateada}`;

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
    const { colorChip, textoChip } = getChipColorAndText(evaluacion.estado);
    const [selectedCard, setSelectedCard] = useState(null);

    return (
        <Card>
            <CardBody>
                <div className="w-full flex flex-row items-center">
                    <p className="flex-1 grow-[5]">{evaluacion.nombre}</p>
                    <p className="flex-1 grow-[3]">{rangoFechasFormateado}</p>
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
                    <div className="relative flex justify-end items-center gap-2">
                        {handleView && (
                            <Button
                                className="bg-[#172B4D] text-[#FFFFFF] ml-8"
                                onPress={() =>
                                    handleView(
                                        evaluacion.idAutoEvaluacionXProyecto
                                    )
                                }
                                isDisabled={
                                    statusInterface === "launching" ||
                                    statusInterface === "finishing"
                                }
                            >
                                Ver
                            </Button>
                        )}
                        {handleLaunch && (
                            <Button
                                className="bg-[#172B4D] text-[#FFFFFF] ml-8"
                                onPress={() => {
                                    setSelectedCard(
                                        evaluacion.idAutoEvaluacionXProyecto
                                    );
                                    handleLaunch(
                                        evaluacion.idAutoEvaluacionXProyecto
                                    );
                                }}
                                isDisabled={
                                    activeEvaluation ||
                                    statusInterface === "launching" ||
                                    statusInterface === "finishing"
                                }
                                isLoading={
                                    statusInterface === "launching" &&
                                    selectedCard ===
                                        evaluacion.idAutoEvaluacionXProyecto
                                }
                            >
                                Lanzar
                            </Button>
                        )}
                        {handleFinish && (
                            <Button
                                className="bg-[#172B4D] text-[#FFFFFF] ml-8"
                                onPress={() => {
                                    setSelectedCard(
                                        evaluacion.idAutoEvaluacionXProyecto
                                    );
                                    handleFinish(
                                        evaluacion.idAutoEvaluacionXProyecto
                                    );
                                }}
                                isDisabled={
                                    statusInterface === "launching" ||
                                    statusInterface === "finishing"
                                }
                                isLoading={
                                    statusInterface === "finishing" &&
                                    selectedCard ===
                                        evaluacion.idAutoEvaluacionXProyecto
                                }
                            >
                                Finalizar
                            </Button>
                        )}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

function ModalGuardarEvaluacionUsuario({ isOpen, onOpenChange, handleSave }) {
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
                        await handleSave();
                        setIsSending(false);
                        onClose();
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Guardar cambios
                            </ModalHeader>
                            <ModalBody>
                                <p>¿Seguro que deseas guardar los cambios?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cerrar
                                </Button>
                                <Button
                                    className="font-[Roboto] bg-[#172B4D] text-[#FFFFFF]"
                                    onPress={endSave}
                                    isLoading={isSending}
                                    isDisabled={isSending}
                                >
                                    Guardar
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );
}
function ModalCrearEvaluacionProyecto({ isOpen, onOpenChange, handleCreate }) {
    // Variables generales
    const [evaluacion, setEvaluacion] = useState({
        nombreEvaluacion: "",
        fechaInicio: "",
        fechaFin: "",
        criterio1: "",
        criterio2: "",
        criterio3: "",
        criterio4: "",
    });
    const [statusForm, setStatusForm] = useState("init"); // "init", "valid", "sending"
    const [errorForm, setErrorForm] = useState(null);

    // Control de flujo de variables de formulario
    const errorFechas = useMemo(() => {
        if (
            evaluacion.fechaInicio.trim() !== "" &&
            evaluacion.fechaFin.trim() !== ""
        ) {
            const fechaInicio = new Date(evaluacion.fechaInicio);
            const fechaFin = new Date(evaluacion.fechaFin);
            if (fechaInicio > fechaFin) {
                setErrorForm(
                    "La fecha de inicio debe ser menor a la fecha de fin"
                );
                return true;
            } else {
                setErrorForm(null);
                return false;
            }
        }
        return true;
    }, [evaluacion.fechaInicio, evaluacion.fechaFin]);

    const disabledButtons = useMemo(() => {
        return !(statusForm === "valid" && errorForm === null);
    }, [statusForm, errorForm]);

    useEffect(() => {
        if (
            evaluacion.nombreEvaluacion.trim() !== "" &&
            evaluacion.fechaInicio.trim() !== "" &&
            evaluacion.fechaFin.trim() !== "" &&
            evaluacion.criterio1.trim() !== "" &&
            evaluacion.criterio2.trim() !== "" &&
            evaluacion.criterio3.trim() !== "" &&
            evaluacion.criterio4.trim() !== "" &&
            !errorFechas
        ) {
            setStatusForm("valid");
        } else {
            setStatusForm("init");
        }
    }, [evaluacion]);

    // Funciones adicionaes
    const clearForm = () => {
        setEvaluacion({
            nombreEvaluacion: "",
            fechaInicio: "",
            fechaFin: "",
            criterio1: "",
            criterio2: "",
            criterio3: "",
            criterio4: "",
        });
    };

    // Componente de modal
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
            isKeyboardDismissDisabled={true}
            placement="top-center"
            scrollBehavior="inside"
            hideCloseButton={true}
        >
            <ModalContent>
                {(onClose) => {
                    const endCreate = async () => {
                        setStatusForm("sending");
                        try {
                            const response = await handleCreate(evaluacion);
                            if (response) {
                                clearForm();
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
                            <ModalHeader className="flex flex-col gap-1.5">
                                Registrar autoevaluación
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    name="nombreEvaluacion"
                                    label="Nombre de la autoevaluación"
                                    labelPlacement="outside"
                                    placeholder="Ej. Autoevaluación 1"
                                    type="text"
                                    value={evaluacion.nombreEvaluacion}
                                    onChange={(e) =>
                                        setEvaluacion((prevEvaluacion) => ({
                                            ...prevEvaluacion,
                                            nombreEvaluacion: e.target.value,
                                        }))
                                    }
                                    variant="bordered"
                                    radius="sm"
                                    isRequired={true}
                                />
                                <label className="text-sm font-medium after:content-['*'] after:text-danger after:ml-0.5">
                                    Criterios de autoevaluación
                                </label>
                                <Input
                                    name="criterio1"
                                    label="Criterio 1"
                                    placeholder="Ej. Dominio técnico"
                                    type="text"
                                    value={evaluacion.criterio1}
                                    onChange={(e) =>
                                        setEvaluacion((prevEvaluacion) => ({
                                            ...prevEvaluacion,
                                            criterio1: e.target.value,
                                        }))
                                    }
                                    variant="bordered"
                                    radius="sm"
                                    isRequired={true}
                                />
                                <Input
                                    name="criterio2"
                                    label="Criterio 2"
                                    placeholder="Ej. Compromiso con los trabajos"
                                    type="text"
                                    value={evaluacion.criterio2}
                                    onChange={(e) =>
                                        setEvaluacion((prevEvaluacion) => ({
                                            ...prevEvaluacion,
                                            criterio2: e.target.value,
                                        }))
                                    }
                                    variant="bordered"
                                    radius="sm"
                                    isRequired={true}
                                />
                                <Input
                                    name="criterio3"
                                    label="Criterio 3"
                                    placeholder="Ej. Comunicación con los compañeros"
                                    type="text"
                                    value={evaluacion.criterio3}
                                    onChange={(e) =>
                                        setEvaluacion((prevEvaluacion) => ({
                                            ...prevEvaluacion,
                                            criterio3: e.target.value,
                                        }))
                                    }
                                    variant="bordered"
                                    radius="sm"
                                    isRequired={true}
                                />
                                <Input
                                    name="criterio4"
                                    label="Criterio 4"
                                    placeholder="Ej. Comprensión de proyecto"
                                    type="text"
                                    value={evaluacion.criterio4}
                                    onChange={(e) =>
                                        setEvaluacion((prevEvaluacion) => ({
                                            ...prevEvaluacion,
                                            criterio4: e.target.value,
                                        }))
                                    }
                                    variant="bordered"
                                    radius="sm"
                                    isRequired={true}
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
                                            setEvaluacion((prevEvaluacion) => ({
                                                ...evaluacion,
                                                fechaInicio: e.target.value,
                                            }))
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
                                            setEvaluacion((prevEvaluacion) => ({
                                                ...evaluacion,
                                                fechaFin: e.target.value,
                                            }))
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
                                    className="font-[Roboto]"
                                    color="default"
                                    variant="light"
                                    onPress={() => {
                                        clearForm();
                                        onClose();
                                    }}
                                    isDisabled={statusForm === "sending"}
                                >
                                    Cerrar
                                </Button>
                                <Button
                                    className="font-[Roboto] bg-[#172B4D] text-[#FFFFFF]"
                                    onPress={endCreate}
                                    isLoading={statusForm === "sending"}
                                    isDisabled={disabledButtons}
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