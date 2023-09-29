"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Project(props) {

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.charAt(decodedUrl.length - 1);
    const projectName= decodedUrl.substring(0, decodedUrl.lastIndexOf('='));

    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <div style={{flex:1}}>
            <p>
            aqui iria el dashboard principal (lo que se ve al iniciar sesion) 
            </p>

            
            <Link href={'/dashboard/' + projectName+'='+projectId + '/EDT'}>
                <button>ir a edt</button>
            </Link>
        </div>
    );
}