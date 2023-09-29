"use client"
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import CardEquipo from "@/components/equipoComps/CardEquipo";
import Card from "@/components/Card";

const grupos = [
    {
        id: 1,
        nombre: "Módulo 1 - Front End",
        descripcion: "avtong@pucp.edu.pe",
    },
    {
        id: 2,
        nombre: "Módulo 2 - Front End",
        descripcion: "avtong@pucp.edu.pe",
    },
    {
        id: 3,
        nombre: "Módulo 3 - Front End",
        descripcion: "avtong@pucp.edu.pe",
    },
];

export default function Equipo() {
    return (
        <div className="EDT">
            <HeaderWithButtons 
                haveReturn={false} 
                haveAddNew={true}
                hrefToReturn={''}
                hrefForButton={'/dashboard/project/Equipo/nuevo_equipo'}
                breadcrump={'Inicio / Proyectos / Proyect X / Equipos'}
                btnText={'Crear nuevo equipo'}
            >
                Equipos
            </HeaderWithButtons>
            <div className="componentSearchContainer">
                <input type="text" /> 
                <button>
                    Buscar
                </button>
            </div>
            <div className="flex flex-row items-start justify-between w-full">
                {grupos.map((grupo) => (
                    <CardEquipo
                        key={grupo.id}
                        nombre={grupo.nombre}
                        descripcion={grupo.descripcion}
                    />
                ))}
            </div>
        </div>
    );
}
