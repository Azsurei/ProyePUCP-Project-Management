import React from "react";
import { useEffect, useState } from "react";
import "@/styles/dashboardStyles/projectStyles/productBacklog/PopUpEpica.css";
//import ListUsers from "./ListUsers";
import ListRol from "@/components/equipoComps/ListRol";
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


export const UserCardsContext = React.createContext();

export default function PopUpRolEquipo({ modal, toggle,idEquipo}) {
    const [filterValue, setFilterValue] = useState("");
    const [listEpics, setListEpics] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [newEpicName, setNewEpicName] = useState("");
    const [addErrorEpic, setAddErrorEpic] = useState("");
    const [eliminateError, setEliminateError] = useState("");
    const [noEpic, setNoEpic] = useState("");
    const [isSelected, setIsSelected] = useState(false);
    const [addEpic, setAddEpic] = useState(false);
    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    const AddNewEpic = () => {
        setAddEpic(true);
    }

    const fetchData = async () => {
        try {
          const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/equipo/listarRol/${idEquipo}`);
          const roles = response.data["roles"];
          const filteredEpicas = filterValue
              ? roles.filter((epica) =>
                  epica.nombreRol.toLowerCase().includes(filterValue.toLowerCase())
              )
              : roles;

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
            setAddErrorEpic("El nombre de la épica no puede estar vacío.");
        } else if (listEpics.some((epic) => epic.nombreRol === newEpicName)) {
            setAddErrorEpic("El nombre de la épica ya existe en la lista.");
        } else {
            // Realiza la inserción de la nueva épica aquí, por ejemplo, con una solicitud axios.
            // Luego, limpia el campo de entrada y el mensaje de error.
            setNewEpicName("");
            setAddErrorEpic("");
            const data = {
                idEquipo: idEquipo, // Reemplaza con el valor deseado
                nombreRol: newEpicName // Reemplaza con el valor deseado
              };
              
             
                axios.post(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/equipo/insertarRol", data)
                .then((response) => {
                // Manejar la respuesta de la solicitud POST
                console.log("Respuesta del servidor:", response.data);
                console.log("Registro correcto del rol")
                // Realizar acciones adicionales si es necesario
                fetchData();
                })
                .catch((error) => {
                 // Manejar errores si la solicitud POST falla
                console.error("Error al realizar la solicitud POST:", error);
                });
            toggle();
        }
    };

    const EliminateEpic = (idRolEquipo) => {
        console.log(idRolEquipo);
        setEliminateError("");
        
        const data = {
            idRolEquipo: idRolEquipo // Ajusta el nombre del campo según la estructura esperada por el servidor
        };
        axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/equipo/eliminarRol", { data })
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

    const handleEliminateError = (nameError) => {
        setEliminateError(nameError);
        setAddErrorEpic("");
    }

    useEffect(() => {
        
    
        fetchData();
      }, [filterValue]);

    return (
        (modal && <div className="popUp" style={{animation: "droptop .3s linear"}}>
			<div onClick={toggle} className="overlay"></div>
            <div className="modalEpic">
                
                <div className="containerModal">
                    
                    <p className="buscarEpic">Lista de Roles</p>
                    <div className="subcontainer flex justify-end">
                            <Button color="primary" endContent={<PlusIcon />} className="btnAddEpic" onClick={AddNewEpic}>
                                Agregar Rol
                            </Button>
                            <Button color="danger"  onClick={() => {
                                                    isSelected ? handleEliminateError("Seguro desea eliminar el rol?") : setNoEpic("Falta seleccionar un rol");
                                                    }} endContent={<PlusIcon />} className="btnElimanteEpic" >
                                Eliminar
                            </Button>
                            
                    </div>
                    
                </div>
                <div className="divBuscador">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[100%]"
                            placeholder="Ingresa una rol..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onValueChange={onSearchChange}
                            variant="faded"
                        />
                </div>
                
                <div className="containerModal">
                    <div className="divEpics">
                        <UserCardsContext.Provider
                            value={{ selectEpic, deselectEpic }}
                        >
                            <ListRol lista={listEpics}></ListRol>
                        </UserCardsContext.Provider>
                        {noResults && (
                            <p className="error-message">
                                No se encontraron resultados.
                            </p>
                        )}
                    </div>
                     
                </div>
                <div className="subcontainer">
                        
                        
                        {addEpic ? (
                            <input
                            type="text" 
                            autoFocus 
                            className="inputEpica"
                            placeholder="Escribe el nuevo rol"
                            value={newEpicName}
                            onChange={(e) => {
                                setNewEpicName(e.target.value);
                                setAddErrorEpic("");
                            }}
                            ></input>
                        ):null}
                        {addErrorEpic && <p className="error-message">{addErrorEpic}</p>}
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
                                        onClick={() => EliminateEpic(selectedEpic.idRolEquipo)}
                                    >
                                        Confirmar
                                     </button>
                                </div>
                            </div>
                        ) : null}
                </div> 
                
                <div className="buttonSection">
                    <button className="close-modal" onClick={toggle}>
                        Cancelar
                    </button>
                    <div className="right-buttons">
                        <button className="btn-modal" onClick={handleInsertEpic}>
                            Aceptar
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
        )
    );
}