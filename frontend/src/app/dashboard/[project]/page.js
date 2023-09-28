"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Project(props) {

    const projectName = props.params.project;

    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <div>
            <p>
            aqui iria el dashboard principal (lo que se ve al iniciar sesion) 
            </p>

            
            <Link href={'/dashboard/' + projectName + '/EDT'}>
                <button>ir a edt</button>
            </Link>
        </div>
    );
}