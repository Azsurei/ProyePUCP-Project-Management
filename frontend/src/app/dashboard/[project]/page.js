"use client";

import InConstruction from "@/common/InConstruction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { SmallLoadingScreen } from "./layout";

export default function Project(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    useEffect(() => {
        setIsLoadingSmall(false);
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
                        margin: '0 0'
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
                        margin: '0 0',
                        lineHeight: '40px'
                    }}
                >
                    {projectName}
                </p>
            </div>
        </div>
    );
}
