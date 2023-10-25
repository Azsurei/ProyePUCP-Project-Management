"use client";

import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import React, { useContext, useEffect } from "react";
import axios from "axios";
import { SmallLoadingScreen } from "../layout";
axios.defaults.withCredentials = true;
import { Avatar, AvatarGroup, Card , CardBody, CardHeader, Divider} from '@nextui-org/react';
import {Tabs, Tab} from '@nextui-org/react';
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";

export default function ActaReunion(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));


    useEffect(()=>{
        setIsLoadingSmall(false);
    },[]);


    return (
        <div style={{padding:'20px 20px 20px', width: '100%', height: '80%'}}>
            <HeaderWithButtons haveReturn={true}
                               haveAddNew={true}
                               hrefToReturn={'/dashboard/' + projectName+'='+projectId + '/actaReunion'}
                               hrefForButton={'/dashboard/' + projectName+'='+projectId + '/actaReunion/new'}
                               breadcrump={'Inicio / Proyectos / ' + projectName + ' / Acta de Reunion'}
                               btnText={'+ Agregar reunion'}>Acta de Reunion</HeaderWithButtons>

            <Tabs aria-label={"Options"} radius={"full"} color={"warning"}>
                <Tab key={"pending"} title={"Pendientes"} className={"montserrat text-blue-900"}>
                    <Card className="max-w-full mx-auto my-4" isPressable={true}>
                        <CardHeader className="p-4">
                            <h3 className="text-xl font-bold text-blue-900 montserrat">#1 Reunion para ver temas de gastos</h3>
                        </CardHeader>
                        <Divider className="my-1" />
                        <CardBody className="flex-row justify-between items-center h-28">
                            <div className="mr-4">
                                <p className="text-blue-900 montserrat">Reunion convocada por: Renzo Pinto</p>
                                <p className="text-gray-700 montserrat">Fecha: 13/09/2023</p>
                                <p className="text-gray-700 montserrat">Hora: 3:00 pm</p>
                            </div>
                            <Divider orientation="vertical" />
                            <div className="flex text-gray-700 montserrat ml-4 mr-2">Personas convocadas:</div>
                            <div className="flex">
                                <AvatarGroup max={3} className="space-x-2">
                                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                                    <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                                    <Avatar>+3</Avatar>
                                </AvatarGroup>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="max-w-full mx-auto my-4" isPressable={true}>
                        <CardHeader className="p-4">
                            <h3 className="text-xl font-bold text-blue-900 montserrat">#1 Reunion para ver temas de gastos</h3>
                        </CardHeader>
                        <Divider className="my-1" />
                        <CardBody className="flex-row justify-between items-center h-28">
                            <div className="mr-4">
                                <p className="text-blue-900 montserrat">Reunion convocada por: Renzo Pinto</p>
                                <p className="text-gray-700 montserrat">Fecha: 13/09/2023</p>
                                <p className="text-gray-700 montserrat">Hora: 3:00 pm</p>
                            </div>
                            <Divider orientation="vertical" />
                            <div className="flex text-gray-700 montserrat ml-4 mr-2">Personas convocadas:</div>
                            <div className="flex">
                                <AvatarGroup max={3} className="space-x-2">
                                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                                    <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                                    <Avatar>+3</Avatar>
                                </AvatarGroup>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
                <Tab key={"finished"} title={"Finalizados"} className={"montserrat text-blue-900"}>
                    <Card className="max-w-full mx-auto my-4" isPressable={true}>
                        <CardHeader className="p-4">
                            <h3 className="text-xl font-bold text-blue-900 montserrat">#1 Reunion para ver temas de gastos</h3>
                        </CardHeader>
                        <Divider className="my-1" />
                        <CardBody className="flex-row justify-between items-center h-28">
                            <div className="mr-4">
                                <p className="text-blue-900 montserrat">Reunion convocada por: Renzo Pinto</p>
                                <p className="text-gray-700 montserrat">Fecha: 13/09/2023</p>
                                <p className="text-gray-700 montserrat">Hora: 3:00 pm</p>
                            </div>
                            <Divider orientation="vertical" />
                            <div className="flex text-gray-700 montserrat ml-4 mr-2">Personas convocadas:</div>
                            <div className="flex">
                                <AvatarGroup max={3} className="space-x-2">
                                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                                    <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                                    <Avatar>+3</Avatar>
                                </AvatarGroup>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className="max-w-full mx-auto my-4" isPressable={true}>
                        <CardHeader className="p-4">
                            <h3 className="text-xl font-bold text-blue-900 montserrat">#1 Reunion para ver temas de gastos</h3>
                        </CardHeader>
                        <Divider className="my-1" />
                        <CardBody className="flex-row justify-between items-center h-28">
                            <div className="mr-4">
                                <p className="text-blue-900 montserrat">Reunion convocada por: Renzo Pinto</p>
                                <p className="text-gray-700 montserrat">Fecha: 13/09/2023</p>
                                <p className="text-gray-700 montserrat">Hora: 3:00 pm</p>
                            </div>
                            <Divider orientation="vertical" />
                            <div className="flex text-gray-700 montserrat ml-4 mr-2">Personas convocadas:</div>
                            <div className="flex">
                                <AvatarGroup max={3} className="space-x-2">
                                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                                    <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                                    <Avatar>+3</Avatar>
                                </AvatarGroup>
                            </div>
                        </CardBody>
                    </Card>
                </Tab>
            </Tabs>

        </div>
    );
}
