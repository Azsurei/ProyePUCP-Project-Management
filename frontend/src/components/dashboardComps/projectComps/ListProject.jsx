"use client"

import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/ListProject.css";
import { useEffect, useState } from "react";
import React, { Component } from 'react';

import axios from "axios";


axios.defaults.withCredentials = true;





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
    const [ListComps, setListComps] = useState([]);

    useEffect(()=>{
        let proyectsArray;
        const stringURL = "http://localhost:8080/api/proyecto/listarProyectos";
        axios
            .get(stringURL)
            .then(function (response) {
                console.log(response);
                proyectsArray = response.data.proyectos;
                
                proyectsArray = proyectsArray.map(proyect => {
                    return {
                        id: proyect.idProyecto,
                        name: proyect.nombre
                    };
                });

                setListComps(proyectsArray);

                console.log(proyectsArray);

            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

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
