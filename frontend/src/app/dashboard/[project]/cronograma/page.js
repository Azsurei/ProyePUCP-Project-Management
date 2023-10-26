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
    Checkbox,
    CheckboxGroup,
    Select,
    SelectItem,
    Tab,
    Tabs,
    Textarea,
} from "@nextui-org/react";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import { Toaster, toast } from "sonner";

import axios from "axios";
import { SmallLoadingScreen } from "../layout";
import BtnToModal from "@/components/BtnToModal";
import { useRouter } from "next/navigation";
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
axios.defaults.withCredentials = true;

export default function Cronograma(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const router = useRouter();

    //const { isOpen, onOpen, onOpenChange } = useDisclosure();
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

    const [tareaEstado, setTareaEstado] = useState({
        id: 0,
        texto: "",
        color: "",
    });
    const [dropBoxColor, setDropBoxColor] = useState(null);

    const [tareaDescripcion, setTareaDescripcion] = useState("");
    const [validDescripcion, setValidDescripcion] = useState(true);

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [validFechas, setValidFechas] = useState(true);

    const [listPosteriores, setListPosteriores] = useState([]);

    const [tabSelected, setTabSelected] = useState("users");
    const [modal, setModal] = useState(false);

    //para definir estado de segunda pantalla
    const [stateSecond, setStateSecond] = useState(0);
    //1 sera para nueva tarea
    //2 para visualizar una tarea
    //3 para editar una tarea
    //4 si es que esta agregando una tarea hija
    const [isEditable, setIsEditable] = useState(false);

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedSubteam, setSelectedSubteam] = useState(null);
    const [validAsigned, setValidAsigned] = useState(true);

    const [selectedSubteamUsers, setSelectedSubteamUsers] = useState([]);
    const [validSelectedSubteamUsers, setValidSelectedSubteamUsers] =
        useState(true);

    const handlerGoToNew = () => {
        //limpiamos data por si acaso
        setTareaPadre(null);
        setTareaName("");
        setTareaDescripcion("");
        //setear combo box
        setFechaInicio("");
        setFechaFin("");

        setListPosteriores([]);

        setSelectedSubteam(null);
        setSelectedUsers([]);
        setTabSelected("users");

        setStateSecond(1);
        setToggleNew(true);
    };

    const handleVerDetalle = (tarea) => {
        //toma una tarea, deberemos setear el estado de la pantalla en todo no editable y con los nuevos valores
        setTareaPadre(tarea.idPadre);
        setTareaName(tarea.sumillaTarea);
        setTareaDescripcion(tarea.descripcion);

        console.log("ESTA ES LA FECHA INICIO : " + tarea.fechaInicio);
        console.log("ESTA ES LA FECHA FIN : " + tarea.fechaFin);

        setFechaInicio(dbDateToInputDate(tarea.fechaInicio));
        setFechaFin(dbDateToInputDate(tarea.fechaFin));

        setListPosteriores(tarea.tareasPosteriores);
        for (const task of tarea.tareasPosteriores) {
            task.fechaFin = dbDateToInputDate(task.fechaFin);
        }

        if (tarea.idEquipo === null) {
            setSelectedUsers(tarea.usuarios);
            setSelectedSubteam(null);
            setSelectedSubteamUsers([]);
            setTabSelected("users");
        } else {
            setSelectedSubteam(tarea.equipo);
            setSelectedUsers([]);

            let newUsrLst = [];
            for (const user of tarea.usuarios) {
                newUsrLst.push(user.idUsuario);
            }
            setSelectedSubteamUsers(newUsrLst);
            setValidSelectedSubteamUsers(true);

            setTabSelected("subteams");
        }

        setValidName(true);
        setValidDescripcion(true);
        setValidFechas(true);
        setValidAsigned(true);

        setStateSecond(2);
        setToggleNew(true);
    };

    const handleAddNewSon = (tareaPadre) => {
        setTareaPadre(tareaPadre);
        setTareaName("");
        setTareaDescripcion("");
        //setear combo box
        setFechaInicio("");
        setFechaFin("");
        setListPosteriores([]);

        setSelectedSubteam(null);
        setSelectedUsers([]);
        setTabSelected("users");

        setStateSecond(4);
        setToggleNew(true);
    };

    const handleDelete = (tarea) => {
        //seteamos la taera a eliminar
        setTareaEliminar(tarea);
        //prendemos modal de confirmacion
        onModalDeleteOpen();
    };

    const handleEditar = () => {
        //ya no consideraremos caso de editar desde Dropdown (Ver a futuro //!!!!!!!!!!)
        //caso en que se de click desde pantalla de vista
        //asumimos que data ya esta cargada, debemos habilitar edicion en ella

        setStateSecond(3);
    };

    function promiseEliminarTarea() {
        return new Promise((resolve, reject) => {
            const deleteURL =
                "http://localhost:8080/api/proyecto/cronograma/eliminarTarea";

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
                        "http://localhost:8080/api/proyecto/cronograma/listarTareasXidProyecto/" +
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
        const newList = selectedUsers.filter((item) => item.id !== user.id);
        setSelectedUsers(newList);
        console.log(newList);
    };

    const volverMainDashboard = () => {
        router.push("/dashboard/" + projectName + "=" + projectId);
    };

    const crearCronogramaYContinuar = () => {
        console.log(projectId);
        console.log(firstFechaInicio);
        console.log(firstFechaFin);

        const updateURL =
            "http://localhost:8080/api/proyecto/cronograma/actualizarCronograma";
        axios
            .put(updateURL, {
                idProyecto: projectId,
                fechaInicio: firstFechaInicio,
                fechaFin: firstFechaFin,
            })
            .then(function (response) {
                console.log(response.data.message);

                const tareasURL =
                    "http://localhost:8080/api/proyecto/cronograma/listarTareasXidProyecto/" +
                    projectId;
                axios
                    .get(tareasURL)
                    .then(function (response) {
                        setListTareas(response.data.tareas);
                        console.log(response.data.tareas);

                        setIsLoadingSmall(false);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    function promiseRegistrarTarea() {
        return new Promise((resolve, reject) => {
            let selectedSubteamUsersWithId;
            if (selectedSubteam !== null) {
                //remapeamos array para darle un nombre al atributo
                selectedSubteamUsersWithId = selectedSubteamUsers.map((id) => {
                    return {
                        idUsuario: id,
                    };
                });
            }

            setToggleNew(false);
            const newURL =
                "http://localhost:8080/api/proyecto/cronograma/insertarTarea";
            axios
                .post(newURL, {
                    idCronograma: cronogramaId,
                    idTareaEstado: 1, //No iniciado
                    idSubGrupo:
                        selectedSubteam === null
                            ? null
                            : selectedSubteam.idEquipo,
                    idPadre: tareaPadre !== null ? tareaPadre.idTarea : null,
                    idTareaAnterior: null,
                    sumillaTarea: tareaName,
                    descripcion: tareaDescripcion,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    cantSubtareas: 0,
                    cantPosteriores: 0,
                    horasPlaneadas: null,
                    usuarios:
                        selectedUsers.length === 0
                            ? selectedSubteamUsersWithId
                            : selectedUsers, //veriifcar posible error
                    subTareas: null,
                    tareasPosteriores: listPosteriores,
                })
                .then(function (response) {
                    console.log(response.data.message);
                    //actualizamos lista de tareas

                    const tareasURL =
                        "http://localhost:8080/api/proyecto/cronograma/listarTareasXidProyecto/" +
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

    const registrarTarea = () => {
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

            setTimeout(() => {
                resolve("Promise resolved successfully");
            }, 2000);

            const tareasURL =
                "http://localhost:8080/api/proyecto/cronograma/listarTareasXidProyecto/" +
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

    const dropBoxItems = [
        {
            id: 1,
            texto: "No iniciado",
            color: "default",
        },
        {
            id: 2,
            texto: "En progreso",
            color: "primary",
        },
        {
            id: 3,
            texto: "Atrasado",
            color: "warning",
        },
        {
            id: 4,
            texto: "Finalizado",
            color: "success",
        },
    ];

    const colorDropbox = ["default", "primary", "warning", "success"];

    useEffect(() => {
        const stringURL =
            "http://localhost:8080/api/proyecto/cronograma/listarCronograma";

        axios
            .post(stringURL, { idProyecto: projectId })
            .then(function (response) {
                const cronogramaData = response.data.cronograma;
                console.log(cronogramaData);
                setCronogramaId(cronogramaData.idCronograma);
                if (
                    cronogramaData.fechaInicio === null ||
                    cronogramaData.fechaFin === null
                ) {
                    //setModalFirstTime(true);
                    //onOpen();
                } else {
                    const tareasURL =
                        "http://localhost:8080/api/proyecto/cronograma/listarTareasXidProyecto/" +
                        projectId;
                    axios
                        .get(tareasURL)
                        .then(function (response) {
                            setListTareas(response.data.tareasOrdenadas);
                            console.log(response.data.tareasOrdenadas);
                            setIsLoadingSmall(false);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }

                //setIsLoadingSmall(false);
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

    useEffect(() => {
        if (selectedSubteam !== null && stateSecond !== 2) {
            console.log("voy a setear todos true");
            let newUsrLst = [];
            for (const user of selectedSubteam.participantes) {
                newUsrLst.push(user.idUsuario);
            }
            setSelectedSubteamUsers(newUsrLst);
            setValidSelectedSubteamUsers(true);
        }
    }, [selectedSubteam]);

    return (
        <div className="cronogramaDiv">
            {/* {
                <Modal
                    onOpenChange={onOpenChange}
                    isDismissable={false}
                    isOpen={isOpen}
                    classNames={{
                        header: "pb-0",
                        body: "pt-0 pb-0",
                    }}
                >
                    <ModalContent>
                        {(onClose) => {
                            const cerrarModal = () => {
                                crearCronogramaYContinuar();
                                onClose();
                            };
                            return (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        Crea tu cronograma!
                                    </ModalHeader>
                                    <ModalBody>
                                        <div className="modalMainContainer">
                                            <p className="modalDescr">
                                                Empieza definiendo algunas
                                                fechas
                                            </p>
                                            <div className="fechasCrearCronograma">
                                                <div className="fechaCrearLeft">
                                                    <p>Fecha inicio</p>
                                                    <DateInput
                                                        className={""}
                                                        onChangeHandler={(
                                                            e
                                                        ) => {
                                                            setFirstFechaInicio(
                                                                e.target.value
                                                            );
                                                        }}
                                                    ></DateInput>
                                                </div>
                                                <div className="fechaCrearRight">
                                                    <p>Fecha fin</p>
                                                    <DateInput
                                                        className={""}
                                                        onChangeHandler={(
                                                            e
                                                        ) => {
                                                            setFirstFechaFin(
                                                                e.target.value
                                                            );
                                                        }}
                                                    ></DateInput>
                                                </div>
                                            </div>
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={volverMainDashboard}
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            color="primary"
                                            onPress={cerrarModal}
                                        >
                                            Action
                                        </Button>
                                    </ModalFooter>
                                </>
                            );
                        }}
                    </ModalContent>
                </Modal>
            } */}
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
            ></ModalPosterior>

            <div className={toggleNew ? "divLeft closed" : "divLeft"}>
                <div className="containerGeneralLeft">
                    <HeaderWithButtonsSamePage
                        haveReturn={false}
                        haveAddNew={true}
                        handlerAddNew={handlerGoToNew}
                        //newPrimarySon={ListComps.length + 1}
                        breadcrump={"Inicio / Proyectos / " + projectName}
                        btnText={"Nueva tarea"}
                    >
                        Cronograma
                    </HeaderWithButtonsSamePage>

                    {/* <AgendaTable listTareas={listTareas}></AgendaTable> */}
                    <ListTareas
                        listTareas={listTareas}
                        leftMargin={"0px"}
                        handleVerDetalle={handleVerDetalle}
                        handleAddNewSon={handleAddNewSon}
                        handleDelete={handleDelete}
                    ></ListTareas>
                </div>
            </div>

            {/*=========================================================================================*/}

            <div className={toggleNew ? "divRight open" : "divRight"}>
                <div className="containerGeneralRight">
                    <div className="flex flex-row items-end">
                        <HeaderWithButtonsSamePage
                            haveReturn={true}
                            haveAddNew={false}
                            handlerReturn={() => {
                                setToggleNew(false);
                            }}
                            haveEditBtn={true}
                            handlerEdit={handleEditar}
                            editBtnText={"Editar"}
                            breadcrump={
                                "Inicio / Proyectos / " +
                                projectName +
                                " / Cronograma"
                            }
                            btnText={"Nueva tarea"}
                        >
                            {stateSecond === 1 && "Nueva tarea"}
                            {stateSecond === 2 && "Ver detalle de tarea"}
                            {stateSecond === 3 && "Editar tarea"}
                            {stateSecond === 4 && "Agregar tarea hija"}
                        </HeaderWithButtonsSamePage>

                        {stateSecond === 2 && (
                            <Button
                                color="primary"
                                size="md"
                                radius="sm"
                                onClick={() => {
                                    handleEditar();
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
                            <p>Nombre de tarea</p>

                            <Textarea
                                variant={
                                    stateSecond === 2 ? "flat" : "bordered"
                                }
                                readOnly={stateSecond === 2 ? true : false}
                                aria-label="name-lbl"
                                isInvalid={!validName}
                                errorMessage={!validName ? msgEmptyField : ""}
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
                            <p>Estado</p>
                            <Select
                                //variant="bordered"
                                aria-label="cbo-lbl"
                                label=""
                                placeholder="Selecciona"
                                labelPlacement="outside"
                                classNames={{ trigger: "h-10" }}
                                size="sm"
                                color={colorDropbox[tareaEstado - 1]}
                                onChange={(e) => {
                                    setTareaEstado(e.target.value);
                                    console.log(tareaEstado);
                                }}
                            >
                                {dropBoxItems.map((items) => (
                                    <SelectItem
                                        key={items.id}
                                        value={items.texto}
                                        color={items.color}
                                    >
                                        {items.texto}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="contDescripcion">
                        <p>Descripcion</p>

                        <Textarea
                            variant={stateSecond === 2 ? "flat" : "bordered"}
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
                                <p className="headerFInicio">Fecha de inicio</p>
                                <DateInput
                                    value={fechaInicio}
                                    isEditable={
                                        stateSecond === 2 ? false : true
                                    }
                                    className={""}
                                    isInvalid={
                                        validFechas === true ? false : true
                                    }
                                    onChangeHandler={(e) => {
                                        setFechaInicio(e.target.value);
                                        setValidFechas(true);
                                    }}
                                ></DateInput>
                            </div>

                            <div className="contFechaFin">
                                <p className="headerFFin">Fecha de fin</p>
                                <DateInput
                                    value={fechaFin}
                                    isEditable={
                                        stateSecond === 2 ? false : true
                                    }
                                    className={""}
                                    isInvalid={
                                        validFechas === true ? false : true
                                    }
                                    onChangeHandler={(e) => {
                                        setFechaFin(e.target.value);
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
                                    La fecha fin no puede ser antes que la fecha
                                    inicio
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="containerPosteriores">
                        <div className="posterioresHeader">
                            <p>Tareas posteriores</p>
                            {stateSecond !== 2 && (
                                <div
                                    className="btnToPopUp"
                                    onClick={onModalPosteriorOpen}
                                >
                                    <p>Añadir</p>
                                </div>
                            )}
                        </div>
                        <p className="text-sm">
                            Esta tarea sera asignada a los mismos usuarios que
                            la tarea previa y su fecha de inicio sera en la
                            fecha fin de la previa.
                        </p>
                        <div className="posterioresViewContainer">
                            {listPosteriores.length === 0 && (
                                <p className="noUsersMsg">
                                    No ha creado tareas posteriores
                                </p>
                            )}
                            {listPosteriores.map((tPost, index) => {
                                return (
                                    <div
                                        className="cardTareasPosteriores"
                                        key={index}
                                    >
                                        <div className="flex flex-row justify-between">
                                            <p>
                                                {tPost.sumillaTarea}
                                                {" | Concluirá el "}
                                                {inputDateToDisplayDate(
                                                    tPost.fechaFin
                                                )}
                                            </p>

                                            {stateSecond !== 2 && (
                                                <img
                                                    src="/icons/icon-crossBlack.svg"
                                                    onClick={() => {
                                                        removeTareaPosterior(
                                                            index + 1
                                                        );
                                                    }}
                                                ></img>
                                            )}
                                        </div>

                                        <p className="pl-5">
                                            {"Descripción: " +
                                                tPost.descripcion}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <p style={{ paddingTop: ".7rem" }}>
                        Asigna miembros a tu tarea!
                    </p>
                    <div className="containerTab">
                        <div className="flex flex-wrap gap-4">
                            <Tabs
                                isDisabled={stateSecond === 2 ? true : false}
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
                                <Tab key="subteams" title="Subequipos" />
                            </Tabs>
                        </div>

                        {tabSelected === "users"
                            ? stateSecond !== 2 && (
                                  <div
                                      className="btnToPopUp"
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
                                      className="btnToPopUp"
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

                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <ul
                            className={
                                validAsigned === true &&
                                validSelectedSubteamUsers === true
                                    ? "contUsers"
                                    : "contUsers invalid"
                            }
                        >
                            {tabSelected === "users" ? (
                                selectedUsers.length !== 0 ? (
                                    selectedUsers.map((component) => (
                                        <CardSelectedUser
                                            key={component.idUsuario}
                                            isEditable={
                                                stateSecond === 2 ? false : true
                                            }
                                            usuarioObject={component}
                                            removeHandler={removeUser}
                                        ></CardSelectedUser>
                                    ))
                                ) : (
                                    <p className="noUsersMsg">
                                        No ha seleccionado ningun usuario
                                    </p>
                                )
                            ) : selectedSubteam !== null ? (
                                <div className="cardSubteam">
                                    <div className="cardSubteam_Header">
                                        <div className="flex gap-[1rem]">
                                            <div className="cardLeftSide">
                                                <img src="/icons/sideBarDropDown_icons/sbdd14.svg"></img>
                                                <p
                                                    style={{
                                                        fontFamily: "Roboto",
                                                    }}
                                                >
                                                    {selectedSubteam.nombre}
                                                </p>
                                            </div>

                                            {stateSecond !== 2 && (
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
                                            )}

                                            <div
                                                onClick={() => {
                                                    console.log(
                                                        selectedSubteamUsers
                                                    );
                                                }}
                                            >
                                                ver estado
                                            </div>
                                        </div>

                                        {stateSecond !== 2 && (
                                            <img
                                                src="/icons/icon-crossBlack.svg"
                                                onClick={() => {
                                                    setSelectedSubteam(null);
                                                    setSelectedSubteamUsers([]);
                                                }}
                                            ></img>
                                        )}
                                    </div>

                                    {/* <div className="SubTeamUsersContainerSelected"> */}
                                    <CheckboxGroup
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
                                    >
                                        {selectedSubteam.participantes.map(
                                            (user) => {
                                                return (
                                                    <div
                                                        className="SingleUserIconContainerSelected"
                                                        key={user.idUsuario}
                                                    >
                                                        <Checkbox
                                                            value={
                                                                user.idUsuario
                                                            }
                                                            onChange={() => {
                                                                setValidSelectedSubteamUsers(
                                                                    true
                                                                );
                                                            }}
                                                        ></Checkbox>
                                                        <div className="SingleUserIconSelected">
                                                            {user.nombres[0] +
                                                                user
                                                                    .apellidos[0]}
                                                        </div>
                                                        <div className="SingleUserNameSelected">
                                                            {user.nombres +
                                                                " " +
                                                                user.apellidos}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </CheckboxGroup>
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
                                    Debe asignar la tarea a un usuario o equipo!
                                </p>
                            </div>
                        )}
                        {!validSelectedSubteamUsers && (
                            <div className="flex relative flex-col gap-1.5 pt-1 px-1">
                                <p className="text-tiny text-danger">
                                    Debe seleccionar usuarios asignados dentro
                                    del subequipo!
                                </p>
                            </div>
                        )}
                    </div>

                    {stateSecond !== 2 && (
                        <div className="twoButtonsEnd">
                            <BtnToModal
                                nameButton="Descartar"
                                textHeader="Descartar Tarea"
                                textBody="¿Seguro que quiere descartar el registro de esta tarea?"
                                headerColor="red"
                                colorButton="w-36 bg-slate-100 text-black"
                                oneButton={false}
                                leftBtnText="Cancelar"
                                rightBtnText="Confirmar"
                                doBeforeClosing={() => {
                                    setToggleNew(false);
                                }}
                                //verifyFunction = {}       sin verificacion
                            />
                            <BtnToModal
                                nameButton="Aceptar"
                                textHeader="Registrar Tarea"
                                textBody="¿Seguro que quiere desea registrar esta tarea?"
                                //headerColor
                                colorButton="w-36 bg-blue-950 text-white"
                                oneButton={false}
                                leftBtnText="Cancelar"
                                rightBtnText="Confirmar"
                                doBeforeClosing={() => {
                                    if (stateSecond === 1 || stateSecond === 4) {
                                        registrarTarea();
                                    } else if( stateSecond === 3) { 
                                        editarTarea();
                                    }
                                }}
                                verifyFunction={() => {
                                    let allValid = true;
                                    if (tareaName === "") {
                                        setValidName(false);
                                        allValid = false;
                                    }
                                    if (tareaDescripcion === "") {
                                        setValidDescripcion(false);
                                        allValid = false;
                                    }
                                    if (fechaFin < fechaInicio) {
                                        setValidFechas("isFalse");
                                        allValid = false;
                                    }
                                    if (fechaInicio === "" || fechaFin === "") {
                                        setValidFechas("isEmpty");
                                        allValid = false;
                                    }
                                    if (
                                        selectedSubteam === null &&
                                        selectedUsers.length === 0
                                    ) {
                                        setValidAsigned(false);
                                        allValid = false;
                                    }
                                    if (
                                        selectedSubteam !== null &&
                                        selectedSubteamUsers.length === 0
                                    ) {
                                        setValidSelectedSubteamUsers(false);
                                        allValid = false;
                                    }

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
                ></ModalUser>
            )}

            <Toaster
                richColors
                theme={"light"}
                closeButton={true}
                toastOptions={{
                    style: { fontSize: "1.2rem" },
                }}
            />
        </div>
    );
}
