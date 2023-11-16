"use client";

import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListProject.css";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import { SessionContext } from "@/app/dashboard/layout";
import {Avatar, Chip, Spacer} from "@nextui-org/react";
import { Tabs, Tab} from "@nextui-org/react";
axios.defaults.withCredentials = true;

const memberDataProject = [
    {
        id: "1",
    },

    {
        id: "2",
    },

    {
        id: "3",
    },
];

const roleColor = [
    {
        idRol: 1,
        color: "danger",
    },
    {
        idRol: 2,
        color: "warning",
    },
    {
        idRol: 3,
        color: "primary",
    },
];

function ProjectCard(props) {
    let msgNoDates;
    if(props.fechaInicio === null || props.fechaFin === null || props.fechaInicio === "0000-00-00" || props.fechaFin === "0000-00-00"){
        msgNoDates = "Sin fechas definidas";
    }
    else{
        msgNoDates = 0;
    }

    const startDate = new Date(props.fechaInicio);
    const endDate = new Date(props.fechaFin);

    // Calcula la diferencia en días
    const diffInDays = Math.floor(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
    );

    // Formatea las fechas
    const formattedStartDate = startDate.toLocaleDateString();
    const formattedEndDate = endDate.toLocaleDateString();

    

    return (
        <li className="ProjectCard bg-mainBackground hover:bg-[#eeeeee] dark:hover:bg-opacity-10" onClick={props.onClick}>
            <p className="cardTitleProject">{props.name}</p>

            <p className="cardDates">
                {msgNoDates === 0 && `${formattedStartDate} - ${formattedEndDate} (${diffInDays} días)`}
                {msgNoDates !== 0 && `${msgNoDates}`}
            </p>

            {/* <div className={"teamTag bg-" + roleColor[props.roleId - 1].color}>
                <p>{props.roleName}</p>
            </div> */}

            <Chip
                className="capitalize"
                color={roleColor[props.roleId - 1].color}
                size="md"
                variant="flat"
            >
                {props.roleName}
            </Chip>

            {props.miembros.length > 0 ? (
                <div className="divPictures">
                    {props.miembros.map((member) => (
                        <Avatar
                            //isBordered
                            //as="button"
                            key={member.idUsuario}
                            className="transition-transform w-[2.5rem] min-w-[2.5rem] h-[2.5rem] min-h-[2.5rem] bg-mainUserIcon"
                            radius="md"
                            src={member.imgLink}
                            fallback={
                                <p
                                    className="membersIcon bg-mainUserIcon"
                                    key={member.idUsuario}
                                >
                                    {member.nombres[0]}
                                    {member.apellidos !== null
                                        ? member.apellidos[0]
                                        : ""}
                                </p>
                            }
                        />
                    ))}
                </div>
            ) : (
                <p className="emptyMembers mt-2">
                    Este proyecto no cuenta con miembros
                </p>
            )}
        </li>
    );
}

//Aqui es la lista de Proyectos

export default function ListProject(props) {
    //const {sessionData, setSession} = useContext(SessionContext);

    const router = useRouter();
    const { filterValue, onSearchChange } = props;
    function handleClick(proy_id, proy_name) {
        router.push("/dashboard/" + proy_name + "=" + proy_id);
    }

    const [isLoading, setIsLoading] = useState(true); //loading screen seteada por defecto
    const [ListComps, setListComps] = useState([]);

    useEffect(() => {
        let proyectsArray;
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/listarProyectos";

        axios
            .get(stringURL)
            .then(function (response) {
                console.log(response);
                proyectsArray = response.data.proyectos;

                proyectsArray = proyectsArray.map((proyect) => {
                    return {
                        id: proyect.idProyecto,
                        name: proyect.nombre,
                        dateStart: proyect.fechaInicio,
                        dateEnd: proyect.fechaFin,
                        members: proyect.miembros,
                        roleId: proyect.idRol,
                        roleName: proyect.nombrerol,
                    };
                });

                setListComps(proyectsArray);
                console.log(proyectsArray);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);
    const filteredProjects = ListComps.filter((component) => {
        const projectName = component.name.toLowerCase();
        return projectName.includes(filterValue.toLowerCase());
    });
    // State for active tab index
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    // Split projects into 'In Progress' and 'Completed'
    const proyectosEnProceso = ListComps.filter(proyecto => {
        const endDate = new Date(proyecto.dateEnd);
        return !endDate || endDate > new Date();
    });

    const proyectosFinalizados = ListComps.filter(proyecto => {
        const endDate = new Date(proyecto.dateEnd);
        return endDate && endDate <= new Date();
    });

    // Function to render projects in a list
    const renderProjectList = (projects) => (
        projects.filter(component => component.name.toLowerCase().includes(filterValue.toLowerCase()))
            .map(component => (
                <ProjectCard
                    key={component.id}
                    name={component.name}
                    fechaInicio={component.dateStart}
                    fechaFin={component.dateEnd}
                    miembros={component.members}
                    roleId={component.roleId}
                    roleName={component.roleName}
                    onClick={() => {
                        // const updSessionData = {...sessionData};
                        // updSessionData.rolInProject = component.roleId;
                        // setSession(updSessionData);
                        handleClick(component.id, component.name);
                    }}
                ></ProjectCard>
            ))
    );

    return (
        <div className="flex w-full flex-col">
            <Spacer y={"12px"} />
            <Tabs
                value={activeTabIndex}
                onChange={setActiveTabIndex}
                aria-label="Project Status Tabs"
                color={"warning"}
                variant={"bordered"}
                classNames={{
                    tabList: "gap-2 relative",
                    tabContent: "group-data-[selected=true]:text-[#ffffff] font-bold"
                }}
            >
                <Tab
                    key="enProceso"
                    title="En Proceso"
                    className="montserrat text-blue-900"
                    radius="full"
                >
                    <ul className="ListProject">
                        {renderProjectList(proyectosEnProceso)}
                    </ul>
                </Tab>
                <Tab
                    key="finalizadas"
                    title="Finalizadas"
                    className="montserrat text-blue-900"
                    radius="full"
                >
                    <ul className="ListProject">
                        {renderProjectList(proyectosFinalizados)}
                    </ul>
                </Tab>
            </Tabs>
            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </div>
    );
}
