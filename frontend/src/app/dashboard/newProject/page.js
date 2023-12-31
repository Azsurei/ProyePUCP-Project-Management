"use client";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/projectMenu.css";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/newProjects.css";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

import ListTools from "@/components/dashboardComps/projectComps/projectCreateComps/ListTools";
import CardCreateProject from "@/components/dashboardComps/projectComps/projectCreateComps/CardCreateProject";
import ChoiceUser from "@/components/dashboardComps/projectComps/projectCreateComps/ChoiceUser";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";

import Link from "next/link";
import { useState } from "react";
import * as React from "react";
import TracerNewProject from "@/components/TracerNewProject";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createContext } from "react";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { SessionContext } from "../layout";

import { Button as ButtonNextUI } from "@nextui-org/react";

axios.defaults.withCredentials = true;

const items = [
    {
        id: "1",
        label: "Informacion General",
        percentageComplete: 0,
        status: "current",
    },
    {
        id: "2",
        label: "Herramientas",
        percentageComplete: 0,
        status: "unvisited",
    },
    {
        id: "3",
        label: "Participantes",
        percentageComplete: 0,
        status: "unvisited",
    },
];

const items2 = [
    {
        id: "1",
        label: "Informacion General",
        percentageComplete: 100,
        status: "visited",
    },
    {
        id: "2",
        label: "Herramientas",
        percentageComplete: 0,
        status: "current",
    },
    {
        id: "3",
        label: "Participantes",
        percentageComplete: 0,
        status: "unvisited",
    },
];

const items3 = [
    {
        id: "1",
        label: "Informacion General",
        percentageComplete: 100,
        status: "visited",
    },
    {
        id: "2",
        label: "Herramientas",
        percentageComplete: 100,
        status: "visited",
    },
    {
        id: "3",
        label: "Participantes",
        percentageComplete: 0,
        status: "current",
    },
];

export const ToolCardsContext = createContext();

export default function newProject() {
    const router = useRouter();
    const { sessionData } = useContext(SessionContext);

    const steps = ["Información General", "Herramientas", "Participantes"];

    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedSupervisoresList, setSelectedSupervisoresList] = useState(
        []
    );
    const [selectedMiembrosList, setSelectedMiembrosList] = useState([]);

    const [isProjectNameFilled, setIsProjectNameFilled] = useState(false); //para saber si el nombre del proyecto esta lleno

    const handleChangeProjectName = (e) => {
        const projectName = e.target.value;
        setNameProject(projectName);
        //handleChangesNombre(projectName);  // Llama a la función prop para actualizar el nombre
        setIsProjectNameFilled(!!projectName); // Actualiza el estado basado en si el campo está lleno
    };

    const toggleModal1 = () => {
        setModal1(!modal1);
    };

    const returnListOfSupervisores = (newSupervisoresList) => {
        const newSupervsList = [
            ...selectedSupervisoresList,
            ...newSupervisoresList,
        ];

        setSelectedSupervisoresList(newSupervsList);
        setModal1(!modal1);
    };

    const toggleModal2 = () => {
        setModal2(!modal2);
    };

    const returnListOfMiembros = (newMiembrosList) => {
        const newMembrsList = [...selectedMiembrosList, ...newMiembrosList];

        setSelectedMiembrosList(newMembrsList);
        setModal2(!modal2);
    };

    const removeSupervisor = (supervisor) => {
        const newSupervsList = selectedSupervisoresList.filter(
            (item) => item.idUsuario !== supervisor.idUsuario
        );
        setSelectedSupervisoresList(newSupervsList);
        console.log(newSupervsList);
    };

    const removeMiembro = (miembro) => {
        const newMembrsList = selectedMiembrosList.filter(
            (item) => item.idUsuario !== miembro.idUsuario
        );
        setSelectedMiembrosList(newMembrsList);
        console.log(newMembrsList);
    };

    const [nameProject, setNameProject] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [listHerramientas, setListHerramientas] = useState([]);

    const [estadoProgress, setEstadoProgress] = useState(1);

    const cambiarEstadoAdelante = () => {
        if (estadoProgress != 3) {
            setEstadoProgress(estadoProgress + 1);
            handleNext();
            handleComplete();
        }
    };
    const camibarEstadoAtras = () => {
        if (estadoProgress != 1) {
            setEstadoProgress(estadoProgress - 1);
            handleBack();
            handleReset();
        }
    };

    /*const handleChangeProjectName = (e) => {
        setNameProject(e.target.value);
    };
    */

    const handleChangesFechaInicio = (e) => {
        setFechaInicio(e.target.value);
    };

    const handleChangesFechaFin = (e) => {
        setFechaFin(e.target.value);
    };

    //al cargar la pagina, cargaremos toda la info necesaria (datos de usuario y listado de herramientas)
    //para evitar loading times en los cambios entre niveles

    const [datosUsuario, setDatosUsuario] = useState({
        idUsuario: "",
        nombres: "",
        apellidos: "",
        correoElectronico: "",
    });

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL + "/api/usuario/verInfoUsuario";

        axios
            .get(stringURL)
            .then(function (response) {
                const userData = response.data.usuario[0];
                console.log(userData);
                console.log("el nombre del usuario es ", userData.nombres);
                console.log("el apellido del usuario es ", userData.apellidos);
                setDatosUsuario(userData);

                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const addToolToList = (herramienta) => {
        const newToolsList = [
            ...listHerramientas,
            {
                idHerramienta: herramienta.idHerramienta,
                nombre: herramienta.nombre,
                descripcion: herramienta.descripcion,
            },
        ];
        setListHerramientas(newToolsList);
        console.log(newToolsList);
    };

    const removeToolInList = (herramienta) => {
        const newToolsList = listHerramientas.filter(
            (item) => item.idHerramienta !== herramienta.idHerramienta
        );
        setListHerramientas(newToolsList);
        console.log(newToolsList);
    };

    const checkData = () => {
        console.log("NOMBRE DE PROYECTO = " + nameProject);
        console.log("FECHA INICIO = " + fechaInicio);
        console.log("FECHA FIN = " + fechaFin);

        const nombre = nameProject;
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/insertarProyecto",
                {
                    proyecto: { nombre, fechaInicio, fechaFin },
                    herramientas: listHerramientas,
                    participantesSupervisores: selectedSupervisoresList,
                    participantesMiembros: selectedMiembrosList,
                }
            )
            .then(function (response) {
                console.log(response);
                console.log("Conexion correcta");

                router.push("/dashboard");
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const [isCreatingProject, setIsCreatingProject] = useState(false);

    return (
        <div className="flex-1 p-[2.5rem]">
            <div className="headerDiv">
                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem
                        href="/dashboard/newProject"
                        text="Nuevo Proyecto"
                    />
                </Breadcrumbs>
                <p className="textProject2">Crea un Proyecto</p>
            </div>

            <div>
                <Box sx={{ width: "70%", mx: "auto", marginTop: "20px" }}>
                    <Stepper nonLinear activeStep={activeStep}>
                        {steps.map((label, index) => (
                            <Step key={label} completed={completed[index]}>
                                <StepButton color="inherit" disabled={true}>
                                    {label}
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </div>

            <div className="containerInfoBox">
                <div
                    className="buttonContainerPrev"
                    style={{ opacity: estadoProgress != 1 ? "100" : "0" }}
                >
                    <button className="myButton" onClick={camibarEstadoAtras}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="79"
                            height="79"
                            viewBox="0 0 79 79"
                            fill="none"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.58268 39.4993C6.58268 21.32 21.32 6.58268 39.4993 6.58268C57.6787 6.58268 72.416 21.32 72.416 39.4993C72.416 57.6787 57.6787 72.416 39.4993 72.416C21.32 72.416 6.58268 57.6787 6.58268 39.4993ZM45.8317 48.1374C45.6654 47.7399 45.4218 47.3794 45.1149 47.0768L37.4552 39.4829L45.0853 31.922C45.3921 31.6194 45.6358 31.2589 45.8021 30.8613C45.9684 30.4638 46.054 30.0372 46.054 29.6063C46.054 29.1754 45.9684 28.7487 45.8021 28.3512C45.6358 27.9537 45.3921 27.5931 45.0853 27.2906C44.463 26.6755 43.6232 26.3305 42.7482 26.3305C41.8732 26.3305 41.0335 26.6755 40.4111 27.2906L30.6843 36.9352C30.3479 37.2687 30.0809 37.6656 29.8987 38.1029C29.7164 38.5402 29.6226 39.0092 29.6226 39.4829C29.6226 39.9566 29.7164 40.4257 29.8987 40.863C30.0809 41.3002 30.3479 41.6971 30.6843 42.0307L40.4441 51.7082C41.0662 52.3223 41.9053 52.6666 42.7795 52.6666C43.6537 52.6666 44.4927 52.3223 45.1149 51.7082C45.4218 51.4056 45.6654 51.0451 45.8317 50.6476C45.998 50.25 46.0836 49.8234 46.0836 49.3925C46.0836 48.9616 45.998 48.5349 45.8317 48.1374Z"
                                fill="#F0AE19"
                            />
                        </svg>
                    </button>
                </div>

                <div className="infoBox">
                    {estadoProgress === 1 && (
                        <CardCreateProject
                            nameProject = {nameProject}
                            fechaInicio={fechaInicio}
                            fechaFin={fechaFin}
                            handleChangesNombre={handleChangeProjectName}
                            handleChangesFechaInicio={handleChangesFechaInicio}
                            handleChangesFechaFin={handleChangesFechaFin}
                            projectOwnerData={datosUsuario}
                        ></CardCreateProject>
                    )}
                    {estadoProgress === 2 && (
                        <ToolCardsContext.Provider
                            value={{ addToolToList, removeToolInList }}
                        >
                            <ListTools listHerramientas={listHerramientas}></ListTools>
                        </ToolCardsContext.Provider>
                    )}
                    {estadoProgress === 3 && (
                        <ChoiceUser
                            toggleModal1={toggleModal1}
                            toggleModal2={toggleModal2}
                            selectedSupervisoresList={selectedSupervisoresList}
                            selectedMiembrosList={selectedMiembrosList}
                            removeSupervisor={removeSupervisor}
                            removeMiembro={removeMiembro}
                        ></ChoiceUser>
                    )}
                </div>
                <div className="buttonContainer">
                    <button
                        className="myButton"
                        onClick={cambiarEstadoAdelante}
                        style={{
                            opacity:
                                estadoProgress != 3 && isProjectNameFilled
                                    ? "100"
                                    : "0",
                            pointerEvents:
                                estadoProgress != 3 && isProjectNameFilled
                                    ? "auto"
                                    : "none",
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="79"
                            height="79"
                            viewBox="0 0 79 79"
                            fill="none"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M72.4173 39.5007C72.4173 57.68 57.68 72.4173 39.5007 72.4173C21.3213 72.4173 6.58398 57.68 6.58398 39.5007C6.58398 21.3213 21.3213 6.58398 39.5007 6.58398C57.68 6.58398 72.4173 21.3213 72.4173 39.5007ZM33.1683 30.8626C33.3346 31.2601 33.5782 31.6206 33.8851 31.9232L41.5448 39.5171L33.9147 47.078C33.6079 47.3806 33.3642 47.7411 33.1979 48.1387C33.0316 48.5362 32.946 48.9628 32.946 49.3937C32.946 49.8246 33.0316 50.2513 33.1979 50.6488C33.3642 51.0463 33.6079 51.4069 33.9147 51.7094C34.537 52.3245 35.3768 52.6695 36.2518 52.6695C37.1268 52.6695 37.9665 52.3245 38.5889 51.7094L48.3157 42.0648C48.6521 41.7313 48.9191 41.3344 49.1013 40.8971C49.2836 40.4598 49.3774 39.9908 49.3774 39.5171C49.3774 39.0434 49.2836 38.5743 49.1013 38.137C48.9191 37.6998 48.6521 37.3029 48.3157 36.9693L38.5559 27.2918C37.9338 26.6777 37.0947 26.3334 36.2205 26.3334C35.3463 26.3334 34.5073 26.6777 33.8851 27.2918C33.5782 27.5944 33.3346 27.9549 33.1683 28.3524C33.002 28.75 32.9164 29.1766 32.9164 29.6075C32.9164 30.0384 33.002 30.4651 33.1683 30.8626Z"
                                fill="#F0AE19"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="buttonContainerCreate">
                <button
                    className="optionalGoMove"
                    onClick={camibarEstadoAtras}
                    style={{ opacity: estadoProgress != 1 ? "100" : "0" }}
                >
                    {"<"}
                </button>
                {nameProject !== "" && (
                    <ButtonNextUI
                        className="bg-[#f0ae19] font-[Montserrat] font-medium text-white text-xl"
                        size="lg"
                        onClick={() => {
                            setIsCreatingProject(true);
                            checkData();
                        }}
                        isLoading={isCreatingProject}
                    >
                        Crear Proyecto
                    </ButtonNextUI>
                )}
                <button
                    className="optionalGoMove"
                    onClick={cambiarEstadoAdelante}
                >
                    {">"}
                </button>
            </div>

            {modal1 && (
                <ModalUser
                    handlerModalClose={toggleModal1}
                    handlerModalFinished={returnListOfSupervisores}
                    excludedUsers={[
                        ...selectedMiembrosList,
                        ...selectedSupervisoresList,
                        sessionData,
                    ]}
                ></ModalUser>
            )}
            {modal2 && (
                <ModalUser
                    handlerModalClose={toggleModal2}
                    handlerModalFinished={returnListOfMiembros}
                    excludedUsers={[
                        ...selectedMiembrosList,
                        ...selectedSupervisoresList,
                        sessionData,
                    ]}
                ></ModalUser>
            )}

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </div>
    );
}
