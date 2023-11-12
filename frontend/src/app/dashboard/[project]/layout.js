"use client";
import ProjectSidebar from "@/components/dashboardComps/projectComps/ProjectSidebar";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";
import { createContext, useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

import axios from "axios";
import { SessionContext } from "../layout";
axios.defaults.withCredentials = true;

export const SmallLoadingScreen = createContext();
export const HerramientasInfo = createContext();
export const ProjectInfo = createContext();

export default function RootLayout({ children, params }) {
    const decodedUrl = decodeURIComponent(params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [isLoadingSmall, setIsLoadingSmall] = useState(true);
    const [herramientasInfo, setHerramientasInfo] = useState(null);
    const [projectInfo, setProjectInfo] = useState(null);

    const { sessionData, setSession } = useContext(SessionContext);
    const [rolHasBeenAsigned, setRolAsigned] = useState(false);
    const [isSidebarDone, setIsSidebarDone] = useState(false);

    const [projectRolData, setProjectRolData] = useState({
        rolInProject: 1,
        rolNameInProject: "",
    });

    useEffect(() => {
        setIsLoadingSmall(true);
        console.log("entro a project");
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/usuario/verRolUsuarioEnProyecto";

        axios
            .post(stringURL, {
                idUsuario: sessionData.idUsuario,
                idProyecto: projectId,
            })
            .then(function (responseFirst) {
                const new_session = { ...sessionData };
                new_session.rolInProject = responseFirst.data.rol.idRol;
                new_session.rolNameInProject = responseFirst.data.rol.nombre;
                setSession(new_session);

                console.log(
                    "Bienvenido Usuario => " + JSON.stringify(new_session)
                );

                setProjectRolData({
                    rolInProject: responseFirst.data.rol.idRol,
                    rolNameInProject: responseFirst.data.rol.nombre,
                });
                //setIsLoading(false);
                setRolAsigned(true);
                console.log("============= LAYOUT ROLES TERMINO DE CARGAR");
            })
            .catch(function (error) {
                console.log(error);
            });


        const stringURL2 =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/herramientas/" +
            projectId +
            "/listarHerramientasDeProyecto";
        axios
            .get(stringURL2)
            .then(function (response) {
                setHerramientasInfo(response.data.herramientas);
                console.log(
                    "============= LAYOUT HERRAMIENTAS TERMINO DE CARGAR"
                );
                //setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });


        const stringURL3 =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/verInfoProyecto/" +
            projectId;
        axios
            .get(stringURL3)
            .then(function (response) {
                setProjectInfo(response.data.infoProyecto);
                console.log(
                    "============= LAYOUT PROYECT INFO TERMINO DE CARGAR"
                );
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        //AQUI CAMBIE BODY POR DIV, YA QUE AL TENER BODY QUITA EL LAYOUT DEL DASHBOARD
        <div className="DashboardProjectContainer" style={{ width: "100%" }}>
            <SmallLoadingScreen.Provider value={{ setIsLoadingSmall }}>
                <ProjectSidebar
                    projectName={projectName}
                    projectId={projectId}
                    projectIdRole={projectRolData.rolInProject}
                    projectNameRole={projectRolData.rolNameInProject}
                    currentUrl={params.project}
                    handlerImDone={() => {
                        setIsSidebarDone(true);
                        console.log("============ SIDEBAR TERMINO DE CARGAR");
                    }}
                ></ProjectSidebar>

                <ProjectInfo.Provider value={{projectInfo, setProjectInfo}}>
                    <HerramientasInfo.Provider value={{ herramientasInfo }}>
                        <div
                            style={{
                                flex: "1",
                                position: "relative",
                            }}
                            className="h-[100%] bg-mainBackground"
                        >
                            {isLoadingSmall && (
                                <div
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: ".2rem",
                                        zIndex: 10,
                                    }}
                                    className="bg-mainBackground"
                                >
                                    <p
                                        style={{
                                            fontFamily: "Montserrat",
                                            fontSize: "2.5rem",
                                            color: "lightgray",
                                            fontWeight: "700",
                                        }}
                                    >
                                        ProyePUCP
                                    </p>
                                    <Box
                                        sx={{ width: "170px", color: "lightgray" }}
                                    >
                                        <LinearProgress color="inherit" />
                                    </Box>
                                </div>
                            )}
                            <div className="h-[100%] overflow-auto bg-mainBackground">
                                {herramientasInfo !== null && projectInfo !== null &&
                                    rolHasBeenAsigned &&
                                    isSidebarDone &&
                                    children}
                            </div>
                        </div>
                    </HerramientasInfo.Provider>
                </ProjectInfo.Provider>
            </SmallLoadingScreen.Provider>
        </div>
    );
}
