// actaReunion/page.js
"use client";

import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { SmallLoadingScreen } from "../layout";
axios.defaults.withCredentials = true;
import { Toaster, toast } from "sonner";
import {Button, Avatar, AvatarGroup, Card, CardBody, CardHeader, Divider, Spacer} from '@nextui-org/react';
import {Tabs, Tab} from '@nextui-org/react';
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import { useRouter } from "next/navigation";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import MissingEDTComponents from "../../../../../public/images/missing_EDTComponents.svg";

export default function ActaReunion(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen); // Assuming SmallLoadingScreen is the context you're using
    const [reuniones, setReuniones] = useState({ pendientes: [], finalizadas: [] });
    const router = useRouter();

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const [idActa, setIdActa] = useState(null); // Use camelCase for consistency

    // Searching Meeting Record ID
    useEffect(() => {
        setIsLoadingSmall(true);
        const stringURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proyecto/actaReunion/listarActaReunionXIdProyecto/${projectId}`;
        axios
            .get(stringURL)
            .then(({ data: { data: { idActaReunion } } }) => {
                console.log("Listando ActasReunion. Respuesta del servidor:", idActaReunion);
                setIdActa(idActaReunion);
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
            const fetchData = async () => {
                setIsLoadingSmall(true);
                try {
                    const resultado = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proyecto/actaReunion/listarLineaActaReunionXIdActaReunion/${idActa}`);
                    const lineasActaReunion = resultado.data.lineasActaReunion;
                    console.log(lineasActaReunion);

                    const pendientes = lineasActaReunion.filter(reunion => new Date(reunion.fechaReunion) >= new Date());
                    const finalizadas = lineasActaReunion.filter(reunion => new Date(reunion.fechaReunion) < new Date());
                    setReuniones({ pendientes, finalizadas });

                } catch (error) {
                    console.error('Error al obtener los datos de la API:', error);
                } finally {
                    setIsLoadingSmall(false);
                }
            };

            fetchData();
        }
    }, [idActa, setIsLoadingSmall]);

    const handleEdit = (reunion) => {

        const idAR = reunion.idLineaActaReunion;

        router.push('/dashboard/' + projectName + '=' + projectId + '/actaReunion/e?edit='+ idAR + '&' + 'acta=' + idActa);
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
            <div
                key={reunion.idLineaActaReunion}
                className="flex flex-wrap items-start my-4 space-x-4 justify-center border border-slate-300 shadow-md relative rounded-lg" >
                <div key={reunion.idLineaActaReunion} className="flex-grow w-full sm:w-72 md:w-80 lg:w-96 xl:w-[400px] mx-auto" isPressable={true}>
                    <div className="p-4">
                        <h3 className="text-xl font-bold text-blue-900 montserrat">{reunion.nombreReunion}</h3>
                    </div>
                    <Divider orientation={"horizontal"}/>
                    <div className="flex flex-row justify-between items-center h-36 p-4">
                        <div className="mr-4">
                            <p className="text-blue-900 montserrat">Reunión convocada por:</p>
                            <p className="text-blue-900 montserrat">{reunion.nombreConvocante}</p>
                            <p className="text-gray-700 montserrat">Fecha: {new Date(reunion.fechaReunion).toLocaleDateString()}</p>
                            <p className="text-gray-700 montserrat">Hora: {reunion.horaReunion.slice(0, 5)}</p>
                        </div>
                        <div className="flex text-gray-700 montserrat">Convocados :</div>
                        {participantes.length > 0 && (
                                <AvatarGroup isBordered max={3} >
                                    {participantes.map((participante, index) => (
                                        <Avatar key={participante.idParticipanteXReunion}  src={participante.imgLink} fallback={
                                            <p className="bg-gray-300 cursor-pointer rounded-full flex justify-center items-center text-base w-12 h-12 text-black">
                                                {participante.nombres[0] + participante.apellidos[0]}
                                            </p>
                                        } />
                                    ))}
                                </AvatarGroup>
                        )}
                        <div className="flex flex-col space-y-2 mt-0.5">
                            <Button className="w-36 bg-blue-900 text-white font-semibold" onClick={() => handleEdit(reunion)}>Editar</Button>
                            <Modal
                                nameButton="Eliminar"
                                textHeader="Eliminar reunion"
                                textBody="¿Seguro que quiere eliminar esta reunion?"
                                colorButton="w-36 bg-red-600 text-white font-semibold"
                                oneButton={false}
                                secondAction={() => {
                                    handleDelete(reunion.idLineaActaReunion).then(r => console.log(r));
                                    toast.success(
                                        "Se ha eliminado el Acta de Reunion exitosamente"
                                    );
                                }}
                                textColor="red"
                            />
                        </div>
                    </div>
                </div>

            </div>


        );
    };

    const newHref = '/dashboard/'+projectName+'='+projectId+'/actaReunion/registerAR';
    const actualHref = '/dashboard/'+ projectName + '=' + projectId + '/actaReunion';
    return (
        <div style={{ padding: '20px', width: '100%', height: '80%' }}>
            <HeaderWithButtons
                haveReturn={true}
                haveAddNew={true}
                hrefToReturn={actualHref}
                hrefForButton={newHref}
                breadcrump={`Inicio / Proyectos / ${projectName} / Acta de Reunión`}
                btnText={'+ Agregar reunión'}
            >
                Acta de Reunión
            </HeaderWithButtons>

            {
                reuniones && reuniones.pendientes && reuniones.finalizadas ? (
                    <div>
                        <Tabs aria-label="Options" radius="full" color="warning">
                            <Tab key="pending" title="Pendientes" className="montserrat text-blue-900">
                                {reuniones.pendientes.length > 0 ? (
                                    reuniones.pendientes.map(renderCard)
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <Spacer y={1} />
                                        <MissingEDTComponents />
                                        <p className="montserrat text-blue-900">No hay reuniones pendientes</p>
                                    </div>
                                )}
                            </Tab>
                            <Tab key="finished" title="Finalizados" className="montserrat text-blue-900">
                                {reuniones.finalizadas.length > 0 ? (
                                    reuniones.finalizadas.map(renderCard)
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <Spacer y={1} />
                                        <MissingEDTComponents />
                                        <p>No hay reuniones finalizadas</p>
                                    </div>
                                )}
                            </Tab>
                        </Tabs>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Spacer y={1} />
                        <MissingEDTComponents />
                        <p>No hay reuniones programadas</p>
                    </div>
                )
            }
            <Toaster
                position="bottom-left"
                richColors
                theme={"light"}
                closeButton={true}
                toastOptions={{
                    style: { fontSize: "1rem" },
                }}
            />
        </div>
    );
}