"use client"

import ButtonAddNew from "@/components/dashboardComps/projectComps/EDTComps/ButtonAddNew";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import ListElementsEDT from "@/components/dashboardComps/projectComps/EDTComps/ListElementsEDT";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;


const componentsDataFirstNode = [
    {
        id: 3,
        componentName: "Gestion de proyecto",
        levelCounter: "1",
        levelName: "FASE",
        levelColor: "purple",
        childsList: [
            {
                id: 1,
                componentName: "hola soy hijo de gestion de proyecto",
                levelCounter: "1",
                levelName: "SUBPROYECTO",
                levelColor: "gray",
                childsList: [
                    {
                        id: 6,
                        componentName: "swafnaiooifn",
                        levelCounter: "1",
                        levelName: "ENTREGABLE",
                        levelColor: "red",
                        childsList: [
                            {
                                id: 7,
                                componentName: "OMGGG",
                                levelCounter: "1",
                                levelName: "TAREA",
                                levelColor: "black",
                                childsList: null,
                            },
                        ],
                    },
                ],
            },
            {
                id: 2,
                componentName: "hola soy el otro hijo de gestion de proyecto",
                levelCounter: "2",
                levelName: "SUBPROYECTO",
                levelColor: "gray",
                childsList: [
                    {
                        id: 5,
                        componentName: "soy tu ultimo hijo hazme un hermano",
                        levelCounter: "1",
                        levelName: "ENTREGABLE",
                        levelColor: "red",
                        childsList: null,
                    },
                ],
            },
        ],
    },
    {
        id: 4,
        componentName: "API de acceso a la base de datos de RENIEC",
        levelCounter: "2",
        levelName: "FASE",
        levelColor: "purple",
        childsList: null,
    },
];

export default function EDT(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.charAt(decodedUrl.length - 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    
    const [ListComps, setListComps] = useState([]);
    
    useEffect(()=>{
        const stringURL = "http://localhost:8080/api/EDT/" + projectId + "/listarEDT";

        axios
            .get(stringURL)
            .then(function (response) {
                let componentsArray = response.data.componentes;
                
                console.log(componentsArray);
                setListComps(componentsArray);

            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);


    //#######################################################



    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <div className="EDT">
            <HeaderWithButtons
                haveReturn={false}
                haveAddNew={true}
                hrefToReturn={""}
                hrefForButton={
                    "/dashboard/" +
                    projectName +
                    "=" +
                    projectId +
                    "/EDT/EDTNew"
                }
                breadcrump={"Inicio / Proyectos / Proyect X"}
                btnText={"Agregar nueva fase"}
            >
                EDT y diccionario EDT
            </HeaderWithButtons>
            <div className="componentSearchContainer">
                <input type="text" />
                <button>Buscar</button>
            </div>

            <ListElementsEDT
                listData={ListComps}
                initialMargin={0}
            ></ListElementsEDT>
        </div>
    );
}







