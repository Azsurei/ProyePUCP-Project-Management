import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/projectMenu.css";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/newProjects.css";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/ListProject.css";
import { useEffect, useState } from "react";
import React, { Component } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
axios.defaults.withCredentials = true;

const tools = [
    {
        id: '1',
        name: 'Acta de Constitución',
        description: 'Documento que autoriza formalmente el inicio de un proyecto y le da al director del proyecto la autoridad para asignar recursos a las actividades del proyecto.',

    },
    
    {
        id: '2',
        name: 'EDT y Diccionario del EDT',
        description:'Desglose estructurado del proyecto y un glosario que define los elementos clave.'

    },
    {
        id: '3',
        name: 'Cronograma',
        description:'Representación temporal de tareas y actividades del proyecto.'

    }  ,
    {
        id: '4',
        name: 'Presupuesto',
        description:'Estimación de costos y recursos financieros necesarios para ejecutar el proyecto.'

    } ,   
    {
        id: '5',
        name: 'Plan de Calidad',
        description:'Estrategia para garantizar la calidad del trabajo y los entregables del proyecto.'

    } ,

];

function ToolCard(props){

    return(
        
        <li className="ProjectCard" onClick={props.onClick}>
            <p className="cardTitleProject">
                {props.name}
            </p>

            <div>
                {props.description}
            </div>
        </li>
    );
}


function CardSelectTools(props) {
    return (

        
        <div>

            <div className="divProjectNameDiv">
                    {props.name}
            </div>
            

        </div>
    
    )
}

export default function ListTools(props){
    const router = useRouter();

    const [listTools, setListTools] = useState([]); ;

    useEffect(()=>{
        let toolsArray;
        const stringURL = "http://localhost:8080/api/herramientas/listarHerramientas";
        axios
            .get(stringURL)
            .then(function (response) {
                console.log(response);
                toolsArray = response.data.herramientas;
                
                toolsArray = toolsArray.map(tool => {
                    return {
                        id: tool.idHerramienta,
                        name: tool.nombre,
                        description: tool.descripcion
                    };
                });

                setListTools(toolsArray);

                console.log(toolsArray);

            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);


    return(

        <div>

        <h2 className="projectNametxt">Seleccione las herramientas</h2>

            <ul>
            {listTools.map((component)=>{
                return (
                    <CardSelectTools key={component.id} 
                                name={component.name}
                                description={component.description}
                                >
                </CardSelectTools>
                );
            })} 
            </ul>


        </div>

    );
}
