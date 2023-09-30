"use client"
import TextInfoCard from "@/components/dashboardComps/projectComps/appConstComps/TextInfoCard";
import CardEquipo from "@/components/equipoComps/CardEquipo";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
import ProgressBar from "@/components/equipoComps/ProgressBar";

const grupos = [
    {
        id: 1,
        nombre: "Módulo 1 - Front End",
        coordinador: "Diego Iwasaki",
        bgcolor: "#ef6c00", 
        completed: 53, 
    },
    {
        id: 2,
        nombre: "Módulo 2 - Front End",
        coordinador: "Diego Iwasaki",
        bgcolor: "#ef6c00", 
        completed: 53, 
    },
    {
        id: 3,
        nombre: "Módulo 3 - Front End",
        coordinador: "Diego Iwasaki",
        bgcolor: "#ef6c00", 
        completed: 53, 
    },
];

export default function Equipo(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.charAt(decodedUrl.length - 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));



    return (
        <div className="container">
            <div className="header">
                Inicio / Proyectos / Nombre del proyecto / Equipos
            </div>
            <div className="title">Equipos</div>
            <div className="butonAddProject">
                    <a href={"/dashboard/"+projectName+"="+projectId+"/Equipo/nuevo_equipo"}>
                        <button className="addProjectbtn">Crear Equipo</button>
                    </a>
                </div>
            <div className="flex flex-row items-start justify-between w-500">
                {grupos.map((grupo) => (
                    <CardEquipo
                        key={grupo.id}
                        nombre={grupo.nombre}
                        coordinador={grupo.coordinador}
                        bgcolor={grupo.bgcolor}
                        completed={grupo.completed}
                    />
                ))}
            </div>
        </div>
    );
}