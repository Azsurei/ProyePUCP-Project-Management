import React from "react";
import { useEffect, useState } from "react";
import "@/styles/dashboardStyles/projectStyles/productBacklog/PopUpEpica.css";
import ListRol from "@/components/equipoComps/ListRol";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Input, Button } from "@nextui-org/react";

import { SearchIcon } from "@/../public/icons/SearchIcon";

export const UserCardsContext = React.createContext();

export default function PopUpRolEquipo({ modal, toggle, handleAddRoles }) {
    const [filterValue, setFilterValue] = useState("");
    const [listRoles, setListRoles] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [newRolName, setNewRolName] = useState("");
    const [addErrorRol, setAddErrorRol] = useState("");
    const [eliminateError, setEliminateError] = useState("");
    const [noRol, setNoRol] = useState("");
    const [isSelected, setIsSelected] = useState(false);
    const [addRol, setAddRol] = useState(false);

    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    const AddNewRol = () => {
        setAddRol(true);
    };

    const fetchData = () => {
        const roles = listRoles; //roles es un arreglo de strings(nombres de roles)
        const filteredRoles = filterValue
            ? roles.filter((rol) =>
                  rol.toLowerCase().includes(filterValue.toLowerCase())
              )
            : roles;

        setListRoles(filteredRoles);
        if (filteredRoles.length === 0) {
            setNoResults(true);
        } else {
            setNoResults(false);
        }
    };

    const handleInsertRol = () => {
        const hasDuplicates = (arr) => new Set(arr).size !== arr.length;
        if (listRoles.length === 0) {
            setAddErrorRol("No se puede crear un equipo sin roles.");
        } else if (hasDuplicates(listRoles)) {
            setAddErrorRol("El nombre del rol ya existe en la lista.");
        } else {
            // Realiza la inserción de la nueva épica aquí, por ejemplo, con una solicitud axios.
            // Luego, limpia el campo de entrada y el mensaje de error.
            setNewRolName("");
            setAddErrorRol("");
            handleAddRoles(listRoles);
            toggle();
        }
    };

    //quita el rol del arreglo de roles
/*     const EliminateRol = (rol) => {
        setEliminateError("");
        setListRoles(listRoles.filter((rol) => rol !== selectedRol));
        setIsSelected(false);
    }; */

    const EliminateRoles = (rolesToRemove) => {
        setEliminateError("");
        
        // Convertir el conjunto en un arreglo
        const rolesToRemoveArray = Array.from(rolesToRemove);
        
        setListRoles((prevRoles) => prevRoles.filter((rol) => !rolesToRemoveArray.includes(rol)));
        setIsSelected(false);
      };

    /*     const [selectedRol, setSelectedRol] = useState(null);

    const selectRol = (rol) => {
        setSelectedRol(rol);
        setIsSelected(true);
        setNoRol("");
        console.log(rol);
    };

    const deselectRol = (rol) => {
        setSelectedRol(null);
        setIsSelected(false);
    }; */

    const [selectedRoles, setSelectedRoles] = useState(new Set());

    const selectRol = (rol) => {
        setSelectedRoles((prevSelectedRoles) => {
            const newSelectedRoles = new Set(prevSelectedRoles);
            newSelectedRoles.add(rol);
            setIsSelected(true);
            setNoRol("");
            return newSelectedRoles;
        });
    };

    const deselectRol = (rol) => {
        setSelectedRoles((prevSelectedRoles) => {
            const newSelectedRoles = new Set(prevSelectedRoles);
            newSelectedRoles.delete(rol);
            setIsSelected(false);
            return newSelectedRoles;
        });
    };

    const handleEliminateError = (nameError) => {
        setEliminateError(nameError);
        setAddErrorRol("");
    };

    useEffect(() => {
        fetchData();
    }, [filterValue]);

    //agregamos el rol a la lista de roles
    const handleConfirmButtonClick = () => {
        if (newRolName.trim() === "") {
            setAddErrorRol("El nombre del rol no puede estar vacío.");
        } else if (listRoles.some((rol) => rol.nombre === newRolName)) {
            setAddErrorRol("El nombre del rol ya existe en la lista.");
        } else {
            setAddErrorRol("");
            setListRoles([...listRoles, newRolName]);
            setNewRolName("");
            setAddRol(false);
        }
    };

    return (
        modal && (
            <div className="popUp" style={{ animation: "droptop .3s linear" }}>
                <div onClick={toggle} className="overlay"></div>
                <div className="modalEpic">
                    {/*HEADER*/}
                    <div className="containerModal">
                        <p className="buscarEpic">
                            Listado de Roles por Equipo
                        </p>
                        <div className="subcontainer flex justify-end">
                            {/*No modifiques este boton, ya esta bien*/}
                            <Button
                                color="primary"
                                endContent={<PlusIcon />}
                                className="btnAddEpic"
                                onClick={AddNewRol}
                            >
                                Agregar Rol
                            </Button>
                            <Button
                                color="danger"
                                onClick={() => {
                                    isSelected
                                        ? handleEliminateError(
                                              "Seguro desea eliminar el rol?"
                                          )
                                        : setNoRol(
                                              "Falta seleccionar el rol a eliminar"
                                          );
                                }}
                                endContent={<PlusIcon />}
                                className="btnElimanteEpic"
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                    {/*No modifiques esto, ya esta bien*/}
                    {/*BUSCADOR*/}
                    <div className="divBuscador">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[100%]"
                            placeholder="Ingresa un rol..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onValueChange={onSearchChange}
                            variant="faded"
                        />
                    </div>

                    {/*LISTADO*/}
                    <div className="containerModal">
                        <div className="divEpics">
                            <UserCardsContext.Provider
                                value={{ selectRol, deselectRol }}
                            >
                                <ListRol lista={listRoles}></ListRol>
                            </UserCardsContext.Provider>
                            {noResults && (
                                <p className="error-message">
                                    No se encontraron resultados.
                                </p>
                            )}
                        </div>
                    </div>

                    {/*AGREGAR*/}
                    <div className="subcontainer">
                        {addRol ? (
                            <div className="flex">
                                <input
                                    type="text"
                                    autofocus
                                    className="inputEpica"
                                    placeholder="Escribe el nuevo rol"
                                    value={newRolName}
                                    onChange={(e) => {
                                        setNewRolName(e.target.value);
                                        setAddErrorRol("");
                                    }}
                                ></input>
                                <img
                                    src="/icons/icon-confirm.svg"
                                    alt="Confirmar"
                                    onClick={handleConfirmButtonClick}
                                ></img>
                            </div>
                        ) : null}
                        {addErrorRol && (
                            <p className="error-message">{addErrorRol}</p>
                        )}
                        {noRol && <p className="error-message">{noRol}</p>}
                        {eliminateError ? (
                            <div>
                                <p className="error-message">
                                    {eliminateError}
                                </p>
                                <div className="endButtons">
                                    <button
                                        className="buttonTwoUser"
                                        onClick={() => setEliminateError("")}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className="buttonOneUser"
                                        onClick={() =>
                                            EliminateRoles(selectedRoles)
                                        }
                                    >
                                        Confirmar
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {/*FOOTER*/}
                    {/*ya esta esto, no o modifiques */}
                    <div className="buttonSection">
                        <button className="close-modal" onClick={toggle}>
                            Cancelar
                        </button>
                        <div className="right-buttons">
                            <button
                                className="btn-modal"
                                onClick={handleInsertRol}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
