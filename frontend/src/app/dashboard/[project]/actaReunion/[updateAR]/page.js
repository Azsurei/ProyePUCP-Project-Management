// [updateAR]/PAGE.JS
"use client"

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import { SmallLoadingScreen } from "../../layout";

import { useRouter , useSearchParams} from "next/navigation";
import {
    Input,
    Card, CardHeader, CardBody, CardFooter,
    Button, Spacer,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue,
    Checkbox,
} from "@nextui-org/react";
import ModalUsersOne from "@/components/ModalUsersOne";
import ModalUsers from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ChoiceUser.css";
import "@/styles/dashboardStyles/projectStyles/actaReunionStyles/LineaActaReunion.css";

import CardSelectedUser from "@/components/CardSelectedUser";

import AcuerdosListEditableInput from "@/components/dashboardComps/projectComps/actaReunionComps/ARListEditableInput";
import ListEditableInput from "@/components/dashboardComps/projectComps/EDTComps/ListEditableInput";
import ButtonAddNew from "@/components/dashboardComps/projectComps/EDTComps/ButtonAddNew";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";

import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
import { is } from "date-fns/locale";

axios.defaults.withCredentials = true;

export default function editarActaReunion(props) {



// *********************************************************************************************
// Various Variables
// *********************************************************************************************
// Router. Helps you to move between pages
    const router = useRouter();
    const searchParams = useSearchParams();
    const idLineaActa = searchParams.get('edit');
//const receivedData = router.edit.data;
// Project Info
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

// Loading Window
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    setIsLoadingSmall(false);

// Edit Mode: False for See Meeting, True for Edit Meeting
    const [isEditMode, setIsEditMode] = useState(false);
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

//Vital Data for Creating Meeting
    const [titleValue, setTitleValue] = useState("");
    const [motiveValue, setMotiveValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [timeValue, setTimeValue] = useState("");

// *********************************************************************************************
// Working with ARLine
// *********************************************************************************************
    const [actaReunion, setActaReunion] = useState(null);

    const fetchData = async (id) => {
        setIsLoadingSmall(true);
        try {
            // Assuming that projectId is the idLineaActaReunion
            const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/proyecto/actaReunion/listarLineaActaReunionXIdLineaActaReunion/' + id;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Update the actaReunion state with the fetched data
            setActaReunion(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error al obtener los datos de la API:', error);
        }
        setIsLoadingSmall(false);
    };

    useEffect(() => {
        fetchData(idLineaActa);
    }, [setIsLoadingSmall, projectId]);

    const handleChangeDate = (event) => {
        setDateValue(event.target.value);
    };

    const handleChangeTime = (event) => {
        setTimeValue(event.target.value);
    };

    useEffect(() => {
        if (actaReunion) {
            setTitleValue(actaReunion.lineaActaReunion.nombreReunion);
        }
    }, [actaReunion]);

// *********************************************************************************************
// Validations
// *********************************************************************************************
    const [fieldsEmpty, setFieldsEmpty] = useState(false);

    function verifyFieldsEmpty() {
        return (
            titleValue === "" ||
            dateValue === "" ||
            timeValue === "" ||
            motiveValue === ""
        );
    }

    function getMinDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Los meses se indexan a partir de 0
        const day = today.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    /*
    const fechaISO = actaReunion.lineaActaReunion.fechaReunion;
    const fecha = new Date(fechaISO);
    const fechaLocal = fecha.toISOString().split('T')[0];
    */

    function getMinTime() {
        const today = new Date();
        const selectedDate = new Date(dateValue);
        const currentTime = today.getHours() * 60 + today.getMinutes();

        if (
            selectedDate.getDate() === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear()
        ) {
            const selectedTime = parseInt(timeValue.split(":")[0]) * 60 + parseInt(timeValue.split(":")[1]);
            if (selectedTime < currentTime) {
                // Muestra un mensaje de advertencia si la hora elegida es anterior a la hora actual
                return "00:00";
            }
        }
        // Si la fecha seleccionada es hoy y la hora es actual o posterior, o cualquier otra fecha, no hay restricciones
        return "00:00";
    }

// *********************************************************************************************
// Handlers of Topics, Agreements and Comments
// *********************************************************************************************
    const [listTemas, setListTemas] = useState([{index: 1, data: ''}]);
    const [listAcuerdos, setListAcuerdos] = useState([{index: 1, data: ''}]);
    const [listComentarios, setListComentarios] = useState([{index: 1, data: ''}]);

    const [numeroTemas, setNumeroTemas] = useState([]);

    useEffect(() => {
        if (actaReunion
            && actaReunion.lineaActaReunion
            && actaReunion.lineaActaReunion.temasReunion)
        {
            const temas = actaReunion.lineaActaReunion.temasReunion.map((_, index) => ({
                descripcion: `Tema ${index + 1}`
            }));
            setNumeroTemas(temas);
            setListTemas(actaReunion.lineaActaReunion.temasReunion);
        }
    }, [actaReunion]);


    useEffect(() => {
        if (actaReunion
            && actaReunion.lineaActaReunion
            && actaReunion.lineaActaReunion.comentarios) {
            setListComentarios(actaReunion.lineaActaReunion.comentarios);
            setDateValue(actaReunion.lineaActaReunion.fechaReunion.split("T")[0]);
            setTimeValue(actaReunion.lineaActaReunion.horaReunion.substring(0, 5));
            setMotiveValue(actaReunion.lineaActaReunion.motivo);
        }
    }, [actaReunion]);


    const handleAddTema = ()=>{
        const newList_T =  [
            ...listTemas,
            {
                index: listTemas.length + 1,
                data: ''
            }
        ];
        setListTemas(newList_T);
    }

    const handleAddAcuerdo = ()=>{
        const newList_A =  [
            ...listAcuerdos,
            {
                index: listAcuerdos.length + 1,
                data: ''
            }
        ];
        setListAcuerdos(newList_A);
    }

    const handleAddComentario = ()=>{
        const newList_C =  [
            ...listComentarios,
            {
                index: listComentarios.length + 1,
                data: ''
            }
        ];
        setListComentarios(newList_C);
    }

    const handleChangeTema = (e, index) => {
        const updatedEntregables = [...listTemas];
        updatedEntregables[index - 1].data = e.target.value;
        console.log(updatedEntregables);
        setListTemas(updatedEntregables);
    };

    const handleChangeAcuerdo = (e, index) => {
        const updatedEntregables = [...listAcuerdos];
        updatedEntregables[index - 1].data = e.target.value;
        console.log(updatedEntregables);
        setListAcuerdos(updatedEntregables);
    };

    const handleChangeComentario = (e, index) => {
        const updatedEntregables = [...listComentarios];
        updatedEntregables[index - 1].data = e.target.value;
        console.log(updatedEntregables);
        setListComentarios(updatedEntregables);
    };

    const handleRemoveTema = (index) => {
        const updatedEntregables = [...listTemas];
        updatedEntregables.splice(index - 1, 1); // Remove the element at the given index
        for (let i = index - 1; i < updatedEntregables.length; i++) {
            updatedEntregables[i].index = updatedEntregables[i].index - 1;
        }
        console.log(updatedEntregables);
        setListTemas(updatedEntregables);
    }

    const handleRemoveAcuerdo = (index) => {
        const updatedEntregables = [...listAcuerdos];
        updatedEntregables.splice(index - 1, 1); // Remove the element at the given index
        for (let i = index - 1; i < updatedEntregables.length; i++) {
            updatedEntregables[i].index = updatedEntregables[i].index - 1;
        }
        console.log(updatedEntregables);
        setListAcuerdos(updatedEntregables);
    }

    const handleRemoveComentario = (index) => {
        const updatedEntregables = [...listComentarios];
        updatedEntregables.splice(index - 1, 1); // Remove the element at the given index
        for (let i = index - 1; i < updatedEntregables.length; i++) {
            updatedEntregables[i].index = updatedEntregables[i].index - 1;
        }
        console.log(updatedEntregables);
        setListComentarios(updatedEntregables);
    }

// *********************************************************************************************
// About User Information
// *********************************************************************************************
    const [datosUsuario, setDatosUsuario] = useState({
        idUsuario: "",
        nombres: "",
        apellidos: "",
        correoElectronico: "",
    });

    useEffect(() => {
        const stringURL = process.env.NEXT_PUBLIC_BACKEND_URL+"/api/usuario/verInfoUsuario";

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

// *********************************************************************************************
// About Convenor and Metting Members
// *********************************************************************************************
    const [convocante, setConvocante] = useState(datosUsuario);

    // For convocante to have datosUsuario
    useEffect(() => {
        setConvocante(datosUsuario);
    }, [datosUsuario]);

    // Modal1: Choose convenor. Modal2: Choose participants
    const [modal1, setModal1] = useState(false);
    const [selectedConvocanteList, setSelectedConvocanteList] = useState([]);
    const [selectedMiembrosList, setSelectedMiembrosList] = useState([]);
    const [modal2, setModal2] = useState(false);

    const toggleModal1 = () => {
        setModal1(!modal1);
    }

    const toggleModal2 = () => {
        setModal2(!modal2);
    };

    // Modal1 returns a list of only one object
    const returnListConvocante = (newMiembrosList) => {
        const nuevoConvocante = newMiembrosList[0];

        const newMembrsList = [...selectedConvocanteList, ...newMiembrosList];
        setSelectedConvocanteList(newMembrsList);
        setModal1(!modal1);

        if (newMiembrosList.length > 0) {
            setConvocante(nuevoConvocante);
        }
    }

    const resetConvocante = () => {
        setConvocante(datosUsuario);
    };

    const returnListOfMiembros = (newMiembrosList) => {
        const newMembrsList = [...selectedMiembrosList, ...newMiembrosList];

        setSelectedMiembrosList(newMembrsList);
        setModal2(!modal2);
    };

    const removeMiembro = (miembro) => {
        const newMembrsList = selectedMiembrosList.filter(
            (item) => item.id !== miembro.id
        );
        setSelectedMiembrosList(newMembrsList);
        console.log(newMembrsList);
    };

    const [isLoading, setIsLoading] = useState(true);


// *********************************************************************************************
// Searching Meeting Record ID
// *********************************************************************************************
    const [meetingId, setMeetingId] = useState("");

    useEffect(() => {
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/actaReunion/listarActaReunionXIdProyecto/" + projectId;
        console.log("La URL es" + stringURL);

        axios
            .get(stringURL)
            .then(function (response) {
                console.log("Listando ActasReunion. Respuesta del servidor:", response.data);
                const dataActa = response.data.data;
                console.log("El ID del Acta de Reunion es: ", dataActa.idActaReunion);
                setMeetingId(dataActa.idActaReunion);
                setIsLoading(false);
                setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);
// *********************************************************************************************
// Handle Participants
// *********************************************************************************************
    const [participantes, setParticipantes] = useState([]);

    useEffect(() => {
        if (actaReunion
            && actaReunion.lineaActaReunion
            && actaReunion.lineaActaReunion.participantesXReunion) {
            const participantesTransformados =
                actaReunion.lineaActaReunion.participantesXReunion.map(participante => {
                    return {
                        idUsuario: participante.idUsuario,
                        nombreCompleto: `${participante.nombres} ${participante.apellidos}`,
                        asistio: false,
                    };
                });
            setParticipantes(participantesTransformados);
        }
    }, [actaReunion]);

    const handleAsistenciaChange = (idUsuario) => {
        const nuevosParticipantes = participantes.map(participante => {
            if (participante.idUsuario === idUsuario) {
                return { ...participante, asistio: !participante.asistio };
            }
            return participante;
        });
        setParticipantes(nuevosParticipantes);
    };

    const handleBorrarParticipante = (idUsuario) => {
        const nuevosParticipantes = participantes.filter(participante => participante.idUsuario !== idUsuario);
        setParticipantes(nuevosParticipantes);
    };

// *********************************************************************************************
// Page
// *********************************************************************************************
    return (
        <div className="newMeetingArticle">
            <Spacer y={4}></Spacer>
            <HeaderWithButtons haveReturn={true}
                               haveAddNew={false}
                               hrefToReturn={'/dashboard/' + projectName+'='+projectId + '/actaReunion'}
                               hrefForButton={'/dashboard/' + projectName+'='+projectId + '/actaReunion'}
                               breadcrump={'Inicio / Proyectos / ' + projectName + ' / Acta de Reunion / Editar Reunion'}
                               btnText={'Volver'}>Editar Acta de Reunion</HeaderWithButtons>
            <div style={{ padding: '10px' }}>
                <button onClick={toggleEditMode}>
                    {isEditMode ? 'Guardar Cambios' : 'Editar'}
                </button>
            </div>
            <div className="body m-5 mt-5">
                <div className="mainInfo">
                    <Card className="p-5 pt-3">
                        <CardBody>
                            {/*
                            <div className="lineMeetingTitle">
                                <h1>Reunión para ver temas de gastos</h1>
                            </div>
                            */}
                            {actaReunion && (
                                <Input
                                    className="max-w-[1000px]"
                                    isRequired
                                    key="meetingTitle"
                                    size="lg"
                                    type="title"
                                    label="Título de Reunión"
                                    labelPlacement="outside"
                                    placeholder="Ingrese el título de reunión (Ej: Reunión para ver temas de gastos)"
                                    value={isEditMode ? titleValue : actaReunion.lineaActaReunion.nombreReunion}
                                    isReadOnly={!isEditMode}
                                    onValueChange={setTitleValue}
                                />
                            )}


                            <p className=" convenourTitle mt-5 mb-1 font-medium">Reunión convocada por</p>
                            <div className="userSelection flex items-center">
                                {actaReunion && (
                                    <p className="ml-2 font-medium text-gray-400 ">
                                        {actaReunion.lineaActaReunion.nombreConvocante}
                                    </p>
                                )}
                                {/* Guardar para modo editar
                                <button
                                    onClick={toggleModal1}
                                    className="ml-3 bg-[#f0ae19] text-white w-8 h-8
                                        rounded-full">
                                    <img src="/icons/icon-searchBar.svg"/>
                                </button>

                                {modal1 && (
                                <ModalUsersOne
                                    listAllUsers={false}
                                    handlerModalClose={toggleModal1}
                                    handlerModalFinished={returnListConvocante}
                                    excludedUsers={selectedConvocanteList}
                                    idProyecto={projectId}
                                ></ModalUsersOne>
                                )}
                            </div>
                            <div>
                                {convocante !== datosUsuario && (
                                    <p className="changeConvocanteText" onClick={resetConvocante}>
                                    Quiero ser el convocante
                                    </p>
                                )}
                            */}
                            </div>

                            <div className="dateAndTimeLine flex items-center gap-10">
                                <div className="dateShow">
                                    <p className=" dateShowTitle mt-5 font-medium">Fecha</p>
                                    {/*<p className="dateShowing">27/10/2023</p>*/}
                                    {actaReunion && actaReunion.lineaActaReunion && (
                                        <input
                                            type="date"
                                            id="datePicker"
                                            name="datePicker"
                                            min={getMinDate()}
                                            value={isEditMode ? dateValue : actaReunion.lineaActaReunion.fechaReunion.split("T")[0]}
                                            onChange={handleChangeDate}
                                            readOnly={!isEditMode}
                                        ></input>
                                    )}

                                </div>
                                <div className="timeShow">
                                    <p className="timeShowTitle mt-5 ml-5 font-medium">Hora</p>
                                    {/*<p className="timeShowing">13:32 pm</p>*/}
                                    {actaReunion && actaReunion.lineaActaReunion && (
                                        <input
                                            type="time"
                                            id="timePicker"
                                            name="timePicker"
                                            min={getMinTime()}
                                            value={isEditMode ? timeValue : actaReunion.lineaActaReunion.horaReunion.substring(0, 5)}
                                            readOnly={!isEditMode}
                                            onChange={handleChangeTime}
                                        ></input>
                                    )}
                                </div>
                            </div>
                            <div className="meetingMotive">
                                <h2 className="font-medium">Motivo</h2>
                                {actaReunion && (
                                    <Input
                                        className="max-w-[1000px] mt-5"
                                        isRequired
                                        key="meetingMotive"
                                        size="lg"
                                        type="title"
                                        labelPlacement="outside"
                                        placeholder="Ingrese el motivo de la reunion"
                                        value={isEditMode ? motiveValue : actaReunion.lineaActaReunion.motivo}
                                        isReadOnly={!isEditMode}
                                        onValueChange={setMotiveValue}
                                    />
                                )}

                            </div>
                        </CardBody>
                        <CardFooter>
                        </CardFooter>
                    </Card>

                </div>
                <br /><br />
                <div className="invitedPeople p-5 ">
                    <Card className="mx-auto">
                        <CardHeader className="pt-5 pl-5 pb-2 mb-0 text-lg
                            font-bold text-blue-950 font-sans">
                            <h3>Personas Convocadas</h3>
                        </CardHeader>
                        <CardBody className="py-0 mt-0 ml-2">
                            <div className="flex justify-between mb-2">
                                <span className="text-mg font-semibold">Lista de Miembros</span>
                                <span className="text-mg font-semibold mr-6">Asistencia</span>
                            </div>
                            {participantes.map(participante => (
                                <div
                                    key={participante.idUsuario}
                                    className="flex justify-between items-center p-2 rounded-lg"
                                >
                                    <span className="text-gray-700">{participante.nombreCompleto}</span>
                                    <div className="flex items-center">
                                        <Checkbox
                                            isSelected={participante.asistio}
                                            onValueChange={() => handleAsistenciaChange(participante.idUsuario)}
                                            className="mr-4"
                                        >
                                        </Checkbox>
                                        <button
                                            onClick={() => handleBorrarParticipante(participante.idUsuario)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            X
                                        </button>
                                    </div>

                                </div>
                            ))}
                            {/*
                            <p>Lista de Miembros</p>
                            {/**** Selector de Miembros *****
                            <div className="SelectedUsersContainer">
                                <div
                                    className="containerToPopUpUsrSearch"
                                    style={{ width: '80%', padding: '0.2rem 0' }}
                                    onClick={toggleModal2}
                                >
                                    <p>Buscar nuevo participante</p>
                                    <img
                                        src="/icons/icon-searchBar.svg"
                                        alt=""
                                        className="icnSearch"
                                        style={{ width: '20px' }}
                                    />
                                </div>

                                <ul className="listUsersContainer"
                                style={{ width: '80%', padding: '0.2rem 0' }}>
                                    {selectedMiembrosList.map((component) => {
                                        return (
                                            <CardSelectedUser
                                                key={component.id}
                                                name={component.name}
                                                lastName={component.lastName}
                                                usuarioObject={component}
                                                email={component.email}
                                                removeHandler={removeMiembro}
                                            ></CardSelectedUser>
                                        );
                                    })}
                                </ul>
                            </div>
                            {modal2 && (
                                <ModalUsers
                                    idProyecto={projectId}
                                    handlerModalClose={toggleModal2}
                                    handlerModalFinished={returnListOfMiembros}
                                    excludedUsers={selectedMiembrosList}
                                ></ModalUsers>
                            )}
                            {/* Fin del selector de miembros */}
                        </CardBody>
                        <CardFooter></CardFooter>
                    </Card>
                </div>

                <div className="meetingTopics p-5">
                    <Card className="mx-auto">
                        <CardHeader>
                            <div className="flex flex-col p-2">
                                <h3 className="text-lg font-bold text-blue-950 font-sans mb-1">
                                    Temas a tratar
                                </h3>
                                <p className="littleComment ml-2 text-small text-default-500">
                                    ¿De qué temas se hablará en la reunión? ¡Asegúrate de ser claro!
                                </p>
                            </div>
                            <button
                                onClick={handleAddTema}
                                className="bg-[#f0ae19] text-white w-8 h-8
                                rounded-full absolute right-4 top-4 cursor-pointer
                                transform transition-transform hover:-translate-y-1 hover:shadow-md">
                                <span className="text-xl" style={{ fontSize: '30px' }}>+</span>
                            </button>

                        </CardHeader>
                        <CardBody className="mt-0 py-0 pl-8">
                            <div className="topicsContainer">
                                <ListEditableInput
                                    beEditable={true}
                                    handleChanges={handleChangeTema}
                                    handleRemove={handleRemoveTema}
                                    ListInputs={listTemas}
                                    typeFault="temas"
                                    typeName="Tema">
                                </ListEditableInput>
                            </div>
                        </CardBody>
                        <CardFooter></CardFooter>
                    </Card>
                </div>

                <div className="agreements p-5">
                    <Card className="mx-auto">
                        <CardHeader>
                            <div className="flex flex-col p-2">
                                <h3 className="text-lg font-bold text-blue-950 font-sans mb-1">
                                    Acuerdos
                                </h3>
                                <p className="littleComment ml-2 text-small text-default-500">
                                    ¿A que acuerdos se llegaron en la reunión? ¡Recuerda ser responsable y razonable!
                                </p>
                            </div>
                            <button
                                onClick={handleAddAcuerdo}
                                className="bg-[#f0ae19] text-white w-8 h-8
                                rounded-full absolute right-4 top-4 cursor-pointer
                                transform transition-transform hover:-translate-y-1 hover:shadow-md">
                                <span className="text-xl" style={{ fontSize: '30px' }}>+</span>
                            </button>
                        </CardHeader>
                        <CardBody className="mt-0 py-0 pl-8">
                            <div className="topicsContainer">
                                <AcuerdosListEditableInput
                                    beEditable={true}
                                    handleChanges={handleChangeAcuerdo}
                                    handleRemove={handleRemoveAcuerdo}
                                    ListInputs={listAcuerdos}
                                    temas={numeroTemas}
                                    typeName="Acuerdo">
                                </AcuerdosListEditableInput>
                            </div>
                        </CardBody>
                        <CardFooter></CardFooter>
                    </Card>
                </div>

                <div className="pendingComments p-5">
                    <Card className="mx-auto">
                        <CardHeader>
                            <div className="flex flex-col p-2">
                                <h3 className="text-lg font-bold text-blue-950 font-sans mb-1">
                                    Comentarios Pendientes
                                </h3>
                                <p className="littleComment ml-2 text-small text-default-500">
                                    ¿Aún tienes algo que acotar?
                                </p>
                            </div>
                            <button
                                onClick={handleAddComentario}
                                className="bg-[#f0ae19] text-white w-8 h-8
                                rounded-full absolute right-4 top-4 cursor-pointer
                                transform transition-transform hover:-translate-y-1 hover:shadow-md">
                                <span className="text-xl" style={{ fontSize: '30px' }}>+</span>
                            </button>
                        </CardHeader>
                        <CardBody className="mt-0 py-0 pl-8">
                            <div className="topicsContainer">
                                <ListEditableInput
                                    beEditable={true}
                                    handleChanges={handleChangeComentario}
                                    handleRemove={handleRemoveComentario}
                                    ListInputs={listComentarios}
                                    typeFault="comentarios"
                                    typeName="Comentario">
                                </ListEditableInput>
                            </div>
                        </CardBody>
                        <CardFooter></CardFooter>
                    </Card>
                </div>

            </div>

            <div className="footer">
                <div className="containerBottom">
                    {fieldsEmpty && (
                        <IconLabel
                            icon="/icons/alert.svg"
                            label="Faltan completar campos"
                            className="iconLabel3"
                        />
                    )}
                    {/*}
                    {getMinTime() === "00:00" && (
                        <IconLabel
                            icon="/icons/alert.svg"
                            label="Elige una hora apropiada"
                            className="iconLabel3"
                        />
                    )}
                    */}
                </div>
                <div className="twoButtons1">
                    <div className="buttonContainer">
                        <Modal
                            nameButton="Descartar"
                            textHeader="Descartar Registro"
                            textBody="¿Seguro que quiere descartar el registro de el Acta de Reunión?"
                            colorButton="w-36 bg-slate-100 text-black font-semibold"
                            oneButton={false}
                            secondAction={() => router.back()}
                            textColor="red"
                        />
                        <Modal
                            nameButton="Aceptar"
                            textHeader="Registrar Acta de Reunión"
                            textBody="¿Seguro que quiere registrar el Acta de Reunión?"
                            colorButton="w-36 bg-blue-950 text-white font-semibold"
                            oneButton={false}
                            secondAction={() => {
                                //createMeeting();
                                router.back();
                            }}
                            textColor="blue"
                            verifyFunction={() => {
                                if (verifyFieldsEmpty()) {
                                    setFieldsEmpty(true);
                                    return false;
                                } else {
                                    setFieldsEmpty(false);
                                    return true;
                                }
                            }}
                        />
                    </div>
                </div>

            </div>

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </div>
    )
}