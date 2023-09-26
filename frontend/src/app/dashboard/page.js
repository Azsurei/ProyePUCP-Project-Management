import Link from "next/link";

export default function Dashboard() {
    return (
        //Aqui va el codigo del contenido del dashboard
        <Link href={'/dashboard/project'}>
            <button>
                hola
            </button>
        </Link>
    );
}