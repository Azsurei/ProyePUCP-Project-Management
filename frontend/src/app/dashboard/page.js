"use client";

import Link from "next/link";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/projectMenu.css";
import ListProject from "@/components/dashboardComps/projectComps/projectCreateComps/ListProject";
import axios from "axios";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

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
    Tooltip,
    Switch,
} from "@nextui-org/react";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import CardSelectedUser from "@/components/CardSelectedUser";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import { SessionContext } from "./layout";

export default function Dashboard() {
    const [filterValue, setFilterValue] = useState("");
    const [listUsers, setListUsers] = useState([]);

    const { sessionData } = useContext(SessionContext);

    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    if (sessionData.Privilegios_idPrivilegios === 3) {
        //debe ser 2

        const [listPrivUsers, setListPrivUsers] = useState([]);
        const [listPrivUsersOriginales, setListPrivUsersOriginales] = useState(
            []
        );
        const [userSearchValue, setUserSearchValue] = useState("");
        const [modalSearchUser, setModalSearchUser] = useState(false);

        const onSearchChangeUsuario = (value) => {
            console.log("El valor del filtro es: ", value);
            setUserSearchValue(value);
            const lowercasedValue = value.toLowerCase();
            const filteredUsers = listPrivUsersOriginales.filter(
                (user) =>
                    user.nombres.toLowerCase().includes(lowercasedValue) ||
                    user.apellidos.toLowerCase().includes(lowercasedValue) ||
                    user.correoElectronico
                        .toLowerCase()
                        .includes(lowercasedValue) ||
                    `${user.nombres} ${user.apellidos}`
                        .toLowerCase()
                        .includes(lowercasedValue)
            );
            setListPrivUsers(filteredUsers);
        };

        const toggleModal = () => {
            setModalSearchUser(!modalSearchUser);
        };

        function promiseCambiar_A_Alumno(usuario) {
            return new Promise((resolve, reject) => {
                const stringURL =
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/admin/cambiarPrivilegioUsuario";
                axios
                    .put(stringURL, {
                        idUsuario: usuario.idUsuario,
                        idPrivilegio: 1,
                    })
                    .then((response) => {
                        console.log(response);
                        resolve(response);
                    })

                    .catch(function (error) {
                        console.log("Error al eliminar usuario", error);
                        reject(error);
                    });
            });
        }

        const removeHandler = (usuario) => {
            const newArray = listPrivUsers.filter(
                (item) => item.idUsuario !== usuario.idUsuario
            );
            setListPrivUsers(newArray);

            //lanzamos notificaicon de eliminacion
            toast.promise(promiseCambiar_A_Alumno(usuario), {
                loading: "Quitando privilegio a usuario...",
                success: (data) => {
                    return "El usuario ya no cuenta con privilegios";
                },
                error: "Error al quitar privilegio a usuario",
                position: "bottom-right",
            });
        };

        function promiseAñadirProfesores(listSelected) {
            return new Promise((resolve, reject) => {
                for (const usuario of listSelected) {
                    const stringURL =
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                        "/api/admin/cambiarPrivilegioUsuario";
                    axios
                        .put(stringURL, {
                            idUsuario: usuario.idUsuario,
                            idPrivilegio: 2,
                        })
                        .then((response) => {
                            console.log(response);
                        })

                        .catch(function (error) {
                            console.log("Error al eliminar usuario", error);
                            reject(error);
                        });
                }
                resolve("listo");
            });
        }

        const returnListSelected = (listSelected) => {
            setModalSearchUser(false);
            console.log("se recibio: " + listSelected);

            const strLoading =
                listSelected.length > 1
                    ? "Añadiendo profesores..."
                    : "Añadiendo profesor...";
            const strSuccess =
                listSelected.length > 1
                    ? "Los profesores fueron añadidos con exito!"
                    : "El profesor fue añadido con exito!";
            const strError =
                listSelected.length > 1
                    ? "Error al añadir los profesores"
                    : "Error al añadir al profesor";

            toast.promise(promiseAñadirProfesores(listSelected), {
                loading: strLoading,
                success: (data) => {
                    return strSuccess;
                },
                error: strError,
                position: "bottom-right",
            });

            const newList = [...listPrivUsers, ...listSelected];
            console.log(newList);
            setListPrivUsers(newList);
        };

        useEffect(() => {
            const stringURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/admin/listarUsuariosConPrivilegios";
            axios
                .get(stringURL)
                .then((response) => {
                    console.log(response);
                    setListPrivUsers(response.data.usuariosPriv);
                    setListPrivUsersOriginales(response.data.usuariosPriv);
                    setPages(
                        Math.ceil(
                            response.data.usuariosPriv.length / rowsPerPage
                        )
                    );
                })

                .catch(function (error) {
                    console.log(
                        "Error al cargar la lista de usuarios con privilegios",
                        error
                    );
                });
        }, []);

        const [page, setPage] = React.useState(1);
        const rowsPerPage = 5;

        const [pages, setPages] = useState(1);

        //const pages = Math.ceil(listPrivUsers.length / rowsPerPage);

        const items = React.useMemo(() => {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;

            return listPrivUsers.slice(start, end);
        }, [page, listPrivUsers]);

        const columns = [
            { name: "Nombre", uid: "nombres" },
            { name: "Permisos para creación de proyecto", uid: "permiso" },
        ];

        const statusColorMap = ["warning", "danger", "success"];

        const renderCell = React.useCallback(
            (user, columnKey) => {
                const cellValue = user[columnKey];

                switch (columnKey) {
                    case "nombres":
                        return (
                            <User
                                avatarProps={{
                                    radius: "lg",
                                    src: user.imgLink,
                                }}
                                description={user.correoElectronico}
                                name={cellValue + " " + user.apellidos}
                            >
                                {user.email}
                            </User>
                        );
                    case "permiso":
                        return (
                            <div className="flex items-center gap-4 justify-center">
                                <Switch
                                    defaultSelected
                                    aria-label="Permisos"
                                    color="success"
                                    isSelected={
                                        user.Privilegios_idPrivilegios === 2
                                            ? true
                                            : false
                                    }
                                    onValueChange={() => {
                                        console.log("cambio");
                                        const newPriv =
                                            user.Privilegios_idPrivilegios === 2
                                                ? 1
                                                : 2;
                                        const stringURL =
                                            process.env
                                                .NEXT_PUBLIC_BACKEND_URL +
                                            "/api/usuario/modificarPrivilegios";
                                        const putData = {
                                            idUsuario: user.idUsuario,
                                            Privilegios_idPrivilegios: newPriv,
                                        };
                                        console.log(
                                            "El put data es: ",
                                            putData
                                        );
                                        axios
                                            .put(stringURL, putData)
                                            .then((response) => {
                                                console.log(response);
                                                setListPrivUsersOriginales(
                                                    (prevList) =>
                                                        prevList.map((item) =>
                                                            item.idUsuario ===
                                                            user.idUsuario
                                                                ? {
                                                                      ...item,
                                                                      Privilegios_idPrivilegios:
                                                                          newPriv,
                                                                  }
                                                                : item
                                                        )
                                                );
                                                setListPrivUsers((prevList) =>
                                                    prevList.map((item) =>
                                                        item.idUsuario ===
                                                        user.idUsuario
                                                            ? {
                                                                  ...item,
                                                                  Privilegios_idPrivilegios:
                                                                      newPriv,
                                                              }
                                                            : item
                                                    )
                                                );
                                            })

                                            .catch(function (error) {
                                                console.log(
                                                    "Error al eliminar usuario",
                                                    error
                                                );
                                            });
                                    }}
                                />
                                <Chip
                                    color={
                                        statusColorMap[
                                            user.Privilegios_idPrivilegios
                                        ]
                                    }
                                    size="sm"
                                    variant="flat"
                                >
                                    {user.Privilegios_idPrivilegios === 2
                                        ? "Sí cuenta"
                                        : "No cuenta"}
                                </Chip>
                            </div>
                        );
                    default:
                        return cellValue;
                }
            },
            [listPrivUsers]
        );

        return (
            <div className="w-[100%] flex justify-center">
                <div className="w-[90%] p-[2.5rem] flex flex-col space-y-[1rem]">
                    <div>
                        <p
                            style={{
                                fontFamily: "Montserrat",
                                fontSize: "3rem",
                                fontWeight: 600,
                                lineHeight: "40px",
                                marginBottom: "1rem",
                            }}
                        >
                            Bienvenido Superadmin!
                        </p>
                        <p
                            style={{
                                fontFamily: "Montserrat",
                                fontSize: "1.5rem",
                                fontWeight: 400,
                            }}
                        >
                            Aqui podras configurar y habilitar privilegios para
                            ciertas cuentas. Adelante!
                        </p>
                    </div>

                    <div>
                        <div
                            className="flex flex-row justify-between items-center mb-2"
                            style={{ fontFamily: "Montserrat" }}
                        >
                            <p
                                style={{
                                    fontFamily: "Montserrat",
                                    fontSize: "1.2rem",
                                    fontWeight: 400,
                                    lineHeight: "40px",
                                }}
                            >
                                Lista de usuarios:
                            </p>
                            {/*                             <Button
                                className="h-[35px] bg-172B4D text-white font-semibold"
                                onPress={() => {
                                    setModalSearchUser(true);
                                }}
                            >
                                Añadir usuario
                            </Button> */}
                        </div>

                        <Input
                            isClearable
                            className="w-full sm:max-w-[100%] mb-[1rem]"
                            placeholder="Buscar Usuario..."
                            startContent={<SearchIcon />}
                            value={userSearchValue}
                            onValueChange={onSearchChangeUsuario}
                            variant="faded"
                            color="white"
                        />

                        {/*                         <div className="flex flex-col space-y-[.5rem] pb-[4.5rem]">
                            {listPrivUsers.map((usuario) => (
                                <CardSelectedUser
                                    key={usuario.idUsuario}
                                    isEditable={true}
                                    usuarioObject={usuario}
                                    removeHandler={removeHandler}
                                ></CardSelectedUser>
                            ))}
                        </div> */}
                        <Table
                            aria-label="Tabla de usuarios"
                            bottomContent={
                                <div className="flex w-full justify-center">
                                    <Pagination
                                        isCompact
                                        showControls
                                        showShadow
                                        color="primary"
                                        page={page}
                                        total={pages}
                                        onChange={(page) => setPage(page)}
                                    />
                                </div>
                            }
                            classNames={{
                                wrapper: "min-h-[222px]",
                            }}
                        >
                            <TableHeader columns={columns}>
                                {(column) => (
                                    <TableColumn
                                        key={column.uid}
                                        className={
                                            column.uid === "permiso"
                                                ? "text-center"
                                                : ""
                                        }
                                    >
                                        {column.name}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={items}>
                                {(item) => (
                                    <TableRow key={item.idUsuario}>
                                        {(columnKey) => (
                                            <TableCell>
                                                {renderCell(item, columnKey)}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {modalSearchUser && (
                    <ModalUser
                        listAllUsers={true}
                        handlerModalClose={toggleModal}
                        handlerModalFinished={returnListSelected}
                        excludedUsers={listPrivUsers}
                        //idProyecto={projectId}
                    ></ModalUser>
                )}
            </div>
        );
    }

    useEffect(() => {
        console.log(sessionData);
    }, []);

    return (
        <div className="mainDiv">
            <div className="headerDiv text-mainHeaders">
                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                </Breadcrumbs>
                <p className="textProject2">Proyectos</p>
            </div>

            <div className="divSearch">
                <div className="divBuscador">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[80%]"
                        placeholder="Buscar Proyecto..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onValueChange={onSearchChange}
                        variant="faded"
                    />
                </div>

                {sessionData.Privilegios_idPrivilegios === 2 && (
                    <div className="contentDer">
                        <p className="textProject">
                            ¿Tienes ya la idea ganadora?
                        </p>

                        <div className="butonAddProject">
                            <Link
                                href="/dashboard/newProject"
                                id="newProBtnContainer"
                            >
                                <button className="addProjectbtn">
                                    Crear Proyecto
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            <ListProject
                filterValue={filterValue}
                onSearchChange={onSearchChange}
            ></ListProject>
        </div>
    );
}
