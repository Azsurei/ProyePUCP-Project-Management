"use client";
import NormalInput from "@/components/NormalInput";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import AgendaTable from "@/components/dashboardComps/projectComps/cronogramaComps/AgendaTable";
import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/cronogramaPage.css";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import { useContext, useEffect, useState } from "react";
import DateInput from "@/components/DateInput";
import TabUserSelect from "@/components/dashboardComps/projectComps/cronogramaComps/TabUserSelect";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/modalUsers";
import CardSelectedUser from "@/components/CardSelectedUser";
import { Textarea } from "@nextui-org/react";

// import {
//     Modal,
//     ModalContent,
//     ModalHeader,
//     ModalBody,
//     ModalFooter,
//     Button,
//     useDisclosure,
// } from "@nextui-org/react";

import axios from "axios";
import { SmallLoadingScreen } from "../layout";
axios.defaults.withCredentials = true;

export default function Cronograma(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [toggleNew, setToggleNew] = useState(false);
    const handlerGoToNew = () => {
        setToggleNew(!toggleNew);
    };

    const [tareaName, setTareaName] = useState("");
    const [validName, setValidName] = useState(true);

    const [tareaDescripcion, setTareaDescripcion] = useState("");
    const [validDescripcion, setValidDescripcion] = useState(true);

    const [fechaInicio, setFechaInicio] = useState("");
    const [validFechaI, setValidFechaI] = useState(true);

    const [fechaFin, setFechaFin] = useState("");
    const [validFechaF, setValidFechaF] = useState(true);

    const [tabSelected, setTabSelected] = useState("users");
    const [modal, setModal] = useState(false);

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedSubteam, setSelectedSubteam] = useState({
        idSubequipo: 1,
        nombre: "Backend Team",
    });

    const [modalFirstTime, setModalFirstTime] = useState(false);

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

    // useEffect(() => {
    //     setSelectedSubteam(null);
    // }, [selectedUsers]);

    // useEffect(() => {
    //     setSelectedUsers([]);
    // }, [selectedSubteam]);

    // States
    const [hito, setHito] = useState(""); // State to hold the hito value

    // Initialize hito on page load
    useEffect(() => {
        initializeHito();
    }, []); // Empty dependency array ensures this effect runs only once on page load

    const initializeHito = async () => {
        try {
            // Fetch the initial hito value from your API or set it to a default value
            const response = await axios.get('/api/listarHito'); // Replace with the correct API endpoint
            setHito(response.data); // Assuming response.data contains the initial hito value
        } catch (error) {
            console.error('Error initializing hito:', error);
        }
    };

    // Function to insert a new hito
    const insertarHito = async () => {
        try {
            // Make a POST request to insert a new hito
            const response = await axios.post('/api/insertarHito', { hito }); // Replace with the correct API endpoint
            // Handle the response as needed
            // After successful insertion, you can optionally refresh the hito value
        } catch (error) {
            console.error('Error inserting hito:', error);
        }
    };




    useEffect(() => {
        const stringURL =
            "http://localhost:8080/api/proyecto/cronograma/listarCronograma";

        axios
            .post(stringURL, { idProyecto: projectId })
            .then(function (response) {
                const cronogramaData = response.data.cronograma;
                console.log(cronogramaData);

                if (
                    cronogramaData.fechaInicio === null ||
                    cronogramaData.fechaFin === null
                ) {
                    setModalFirstTime(false);
                }
                setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const msgEmptyField = "Este campo no puede estar vacio";
    //const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <div className="cronogramaDiv">
            {/* {modalFirstTime && (
                <Modal
                    onOpenChange={onOpenChange}
                    isDismissable={false}
                    defaultOpen={true}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Modal Title
                                </ModalHeader>
                                <ModalBody>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Nullam pulvinar risus
                                        non risus hendrerit venenatis.
                                        Pellentesque sit amet hendrerit risus,
                                        sed porttitor quam.
                                    </p>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Nullam pulvinar risus
                                        non risus hendrerit venenatis.
                                        Pellentesque sit amet hendrerit risus,
                                        sed porttitor quam.
                                    </p>
                                    <p>
                                        Magna exercitation reprehenderit magna
                                        aute tempor cupidatat consequat elit
                                        dolor adipisicing. Mollit dolor eiusmod
                                        sunt ex incididunt cillum quis. Velit
                                        duis sit officia eiusmod Lorem aliqua
                                        enim laboris do dolor eiusmod. Et mollit
                                        incididunt nisi consectetur esse laborum
                                        eiusmod pariatur proident Lorem eiusmod
                                        et. Culpa deserunt nostrud ad veniam.
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Close
                                    </Button>
                                    <Button color="primary" onPress={onClose}>
                                        Action
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            )} */}

            {!modalFirstTime && (
                <>
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
                            >
                                Cronograma
                            </HeaderWithButtonsSamePage>

                            <AgendaTable></AgendaTable>
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

                            <div className="contNombre">
                                <p>Nombre de tarea</p>

                                <Textarea
                                    isInvalid={!validName}
                                    errorMessage={
                                        !validName ? msgEmptyField : ""
                                    }
                                    key={"bordered"}
                                    variant={"bordered"}
                                    labelPlacement="outside"
                                    placeholder="Escriba aquí"
                                    className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                    value={tareaName}
                                    onValueChange={setTareaName}
                                    minRows={1}
                                    size="sm"
                                    onChange={() => {
                                        setValidName(true);
                                    }}
                                />
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
                                    className="col-span-12 md:col-span-6 mb-6 md:mb-0"
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
                                <div className="contFechaInicio">
                                    <p>Fecha de inicio</p>
                                    <DateInput
                                        className={""}
                                        onChangeHandler={setFechaInicio}
                                    ></DateInput>
                                </div>

                                <div className="contFechaFin">
                                    <p>Fecha de fin</p>
                                    <DateInput
                                        className={""}
                                        onChangeHandler={setFechaInicio}
                                    ></DateInput>
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
                                <Modal
                                    nameButton="Descartar"
                                    textHeader="Descartar Registro"
                                    textBody="¿Seguro que quiere descartar el registro de el componente EDT?"
                                    colorButton="w-36 bg-slate-100 text-black"
                                    oneButton={false}
                                    //secondAction={handlerReturn}
                                />
                                <Modal
                                    nameButton="Aceptar"
                                    textHeader="Registrar Componente"
                                    textBody="¿Seguro que quiere desea registrar el componente?"
                                    colorButton="w-36 bg-blue-950 text-white"
                                    oneButton={false}
                                    secondAction={() => {
                                        console.log(tareaName);
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
                        ></ModalUser>
                    )}
                </>
            )}
            <div className="flex flex-row space-x-4 mb-4">
                <h2 className="montserrat text-[#172B4D] font-bold text-2xl">
                    Lista de Interesados (StakeHolders)
                </h2>
                <img src="/icons/info-circle.svg" alt="Informacion"></img>
            </div>

            {/* Initialize hito */}
            <div>
                <h3>Initial Hito Value: {hito}</h3>
            </div>

            {/* Insert new hito */}
            <div>
                <Input
                    placeholder="Insertar Hito"
                    value={hito}
                    onChange={(e) => setHito(e.target.value)}
                />
                <Button color="primary" onClick={insertarHito}>
                    Insertar Hito
                </Button>
            </div>
        </div>
    );
}
