"use client"
import TextInfoCard from "@/components/dashboardComps/projectComps/appConstComps/TextInfoCard";
import CardEquipo from "@/components/equipoComps/CardEquipo";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
import ProgressBar from "@/components/equipoComps/ProgressBar";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

const grupos = [
    
    {
        id: 1,
        nombre: "Módulo 1 - Front End",
        coordinador: "Diego Iwasaki",
        bgcolor: "#ef6c00", 
        completed: 53, 
        miembros: [
            {
              id: 1,
              nombre: "Sebastian Chira",
              correo: "s.chira@pucp.edu.pe",
              iconSrc: "/icons/usr-img.svg",
            },
            {
              id: 2,
              nombre: "Augusto Tong",
              correo: "avtong@pucp.edu.pe",
              iconSrc: "/icons/usr-img.svg",
            }
          ],
    },
    {
        id: 2,
        nombre: "Módulo 2 - Back End",
        coordinador: "Diego Iwasaki",
        bgcolor: "#ef6c00", 
        completed: 25, 
        miembros: [
            {
              id: 1,
              nombre: "Sebastian Chira 2",
              correo: "s.chira@pucp.edu.pe",
              iconSrc: "/icons/usr-img.svg",
            },
            {
              id: 2,
              nombre: "Augusto Tong 2",
              correo: "avtong@pucp.edu.pe",
              iconSrc: "/icons/usr-img.svg",
            }
          ],
    },
    {
        id: 3,
        nombre: "Módulo 3 - Front End",
        coordinador: "Diego Iwasaki",
        bgcolor: "#ef6c00", 
        completed: 67, 
        miembros: [
            {
              id: 1,
              nombre: "Sebastian Chira 3",
              correo: "s.chira@pucp.edu.pe",
              iconSrc: "/icons/usr-img.svg",
            },
            {
              id: 2,
              nombre: "Augusto Tong 3",
              correo: "avtong@pucp.edu.pe",
              iconSrc: "/icons/usr-img.svg",
            }
          ],
    },
    
    {
        id: 4,
        nombre: "Módulo 4 - El Equipo Dinamita Papá",
        coordinador: "Diego Iwasaki",
        bgcolor: "#ef6c00", 
        completed: 60, 
        miembros: [
            {
              id: 1,
              nombre: "Sebastian Chira 4",
              correo: "s.chira@pucp.edu.pe",
              iconSrc: "/icons/usr-img.svg",
            },
            {
              id: 2,
              nombre: "Augusto Tong 4",
              correo: "avtong@pucp.edu.pe",
              iconSrc: "/icons/usr-img.svg",
            }
          ],
    },
    
];

export default function Equipo(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.charAt(decodedUrl.length - 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));



    return (
        <div className="container">
            <div className="header">
            <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem href="/dashboard/Proyectos" text="Proyecto" />
                    <BreadcrumbsItem href="/dashboard/Proyectos/Proyecto" text="Equipos" />
                </Breadcrumbs>
            </div>
            <div className="title">Equipos</div>
            <div className="titleAndOptions">
                <div className="subtitle">Divide tu trabajo en los equipos que consideres necesarios</div>
                {grupos.length > 0 && (
                    <div className="buttonAddTeam">
                        <a href={"/dashboard/"+projectName+"="+projectId+"/Equipo/nuevo_equipo"}>
                            <button className="addTeambtn">Crear Equipo</button>
                        </a>
                    </div>
                )} 
            </div>
            {/*<div className="flex flex-row items-start justify-between w-500">*/}
            {grupos.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 mt-2">
                {grupos.map((grupo) => (
                    <CardEquipo
                        key={grupo.id}
                        nombre={grupo.nombre}
                        coordinador={grupo.coordinador}
                        bgcolor={grupo.bgcolor}
                        completed={grupo.completed}
                        miembros={grupo.miembros}
                    />
                ))}
                </div>
            ) : (
                <div className="noTeamsMessage">
                    <h2>¡Vaya!</h2>
                    <p className="littleMessage">¡Parece que aún no tienes equipos en este proyecto! <br /> 
                        Recuerda que delegar tareas es muy importante.</p>
                    <p className="wannaCreateOne">¿Quieres crear un equipo?</p>
                    <div className="noTeamsButtonAddTeam">
                        <a href={"/dashboard/"+projectName+"="+projectId+"/Equipo/nuevo_equipo"}>
                            <button className="addTeambtn">Crear Equipo</button>
                        </a>
                    </div>
                </div>
            )}  
        </div>
    );
}