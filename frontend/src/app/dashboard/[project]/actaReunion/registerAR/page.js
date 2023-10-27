"use client"

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import { SmallLoadingScreen } from "../../layout";

import { useRouter } from "next/navigation";
import {
    Input,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button, Spacer,
} from "@nextui-org/react";

import ModalUsersOne from "@/components/ModalUsersOne";
import ModalUsers from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ChoiceUser.css";
import "@/styles/dashboardStyles/projectStyles/actaReunionStyles/CrearActaReunion.css";
import CardSelectedUser from "@/components/CardSelectedUser";

import ListEditableInput from "@/components/dashboardComps/projectComps/EDTComps/ListEditableInput";
import ButtonAddNew from "@/components/dashboardComps/projectComps/EDTComps/ButtonAddNew";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";

import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";

axios.defaults.withCredentials = true;

export default function crearActaReunion(props) {
// *********************************************************************************************
// Various Variables
// *********************************************************************************************
// Router. Helps you to move between pages
const router = useRouter();

// Project Info
const decodedUrl = decodeURIComponent(props.params.project);
const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

// Loading Window
const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
setIsLoadingSmall(false);

// Edit Mode: False for New Meeting, True for Edit Meeting
const [isEditMode, setIsEditMode] = useState(false);

//Vital Data for Creating Meeting
const [titleValue, setTitleValue] = useState("");
const [motiveValue, setMotiveValue] = useState("");
const [dateValue, setDateValue] = useState(""); 
const [timeValue, setTimeValue] = useState(""); 

const handleChangeDate = (event) => {
    setDateValue(event.target.value);
};

const handleChangeTime = (event) => {
    setTimeValue(event.target.value);
};

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
// Creating a Meeting Record Line
// *********************************************************************************************
    const createMeeting = () => {
       // const idActaReunion = meetingId;
        const idActaReunion = 29;
        const nombreReunion = titleValue;
        const fechaReunion = dateValue;
        const horaReunion = timeValue;
        const motivo = motiveValue;
        const nombreConvocante = convocante.nombres + convocante.apellidos;
        const temas = [];
        const participantes = selectedMiembrosList.map(
            (participante) => {
                return { 
                    idUsuarioXRolXProyecto: participante.idUsuario,
                    asistio: false,
                    };
            }
        );
        const comentarios = [];
        
        console.log("Titulo de Reunion: ", nombreReunion);
        console.log("Convocante de Reunion: ", nombreConvocante);
        console.log("Fecha de Reunion: ", fechaReunion);
        console.log("Hora de Reunion: ", horaReunion);
        console.log("Motivo de Reunion: ", motivo);
        console.log("Participantes: ", participantes);

        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/actaReunion/crearLineaActaReunion",
                {
                    idActaReunion: idActaReunion,
                    nombreReunion: nombreReunion,
                    fechaReunion: fechaReunion,
                    horaReunion: horaReunion,
                    nombreConvocante: nombreConvocante,
                    
                    motivo: motivo,
                    temas: temas,
                    participantes: participantes,
                    comentarios: comentarios,
                    
                }
            )
            .then(function (response) {
                console.log(response);
                console.log("Conexion correcta");
                router.back();
            })
            .catch(function (error) {
                console.log(error);
            });
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
                               breadcrump={'Inicio / Proyectos / ' + projectName + ' / Acta de Reunion / Nueva Reunion'}
                               btnText={'Volver'}>Crear Acta de Reunion</HeaderWithButtons>
            <div className="body m-5 mt-5">
                <div className="mainInfo">
                    <Card className="p-5 pt-3">
                        <CardBody>
                            <Input 
                                className="max-w-[1000px]"
                                isRequired
                                key="meetingTitle"
                                size="lg" 
                                type="title" 
                                label="Título de Reunión" 
                                labelPlacement="outside"
                                placeholder="Ingrese el título de reunión (Ej: Reunión para ver temas de gastos)"
                                value={titleValue}
                                onValueChange={setTitleValue} 
                            />
                            <p className="mt-5 mb-1 text-black text-sm font-medium">Reunión convocada por</p>
                            <div className="userSelection flex items-center">
                                <p className="ml-2 font-medium text-gray-400 ">
                                    {convocante.nombres} {convocante.apellidos}
                                </p>
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
                            </div>
                                
                            <div className="dateAndTimeLine">
                                <p className="mt-5 mb-1 text-black text-sm font-medium">Fecha y Hora de la Reunión</p>
                                {/*}
                                <input 
                                    type="datetime-local" 
                                    id="datetimePicker" 
                                    name="datetimePicker" 
                                    onChange={handleChangeFechaHora}>
                                </input>
                                */}
                                <input
                                    type="date"
                                    id="datePicker"
                                    name="datePicker"
                                    min={getMinDate()}
                                    value={dateValue}
                                    onChange={handleChangeDate}
                                ></input>
                                <input
                                    type="time"
                                    id="timePicker"
                                    name="timePicker"
                                    min={getMinTime()}
                                    value={timeValue}
                                    onChange={handleChangeTime}
                                ></input>
                            </div>
                            <Input 
                                className="max-w-[1000px] mt-5"
                                isRequired
                                key="meetingMotive"
                                size="lg" 
                                type="title" 
                                label="Motivo" 
                                labelPlacement="outside"
                                placeholder="Ingrese el motivo de la reunion"
                                value={motiveValue}
                                onValueChange={setMotiveValue} 
                            />
                        </CardBody>
                        <CardFooter>
                            <div className="mandatoryAdvise p-2">
                                <img src="/icons/alert.svg"/>
                                <p>Recuerda que todos estos campos son obligatorios para crear un Acta de Reunión</p>
                            </div>
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
                            <p>Lista de Miembros</p>
                            {/**** Selector de Miembros ***** */}
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
                                                isEditable={true}
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
                {/*
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
                                <ListEditableInput 
                                    beEditable={true} 
                                    handleChanges={handleChangeAcuerdo}
                                    handleRemove={handleRemoveAcuerdo}
                                    ListInputs={listAcuerdos} 
                                    typeName="Acuerdo">
                                </ListEditableInput>
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
                </div>
                    */}
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
                                    createMeeting();
                                    router.push(`/dashboard/${projectName}=${projectId}/actaReunion`);
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
            {/*}
            <div className="ButtonsContainer mb-5">
                {verifyFieldsEmpty
                    && <p className="error-text mt-3">Faltan llenar campos</p>}
                <Button color="primary" variant="bordered">Cancelar</Button>
                <Button color="primary" 
                    isDisabled={verifyFieldsEmpty}
                    >Crear</Button>
            </div>
                */}
        </div>
    )
}