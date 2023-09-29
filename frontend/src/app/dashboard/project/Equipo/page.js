"use client"
import CardEquipo from "@/components/equipoComps/CardEquipo";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
const grupos = [
    {
        id: 1,
        nombre: "Módulo 1 - Front End",
        coordinador: "Diego Iwasaki",
    },
    {
        id: 2,
        nombre: "Módulo 2 - Front End",
        coordinador: "Diego Iwasaki",
    },
    {
        id: 3,
        nombre: "Módulo 3 - Front End",
        coordinador: "Diego Iwasaki",
    },
];

export default function Equipo() {
    return (
        <div className="container">
            <div className="header">
                Inicio / Proyectos / Nombre del proyecto / Equipos
            </div>
            <div className="flex flex-row items-start justify-between w-full">
                {grupos.map((grupo) => (
                    <CardEquipo
                        key={grupo.id}
                        nombre={grupo.nombre}
                        coordinador={grupo.coordinador}
                    />
                ))}
            </div>
        </div>
    );
}
