"use client"

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

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

import ModalUsers from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ChoiceUser.css";
import "@/styles/dashboardStyles/projectStyles/actaReunionStyles/CrearActaReunion.css";
import CardSelectedUser from "@/components/CardSelectedUser";

import ListEditableInput from "@/components/dashboardComps/projectComps/EDTComps/ListEditableInput";
import ButtonAddNew from "@/components/dashboardComps/projectComps/EDTComps/ButtonAddNew";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";

axios.defaults.withCredentials = true;

export default function crearActaReunion(props) {
// *********************************************************************************************
// Various Variables
// *********************************************************************************************
const router = useRouter();
    
const decodedUrl = decodeURIComponent(props.params.project);
const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
setIsLoadingSmall(false);

const [missingFields, setMissingFields] = useState([]); 

const [titleValue, setTitleValue] = useState("");
const [motiveValue, setMotiveValue] = useState("");

const [fecha, setFecha] = useState(""); // Estado para la fecha
const [hora, setHora] = useState(""); // Estado para la hora

const handleChangeTitle = (event) => {
    setTitleValue(event.target.value);
    if (!event.target.value) {
        setMissingFields((prevFields) => {
            if (!prevFields.includes("título")) {
                return [...prevFields, "título"];
            }
            return prevFields;
        });
    } else {
        // Elimina "fecha" de la matriz de campos faltantes si ya está presente
        setMissingFields((prevFields) => prevFields.filter((field) => field !== "título"));
    }
};

const handleChangeMotive = (event) => {
    setMotiveValue(event.target.value);
    if (!event.target.value) {
        setMissingFields((prevFields) => {
            if (!prevFields.includes("motivo")) {
                return [...prevFields, "motivo"];
            }
            return prevFields;
        });
    } else {
        // Elimina "fecha" de la matriz de campos faltantes si ya está presente
        setMissingFields((prevFields) => prevFields.filter((field) => field !== "motivo"));
    }
};

const handleChangeFecha = (event) => {
    setFecha(event.target.value);
    if (!event.target.value) {
        setMissingFields((prevFields) => {
            if (!prevFields.includes("fecha")) {
                return [...prevFields, "fecha"];
            }
            return prevFields;
        });
    } else {
        // Elimina "fecha" de la matriz de campos faltantes si ya está presente
        setMissingFields((prevFields) => prevFields.filter((field) => field !== "fecha"));
    }
};

const handleChangeHora = (event) => {
    setHora(event.target.value);
    if (!event.target.value) {
        setMissingFields((prevFields) => {
            if (!prevFields.includes("hora")) {
                return [...prevFields, "hora"];
            }
            return prevFields;
        });
    } else {
        // Elimina "fecha" de la matriz de campos faltantes si ya está presente
        setMissingFields((prevFields) => prevFields.filter((field) => field !== "hora"));
    }
};

const handleCreateMeeting = () => {
    if (titleValue === "") {
        setMissingFields("Falta el título");
    } else if (fecha === "") {
        setMissingFields("Falta la fecha");
    } else if (hora === "") {
        setMissingFields("Falta la hora");
    } else if (motiveValue === "") {
        setMissingFields("Falta el motivo");
    } else {
        // Aquí puedes realizar la lógica de creación de la reunión
        // Si se completaron todos los campos, borra cualquier mensaje de campo faltante
        setMissingFields("");
    }
    // Resto del código...
};


function getMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Los meses se indexan a partir de 0
    const day = today.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getMinTime() {
    const today = new Date();
    const selectedDate = new Date(fecha); // Convierte la fecha seleccionada en un objeto Date
    const currentTime = today.getHours() * 60 + today.getMinutes(); // Convierte la hora actual a minutos

    // Si la fecha seleccionada es hoy, la hora mínima permitida es la hora actual
    if (
        selectedDate.getDate() === today.getDate() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getFullYear() === today.getFullYear()
    ) {
        const selectedTime = parseInt(hora.split(":")[0]) * 60 + parseInt(hora.split(":")[1]);
        return `${Math.floor(currentTime / 60)
            .toString()
            .padStart(2, "0")}:${(currentTime % 60).toString().padStart(2, "0")}`;
    }

    // Si la fecha seleccionada es posterior a hoy, no hay restricciones en la hora
    return "00:00";
}

/*
const [inFechaHora, setInFechaHora] = useState('');
const handleChangeFechaHora = () => {
    const datepickerInput = document.getElementById("datepickerFechaHora");
    const selectedDate = datepickerInput.value;
    console.log(selectedDate);
    setInFechaHora(selectedDate);
}
*/
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
        const stringURL = "http://localhost:8080/api/usuario/verInfoUsuario";

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
// About Metting Members
// *********************************************************************************************
    const [selectedMiembrosList, setSelectedMiembrosList] = useState([]);
    const [modal2, setModal2] = useState(false);

    const toggleModal2 = () => {
        setModal2(!modal2);
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
            <div className="body m-5 mt-3">
                <div className="mainInfo">
                    <Card className="p-5 pt-3">
                        <CardBody>
                            <Input 
                                className="max-w-[600px]"
                                isRequired
                                key="outside"
                                size="lg" 
                                type="title" 
                                label="Título de Reunión" 
                                labelPlacement="outside"
                                placeholder="Ingrese el título de reunión (Ej: Reunión para ver temas de gastos)"
                                value={titleValue}
                                onValueChange={setTitleValue} 
                            />
                            <p className="mt-5 mb-1 text-black text-sm font-medium">Reunión convocada por</p>
                            <p className="ml-2 font-medium text-gray-400 ">{datosUsuario.nombres} {datosUsuario.apellidos} (tú)</p>
                                
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
                                    value={fecha}
                                    onChange={handleChangeFecha}
                                ></input>
                                <input
                                    type="time"
                                    id="timePicker"
                                    name="timePicker"
                                    min={getMinTime()}
                                    value={hora}
                                    onChange={handleChangeHora}
                                ></input>
                            </div>
                            <Input 
                                className="max-w-[600px] mt-5"
                                isRequired
                                key="outside"
                                size="lg" 
                                type="title" 
                                label="Motivo" 
                                labelPlacement="outside"
                                placeholder="Ingrese el motivo de la reunion"
                                value={motiveValue}
                                onValueChange={setMotiveValue} 
                            />
                        </CardBody>
                        <CardFooter><p>Recuerda que todos estos datos son obligatorios</p></CardFooter>
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
                            <p>Miembro</p>
                            {/**** Selector de Miembros ***** */}
                            <div className="SelectedUsersContainer">
                                <div
                                    className="containerToPopUpUsrSearch"
                                    style={{ width: '60%', padding: '0.2rem 0' }}
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
                                style={{ width: '60%', padding: '0.2rem 0' }}>
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
                            <h3 className="p-2 text-lg font-bold text-blue-950 font-sans">
                                Temas a tratar
                            </h3>
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
                            <h3 className="p-2 text-lg font-bold text-blue-950 font-sans">
                                Acuerdos
                            </h3>
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
                            <h3 className="p-2 text-lg font-bold text-blue-950 font-sans">
                                Comentarios Pendientes
                            </h3>
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

            </div>

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>

            <div className="ButtonsContainer mb-5">
                {(!titleValue || !motiveValue || !fecha || !hora) 
                    && <p className="error-text mt-3">Faltan llenar campos</p>}
                <Button color="primary" variant="bordered">Cancelar</Button>
                <Button color="primary" 
                    isDisabled={fecha==="" || hora==="" || titleValue==="" || motiveValue===""}
                    >Crear</Button>
            </div>
        </div>
    )
}