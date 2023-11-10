// actaReunion/page.js
"use client";

import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { SmallLoadingScreen, HerramientasInfo } from "../layout";
axios.defaults.withCredentials = true;
import {Button, Avatar, AvatarGroup, Card, CardBody, CardHeader, Divider, Spacer} from '@nextui-org/react';
import {Tabs, Tab} from '@nextui-org/react';
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import { useRouter } from "next/navigation";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import MissingEDTComponents from "../../../../../public/images/missing_EDTComponents.svg";

export default function Retrospectiva(props) {
    // Getting project parameters
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    // Loading logo state
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    // Tools id state
    const { herramientasInfo } = useContext(HerramientasInfo);
    // array of lineasRetrospectivas to be loaded
    const [lretrospectivas, setLRetrospectivas] = useState([]);
    // id of retrospectivas tool
    const [idRetrospectiva, setIdRestrospectiva] = useState(34);

    const router = useRouter();

    const fetchData = async () => {
        try {
            setIsLoadingSmall(true);
            const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL
                + '/api/proyecto/retrospectiva/listarLineasRetrospectivaXIdRetrospectiva/'+idRetrospectiva);
            if (response.data && response.data.lineasRetrospectiva) {
                setLRetrospectivas(response.data.lineasRetrospectiva);
                console.log("Listado de lineas retrospectiva");
                console.log(response.data.lineasRetrospectiva);
            }
            setIsLoadingSmall(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoadingSmall(false);
        }
    };

    useEffect(() => {
        // Function to find the idHerramientaCreada for idHerramienta 10
        /*
        const findIdRetrospectiva = () => {
            const herramienta = herramientasInfo.find(h => h.idHerramienta === 10);
            if (herramienta) {
                setIdRestrospectiva(herramienta.idHerramientaCreada);
            }
            console.log(herramientasInfo);
            console.log(idRetrospectiva);
        };

        findIdRetrospectiva();*/

        // Function to fetch data


        fetchData();
    }, [setIsLoadingSmall]);

    // Function to get today's date in dd/mm/yyyy format
    const getTodaysDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        const year = today.getFullYear();

        return `${day}/${month}/${year}`;
    };

    // Function to handle deletion of a lineaRetrospectiva
    const handleDelete = async (idLineaRetrospectiva) => {
        try {
            const response = await axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL +
                '/api/proyecto/retrospectiva/eliminarLineaRetrospectiva', {
                data: { idLineaRetrospectiva }
            });
            // Remove the deleted item from the state
            if (response.status === 200) {
                setLRetrospectivas(lretrospectivas.filter(item => item.idLineaRetrospectiva !== idLineaRetrospectiva));
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };
    const newHref = '/dashboard/'+projectName+'='+projectId+'/retrospectivas/registerRetro';
    const actualHref = '/dashboard/'+ projectName + '=' + projectId + '/retrospectivas';
    return (
        <div style={{ padding: '20px', width: '100%', height: '80%' }}>
            <HeaderWithButtons
                haveReturn={true}
                haveAddNew={true}
                hrefToReturn={actualHref}
                hrefForButton={newHref}
                breadcrump={`Inicio / Proyectos / ${projectName} / Restrospectivas`}
                btnText={'+ Agregar retrospectiva'}
            >
                Restrospectivas
            </HeaderWithButtons>
            <Spacer y={4} />
                {lretrospectivas.map((retro, index) => (
                    <div>
                        <Card key={index} className="flex-grow w-full mx-auto">
                            <CardHeader className="p-4">
                                <h3 className="text-xl font-bold text-blue-900 montserrat">
                                    {`Retrospectiva ${retro.titulo || `del Sprint ${retro.idSprint}`}`}
                                </h3>
                            </CardHeader>
                            <Divider orientation={"horizontal"}/>
                            <CardBody className="flex-row justify-between items-center h-36">
                                <div className="mr-4">
                                    <p className="text-blue-900 montserrat">Fecha: {getTodaysDate()}</p>
                                    <p className="text-blue-900 montserrat">Que hicimos bien? {retro.cantBien} comentarios</p>
                                    <p className="text-gray-700 montserrat">Que hicimos mal? {retro.cantMal} comentarios</p>
                                    <p className="text-gray-700 montserrat">Que podemos hacer? {retro.cantQueHacer} comentarios</p>
                                </div>
                                <div className="flex flex-col space-y-2 mt-0.5">
                                    <Button className="w-36 bg-blue-900 text-white font-semibold">Editar</Button>
                                    <Modal
                                        nameButton="Eliminar"
                                        textHeader="Eliminar retrospectiva"
                                        textBody="¿Seguro que quiere eliminar esta retrospectiva?"
                                        colorButton="w-36 bg-red-600 text-white font-semibold"
                                        oneButton={false}
                                        secondAction={() => handleDelete(retro.idLineaRetrospectiva)}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                        <Spacer y={4} />
                    </div>
                ))}
        </div>
    );
}