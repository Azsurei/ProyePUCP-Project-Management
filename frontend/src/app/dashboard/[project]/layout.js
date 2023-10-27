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

export default function RootLayout({ children, params }) {
    const decodedUrl = decodeURIComponent(params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [isLoadingSmall, setIsLoadingSmall] = useState(true);

    const { sessionData, setSession } = useContext(SessionContext);
    useEffect(() => {
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL + "/api/usuario/verRolUsuarioEnProyecto";

        axios
            .post(stringURL,{
                idUsuario: sessionData.idUsuario,
                idProyecto: projectId
            })
            .then(function (response) {
                const user_rol = response.data.rol.idRol;
                const new_session = {...sessionData};
                new_session.rolInProject = user_rol;
                setSession(new_session);

                console.log("Bienvenido Usuario => " + JSON.stringify(new_session));
                //setIsLoading(false);
                setIsLoadingSmall(false);
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
                    currentUrl={params.project}
                ></ProjectSidebar>
                <div
                    style={{
                        flex: "1",
                        backgroundColor: "white",
                        position: "relative",
                    }}
                    className="h-[100%] overflow-auto"
                >
                    {isLoadingSmall && (
                        <div
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                background: "white",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: ".2rem",
                                zIndex: 10
                            }}
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
                            <Box sx={{ width: "170px", color: "lightgray" }}>
                                <LinearProgress color="inherit" />
                            </Box>
                        </div>
                    )}
                    {children}
                </div>
            </SmallLoadingScreen.Provider>
        </div>
    );
}
