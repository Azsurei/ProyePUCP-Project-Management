import React from "react";
import { useEffect, useState } from "react";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ModalUsers.css";
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

export const UserCardsContextNormal = React.createContext();

export default function ModalUser({
    listAllUsers,
    handlerModalClose,
    handlerModalFinished,
    excludedUsers,
    idProyecto,
    excludedUniqueUser,
    isExcludedUniqueUser = false,
}) {
    const [filterValue, setFilterValue] = useState("");
    const [listUsers, setListUsers] = useState([]);
    const [listUsersOriginales, setListUsersOriginales] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const onSearchChange = (value) => {
        console.log("El valor del filtro es: ", value);
        setFilterValue(value);
        const lowercasedValue = value.toLowerCase();
        const filteredUsers = listUsersOriginales.filter(
            (user) =>
                user.nombres.toLowerCase().includes(lowercasedValue) ||
                user.apellidos.toLowerCase().includes(lowercasedValue) ||
                user.correoElectronico.toLowerCase().includes(lowercasedValue) ||
                `${user.nombres} ${user.apellidos}`.toLowerCase().includes(lowercasedValue)
        );
        setListUsers(filteredUsers);
    };

    const [listUsersSelect, setlistUsersSelected] = useState([]);

    const addUserList = (user) => {
        const newUserList = [...listUsersSelect, user];
        setlistUsersSelected(newUserList);
        console.log(newUserList);
    };

    const removeUserInList = (user) => {
        const newUserList = listUsersSelect.filter(
            (item) => item.idUsuario !== user.idUsuario
        );
        setlistUsersSelected(newUserList);
        console.log(newUserList);
    };

    const refreshList = () => {
        setIsLoaded(false);
        if (listAllUsers === false) {
            const stringURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/api/proyecto/listarUsuariosXdProyecto/${idProyecto}`;

            axios
                .get(stringURL)
                .then(function (response) {
                    console.log(response);
                    // const usersArray = response.data.usuarios.map((user) => {
                    //     return {
                    //         id: user.idUsuario,
                    //         name: user.nombres,
                    //         lastName: user.apellidos,
                    //         email: user.correoElectronico,
                    //     };
                    // });

                    console.log(
                        "se recibio el arreglo desde db: " +
                            response.data.usuarios
                    );
                    console.log(
                        "arreglo a previo ya seleccionado: " + excludedUsers
                    );

                    //quitamos los usuarios que ya fueron seleccionados
                    let excludedUserIds = excludedUsers.map(
                        (user) => user.idUsuario
                    );
                    if (isExcludedUniqueUser) {
                        excludedUserIds = excludedUserIds.concat(
                            excludedUniqueUser.map((user) => user.idUsuario)
                        );
                    }
                    const filteredUsers = response.data.usuarios.filter(
                        (user) => !excludedUserIds.includes(user.idUsuario)
                    );

                    setListUsers(filteredUsers);
                    setListUsersOriginales(filteredUsers);
                    console.log(filteredUsers);
                    setIsLoaded(true);
                    //setListUsers(usersArray);
                    //console.log(usersArray);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            const stringURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/usuario/listarUsuarios";
            axios
                .post(stringURL, {
                    nombreCorreo: filterValue,
                })
                .then(function (response) {
                    console.log(response);
                    // const usersArray = response.data.usuarios.map((user) => {
                    //     return {
                    //         id: user.idUsuario,
                    //         name: user.nombres,
                    //         lastName: user.apellidos,
                    //         email: user.correoElectronico,
                    //     };
                    // });

                    console.log(
                        "se recibio el arreglo desde db: " +
                            response.data.usuarios
                    );
                    console.log(
                        "arreglo a previo ya seleccionado: " + excludedUsers
                    );

                    //quitamos los usuarios que ya fueron seleccionados
                    const excludedUserIds = excludedUsers.map(
                        (user) => user.idUsuario
                    );
                    const filteredUsers = response.data.usuarios.filter(
                        (user) => !excludedUserIds.includes(user.idUsuario)
                    );

                    setListUsers(filteredUsers);
                    setListUsersOriginales(filteredUsers);
                    console.log(filteredUsers);
                    setIsLoaded(true);
                    //setListUsers(usersArray);
                    //console.log(usersArray);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        refreshList();
    }, []);

    return (
        <div className="popUp">
            <div className="overlay"></div>
            <div className="modalUser bg-mainModalColor">
                <p className="buscarSup text-mainHeaders font-semibold">
                    Buscar nuevos miembros
                </p>
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
                            placeholder="Busque por nombres o correo"
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onValueChange={onSearchChange}
                            variant="faded"
                        />
                    </div>
{/*                     <Button
                        className="bg-indigo-950 dark:bg-primary-300 text-slate-50"
                        onClick={refreshList}
                    >
                        Buscar
                    </Button> */}
                </div>

                <div className="divUsers">
                    <UserCardsContextNormal.Provider
                        value={{ addUserList, removeUserInList }}
                    >
                        <ListUsers lista={listUsers} isLoaded={isLoaded}></ListUsers>
                    </UserCardsContextNormal.Provider>
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
                        className="bg-indigo-950 dark:bg-primary-300 text-slate-50"
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
