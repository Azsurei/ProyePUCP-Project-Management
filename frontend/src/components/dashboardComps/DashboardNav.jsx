"use client";

import React, { useEffect, useState } from "react";
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
    Switch,
} from "@nextui-org/react";
import axios from "axios";
import { SunIcon } from "./SunIcon";
import { MoonIcon } from "./MoonIcon";
axios.defaults.withCredentials = true;

function MainLogoLeft() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            //stroke="currentColor"
            className="w-9 h-9 stroke-mainHeaders"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
            />
        </svg>
    );
}

function DashboardNav({ userName, userLastName, userObj }) {
    const router = useRouter();
    const [theme, setTheme] = useState("light");

    const setLightMode = () => {
        document.querySelector("html").classList.remove("dark");
        localStorage.setItem("selectedTheme", "light");
    };

    const setDarkMode = () => {
        document.querySelector("html").classList.add("dark");
        localStorage.setItem("selectedTheme", "dark");
    };

    const toggleTheme = (e) => {
        if (e.target.checked) setLightMode();
        else setDarkMode();
    };

    //useEffect(() => {
    const selectedTheme = localStorage.getItem("selectedTheme");
    if (selectedTheme === "dark") {
        document.querySelector("html").classList.add("dark");
        localStorage.setItem("selectedTheme", "dark");
    }
    //},[]);

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
        <nav className="DashboardNav bg-mainBackground">
            {/* <img
                src="/icons/logoProyePUCP_en_svg.svg"
                alt=""
                className="proyePucpLogo"
            />
            quite este logo porque no podemos volverlo blanco en dark mode pipipi
            */}
            
            <div className="flex flex-row items-center gap-2">
                <MainLogoLeft />
                <p className="text-lg font-semibold text-mainHeaders font-[Montserrat]">
                    ProyePUCP
                </p>
                <img
                    src="/icons/bars.svg"
                    alt=""
                    className="iconHam" /*onClick={() => setOpen(!isOpen)}*/
                />
            </div>

            <ul className="NavIconList">
                {/* <li>
                    <Switch
                        defaultSelected={selectedTheme === "light"}
                        size="lg"
                        color="primary"
                        startContent={<SunIcon />}
                        endContent={<MoonIcon />}
                        onChange={toggleTheme}
                    ></Switch>
                </li> */}
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
                                            borderRadius: "100%",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            fontSize: "1.2rem",
                                            width: "48px",
                                            height: "48px",
                                            color: "black",
                                        }}
                                    >
                                        {userObj.nombres[0] +
                                            (userObj.apellidos !== null
                                                ? userObj.apellidos[0]
                                                : "")}
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
