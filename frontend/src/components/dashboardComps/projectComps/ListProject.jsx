"use client"

import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/ListProject.css";
import { useState } from "react";
import React, { Component } from 'react';

function ProjectCard(props){

    //const [openChilds, setOpenChilds] = useState(false);
    const handleClick = ()=>{
        /*if(hasChilds === true)
            setOpenChilds(!openChilds);
        */
    }


    return(
        <div>
            <li className="ProjectCard" onClick={handleClick}>
                <p>
                    {props.name}
                </p>
            </li>
        </div>
    )
}
//Aqui es la lista de Proyectos

export default function ListProject(props){
    const ListComps = props.listData;


    return(
        <ul className="ListProject" >
            {ListComps.map((component)=>{
                return (
                    <ProjectCard key={component.id} 
                                name={component.name}
                                >
                </ProjectCard>
                );
            })} 
        </ul>
    );
}
