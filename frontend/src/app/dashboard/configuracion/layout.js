"use client"
import { Divider } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SettingsLayout({children, params}) {
    const decodedUrl = decodeURIComponent(params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const pathname = usePathname();

    const btnStyle =
        " hover:underline  font-medium px-4 py-2 rounded-md cursor-pointer";
    const btnStyleActive =
        "font-medium px-4 py-2 rounded-md bg-[#F4F4F5] dark:bg-[#414141] cursor-pointer";

    const twStyle1 = "hover:underline";

    const baseUrlString =
        "/dashboard/configuracion";

    return (
        <div className="w-[100%] min-h-full flex justify-center bg-mainBackground max-h-full h-full overflow-hidden">
            <div className="flex flex-col w-[100%] max-w-[1200px] h-[100%] p-[2.5rem] space-y-7 font-[Montserrat] ">
                <div className="flex flex-col">
                    <p className="text-4xl font-semibold text-mainHeaders">
                        Configuración
                    </p>
                    <p className="text-slate-400">
                        Configura tus datos y establece tus preferencias
                    </p>
                </div>

                <Divider className="px-[50px]"></Divider>

                <div className="flex flex-row w-[100%] h-[100%] space-x-8 overflow-hidden ">
                    <div className="flex flex-col h-[100%] w-[20%] min-w-[20%] space-y-1 ">
                        {/* ************************ */}
                        <Link
                            className={
                                pathname === baseUrlString + "/perfil"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            href={baseUrlString + "/perfil"}
                        >
                            <p
                                className={
                                    pathname === baseUrlString + "/perfil"
                                        ? ""
                                        : twStyle1
                                }
                            >
                                Mi perfil
                            </p>
                        </Link>
                        <Link
                            className={
                                pathname === baseUrlString + "/notificaciones"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            href={baseUrlString + "/notificaciones"}
                        >
                            <p
                                className={
                                    pathname === baseUrlString + "/notificaciones"
                                        ? ""
                                        : twStyle1
                                }
                            >
                                Notificaciones
                            </p>
                        </Link>
                        
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
export default SettingsLayout;
