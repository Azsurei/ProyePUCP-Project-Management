// actaReunion/page.js
"use client";

import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { SmallLoadingScreen } from "../layout";
axios.defaults.withCredentials = true;
import {Button, Avatar, AvatarGroup, Card, CardBody, CardHeader, Divider, Spacer} from '@nextui-org/react';
import {Tabs, Tab} from '@nextui-org/react';
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import { useRouter } from "next/navigation";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import MissingEDTComponents from "../../../../../public/images/missing_EDTComponents.svg";

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

    useEffect(() => {
        setIsLoadingSmall(false);
    });

    const newHref = '/dashboard/'+projectName+'='+projectId+'/retrospectivas/registerRetro';
    const actualHref = '/dashboard/'+ projectName + '=' + projectId + '/retrospectivas';
    return (
        <div style={{ padding: '20px', width: '100%', height: '80%' }}>
            <HeaderWithButtons
                haveReturn={true}
                haveAddNew={true}
                hrefToReturn={actualHref}
                hrefForButton={{
                    pathname:newHref,
                    query: {previousUrl: actualHref},
                }}
                breadcrump={`Inicio / Proyectos / ${projectName} / Restrospectivas`}
                btnText={'+ Agregar retrospectiva'}
            >
                Restrospectivas
            </HeaderWithButtons>

            <div
                className="flex flex-wrap items-start my-4 space-x-4 justify-center" >
                <Card className="flex-grow w-full sm:w-72 md:w-80 lg:w-96 xl:w-[400px] mx-auto" isPressable={true}>
                    <CardHeader className="p-4">
                        <h3 className="text-xl font-bold text-blue-900 montserrat">Retrospectivas del Sprint 1</h3>
                    </CardHeader>
                    <Divider orientation={"horizontal"}/>
                    <CardBody className="flex-row justify-between items-center h-36">
                        <div className="mr-4">
                            <p className="text-blue-900 montserrat">Fecha: 08/11/2023</p>
                            <p className="text-blue-900 montserrat">Que hicimos bien? 5 comentarios</p>
                            <p className="text-gray-700 montserrat">Que hicimos mal? 3 comentarios</p>
                            <p className="text-gray-700 montserrat">Que podemos hacer? 2 comentarios</p>
                        </div>
                        <div className="flex flex-col space-y-2 mt-0.5">
                            <Button className="w-36 bg-blue-900 text-white font-semibold">Editar</Button>
                            <Modal
                                nameButton="Eliminar"
                                textHeader="Eliminar retrospectiva"
                                textBody="¿Seguro que quiere eliminar esta restrospectiva?"
                                colorButton="w-36 bg-red-600 text-white font-semibold"
                                oneButton={false}
                                secondAction={undefined}
                                textColor="red"
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div
                className="flex flex-wrap items-start my-4 space-x-4 justify-center" >
                <Card className="flex-grow w-full sm:w-72 md:w-80 lg:w-96 xl:w-[400px] mx-auto" isPressable={true}>
                    <CardHeader className="p-4">
                        <h3 className="text-xl font-bold text-blue-900 montserrat">Retrospectivas del Sprint 2</h3>
                    </CardHeader>
                    <Divider orientation={"horizontal"}/>
                    <CardBody className="flex-row justify-between items-center h-36">
                        <div className="mr-4">
                            <p className="text-blue-900 montserrat">Fecha: 09/11/2023</p>
                            <p className="text-blue-900 montserrat">Que hicimos bien? 2 comentarios</p>
                            <p className="text-gray-700 montserrat">Que hicimos mal? 7 comentarios</p>
                            <p className="text-gray-700 montserrat">Que podemos hacer? 5 comentarios</p>
                        </div>
                        <div className="flex flex-col space-y-2 mt-0.5">
                            <Button className="w-36 bg-blue-900 text-white font-semibold" >Editar</Button>
                            <Modal
                                nameButton="Eliminar"
                                textHeader="Eliminar retrospectiva"
                                textBody="¿Seguro que quiere eliminar esta restrospectiva?"
                                colorButton="w-36 bg-red-600 text-white font-semibold"
                                oneButton={false}
                                secondAction={undefined}
                                textColor="red"
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div
                className="flex flex-wrap items-start my-4 space-x-4 justify-center" >
                <Card className="flex-grow w-full sm:w-72 md:w-80 lg:w-96 xl:w-[400px] mx-auto" isPressable={true}>
                    <CardHeader className="p-4">
                        <h3 className="text-xl font-bold text-blue-900 montserrat">Retrospectivas del Sprint 3</h3>
                    </CardHeader>
                    <Divider orientation={"horizontal"}/>
                    <CardBody className="flex-row justify-between items-center h-36">
                        <div className="mr-4">
                            <p className="text-blue-900 montserrat">Fecha: 22/11/2023</p>
                            <p className="text-blue-900 montserrat">Que hicimos bien? 5 comentarios</p>
                            <p className="text-gray-700 montserrat">Que hicimos mal? 3 comentarios</p>
                            <p className="text-gray-700 montserrat">Que podemos hacer? 1 comentarios</p>
                        </div>
                        <div className="flex flex-col space-y-2 mt-0.5">
                            <Button className="w-36 bg-blue-900 text-white font-semibold" >Editar</Button>
                            <Modal
                                nameButton="Eliminar"
                                textHeader="Eliminar retrospectiva"
                                textBody="¿Seguro que quiere eliminar esta restrospectiva?"
                                colorButton="w-36 bg-red-600 text-white font-semibold"
                                oneButton={false}
                                secondAction={undefined}
                                textColor="red"
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}