import Link from "next/link";
import EDT from "./EDT/page";

export default function Project() {
    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <div>
            <p>
            aqui iria el dashboard principal (lo que se ve al iniciar sesion)
            </p>

            
            <Link href={'/dashboard/project/EDT'}>
                <button>ir a edt</button>
            </Link>
        </div>
    );
}