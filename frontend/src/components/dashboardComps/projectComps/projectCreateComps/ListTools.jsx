import { useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListTools.css";
axios.defaults.withCredentials = true;

function CardSelectTools(props) {
  return (
    <li className="ToolCard" onClick={props.onClick}>
      <p className="titleTool">{props.name}</p>

      <div className="descriptionTool">
        <p>{props.description}</p>
      </div>

      
      <div className="buttonContainerCreate">
        <button className="buttonOneTool">Ver Detalles</button>
        <button className="buttonOneTool">Agregar</button>
      </div>
    </li>
  );
}

export default function ListTools(props) {
  const router = useRouter();

  const [listTools, setListTools] = useState([]);

  useEffect(() => {
    let toolsArray;
    const stringURL =
      "http://localhost:3000/api/herramientas/listarHerramientas";
    axios
      .get(stringURL)
      .then(function (response) {
        console.log(response);
        toolsArray = response.data.herramientas;

        toolsArray = toolsArray.map((tool) => {
          return {
            id: tool.idHerramienta,
            name: tool.nombre,
            description: tool.descripcion,
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
            key={component.id}
            name={component.name}
            description={component.description}
          ></CardSelectTools>
        );
      })}
    </ul>
  );
}
