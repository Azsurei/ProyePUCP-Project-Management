"use client";
import React from "react";
import TextInfoCard from "@/components/dashboardComps/projectComps/appConstComps/TextInfoCard";
import CardEquipo from "@/components/equipoComps/CardEquipo";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
import ProgressBar from "@/components/equipoComps/ProgressBar";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { useState, useEffect, useContext } from "react";
import { SmallLoadingScreen } from "../layout";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import axios from "axios";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import { Button } from "@nextui-org/react";
import { CrossWhite } from "@/components/equipoComps/CrossWhite";
import { SaveIcon } from "@/components/equipoComps/SaveIcon";
import { ExportIcon } from "@/components/equipoComps/ExportIcon";
import { UpdateIcon } from "@/components/equipoComps/UpdateIcon";
import CardTarea from "@/components/equipoComps/CardTarea";

axios.defaults.withCredentials = true;

export default function Equipo(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    //setIsLoadingSmall(false);
    const [ListComps, setListComps] = useState([]);

    const [screenState, setScreenState] = useState(0);
    //0 es vista de equipos
    //1 es vista de un equipo particular

    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedTeamTareas, setSelectedTeamTareas] = useState([]);
    const [updateState, setUpdateState] = useState(false);

    const [cantNotStarted, setCantNotStarted] = useState(0);
    const [cantFinished, setCantFinished] = useState(0);

    const removeUser = (user) => {
        const newList = selectedTeam.participantes.filter(
            (item) => item.idUsuario !== user.idUsuario
        );
        selectedTeam.participantes = newList;
        setSelectedTeam({ ...selectedTeam });
    };

    useEffect(() => {
        setIsLoadingSmall(true);
        let teamsArray;
        const stringURL =
            "http://localhost:8080/api/proyecto/equipo/listarEquiposYParticipantes/" +
            projectId;
        console.log("La URL es" + stringURL);
        axios
            .get(stringURL)

            .then((response) => {
                console.log("Respuesta del servidor:", response.data);
                teamsArray = response.data.equipos;
                console.log("Los arreglos son " + JSON.stringify(teamsArray));
                setListComps(teamsArray);
                setIsLoadingSmall(false);
            })

            .catch(function (error) {
                console.log("Error al cargar la lista de equipos", error);
            });
    }, []);

    const handleSeeTeam = (team) => {
        setSelectedTeam(team);
        setIsLoadingSmall(true);
        const verTareasURL =
            "http://localhost:8080/api/proyecto/equipo/listarTareasDeXIdEquipo/" +
            team.idEquipo;
        axios
            .get(verTareasURL)
            .then((response) => {
                console.log(response.data.message);
                console.log(response.data.tareasEquipo);
                setSelectedTeamTareas(response.data.tareasEquipo);
                const tareasNoIniciado = response.data.tareasEquipo.filter(
                    (tarea) => tarea.idTareaEstado === 1
                ).length;
                const tareasFinished = response.data.tareasEquipo.filter(
                    (tarea) => tarea.idTareaEstado === 4
                ).length;
                setCantNotStarted(tareasNoIniciado);
                setCantFinished(tareasFinished);
                setIsLoadingSmall(false);
            })

            .catch(function (error) {
                console.log(
                    "Error al cargar la lista de tareas del equipo: ",
                    error
                );
            });

        setScreenState(1);
    };

    return (
        <div className="containerTeamsPage">
            {screenState === 0 && (
                <>
                    <div className="header">
                        <Breadcrumbs>
                            <BreadcrumbsItem href="/" text="Inicio" />
                            <BreadcrumbsItem
                                href="/dashboard"
                                text="Proyectos"
                            />
                            <BreadcrumbsItem
                                href="/dashboard/Proyectos"
                                text={projectName}
                            />
                            <BreadcrumbsItem
                                href="/dashboard/Proyectos/"
                                text="Equipos"
                            />
                        </Breadcrumbs>
                    </div>
                    <div className="title">Equipos</div>
                    <div className="titleAndOptions">
                        <div className="subtitle">
                            Divide tu trabajo en los equipos que consideres
                            necesarios
                        </div>
                        {ListComps.length > 0 && (
                            <div className="buttonAddTeam">
                                <a
                                    href={
                                        "/dashboard/" +
                                        projectName +
                                        "=" +
                                        projectId +
                                        "/Equipo/nuevo_equipo"
                                    }
                                >
                                    <button className="addTeambtn">
                                        Crear Equipo
                                    </button>
                                </a>
                            </div>
                        )}
                    </div>
                    {ListComps.length > 0 ? (
                        <div className="containerEquiposCards">
                            {ListComps.map((team) => (
                                <CardEquipo
                                    key={team.idEquipo}
                                    team={team}
                                    handleSeeTeam={handleSeeTeam}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="noTeamsMessage">
                            <h2>¡Vaya!</h2>
                            <p className="littleMessage">
                                ¡Aún no tienes equipos en este proyecto! <br />
                                Recuerda que delegar tareas es muy importante.
                            </p>
                            <p className="wannaCreateOne">
                                ¿Quieres crear un equipo?
                            </p>
                            <div className="noTeamsButtonAddTeam">
                                <a
                                    href={
                                        "/dashboard/" +
                                        projectName +
                                        "=" +
                                        projectId +
                                        "/Equipo/nuevo_equipo"
                                    }
                                >
                                    <button className="addTeambtn">
                                        Crear Equipo
                                    </button>
                                </a>
                            </div>
                        </div>
                    )}
                </>
            )}
            {screenState === 1 && (
                <div>
                    <HeaderWithButtonsSamePage
                        haveReturn={true}
                        haveAddNew={false}
                        handlerReturn={() => {
                            setScreenState(0);
                        }}
                        //newPrimarySon={ListComps.length + 1}
                        breadcrump={
                            "Inicio / Proyectos / " + projectName + " / Equipos"
                        }
                        btnText={"Nueva tarea"}
                    >
                        {selectedTeam.nombre}
                    </HeaderWithButtonsSamePage>

                    <div className="containerTareasEquipo">
                        <div className="flex justify-between">
                            <div className="headerGroup">Tareas</div>
                            <Button
                                color="warning"
                                //startContent={<SaveIcon />}
                                //onPress={() => setUpdateState(false)}
                                className="text-white h-9"
                            >
                                Añadir tarea
                            </Button>
                        </div>

                        <div className="tareasContainer">
                            <div className="leftTareasSection">
                                <div className="flex">
                                    <div className="w-[40%] border-b-2 border-gray-300">
                                        Nombre de tarea
                                    </div>
                                    <div className="w-[30%] border-b-2 border-gray-300">
                                        Fecha fin
                                    </div>
                                    <div className="w-[30%] border-b-2 border-gray-300">
                                        Encargado
                                    </div>
                                </div>

                                {selectedTeamTareas.map((tarea) => (
                                    <CardTarea
                                        key={tarea.idTarea}
                                        tarea={tarea}
                                    ></CardTarea>
                                ))}
                            </div>
                            <div className="rightTareasSection">
                                <div className="containerNumeroIndicadorAmarillo">
                                    <p className="bigNumberTareas">
                                        {cantNotStarted}
                                    </p>
                                    <p className="smallLblTareas">
                                        {cantNotStarted > 1
                                            ? "Tareas asignadas pendientes"
                                            : "Tarea asignada pendiente"}
                                    </p>
                                </div>
                                <div className="containerNumeroIndicadorVerde">
                                    <p className="bigNumberTareas">
                                        {cantFinished}
                                    </p>
                                    <p className="smallLblTareas">
                                        {cantFinished > 1
                                            ? "Tareas asignadas terminadas"
                                            : "Tarea asignada terminada"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="containerMembers">
                        <div className="flex items-center justify-between">
                            <div className="headerGroup">
                                {`Miembros (${selectedTeam.participantes.length})`}
                            </div>
                            <div className="flex gap-4 items-center mb-4">
                                {updateState ? (
                                    <>
                                        <Button
                                            color="primary"
                                            startContent={<SaveIcon />}
                                            onPress={() =>
                                                setUpdateState(false)
                                            }
                                        >
                                            Guardar
                                        </Button>
                                        <Button
                                            color="danger"
                                            startContent={<CrossWhite />}
                                            onPress={() =>
                                                setUpdateState(false)
                                            }
                                        >
                                            Cancelar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            color="success"
                                            startContent={<ExportIcon />}
                                            className="text-white"
                                        >
                                            Exportar
                                        </Button>
                                        <Button
                                            color="warning"
                                            startContent={<UpdateIcon />}
                                            className="text-white"
                                            onPress={() => setUpdateState(true)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            color="danger"
                                            startContent={<CrossWhite />}
                                        >
                                            Eliminar
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-10">
                            <div className="col-span-6 font-bold border-b-2 border-gray-300">
                                Nombre
                            </div>
                            {updateState ? (
                                <>
                                    <div className="col-span-3 font-bold border-b-2 border-gray-300">
                                        Rol
                                    </div>
                                    <div className="col-span-1 font-bold border-b-2 border-gray-300 text-center">
                                        Eliminar
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="col-span-4 font-bold border-b-2 border-gray-300">
                                        Rol
                                    </div>
                                </>
                            )}

                            {selectedTeam.participantes.map((member) => (
                                //falta un key aqui
                                <>
                                    <div
                                        className="col-span-6 flex mt-4"
                                        key={member.idUsuario}
                                    >
                                        <p className="membersIcon1">
                                            {member.nombres[0] +
                                                member.apellidos[0]}
                                        </p>
                                        <div>
                                            <div className="text-lg">
                                                {member.nombres}{" "}
                                                {member.apellidos}
                                            </div>
                                            <div>
                                                {member.correoElectronico}
                                            </div>
                                        </div>
                                    </div>
                                    {updateState ? (
                                        <>
                                            <div className="col-span-3 flex mt-4">
                                                Miembro
                                            </div>
                                            <div className="col-span-1 flex mt-4 justify-center">
                                                <img
                                                    src="/icons/icon-trash.svg"
                                                    alt="delete"
                                                    className="mb-4 cursor-pointer "
                                                    onClick={() => {
                                                        removeUser(member);
                                                    }}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="col-span-4 flex mt-4">
                                            Miembro
                                        </div>
                                    )}
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
