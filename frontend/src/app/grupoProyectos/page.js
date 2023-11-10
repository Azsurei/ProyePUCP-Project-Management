"use client";

import Link from "next/link";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/projectMenu.css";
import ListProject from "@/components/dashboardComps/projectComps/projectCreateComps/ListProject";
import axios from "axios";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
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
} from "@nextui-org/react";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import CardSelectedUser from "@/components/CardSelectedUser";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import { SessionContext } from "./layout";
import ListGroupProject from "@/components/dashboardComps/projectComps/projectCreateComps/ListGroupProject";

export default function Dashboard() {
    const [filterValue, setFilterValue] = useState("");
    const [listUsers, setListUsers] = useState([]);

    const {sessionData} = useContext(SessionContext);
    

    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    if (sessionData.Privilegios_idPrivilegios === 3) {
        //debe ser 2

        const [listPrivUsers, setListPrivUsers] = useState([]);
        const [userSearchValue, setUserSearchValue] = useState("");
        const [modalSearchUser, setModalSearchUser] = useState(false);

        const toggleModal = () => {
            setModalSearchUser(!modalSearchUser);
        };

        function promiseCambiar_A_Alumno(usuario) {
            return new Promise((resolve, reject) => {
                const stringURL =
                    process.env.NEXT_PUBLIC_BACKEND_URL+"/api/admin/cambiarPrivilegioUsuario";
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
                        process.env.NEXT_PUBLIC_BACKEND_URL+"/api/admin/cambiarPrivilegioUsuario";
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
                process.env.NEXT_PUBLIC_BACKEND_URL+"/api/admin/listarUsuariosConPrivilegios";
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
                                Lista de usuarios con permisos de Creacion de
                                Proyecto:{" "}
                            </p>
                            <Button
                                className="h-[35px] bg-172B4D text-white font-semibold"
                                onPress={() => {
                                    setModalSearchUser(true);
                                }}
                            >
                                Añadir usuario
                            </Button>
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

                {modalSearchUser && (
                    <ModalUser
                        listAllUsers={true}
                        handlerModalClose={toggleModal}
                        handlerModalFinished={returnListSelected}
                        excludedUsers={listPrivUsers}
                        //idProyecto={projectId}
                    ></ModalUser>
                )}

                <Toaster
                    closeButton={true}
                    richColors
                    toastOptions={{
                        style: { fontSize: "1.05rem" },
                    }}
                />
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
                    <BreadcrumbsItem href="/dashboard" text="Grupo de Proyectos" />
                </Breadcrumbs>
                <p className="textProject2">Grupo de Proyectos</p>
            </div>

            <div className="divSearch">
                <div className="divBuscador">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[80%]"
                        placeholder="Buscar Grupo de Proyectos..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onValueChange={onSearchChange}
                        variant="faded"
                    />
                </div>
                {sessionData.Privilegios_idPrivilegios === 2 && ( 
                    <div className="contentDer">
                        <p className="textProject">
                            ¿Desea crear su grupo de proyecto?
                        </p>

                        <div className="butonAddProject">
                            <Link
                                href="/grupoProyectos/newGroup"
                                id="newProBtnContainer"
                            >
                                <button className="addProjectbtn">
                                    Crear Grupo
                                </button>
                            </Link>
                        </div>
                    </div>
                )} 

            </div>
            <ListGroupProject filterValue={filterValue} onSearchChange={onSearchChange}/>
        </div>
    );
}