"use client";

import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListProject.css";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import { SessionContext } from "@/app/dashboard/layout";
import { Avatar, Chip } from "@nextui-org/react";
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
    const startDate = new Date(props.fechaInicio);
    const endDate = new Date(props.fechaFin);

    // Calcula la diferencia en días
    const diffInDays = Math.floor(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
    );

    // Formatea las fechas
    const formattedStartDate = startDate.toLocaleDateString();
    const formattedEndDate = endDate.toLocaleDateString();

    useEffect(() => {
        console.log("ROL TEST " + props.roleId);
    });

    return (
        <li className="ProjectCard" onClick={props.onClick}>
            <p className="cardTitleProject">{props.name}</p>

            <p className="cardDates">
                {`${formattedStartDate} - ${formattedEndDate} (${diffInDays} días)`}
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
                            className="transition-transform w-[2.5rem] min-w-[2.5rem] h-[2.5rem] min-h-[2.5rem]"
                            radius="md"
                            src={member.imgLink}
                            fallback={
                                <p
                                    className="membersIcon"
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
    return (
        <ul className="ListProject">
            {filteredProjects.map((component) => {
                return (
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
                );
            })}

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </ul>
    );
}
