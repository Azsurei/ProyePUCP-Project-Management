import React from "react";
import Card from "@/components/Card";
import CardParticipantes from "@/components/equipoComps/CardParticipantes";
import TextField from "@/components/TextField";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/projectMenu.css";

const miembros = [
    {
        id: 1,
        iconSrc: "/icons/usr-img.svg",
        nombre: "Augusto Victor Tong Yang",
        correo: "avtong@pucp.edu.pe",
    },
    {
        id: 2,
        iconSrc: "/icons/usr-img.svg",
        nombre: "Augusto Victor Tong Yang",
        correo: "avtong@pucp.edu.pe",
    },
    {
        id: 3,
        iconSrc: "/icons/usr-img.svg",
        nombre: "Augusto Victor Tong Yang",
        correo: "avtong@pucp.edu.pe",
    },
    {
        id: 4,
        iconSrc: "/icons/usr-img.svg",
        nombre: "Augusto Victor Tong Yang",
        correo: "avtong@pucp.edu.pe",
    },
];

export default function crear_equipo(){
    return(
        <div className="crear_equipo">
            <div className="Header">
                <h1>Crear Equipo:</h1>
            </div>
            <div className="nombreEquipo">
                <h3>Nombre del equipo:</h3>
                <TextField
                    placeholder="Ingrese el nombre del equipo"
                    width={600}
                />
                <h3>Participantes:</h3>
                {miembros.map((miembros) => (
                    <div className="flex flex-col items-start justify-between w-full" key={miembros.id}>
                        <Card>
                            <CardParticipantes
                                iconSrc={miembros.iconSrc}
                                nombre={miembros.nombre}
                                correo={miembros.correo}
                            />
                        </Card>
                    </div>
                ))}
            </div>
            <button className="addProjectbtn">Crear Equipo</button>
        </div>
    )
}