"use client";
import NormalInput from "@/components/NormalInput";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import AgendaTable from "@/components/dashboardComps/projectComps/cronogramaComps/AgendaTable";
import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/cronogramaPage.css";
import { useContext, useEffect, useState } from "react";
import DateInput from "@/components/DateInput";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import CardSelectedUser from "@/components/CardSelectedUser";
import {
    Avatar,
    Checkbox,
    CheckboxGroup,
    Chip,
    Input,
    Select,
    SelectItem,
    Spinner,
    Tab,
    Tabs,
    Textarea,
} from "@nextui-org/react";

import { Button, useDisclosure } from "@nextui-org/react";
import { Toaster, toast } from "sonner";

import axios from "axios";
import { HerramientasInfo, SmallLoadingScreen } from "../layout";
import BtnToModal from "@/components/BtnToModal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ModalUsersOne from "@/components/ModalUsersOne";
import { resolve } from "styled-jsx/css";
import ListTareas from "@/components/dashboardComps/projectComps/cronogramaComps/ListTareas";
import ModalSubequipos from "@/components/dashboardComps/projectComps/cronogramaComps/ModalSubequipos";
import ModalDeleteTarea from "@/components/dashboardComps/projectComps/cronogramaComps/ModalDeleteTarea";
import ModalPosterior from "@/components/dashboardComps/projectComps/cronogramaComps/ModalPosterior";
import { UpdateIcon } from "@/components/equipoComps/UpdateIcon";
import {
    dbDateToDisplayDate,
    dbDateToInputDate,
    inputDateToDisplayDate,
} from "@/common/dateFunctions";
import CrossIcon from "@/components/dashboardComps/projectComps/cronogramaComps/CrossIcon";
import ModalRegisterProgress from "@/components/dashboardComps/projectComps/cronogramaComps/ModalRegisterProgress";
import { NotificationsContext, SessionContext } from "../../layout";
import Link from "next/link";
import { SearchIcon } from "public/icons/SearchIcon";
import { saveAs } from "file-saver";
import ListAdditionalFields, {
    AsyncRegisterAdditionalFields,
    registerAdditionalFields,
} from "@/components/ListAdditionalFields";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import EmptyBoxIcon from "@/components/EmptyBoxIcon";
import TemplatesAdditionalFields from "@/components/TemplatesAdditionalFields";
axios.defaults.withCredentials = true;

function TrashIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
        </svg>
    );
}

function InfoIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
        </svg>
    );
}

export default function Cronograma(props) {
    const searchParams = useSearchParams();
    const search = searchParams.get("search");

    const { herramientasInfo } = useContext(HerramientasInfo);
    const { sessionData } = useContext(SessionContext);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { sendNotification, accessEdition, exitEdition } =
        useContext(NotificationsContext);

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const router = useRouter();

    const dropBoxItems = [
        {
            id: 1,
            itemKey: "1",
            texto: "No iniciado",
            color: "default",
        },
        {
            id: 2,
            itemKey: "2",
            texto: "En progreso",
            color: "primary",
        },
        {
            id: 3,
            itemKey: "3",
            texto: "Atrasado",
            color: "danger",
        },
        {
            id: 4,
            itemKey: "4",
            texto: "Finalizado",
            color: "success",
        },
    ];

    const [listEntregables, setListEntregables] = useState([]);
    const [validEntregable, setValidEntregable] = useState(true);

    const colorDropbox = ["default", "primary", "danger", "success"];

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {
        isOpen: isModalSubEOpen,
        onOpen: onModalSubEOpen,
        onOpenChange: onModalSubEOpenChange,
    } = useDisclosure();

    const {
        isOpen: isModalDeleteOpen,
        onOpen: onModalDeleteOpen,
        onOpenChange: onModalDeleteChange,
    } = useDisclosure();

    const {
        isOpen: isModalPosteriorOpen,
        onOpen: onModalPosteriorOpen,
        onOpenChange: onModalPosteriorChange,
    } = useDisclosure();

    const {
        isOpen: isModalRegisterProgressOpen,
        onOpen: onModalRegisterProgressOpen,
        onOpenChange: onModalRegisterProgressChange,
    } = useDisclosure();

    const [toggleNew, setToggleNew] = useState(false);

    //States from firstTimeModal
    const [firstFechaInicio, setFirstFechaInicio] = useState("");
    const [firstFechaFin, setFirstFechaFin] = useState("");

    //States from Cronograma
    const [cronogramaId, setCronogramaId] = useState(null);

    //States from Tareas table
    const [listTareas, setListTareas] = useState([]);

    const [tareaEliminar, setTareaEliminar] = useState(null);
    const [tareaPadre, setTareaPadre] = useState(null);

    const [tareaName, setTareaName] = useState("");
    const [validName, setValidName] = useState(true);

    const [tareaHorasAsignadas, setTareaHorasAsignadas] = useState(0);
    const [validHorasAsignadas, setValidHorasAsignadas] = useState(true);

    const [tareaDescripcion, setTareaDescripcion] = useState("");
    const [validDescripcion, setValidDescripcion] = useState(true);

    const [tareaEstado, setTareaEstado] = useState(["1"]);
    const [tareaEntregable, setTareaEntregable] = useState(new Set([]));

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [validFechas, setValidFechas] = useState(true);

    const [listPosteriores, setListPosteriores] = useState([]); //mandamos a insertar
    const [listPosterioresOriginal, setListPosterioresOriginal] = useState([]); //mandamos a eliminar

    const [tabSelected, setTabSelected] = useState("users");
    const [modal, setModal] = useState(false);

    //para definir estado de segunda pantalla
    const [stateSecond, setStateSecond] = useState(0);
    //1 sera para nueva tarea
    //2 para visualizar una tarea
    //3 para editar una tarea
    //4 si es que esta agregando una tarea hija
    const [isEditable, setIsEditable] = useState(false);
    const [idTareaToEdit, setIdTareaToEdit] = useState(null);

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedUsersOriginal, setSelectedUsersOriginal] = useState([]);
    const [selectedSubteam, setSelectedSubteam] = useState(null);
    const [validAsigned, setValidAsigned] = useState(true);

    //const [selectedSubteamUsers, setSelectedSubteamUsers] = useState([]);
    const [validSelectedSubteamUsers, setValidSelectedSubteamUsers] =
        useState(true);

    const [taskAdditionalFields, setTaskAdditionalFields] = useState([]);

    const [dependencies, setDependencies] = useState([]);
    const [listTareasHijas, setListTareasHijas] = useState([]);

    const twStyle1 = "font-medium text-lg text-mainHeaders";

    const handlerGoToNew = () => {
        //limpiamos data por si acaso
        setTareaPadre(null);
        setTareaName("");
        setTareaHorasAsignadas(0);
        setTareaDescripcion("");
        setTareaEstado(1);

        setFechaInicio("");
        setFechaFin("");

        setTareaEntregable(new Set([]));

        setListPosteriores([]);

        setSelectedSubteam(null);
        setSelectedUsers([]);
        setTabSelected("users");

        setDependencies([]);
        setTaskAdditionalFields([]);
        setListTareasHijas([]);

        setValidName(true);
        setValidDescripcion(true);
        setValidFechas(true);
        setValidAsigned(true);
        setValidSelectedSubteamUsers(true);

        setStateSecond(1);
        setToggleNew(true);
    };

    const handleVerDetalle = (tarea) => {
        console.log("ASIGNANDO ID A EDITAR COMO " + tarea.idTarea);
        setIdTareaToEdit(tarea.idTarea);
        //toma una tarea, deberemos setear el estado de la pantalla en todo no editable y con los nuevos valores
        setTareaPadre(tarea.idPadre);
        setTareaName(tarea.sumillaTarea);
        setTareaHorasAsignadas(tarea.horasPlaneadas);
        setTareaDescripcion(tarea.descripcion);

        setTareaEstado(tarea.idTareaEstado);
        console.log("El estado de la tarea es " + tarea.idTareaEstado);

        setFechaInicio(dbDateToInputDate(tarea.fechaInicio));
        setFechaFin(dbDateToInputDate(tarea.fechaFin));

        if (tarea.idEntregable === null) {
            setTareaEntregable(new Set([]));
        } else {
            setTareaEntregable(new Set([tarea.idEntregable.toString()]));
        }

        setListPosteriores(tarea.tareasPosteriores);
        setListPosterioresOriginal(tarea.tareasPosteriores);
        for (const task of tarea.tareasPosteriores) {
            task.fechaFin = dbDateToInputDate(task.fechaFin);
        }

        if (tarea.idEquipo === null) {
            setSelectedUsers(tarea.usuarios);
            setSelectedUsersOriginal(tarea.usuarios);
            setSelectedSubteam(null);
            //setSelectedSubteamUsers([]);
            setTabSelected("users");
        } else {
            setSelectedSubteam(tarea.equipo);
            setSelectedUsers([]);
            setSelectedUsersOriginal([]);

            let newUsrLst = [];
            for (const user of tarea.usuarios) {
                newUsrLst.push(user.idUsuario);
            }
            //setSelectedSubteamUsers(newUsrLst);
            setValidSelectedSubteamUsers(true);

            setTabSelected("subteams");
        }

        setDependencies(tarea.dependencias);
        setListTareasHijas(tarea.tareasHijas);
        setTaskAdditionalFields(tarea.camposAdicionales);

        setValidName(true);
        setValidDescripcion(true);
        setValidFechas(true);
        setValidAsigned(true);
        setValidSelectedSubteamUsers(true);

        setStateSecond(2);
        setToggleNew(true);
    };

    const handleAddNewSon = (tareaPadre) => {
        if (tareaPadre.porcentajeProgreso === 100) {
            toast.info("Esta tarea ya fue completada", {
                position: "top-center",
            });
            return;
        }

        setTareaPadre(tareaPadre);
        setTareaName("");
        setTareaHorasAsignadas(0);
        setTareaDescripcion("");
        setTareaEstado(1);

        setFechaInicio("");
        setFechaFin("");
        setTareaEntregable(new Set([]));

        setListPosteriores([]);

        setSelectedSubteam(null);
        setSelectedUsers([]);
        setSelectedUsersOriginal([]);
        setTabSelected("users");

        setDependencies([]);
        setListTareasHijas([]);
        setTaskAdditionalFields([]);

        setValidName(true);
        setValidDescripcion(true);
        setValidFechas(true);
        setValidAsigned(true);
        setValidSelectedSubteamUsers(true);

        setStateSecond(4);
        setToggleNew(true);
    };

    const [currentTaskToProgress, setCurrentTaskToProgress] = useState(null);

    const handleRegisterProgress = (tarea) => {
        //verificacion en caso sea tarea padre

        //verificar si el usuario que esta registrando la tarea pertenece a dicha tarea (en los usuarios de la misma)
        //if(sessionData.idUsuario)
        console.log("DATOS DE TAREA " + JSON.stringify(tarea, null, 2));

        if (tarea.porcentajeProgreso === 100) {
            toast.info("Esta tarea ya fue completada", {
                position: "top-center",
            });
            return;
        }

        if (tarea.equipo !== null) {
            let flagUserBelongsToTeam = 0;
            for (const usuarios of tarea.equipo.participantes) {
                if (usuarios.idUsuario === sessionData.idUsuario) {
                    flagUserBelongsToTask = 1;
                }
            }
            if (flagUserBelongsToTeam === 1) {
                console.log("abriendo modal");
                setCurrentTaskToProgress(tarea);
                onModalRegisterProgressOpen();
            } else {
                toast.error("Usted no pertenece al equipo asignado", {
                    position: "top-center",
                });
            }
        } else {
            let flagUserBelongsToTask = 0;
            for (const usuarios of tarea.usuarios) {
                if (usuarios.idUsuario === sessionData.idUsuario) {
                    flagUserBelongsToTask = 1;
                }
            }

            if (flagUserBelongsToTask === 1) {
                console.log("abriendo modal");
                setCurrentTaskToProgress(tarea);
                onModalRegisterProgressOpen();
            } else {
                toast.error("Usted no esta asignado a esta tarea", {
                    position: "top-center",
                });
            }
        }
    };

    async function refreshListTareas() {
        console.log("ENTRO AL REFRESH");
        const tareasURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/cronograma/listarTareasXidProyecto/" +
            projectId;
        await axios
            .get(tareasURL)
            .then(function (response) {
                console.log(response);
                setListTareas(response.data.tareasOrdenadas);
                console.log(response.data.tareasOrdenadas);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleEdit = (tarea) => {
        accessEdition(tarea.idTarea, 4, sessionData, () => {
            console.log(JSON.stringify(tarea.idTareaEstado));
            console.log("ASIGNANDO ID A EDITAR COMO " + tarea.idTarea);
            setIdTareaToEdit(tarea.idTarea);
            setTareaPadre(tarea.idPadre);
            setTareaName(tarea.sumillaTarea);
            setTareaHorasAsignadas(tarea.horasPlaneadas);
            setTareaDescripcion(tarea.descripcion);

            // setTareaEstado([String(tarea.idTareaEstado)]);
            // console.log(
            //     "seteando al idTareaEstado = " +
            //         tarea.idTareaEstado +
            //         " / " +
            //         String(tarea.idTareaEstado)
            // );
            setTareaEstado(tarea.idTareaEstado);

            console.log("ESTA ES LA FECHA INICIO : " + tarea.fechaInicio);
            console.log("ESTA ES LA FECHA FIN : " + tarea.fechaFin);

            setFechaInicio(dbDateToInputDate(tarea.fechaInicio));
            setFechaFin(dbDateToInputDate(tarea.fechaFin));

            console.log("TRAYENDO TAREA CON ENTREGABLE " + tarea.idEntregable);
            if (tarea.idEntregable === null) {
                setTareaEntregable(new Set([]));
            } else {
                setTareaEntregable(new Set([tarea.idEntregable.toString()]));
            }

            setListPosteriores(tarea.tareasPosteriores);
            setListPosterioresOriginal(tarea.tareasPosteriores);
            for (const task of tarea.tareasPosteriores) {
                task.fechaFin = dbDateToInputDate(task.fechaFin);
            }

            if (tarea.idEquipo === null) {
                setSelectedUsers(tarea.usuarios);
                setSelectedUsersOriginal(tarea.usuarios);
                setSelectedSubteam(null);
                //setSelectedSubteamUsers([]);
                setTabSelected("users");
            } else {
                setSelectedSubteam(tarea.equipo);
                setSelectedUsers([]);
                setSelectedUsersOriginal([]);

                let newUsrLst = [];
                for (const user of tarea.usuarios) {
                    newUsrLst.push(user.idUsuario);
                }
                //setSelectedSubteamUsers(newUsrLst);
                setValidSelectedSubteamUsers(true);

                setTabSelected("subteams");
            }

            setDependencies(tarea.dependencias);
            setListTareasHijas(tarea.tareasHijas);
            setTaskAdditionalFields(tarea.camposAdicionales);

            setValidName(true);
            setValidDescripcion(true);
            setValidFechas(true);
            setValidAsigned(true);
            setValidSelectedSubteamUsers(true);
            setValidEntregable(true);

            setStateSecond(3);
            setToggleNew(true);
        });

        // console.log("ASIGNANDO ID A EDITAR COMO " + tarea.idTarea);
        // setIdTareaToEdit(tarea.idTarea);
        // setTareaPadre(tarea.idPadre);
        // setTareaName(tarea.sumillaTarea);
        // setTareaDescripcion(tarea.descripcion);

        // setTareaEstado([String(tarea.idTareaEstado)]);
        // console.log(
        //     "seteando al idTareaEstado = " +
        //         tarea.idTareaEstado +
        //         " / " +
        //         String(tarea.idTareaEstado)
        // );

        // console.log("ESTA ES LA FECHA INICIO : " + tarea.fechaInicio);
        // console.log("ESTA ES LA FECHA FIN : " + tarea.fechaFin);

        // setFechaInicio(dbDateToInputDate(tarea.fechaInicio));
        // setFechaFin(dbDateToInputDate(tarea.fechaFin));

        // console.log("TRAYENDO TAREA CON ENTREGABLE " + tarea.idEntregable);
        // if (tarea.idEntregable === null) {
        //     setTareaEntregable(new Set([]));
        // } else {
        //     setTareaEntregable(new Set([tarea.idEntregable.toString()]));
        // }

        // setListPosteriores(tarea.tareasPosteriores);
        // setListPosterioresOriginal(tarea.tareasPosteriores);
        // for (const task of tarea.tareasPosteriores) {
        //     task.fechaFin = dbDateToInputDate(task.fechaFin);
        // }

        // if (tarea.idEquipo === null) {
        //     setSelectedUsers(tarea.usuarios);
        //     setSelectedUsersOriginal(tarea.usuarios);
        //     setSelectedSubteam(null);
        //     //setSelectedSubteamUsers([]);
        //     setTabSelected("users");
        // } else {
        //     setSelectedSubteam(tarea.equipo);
        //     setSelectedUsers([]);
        //     setSelectedUsersOriginal([]);

        //     let newUsrLst = [];
        //     for (const user of tarea.usuarios) {
        //         newUsrLst.push(user.idUsuario);
        //     }
        //     //setSelectedSubteamUsers(newUsrLst);
        //     setValidSelectedSubteamUsers(true);

        //     setTabSelected("subteams");
        // }

        // setTaskAdditionalFields(tarea.camposAdicionales);

        // setValidName(true);
        // setValidDescripcion(true);
        // setValidFechas(true);
        // setValidAsigned(true);
        // setValidSelectedSubteamUsers(true);
        // setValidEntregable(true);

        // setStateSecond(3);
        // setToggleNew(true);
    };

    const handleDelete = (tarea) => {
        //seteamos la taera a eliminar
        setTareaEliminar(tarea);
        //prendemos modal de confirmacion
        onModalDeleteOpen();
    };

    function promiseEliminarTarea() {
        return new Promise((resolve, reject) => {
            const deleteURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/cronograma/eliminarTarea";

            if (tareaEliminar === null) {
                reject("No se encontro la tarea");
            }

            axios
                .delete(deleteURL, {
                    data: { tarea: tareaEliminar },
                })
                .then(function (response) {
                    console.log(response.data.message);

                    //actualizamos lista de tareas
                    const tareasURL =
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                        "/api/proyecto/cronograma/listarTareasXidProyecto/" +
                        projectId;
                    axios
                        .get(tareasURL)
                        .then(function (response) {
                            console.log(response);
                            setListTareas(response.data.tareasOrdenadas);
                            console.log(response.data.tareasOrdenadas);

                            resolve(response);
                        })
                        .catch(function (error) {
                            console.log(error);
                            reject(error);
                        });
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                });
        });
    }

    const eliminarTarea = () => {
        toast.promise(promiseEliminarTarea, {
            loading: "Eliminando la tarea...",
            success: (data) => {
                return "La tarea se eliminó con exito.";
            },
            error: "Error al eliminar la tarea",
            position: "bottom-right",
        });
    };

    const returnListOfUsers = (newUsersList) => {
        const newList = [...selectedUsers, ...newUsersList];

        setSelectedUsers(newList);
        setSelectedSubteam(null);
        setModal(false);
    };

    const removeUser = (user) => {
        const newList = selectedUsers.filter(
            (item) => item.idUsuario !== user.idUsuario
        );
        setSelectedUsers(newList);
        console.log(newList);
    };

    const volverMainDashboard = () => {
        router.push("/dashboard/" + projectName + "=" + projectId);
    };

    const [isRegisterLoading, setIsRegisterLoading] = useState(false);

    async function registrarTareaModal() {
        try {
            setIsRegisterLoading(true);

            console.log("SOBRE ENTREGABLE");
            const arrayEntregable = Array.from(tareaEntregable);
            console.log(arrayEntregable);

            let idEntregable = 0;
            if (arrayEntregable.length === 0) {
                console.log("No se mando entregable, asignando sin entregable");
                idEntregable = 0;
            } else {
                console.log("Asignando entregable " + arrayEntregable[0]);
                idEntregable = parseInt(arrayEntregable[0]);
            }

            const objTareaNueva = {
                idCronograma: cronogramaId,
                idTareaEstado: 1, //No iniciado
                idSubGrupo:
                    selectedSubteam === null ? null : selectedSubteam.idEquipo,
                idPadre: tareaPadre !== null ? tareaPadre.idTarea : null,
                idTareaAnterior: null,
                idSprint: 0,
                sumillaTarea: tareaName,
                descripcion: tareaDescripcion,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                cantSubtareas: 0,
                cantPosteriores: 0,
                horasPlaneadas: tareaHorasAsignadas,
                usuarios: selectedUsers, //veriifcar posible error
                tareasPosteriores: [],
                idEntregable: idEntregable,
                idColumnaKanban: 1, //siempre empezara en no iniciado
                dependencias: dependencies,
            };
            console.log(objTareaNueva);

            const newURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/cronograma/insertarTarea";

            const response = await axios.post(newURL, objTareaNueva);

            console.log(response.data.message);
            const nuevoIdTarea = response.data.idTarea;
            console.log(JSON.stringify(taskAdditionalFields, null, 2));

            const res = await AsyncRegisterAdditionalFields(
                taskAdditionalFields,
                nuevoIdTarea,
                4,
                1,
                async (response) => {
                    console.log("respuesta tras insertar campos");
                    console.log(response);

                    const tareasURL =
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                        "/api/proyecto/cronograma/listarTareasXidProyecto/" +
                        projectId;
                    const response2 = await axios.get(tareasURL);
                    console.log(response2);
                    setListTareas(response2.data.tareasOrdenadas);
                    console.log(response2.data.tareasOrdenadas);

                    for (const usuario of selectedUsers) {
                        if (usuario.idUsuario !== sessionData.idUsuario) {
                            sendNotification(
                                usuario.idUsuario,
                                1,
                                nuevoIdTarea,
                                projectId
                            );
                            console.log(
                                "mandando notificacion a " + usuario.idUsuario
                            );
                        }
                    }

                    setIsRegisterLoading(false);
                    setToggleNew(false);
                }
            );
        } catch (e) {
            console.log(e);
            toast.error("Error al registrar la tarea");
        }
    }

    function promiseRegistrarTarea() {
        return new Promise((resolve, reject) => {
            setToggleNew(false);
            const objTareaNueva = {
                idCronograma: cronogramaId,
                idTareaEstado: 1, //No iniciado
                idSubGrupo:
                    selectedSubteam === null ? null : selectedSubteam.idEquipo,
                idPadre: tareaPadre !== null ? tareaPadre.idTarea : null,
                idTareaAnterior: null,
                idSprint: 0,
                sumillaTarea: tareaName,
                descripcion: tareaDescripcion,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                cantSubtareas: 0,
                cantPosteriores: 0,
                horasPlaneadas: tareaHorasAsignadas,
                usuarios: selectedUsers, //veriifcar posible error
                tareasPosteriores: [],
                idEntregable: parseInt(tareaEntregable.currentKey),
                idColumnaKanban: 0,
                dependencias: dependencies,
            };
            console.log(objTareaNueva);

            const newURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/cronograma/insertarTarea";
            axios
                .post(newURL, objTareaNueva)
                .then(function (response) {
                    console.log(response.data.message);
                    const nuevoIdTarea = response.data.idTarea;

                    console.log(JSON.stringify(taskAdditionalFields, null, 2));
                    registerAdditionalFields(
                        taskAdditionalFields,
                        nuevoIdTarea,
                        4,
                        1,
                        (response) => {
                            console.log("respuesta tras insertar campos");
                            console.log(response);

                            //actualizamos lista de tareas
                            console.log("se inserto correctamente?");
                            const tareasURL =
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/cronograma/listarTareasXidProyecto/" +
                                projectId;
                            axios
                                .get(tareasURL)
                                .then(function (response) {
                                    console.log(response);
                                    setListTareas(
                                        response.data.tareasOrdenadas
                                    );
                                    console.log(response.data.tareasOrdenadas);

                                    //! No es realmente necesario un await ya que solo es una notificacion, no hay problema.
                                    for (const usuario of selectedUsers) {
                                        if (
                                            usuario.idUsuario !==
                                            sessionData.idUsuario
                                        ) {
                                            sendNotification(
                                                usuario.idUsuario,
                                                1,
                                                nuevoIdTarea,
                                                projectId
                                            );
                                            console.log(
                                                "mandando notificacion a " +
                                                    usuario.idUsuario
                                            );
                                        }
                                    }
                                    resolve(response);
                                })
                                .catch(function (error) {
                                    console.log(error);
                                    reject(error);
                                });
                        }
                    );
                })
                .catch(function (error) {
                    console.log(error);
                    console.log("error!!!");
                    reject(error);
                });
        });
    }

    const registrarTarea = () => {
        console.log("entrando?");
        toast.promise(promiseRegistrarTarea, {
            loading: "Registrando tu nueva tarea...",
            success: (data) => {
                return "La tarea se creó con exito!";
            },
            error: "Error al registrar la tarea",
            position: "bottom-right",
        });
    };

    function promiseEditarTarea() {
        return new Promise((resolve, reject) => {
            setToggleNew(false);

            //sobre usuariosAgregados y usuariosEliminados
            console.log(
                "ORIGINAL === " + JSON.stringify(selectedUsersOriginal, null, 2)
            );
            console.log(
                "MODIFICADO === " + JSON.stringify(selectedUsers, null, 2)
            );

            // Identificar usuarios eliminados
            const deletedUsers = selectedUsersOriginal.filter(
                (userOriginal) => {
                    return !selectedUsers.some(
                        (userEdited) =>
                            userOriginal.idUsuario === userEdited.idUsuario
                    );
                }
            );

            // Identificar usuarios agregados
            const addedUsers = selectedUsers.filter((userEdited) => {
                return !selectedUsersOriginal.some(
                    (userOriginal) =>
                        userOriginal.idUsuario === userEdited.idUsuario
                );
            });

            //sobre tareas posteriores agregadas
            console.log(
                "LISTA DE POSTERIORES : " +
                    JSON.stringify(listPosteriores, null, 2)
            );

            console.log("SOBRE ENTREGABLE");
            const arrayEntregable = Array.from(tareaEntregable);
            console.log(arrayEntregable);

            let idEntregable = 0;
            if (arrayEntregable.length === 0) {
                console.log("No se mando entregable, asignando sin entregable");
                idEntregable = 0;
            } else {
                console.log("Asignando entregable " + arrayEntregable[0]);
                idEntregable = parseInt(arrayEntregable[0]);
            }

            const objToEdit = {
                idCronograma: cronogramaId,
                idTarea: idTareaToEdit,
                sumillaTarea: tareaName,
                descripcion: tareaDescripcion,
                //idTareaEstado: parseInt(tareaEstado[0], 10),
                idTareaEstado: tareaEstado,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                idEquipo:
                    selectedSubteam === null ? null : selectedSubteam.idEquipo,
                tareasPosterioresAgregadas: listPosteriores,
                tareasPosterioresEliminadas: listPosterioresOriginal,
                usuariosAgregados: selectedUsers, //al final se barren todos los antiguos xde, se deben agregar todos dnv
                usuariosEliminados: deletedUsers,
                idEntregable: idEntregable,
                dependencias: dependencies,
                horasAsignadas: tareaHorasAsignadas,
            };

            console.log(
                "ESTO VAMOS A EDITAR " + JSON.stringify(objToEdit, null, 2)
            );

            const editURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/cronograma/actualizarTarea";
            axios
                .put(editURL, objToEdit)
                .then(function (response) {
                    console.log(response.data.message);
                    registerAdditionalFields(
                        taskAdditionalFields,
                        idTareaToEdit,
                        4,
                        1,
                        (response) => {
                            console.log(response);

                            //actualizamos lista de tareas

                            const tareasURL =
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/cronograma/listarTareasXidProyecto/" +
                                projectId;
                            axios
                                .get(tareasURL)
                                .then(function (response) {
                                    console.log(response);
                                    setListTareas(
                                        response.data.tareasOrdenadas
                                    );
                                    console.log(response.data.tareasOrdenadas);

                                    resolve(response);
                                })
                                .catch(function (error) {
                                    console.log(error);
                                    reject(error);
                                });
                        }
                    );
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                });
        });
    }

    const editarTarea = () => {
        toast.promise(promiseEditarTarea, {
            loading: "Actualizando la tarea...",
            success: (data) => {
                return "La tarea se actualizó con exito!";
            },
            error: "Error al actualizar la tarea",
            position: "bottom-right",
        });
    };

    const addTareaPosterior = (tareaPosterior) => {
        tareaPosterior.index = listPosteriores.length + 1;
        const newLista = [...listPosteriores, tareaPosterior];
        console.log(newLista);
        setListPosteriores(newLista);
    };

    const removeTareaPosterior = (index) => {
        console.log("se esta eliminando el de index: " + index);
        const updatedList = [...listPosteriores];
        updatedList.splice(index - 1, 1); // Remove the element at the given index
        for (let i = index - 1; i < updatedList.length; i++) {
            updatedList[i].index = updatedList[i].index - 1;
        }
        console.log(updatedList);
        setListPosteriores(updatedList);
    };

    const [mustDefineDates, setMustDefineDates] = useState(false);

    const [isListLoading, setIsListLoading] = useState(false);
    useEffect(() => {
        setIsLoadingSmall(false);
        setIsListLoading(true);

        setCronogramaId(
            herramientasInfo.find((h) => h.idHerramienta === 4)
                .idHerramientaCreada
        );

        const tareasURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/cronograma/listarTareasXidProyecto/" +
            projectId;
        axios
            .get(tareasURL)
            .then(function (response) {
                setListTareas(response.data.tareasOrdenadas);
                console.log(
                    JSON.stringify(response.data.tareasOrdenadas, null, 2)
                );

                const entregablesURL =
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/cronograma/listarEntregablesXidProyecto/" +
                    projectId; //PENDIENTE REVISAR SI FUNCIONA
                axios
                    .get(entregablesURL)
                    .then(function (response) {
                        const entregablesArray = response.data.entregables.map(
                            (entregable) => {
                                return {
                                    ...entregable,
                                    idEntregableString:
                                        entregable.idEntregable.toString(),
                                };
                            }
                        );
                        const sinEntregable = {
                            idEntregable: 0,
                            idEntregableString: "0",
                            nombre: "Sin entregable asociado",
                            idComponente: 0,
                            activo: 1,
                        };
                        setListEntregables([
                            sinEntregable,
                            ...entregablesArray,
                        ]);

                        setIsListLoading(false);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const msgEmptyField = "Este campo no puede estar vacio";

    useEffect(() => {
        setValidAsigned(true);
    }, [selectedSubteam]);

    useEffect(() => {
        setValidAsigned(true);
    }, [selectedUsers]);

    // useEffect(() => {
    //     if (selectedSubteam !== null && stateSecond !== 2) {
    //         console.log("voy a setear todos true");
    //         let newUsrLst = [];
    //         for (const user of selectedSubteam.participantes) {
    //             newUsrLst.push(user.idUsuario);
    //         }
    //         setSelectedSubteamUsers(newUsrLst);
    //         setValidSelectedSubteamUsers(true);
    //     }
    // }, [selectedSubteam]);

    const [searchValue, setSearchValue] = useState(
        search !== null ? search : ""
    );
    const [isExportLoading, setIsExportLoading] = useState(false);

    async function handlerExport() {
        try {
            setIsExportLoading(true);
            const exportURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/cronograma/descargarExcelCronogramaTareas";

            const response = await axios.post(
                exportURL,
                {
                    tareas: listTareas,
                },
                {
                    responseType: "blob", // Important for binary data
                }
            );

            setTimeout(() => {
                const today = new Date();

                let day = today.getDate();
                let month = today.getMonth() + 1;
                let year = today.getFullYear();

                day = day < 10 ? "0" + day : day;
                month = month < 10 ? "0" + month : month;

                // Create the formatted date string
                let formattedDate = `${day}_${month}_${year}`;

                const fileName =
                    projectName.split(" ").join("") +
                    "_" +
                    formattedDate +
                    ".xlsx";
                console.log(fileName);
                saveAs(response.data, fileName);

                setIsExportLoading(false);
                toast.success("Se exporto el cronograma con exito");
            }, 500);
        } catch (error) {
            setIsExportLoading(false);
            toast.error("Error al exportar tu cronograma");
            console.log(error);
        }
    }

    function filterTasks(task, filterValue) {
        function findTaskAndSubtree(task) {
            // Check if the current task's name matches the filterValue
            const isMatch = task.sumillaTarea
                .toLowerCase()
                .includes(filterValue.toLowerCase());

            if (isMatch) {
                return 1;
            }

            // Recursively check subtasks
            if (task.tareasHijas && task.tareasHijas.length > 0) {
                for (const tarea of task.tareasHijas) {
                    if (findTaskAndSubtree(tarea, filterValue) === 1) {
                        return 1;
                    }
                }
                return 0;
            } else {
                return 0;
            }
        }

        if (findTaskAndSubtree(task) === 1) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <div className="cronogramaDiv bg-mainBackground">
            {true && (
                <>
                    <ModalSubequipos
                        isOpen={isModalSubEOpen}
                        onOpenChange={onModalSubEOpenChange}
                        projectId={projectId}
                        getSelectedSubteam={(sele_Subteam) => {
                            setSelectedUsers([]);
                            setSelectedSubteam(sele_Subteam);
                        }}
                    ></ModalSubequipos>

                    <ModalDeleteTarea
                        isOpen={isModalDeleteOpen}
                        onOpenChange={onModalDeleteChange}
                        eliminarTarea={eliminarTarea}
                    ></ModalDeleteTarea>

                    <ModalPosterior
                        idCronograma={cronogramaId}
                        isOpen={isModalPosteriorOpen}
                        onOpenChange={onModalPosteriorChange}
                        addTareaPosterior={addTareaPosterior}
                        startDate={fechaFin}
                        projectId={projectId}
                        dependencies={dependencies}
                        setDependencies={setDependencies}
                        setFechaInicio={setFechaInicio}
                        idTarea={idTareaToEdit === null ? 0 : idTareaToEdit}
                    ></ModalPosterior>

                    <ModalRegisterProgress
                        isOpen={isModalRegisterProgressOpen}
                        onOpenChange={onModalRegisterProgressChange}
                        tarea={currentTaskToProgress}
                        refreshListTareas={refreshListTareas}
                    ></ModalRegisterProgress>

                    <div className={toggleNew ? "divLeft closed" : "divLeft"}>
                        <div className="containerGeneralLeft">
                            <HeaderWithButtonsSamePage
                                haveReturn={false}
                                haveAddNew={true}
                                handlerAddNew={handlerGoToNew}
                                //newPrimarySon={ListComps.length + 1}
                                breadcrump={
                                    "Inicio / Proyectos / " + projectName
                                }
                                btnText={"Nueva tarea"}
                                haveExport={true}
                                isExportLoading={isExportLoading}
                                handlerExport={async () => {
                                    await handlerExport();
                                }}
                                isExportDisabled={
                                    isListLoading === true ||
                                    listTareas.length === 0
                                }
                                isAddNewDisabled={isListLoading === true}
                            >
                                Cronograma
                            </HeaderWithButtonsSamePage>

                            {isListLoading === true && (
                                <div className="flex-1 flex justify-center items-center">
                                    <Spinner size="lg" />
                                </div>
                            )}

                            {listTareas.length === 0 &&
                                isListLoading === false && (
                                    <div className="w-[100%] flex-1 flex justify-center items-center flex-col gap-3">
                                        <p className="m-0 font-medium text-xl">
                                            Tu calendario no cuenta con tareas
                                            por el momento
                                        </p>
                                        <EmptyBoxIcon
                                            width={300}
                                            height={300}
                                        />
                                        <Button
                                            className="bg-F0AE19 text-white font-medium"
                                            size="lg"
                                            onPress={handlerGoToNew}
                                        >
                                            Empieza ahora
                                        </Button>
                                    </div>
                                )}
                            {listTareas.length !== 0 &&
                                isListLoading === false && (
                                    <div className="pb-[60px]">
                                        <div className="flex flex-row">
                                            <Input
                                                isClearable
                                                className="w-full"
                                                placeholder="Buscar por nombre..."
                                                startContent={<SearchIcon />}
                                                value={searchValue}
                                                onClear={() => {
                                                    setSearchValue("");
                                                }}
                                                onValueChange={setSearchValue}
                                                variant="faded"
                                            />
                                        </div>
                                        <div
                                            className="flex flex-row py-[.4rem] px-[1rem] 
                                bg-mainSidebar rounded-xl text-sm tracking-wider 
                                items-center mt-5 mb-2 text-[#a1a1aa]"
                                        >
                                            <p className="flex-1">NOMBRE</p>
                                            <p className="w-[30%] flex justify-center">
                                                ASIGNADOS
                                            </p>
                                            <p className="w-[19.5%]">ESTADOS</p>
                                            <p className="w-[27%]">FECHAS</p>
                                        </div>
                                        <ListTareas
                                            listTareas={listTareas.filter(
                                                (tarea) =>
                                                    filterTasks(
                                                        tarea,
                                                        searchValue
                                                    )
                                            )}
                                            leftMargin={"0px"}
                                            handleVerDetalle={handleVerDetalle}
                                            handleAddNewSon={handleAddNewSon}
                                            handleRegisterProgress={
                                                handleRegisterProgress
                                            }
                                            handleEdit={handleEdit}
                                            handleDelete={handleDelete}
                                        ></ListTareas>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/*=========================================================================================*/}

                    <div className={toggleNew ? "divRight open" : "divRight"}>
                        <div className="containerGeneralRight">
                            <div className="flex flex-row items-end">
                                <HeaderWithButtonsSamePage
                                    haveReturn={
                                        stateSecond === 2 ? true : false
                                    }
                                    haveAddNew={false}
                                    handlerReturn={() => {
                                        setToggleNew(false);
                                    }}
                                    breadcrump={
                                        "Inicio / Proyectos / " +
                                        projectName +
                                        " / Cronograma"
                                    }
                                    btnText={"Nueva tarea"}
                                >
                                    {stateSecond === 1 && "Nueva tarea"}
                                    {stateSecond === 2 &&
                                        "Ver detalle de tarea"}
                                    {stateSecond === 3 && "Editar tarea"}
                                    {stateSecond === 4 && "Agregar tarea hija"}
                                </HeaderWithButtonsSamePage>

                                {stateSecond === 2 && (
                                    <Button
                                        color="primary"
                                        size="md"
                                        radius="sm"
                                        onClick={() => {
                                            accessEdition(
                                                idTareaToEdit,
                                                4,
                                                sessionData,
                                                () => {
                                                    setStateSecond(3);
                                                }
                                            );
                                        }}
                                        className="bg-F0AE19 h-[35px] mb-1 w-[115px]"
                                        startContent={<UpdateIcon />}
                                    >
                                        Editar
                                    </Button>
                                )}
                            </div>

                            {stateSecond === 4 && (
                                <p>
                                    Esta tarea sera hija de la tarea "
                                    {tareaPadre.sumillaTarea}"
                                </p>
                            )}

                            <div className="contFirstRow">
                                <div className="contNombre">
                                    <p
                                        onClick={() => {
                                            console.log(tareaEntregable);
                                        }}
                                    >
                                        Ver entregable
                                    </p>
                                    <p className={twStyle1}>Nombre de tarea</p>

                                    <Textarea
                                        variant={
                                            stateSecond === 2
                                                ? "flat"
                                                : "bordered"
                                        }
                                        readOnly={
                                            stateSecond === 2 ? true : false
                                        }
                                        aria-label="name-lbl"
                                        isInvalid={!validName}
                                        errorMessage={
                                            !validName ? msgEmptyField : ""
                                        }
                                        labelPlacement="outside"
                                        label=""
                                        placeholder="Escriba aquí"
                                        classNames={{ label: "pb-0" }}
                                        value={tareaName}
                                        onValueChange={setTareaName}
                                        minRows={1}
                                        size="sm"
                                        onChange={() => {
                                            setValidName(true);
                                        }}
                                    />
                                </div>
                                <div className="contEstado">
                                    <p className={twStyle1}>Horas asignadas</p>
                                    <Input
                                        variant={
                                            stateSecond === 2
                                                ? "flat"
                                                : "bordered"
                                        }
                                        readOnly={
                                            stateSecond === 2 ? true : false
                                        }
                                        type="number"
                                        label=""
                                        placeholder="0 horas"
                                        labelPlacement="outside"
                                        classNames={{
                                            label: "pb-0",
                                        }}
                                        value={tareaHorasAsignadas}
                                        onValueChange={setTareaHorasAsignadas}
                                    />
                                </div>
                            </div>

                            <div className="contDescripcion">
                                <p className={twStyle1}>Descripción</p>

                                <Textarea
                                    variant={
                                        stateSecond === 2 ? "flat" : "bordered"
                                    }
                                    readOnly={stateSecond === 2 ? true : false}
                                    aria-label="desc-lbl"
                                    isInvalid={!validDescripcion}
                                    errorMessage={
                                        !validDescripcion ? msgEmptyField : ""
                                    }
                                    labelPlacement="outside"
                                    placeholder="Escriba aquí"
                                    classNames={{ label: "pb-0" }}
                                    value={tareaDescripcion}
                                    onValueChange={setTareaDescripcion}
                                    minRows={4}
                                    size="sm"
                                    onChange={() => {
                                        setValidDescripcion(true);
                                    }}
                                />
                            </div>

                            <div className="containerFechas">
                                <div className="horizontalFechas">
                                    <div className="contFechaInicio">
                                        <p className={twStyle1}>
                                            Fecha de inicio
                                        </p>
                                        <DateInput
                                            value={fechaInicio}
                                            isEditable={
                                                stateSecond === 2 ? false : true
                                            }
                                            className={""}
                                            isInvalid={
                                                validFechas === true
                                                    ? false
                                                    : true
                                            }
                                            onChangeHandler={(e) => {
                                                setFechaInicio(e.target.value);
                                                setValidFechas(true);
                                            }}
                                        ></DateInput>
                                    </div>

                                    <div className="contFechaFin">
                                        <p className={twStyle1}>Fecha de fin</p>
                                        <DateInput
                                            value={fechaFin}
                                            isEditable={
                                                stateSecond === 2 ? false : true
                                            }
                                            className={""}
                                            isInvalid={
                                                validFechas === true
                                                    ? false
                                                    : true
                                            }
                                            onChangeHandler={(e) => {
                                                //verificamos que sea menor a todas las fechas de las posteriores
                                                const isEarlierThanAll =
                                                    listPosteriores.every(
                                                        (tareaPost) =>
                                                            e.target.value <
                                                            tareaPost.fechaFin
                                                    );
                                                console.log(isEarlierThanAll);
                                                if (isEarlierThanAll === true) {
                                                    setFechaFin(e.target.value);
                                                } else {
                                                    toast.error(
                                                        "La fecha no puede ser mayor a la de una tarea posterior",
                                                        {
                                                            position:
                                                                "top-center",
                                                        }
                                                    );
                                                }

                                                setValidFechas(true);
                                            }}
                                        ></DateInput>
                                    </div>
                                </div>
                                {validFechas === "isEmpty" && (
                                    <div className="flex relative flex-col gap-1.5 pt-1 px-1">
                                        <p className="text-tiny text-danger">
                                            Estos campos no pueden estar vacios
                                        </p>
                                    </div>
                                )}
                                {validFechas === "isFalse" && (
                                    <div className="flex relative flex-col gap-1.5 pt-1 px-1">
                                        <p className="text-tiny text-danger">
                                            La fecha fin no puede ser antes que
                                            la fecha inicio
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className={twStyle1}>Entregable Asociado</p>
                                <Select
                                    onClick={() => {
                                        if (listEntregables.length === 0) {
                                            toast.warning(
                                                "No cuenta con entregables en el proyecto"
                                            );
                                        }
                                    }}
                                    items={listEntregables}
                                    variant="bordered"
                                    isInvalid={!validEntregable}
                                    errorMessage={
                                        !validEntregable ? msgEmptyField : ""
                                    }
                                    isDisabled={
                                        stateSecond === 2 ? true : false
                                    }
                                    aria-label="cbo-lbl-ent"
                                    label=""
                                    placeholder="Selecciona un entregable"
                                    labelPlacement="outside"
                                    classNames={{ trigger: "h-10" }}
                                    size="md"
                                    //color={}
                                    onChange={(e) => {
                                        setValidEntregable(true);
                                    }}
                                    onSelectionChange={setTareaEntregable}
                                    selectedKeys={tareaEntregable}
                                >
                                    {listEntregables.map((items) => (
                                        <SelectItem
                                            key={items.idEntregableString}
                                            value={items.idEntregableString}
                                        >
                                            {items.nombre}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div className="containerPosteriores mt-3">
                                <div className="posterioresHeader">
                                    <p className={twStyle1}>Dependencias</p>
                                    {stateSecond !== 2 &&
                                        tareaEstado === 1 &&
                                        listTareasHijas.length === 0 && (
                                            <div
                                                className="btnToPopUp bg-mainSidebar"
                                                onClick={() => {
                                                    if (
                                                        listTareasHijas.length >
                                                            0 &&
                                                        stateSecond === 3
                                                    ) {
                                                        toast.warning(
                                                            "No puede agregar dependencias a una tarea con subtareas"
                                                        );
                                                        return;
                                                    }
                                                    onModalPosteriorOpen();
                                                }}
                                            >
                                                <p>Añadir</p>
                                            </div>
                                        )}
                                </div>
                                <p className="text-sm">
                                    Esta tarea no iniciara hasta que las
                                    dependencias finalicen
                                </p>
                                <div className="posterioresViewContainer bg-mainSidebar">
                                    {tareaEstado === 1 &&
                                        listTareasHijas.length > 0 && (
                                            <p className="noUsersMsg">
                                                Una tarea con subtareas no puede
                                                tener dependencias
                                            </p>
                                        )}
                                    {tareaEstado !== 1 && (
                                        <p className="noUsersMsg">
                                            Esta tarea ya inicio, no tiene
                                            dependencias
                                        </p>
                                    )}
                                    {dependencies.length === 0 &&
                                        (tareaEstado === 1 &&
                                        listTareasHijas.length === 0 ? (
                                            <p className="noUsersMsg">
                                                No ha agregado dependencias
                                            </p>
                                        ) : null)}
                                    {tareaEstado === 1 &&
                                        dependencies.map((task) => {
                                            return (
                                                <div
                                                    className={
                                                        "border-2 dark:border-gray-500 bg-white dark:bg-black rounded-md flex flex-row p-3 items-center gap-1 w-full"
                                                    }
                                                    key={task.idTarea}
                                                >
                                                    <div className="flex flex-col gap-1 w-1/2 overflow-hidden">
                                                        <div className="flex flex-row gap-1">
                                                            <p className="truncate text-lg">
                                                                {
                                                                    task.sumillaTarea
                                                                }
                                                            </p>
                                                            <Chip
                                                                variant="flat"
                                                                color={
                                                                    task.colorTareaEstado
                                                                }
                                                            >
                                                                {
                                                                    task.nombreTareaEstado
                                                                }
                                                            </Chip>
                                                        </div>
                                                        <p className="pl-2">
                                                            <span className="font-medium">
                                                                Descripcion:{" "}
                                                            </span>
                                                            {task.descripcion}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col items-start flex-1">
                                                        <div className="flex flex-col items-center">
                                                            <p className="font-medium">
                                                                Fecha de fin
                                                            </p>
                                                            <p className="text-lg">
                                                                {dbDateToDisplayDate(
                                                                    task.fechaFin
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="stroke-gray-400 hover:stroke-white rounded-lg hover:bg-red-500 p-1 cursor-pointer mr-2"
                                                        onClick={() => {
                                                            console.log(
                                                                "eliminando tarea con id: " +
                                                                    task.idTarea
                                                            );
                                                            setDependencies(
                                                                dependencies.filter(
                                                                    (tarea) =>
                                                                        tarea.idTarea !==
                                                                        task.idTarea
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        <TrashIcon />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>

                            {tareaEstado === 1 && dependencies.length !== 0 ? (
                                <div className=" flex justify-center gap-1 mt-2 text-warning">
                                    <InfoIcon />
                                    <p>
                                        Al tener dependencias esta tarea ya no
                                        tendra una fecha de inicio
                                    </p>
                                </div>
                            ) : null}

                            <p
                                className={twStyle1}
                                style={{ paddingTop: ".7rem" }}
                            >
                                Asigna miembros a tu tarea
                            </p>
                            <div className="containerTab">
                                <div className="flex flex-wrap gap-4">
                                    <Tabs
                                        isDisabled={
                                            stateSecond === 2 ? true : false
                                        }
                                        color={"primary"}
                                        aria-label="Tabs colors"
                                        radius="full"
                                        classNames={{
                                            cursor: "w-full bg-[#F0AE19]",
                                        }}
                                        selectedKey={tabSelected}
                                        onSelectionChange={setTabSelected}
                                    >
                                        <Tab key="users" title="Usuarios" />
                                        <Tab
                                            key="subteams"
                                            title="Subequipos"
                                        />
                                    </Tabs>
                                </div>

                                {tabSelected === "users"
                                    ? stateSecond !== 2 && (
                                          <div
                                              className="btnToPopUp bg-mainSidebar"
                                              onClick={() => {
                                                  setModal(true);
                                              }}
                                          >
                                              <p>Buscar un miembro</p>
                                              <img
                                                  src="/icons/icon-searchBar.svg"
                                                  alt=""
                                                  className="icnSearch"
                                              />
                                          </div>
                                      )
                                    : stateSecond !== 2 && (
                                          <div
                                              className="btnToPopUp bg-mainSidebar"
                                              onClick={onModalSubEOpen}
                                          >
                                              <p>Buscar un subequipo</p>
                                              <img
                                                  src="/icons/icon-searchBar.svg"
                                                  alt=""
                                                  className="icnSearch"
                                              />
                                          </div>
                                      )}
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <ul
                                    className={
                                        validAsigned === true &&
                                        validSelectedSubteamUsers === true
                                            ? "contUsers bg-mainSidebar"
                                            : "contUsers invalid bg-mainSidebar"
                                    }
                                >
                                    {tabSelected === "users" ? (
                                        selectedUsers.length !== 0 ? (
                                            selectedUsers.map((component) => (
                                                <CardSelectedUser
                                                    key={component.idUsuario}
                                                    isEditable={
                                                        stateSecond === 2
                                                            ? false
                                                            : true
                                                    }
                                                    usuarioObject={component}
                                                    removeHandler={removeUser}
                                                ></CardSelectedUser>
                                            ))
                                        ) : (
                                            <p className="noUsersMsg">
                                                No ha seleccionado ningun
                                                usuario
                                            </p>
                                        )
                                    ) : selectedSubteam !== null ? (
                                        <div className="cardSubteam bg-mainBackground">
                                            <div className="cardSubteam_Header">
                                                <div className="flex gap-[1rem]">
                                                    <div className="cardLeftSide">
                                                        <img src="/icons/sideBarDropDown_icons/sbdd14.svg"></img>
                                                        <p
                                                            style={{
                                                                fontFamily:
                                                                    "Roboto",
                                                            }}
                                                            className="text-mainHeaders"
                                                        >
                                                            {
                                                                selectedSubteam.nombre
                                                            }
                                                        </p>
                                                    </div>

                                                    {/* {stateSecond !== 2 && (
                                                    <div className="flex items-center">
                                                        <div
                                                            className="membersSelectAll"
                                                            onClick={() => {
                                                                let newUsrLst = [];
                                                                for (const user of selectedSubteam.participantes) {
                                                                    newUsrLst.push(
                                                                        user.idUsuario
                                                                    );
                                                                }
                                                                setSelectedSubteamUsers(
                                                                    newUsrLst
                                                                );
                                                                setValidSelectedSubteamUsers(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            Seleccionar todos
                                                        </div>
                                                    </div>
                                                )} */}
                                                </div>

                                                {stateSecond !== 2 && (
                                                    <img
                                                        src="/icons/icon-crossBlack.svg"
                                                        onClick={() => {
                                                            setSelectedSubteam(
                                                                null
                                                            );
                                                            //setSelectedSubteamUsers([]);
                                                        }}
                                                    ></img>
                                                )}
                                            </div>

                                            {/* <div className="SubTeamUsersContainerSelected"> */}
                                            {/* <CheckboxGroup
                                            isDisabled={
                                                stateSecond === 2 ? true : false
                                            }
                                            color={
                                                stateSecond === 2
                                                    ? "default"
                                                    : "primary"
                                            }
                                            value={selectedSubteamUsers}
                                            onChange={setSelectedSubteamUsers}
                                            orientation="horizontal"
                                            classNames={{
                                                base: "pl-[1.6rem]",
                                                wrapper: "gap-[1.8rem] ",
                                            }}
                                        > */}
                                            <div className="flex flex-row gap-x-[1.8rem] gap-y-[.5rem] pl-[1.6rem] flex-wrap pb-2">
                                                {selectedSubteam.participantes.map(
                                                    (user) => {
                                                        return (
                                                            <div
                                                                className="SingleUserIconContainerSelected"
                                                                key={
                                                                    user.idUsuario
                                                                }
                                                            >
                                                                {/* <Checkbox
                                                                    value={
                                                                        user.idUsuario
                                                                    }
                                                                    onChange={() => {
                                                                        setValidSelectedSubteamUsers(
                                                                            true
                                                                        );
                                                                    }}
                                                                ></Checkbox> */}

                                                                <Avatar
                                                                    //isBordered
                                                                    //as="button"
                                                                    className="transition-transform w-[40px] min-w-[40px] h-[40x] min-h-[40px] bg-mainUserIcon"
                                                                    src={
                                                                        user.imgLink
                                                                    }
                                                                    fallback={
                                                                        <p className="SingleUserIconSelected bg-mainUserIcon">
                                                                            {user
                                                                                .nombres[0] +
                                                                                (user.apellidos !==
                                                                                null
                                                                                    ? user
                                                                                          .apellidos[0]
                                                                                    : "")}
                                                                        </p>
                                                                    }
                                                                />

                                                                <div className="">
                                                                    {user.nombres +
                                                                        " " +
                                                                        user.apellidos}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                            {/* </CheckboxGroup> */}
                                            {/* </div> */}
                                        </div>
                                    ) : (
                                        <p className="noUsersMsg">
                                            No ha seleccionado ningun subequipo
                                        </p>
                                    )}
                                </ul>
                                {!validAsigned && (
                                    <div className="flex relative flex-col gap-1.5 pt-1 px-1">
                                        <p className="text-tiny text-danger">
                                            Debe asignar la tarea a un usuario o
                                            equipo!
                                        </p>
                                    </div>
                                )}
                                {!validSelectedSubteamUsers && (
                                    <div className="flex relative flex-col gap-1.5 pt-1 px-1">
                                        <p className="text-tiny text-danger">
                                            Debe seleccionar usuarios asignados
                                            dentro del subequipo!
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="containerTabPlantilla">
                                <p className="font-semibold text-xl">
                                    Campos adicionales
                                </p>

                                <TemplatesAdditionalFields
                                    baseFields={taskAdditionalFields}
                                    setBaseFields={setTaskAdditionalFields}
                                />
                            </div>

                            <ListAdditionalFields
                                editState={stateSecond !== 2}
                                baseFields={taskAdditionalFields}
                                setBaseFields={setTaskAdditionalFields}
                            />

                            {stateSecond !== 2 && (
                                <div className="twoButtonsEnd pb-8">
                                    <Modal
                                        nameButton="Descartar"
                                        textHeader={
                                            stateSecond === 3
                                                ? "Descartar Actualización"
                                                : "Descartar Registro"
                                        }
                                        textBody={
                                            stateSecond === 3
                                                ? "¿Seguro que quiere descartar la actualizacion de esta tarea?"
                                                : "¿Seguro que quiere descartar el registro de esta tarea?"
                                        }
                                        textColor="red"
                                        colorButton="w-36 bg-slate-100 text-black"
                                        oneButton={false}
                                        leftBtnText="Cancelar"
                                        rightBtnText="Confirmar"
                                        //isLoading={isLoading}
                                        closeSecondActionState={true}
                                        secondAction={() => {
                                            if (stateSecond === 3) {
                                                exitEdition(
                                                    idTareaToEdit,
                                                    4,
                                                    () => {
                                                        setToggleNew(false);
                                                    }
                                                );
                                            } else {
                                                setToggleNew(false);
                                            }
                                        }}
                                    />
                                    <Modal
                                        nameButton="Aceptar"
                                        textHeader="Registrar Tarea"
                                        textBody={
                                            stateSecond === 3
                                                ? "¿Seguro que quiere actualizar esta tarea?"
                                                : "¿Seguro que desea registrar esta tarea?"
                                        }
                                        //headerColor
                                        colorButton="w-36 bg-blue-950 text-white"
                                        oneButton={false}
                                        leftBtnText="Cancelar"
                                        rightBtnText="Confirmar"
                                        closeSecondActionState={true}
                                        isLoading={isRegisterLoading}
                                        secondAction={async () => {
                                            if (
                                                stateSecond === 1 ||
                                                stateSecond === 4
                                            ) {
                                                //registrarTarea();
                                                await registrarTareaModal();
                                            } else if (stateSecond === 3) {
                                                editarTarea();
                                            }
                                        }}
                                        verifyFunction={() => {
                                            let allValid = true;
                                            if (tareaName === "") {
                                                setValidName(false);
                                                allValid = false;
                                            }
                                            if (dependencies.length === 0) {
                                                if (fechaFin <= fechaInicio) {
                                                    setValidFechas("isFalse");
                                                    allValid = false;
                                                }
                                                if (
                                                    fechaInicio === "" ||
                                                    fechaFin === ""
                                                ) {
                                                    setValidFechas("isEmpty");
                                                    allValid = false;
                                                }
                                            } else {
                                                if (fechaFin === "") {
                                                    setValidFechas("isFalse");
                                                    allValid = false;
                                                } else {
                                                    const maxFechaFin =
                                                        dependencies.reduce(
                                                            (
                                                                maxFecha,
                                                                currentTask
                                                            ) => {
                                                                const currentFechaFin =
                                                                    currentTask.fechaFin; // Convert to timestamp for comparison

                                                                // If maxFecha is null or the current fechaFin is greater, update maxFecha
                                                                if (
                                                                    maxFecha ===
                                                                        null ||
                                                                    currentFechaFin >
                                                                        maxFecha
                                                                ) {
                                                                    return currentFechaFin;
                                                                }
                                                                return maxFecha;
                                                            },
                                                            null
                                                        );
                                                    if (
                                                        fechaFin <= maxFechaFin
                                                    ) {
                                                        toast.error(
                                                            "La fecha fin no puede ser menor a las dependencias",
                                                            {
                                                                position:
                                                                    "top-center",
                                                            }
                                                        );
                                                        allValid = false;
                                                    }
                                                }
                                            }

                                            // if (tareaEntregable.size === 0) {
                                            //     console.log(tareaEntregable);
                                            //     setValidEntregable(false);
                                            //     allValid = false;
                                            // }

                                            if (
                                                selectedSubteam === null &&
                                                selectedUsers.length !== 0
                                            ) {
                                                setTabSelected("users");
                                            } else if (
                                                selectedSubteam !== null &&
                                                selectedUsers.length === 0
                                            ) {
                                                setTabSelected("subteams");
                                            }

                                            if (allValid) {
                                                return true;
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {modal && (
                        <ModalUser
                            handlerModalClose={() => {
                                setModal(false);
                            }}
                            handlerModalFinished={returnListOfUsers}
                            excludedUsers={selectedUsers}
                            idProyecto={projectId}
                            listAllUsers={false}
                        ></ModalUser>
                    )}
                </>
            )}
        </div>
    );
}
