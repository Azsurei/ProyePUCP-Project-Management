"use client"

import React, { useState } from "react";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";

const memberData = [
    {
        id: '1',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    },
    
    {
        id: '5',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    },
    {
        id: '6',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    }  ,
    {
        id: '6',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    } ,
    {
        id: '6',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    } ,
    {
        id: '6',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    }
];

function MemberIcon(props){
    return(
        <li className="memberContainer">
            <img 
                // src={props.profilePicture} 
                src="/images/ronaldo_user.png"
                alt="/icons/userDefaultIcon.png" 
                className="memberIcon"/>
        </li>
    );
}

function DropDownItem(props){
    return(
        <li className="DropDownItem">
            <img src="/icons/epicPB.svg" alt="icon" className="" />
            <p>Herramienta</p>
        </li>
    );
}


function DropDownMenu(props){
    //PARAMETROS QUE DEBE RECIBIR:
    //title-icon
    //title-tittle
    //array de items con estructura {optIcon, optName}
    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen(!open);
    }


    return(
        <div className={open === true ? "DropDownMenu active" : "DropDownMenu" } onClick={toggleDropdown}>
            <div className="DropTitleContainer">
                <img src="/icons/epicPB.svg" alt="" className="DropIconLeft" />
                <p className="DropTitle">Gestion del proyecto</p>
                <img src="/icons/epicPB.svg" alt="" className="DropIconRight" />
            </div>
            <ul className="ItemsContainer">
                <DropDownItem></DropDownItem>
                <DropDownItem></DropDownItem>
                <DropDownItem></DropDownItem>
            </ul>
        </div>
    );
}



function ProjectSidebar(props) {
    return (
        <nav className='ProjectSidebar'>
            <div>
                <p className="header">{props.projectName}</p>
                <p className="dates">13/09/2023  -  20/10/2023 (50 dias)</p>
                <div className="teamContainer">
                    <p className="teamHeader">Equipo:</p>
                    <p className="teamName">Los dibujitos</p>
                </div>
            </div>

            <div className="btnOpenSidebar"></div>

            <ul className='members'>
                {memberData.map((member)=>{
                    return <MemberIcon 
                            name={member.name}
                            lastName={member.lastName}
                            profilePicture={member.profilePicture}
                            key={member.id}>
                    </MemberIcon>;
                })}
            </ul>

            <DropDownMenu></DropDownMenu>
            <DropDownMenu></DropDownMenu>
        </nav>
    );
}

export default ProjectSidebar;