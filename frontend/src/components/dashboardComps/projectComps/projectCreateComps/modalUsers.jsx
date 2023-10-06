import React from "react";
import { useEffect, useState } from "react";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/modalUser.css";
import ListUsers from "./ListUsers";
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

export default function ModalUser({ handlerModalClose, handlerModalFinished }) {
    const [filterValue, setFilterValue] = useState("");
    const [listUsers, setListUsers] = useState([]);
    const [noResults, setNoResults] = useState(false);

    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    const [listUsersSelect, setlistUsersSelected] = useState([]);

    const addUserList = (user) => {
        const newUserList = [
            ...listUsersSelect,
            {
                id: user.id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
            },
        ];
        setlistUsersSelected(newUserList);
        console.log(newUserList);
    };

    const removeUserInList = (user) => {
        const newUserList = listUsersSelect.filter(
            (item) => item.id !== user.id
        );
        setlistUsersSelected(newUserList);
        console.log(newUserList);
    };

    const refreshList = () => {
        const stringURL = "http://localhost:8080/api/usuario/listarUsuarios";
        axios
            .post(stringURL, {
                nombreCorreo: filterValue,
            })
            .then(function (response) {
                console.log(response);
                const usersArray = response.data.usuarios.map((user) => {
                    return {
                        id: user.idUsuario,
                        name: user.nombres,
                        lastName: user.apellidos,
                        email: user.correoElectronico,
                    };
                });
                if (usersArray.length > 0) {
                    setListUsers(usersArray);
                    setNoResults(false);
                } else {
                    setListUsers([]);
                    setNoResults(true);
                }
                console.log(usersArray);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(() => {
        refreshList();
    }, [filterValue]);

    return (
        <div className="popUp">
			<div className="overlay"></div>
            <div className="modalUser">
                <p className="buscarSup">Buscar nuevo miembro</p>
                <div className="divBuscador">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[100%]"
                        placeholder="Ingresa un miembro..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onValueChange={onSearchChange}
                        variant="faded"
                    />
                </div>
                {noResults && (
                    <p className="noResultsMessage">
                        No se encontraron resultados.
                    </p>
                )}
                <div className="divUsers">
                    <UserCardsContext.Provider
                        value={{ addUserList, removeUserInList }}
                    >
                        <ListUsers lista={listUsers}></ListUsers>
                    </UserCardsContext.Provider>
                </div>
                <div className="endButtons">
                    <button
                        className="buttonTwoUser"
                        onClick={handlerModalClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="buttonOneUser"
                        onClick={()=>{handlerModalFinished(listUsersSelect)}}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
