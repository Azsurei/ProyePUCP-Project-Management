
"use client";

import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { SmallLoadingScreen, HerramientasInfo } from "../layout";
axios.defaults.withCredentials = true;
import {
    Button,
    Avatar,
    AvatarGroup,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Spacer,
    useDisclosure,
} from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import MissingEDTComponents from "../../../../../public/images/missing_EDTComponents.svg";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import ModalNewRetro from "@/components/dashboardComps/projectComps/retrospectivasComps/ModalNewRetro";
import { Toaster, toast } from "sonner";

export default function Retrospectiva(props) {
    const router = useRouter();
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { herramientasInfo } = useContext(HerramientasInfo);

    const [lretrospectivas, setLRetrospectivas] = useState([]);
    const [listSprints, setListSprints] = useState([]);

    const {
        isOpen: isModalNewOpen,
        onOpen: onModalNewOpen,
        onOpenChange: onModalNewOpenChange,
    } = useDisclosure();

    const refreshList = async () => {
        try {
            // Get data for lineasRetrospectiva
            const lineasRetrospectivaResponse = await axios.get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/retrospectiva/listarLineasRetrospectivaXIdRetrospectiva/" +
                    herramientasInfo.find(herramienta => herramienta.idHerramienta === 10).idHerramientaCreada
            );

            setLRetrospectivas(
                lineasRetrospectivaResponse.data.lineasRetrospectiva
            );

            // Get data for sprints
            const sprintsResponse = await axios.get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/backlog/listarSprintsXIdBacklogcronograma/` +
                    herramientasInfo.find(herramienta => herramienta.idHerramienta === 1).idHerramientaCreada + //id backlog
                    `/` +
                    herramientasInfo.find(herramienta => herramienta.idHerramienta === 4).idHerramientaCreada //id cronograma
            );

            setListSprints(
                sprintsResponse.data.sprints.map((sprint) => ({
                    idSprint: sprint.idSprint,
                    nombre: sprint.nombre,
                    idSprintString: sprint.idSprint.toString(),
                }))
            );

            console.log("Se completo el refresh con exito");
        } catch (error) {
            console.error("Error al obtener los datos: ", error);
            toast.error("Hubo un error al cargar los datos" , {position: "top-center"});
        }
    };

    useEffect(() => {
        setIsLoadingSmall(true);
        axios
            .get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/retrospectiva/listarLineasRetrospectivaXIdRetrospectiva/" +
                    herramientasInfo.find(herramienta => herramienta.idHerramienta === 10).idHerramientaCreada
            )
            .then((response) => {
                setLRetrospectivas(response.data.lineasRetrospectiva);
                console.log("Listado de lineas retrospectiva");

                axios
                    .get(
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                            `/api/proyecto/backlog/listarSprintsXIdBacklogcronograma/` +
                            herramientasInfo.find(herramienta => herramienta.idHerramienta === 1).idHerramientaCreada + //id backlog
                            `/` +
                            herramientasInfo.find(herramienta => herramienta.idHerramienta === 4).idHerramientaCreada //id cronograma
                    )
                    .then((response) => {
                        console.log(response);
                        setListSprints(
                            response.data.sprints.map((sprint) => {
                                return {
                                    idSprint: sprint.idSprint,
                                    nombre: sprint.nombre,
                                    idSprintString: sprint.idSprint.toString(),
                                };
                            })
                        );
                        console.log("listado de sprints");

                        setIsLoadingSmall(false);
                    })
                    .catch((error) => {
                        console.error(
                            "Error al obtener los datos de sprints: ",
                            error
                        );
                        toast.error("Error al cargar reporte con sprints" , {position: "top-center"});
                    });
            })
            .catch((error) => {
                console.error("Error al obtener retrospectivas: ", error);
                toast.error("Error al cargar retrospectivas" , {position: "top-center"});
            });
    }, []);

    // Function to get today's date in dd/mm/yyyy format
    const getTodaysDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
        const year = today.getFullYear();

        return `${day}/${month}/${year}`;
    };

    // Function to handle deletion of a lineaRetrospectiva
    const handleDelete = async (idLineaRetrospectiva) => {
        try {
            const response = await axios.delete(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/retrospectiva/eliminarLineaRetrospectiva",
                {
                    data: { idLineaRetrospectiva },
                }
            );
            // Remove the deleted item from the state
            if (response.status === 200) {
                setLRetrospectivas(
                    lretrospectivas.filter(
                        (item) =>
                            item.idLineaRetrospectiva !== idLineaRetrospectiva
                    )
                );
                //fetchData();
            }
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    return (
        <div className="flex-1 min-h-full p-[2.5rem]">
            <ModalNewRetro
                isOpen={isModalNewOpen}
                onOpenChange={onModalNewOpenChange}
                listSprints={listSprints}
                refreshList={refreshList}
            />

            <HeaderWithButtonsSamePage
                haveReturn={false}
                haveAddNew={true}
                handlerAddNew={() => {
                    onModalNewOpen();
                }}
                breadcrump={"Inicio / Proyectos / " + projectName}
                btnText={"Nueva retrospectiva"}
            >
                Restrospectivas
            </HeaderWithButtonsSamePage>
            <Spacer y={4} />
            {lretrospectivas.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                    <br />
                    <br />
                    <MissingEDTComponents />
                    <p>No hay retrospectivas registradas</p>
                </div>
            ) : (lretrospectivas.map((retro, index) => (
                <div key={retro.idLineaRetrospectiva}>
                    <Card  className="flex-grow w-full mx-auto">
                        <CardHeader className="p-4">
                            <h3 className="text-xl font-bold text-blue-900 montserrat">
                                {"Retrospectiva '" + retro.titulo + "' del sprint " + (retro.sprintNombre === null ? "'Sin sprint'" : "'" + retro.sprintNombre + "'")}
                            </h3>
                        </CardHeader>
                        <Divider orientation={"horizontal"} />
                        <CardBody className="flex-row justify-between items-center h-36">
                            <div className="mr-4">
                                <p className="text-blue-900 montserrat">
                                    Fecha: {getTodaysDate()}
                                </p>
                                <p className="text-blue-900 montserrat">
                                    Que hicimos bien? {retro.cantBien}{" "}
                                    comentarios
                                </p>
                                <p className="text-gray-700 montserrat">
                                    Que hicimos mal? {retro.cantMal} comentarios
                                </p>
                                <p className="text-gray-700 montserrat">
                                    Que podemos hacer? {retro.cantQueHacer}{" "}
                                    comentarios
                                </p>
                            </div>
                            <div className="flex flex-col space-y-2 mt-0.5">
                                <Button className="w-36 bg-blue-900 text-white font-semibold" onPress={()=>{handleViewDetail(retro.idLineaRetrospectiva)}}>
                                    Ver detalle
                                </Button>
                                <Modal
                                    nameButton="Eliminar"
                                    textHeader="Eliminar retrospectiva"
                                    textBody="¿Seguro que quiere eliminar esta retrospectiva?"
                                    colorButton="w-36 bg-red-600 text-white font-semibold"
                                    oneButton={false}
                                    secondAction={() =>
                                        handleDelete(retro.idLineaRetrospectiva)
                                    }
                                />
                            </div>
                        </CardBody>
                    </Card>
                    <Spacer y={4} />
                </div>)
            ))}
        </div>
    );

    function handleViewDetail(idLineaRetrospectiva){
        router.push('/dashboard/' + projectName+'='+projectId + '/retrospectivas/' + idLineaRetrospectiva);
    }
}
