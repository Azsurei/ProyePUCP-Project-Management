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
    Checkbox,
} from "@nextui-org/react";
import ModalUsersOne from "@/components/ModalUsersOne";
import ModalUsers from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ChoiceUser.css";
import "@/styles/dashboardStyles/projectStyles/actaReunionStyles/LineaActaReunion.css";

import ListEditableInput from "@/components/dashboardComps/projectComps/EDTComps/ListEditableInput";

import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import { TopicEditableList } from "@/components/dashboardComps/projectComps/actaReunionComps/TopicsEditableList";

import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
import { is } from "date-fns/locale";

axios.defaults.withCredentials = true;

export default function editarActaReunion(props) {



// *********************************************************************************************
// Variables
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
    const [isEditMode, setIsEditMode] = useState(true);
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };
// Verificar si hay cambios. Para tener edit mode siempre activo.
    const [hasChanges, setHasChanges] = useState(false);

//Vital Data for Creating Meeting
    const [titleValue, setTitleValue] = useState("");
    const [motiveValue, setMotiveValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [timeValue, setTimeValue] = useState("");

// *********************************************************************************************
// Obtener Línea de Acta de Reunión
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

    useEffect(() => {
        if (actaReunion) {
            setTitleValue(actaReunion.lineaActaReunion.nombreReunion);
            setMotiveValue(actaReunion.lineaActaReunion.motivo)
        }
    }, [actaReunion]);

    const handleChangeTitle = (e) => {
        setTitleValue(e.target.value);
        setHasChanges(true);
    }

    const handleChangeDate = (event) => {
        setDateValue(event.target.value);
        setHasChanges(true);
    };

    const handleChangeTime = (event) => {
        setTimeValue(event.target.value);
        setHasChanges(true);
    };

    const handleChangeMotive= (e) => {
        setMotiveValue(e.target.value);
        setHasChanges(true);
    }

// *********************************************************************************************
// Validaciones
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
// Handlers de Temas y Comentarios (Acuerdos se maneja dentro de TopicEditableList)
// *********************************************************************************************
    const [listTemas, setListTemas] = useState([{index: 1, data: ''}]);
    //const [listAcuerdos, setListAcuerdos] = useState([{index: 1, data: ''}]);
    const [listComentarios, setListComentarios] = useState([{index: 1, data: ''}]);


    useEffect(() => {
        if (actaReunion
            && actaReunion.lineaActaReunion
            && actaReunion.lineaActaReunion.temasReunion)
        {
            setListTemas(actaReunion.lineaActaReunion.temasReunion);
        }
    }, [actaReunion]);

// *********************************************************************************************
// Valores Iniciales
// *********************************************************************************************
    useEffect(() => {
        if (actaReunion && actaReunion.lineaActaReunion) {
            console.log("Datos Iniciales");

            if(actaReunion.lineaActaReunion.nombreReunion){
                setTitleValue(actaReunion.lineaActaReunion.nombreReunion);
                console.log("-- Titulo de Reunion ", titleValue);
            }

            if(actaReunion.lineaActaReunion.fechaReunion){
                setDateValue(actaReunion.lineaActaReunion.fechaReunion.split("T")[0]);
                console.log("-- Fecha de Reunion ", dateValue);
            }

            if(actaReunion.lineaActaReunion.horaReunion){
                setTimeValue(actaReunion.lineaActaReunion.horaReunion.substring(0, 5));
                console.log("-- Hora de Reunion ", timeValue);
            }

            if(actaReunion.lineaActaReunion.motivo){
                setMotiveValue(actaReunion.lineaActaReunion.motivo);
                console.log("-- Motivo de Reunion", motiveValue);
            }
            if(actaReunion.lineaActaReunion.temasReunion){
                console.log("-- Acuerdos del tema", actaReunion.lineaActaReunion.temasReunion.acuerdos);
                const temasConData = 
                    actaReunion.lineaActaReunion.temasReunion.map(({descripcion, acuerdos, ...tema}, index) => ({
                        ...tema,
                        index: index + 1,
                        data: descripcion,
                        acuerdos: tema.acuerdos ? 
                            tema.acuerdos.map(({descripcion, fechaObjetivo, ...acuerdo}) => ({
                                ...acuerdo,
                                data: descripcion,
                                date: fechaObjetivo
                            })) : [],
                    }))
                setListTemas(temasConData);
                console.log("-- Temas de Reunion", listTemas);
            }

            if(actaReunion.lineaActaReunion.comentarios) {
                const comentariosConData = 
                    actaReunion.lineaActaReunion.comentarios.map(({ descripcion, ...comentario }) => ({
                        ...comentario, 
                        data: descripcion, 
                }));
                setListComentarios(comentariosConData);
                console.log("-- Comentarios de Reunion", listComentarios);
            }     
        }
    }, [actaReunion]);


    const handleAddTema = ()=>{
        const newList_T =  [
            ...listTemas,
            {
                index: listTemas.length + 1,
                data: '',
                acuerdos: [],
            }
        ];
        setListTemas(newList_T);
        setHasChanges(true);
    }

    const updateAcuerdos = (indexTema, nuevosAcuerdos) => {
        const temasActualizados = [...listTemas];
        temasActualizados[indexTema].acuerdos = nuevosAcuerdos;
        setListTemas(temasActualizados);
        setHasChanges(true);
    };

    const handleAddComentario = ()=>{
        const newList_C =  [
            ...listComentarios,
            {
                index: listComentarios.length + 1,
                data: ''
            }
        ];
        setListComentarios(newList_C);
        setHasChanges(true);
    }

    const handleChangeTema = (e, index) => {
        const updatedEntregables = [...listTemas];
        updatedEntregables[index - 1].data = e.target.value;
        //console.log(updatedEntregables);
        setListTemas(updatedEntregables);
        setHasChanges(true);
    };

    const handleChangeComentario = (e, index) => {
        const updatedEntregables = [...listComentarios];
        updatedEntregables[index - 1].data = e.target.value;
        console.log("Comentario cambiado", updatedEntregables);
        setListComentarios(updatedEntregables);
        setHasChanges(true);
    };

    const handleRemoveTema = (index) => {
        const updatedEntregables = [...listTemas];
        updatedEntregables.splice(index - 1, 1); 
        for (let i = index - 1; i < updatedEntregables.length; i++) {
            updatedEntregables[i].index = updatedEntregables[i].index - 1;
        }
        console.log("Tema Removido", updatedEntregables);
        setListTemas(updatedEntregables);
        setHasChanges(true);
    }

    const handleRemoveComentario = (index) => {
        const updatedEntregables = [...listComentarios];
        updatedEntregables.splice(index - 1, 1);
        for (let i = index - 1; i < updatedEntregables.length; i++) {
            updatedEntregables[i].index = updatedEntregables[i].index - 1;
        }
        console.log("Comentario Removido", updatedEntregables);
        setListComentarios(updatedEntregables);
        setHasChanges(true);
    }

// *********************************************************************************************
// Información del Usuario
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
// Acerca del convocante
// *********************************************************************************************
    const [convocante, setConvocante] = useState(datosUsuario);

    // For convocante to have datosUsuario
    useEffect(() => {
        setConvocante(datosUsuario);
    }, [datosUsuario]);

    // Modal1: Choose convenor. Modal2: Choose participants
    const [modal1, setModal1] = useState(false);
    const [selectedConvocanteList, setSelectedConvocanteList] = useState([]);
    //const [selectedMiembrosList, setSelectedMiembrosList] = useState([]);
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

    const [isLoading, setIsLoading] = useState(true);

// *********************************************************************************************
// Manejar Participantes
// *********************************************************************************************
    const [participantsList, setParticipantsList] = useState([]);

    useEffect(() => {
        if (actaReunion
            && actaReunion.lineaActaReunion
            && actaReunion.lineaActaReunion.participantesXReunion) {
                setParticipantsList(actaReunion.lineaActaReunion.participantesXReunion);
                console.log("Los participantes son ", participantsList);
            }
    }, [actaReunion]);

    const handleCheckboxChange = (index, checked) => {
        const newParticipantsList = [...participantsList];
        newParticipantsList[index].asistio = checked;
        setParticipantsList(newParticipantsList);
        setHasChanges(true);
    };
/*
    const handleAsistenciaChange = (participante) => {
        const nuevosParticipantes = participantsList.map(
            (item) => {
            if (item.idUsuario === participante.idUsuario) {
                return { ...participante, asistio: !participante.asistio };
            }
            return item;
        });
        setParticipantsList(nuevosParticipantes);
    };
*/
    const handleBorrarParticipante = (participante) => {
        const nuevosParticipantes = participantsList.filter(
            (item) => item.idUsuario !== participante.idUsuario
        );
        setParticipantsList(nuevosParticipantes);
        console.log("Muestra Participantes");
        console.log(participantsList);
        setHasChanges(true);
    };

    const returnListParticipantes = (newParticipantes) => {
        const newList = [...participantsList, ...newParticipantes];
        setParticipantsList(newList);
        setModal2(!modal2);
    }

// *********************************************************************************************
//  Editar Acta de Reunión (Función Principal)
// *********************************************************************************************
    const saveMeetingChanges = () => {
        const idLineaActaReunion = idLineaActa;
        const nombreReunion = titleValue;
        const fechaReunion = dateValue;
        const horaReunion = timeValue;
        const motivo = motiveValue;
        const nombreConvocante = convocante.nombres + " " + convocante.apellidos;
        const temas = listTemas.map((tema) => ({
            descripcion: tema.data,
            acuerdos: tema.acuerdos.map((acuerdo) => ({
                idAcuerdo: acuerdo.idAcuerdo,
                descripcion: acuerdo.data,
                //idTemaReunion: tema.idTemaReunion,
                fechaObjetivo: acuerdo.date,
                responsables: acuerdo.responsables.map(responsable => ({
                    idUsuarioXRolXProyecto: responsable.idUsuario
                }))
            }))
        }));
        const participantes = participantsList.map(participante => ({
            idUsuarioXRolXProyecto: participante.idUsuario,
            asistio: participante.asistio ?? false,
        }));
        const comentarios = listComentarios.map((comentario) => ({ 
            //...comentario,
            descripcion: comentario.data,
        }));

        const meetingLine = {
            idLineaActaReunion,
            nombreReunion,
            fechaReunion,
            horaReunion,
            nombreConvocante,
            motivo,
            temas,
            participantes,
            comentarios
        };

        // Convert the meeting object to JSON format
        const meetingJSON = JSON.stringify(meetingLine, null, 2);
        console.log("Id de esta Linea: ", actaReunion.lineaActaReunion.idLineaActaReunion);
        // Now you can save meetingJSON to a file or send it in a request
        console.log(meetingJSON);
        console.log("Seleccionados: ",participantsList);
        console.log('id de Linea de acta reunion:', idLineaActaReunion);
        console.log("Titulo de Reunion: ", nombreReunion);
        console.log("Convocante de Reunion: ", nombreConvocante);
        console.log("Fecha de Reunion: ", fechaReunion);
        console.log("Hora de Reunion: ", horaReunion);
        console.log("Motivo de Reunion: ", motivo);
        console.log("Participantes: ", participantes);
        console.log("Temas de Reunion: ", listTemas);
        
        axios
            .put(
                process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/actaReunion/modificarLineaActaReunion",
                {
                    idLineaActaReunion: idLineaActaReunion,
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
                console.log("Se actualizó el Acta de Reunión correctamente");
                router.back();
            })
            .catch(function (error) {
                console.log(error.response);
            });
            
    };

// *********************************************************************************************
// Página
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
            <div className="flex align-end">
                {!isEditMode && (
                    <button className="btnEditar" onClick={toggleEditMode}>Editar</button>
                )}
            </div>
            <div className="body m-5 mt-5">
                <div className="mainInfo">
                    <Card className="p-5 pt-3">
                        <CardBody>
                            {actaReunion && (
                                <input 
                                    className="lineMeetingTitle"
                                    maxLength="50"    
                                    value={titleValue}
                                    placeholder="Ingrese el título de la reunión"
                                    readOnly={!isEditMode}
                                    onChange={handleChangeTitle}
                                ></input>
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
                                    <input 
                                        className="lineMeetingMotive"
                                        maxLength="200"    
                                        value={motiveValue}
                                        placeholder="Ingrese el motivo de la reunión"
                                        onChange={handleChangeMotive}
                                        readOnly={!isEditMode}
                                    ></input>
                                )}

                            </div>
                        </CardBody>
                        <CardFooter>
                        </CardFooter>
                    </Card>

                </div>
                <br /><br />
                <div className="invitedPeople p-5">
                    <Card className="mx-auto">
                        <CardHeader className="pt-5 pl-5 pb-2 mb-0 text-lg
                            font-bold text-blue-950 font-sans">
                                <div className="personasConvocadas flex align-center">
                                    <h3>Personas Convocadas</h3>
                                    {isEditMode && (
                                        <button
                                            onClick={toggleModal2}
                                            className="ml-3 bg-[#f0ae19] text-white w-8 h-8
                                                rounded-full">
                                            <img src="/icons/icon-searchBar.svg"/>
                                        </button>
                                    )}
                                </div>
                        </CardHeader>
                        <CardBody className="py-0 mt-0 ml-2">
                            <div className="flex justify-between mb-2">
                                <span className="text-mg font-semibold">Lista de Miembros</span>
                                <span className="text-mg font-semibold mr-6">Asistencia</span>
                            </div>
                            {participantsList.map((participante, index) => (
                                <div
                                    key={participante.idUsuario}
                                    className="flex justify-between items-center p-2 rounded-lg">
                                    <span className="text-gray-700">
                                        {participante.nombres} {participante.apellidos}
                                    </span>
                                    <div className="flex items-center">
                                        <Checkbox
                                            isReadOnly={!isEditMode}
                                            isSelected={participante.asistio}
                                            size="lg"
                                            onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                                            className="mr-4">
                                        </Checkbox>
                                        <button
                                            onClick={() => handleBorrarParticipante(participante)}
                                            className="text-red-500 hover:text-red-700">
                                            X
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {modal2 && (
                                <ModalUsers
                                    listAllUsers={false}
                                    idProyecto={projectId}
                                    handlerModalClose={toggleModal2}
                                    handlerModalFinished={returnListParticipantes}
                                    excludedUsers={participantsList}
                                ></ModalUsers>
                            )}
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
                            {isEditMode && (
                            <button
                                onClick={handleAddTema}
                                className="bg-[#f0ae19] text-white w-8 h-8
                                rounded-full absolute right-4 top-4 cursor-pointer
                                transform transition-transform hover:-translate-y-1 hover:shadow-md">
                                <span className="text-xl" style={{ fontSize: '30px' }}>+</span>
                            </button>
                            )}
                        </CardHeader>
                        <CardBody className="mt-0 py-0 pl-8 pb-0 mb-0">
                            <div className="topicsContainer">
                                <TopicEditableList
                                    beEditable={isEditMode}
                                    handleChanges={handleChangeTema}
                                    handleRemove={handleRemoveTema}
                                    ListInputs={listTemas}
                                    participantes={participantsList}
                                    updateAcuerdos={updateAcuerdos}
                                    editMode={isEditMode}
                                    typeFault="temas"
                                    typeName="Tema"
                                >
                                </TopicEditableList>
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
                            {isEditMode && (
                            <button
                                onClick={handleAddComentario}
                                className="bg-[#f0ae19] text-white w-8 h-8
                                rounded-full absolute right-4 top-4 cursor-pointer
                                transform transition-transform hover:-translate-y-1 hover:shadow-md">
                                <span className="text-xl" style={{ fontSize: '30px' }}>+</span>
                            </button>
                            )}
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
                </div>
                {hasChanges && (
                    <div className="twoButtons1">
                        <div className="buttonContainer">
                            <Modal
                                nameButton="Descartar"
                                textHeader="Descartar Modificación"
                                textBody="¿Seguro que quiere descartar la modificación de el Acta de Reunión?"
                                colorButton="w-36 bg-slate-100 text-black font-semibold"
                                oneButton={false}
                                secondAction={() => {
                                    toggleEditMode();
                                    router.refresh();
                                }}
                                textColor="red"
                            />
                            <Modal
                                nameButton="Aceptar"
                                textHeader="Modificar Acta de Reunión"
                                textBody="¿Seguro que quiere modificar el Acta de Reunión?"
                                colorButton="w-36 bg-blue-950 text-white font-semibold"
                                oneButton={false}
                                secondAction={() => {
                                    saveMeetingChanges();
                                    //router.back();
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
                )}
            </div>

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </div>
    )
}