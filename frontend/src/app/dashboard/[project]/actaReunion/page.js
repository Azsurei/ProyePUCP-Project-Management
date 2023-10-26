"use client";

import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { SmallLoadingScreen } from "../layout";
axios.defaults.withCredentials = true;
import { Avatar, AvatarGroup, Card , CardBody, CardHeader, Divider} from '@nextui-org/react';
import {Tabs, Tab} from '@nextui-org/react';
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";

export default function ActaReunion(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const [reuniones, setReuniones] = useState({ pendientes: [], finalizadas: [] });

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

// *********************************************************************************************
// Searching Meeting Record ID
// *********************************************************************************************
    const [meetingId, setMeetingId] = useState("");

    useEffect(() => {
        const stringURL = 
        "http://localhost:8080/api/proyecto/actaReunion/listarActaReunionXIdProyecto/" + projectId;
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

    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching");
            setIsLoadingSmall(true);
            try {
                const resultado =
                    await axios.get('http://localhost:8080/api/proyecto/actaReunion/listarLineaActaReunionXIdActaReunion/29', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const lineasActaReunion  = resultado.data.lineasActaReunion;

                console.log(lineasActaReunion);
                const pendientes = [];
                const finalizadas = [];
                const fechaActual = new Date();

                lineasActaReunion.forEach(reunion => {
                    const fechaReunion = new Date(reunion.fechaReunion);
                    if (fechaReunion >= fechaActual) {
                        pendientes.push(reunion);
                    } else {
                        finalizadas.push(reunion);
                    }
                });
                setReuniones({ pendientes, finalizadas });
            } catch (error) {
                console.error('Error al obtener los datos de la API:', error);
            }
            setIsLoadingSmall(false);
        };

        fetchData();
    }, [setIsLoadingSmall, projectId]);

    const renderCard = (reunion) => {
        const participantes = Array.isArray(reunion.participantesXReunion)
            ? reunion.participantesXReunion
            : reunion.participantesXReunion ? [reunion.participantesXReunion] : [];
        return (

            <Card key={reunion.idLineaActaReunion} className="max-w-full mx-auto my-4" isPressable={true}>
                <CardHeader className="p-4">
                    <h3 className="text-xl font-bold text-blue-900 montserrat">{reunion.idLineaActaReunion}. {reunion.nombreReunion}</h3>
                </CardHeader>
                <Divider className="my-1"/>
                <CardBody className="flex-row justify-between items-center h-28">
                    <div className="mr-4">
                        <p className="text-blue-900 montserrat">Reunión convocada por: {reunion.nombreConvocante}</p>
                        <p className="text-gray-700 montserrat">Fecha: {new Date(reunion.fechaReunion).toLocaleDateString()}</p>
                        <p className="text-gray-700 montserrat">Hora: {reunion.horaReunion.slice(0, 5)}</p>
                    </div>
                    {participantes.length > 0 && (
                        <>
                            <Divider orientation="vertical" />
                            <div className="flex text-gray-700 montserrat ml-4 mr-2">Personas convocadas:</div>
                            <AvatarGroup isBordered max={3} className="space-x-2">
                                {participantes.slice(0, 3).map((participante, index) => (
                                    <Avatar key={index} src="" fallback={
                                        <p className="bg-gray-300 cursor-pointer rounded-full flex justify-center items-center text-base w-12 h-12 text-black">
                                            {participante.nombres[0] + participante.apellidos[0]}
                                        </p>
                                    } />
                                ))}
                            </AvatarGroup>
                            {participantes.length > 3 &&
                                <p className="ml-2">+{participantes.length - 3} más</p>
                            }
                        </>
                    )}
                </CardBody>
            </Card>
        );
    };

    return (
        <div style={{ padding: '20px', width: '100%', height: '80%' }}>
            <HeaderWithButtons
                haveReturn={true}
                haveAddNew={true}
                hrefToReturn={`/dashboard/${projectName}=${projectId}/actaReunion`}
                hrefForButton={`/dashboard/${projectName}=${projectId}/actaReunion/registerAR`}
                breadcrump={`Inicio / Proyectos / ${projectName} / Acta de Reunión`}
                btnText={'+ Agregar reunión'}
            >
                Acta de Reunión
            </HeaderWithButtons>

            <Tabs aria-label={"Options"} radius={"full"} color={"warning"}>
                <Tab key={"pending"} title={"Pendientes"} className={"montserrat text-blue-900"}>
                    {reuniones.pendientes.map(renderCard)}
                </Tab>
                <Tab key={"finished"} title={"Finalizados"} className={"montserrat text-blue-900"}>
                    {reuniones.finalizadas.map(renderCard)}
                </Tab>
            </Tabs>
        </div>
    );
}