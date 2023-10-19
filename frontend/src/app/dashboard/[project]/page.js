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
        <div >
            <p
                style={{
                    fontFamily: "Montserrat",
                    fontSize: "2.5rem",
                    color: "#172B4D",
                    fontWeight: "600",
                }}
            >
                {projectName}
            </p>
        </div>
    );
}
