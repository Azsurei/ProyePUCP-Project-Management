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

import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
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

    const [titleValue, setTitleValue] = useState("");
    const [motiveValue, setMotiveValue] = useState("");

    const [fecha, setFecha] = useState(""); // Estado para la fecha
    const [hora, setHora] = useState(""); // Estado para la hora

    const handleChangeFecha = (event) => {
        setFecha(event.target.value);
    };

    const handleChangeHora = (event) => {
        setHora(event.target.value);
    };

    const [inFechaHora, setInFechaHora] = useState('');
    const handleChangeFechaHora = () => {
        const datepickerInput = document.getElementById("datepickerFechaHora");
        const selectedDate = datepickerInput.value;
        console.log(selectedDate);
        setInFechaHora(selectedDate);
    }

    const [listTemas, setlistTemas] = useState([{index: 1, data: ''}]);
    const [listAcuerdos, setlistAcuerdos] = useState([{index: 1, data: ''}]);
    const [listComentarios, setlistComentarios] = useState([{index: 1, data: ''}]);

    const handleAddTema = ()=>{
        const newList_T =  [
            ...listTemas, 
            {
            index: listTemas.length + 1,
            data: ''
            }
        ];
        setlistTemas(newList_T);
    }

    const handleAddAcuerdo = ()=>{
        const newList_A =  [
            ...listAcuerdos, 
            {
            index: listAcuerdos.length + 1,
            data: ''
            }
        ];
        setlistAcuerdos(newList_A);
    }

    const handleAddComentario = ()=>{
        const newList_C =  [
            ...listComentarios, 
            {
            index: listComentarios.length + 1,
            data: ''
            }
        ];
        setlistComentarios(newList_C);
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
                            value={fecha}
                            onChange={handleChangeFecha}
                        ></input>
                        <input
                            type="time"
                            id="timePicker"
                            name="timePicker"
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
                </div>
                <br /><br />
                <div className="invitedPeople">
                    <Card className="max-w-[600px] mb-5">
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
                                <ModalUser
                                    handlerModalClose={toggleModal2}
                                    handlerModalFinished={returnListOfMiembros}
                                    excludedUsers={selectedMiembrosList}
                                ></ModalUser>
                            )}   
                            {/* Fin del selector de miembros */}
                        </CardBody>
                        <CardFooter></CardFooter>
                    </Card>
                </div>

                <div className="meetingTopics"> 
                    <Card className="max-w-[600px] mb-5"> 
                        <CardHeader>
                            <h3 className="p-2 text-lg font-bold text-blue-950 font-sans">
                                Temas a tratar
                            </h3>
                            <button 
                                onClick={handleAddTema}
                                className="bg-[#f0ae19] text-white w-8 h-8
                                rounded-full absolute right-4 top-4 cursor-pointer 
                                transform transition-transform hover:-translate-y-1 hover:shadow-md">
                                <span className="text-xl">+</span>
                            </button>
                        </CardHeader>
                        <CardBody className="mt-0 py-0 pl-8">
                            <div className="topicsContainer">
                                <ListEditableInput 
                                    ListInputs={listTemas} 
                                    typeName="Tema">
                                </ListEditableInput>
                            </div>
                        </CardBody>
                        <CardFooter></CardFooter>
                    </Card>
                </div>

                <div className="agreements"> 
                    <Card className="max-w-[600px] mb-5"> 
                        <CardHeader>
                            <h3 className="p-2 text-lg font-bold text-blue-950 font-sans">
                                Acuerdos
                            </h3>
                            <button 
                                onClick={handleAddAcuerdo}
                                className="bg-[#f0ae19] text-white w-8 h-8
                                rounded-full absolute right-4 top-4 cursor-pointer 
                                transform transition-transform hover:-translate-y-1 hover:shadow-md">
                                <span className="text-xl">+</span>
                            </button>
                        </CardHeader>
                        <CardBody className="mt-0 py-0 pl-8">
                            <div className="topicsContainer">
                                <ListEditableInput 
                                    ListInputs={listAcuerdos} 
                                    typeName="Acuerdo">
                                </ListEditableInput>
                            </div>
                        </CardBody>
                        <CardFooter></CardFooter>
                    </Card>
                </div>
                
                <div className="pendingComments"> 
                    <Card className="max-w-[600px] mb-5"> 
                        <CardHeader>
                            <h3 className="p-2 text-lg font-bold text-blue-950 font-sans">
                                Comentarios Pendientes
                            </h3>
                            <button 
                                onClick={handleAddComentario}
                                className="bg-[#f0ae19] text-white w-8 h-8
                                rounded-full absolute right-4 top-4 cursor-pointer 
                                transform transition-transform hover:-translate-y-1 hover:shadow-md">
                                <span className="text-xl">+</span>
                            </button>
                        </CardHeader>
                        <CardBody className="mt-0 py-0 pl-8">
                            <div className="topicsContainer">
                                <ListEditableInput 
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

            <div className="ButtonsContainer">
                <ButtonAddNew>Cancelar</ButtonAddNew>
                <ButtonAddNew>Guardar elemento</ButtonAddNew>
            </div>
        </div>
    )
}