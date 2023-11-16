"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "@/styles/dashboardStyles/DashboardNav.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
    Avatar,
    Badge,
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

function BellIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    );
}

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

    const [notifications, setNotifications] = useState([])

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
                    <SettingsIcon/>
                    <p className="textGuide">Configuración</p>
                </li>
                <li>
                    <Badge content={notifications.length} color="primary" disableOutline={true} className="font-[Montserrat] font-medium"><BellIcon/></Badge>
                    <p className="textGuide">Notificaciones</p>
                </li>
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
