import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/ProjectCreateStyles/ListTools.css";
import { ToolCardsContext } from "@/app/dashboard/newProject/page";
axios.defaults.withCredentials = true;

function CardSelectTools(props) {
	const [isSelected, setIsSelected] = useState(false);

	const { addToolToList, removeToolInList } = useContext(ToolCardsContext);

	const handleSelectedOn = () => {
		addToolToList(props.herramientaObject);
		setIsSelected(true)
	}

	const handleSelectedOff = () => {
		removeToolInList(props.herramientaObject);
		setIsSelected(false)
	}

    return (
        <li className={isSelected ? "ToolCard active" : "ToolCard"} onClick={props.onClick}>
            <p className="titleTool">{props.name}</p>

            <div className="descriptionTool">
                <p>{props.description}</p>
            </div>

            <div className="buttonContatinerTool">
                <button className="buttonOneTool">Ver Detalles</button>
                {isSelected != true && <button className="buttonOneTool" onClick={handleSelectedOn}>Agregar</button>}
				{isSelected && <button className="buttonOneTool" onClick={handleSelectedOff}>Eliminar</button>}
            </div>
        </li>
    );
}

export default function ListTools(addToolToList, removeToolInList, props) {

    const router = useRouter();

    const [listTools, setListTools] = useState([]);

    useEffect(() => {
        let toolsArray;
        const stringURL =
            "http://localhost:8080/api/herramientas/listarHerramientas";
        axios
            .get(stringURL)
            .then(function (response) {
                console.log(response);
                toolsArray = response.data.herramientas;

                toolsArray = toolsArray.map((tool) => {
                    return {
                        idHerramienta: tool.idHerramienta,
                        nombre: tool.nombre,
                        descripcion: tool.descripcion,
                    };
                });

                setListTools(toolsArray);

                console.log(toolsArray);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

	

    return (
        <ul className="ListToolsUl">
            {listTools.map((component) => {
                return (
                    <CardSelectTools
                        key={component.idHerramienta}
						id={component.idHerramienta}
                        name={component.nombre}
                        description={component.descripcion}
						herramientaObject = {component}
                        addToolToList={addToolToList}
                        removeToolInList={removeToolInList}
                    ></CardSelectTools>
                );
            })}
        </ul>
    );
}
