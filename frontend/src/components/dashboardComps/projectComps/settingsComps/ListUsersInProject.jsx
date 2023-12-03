"use client";
import CardSelectedUser from "@/components/CardSelectedUser";
import { Button, Chip, Spinner, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";
import ModalUser from "../projectCreateComps/ModalUsers";
import axios from "axios";
import { Toaster, toast } from "sonner";
import ModalDeleteUser from "./ModalDeleteUser";
axios.defaults.withCredentials = true;

function ListUsersInProject({ projectId, refreshPage, loadDelete }) {
    const [isModalSupervOpen, setIsModalSupervOpen] = useState(false);
    const [isModalMiembros, setIsModalMiembrosOpen] = useState(false);

    const [currentUserList, setCurrentUserList] = useState([]);
    const [userToDelete, setUserToDelete] = useState(null);

    const [isLoadingInitial, setIsLoadingInitial] = useState(true);

    const {
        isOpen: isModalDeleteOpen,
        onOpen: onModalDeleteOpen,
        onOpenChange: onModalDeleteChange,
    } = useDisclosure();

    useEffect(() => {
        setIsLoadingInitial(true);
        const usersURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/listarUsuariosXdProyecto/" +
            projectId;
        axios
            .get(usersURL)
            .then(function (response) {
                setCurrentUserList(response.data.usuarios);
                setIsLoadingInitial(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const twStyle1 = "flex flex-col gap-2";
    const twStyle2 = "flex flex-col gap-2";

    if (isLoadingInitial === true) {
        return (
            <div className="flex justify-center items-center flex-1">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 pt-2 overflow-y-auto pb-4">
            {isModalSupervOpen && (
                <ModalUser
                    listAllUsers={true}
                    idProyecto={projectId}
                    handlerModalClose={() => {
                        setIsModalSupervOpen(false);
                    }}
                    handlerModalFinished={(users) => {
                        addUser(users, 2);
                        setIsModalSupervOpen(false);
                    }}
                    excludedUsers={currentUserList}
                ></ModalUser>
            )}
            {isModalMiembros && (
                <ModalUser
                    listAllUsers={true}
                    idProyecto={projectId}
                    handlerModalClose={() => {
                        setIsModalMiembrosOpen(false);
                    }}
                    handlerModalFinished={(users) => {
                        addUser(users, 3);
                        setIsModalMiembrosOpen(false);
                    }}
                    excludedUsers={currentUserList}
                ></ModalUser>
            )}
            <ModalDeleteUser
                isOpen={isModalDeleteOpen}
                onOpenChange={onModalDeleteChange}
                idProyecto={projectId}
                currentUser={userToDelete}
                removeFromList={()=>{
                    const newUserList = currentUserList.filter(user => user.idUsuario !== userToDelete.idUsuario);
                    setCurrentUserList([...newUserList]);
                    setUserToDelete(null);
                }}
                refreshPage={refreshPage}
            />

            <div className={twStyle2}>
                <div className="flex flex-row gap-2 items-center">
                    <p className="text-xl font-medium">Jefe de proyecto:</p>
                </div>
                {currentUserList.filter((user) => user.idRol === 1).length !==
                    0 &&
                    currentUserList
                        .filter((user) => user.idRol === 1)
                        .map((jefe) => {
                            return (
                                <CardSelectedUser
                                    key={jefe.idUsuario}
                                    isEditable={false}
                                    usuarioObject={jefe}
                                />
                            );
                        })}
            </div>

            <div className={twStyle2}>

                    <div className="flex flex-row gap-2 items-center">
                        <p className="text-xl font-medium">Supervisores</p>
                        {loadDelete && (
                        <Button
                            color="primary"
                            onClick={() => {
                                setIsModalSupervOpen(true);
                                console.log(currentUserList);
                            }}
                            className="px-unit-3 text-sm"
                            size="sm"
                        >
                            <p>Buscar usuario</p>
                            <img
                                src="/icons/icon-searchBar.svg"
                                alt=""
                                className="icnSearch"
                                style={{ width: "20px" }}
                            />
                        </Button>)}
                    </div>

                <div className={twStyle1}>
                    {currentUserList.filter((user) => user.idRol === 2)
                        .length !== 0 &&
                        currentUserList
                            .filter((user) => user.idRol === 2)
                            .map((supervisor) => {
                                return (
                                    <CardSelectedUser
                                        key={supervisor.idUsuario}
                                        isEditable={loadDelete}
                                        usuarioObject={supervisor}
                                        removeHandler={(user) => {
                                            setUserToDelete(user);
                                            onModalDeleteOpen();
                                        }}
                                    />
                                );
                            })}
                </div>
            </div>

            <div className={twStyle2}>
                <div className="flex flex-row gap-2 items-center">
                    <p className="text-xl font-medium">Miembros de equipo</p>
                    {loadDelete && (
                    <Button
                        color="primary"
                        onClick={() => {
                            setIsModalMiembrosOpen(true);
                        }}
                        className="px-unit-3 text-sm"
                        size="sm"
                    >
                        <p>Buscar usuario</p>
                        <img
                            src="/icons/icon-searchBar.svg"
                            alt=""
                            className="icnSearch"
                            style={{ width: "20px" }}
                        />
                    </Button>)}
                </div>
                <div className={twStyle1}>
                    {currentUserList.filter((user) => user.idRol === 3)
                        .length !== 0 &&
                        currentUserList
                            .filter((user) => user.idRol === 3)
                            .map((miembro) => {
                                return (
                                    <CardSelectedUser
                                        key={miembro.idUsuario}
                                        isEditable={loadDelete}
                                        usuarioObject={miembro}
                                        removeHandler={(user) => {
                                            setUserToDelete(user);
                                            onModalDeleteOpen();
                                        }}
                                    />
                                );
                            })}
                </div>
            </div>
            <Toaster richColors />
        </div>
    );

    function promiseAddUser(users, idRol) {
        return new Promise((resolve, reject) => {
            const addUrl =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/agregarUsuariosAProyecto";

            const usersWithRol = users.map((user) => {
                return {
                    ...user,
                    idRol: idRol,
                };
            });

            axios
                .post(addUrl, {
                    usuarios: usersWithRol,
                    idProyecto: projectId,
                })
                .then(function (response) {
                    console.log(response.data.message);
                    setCurrentUserList([...currentUserList, ...usersWithRol]);
                    resolve("exito");

                    setTimeout(() => {
                        refreshPage();
                    }, 500);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                });
        });
    }

    function addUser(users, idRol) {
        toast.promise(promiseAddUser(users, idRol), {
            loading: "Agregando usuario...",
            success: (data) => {
                return "Se agregó el usuario con exito";
            },
            error: "Error al eliminar usuario",
            position: "bottom-right",
        });
    }
}
export default ListUsersInProject;
