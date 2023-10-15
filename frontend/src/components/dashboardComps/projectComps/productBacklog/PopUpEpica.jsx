import React from "react";
import { useEffect, useState } from "react";
import "@/styles/dashboardStyles/projectStyles/productBacklog/PopUpEpica.css";
//import ListUsers from "./ListUsers";
import ListEpic from "./ListEpic";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import axios from "axios";
axios.defaults.withCredentials = true;
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
} from "@nextui-org/react";

import { SearchIcon } from "@/../public/icons/SearchIcon";
import { set } from "date-fns";

export const UserCardsContext = React.createContext();

export default function PopUpEpica({ modal, toggle, url}) {
    const [filterValue, setFilterValue] = useState("");
    const [listEpics, setListEpics] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [newEpicName, setNewEpicName] = useState("");
    const [addError, setAddError] = useState("");

    const onSearchChange = (value) => {
        setFilterValue(value);
    };
    const handleInsertEpic = () => {
        if (newEpicName.trim() === "") {
            setAddError("El nombre de la épica no puede estar vacío.");
        } else if (listEpics.some((epic) => epic.name === newEpicName)) {
            setAddError("El nombre de la épica ya existe en la lista.");
        } else {
            // Realiza la inserción de la nueva épica aquí, por ejemplo, con una solicitud axios.
            // Luego, limpia el campo de entrada y el mensaje de error.
            setNewEpicName("");
            setAddError("");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(url);
            const epicas = response.data["epicas"];
            const filteredEpicas = filterValue
                ? epicas.filter((epica) =>
                    epica.nombre.toLowerCase().includes(filterValue.toLowerCase())
                )
                : epicas;

            setListEpics(filteredEpicas); 
            if (filteredEpicas.length === 0) {
                setNoResults(true);
            } else {
                setNoResults(false);
            }
          } catch (error) {
            console.error('Error al obtener datos:', error);
          }
        };
    
        fetchData();
      }, [filterValue]);

    return (
        (modal && <div className="popUp">
			<div onClick={toggle} className="overlay"></div>
            <div className="modalEpic">
                <p className="buscarEpic">Lista de Epicas</p>
                <div className="container">
                    <div className="divBuscador">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[100%]"
                            placeholder="Ingresa una epica..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onValueChange={onSearchChange}
                            variant="faded"
                        />
                    </div>
                    <div className="subcontainer">
                            <Button color="primary" endContent={<PlusIcon />} className="btnAddEpic" onClick={handleInsertEpic}>
                                Agregar Epica
                            </Button>
                            <Button color="danger" onClick = {() => toggleModalAll()} endContent={<PlusIcon />} className="btnElimanteEpic">
                                Eliminar
                            </Button>
                            
                    </div>
                    
                </div>

                {noResults && (
                    <p className="noResultsMessage">
                        No se encontraron resultados.
                    </p>
                )}
                <div className="container">
                    <div className="divEpics">
                        <ListEpic lista={listEpics}></ListEpic>
                    </div>
                    <div className="subcontainer">
                        
                        <p className="buscarEpic">Insertar Epica</p>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Escribe la nueva epica"
                            value={newEpicName}
                            onChange={(e) => {
                                setNewEpicName(e.target.value);
                                setAddError("");
                            }}
                        ></input>
                        {addError && <p className="error-message">{addError}</p>}
                    </div>
                    
                    
                </div>
                <div >
                        <button
                            className="btn-modal"
                            onClick={toggle}
                        >
                            Aceptar
                        </button>
                    </div>

            </div>
        </div>
        )
    );
}