"use client";

import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SmallLoadingScreen } from "../layout";
axios.defaults.withCredentials = true;
import { Button, Avatar, AvatarGroup, Card, Spacer } from '@nextui-org/react';
import { Transition } from '@headlessui/react';
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";

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
        <div className="h-[90%]">
            <HeaderWithButtonsSamePage
                haveReturn={false}
                haveAddNew={true}
                handlerAddNew={null}
                //newPrimarySon={ListComps.length + 1}
                breadcrump={"Inicio / Proyectos / " + projectName}
                btnText={"+ Añadir elemento"}
            >
                Acta de Reunion
            </HeaderWithButtonsSamePage>

            <div className="bg-white p-4 rounded shadow-lg hover:shadow-xl transition ease-in-out duration-150">
                <h3 className="text-xl font-bold">#1 Reunion para ver temas de gastos</h3>
                <p className="mt-2">Reunion convocada por: Renzo Pinto</p>
                <p>Fecha: 13/09/2023</p>
                <p>Hora: 3:00 pm</p>
                <div className="mt-4">
                    <p className="mb-2">Personas convocadas:</p>
                    <AvatarGroup max={3}>
                        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                        <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                        <Avatar>+3</Avatar>
                    </AvatarGroup>
                </div>
            </div>

            <div className="bg-white p-4 mt-8 rounded shadow-lg hover:shadow-xl transition ease-in-out duration-150">
                <h3 className="text-xl font-bold">#2 Gestion de las APIs a usar | Pago de servicios | Control de presupuesto</h3>
                <p className="mt-2">Reunion convocada por: John Doe</p>
                <p>Fecha: 14/09/2023</p>
                <p>Hora: 2:30 pm</p>
                <div className="mt-4">
                    <p className="mb-2">Personas convocadas:</p>
                    <AvatarGroup max={2}>
                        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                        <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                    </AvatarGroup>
                </div>
            </div>

        </div>
    );
}
