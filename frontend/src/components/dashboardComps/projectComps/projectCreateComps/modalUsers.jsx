import React from "react";
import { useEffect, useState } from "react";
import "@/styles/dashboardStyles/projectStyles/ProjectCreateStyles/modalUser.css";
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

export default function ModalUser({
    handlerModalClose,
    handlerModalFinished,
    excludedUsers,
}) {
    const [filterValue, setFilterValue] = useState("");
    const [listUsers, setListUsers] = useState([]);

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

                console.log("se recibio el arreglo desde db: "+ usersArray);
                console.log("arreglo a previo ya seleccionado: "+ excludedUsers);

                //quitamos los usuarios que ya fueron seleccionados
                const excludedUserIds = excludedUsers.map(user => user.id);
                const filteredUsers = usersArray.filter(user => !excludedUserIds.includes(user.id));

                setListUsers(filteredUsers);
                console.log(filteredUsers);

                //setListUsers(usersArray);
                //console.log(usersArray);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    //useEffect(() => {
    //    refreshList();
    //}, [filterValue]);

    return (
        <div className="popUp">
            <div className="overlay"></div>
            <div className="modalUser">
                <p className="buscarSup">Buscar nuevo miembro</p>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: ".6rem",
                    }}
                >
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
                    <Button className="bg-indigo-950 text-slate-50" onClick={refreshList}>
                        Buscar
                    </Button>
                </div>

                <div className="divUsers">
                    <UserCardsContext.Provider
                        value={{ addUserList, removeUserInList }}
                    >
                        <ListUsers lista={listUsers}></ListUsers>
                    </UserCardsContext.Provider>
                </div>
                <div className="endButtons">
                <Button
                        color="danger"
                        variant="light"
                        onClick={handlerModalClose}
                    >
                        Cerrar
                    </Button>
                    <Button
                        className="bg-indigo-950 text-slate-50"
                        onClick={() => {
                            handlerModalFinished(listUsersSelect);
                        }}
                    >
                        Continuar
                    </Button>
                </div>
            </div>
        </div>
    );
}
