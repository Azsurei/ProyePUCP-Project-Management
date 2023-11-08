import React from "react";
import "@/styles/dashboardStyles/DashboardSecondNav.css";
import Link from "next/link";

function DashboardSecondNav() {
    return (    //el profe dijo lo de cambiar 
        <ul className="DashboardSecondNav bg-mainNavBar">
            <li>
                <img src="/icons/sidebarIcon1.svg" className='sideIcon'></img>
                <Link href='/dashboard'><p>Principal</p></Link>
            </li>
            <li>
                <img src="/icons/sidebarIcon2.svg" className='sideIcon'></img>
                <p>Proyectos</p>
            </li>
            <li>
                <img src="/icons/sidebarIcon3.svg" className='sideIcon'></img>
                <p>Grupos</p>
            </li>
            <li>
                <img src="/icons/sidebarIcon4.svg" className='sideIcon'></img>
                <p>Equipos</p>
            </li>
        </ul>
    );
}

export default DashboardSecondNav;