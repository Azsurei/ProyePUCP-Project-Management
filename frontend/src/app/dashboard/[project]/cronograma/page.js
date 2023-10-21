"use client";
import NormalInput from "@/components/NormalInput";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import AgendaTable from "@/components/dashboardComps/projectComps/cronogramaComps/AgendaTable";
import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/cronogramaPage.css";
import { useContext, useEffect, useState } from "react";
import DateInput from "@/components/DateInput";
import TabUserSelect from "@/components/dashboardComps/projectComps/cronogramaComps/TabUserSelect";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import CardSelectedUser from "@/components/CardSelectedUser";
import { Select, SelectItem, Textarea } from "@nextui-org/react";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";

import axios from "axios";
import { SmallLoadingScreen } from "../layout";
import BtnToModal from "@/components/BtnToModal";
import { useRouter } from "next/navigation";
import ModalUsersOne from "@/components/ModalUsersOne";
axios.defaults.withCredentials = true;

export default function Cronograma(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const router = useRouter();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [toggleNew, setToggleNew] = useState(false);
    const handlerGoToNew = () => {
        setToggleNew(!toggleNew);
    };

    //States from firstTimeModal
    const [firstFechaInicio, setFirstFechaInicio] = useState("");
    const [firstFechaFin, setFirstFechaFin] = useState("");

    //States from Cronograma
    const [cronogramaId, setCronogramaId] = useState(null);

    //States from Tareas table
    const [listTareas, setListTareas] = useState([]);

    const [tareaName, setTareaName] = useState("");
    const [validName, setValidName] = useState(true);

    const [tareaEstado , setTareaEstado] = useState({id:0,texto:"",color:""});
    const [dropBoxColor, setDropBoxColor] = useState(null);

    const [tareaDescripcion, setTareaDescripcion] = useState("");
    const [validDescripcion, setValidDescripcion] = useState(true);

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [validFechas, setValidFechas] = useState(true);

    const [tabSelected, setTabSelected] = useState("users");
    const [modal, setModal] = useState(false);

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedSubteam, setSelectedSubteam] = useState({
        idSubequipo: 1,
        nombre: "Backend Team",
    });

    const returnListOfUsers = (newUsersList) => {
        const newList = [...selectedUsers, ...newUsersList];

        setSelectedUsers(newList);
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

    const registrarTarea = () => {
        const updateURL =
            "http://localhost:8080/api/proyecto/cronograma/insertarTarea";
        axios
            .post(updateURL, {
                idCronograma: cronogramaId,
                idTareaEstado: 1, //No iniciado
                idSubGrupo: null,
                idPadre: null,
                idTareaAnterior: null,
                sumillaTarea: tareaName,
                descripcion: tareaDescripcion,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
                cantSubtareas: 0,
                cantPosteriores: 0,
                horasPlaneadas: null,
                usuarios: null,
                subTareas: null,
                tareasPosteriores: null
            })
            .then(function (response) {
                console.log(response.data.message);
                router.refresh();
            })
            .catch(function (error) {
                console.log(error);
            });
    };


    const dropBoxItems = [
        {
            id: 1,
            texto: "No iniciado",
            color: "default"
        },
        {
            id: 2,
            texto: "En progreso",
            color: "primary"
        },
        {
            id: 3,
            texto: "Atrasado",
            color: "warning"
        },
        {
            id: 4,
            texto: "Finalizado",
            color: "success"
        }
    ];

    const colorDropbox = [
        "default",
        "primary",
        "warning",
        "success"
    ];

    // useEffect(() => {
    //     setSelectedSubteam(null);
    // }, [selectedUsers]);

    // useEffect(() => {
    //     setSelectedUsers([]);
    // }, [selectedSubteam]);

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
                    onOpen();
                } else {
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
                }

                //setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const msgEmptyField = "Este campo no puede estar vacio";

    return (
        <div className="cronogramaDiv">
            {
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
            }

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

                    <AgendaTable listTareas={listTareas}></AgendaTable>
                </div>
            </div>

            {/*=========================================================================================*/}

            <div className={toggleNew ? "divRight open" : "divRight"}>
                <div className="containerGeneralRight">
                    <HeaderWithButtonsSamePage
                        haveReturn={true}
                        haveAddNew={false}
                        //handlerAddNew={handlerGoToNew}
                        handlerReturn={handlerGoToNew}
                        //newPrimarySon={ListComps.length + 1}
                        breadcrump={
                            "Inicio / Proyectos / " +
                            projectName +
                            " / Cronograma"
                        }
                        btnText={"Nueva tarea"}
                    >
                        Nueva tarea
                    </HeaderWithButtonsSamePage>

                    <div className="contFirstRow">
                        <div className="contNombre">
                            <p>Nombre de tarea</p>

                            <Textarea
                                isInvalid={!validName}
                                errorMessage={!validName ? msgEmptyField : ""}
                                key={"bordered"}
                                variant={"bordered"}
                                labelPlacement="outside"
                                label=""
                                placeholder="Escriba aquí"
                                classNames={{label: "pb-0"}}
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
                                label=""
                                placeholder="Selecciona"
                                labelPlacement="outside"
                                classNames={{trigger:"h-10"}}
                                size="sm"
                                color={colorDropbox[tareaEstado-1]}
                                onChange={(e)=>{
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
                                ))
                                }
                            </Select>
                        </div>
                    </div>

                    <div className="contDescripcion">
                        <p>Descripcion</p>

                        <Textarea
                            isInvalid={!validDescripcion}
                            errorMessage={
                                !validDescripcion ? msgEmptyField : ""
                            }
                            key={"bordered"}
                            variant={"bordered"}
                            labelPlacement="outside"
                            placeholder="Escriba aquí"
                            classNames={{label: "pb-0"}}
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
                                    className={""}
                                    isInvalid={validFechas===true ? false : true}
                                    onChangeHandler={(e) => {
                                        setFechaInicio(e.target.value);
                                        setValidFechas(true);
                                    }}
                                ></DateInput>
                            </div>

                            <div className="contFechaFin">
                                <p className="headerFFin">Fecha de fin</p>
                                <DateInput
                                    className={""}
                                    isInvalid={validFechas===true ? false : true}
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

                    <div className="containerSubtareas">
                        <div className="subTareasHeader">
                            <p>
                                { "Subtareas" /*(Aqui se abrira un modal para
                                introducir nombre, desc, fechaI y fechaF) */}
                            </p>
                            <div className="btnToPopUp">
                                <p>Añadir</p>
                            </div>
                        </div>
                        <div className="subTareasViewContainer">
                            <p className="noUsersMsg">
                                No ha seleccionado subtareas
                            </p>
                        </div>
                    </div>

                    <div className="containerPosteriores">
                        <div className="posterioresHeader">
                            <p>Tareas posteriores</p>
                            <div className="btnToPopUp">
                                <p>Añadir</p>
                            </div>
                        </div>
                        <div className="posterioresViewContainer">
                            <p className="noUsersMsg">
                                No ha seleccionado subtareas
                            </p>
                        </div>
                    </div>

                    <p style={{ paddingTop: ".7rem" }}>
                        Asigna miembros a tu tarea!
                    </p>
                    <div className="containerTab">
                        <TabUserSelect
                            selectedKey={tabSelected}
                            onSelectionChange={setTabSelected}
                        ></TabUserSelect>
                        <div
                            className="btnToPopUp"
                            onClick={() => {
                                setModal(true);
                            }}
                        >
                            <p>
                                {tabSelected === "users"
                                    ? "Buscar un miembro"
                                    : "Buscar un subequipo"}
                            </p>
                            <img
                                src="/icons/icon-searchBar.svg"
                                alt=""
                                className="icnSearch"
                            />
                        </div>
                    </div>

                    <ul className="contUsers">
                        {tabSelected === "users" ? (
                            selectedUsers.length !== 0 ? (
                                selectedUsers.map((component) => (
                                    <CardSelectedUser
                                        key={component.id}
                                        name={component.name}
                                        lastName={component.lastName}
                                        usuarioObject={component}
                                        email={component.email}
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
                                <div className="cardLeftSide">
                                    <img src="/icons/sideBarDropDown_icons/sbdd14.svg"></img>
                                    <p>{selectedSubteam.nombre}</p>
                                </div>
                                <img
                                    src="/icons/icon-crossBlack.svg"
                                    onClick={() => {
                                        setSelectedSubteam(null);
                                    }}
                                ></img>
                            </div>
                        ) : (
                            <p className="noUsersMsg">
                                No ha seleccionado ningun subequipo
                            </p>
                        )}
                    </ul>

                    <div className="twoButtonsEnd">
                        <BtnToModal
                            nameButton="Descartar"
                            textHeader="Descartar Tarea"
                            textBody="¿Seguro que quiere descartar el registro de esta tarea?"
                            textColor="red"
                            colorButton="w-36 bg-slate-100 text-black"
                            oneButton={false}
                            //secondAction={handlerReturn}
                        />
                        <BtnToModal
                            nameButton="Aceptar"
                            textHeader="Registrar Tarea"
                            textBody="¿Seguro que quiere desea registrar esta tarea?"
                            colorButton="w-36 bg-blue-950 text-white"
                            oneButton={false}
                            secondAction={registrarTarea}
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
                                if (allValid) {
                                    return true;
                                }
                            }}
                        />
                    </div>
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
        </div>
    );
}
