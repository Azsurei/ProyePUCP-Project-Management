"use client"

import React, { useState } from "react";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";
import Link from "next/link";

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
            <Link href={'/dashboard/xsd'} style={{display:'flex', alignItems:"center"}}>
                <img src={props.icon} alt="icon" className="" />
                <p>{props.name}</p>
            </Link>
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
        <div className={open === true ? "DropDownMenu active" : "DropDownMenu" }>
            <div className="DropTitleContainer" onClick={toggleDropdown}>
                <div className="DropTitleLeft">
                    <img src={props.info.tittleIcon} alt="" className="DropIconLeft" />
                    <p className="DropTitle"> {props.info.tittleTitle} </p>
                </div>
                <img src="/icons/epicPB.svg" alt="" className="DropIconRight" />
            </div>

            <ul className="ItemsContainer">
                {props.info.dataItems.map((item)=>{
                    return <DropDownItem icon={item.optIcon} name={item.optName}></DropDownItem>
                })}
            </ul>
        </div>
    );
}





function ProjectSidebar(props) {
    const stringBase = '/dashboard/' + props.currentUrl;

    const sideBar1Array = [
        {
            optIcon : '/icons/icon-goBack.svg',
            optName : 'Pendiente' 
        }
    ];
    
    const sidebar1Data = {
        tittleIcon : '/icons/info-circle.svg',
        tittleTitle : 'Sobre proyecto',
        dataItems : sideBar1Array
    };
    
    const sideBar2Array = [
        {
            optIcon : '/icons/icon-notif.svg',
            optName : 'Gestion de backlog' 
        },
        {
            optIcon : '/icons/datePB.svg',
            optName : 'Acta de constitución' 
        },
        {
            optIcon : '/icons/icon-cross.svg',
            optName : 'EDT y diccionario EDT' 
        },
        {
            optIcon : '/icons/icon-help.svg',
            optName : 'Registro de equipos' 
        }
    ];
    
    const sidebar2Data = {
        tittleIcon : '/icons/icon-settings.svg',
        tittleTitle : 'Herramientas',
        dataItems : sideBar2Array
    };

    
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

            <DropDownMenu info={sidebar1Data}></DropDownMenu>
            <DropDownMenu info={sidebar2Data}></DropDownMenu>
        </nav>
    );
}

export default ProjectSidebar;