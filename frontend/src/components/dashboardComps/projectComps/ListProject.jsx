"use client"

import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/ListProject.css";
import { useEffect, useState } from "react";
import React, { Component } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";

axios.defaults.withCredentials = true;


const memberData = [
    {
        id: '1',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    },
    
    {
        id: '2',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    },
    {
        id: '3',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    }  ,
    {
        id: '4',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    } 

];



function ProjectCard(props){

    return(
        
        <li className="ProjectCard" onClick={props.onClick}>
            <p className="cardTitleProject">
                {props.name}
            </p>

            <div className="divPictures">
            {memberData.map((member)=>{
                return (
                    <img className="memberProfilePicture"
                        key={member.id}
                        src='images/ronaldo_user.png'
                        />
                );
             })} 
            </div>
        </li>
    );
}
//Aqui es la lista de Proyectos



export default function ListProject(props){
    const router = useRouter();

    function handleClick(proy_name){
        router.push('/dashboard/'+proy_name);
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
                                onClick={()=>{handleClick(component.name)}}
                                >
                </ProjectCard>
                );
            })} 
        </ul>
    );
}
