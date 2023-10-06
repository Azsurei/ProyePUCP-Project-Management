"use client"

import InConstruction from "@/common/inConstruction";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Project(props) {

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf('=') + 1);
    const projectName= decodedUrl.substring(0, decodedUrl.lastIndexOf('='));

    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <InConstruction></InConstruction>
    );
}