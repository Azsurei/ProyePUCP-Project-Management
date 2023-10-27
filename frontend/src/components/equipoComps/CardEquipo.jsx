"use client";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/CrearEquipo.css";
import React, { useEffect, useState } from "react";

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
            <div
                className="w-full max-w-[70rem] min-h-[205px] shadow-md 
          border border-gray-300 rounded-lg card-hover my-2 overflow-hidden"
                onClick={() => {
                    handleSeeTeam(team);
                }}
            >
                <div className="pl-2 pr-2">
                    <div className="mt-4 ml-4 mr-16 mb-2 flex items-center justify-between">
                        <div
                            variant="h6"
                            color="blue-gray"
                            className="font-semibold"
                        >
                            {team.nombre}
                        </div>
                    </div>
                    <p className="text-sm ml-4">
                        Líder:{" "}
                        {capitalizeWords(
                            `${team.nombreLider} ${team.apellidoLider}`
                        )}
                    </p>

                    {team.participantes.length > 0 ? (
                        <div className="divPictures">
                            {team.participantes
                                .slice(0, 4)
                                .map((member, index) => (
                                    <p
                                        className="membersIcon"
                                        key={member.idUsuario}
                                    >
                                        {member.nombres[0]}
                                        {member.apellidos!==null? member.apellidos[0] : ""}
                                    </p>
                                ))}
                            {team.participantes.length > 4 && (
                                <p className="membersIcon">
                                    +{team.participantes.length - 4}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="ml-4 h-[50px]">
                            Este equipo no cuenta con miembros
                        </p>
                    )}
                </div>
                <div>
                    <div className="progressBarContainer">
                        aqui iba el progressbar
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardEquipo;
