"use client";
import ModalDeleteConfirmation from "@/components/dashboardComps/projectComps/settingsComps/ModalDeleteConfirmation";
import { Divider } from "@nextui-org/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function RootLayout({ children, params }) {
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
        "/dashboard/" +
        encodeURIComponent(projectName) +
        "=" +
        encodeURIComponent(projectId) +
        "/settings";

    return (
        <div className="w-[100%] min-h-full flex justify-center bg-mainBackground max-h-full h-full overflow-hidden">
            <div className="flex flex-col w-[100%] max-w-[1200px] h-[100%] p-[2.5rem] space-y-7 font-[Montserrat] ">
                <div className="flex flex-col">
                    <p className="text-4xl font-semibold text-mainHeaders">
                        Configura tu proyecto
                    </p>
                    <p className="text-slate-400">
                        Maneja usuarios, herramientas, fechas y mas
                    </p>
                </div>

                <Divider className="px-[50px]"></Divider>

                <div className="flex flex-row w-[100%] h-[100%] space-x-8 overflow-hidden">
                    <div className="flex flex-col h-[100%] w-[20%] space-y-1">
                        {/* ************************ */}
                        <Link
                            className={
                                pathname === baseUrlString + "/general"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            href={baseUrlString + "/general"}
                            onClick={() => {
                                console.log(pathname);
                                console.log(baseUrlString + "/general");
                            }}
                        >
                            <p
                                className={
                                    pathname === baseUrlString + "/general"
                                        ? ""
                                        : twStyle1
                                }
                            >
                                General
                            </p>
                        </Link>
                        <Link
                            className={
                                pathname === baseUrlString + "/usuarios"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            href={baseUrlString + "/usuarios"}
                        >
                            <p
                                className={
                                    pathname === baseUrlString + "/usuarios"
                                        ? ""
                                        : twStyle1
                                }
                            >
                                Usuarios
                            </p>
                        </Link>
                        <Link
                            className={
                                pathname === baseUrlString + "/herramientas"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            href={baseUrlString + "/herramientas"}
                        >
                            <p
                                className={
                                    pathname === baseUrlString + "/herramientas"
                                        ? ""
                                        : twStyle1
                                }
                            >
                                Herramientas
                            </p>
                        </Link>
                        <Link
                            className={
                                pathname === baseUrlString + "/eliminar"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            href={baseUrlString + "/eliminar"}
                        >
                            <p
                                className={
                                    pathname === baseUrlString + "/eliminar"
                                        ? ""
                                        : twStyle1
                                }
                            >
                                Eliminar
                            </p>
                        </Link>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
