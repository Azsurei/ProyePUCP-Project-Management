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
import ComboBoxArrayEquipo from "@/components/equipoComps/ComboBoxArrayEquipo";
import PopUpRolModifyEquipo from "@/components/equipoComps/PopUpRolModifyEquipo";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ChoiceUser.css";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { AddIcon } from "@/components/equipoComps/AddIcon";
import { Avatar, Progress } from "@nextui-org/react";
import Link from "next/link";

axios.defaults.withCredentials = true;

export default function Equipo(props) {
    const router = useRouter();
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const [ListComps, setListComps] = useState([]);

    const [screenState, setScreenState] = useState(0);
    const [signal, setSignal] = useState(false);
    //0 es vista de equipos
    //1 es vista de un equipo particular

    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedTeamOriginales, setSelectedTeamOriginales] = useState(null);
    const [selectedTeamTareas, setSelectedTeamTareas] = useState([]);
    const [updateState, setUpdateState] = useState(false);

    const [cantNotStarted, setCantNotStarted] = useState(0);
    const [cantFinished, setCantFinished] = useState(0);

    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [reloadData, setReloadData] = useState(false);
    const [roles, setRoles] = useState([]);
    const [rolesOriginales, setRolesOriginales] = useState([]);
    const [leaderRoleId, setLeaderRoleId] = useState(null);
    const [memberRoleId, setMemberRoleId] = useState(null);

    const handleReloadData = () => {
        setReloadData(true);
    };

    const toggleModal = () => {
        handleReloadData();
        setModal(!modal);
    };

    const toggleModal2 = () => {
        setModal2(!modal2);
    };

    const handleAddRoles = (newRoles) => {
        setRoles(newRoles);
    };

    const returnListOfMiembros = (newMiembrosList) => {
        // Agrega idRol y nombreRol a cada miembro en newMiembrosList
        const membersWithRoles = newMiembrosList.map((member) => ({
            ...member,
            idRolEquipo: memberRoleId, // Establece el valor adecuado para idRol
            nombreRol: "Miembro", // Establece el valor adecuado para nombreRol
        }));

        // Concatena los nuevos miembros a selectedTeam.participantes
        const updatedMembersList =
            selectedTeam.participantes.concat(membersWithRoles);

        // Actualiza selectedTeam con la nueva lista de participantes
        setSelectedTeam({
            ...selectedTeam,
            participantes: updatedMembersList,
        });

        setModal2(!modal2);
    };

    useEffect(() => {
        if (modal) {
            document.body.style.overflow = "hidden";
            setReloadData(true);
        } else {
            document.body.style.overflow = "auto";
            setReloadData(false);
        }
    }, [modal]);

    const removeTeam = (team) => {
        const nuevoListComps = ListComps.filter((equipo) => equipo !== team);
        setListComps(nuevoListComps);
    };

    const handleSelectedValueChangeRol = (value, name, userId) => {
        // Crea una copia profunda de selectedTeam para evitar mutar el estado directamente
        const updatedSelectedTeam = {
            ...selectedTeam,
            participantes: selectedTeam.participantes.map((participant) => {
                if (participant.idUsuario === userId) {
                    // Si el usuario coincide, actualiza el idRol
                    return {
                        ...participant,
                        idRolEquipo: value, // Actualiza el idRol con el nuevo valor
                        nombreRol: name, // Actualiza el nombreRol con el nuevo valor
                    };
                }
                return participant;
            }),
        };
        console.log("EL ID DEL ROL SELECCIONADO ES:", value);
        // Actualiza el estado con el nuevo selectedTeam
        setSelectedTeam(updatedSelectedTeam);
    };

    const removeUser = (user) => {
        const selectedTeamTemporal = { ...selectedTeam }; // Crear una nueva copia del objeto
        const newList = selectedTeamTemporal.participantes.filter(
            (item) => item.idUsuario !== user.idUsuario
        );
        selectedTeamTemporal.participantes = newList;
        setSelectedTeam({ ...selectedTeamTemporal });
    };

    const fetchTeamsData = () => {
        setIsLoadingSmall(true);
        let teamsArray;
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/equipo/listarEquiposYParticipantes/" +
            projectId;
        console.log("La URL es" + stringURL);
        axios
            .get(stringURL)
            .then((response) => {
                console.log("Respuesta del servidor:", response.data);
                teamsArray = response.data.equipos;
                console.log("Los arreglos son " + JSON.stringify(teamsArray));

                for (const equipo of teamsArray) {
                    equipo.tareasNoIniciado = 0;
                    equipo.tareasFinished = 0;

                    const tareasTotales = equipo.tareas.filter(
                        (tarea) => tarea.idTareaEstado !== 4
                    ).length;
                    const tareasFinished = equipo.tareas.filter(
                        (tarea) => tarea.idTareaEstado === 4
                    ).length;
                    equipo.tareasTotales = tareasTotales;
                    equipo.tareasFinished = tareasFinished;
                    console.log(
                        "este equipo tuvo " +
                            tareasTotales +
                            " y " +
                            tareasFinished
                    );
                }

                setListComps(teamsArray);
                setSignal(true);

                console.log("ya pase");
            })
            .catch(function (error) {
                console.log("Error al cargar la lista de equipos", error);
            });
    };

    useEffect(() => {
        if (signal) {
            setIsLoadingSmall(false);
        }
    }, [signal]);

    useEffect(() => {
        fetchTeamsData();
    }, []);

    const handleSeeTeam = (team) => {
        console.log("Pase por aqui");
        setSelectedTeam(team);
        setSelectedTeamOriginales(team);
        console.log("El first selecteTeam actual es:", selectedTeam);
        console.log(
            "El first selecteTeam original es:",
            selectedTeamOriginales
        );
        setIsLoadingSmall(true);
        const verTareasURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/equipo/listarTareasDeXIdEquipo/" +
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
        axios
            .get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/equipo/listarRol/${projectId}`
            )
            .then((response) => {
                // Aquí puedes manejar la respuesta de la petición
                console.log(
                    "Respuesta de la petición de roles:",
                    response.data
                );
                setRoles(response.data.roles);
                setRolesOriginales(response.data.roles);
                // Busca el ID del líder y el miembro en la respuesta
                const roles = response.data.roles;
                const leaderRole = roles.find(
                    (role) => role.nombreRol === "Líder"
                );
                const memberRole = roles.find(
                    (role) => role.nombreRol === "Miembro"
                );

                if (leaderRole) {
                    setLeaderRoleId(leaderRole.idRolEquipo);
                }
                if (memberRole) {
                    setMemberRoleId(memberRole.idRolEquipo);
                }
            })
            .catch(function (error) {
                console.log("Error al cargar el rol del equipo: ", error);
            });
        setScreenState(1);
    };

    const checkIfMultipleLeadersExist = () => {
        // Filtra los participantes que tienen el rol de líder
        const leaderParticipants = selectedTeam.participantes.filter(
            (participant) => participant.nombreRol === "Líder"
        );

        // Verifica si tienes más de un líder
        console.log("El selectedTeam para verificar líderes es:", selectedTeam);
        console.log(
            "El lenght de leaderParticipants es:",
            leaderParticipants.length
        );
        return leaderParticipants.length > 1;
    };

    const findModifiedDeletedAdded = (
        originalArray,
        newArray,
        comparisonField
    ) => {
        const modifiedArray = [];
        const deletedArray = [];
        const addedArray = [];

        // Encuentra elementos modificados y eliminados
        originalArray.forEach((originalItem) => {
            const newItem = newArray.find(
                (newItem) =>
                    newItem[comparisonField] === originalItem[comparisonField]
            );

            if (newItem) {
                modifiedArray.push(newItem);
                /*                 if (JSON.stringify(originalItem) !== JSON.stringify(newItem)) {
                    modifiedArray.push(newItem);
                } */
            } else {
                deletedArray.push(originalItem);
            }
        });

        // Encuentra elementos añadidos
        newArray.forEach((newItem) => {
            if (
                !originalArray.some(
                    (originalItem) =>
                        originalItem[comparisonField] ===
                        newItem[comparisonField]
                )
            ) {
                addedArray.push(newItem);
            }
        });

        return { modifiedArray, deletedArray, addedArray };
    };

    const findModifiedDeletedAddedForRoles = (
        originalArray,
        newArray,
        comparisonField
    ) => {
        const modifiedArray = [];
        const deletedArray = [];
        const addedArray = [];

        originalArray.forEach((originalItem) => {
            const newItem = newArray.find(
                (newItem) =>
                    newItem[comparisonField] === originalItem[comparisonField]
            );

            if (newItem) {
                modifiedArray.push(newItem);
            } else {
                deletedArray.push(originalItem);
            }
        });

        // Encuentra elementos añadidos
        newArray.forEach((newItem) => {
            if (
                !originalArray.some(
                    (originalItem) =>
                        originalItem[comparisonField] ===
                        newItem[comparisonField]
                )
            ) {
                addedArray.push(newItem);
            }
        });

        return { modifiedArray, deletedArray, addedArray };
    };

    const separarPorRol = (arrParticipantes, arrAddedRoles) => {
        const participantesConNuevoRol = [];
        const participantesSinNuevoRol = [];

        arrParticipantes.forEach((participante) => {
            const tieneNuevoRol = arrAddedRoles.some(
                (addedRol) => addedRol.idRolEquipo === participante.idRolEquipo
            );

            if (tieneNuevoRol) {
                participantesConNuevoRol.push(participante);
            } else {
                participantesSinNuevoRol.push(participante);
            }
        });

        return { participantesConNuevoRol, participantesSinNuevoRol };
    };

    const onSubmitParticipantesRoles = () => {
        console.log("Todos los roles originales son:", rolesOriginales);
        console.log("Todos los roles que mandaré son:", roles);

        // Comparar cambios en los roles
        const {
            modifiedArray: modifiedRoles,
            deletedArray: deletedRoles,
            addedArray: addedRoles,
        } = findModifiedDeletedAddedForRoles(
            rolesOriginales,
            roles,
            "idRolEquipo"
        );

        console.log("Modified Roles:", modifiedRoles);
        console.log("Deleted Roles:", deletedRoles);
        console.log("Added Roles:", addedRoles);

        const selectedTeamOriginal = selectedTeamOriginales;
        const selectedTeamModified = selectedTeam;

        // Comparar cambios en los participantes
        const {
            modifiedArray: modifiedParticipants,
            deletedArray: deletedParticipants,
            addedArray: addedParticipants,
        } = findModifiedDeletedAdded(
            selectedTeamOriginal.participantes,
            selectedTeamModified.participantes,
            "idUsuario"
        );

        console.log(
            "Todos los participantes originales son:",
            selectedTeamOriginal.participantes
        );
        console.log(
            "Todos los participantes que mandaré son:",
            selectedTeamModified.participantes
        );

        // Resto del código para manejar las diferencias
        console.log("Modified Participants:", modifiedParticipants);
        console.log("Deleted Participants:", deletedParticipants);
        console.log("Added Participants:", addedParticipants);

        //segmentando los participantes modificados y agregados por rol
        const {
            participantesConNuevoRol: addedParticipantesNewRol,
            participantesSinNuevoRol: addedParticipantesNoRol,
        } = separarPorRol(addedParticipants, addedRoles);

        const {
            participantesConNuevoRol: modifiedParticipantesNewRol,
            participantesSinNuevoRol: modifiedParticipantesNoRol,
        } = separarPorRol(modifiedParticipants, addedRoles);

        const casoEliminarRol = {
            idProyecto: parseInt(projectId),
            idEquipo: selectedTeam.idEquipo,
            miembrosAgregados: addedParticipantesNoRol,
            miembrosModificados: modifiedParticipantesNoRol,
            miembrosEliminados: deletedParticipants,
            rolesEliminados: deletedRoles,
        };
        console.log("Realizado correctamente");
        console.log(casoEliminarRol);
        const casoAgregarRol = {
            idProyecto: parseInt(projectId),
            idEquipo: selectedTeam.idEquipo,
            miembrosAgregados: addedParticipantesNewRol,
            miembrosModificados: modifiedParticipantesNewRol,
            rolesAgregados: addedRoles,
        };
        console.log("Agregado correctamente");
        console.log(casoAgregarRol);

        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/equipo/rolEliminado",
                casoEliminarRol
            )
            .then((response) => {
                // Manejar la respuesta de la solicitud POST
                console.log("Respuesta del servidor (POST):", response.data);
                console.log("Registro correcto (POST)");
                // Realizar acciones adicionales si es necesario
            })
            .catch((error) => {
                // Manejar errores si la solicitud POST falla
                console.error("Error al realizar la solicitud POST:", error);
            });

        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/equipo/rolAgregado",
                casoAgregarRol
            )
            .then((response) => {
                // Manejar la respuesta de la solicitud POST
                console.log("Respuesta del servidor (POST2):", response.data);
                console.log("Registro correcto (POST2)");
                // Realizar acciones adicionales si es necesario
            })
            .catch((error) => {
                // Manejar errores si la solicitud POST falla
                console.error("Error al realizar la solicitud POST2:", error);
            });
    };

    async function handlerExport() {
        const simplifiedParticipants = selectedTeam.participantes.map(
            (participante) => ({
                nombres: participante.nombres,
                apellidos: participante.apellidos,
                correoElectronico: participante.correoElectronico,
                nombreRol: participante.nombreRol,
            })
        );

        //console.log("Objeto simplificado:", simplifiedParticipants);
        //console.log("El selected team es:", selectedTeam.nombre);
        //crear un nuebo objeto con el nombre del equipo y el simplifiedParticipants
        const data = {
            nombreEquipo: selectedTeam.nombre,
            participantes: simplifiedParticipants,
        };
        const formattedData = JSON.stringify(data, null, 2);
        //console.log("El data es:", formattedData);

        try {
            //setIsExportLoading(true);
            const exportURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/reporte/crearExcelListaParticipantes";

            const response = await axios.post(
                exportURL,
                {
                    participantes: simplifiedParticipants,
                },
                {
                    responseType: "blob", // Important for binary data
                }
            );
        } catch (error) {
            //setIsExportLoading(false);
            toast.error("Error al exportar tu lista de participantes en el equipo");
            console.log(error);
        }
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
                    <div className="text-[1.8rem] font-bold py-[1rem] dark:text-white">
                        Equipos
                    </div>
                    <div className="titleAndOptions">
                        <div className="subtitle dark:text-white">
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
                                    removeTeam={removeTeam}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="noTeamsMessage">
                            <h2>Empieza Ya!</h2>
                            <p className="littleMessage">
                                ¡Aún no tienes equipos en este proyecto! <br />
                                Recuerda que delegar tareas es muy importante.
                            </p>
                            <p className="wannaCreateOne">
                                ¿Quieres crear un equipo?
                            </p>
                            <div className="noTeamsButtonAddTeam">
                                <Link
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
                                </Link>
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
                            fetchTeamsData();
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
                                            color="secondary"
                                            startContent={<AddIcon />}
                                            onPress={() => toggleModal()}
                                        >
                                            Agregar rol
                                        </Button>
                                        <Button
                                            color="primary"
                                            startContent={<SaveIcon />}
                                            onPress={() => {
                                                if (
                                                    !checkIfMultipleLeadersExist()
                                                ) {
                                                    onSubmitParticipantesRoles();
                                                    setUpdateState(false);
                                                    setSelectedTeamOriginales(
                                                        selectedTeam
                                                    );
                                                    setRolesOriginales(roles);
                                                    toast.success(
                                                        "Se ha modificado exitosamente",
                                                        {
                                                            position:
                                                                "bottom-left",
                                                        }
                                                    );
                                                } else {
                                                    toast.error(
                                                        "Solo puede haber máximo un líder",
                                                        {
                                                            position:
                                                                "bottom-left",
                                                        }
                                                    );
                                                }
                                            }}
                                        >
                                            Guardar
                                        </Button>
                                        <Button
                                            color="danger"
                                            startContent={<CrossWhite />}
                                            onPress={() => {
                                                setUpdateState(false);
                                                setSelectedTeam(
                                                    selectedTeamOriginales
                                                );
                                                setRoles(rolesOriginales);
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            color="warning"
                                            startContent={<UpdateIcon />}
                                            className="text-white"
                                            onPress={() => setUpdateState(true)}
                                        >
                                            Editar
                                        </Button>
                                        <Button
                                            color="success"
                                            startContent={<ExportIcon />}
                                            className="text-white"
                                            onPress={async () => {
                                                await handlerExport();
                                            }}
                                        >
                                            Exportar
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

                            {updateState ? (
                                <>
                                    {selectedTeam.participantes.map(
                                        (member, index) => (
                                            <React.Fragment
                                                key={member.idUsuario}
                                            >
                                                <div
                                                    className="col-span-6 flex mt-4"
                                                    key={member.idUsuario}
                                                >
                                                    <Avatar
                                                        //isBordered
                                                        //as="button"
                                                        className="transition-transform w-[2.5rem] min-w-[2.5rem] h-[2.5rem] min-h-[2.5rem]"
                                                        src={member.imgLink}
                                                        fallback={
                                                            <p className="membersIcon1 bg-mainUserIcon">
                                                                {member
                                                                    .nombres[0] +
                                                                    (member.apellidos !==
                                                                    null
                                                                        ? member
                                                                              .apellidos[0]
                                                                        : "")}
                                                            </p>
                                                        }
                                                    />
                                                    <div className="ml-4">
                                                        <div className="text-lg">
                                                            {member.nombres}{" "}
                                                            {member.apellidos !==
                                                            null
                                                                ? member.apellidos
                                                                : ""}
                                                        </div>
                                                        <div>
                                                            {
                                                                member.correoElectronico
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-span-3 flex mt-4">
                                                    <ComboBoxArrayEquipo
                                                        people={roles}
                                                        onSelect={(
                                                            value,
                                                            name
                                                        ) =>
                                                            handleSelectedValueChangeRol(
                                                                value,
                                                                name,
                                                                member.idUsuario
                                                            )
                                                        }
                                                        autoSelectedValue={{
                                                            idRolEquipo:
                                                                member.idRolEquipo,
                                                            nombreRol:
                                                                member.nombreRol,
                                                        }}
                                                    />
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
                                            </React.Fragment>
                                        )
                                    )}
                                    <div className="col-span-8"></div>
                                    <Button
                                        className="bg-blue-400 text-white rounded-lg col-span-2 flex gap-2 items-center mt-8"
                                        onClick={toggleModal2}
                                    >
                                        <img
                                            src="/icons/icon-searchBar.svg"
                                            alt="icono de buscar"
                                            className="icnSearch"
                                            style={{ width: "20px" }}
                                        />
                                        <p>Buscar nuevo participante</p>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {selectedTeam.participantes.map(
                                        (member) => (
                                            <React.Fragment
                                                key={member.idUsuario}
                                            >
                                                <div className="col-span-6 flex mt-4">
                                                    <Avatar
                                                        //isBordered
                                                        //as="button"
                                                        className="transition-transform w-[2.5rem] min-w-[2.5rem] h-[2.5rem] min-h-[2.5rem]"
                                                        src={member.imgLink}
                                                        fallback={
                                                            <p className="membersIcon1 bg-mainUserIcon">
                                                                {member
                                                                    .nombres[0] +
                                                                    (member.apellidos !==
                                                                    null
                                                                        ? member
                                                                              .apellidos[0]
                                                                        : "")}
                                                            </p>
                                                        }
                                                    />
                                                    <div className="ml-4">
                                                        <div className="text-lg">
                                                            {member.nombres}{" "}
                                                            {member.apellidos !==
                                                            null
                                                                ? member.apellidos
                                                                : ""}
                                                        </div>
                                                        <div>
                                                            {
                                                                member.correoElectronico
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-span-4 flex mt-4">
                                                    {/* aca traeré la data del selectedTeam mejorado */}
                                                    {member.nombreRol}
                                                </div>
                                            </React.Fragment>
                                        )
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    {modal && (
                        <PopUpRolModifyEquipo
                            modal={modal}
                            toggle={() => toggleModal()} // Pasa la función como una función de flecha
                            handleAddRoles={handleAddRoles}
                            initialListRoles={roles}
                            ListComps={ListComps}
                        />
                    )}
                    {modal2 && (
                        <ModalUser
                            listAllUsers={false}
                            handlerModalClose={toggleModal2}
                            handlerModalFinished={returnListOfMiembros}
                            excludedUsers={selectedTeam.participantes}
                            idProyecto={projectId}
                        ></ModalUser>
                    )}
                </div>
            )}
        </div>
    );
}
