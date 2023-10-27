"use client";

import Link from "next/link";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/projectMenu.css";
import ListProject from "@/components/dashboardComps/projectComps/projectCreateComps/ListProject";
import axios from "axios";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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
import CardSelectedUser from "@/components/CardSelectedUser";

export default function Dashboard() {
    const [filterValue, setFilterValue] = useState("");
    const [listUsers, setListUsers] = useState([]);
    const { data: session, status } = useSession();

    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    if (session.user.rol === 3) {
        //debe ser 2

        const [listPrivUsers, setListPrivUsers] = useState([]);
        const [userSearchValue, setUserSearchValue] = useState("");

        const removeHandler = (usuario) => {
            const newArray = listPrivUsers.filter(
                (item) => item.idUsuario !== usuario.idUsuario
            );
            setListPrivUsers(newArray);
        };

        useEffect(() => {
            const stringURL =
                "http://localhost:8080/api/admin/listarUsuariosConPrivilegios";
            axios
                .get(stringURL)
                .then((response) => {
                    console.log(response);
                    setListPrivUsers(response.data.usuariosPriv);
                })

                .catch(function (error) {
                    console.log(
                        "Error al cargar la lista de usuarios con privilegios",
                        error
                    );
                });
        }, []);

        return (
            <div className="border border-red-500 w-[100%] flex justify-center">
                <div className="w-[90%] p-[2.5rem] flex flex-col space-y-[1rem]">
                    <div>
                        <p
                            style={{
                                fontFamily: "Montserrat",
                                fontSize: "3rem",
                                fontWeight: 600,
                                lineHeight: "40px",
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
                        <div className="flex flex-row justify-between items-center">
                            <p
                                style={{
                                    fontFamily: "Montserrat",
                                    fontSize: "1.2rem",
                                    fontWeight: 400,
                                    lineHeight: "40px",
                                }}
                            >
                                Lista de usuarios con permisos de Creacion de
                                Proyecto:{" "}
                            </p>
                            <div>boton</div>
                        </div>

                        <Input
                            isClearable
                            className="w-full sm:max-w-[100%] mb-[1rem]"
                            placeholder="Buscar Usuario..."
                            startContent={<SearchIcon />}
                            value={userSearchValue}
                            onValueChange={setUserSearchValue}
                            variant="faded"
                            color="white"
                        />

                        <div className="flex flex-col space-y-[.5rem] pb-[4.5rem]">
                            {listPrivUsers.map((usuario) => (
                                <CardSelectedUser
                                    key={usuario.idUsuario}
                                    isEditable={true}
                                    usuarioObject={usuario}
                                    removeHandler={removeHandler}
                                ></CardSelectedUser>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    useEffect(() => {
        console.log(session);
    }, []);

    return (
        <div className="mainDiv">
            <div className="headerDiv">
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

                <div className="contentDer">
                    <p className="textProject">¿Tienes ya la idea ganadora?</p>

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
            </div>

            <ListProject></ListProject>
        </div>
    );
}
