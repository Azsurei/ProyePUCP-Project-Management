import React from "react";
import "@/styles/dashboardStyles/DashboardSecondNav.css";

function DashboardSecondNav() {
    return (
        <ul className="DashboardSecondNav">
            <li>
                <img src="/icons/sidebarIcon1.svg" className='sideIcon'></img>
                <p>Principal</p>
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