"use client";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/CrearEquipo.css";
import React, { useEffect, useState } from "react";
axios.defaults.withCredentials = true;
import {
    Avatar,
    Progress,
    Tooltip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";

const CardEquipo = ({ team, handleSeeTeam, removeTeam }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

    const eliminarEquipo = () => {
        console.log("Eliminar equipo con id", team.idEquipo);
        const equipoId = team.idEquipo;
        axios
            .delete(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/equipo/eliminarEquipo",
                {
                    data: { idEquipo: equipoId },
                }
            )
            .then(function (response) {
                console.log(response.data.message);
                console.log(
                    `Equipo con ID ${equipoId} eliminado correctamente.`
                );
                removeTeam(team);
                // Puedes realizar otras acciones después de eliminar el equipo si es necesario.
            })
            .catch(function (error) {
                console.log(error);
                console.log(`Error al eliminar el equipo con ID ${equipoId}`);
            });
    };

    return (
        <>
            <div //estaba en 70
                className="relative w-full shadow-md 
                border border-gray-300 rounded-lg card-hover hover:bg-[#5088e9] dark:hover:bg-[rgba(238,238,238,0.1)] my-2 overflow-hidden p-[1rem] group"
                onClick={(e) => {
                    e.stopPropagation();
                    handleSeeTeam(team);
                }}
            >
                <div className="absolute top-2 right-1">
                    <img
                        src="/icons/icon-trash.svg"
                        alt="delete"
                        className="mb-4 cursor-pointer opacity-0 group-hover:opacity-50 hover:group-hover:opacity-100"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpen();
                        }}
                    />
                </div>
                <div>
                    <Tooltip
                        showArrow={true}
                        color="foreground"
                        content={team.nombre}
                    >
                        <p className="cardEquipoBigHeader truncate pr-4">
                            {team.nombre}
                        </p>
                    </Tooltip>
                    <p className="cardEquipoLeaderLbl mb-2 h-[52.81px]">
                        Líder:{" "}
                        {team.participantes.length === 0
                            ? "No asignado"
                            : capitalizeWords(
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
                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    isDismissable={false}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader
                                    className={
                                        "flex flex-col gap-1 text-red-500"
                                    }
                                >
                                    Eliminar equipo
                                </ModalHeader>
                                <ModalBody>
                                    <p>
                                        ¿Seguro que quiere eliminar el equipo?
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        className="bg-indigo-950 text-slate-50"
                                        onPress={() => {
                                            eliminarEquipo();
                                            onClose();
                                        }}
                                    >
                                        Continuar
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </>
    );
};

export default CardEquipo;
