"use client";

import { useContext, useEffect, useState } from "react";
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
    user,
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { Toaster, toast } from "sonner";

axios.defaults.withCredentials = true;

export default function autoevaluacionEquipo(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const session = useContext(SessionContext);

    const userId = session.idUsuario.toString();
    const rol = session.Privilegios_idPrivilegios;

    console.log("Session: ", session);
    console.log("Rol: ", rol);
    console.log("User ID: ", userId);

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);

    const [initialEvaluations, setInitialEvaluations] = useState([]);
    const [usersEvaluation, setUsersEvaluation] = useState(initialEvaluations);
    const [formState, setFormState] = useState("initial"); // "empty", "created", "initial", "modified"
    const [criteriosSave, setCriteriosSave] = useState({
        criterio1: "",
        criterio2: "",
        criterio3: "",
        criterio4: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

            if (response.status === 200) {
                
                const evaluaciones = response.data.evaluados;
                setInitialEvaluations(evaluaciones);
                setUsersEvaluation(evaluaciones);
            } else if (response.status === 204) {
                if (rol !== 3) {
                    setFormState("created");
                    return;
                }
                setFormState("empty");
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

    console.log(formState); 

    // Manejo de guardado de datos
    function saveEvaluation() {
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

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await saveEvaluation();
            setInitialEvaluations(usersEvaluation);
            toast.success("La autoevaluación se ha guardado exitosamente.");
        } catch (e) {
            toast.error("Ha ocurrido un error al guardar la autoevaluación.");
        } finally {
            onOpenChange(true);
        }
    };

    // Manejo de creación de datos
    function createEvaluation() {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                        `/api/proyecto/autoEvaluacion/crearAutoEvaluacion`,
                    {
                        idProyecto: projectId,
                        criterio1: criteriosSave.criterio1,
                        criterio2: criteriosSave.criterio2,
                        criterio3: criteriosSave.criterio3,
                        criterio4: criteriosSave.criterio4,
                    }
                )
                .then((response) => {
                    console.log(response);
                    resolve();
                })
                .catch((error) => {
                    console.error("Error al crear las evaluaciones: ", error);
                    reject(error);
                });
        });
    }

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            // Espera de 2segs
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await createEvaluation();
            toast.success("La autoevaluación se ha creado exitosamente.");
            setFormState("created");
        } catch (e) {
            toast.error("Ha ocurrido un error al crear la autoevaluación.");
        } finally {
            onOpenChange(true);
        }
    };

    const handleCriteriosChange = (name, value) => {
        setCriteriosSave((prevCriterios) => ({
            ...prevCriterios,
            [name]: value,
        }));

        const allCriteriosFilled = Object.values(criteriosSave).every(
            (criterio) => criterio.trim() !== ""
        );
        setIsSaveDisabled(!allCriteriosFilled);
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
            setFormState("modified");
        } else {
            setFormState("initial");
        }
    }, [usersEvaluation, initialEvaluations]);

    // Renderizado de miembro
    const renderMember = (member) => {
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

    // Renderizado de acuerdo a rol
    const renderRole = () => {
        return (
            <>
                {formState === "empty" && (
                    <div className="flex flex-col flex-1 items-center justify-center gap-4 w-full">
                        <img
                            src="/images/magic_search.svg"
                            alt="Autoevaluacion inactiva"
                        />
                        <p className="font-[Montserrat] text-xl">
                            No existe una autoevaluación activa
                        </p>
                        {rol === 3 && (
                            <p className="font-[Montserrat] text-xl">
                                Un supervisor o jefe de proyecto debe activar la
                                autoevaluación
                            </p>
                        )}
                        {rol !== 3 && (
                            <>
                                <Button
                                    className="font-[Roboto] bg-[#172B4D] text-[#FFFFFF]"
                                    onPress={onOpen}
                                >
                                    Crear autoevaluación
                                </Button>
                                <Modal
                                    isOpen={isOpen}
                                    onOpenChange={onOpenChange}
                                    isDismissable={false}
                                >
                                    <ModalContent>
                                        {(onClose) => (
                                            <>
                                                <ModalHeader className="flex flex-col gap-1">
                                                    Registrar autoevaluación
                                                </ModalHeader>
                                                <ModalBody>
                                                    <Input
                                                        autoFocus
                                                        name="criterio1"
                                                        label="Criterio 1"
                                                        placeholder="Ej. Dominio técnico"
                                                        type="text"
                                                        value={
                                                            criteriosSave.criterio1
                                                        }
                                                        onChange={(e) =>
                                                            handleCriteriosChange(
                                                                "criterio1",
                                                                e.target.value
                                                            )
                                                        }
                                                        variant="bordered"
                                                        isRequired={true}
                                                    />
                                                    <Input
                                                        name="criterio2"
                                                        label="Criterio 2"
                                                        placeholder="Ej. Compromiso con los trabjos"
                                                        type="text"
                                                        value={
                                                            criteriosSave.criterio2
                                                        }
                                                        onChange={(e) =>
                                                            handleCriteriosChange(
                                                                "criterio2",
                                                                e.target.value
                                                            )
                                                        }
                                                        variant="bordered"
                                                        isRequired={true}
                                                    />
                                                    <Input
                                                        name="criterio3"
                                                        label="Criterio 3"
                                                        placeholder="Ej. Comunicación con los compañeros"
                                                        type="text"
                                                        value={
                                                            criteriosSave.criterio3
                                                        }
                                                        onChange={(e) =>
                                                            handleCriteriosChange(
                                                                "criterio3",
                                                                e.target.value
                                                            )
                                                        }
                                                        variant="bordered"
                                                        isRequired={true}
                                                    />
                                                    <Input
                                                        name="criterio4"
                                                        label="Criterio 4"
                                                        placeholder="Ej. Comprensión de proyecto"
                                                        type="text"
                                                        value={
                                                            criteriosSave.criterio4
                                                        }
                                                        onChange={(e) =>
                                                            handleCriteriosChange(
                                                                "criterio4",
                                                                e.target.value
                                                            )
                                                        }
                                                        variant="bordered"
                                                        isRequired={true}
                                                    />
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button
                                                        className="font-[Roboto]"
                                                        color="default"
                                                        variant="light"
                                                        onPress={onClose}
                                                    >
                                                        Cerrar
                                                    </Button>
                                                    <Button
                                                        className="font-[Roboto] bg-[#172B4D] text-[#FFFFFF]"
                                                        onPress={handleCreate}
                                                        isLoading={
                                                            isLoading === true
                                                        }
                                                        isDisabled={
                                                            isSaveDisabled
                                                        }
                                                    >
                                                        Crear
                                                    </Button>
                                                </ModalFooter>
                                            </>
                                        )}
                                    </ModalContent>
                                </Modal>
                            </>
                        )}
                    </div>
                )}
                {formState === "created" && (
                    <div className="flex flex-col flex-1 items-center justify-center gap-4 w-full">
                        <img
                            src="/images/magic_search.svg"
                            alt="Autoevaluacion activa"
                        />
                        <p className="font-[Montserrat] text-xl">
                            La autoevaluación se encuentra activa
                        </p>
                    </div>
                )}
                {rol === 3 && formState !== "empty" && (
                    <>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-right sm:gap-10 gap-4 mb-4">
                            <p className="text-justify">
                                Califique a cada uno de sus compañeros del 1 al
                                5, incluyendo su propio trabajo. Siendo el 1 la
                                calificación más baja y 5 la calificación más
                                alta
                            </p>
                            <Button
                                className="bg-[#172B4D] text-[#FFFFFF]"
                                onPress={onOpen}
                                isDisabled={formState === "initial"}
                            >
                                Guardar
                            </Button>
                        </div>
                        <div className="flex flex-col justify-between items-center gap-8 mb-4">
                            {usersEvaluation.map((user) => (
                                <div
                                    key={user.idUsuarioEvaluado}
                                    className="w-full"
                                >
                                    {renderMember(user)}
                                </div>
                            ))}
                        </div>
                        <Modal
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                            isDismissable={false}
                        >
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">
                                            Guardar cambios
                                        </ModalHeader>
                                        <ModalBody>
                                            <p>
                                                ¿Seguro que deseas guardar los
                                                cambios?
                                            </p>
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
                                                onPress={handleSave}
                                                isLoading={isLoading === true}
                                            >
                                                Guardar
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                    </>
                )}
            </>
        );
    };

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
                    <BreadcrumbsItem
                        text={"[Nombre del proyecto]"}
                    ></BreadcrumbsItem>
                </Breadcrumbs>
            </div>
            <h2 className="space-x-4 mb-2 montserrat text-[#172B4D] font-bold text-3xl text-gray-700">
                Autoevaluación del equipo
            </h2>
            {renderRole()}
        </div>
    );
}
