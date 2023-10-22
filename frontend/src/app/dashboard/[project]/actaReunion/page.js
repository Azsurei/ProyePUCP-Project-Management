"use client";

import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SmallLoadingScreen } from "../layout";
axios.defaults.withCredentials = true;
import { Button, Avatar, AvatarGroup, Card, Spacer } from '@nextui-org/react';
import {Tabs, Tab} from '@nextui-org/react';
import { Transition } from '@headlessui/react';
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import {Breadcrumbs, BreadcrumbsItem} from "@/components/Breadcrumb";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import Link from "next/link";

export default function ActaReunion(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [screenState, setScreenState] = useState(1);

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
                    <Card hoverable className="p-4 space-y-4">
                        <h3 className="text-xl font-bold text-blue-900 montserrat">#1 Reunion para ver temas de gastos</h3>
                        <text className="block text-blue-900 montserrat">Reunion convocada por: Renzo Pinto</text>
                        <text className="block text-gray-700 montserrat">Fecha: 13/09/2023</text>
                        <text className="block text-gray-700 montserrat mb-2">Hora: 3:00 pm</text>
                        <div className="flex items-center space-x-2">
                            <text className="block text-gray-700 montserrat">Personas convocadas:</text>
                            <AvatarGroup max={3} className="space-x-2">
                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                                <Avatar>+3</Avatar>
                            </AvatarGroup>
                        </div>
                    </Card>
                    <Spacer y={4}></Spacer>
                    <Card hoverable className="p-4 space-y-4">
                        <h3 className="text-xl font-bold text-blue-900 montserrat">#1 Reunion para ver temas de gastos</h3>
                        <text className="block text-blue-900 montserrat">Reunion convocada por: Renzo Pinto</text>
                        <text className="block text-gray-700 montserrat">Fecha: 13/09/2023</text>
                        <text className="block text-gray-700 montserrat mb-2">Hora: 3:00 pm</text>
                        <div className="flex items-center space-x-2">
                            <text className="block text-gray-700 montserrat">Personas convocadas:</text>
                            <AvatarGroup max={3} className="space-x-2">
                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                                <Avatar>+3</Avatar>
                            </AvatarGroup>
                        </div>
                    </Card>
                    <Spacer y={4}></Spacer>
                    <Card hoverable className="p-4 space-y-4">
                        <h3 className="text-xl font-bold text-blue-900 montserrat">#1 Reunion para ver temas de gastos</h3>
                        <text className="block text-blue-900 montserrat">Reunion convocada por: Renzo Pinto</text>
                        <text className="block text-gray-700 montserrat">Fecha: 13/09/2023</text>
                        <text className="block text-gray-700 montserrat mb-2">Hora: 3:00 pm</text>
                        <div className="flex items-center space-x-2">
                            <text className="block text-gray-700 montserrat">Personas convocadas:</text>
                            <AvatarGroup max={3} className="space-x-2">
                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                                <Avatar>+3</Avatar>
                            </AvatarGroup>
                        </div>
                    </Card>
                    <Spacer y={4}></Spacer>
                </Tab>
                <Tab key={"finished"} title={"Finalizados"} className={"montserrat text-blue-900"}>
                    <Card hoverable className="p-4 space-y-4">
                        <h3 className="text-xl font-bold text-blue-900 montserrat">#2 Gestion de las APIs a usar | Pago de servicios | Control de presupuesto</h3>
                        <text className="block text-blue-900 montserrat">Reunion convocada por: John Doe</text>
                        <text className="block text-gray-700 montserrat">Fecha: 14/09/2023</text>
                        <text className="block text-gray-700 montserrat mb-2">Hora: 2:30 pm</text>
                        <div className="flex items-center space-x-2">
                            <text className="block text-gray-700 montserrat">Personas convocadas:</text>
                            <AvatarGroup max={2} className="space-x-2">
                                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                            </AvatarGroup>
                        </div>
                    </Card>
                    <Spacer y={4}></Spacer>
                    <Card hoverable className="p-4 space-y-4">
                        <h3 className="text-xl font-bold text-blue-900 montserrat">#1 Reunion para ver temas de gastos</h3>
                        <text className="block text-blue-900 montserrat">Reunion convocada por: Renzo Pinto</text>
                        <text className="block text-gray-700 montserrat">Fecha: 13/09/2023</text>
                        <text className="block text-gray-700 montserrat mb-2">Hora: 3:00 pm</text>
                        <div className="flex items-center space-x-2">
                            <text className="block text-gray-700 montserrat">Personas convocadas:</text>
                            <AvatarGroup max={3} className="space-x-2">
                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                                <Avatar>+3</Avatar>
                            </AvatarGroup>
                        </div>
                    </Card>
                    <Spacer y={4}></Spacer>
                </Tab>
            </Tabs>

        </div>
    );
}
