"use client";

import React from "react";
import Link from "next/link";
import "@/styles/dashboardStyles/DashboardNav.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/react";
import axios from "axios";
axios.defaults.withCredentials = true;

function DashboardNav({ userName, userLastName, userObj }) {
    const router = useRouter();

    const handleSignOut = () => {
        // Eliminar cookie del backend
        axios
            .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`)
            .then((response) => {
                console.log(response);
                router.push("/login");
            })
            .catch(function (error) {
                console.log("Error al hacer logout", error);
            });
    };

    return (
        <nav className="DashboardNav">
            <img
                src="/icons/logoProyePUCP_en_svg.svg"
                alt=""
                className="proyePucpLogo"
            />
            <img
                src="/icons/bars.svg"
                alt=""
                className="iconHam" /*onClick={() => setOpen(!isOpen)}*/
            />

            <ul className="NavIconList">
                <li>
                    <img src="/icons/icon-help.svg" alt="" className="icon" />
                    <p className="textGuide">Ayuda</p>
                </li>
                <li>
                    <img
                        src="/icons/icon-settings.svg"
                        alt=""
                        className="icon"
                    />
                    <p className="textGuide">Configuración</p>
                </li>
                <li>
                    <img src="/icons/icon-notif.svg" alt="" className="icon" />
                    <p className="textGuide">Notificaciones</p>
                </li>
                {/* <li onClick={handleSignOut}>
                    <img
                        src="/icons/icon-signout.svg"
                        alt=""
                        className="icon"
                    />
                    <p className="textGuide">Cerrar sesión</p>
                </li> */}
                <li style={{ cursor: "pointer" }}>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            {/* <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                            /> */}
                            {/* <p className="profilePic">
                                {userName[0]}
                                {userLastName !== null ? userLastName[0] : ""}
                            </p> */}

                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                src={userObj.imgLink}
                                fallback={
                                    <p
                                        style={{
                                            backgroundColor:
                                                "background-color: rgb(212, 212, 216)",
                                            cursor: "pointer",
                                            borderRadius: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: '1.2rem',
                                            width: '48px',
                                            height: '48px',
                                            color: 'black'
                                        }}
                                    >
                                        {userObj.nombres[0] + (userObj.apellidos!==null ? userObj.apellidos[0] : "")}
                                    </p>
                                }
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Profile Actions"
                            variant="flat"
                        >
                            <DropdownItem key="settings">
                                Mi perfil
                            </DropdownItem>
                            <DropdownItem
                                key="templates"
                                onPress={() => {
                                    router.push("/dashboard/templates");
                                }}
                            >
                                Mis plantillas
                            </DropdownItem>

                            <DropdownItem
                                key="logout"
                                color="danger"
                                onPress={handleSignOut}
                            >
                                Cerrar sesión
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    {/* <Link href="/dashboard/templates">
                        <p className="profilePic">
                            {userName[0]}
                            {userLastName[0]}
                        </p>
                    </Link> */}
                    <p className="textGuide">Mi perfil</p>
                </li>
            </ul>

            {/*isOpen && isMobile && (<NavDropdown></NavDropdown>)*/}
        </nav>
    );
}

export default DashboardNav;
