"use client"

import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/ListProject.css";
import { useEffect, useState } from "react";
import React, { Component } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
axios.defaults.withCredentials = true;


const memberDataProject = [
    {
        id: "1",
    },

    {
        id: "2",
    },

    {
        id: "3",
    }

];



function ProjectCard(props) {
    const startDate = new Date(props.fechaInicio);
    const endDate = new Date(props.fechaFin);
  
    // Calcula la diferencia en días
    const diffInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  
    // Formatea las fechas
    const formattedStartDate = startDate.toLocaleDateString();
    const formattedEndDate = endDate.toLocaleDateString();
  
    return (
      <li className="ProjectCard" onClick={props.onClick}>
        <p className="cardTitleProject">
          {props.name}
        </p>
  
        <p className="cardDates">
          {`${formattedStartDate} - ${formattedEndDate} (${diffInDays} días)`}
        </p>


  
        <div className="divPictures">
          {memberDataProject.map((member) => {
            return (
              <img
                className="memberProfilePicture"
                key={member.id}
                src="images/DefaultUser.png"
              />
            );
          })}
        </div>
        <div className="teamTag">
            <p >Los Dibujitos</p>
        </div>
        

      </li>
    );
  }
  
//Aqui es la lista de Proyectos



export default function ListProject(props){
    const router = useRouter();

    function handleClick(proy_id,proy_name){
        router.push('/dashboard/'+proy_name+'='+proy_id);
    }


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
                        name: proyect.nombre,
                        dateStart: proyect.fechaInicio,
                        dateEnd: proyect.fechaFin,
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
                                fechaInicio={component.dateStart}
                                fechaFin={component.dateEnd}
                                onClick={()=>{handleClick(component.id,component.name)}}
                                >
                </ProjectCard>
                );
            })} 
        </ul>
    );
}
