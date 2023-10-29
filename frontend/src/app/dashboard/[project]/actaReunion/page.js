// actaReunion/page.js
"use client";

import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import React, { useState, useContext, useEffect, createContext } from "react";
import axios from "axios";
import { SmallLoadingScreen } from "../layout";
axios.defaults.withCredentials = true;
import { Button, Avatar, AvatarGroup, Card , CardBody, CardHeader, Divider} from '@nextui-org/react';
import {Tabs, Tab} from '@nextui-org/react';
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import { useRouter } from "next/navigation";

export default function ActaReunion(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const [reuniones, setReuniones] = useState({ pendientes: [], finalizadas: [] });

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const [idActa, setidActa] = useState(null);


// *********************************************************************************************
// Searching Meeting Record ID
// *********************************************************************************************
    const [meetingId, setMeetingId] = useState("");

    useEffect(() => {
        setIsLoadingSmall(true);
        const stringURL = process.env.NEXT_PUBLIC_BACKEND_URL+'/api/proyecto/actaReunion/listarActaReunionXIdProyecto/'+projectId;
        axios
            .get(stringURL)
            .then(({ data: { data: { idActaReunion } } }) => {
                console.log("Listando ActasReunion. Respuesta del servidor:", idActaReunion);
                setidActa(idActaReunion);
            })
            .catch((error) => {
                console.error("Error fetching meeting record ID:", error);
            })
            .finally(() => {
                setIsLoadingSmall(false);
            });
    }, [setIsLoadingSmall, projectId]);

    useEffect(() => {
        if (idActa) {
            (async () => {
                try {
                    setIsLoadingSmall(true);
                    const resultado = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proyecto/actaReunion/listarLineaActaReunionXIdActaReunion/${idActa}`, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const lineasActaReunion = resultado.data.lineasActaReunion;
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
                } finally {
                    setIsLoadingSmall(false);
                }
            })();
        }
    }, [idActa, setIsLoadingSmall]);

    const router = useRouter();
    const handleEdit = (reunion) => {

        const idAR = reunion.idLineaActaReunion;

        router.push('/dashboard/' + projectName + '=' + projectId + '/actaReunion/e?edit='+ idAR);
    };

    const handleDelete = async (id) => {
        // Aquí puedes mostrar un modal para confirmar la acción
        const response = await axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL + '/api/proyecto/actaReunion/eliminarLineaActaReunionXIdLineaActaReunion', {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                idLineaActaReunion: id
            }
        });

        if (response.status === 200) {
            console.log('Reunión eliminada con éxito');

            setReuniones(prevReuniones => {
                const newPendientes = prevReuniones.pendientes.filter(reunion => reunion.idLineaActaReunion !== id);
                const newFinalizadas = prevReuniones.finalizadas.filter(reunion => reunion.idLineaActaReunion !== id);
                return { pendientes: newPendientes, finalizadas: newFinalizadas };
            });
        }

    };

    const renderCard = (reunion) => {
        const participantes = Array.isArray(reunion.participantesXReunion)
            ? reunion.participantesXReunion
            : reunion.participantesXReunion ? [reunion.participantesXReunion] : [];
        return (

            <div key={reunion.idLineaActaReunion} className="flex flex-wrap items-start my-4 space-x-4 justify-center">
                <Card key={reunion.idLineaActaReunion} className="flex-grow w-full sm:w-72 md:w-80 lg:w-96 xl:w-[400px] mx-auto" isPressable={true}>
                    <CardHeader className="p-4">
                        <h3 className="text-xl font-bold text-blue-900 montserrat">{reunion.nombreReunion}</h3>
                    </CardHeader>
                    <Divider className="my-1"/>
                    <CardBody className="flex-row justify-between items-center h-36">
                        <div className="mr-4">
                            <p className="text-blue-900 montserrat">Reunión convocada por:</p>
                            <p className="text-blue-900 montserrat">{reunion.nombreConvocante}</p>
                            <p className="text-gray-700 montserrat">Fecha: {new Date(reunion.fechaReunion).toLocaleDateString()}</p>
                            <p className="text-gray-700 montserrat">Hora: {reunion.horaReunion.slice(0, 5)}</p>
                        </div>
                        {participantes.length > 0 && (
                            <>
                                <Divider orientation="vertical" />
                                <div className="flex text-gray-700 montserrat ml-4 mr-2">Personas convocadas:</div>
                                <AvatarGroup isBordered max={3} className="space-x-2">
                                    {participantes.map((participante, index) => (
                                        <Avatar key={participante.idParticipanteXReunion}  src="" fallback={
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
                <div className="flex flex-col space-y-10 mt-10">
                    <Button onClick={() => handleEdit(reunion)}>Editar</Button>
                    <Button onClick={() => handleDelete(reunion.idLineaActaReunion)} color="error" >Eliminar</Button>
                </div>
            </div>
            // Crear botones de editar y eliminar
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