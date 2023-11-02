"use client";

import InConstruction from "@/common/InConstruction";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { SmallLoadingScreen } from "./layout";

import axios from "axios";
axios.defaults.withCredentials = true;

export default function Project(props) {
    

    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    useEffect(()=>{
        setIsLoadingSmall(false);
    },[]);


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
                        fontWeight: "400",
                        margin: "0 0",
                    }}
                    className="text-mainHeaders"
                >
                    Bienvenido a tu proyecto!
                </p>
                <p
                    style={{
                        fontFamily: "Montserrat",
                        fontSize: "3rem",
                        fontWeight: "600",
                        margin: "0 0",
                        lineHeight: "40px",
                    }}
                    className="text-mainHeaders"
                >
                    {projectName}
                </p>
            </div>
        </div>
    );
}
