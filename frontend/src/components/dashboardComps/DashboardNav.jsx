"use client";

import React from "react";
import Link from "next/link";
import "@/styles/dashboardStyles/DashboardNav.css";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";

function DashboardNav({ userName, userLastName }) {
    const handleSignOut = async () => {
        Cookies.remove("tokenProyePUCP");
        await signOut();
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
                <li onClick={handleSignOut}>
                    <img
                        src="/icons/icon-signout.svg"
                        alt=""
                        className="icon"
                    />
                    <p className="textGuide">Cerrar sesión</p>
                </li>
                <li>
                    <Link href="/dashboard/templates">
                        <p className="profilePic">
                            {userName[0]}
                            {userLastName[0]}
                        </p>
                    </Link>
                    <p className="textGuide">Mi perfil</p>
                </li>
            </ul>

            {/*isOpen && isMobile && (<NavDropdown></NavDropdown>)*/}
        </nav>
    );
}

export default DashboardNav;
