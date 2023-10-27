"use client";

import InConstruction from "@/common/InConstruction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { SmallLoadingScreen } from "./layout";
import { SessionContext } from "../layout";

import axios from "axios";
axios.defaults.withCredentials = true;

export default function Project(props) {
    const { sessionData, setSession } = useContext(SessionContext);

    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

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
        //aqui va el contenido dentro de la pagina de ruta /project
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <div>
                <p
                    style={{
                        fontFamily: "Montserrat",
                        fontSize: "1.5rem",
                        color: "#172B4D",
                        fontWeight: "400",
                        margin: "0 0",
                    }}
                >
                    Bienvenido a tu proyecto!
                </p>
                <p
                    style={{
                        fontFamily: "Montserrat",
                        fontSize: "3rem",
                        color: "#172B4D",
                        fontWeight: "600",
                        margin: "0 0",
                        lineHeight: "40px",
                    }}
                >
                    {projectName}
                </p>
            </div>
        </div>
    );
}
