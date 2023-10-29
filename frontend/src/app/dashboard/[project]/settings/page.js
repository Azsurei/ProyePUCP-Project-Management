"use client";
import { Button, Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";

function UsersScreen () {
    return (
        <div className="flex flex-col flex-1 h-[100%] space-y-2">
            <div className="flex flex-col mb-3">
                <p className="text-2xl font-medium text-172B4D">Usuarios</p>
                <p className="text-slate-400">
                    Añade usuarios o elimina algunos de tu proyecto
                </p>
            </div>

            <Divider></Divider>

            <p>Actualmente en el proyecto:</p>
        </div>
    );
}


function ToolsScreen () {
    return (
        <div className="flex flex-col flex-1 h-[100%] space-y-2">
            <div className="flex flex-col mb-3">
                <p className="text-2xl font-medium text-172B4D">Herramientas</p>
                <p className="text-slate-400">
                    Personaliza tus herramientas
                </p>
            </div>

            <Divider></Divider>

            <p>Herramientas usadas:</p>
        </div>
    );
}

function DatesScreen () {
    return (
        <div className="flex flex-col flex-1 h-[100%] space-y-2">
            <div className="flex flex-col mb-3">
                <p className="text-2xl font-medium text-172B4D">Fechas</p>
                <p className="text-slate-400">
                    Modifica datos del proyecto
                </p>
            </div>

            <Divider></Divider>

            <p>Fechas de inicio:</p>

            <p>Fechas de fin:</p>
        </div>
    );
}


export default function Settings() {
    const [settingsState, setSettingsState] = useState("users");
    const btnStyle = "group hover:underline font-medium px-4 py-2 rounded-md cursor-pointer";
    const btnStyleActive = "font-medium px-4 py-2 rounded-md bg-[#F4F4F5] cursor-pointer";

    return (
        <div className="w-[100%] flex justify-center">
            <div className="flex flex-col w-[100%] max-w-[1200px] h-[100%] p-[2.5rem] space-y-7 font-[Montserrat]">
                <div className="flex flex-col">
                    <p className="text-4xl font-semibold text-172B4D">
                        Configura tu proyecto
                    </p>
                    <p className="text-slate-400">
                        Maneja usuarios, herramientas, fechas y mas
                    </p>
                </div>
    
                <Divider className="px-[50px]"></Divider>
    
                <div className="flex flex-row w-[100%] h-[100%] space-x-8">
                    <div className="flex flex-col h-[100%] w-[20%] space-y-1">
                        <p
                            className={
                                settingsState === "users"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            onClick={() => {
                                setSettingsState("users");
                            }}
                        >
                            Usuarios
                        </p>
                        <p
                            className={
                                settingsState === "tools"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            onClick={() => {
                                setSettingsState("tools");
                            }}
                        >
                            Herramientas
                        </p>
                        <p
                            className={
                                settingsState === "dates"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            onClick={() => {
                                setSettingsState("dates");
                            }}
                        >
                            Fechas
                        </p>
                    </div>
    
                    {settingsState==="users" && <UsersScreen></UsersScreen>}
                    {settingsState==="tools" && <ToolsScreen></ToolsScreen>}
                    {settingsState==="dates" && <DatesScreen></DatesScreen>}
                </div>
            </div>
        </div>
    );
}
