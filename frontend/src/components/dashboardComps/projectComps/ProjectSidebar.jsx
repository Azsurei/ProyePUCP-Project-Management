import React from "react";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";


function memberIcon(){
    return(
        <li className="memberIcon">
            USR
        </li>
    );
}

function ProjectSidebar() {
    return (
        <nav className='ProjectSidebar'>
            <p className="header">Los Dibujitos</p>
            <p className="dates">13/09/2023  -  20/10/2023 (50 dias)</p>

            <div className="teamContainer">
                <p className="teamHeader">Equipo:</p>
                <p className="teamName">Los dibujitos</p>
            </div>
            
            <ul className='members'>
                <li>
                    <img src="" alt="" className="" />
                </li>
                <li>
                    <p>USR</p>
                </li>
                <li>
                    <p>USR</p>
                </li>
            </ul>
            <ul className="dropdown-menus">
                Desplegable 1
            </ul>
            <ul>
                Desplegable 2
            </ul>
        </nav>
    );
}

export default ProjectSidebar;