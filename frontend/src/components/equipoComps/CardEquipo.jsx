"use client";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/CrearEquipo.css";
import React, { useEffect, useState } from "react";
import { Avatar, Progress } from "@nextui-org/react";

const CardEquipo = ({ team, handleSeeTeam }) => {
    const totalTareas =
        (team.tareasTotales !== null ? team.tareasTotales : 0) +
        (team.tareasFinished !== null ? team.tareasFinished : 0);

    let progressValue;
    if (totalTareas === 0) {
        progressValue = 0;
    } else {
        progressValue =
            ((team.tareasFinished !== null ? team.tareasFinished : 0) /
                totalTareas) *
            100;
    }

    function capitalizeWords(str) {
        // Dividimos la cadena en palabras usando el espacio como separador
        const words = str.split(" ");

        // Iteramos por cada palabra y aplicamos la capitalización
        const capitalizedWords = words.map((word) => {
            // Convierte la primera letra a mayúscula y el resto a minúscula
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });

        // Unimos las palabras nuevamente en una cadena
        return capitalizedWords.join(" ");
    }
    return (
        <>
            <div //estaba en 70
                className="w-full shadow-md 
                border border-gray-300 rounded-lg card-hover hover:bg-[#5088e9] dark:hover:bg-[rgba(238,238,238,0.1)] my-2 overflow-hidden p-[1rem]"
                onClick={() => {
                    handleSeeTeam(team);
                }}
            >
                <div>
                    <p className="cardEquipoBigHeader">{team.nombre}</p>
                    <p className="cardEquipoLeaderLbl mb-2 h-[52.81px]">
                        Líder:{" "}
                        {team.participantes.length===0? "No asignado":capitalizeWords(
                            `${team.participantes[0].nombres} ${team.participantes[0].apellidos}`
                        )}
                    </p>
                </div>

                {team.participantes.length > 0 ? (
                    <div className="divPictures mb-2">
                        {team.participantes.map((member, index) => (
                            <Avatar
                                //isBordered
                                //as="button"
                                key={member.idUsuario}
                                className="transition-transform w-[50px] min-w-[50px] h-[50x] min-h-[50px]"
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
                    <p className="h-[50px] mb-2">
                        Este equipo no cuenta con miembros
                    </p>
                )}
                <div className="progressBarContainer flex flex-row items-center">
                    <Progress
                        color="primary"
                        aria-label="Loading..."
                        value={progressValue}
                        className="w-[100%]"
                    />
                    <p className="min-w-[40px] w-[40px] flex justify-center">
                        {(progressValue !== null || progressValue !== undefined
                            ? progressValue
                            : 0) + "%"}
                    </p>
                </div>
            </div>
        </>
    );
};

export default CardEquipo;
