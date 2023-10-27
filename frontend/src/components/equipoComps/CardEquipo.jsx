"use client";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/CrearEquipo.css";
import React, { useEffect, useState } from "react";
import { Avatar, Progress } from "@nextui-org/react";

const CardEquipo = ({ team, handleSeeTeam }) => {
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
        <div>
            <div    //estaba en 70
                className="w-full max-w-[30rem] shadow-md 
          border border-gray-300 rounded-lg card-hover my-2 overflow-hidden p-[1rem]"
                onClick={() => {
                    handleSeeTeam(team);
                }}
            >
                <div>
                    <p className="cardEquipoBigHeader">{team.nombre}</p>
                    <p className="cardEquipoLeaderLbl mb-2">
                        Líder:{" "}
                        {capitalizeWords(
                            `${team.nombreLider} ${team.apellidoLider}`
                        )}
                    </p>
                </div>

                {team.participantes.length > 0 ? (
                    <div className="divPictures mb-2">
                        {team.participantes.map((member, index) => (
                            <>
                                <Avatar
                                    //isBordered
                                    //as="button"
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
                            </>
                        ))}
                    </div>
                ) : (
                    <p className="h-[50px]">
                        Este equipo no cuenta con miembros
                    </p>
                )}
                <div className="progressBarContainer">
                    <Progress
                        color="primary"
                        aria-label="Loading..."
                        value={70}
                    />
                </div>
            </div>
        </div>
    );
};

export default CardEquipo;
