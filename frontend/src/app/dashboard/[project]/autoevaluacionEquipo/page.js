"use client";

import { useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SmallLoadingScreen } from "../layout";
import axios from "axios";

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    Textarea,
    Radio,
    RadioGroup,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { Toaster, toast } from "sonner";

axios.defaults.withCredentials = true;

export default function autoevaluacionEquipo(props) {
    const { data: session } = useSession();
    const userId = session?.user?.id.toString();

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);

    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    const [initialEvaluations, setInitialEvaluations] = useState([]);
    const [usersEvaluation, setUsersEvaluation] = useState(initialEvaluations);
    const [formState, setFormState] = useState("initial"); // "initial", "modified"
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Manejo de carga y guardado de datos
    useEffect(() => {
        axios
            .get(
                `http://localhost:8080/api/proyecto/autoEvaluacion/listarAutoEvaluacion/` +
                    projectId +
                    `/` +
                    userId
            )
            .then((response) => {
                const evaluaciones = response.data.evaluados;
                setInitialEvaluations(evaluaciones);
                setUsersEvaluation(evaluaciones);
            })
            .catch((error) => {
                console.error("Error al obtener las evaluaciones.", error);
            });
        setIsLoadingSmall(false);
    }, []);
    
    function saveEvaluation() {
        return new Promise((resolve, reject) => {
            axios.put(
                `http://localhost:8080/api/proyecto/autoEvaluacion/actualizarAutoEvaluacion`,
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
        setFormState("loading");
        try {
            await saveEvaluation();
            setInitialEvaluations(usersEvaluation);
            toast.success("La autoevaluación se ha guardado exitosamente.");
        } catch (e) {
            toast.error("Ha ocurrido un error al guardar la autoevaluación.");
        }
        finally {
            onOpenChange(true);
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
            setFormState("modified");
        }
        else {
            setFormState("initial");
        }
    }, [usersEvaluation, initialEvaluations]);

    // Renderizado
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

    // Componente
    return (
        <div className="flex flex-col p-8 w-full h-full">
            <Toaster richColors closeButton={true}/>
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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-right sm:gap-10 gap-4 mb-4">
                <p className="text-justify">
                    Califique a cada uno de sus compañeros del 1 al 5,
                    incluyendo su propio trabajo. Siendo el 1 la calificación
                    más baja y 5 la calificación más alta
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
                    <div key={user.idUsuarioEvaluado} className="w-full">
                        {renderMember(user)}
                    </div>
                ))}
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
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
                                    className="bg-[#172B4D] text-[#FFFFFF]"
                                    onPress={handleSave}
                                    isLoading={formState === "loading"}
                                >
                                    Guardar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
