import React from "react";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";

function ProjectSidebar() {
    return (
        <nav className='ProjectSidebar'>
            <p>Header</p>
            <p>Fecha Inicio - Fecha Fin (duracion en dias)</p>
            <p>Equipo: [Los dibujitos]</p>
            <ul className='members'>
                <li>
                    <p>USR</p>
                </li>
                <li>
                    <p>USR</p>
                </li>
                <li>
                    <p>USR</p>
                </li>
            </ul>
            <ul>
                Desplegable 1
            </ul>
            <ul>
                Desplegable 2
            </ul>
        </nav>
    );
}

export default ProjectSidebar;