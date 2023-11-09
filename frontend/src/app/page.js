"use client";

import Button from "@/components/Button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const handleLogin = () => {
        router.push("/login");
    };

    return (
        <div className="flex flex-col max-h-screen mx-auto w-full h-full overflow-y-auto">
            <nav className="flex flex-col justify-between items-center px-8 py-8 w-full bg-white shadow-md sm:py-4 sm:flex-row sm:items-center sm:justify-between">
                <Image
                    src="/images/LogoProyePUCPstandard.png"
                    alt="Logo ProyePUCP"
                    width={200}
                    height={200}
                    className="mb-4 sm:mb-0"
                />
                <ul className="flex flex-col items-center list-none mb-4 sm:mb-0 sm:flex-row gap-4">
                    <li className="">
                        <a
                            href="#"
                            className="text-blue-700 font-bold no-underline"
                        >
                            Servicios
                        </a>
                    </li>
                    <li className="">
                        <a
                            href="#"
                            className="text-blue-700 font-bold no-underline"
                        >
                            Contáctanos
                        </a>
                    </li>
                </ul>
                <Image
                    src="/images/LogoPUCPstandard.png"
                    alt="Logo PUCP"
                    width={150}
                    height={150}
                />
            </nav>
            <main className="flex flex-col md:flex-row justify-evenly items-center p-8 flex-1 w-full ">
                <div className="flex flex-col justify-center items-center md:items-start  p-8 w-full md:w-[35%] gap-3">
                    <h1 className="text-blue-700 text-5xl font-[Montserrat] font-semibold md:text-6xl  ">
                        La manera más fácil de gestionar tus proyectos
                    </h1>
                    <p className="text-gray-700 text-lg mb-5">
                        ProyePUCP es la mejor plataforma educativa que te
                        proveerá de todas las herramientas que necesites para
                        gestionar tus proyectos.
                    </p>
                    <div className="flex justify-center md:justify-start w-full">
                        <Link href={"/login"}>
                            <Button
                                appearance="default"
                                text="¡Inicia ya!"
                                onClick={() => console.log("Llendo a login")}
                                className={"w-52 bg-blue-700 text-white hover:bg-blue-800"}
                            />
                        </Link>
                    </div>
                </div>
                <Image
                    src="/images/LogoStart.png"
                    alt="StartImage"
                    className="mt-4 sm:mt-0"
                    width={500}
                    height={500}
                />
            </main>
            <footer className="flex justify-center items-center space-x-2 p-8 w-full bg-gray-200 shadow-md">
                <a
                    href="#"
                    className="text-blue-700 no-underline hover:text-blue-500"
                >
                    Campus Virtual
                </a>
                <a
                    href="#"
                    className="text-blue-700 no-underline hover:text-blue-500"
                >
                    Paideia PUCP
                </a>
            </footer>
        </div>
    );
}
