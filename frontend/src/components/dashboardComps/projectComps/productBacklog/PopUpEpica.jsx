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
//import { set } from "date-fns";

export const UserCardsContext = React.createContext();

export default function PopUpEpica({ modal, toggle, url, backlogID, urlAdd, urlEliminate}) {
    const [filterValue, setFilterValue] = useState("");
    const [listEpics, setListEpics] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [newEpicName, setNewEpicName] = useState("");
    const [addError, setAddError] = useState("");
    const [eliminateError, setEliminateError] = useState("");
    const [noEpic, setNoEpic] = useState("");
    const [isSelected, setIsSelected] = useState(false);
    const onSearchChange = (value) => {
        setFilterValue(value);
    };

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
            const data = {
                idProductBacklog: backlogID, // Reemplaza con el valor deseado
                nombre: newEpicName // Reemplaza con el valor deseado
              };
              
             
                axios.post("http://localhost:8080/api/proyecto/backlog/hu/insertarEpica", data)
                .then((response) => {
                // Manejar la respuesta de la solicitud POST
                console.log("Respuesta del servidor:", response.data);
                console.log("Registro correcto de la epica")
                // Realizar acciones adicionales si es necesario
                fetchData();
                })
                .catch((error) => {
                 // Manejar errores si la solicitud POST falla
                console.error("Error al realizar la solicitud POST:", error);
                });
                
        }
    };

    const EliminateEpic = (name) => {
        console.log(name);
        setEliminateError("");
        const data = {
            nombreEpica: name // Ajusta el nombre del campo según la estructura esperada por el servidor
        };
        axios.delete("http://localhost:8080/api/proyecto/backlog/hu/eliminarEpica", { data })
            .then((response) => {
                // Manejar la respuesta de la solicitud DELETE
                console.log("Respuesta del servidor:", response.data);
                console.log("Eliminado correcto");
                // Llamar a refresh() aquí después de la solicitud HTTP exitosa
                fetchData();
            })
            .catch((error) => {
                // Manejar errores si la solicitud DELETE falla
                console.error("Error al realizar la solicitud DELETE:", error);
            });
    };
    
    const [selectedEpic, setSelectedEpic] = useState(null);

    const selectEpic = (epic) => {
        setSelectedEpic(epic);
        setIsSelected(true);
        setNoEpic("");
        console.log(epic);
    };

    const deselectEpic = (epic) => {
        setSelectedEpic(null);
        setIsSelected(false);
    };

    

    useEffect(() => {
        
    
        fetchData();
      }, [filterValue]);

    return (
        (modal && <div className="popUp" style={{animation: "droptop .3s linear"}}>
			<div onClick={toggle} className="overlay"></div>
            <div className="modalEpic">
                <p className="buscarEpic">Lista de Epicas</p>
                <div className="containerModal">
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
                    <div className="subcontainer custom-flex">
                            <Button color="primary" endContent={<PlusIcon />} className="btnAddEpic" onClick={handleInsertEpic}>
                                Agregar Epica
                            </Button>
                            <Button color="danger"  onClick={() => {
                                                    isSelected ? setEliminateError("Seguro desea eliminar la epica?") : setNoEpic("Falta seleccionar una epica");
                                                    }} endContent={<PlusIcon />} className="btnElimanteEpic" >
                                Eliminar
                            </Button>
                            
                    </div>
                    
                </div>

                
                <div className="containerModal">
                    <div className="divEpics">
                        <UserCardsContext.Provider
                            value={{ selectEpic, deselectEpic }}
                        >
                            <ListEpic lista={listEpics}></ListEpic>
                        </UserCardsContext.Provider>
                        {noResults && (
                            <p className="error-message">
                                No se encontraron resultados.
                            </p>
                        )}
                    </div>
                    <div className="subcontainer">
                        
                        <p className="buscarEpic">Insertar Epica</p>
                        <input
                            type="text" 
                            autofocus 
                            className="inputEpica"
                            placeholder="Escribe la nueva epica"
                            value={newEpicName}
                            onChange={(e) => {
                                setNewEpicName(e.target.value);
                                setAddError("");
                            }}
                        ></input>
                        {addError && <p className="error-message">{addError}</p>}
                        {noEpic && <p className="error-message">{noEpic}</p>}
                        {eliminateError ? (
                            <div>
                                <p className="error-message">{eliminateError}</p>
                                <div className="endButtons">
                                    <button
                                        className="buttonTwoUser"
                                        onClick={() => setEliminateError("")}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="buttonOneUser"
                                        onClick={() => EliminateEpic(selectedEpic.nombre)}
                                    >
                                        Confirmar
                                     </button>
                                </div>
                            </div>
                        ) : null}
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