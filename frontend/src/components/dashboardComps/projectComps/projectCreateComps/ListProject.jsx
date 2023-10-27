"use client";

import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListProject.css";
import { useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
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

    return (
        <li className="ProjectCard" onClick={props.onClick}>
            <p className="cardTitleProject">{props.name}</p>

            <p className="cardDates">
                {`${formattedStartDate} - ${formattedEndDate} (${diffInDays} días)`}
            </p>

            {props.miembros.length > 0 ? (
                <div className="divPictures">
                    {props.miembros.map((member) => (
                    <p className="membersIcon" key={member.idUsuario}>
                        {member.nombres[0]}
                        {member.apellidos[0]}
                    </p>
                    ))}
                </div>
            ) : (
                <p className="emptyMembers">Este proyecto no cuenta con miembros</p>
            )}


            <div className="teamTag">
                <p>Los Dibujitos</p>
            </div>
        </li>
    );
}

//Aqui es la lista de Proyectos

export default function ListProject(props) {
    const router = useRouter();

    function handleClick(proy_id, proy_name) {
        router.push("/dashboard/" + proy_name + "=" + proy_id);
    }

    const [isLoading, setIsLoading] = useState(true); //loading screen seteada por defecto
    const [ListComps, setListComps] = useState([]);

    useEffect(() => {
        let proyectsArray;
        const stringURL = process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/listarProyectos";

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

    return (
        <ul className="ListProject">
            {ListComps.map((component) => {
                return (
                    <ProjectCard
                        key={component.id}
                        name={component.name}
                        fechaInicio={component.dateStart}
                        fechaFin={component.dateEnd}
                        miembros={component.members}
                        onClick={() => {
                            handleClick(component.id, component.name);
                        }}
                    ></ProjectCard>
                );
            })}

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </ul>
    );
}
