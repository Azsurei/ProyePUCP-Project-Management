import React from "react";
import Card from "@/components/Card";
import CardParticipantes from "@/components/equipoComps/CardParticipantes";
import TextField from "@/components/TextField";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/CrearEquipo.css";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

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
            <div className="header">
                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem href="/dashboard/Proyectos" text="Proyecto" />
                    <BreadcrumbsItem href="/dashboard/Proyectos/Proyecto" text="Equipos" />
                </Breadcrumbs>
            </div>
            <div className="title">Crear Equipo</div>
            <div className="nombreEquipo">
                <h3>Nombre del equipo:</h3>
                <TextField
                    placeholder="Ingrese el nombre del equipo"
                    width={600}
                />
            </div>
            <div className="participantes">
                <h3>Participantes:</h3>
                <TextField
                    placeholder="Ingrese los correos de los participantes"
                    width={600}
                />
                <div style={{ marginBottom: '20px' }}></div>
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
            <div className="bottom">
                <button className="addTeamBtn">Crear Equipo</button>
            </div>
        </div>
    )
}