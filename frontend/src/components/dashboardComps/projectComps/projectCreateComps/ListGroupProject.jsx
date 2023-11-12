"use client";

import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListProject.css";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import { Avatar, Chip } from "@nextui-org/react";
import { SessionContext } from "@/app/grupoProyectos/layout";
axios.defaults.withCredentials = true;
function GroupCard(props) {
    const startDate = new Date(props.fechaInicio);
    const endDate = new Date(props.fechaFin);

    // Calcula la diferencia en días
    const diffInDays = Math.floor(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
    );

    // Formatea las fechas
    const formattedStartDate = startDate.toLocaleDateString();
    const formattedEndDate = endDate.toLocaleDateString();

    // useEffect(() => {
    //     console.log("ROL TEST " + props.roleId);
    // });

    return (
        <li className="ProjectCard bg-mainBackground hover:bg-[#eeeeee] dark:hover:bg-opacity-10" onClick={props.onClick}>
            <p className="cardTitleProject">{props.name}</p>

            {/* <p className="cardDates">
                {`${formattedStartDate} - ${formattedEndDate} (${diffInDays} días)`}
            </p> */}

            {/* <div className={"teamTag bg-" + roleColor[props.roleId - 1].color}>
                <p>{props.roleName}</p>
            </div> */}
{/* 
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
            )} */}
        </li>
    );
}
export default function ListGroupProject(props) {
    const router = useRouter();
    const {sessionData} = useContext(SessionContext);
    const { filterValue, onSearchChange } = props;

    function handleClick(proy_id, proy_name) {
        // router.push("/dashboard/" + proy_name + "=" + proy_id);
    }

    const [isLoading, setIsLoading] = useState(true); //loading screen seteada por defecto
    const [ListComps, setListComps] = useState([]);

    useEffect(() => {
        let gruposArray;
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/grupoProyectos/listarGruposProyecto/" + sessionData.idUsuario;

        axios
            .get(stringURL)
            .then(function (response) {
                console.log(response);
                gruposArray = response.data.grupos;

                gruposArray = gruposArray.map((grupos) => {
                    return {
                        id: grupos.idGrupoDeProyecto,
                        name: grupos.nombre,
                    };
                });

                setListComps(gruposArray);
                console.log(gruposArray);
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
                    <GroupCard
                        key={component.id}
                        name={component.name}

                        onClick={() => {
                            // const updSessionData = {...sessionData};
                            // updSessionData.rolInProject = component.roleId;
                            // setSession(updSessionData);
                            // handleClick(component.id, component.name);
                        }}
                    ></GroupCard>
                );
            })}

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </ul>
    );
}