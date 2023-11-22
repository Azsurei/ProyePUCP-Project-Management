import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListTools.css";
import { ToolCardsContext } from "@/app/dashboard/newProject/page";
import { PlusIcon } from "@/../public/icons/PlusIcon";

import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone';
import {
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    useDisclosure,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
  } from "@nextui-org/react";

axios.defaults.withCredentials = true;

function CardSelectTools(props) {
    const mustBeSelectedTools = [1,2,4,13];
    const {
        isOpen: isModalFechaOpen,
        onOpen: onModalFecha,
        onOpenChange: onModalFechachange,
    } = useDisclosure();
    
    
	const { addToolToList, removeToolInList } = useContext(ToolCardsContext);

	const handleSelectedOn = () => {
		addToolToList(props.herramientaObject);
	}

	const handleSelectedOff = () => {
		removeToolInList(props.herramientaObject);
	}
    const showPlantillaButton = ["Autoevaluacion", "Acta de constitucion"].includes(props.name);

    return (
        <li className={props.isSelected || mustBeSelectedTools.includes(props.id) ? "ToolCard active" : "ToolCard"} onClick={props.onClick}>
            <p className="titleTool">{props.name}</p>

            <div className="descriptionTool">
                <p>{props.description}</p>
            </div>

            <div className="buttonContatinerTool">
                

                {props.isSelected != true && !mustBeSelectedTools.includes(props.id) &&<Button  onPress={handleSelectedOn} startContent={<PlusIcon/>} className="buttonOneTool">Agregar</Button>}
                           
				{props.isSelected && !mustBeSelectedTools.includes(props.id) && <Button  onPress={handleSelectedOff} startContent={<ClearTwoToneIcon/>} className="buttonOneTool2">Eliminar</Button>}
                {mustBeSelectedTools.includes(props.id) && <Button isDisabled className="buttonOneTool2">Seleccionado</Button>}
            </div>
        </li>
    );
}

export default function ListTools({listHerramientas}) {

    const router = useRouter();

    const [listTools, setListTools] = useState([]);

    useEffect(() => {
        let toolsArray;
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/herramientas/listarHerramientas";
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

        <div>
   
            <ul className="ListToolsUl">
                {listTools.map((component) => {
                    return (
                        <CardSelectTools
                            key={component.idHerramienta}
                            id={component.idHerramienta}
                            name={component.nombre}
                            description={component.descripcion}
                            herramientaObject = {component}
                            isSelected={listHerramientas.some(tool => tool.idHerramienta === component.idHerramienta)}
                        ></CardSelectTools>
                    );
                })}
            </ul>
        </div>
    );
}
