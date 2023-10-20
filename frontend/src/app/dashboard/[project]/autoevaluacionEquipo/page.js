"use client";

import { useContext, useEffect, useState } from "react";
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
    useDisclosure
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

axios.defaults.withCredentials = true;

const users = [
    {
        idUsuario: 1,
        nombres: "Juan",
        apellidos: "Perez",
    },
    {
        idUsuario: 2,
        nombres: "Juan",
        apellidos: "Perez",
    },
    {
        idUsuario: 3,
        nombres: "Juan",
        apellidos: "Perez",
    },
    {
        idUsuario: 4,
        nombres: "Juan",
        apellidos: "Perez",
    },
    {
        idUsuario: 5,
        nombres: "Juan",
        apellidos: "Perez",
    },
];

export default function autoevaluacionEquipo(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [formState, setFormState] = useState("initial"); // "initial", "modified"
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    setIsLoadingSmall(false);

    // Reemplazar por un Axios para obtener la data de los usuarios relacionados al proyecto
    const initialEvaluations = users.map((user) => ({
        userId: user.idUsuario,
        criteria: {
            technicalDomain: 0, // Estados iniciales para cada criterio
            workCommitment: 0,
            teamCommunication: 0,
            projectComprehension: 0,
        },
        observations: "", // Initialize with an empty comment
    }));

    const [usersEvaluation, setUsersEvaluation] = useState(initialEvaluations);

    const handleCriterionRatingChange = (userId, criterionName, newRating) => {
        setUsersEvaluation((prevState) => {
            return prevState.map((item) => {
                if (item.userId === userId) {
                    return {
                        ...item,
                        criteria: {
                            ...item.criteria,
                            [criterionName]: newRating,
                        },
                    };
                }
                return item;
            });
        });
    };

    const handleCommentChange = (userId, newComment) => {
        setUsersEvaluation((prevState) => {
            return prevState.map((item) => {
                if (item.userId === userId) {
                    return { ...item, comment: newComment };
                }
                return item;
            });
        });
    };

    const handleSave = () => {
        setFormState("loading");

        // Realizar el guardado con un post de axios
        try{

        }
        catch(error){
            console.log(error);
        }
        finally{
            onOpenChange(true);
            setFormState("initial");
        }   
    };

    // agregar funcion para comparar el estado inicial con el estado cambiado de la variaable de usersEvaluation
    useEffect(() => {
        if(JSON.stringify(usersEvaluation) !== JSON.stringify(initialEvaluations)){
            setFormState("modified");
        }
    }, [usersEvaluation]);


    const renderMember = (member) => {
        const userEvaluationData = usersEvaluation.find(
            (item) => item.userId === member.idUsuario
        );

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
                        <div className="flex flex-row flex-wrap xl:flex-nowrap justify-between montserrat ml-8">
                            <div>
                                <label className="w-full font-medium break-words">
                                    Dominio técnico:
                                </label>
                            </div>
                            <RadioGroup
                                orientation="horizontal"
                                defaultValue={userEvaluationData.criteria.technicalDomain.toString()}
                                onChange={(e) =>
                                    handleCriterionRatingChange(
                                        member.idUsuario,
                                        "technicalDomain",
                                        parseInt(e.target.value)
                                    )
                                }
                            >
                                <Radio value="1" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    1
                                </Radio>
                                <Radio value="2" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    2
                                </Radio>
                                <Radio value="3" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    3
                                </Radio>
                                <Radio value="4" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    4
                                </Radio>
                                <Radio value="5" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    5
                                </Radio>
                            </RadioGroup>
                        </div>
                        <div className="flex flex-row flex-wrap xl:flex-nowrap justify-between montserrat ml-8">
                            <div className="w-">
                                <label className="w-full font-medium break-words">
                                    Compromiso con los trabajos:
                                </label>
                            </div>
                            <RadioGroup
                                orientation="horizontal"
                                defaultValue={userEvaluationData.criteria.workCommitment.toString()}
                                onChange={(e) =>
                                    handleCriterionRatingChange(
                                        member.idUsuario,
                                        "workCommitment",
                                        parseInt(e.target.value)
                                    )
                                }
                            >
                                <Radio value="1" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    1
                                </Radio>
                                <Radio value="2" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    2
                                </Radio>
                                <Radio value="3" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    3
                                </Radio>
                                <Radio value="4" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    4
                                </Radio>
                                <Radio value="5" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    5
                                </Radio>
                            </RadioGroup>
                        </div>
                        <div className="flex flex-row flex-wrap xl:flex-nowrap justify-between montserrat ml-8">
                            <div>
                                <label className="w-full font-medium break-words">
                                    Comunicación con los compañeros:
                                </label>
                            </div>
                            <RadioGroup
                                orientation="horizontal"
                                defaultValue={userEvaluationData.criteria.teamCommunication.toString()}
                                onChange={(e) =>
                                    handleCriterionRatingChange(
                                        member.idUsuario,
                                        "teamCommunication",
                                        parseInt(e.target.value)
                                    )
                                }
                            >
                                <Radio value="1" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    1
                                </Radio>
                                <Radio value="2" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    2
                                </Radio>
                                <Radio value="3" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    3
                                </Radio>
                                <Radio value="4" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    4
                                </Radio>
                                <Radio value="5" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    5
                                </Radio>
                            </RadioGroup>
                        </div>
                        <div className="flex flex-row flex-wrap xl:flex-nowrap justify-between montserrat ml-8">
                            <div>
                                <label className="w-full font-medium break-words">
                                    Comprensión del proyecto:
                                </label>
                            </div>
                            <RadioGroup
                                orientation="horizontal"
                                defaultValue={userEvaluationData.criteria.projectComprehension.toString()}
                                onChange={(e) =>
                                    handleCriterionRatingChange(
                                        member.idUsuario,
                                        "projectComprehension",
                                        parseInt(e.target.value)
                                    )
                                }
                            >
                                <Radio value="1" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    1
                                </Radio>
                                <Radio value="2" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    2
                                </Radio>
                                <Radio value="3" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    3
                                </Radio>
                                <Radio value="4" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    4
                                </Radio>
                                <Radio value="5" className="2xl:mr-20 xl:mr-12 lg:mr-8">
                                    5
                                </Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h4 className="montserrat font-semibold">Observaciones:</h4>
                        <Textarea
                            variant="faded"
                            placeholder="Registre algunas observaciones..."
                            onChange={(e) =>
                                handleCommentChange(
                                    member.idUsuario,
                                    e.target.value
                                )
                            }
                        />
                    </div>
                </CardBody>
            </Card>
        );
    };

    return (
        <div className="flex flex-col p-8 w-full h-full">
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
                <Button onPress={onOpen} isDisabled={formState === "initial"}>
                    Guardar
                </Button>
            </div>
            <div className="flex flex-col justify-between items-center gap-8 mb-4">
                {users.map((user) => renderMember(user))}
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Guardar cambios
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    ¿Seguro que deseas guardar los cambios?
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
                                <Button color="primary" onPress={handleSave} isLoading={formState === "loading"}>
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
