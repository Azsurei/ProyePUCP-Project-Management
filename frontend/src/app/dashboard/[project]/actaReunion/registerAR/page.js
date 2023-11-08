// actaReunion/registerAR/page.js
"use client"

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import { SmallLoadingScreen } from "../../layout";

import { useRouter , useSearchParams} from "next/navigation";
import {
    Input,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button, Spacer, Select, SelectItem,
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
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/IconLabel";

axios.defaults.withCredentials = true;

function EditableItem({ item, onChangeAcuerdo, onRemoveAcuerdo, temas, onTemaChange, isAcuerdo }) {
    const [selectedTema, setSelectedTema] = useState(0);

    const handleTemaChange = (e) => {
        const selectedTemaIndex = e.target.value;
        setSelectedTema(selectedTemaIndex);
        onChangeAcuerdo(item.id, item.descripcion, selectedTemaIndex);
    };

    const handleDescripcionChange = (e) => {
        onChangeAcuerdo(item.id, e.target.value, selectedTema);
    };

    return (
        <div className="flex items-center mb-2">
            <Select
                label="Selecciona un tema"
                className="mr-2"
                value={selectedTema}
                onChange={handleTemaChange}
            >
                {temas && temas.map((tema) => (
                    <SelectItem key={tema.index} value={tema.index}>
                        {tema.data}
                    </SelectItem>
                ))}
            </Select>
            <Input
                type="text"
                value={item.descripcion}
                onChange={handleDescripcionChange}
            />
            <Button onClick={() => onRemoveAcuerdo(item.id)} className="p-2 bg-red-500 text-white rounded">
                X
            </Button>
        </div>
    );
}

function EditableList({ items, onAdd, onChange, onRemove, temas, onTemaChange, isAcuerdo }) {
    return (
        <div>
            {items.map((item) => (
                <EditableItem
                    key={item.id}
                    item={item}
                    onChangeAcuerdo={onChange}
                    onRemoveAcuerdo={onRemove}
                    temas={temas}
                    onTemaChange={onTemaChange}
                    isAcuerdo={isAcuerdo}
                />
            ))}
        </div>
    );
}

export default function crearActaReunion(props) {
// *********************************************************************************************
// Various Variables
// *********************************************************************************************
// Router. Helps you to move between pages

    const router = useRouter();
    const previousUrl = props.searchParams.previousUrl;
// Project Info
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

// Loading Window
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);


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
    const [listTemas, setListTemas] = useState([]);
    const [listAcuerdos, setListAcuerdos] = useState([]);

    // Funciones para temas
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

    const handleChangeTema = (e, index) => {
        const updated = [...listTemas];
        updated[index - 1].data = e.target.value;
        console.log(updated);
        setListTemas(updated);
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


    // Funciones para acuerdos
    const handleAddAcuerdo = (idTema, descripcionAcuerdo) => {
        const nuevoAcuerdo = {
            id: Date.now(),
            idTema: 0,
            descripcion: descripcionAcuerdo,
        };
        setListAcuerdos([...listAcuerdos, nuevoAcuerdo]);
    };

    const handleChangeAcuerdo = (acuerdoId, nuevaDescripcion, temaselect) => {
        const acuerdosActualizados = listAcuerdos.map(acuerdo =>
            acuerdo.id === acuerdoId ? { ...acuerdo, descripcion: nuevaDescripcion, idTema: temaselect } : acuerdo
        );
        setListAcuerdos(acuerdosActualizados);
        console.log(listAcuerdos);
    };

    const handleRemoveAcuerdo = (acuerdoId) => {
        const acuerdosActualizados = listAcuerdos.filter(acuerdo => acuerdo.id !== acuerdoId);
        setListAcuerdos(acuerdosActualizados);
    };

//-----------------------------------------------------------
    const [listComentarios, setListComentarios] = useState([{index: 1, data: ''}]);
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
    const handleChangeComentario = (e, index) => {
        const updatedEntregables = [...listComentarios];
        updatedEntregables[index - 1].data = e.target.value;
        console.log(updatedEntregables);
        setListComentarios(updatedEntregables);
    };
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
    const [datosUsuario, setDatosUsuario] = useState(
        { idUsuario: 0,
            nombres: " ",
            apellidos: " ",
            correoElectronico: " ",
            activo: 0,
            imgLink: null,
            idUsuarioRolProyecto: 0 });

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
            (item) => item.idUsuario !== miembro.idUsuario
        );
        console.log('Muestra los seleccionados');
        console.log(selectedMiembrosList);
        setSelectedMiembrosList(newMembrsList);
        console.log(newMembrsList);
    };

    const [isLoading, setIsLoading] = useState(true);

    const [idActa, setidActa] = useState(null);

    useEffect(() => {
        setIsLoadingSmall(true);
        const stringURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proyecto/actaReunion/listarActaReunionXIdProyecto/${projectId}`;
        axios
            .get(stringURL)
            .then(({ data: { data: { idActaReunion } } }) => {
                console.log("Listando ActasReunion. Respuesta del servidor:", idActaReunion);
                console.log(projectId);
                setidActa(idActaReunion);
            })
            .catch((error) => {
                console.error("Error fetching meeting record ID:", error);
            })
            .finally(() => {
                setIsLoadingSmall(false);
            });
    }, [setIsLoadingSmall, projectId]);

// *********************************************************************************************
// Creating a Meeting Record Line
// *********************************************************************************************
    const createMeeting = () => {
        const idActaReunion = idActa;
        const nombreReunion = titleValue;
        const fechaReunion = dateValue;
        const horaReunion = timeValue;
        const motivo = motiveValue;
        const nombreConvocante = convocante.nombres + " " + convocante.apellidos;
        const temas = listTemas.map((tema) => ({
            descripcion: tema.data,
            acuerdos: listAcuerdos
                .filter((acuerdo) => acuerdo.idTema === tema.index.toString())
                .map((acuerdo) => ({
                    descripcion: acuerdo.descripcion,
                })),
        }));
        const participantes = selectedMiembrosList.map(participante => ({ // assuming you have a list of participants
            idUsuarioXRolXProyecto: participante.idUsuarioRolProyecto,
            asistio: false,
        }));
        const comentarios = listComentarios.map(value => ({ // assuming you have a list of comments
            descripcion: value.data,
        }));

        console.log("Temas:");
        console.log(listTemas);
        console.log("Acuerdos:");
        console.log(listAcuerdos);

        const meeting = {
            idActaReunion,
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
        const meetingJSON = JSON.stringify(meeting, null, 2);

        // Now you can save meetingJSON to a file or send it in a request
        console.log(meetingJSON);
        console.log("Seleccionados: ",selectedMiembrosList);
        console.log('id de acta reunion:', idActaReunion);
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
                                        excludedUsers={[]}
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
                                                key={component.idUsuario}
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
                                    listAllUsers={false}
                                    handlerModalClose={toggleModal2}
                                    handlerModalFinished={returnListOfMiembros}
                                    excludedUsers={selectedMiembrosList}
                                    idProyecto={projectId}
                                    excludedUniqueUser={selectedConvocanteList}
                                    isExcludedUniqueUser={true}
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
                                    typeName="Tema">
                                </ListEditableInput>
                            </div>
                        </CardBody>
                        <CardFooter></CardFooter>
                    </Card>
                </div>

                {/*<div className="agreements p-5">
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
                                onClick={() => handleAddAcuerdo()}
                                className="bg-[#f0ae19] text-white w-8 h-8
                                rounded-full absolute right-4 top-4 cursor-pointer
                                transform transition-transform hover:-translate-y-1 hover:shadow-md">
                                <span className="text-xl" style={{ fontSize: '30px' }}>+</span>
                            </button>
                        </CardHeader>
                        {/*<CardBody className="mt-0 py-0 pl-8">
                            <div className="topicsContainer">
                                <EditableList
                                    items={listAcuerdos}
                                    onAdd={() => handleAddAcuerdo()}
                                    onChange={handleChangeAcuerdo}
                                    onRemove={handleRemoveAcuerdo}
                                    temas={listTemas}
                                    onTemaChange={handleChangeTema}
                                    isAcuerdo={true}
                                />
                            </div>
                        </CardBody>
                        <CardFooter></CardFooter>
                    </Card>
                </div>*/}

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

                <div className="twoButtons1">
                    <div className="buttonContainer">
                        <Modal
                            nameButton="Descartar"
                            textHeader="Descartar Registro"
                            textBody="¿Seguro que quiere descartar el registro de el Acta de Reunión?"
                            colorButton="w-36 bg-slate-100 text-black font-semibold"
                            oneButton={false}
                            secondAction={() => {}}
                            textColor="red"
                        />
                        <Modal
                            nameButton="Aceptar"
                            textHeader="Registrar Acta de Reunión"
                            textBody="¿Seguro que quiere registrar el Acta de Reunión?"
                            colorButton="w-36 bg-blue-950 text-white font-semibold"
                            oneButton={false}
                            secondAction={() => {
                                resetConvocante();
                                createMeeting();
                                router.push(previousUrl);
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
        </div>
    )
}