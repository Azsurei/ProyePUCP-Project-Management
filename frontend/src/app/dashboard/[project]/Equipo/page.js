"use client"
import TextInfoCard from "@/components/dashboardComps/projectComps/appConstComps/TextInfoCard";
import CardEquipo from "@/components/equipoComps/CardEquipo";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
import ProgressBar from "@/components/equipoComps/ProgressBar";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { useState, useEffect, useContext } from "react";
import { SmallLoadingScreen } from "../layout";
import axios from "axios";

axios.defaults.withCredentials = true;

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
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    setIsLoadingSmall(false);
    const [ListComps, setListComps] = useState([]);

    useEffect(() => {
        let teamsArray;
        const stringURL = "http://localhost:8080/api/proyecto/equipo/listarEquiposYParticipantes/${projectId}";
        console.log(stringURL);

        axios
            .get(stringURL)
            .then((response) => {
                // Verificar si la solicitud fue exitosa
                if (response.data && response.data.equipos) {
                  // Establecer la lista de equipos en el estado
                  setListComps(response.data.equipos);
                }
              })
            /*
            .then(function (response) {
                console.log(response);
                teamsArray = response.data.equipos;

                teamsArray = teamsArray.map((team) => {
                    return {
                        idEquipo: team.idEquipo,
                        idProyecto: team.idProyecto,
                        nombre: team.nombre,
                        descripcion: team.descripcion,
                        activo: 1,
                        participantes: team.participantes,
                    };
                });

                setListComps(teamsArray);
                console.log(teamsArray);
                setIsLoading(false);
            })
            */
            .catch(function (error) {
                console.log("Error al cargar la lista de equipos",error);
            });
    }, []);
    
    return (
        <div className="container">
            <div className="header">
            <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem href="/dashboard/Proyectos" text={projectName} />
                    <BreadcrumbsItem href="/dashboard/Proyectos/" text="Equipos" />
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
                {/* Usar ListComps en vez de grupos*/}
                {ListComps.map((team) => (
                    <CardEquipo
                        key={team.idEquipo}
                        nombre={team.nombre}
                        coordinador={team.descripcion}
                        //bgcolor={grupo.bgcolor}
                        //completed={grupo.completed}
                        miembros={team.participantes}
                    />
                ))}
                </div>
            ) : (
                <div className="noTeamsMessage">
                    <h2>¡Vaya!</h2>
                    <p className="littleMessage">¡Aún no tienes equipos en este proyecto! <br /> 
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