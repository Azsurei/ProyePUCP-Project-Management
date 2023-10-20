"use client"

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import { SmallLoadingScreen } from "../../layout";

import { useRouter } from "next/navigation";
import {Input} from "@nextui-org/react";

import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/modalUsers";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ChoiceUser.css";
import CardSelectedUser from "@/components/CardSelectedUser";

axios.defaults.withCredentials = true;

export default function crearActaReunion(props) {
    const router = useRouter();
    
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    setIsLoadingSmall(false);

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
            <div className="header">
                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem href="/dashboard/Proyectos" text="Proyecto" />
                    <BreadcrumbsItem href="/dashboard/Proyectos/Proyecto" text="Equipos" />
                </Breadcrumbs>
                <div className="title">Crear Acta de Reunión</div>
                <button className="backButton"> Volver </button>
            </div>
            <div className="body">
                <div className="mainInfo">
                    <Input 
                        isRequired
                        key="outside"
                        size="lg" 
                        type="title" 
                        label="Título de Reunión" 
                        labelPlacement="outside"
                        placeholder="Ingrese el título de reunión (Ej: Reunión para ver temas de gastos)" 
                    />
                    <p>Reunión convocada por: {datosUsuario.nombres} {datosUsuario.apellidos}</p>
                    <div className="dateAndTimeLine">
                        <p>Fecha y Hora de la Reunión</p>
                        <input type="datetime-local" id="datetimePicker" name="datetimePicker"></input>
                    </div>
                    <p>Motivo</p>
                    <input
                        type="text"
                        id="motivo"
                        name="motivo"
                        placeholder="Ingrese el motivo de su reunión (máx 200 caracteres)"
                    />
                </div>
                <br /><br />
                <div className="invitedPeople">
                    <h3>Personas Convocadas</h3>
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
                </div>
                <div className="meetingTopics"> 
                    <h3>Temas a tratar</h3>
                
                </div>
            </div>

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </div>
    )
}