import { useEffect, useState } from "react";
import React, { Component } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/ListTools.css"; 
axios.defaults.withCredentials = true;


function CardSelectTools(props) {
    return (

        
        <div>

            <div className="divToolName">
                <p className="titleTool">
                {props.name}
                </p>

                <div className="descriptionTool">
                    <p>
                    {props.description}
                    </p>    
                </div>    
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

        <div className="ListTools">

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
