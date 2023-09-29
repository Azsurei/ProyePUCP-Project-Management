import React from "react";
import Card from "@/components/Card";
import CardEquipo from "@/components/equipoComps/CardEquipo";
import TextField from "@/components/TextField";

const templates = [
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
                {templates.map((template) => (
                    <div key={template.id}>
                        <Card>
                            <CardEquipo
                                iconSrc={template.iconSrc}
                                nombre={template.nombre}
                                correo={template.correo}
                            />
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    )
}