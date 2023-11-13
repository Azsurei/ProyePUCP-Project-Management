"use client";
import { Button, Chip, Divider, useDisclosure } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import ModalDeleteConfirmation from "@/components/dashboardComps/projectComps/settingsComps/ModalDeleteConfirmation";
import { SmallLoadingScreen } from "../layout";
import { useRouter } from "next/navigation";
import { SessionContext } from "../../layout";
import ListUsersInProject from "@/components/dashboardComps/projectComps/settingsComps/ListUsersInProject";
import ListToolsInProject from "@/components/dashboardComps/projectComps/settingsComps/ListToolsInProject";
axios.defaults.withCredentials = true;

function CheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
}

function UsersScreen({ userList, projectId }) {
    const { sessionData } = useContext(SessionContext);

    return (
        <div className="flex flex-col flex-1 h-[100%] space-y-2">
            <div className="flex flex-col mb-3">
                <p className="text-2xl font-medium text-mainHeaders">
                    Usuarios
                </p>
                <p className="text-slate-400">
                    Añade usuarios o elimina algunos de tu proyecto
                </p>
            </div>

            <Divider></Divider>

            <ListUsersInProject userList={userList} projectId={projectId} />
        </div>
    );
}

function ToolsScreen({ projectId, refreshPage }) {
    return (
        <div className="flex flex-col flex-1 h-[100%] space-y-2">
            <div className="flex flex-col mb-3">
                <p className="text-2xl font-medium text-mainHeaders">
                    Herramientas
                </p>
                <div className="text-slate-400 ">
                    Personaliza tus herramientas. Recuerda que las marcadas
                    como&nbsp;
                    <Chip
                        variant="flat"
                        color="primary"
                        endContent={<CheckIcon />}
                    >
                        Presente
                    </Chip>
                    &nbsp;son necesarias para el desarrollo del proyecto
                </div>
            </div>

            <Divider></Divider>

            <ListToolsInProject
                projectId={projectId}
                refreshPage={refreshPage}
            />
        </div>
    );
}

function DatesScreen() {
    return (
        <div className="flex flex-col flex-1 h-[100%] space-y-2">
            <div className="flex flex-col mb-3">
                <p className="text-2xl font-medium text-mainHeaders">Fechas</p>
                <p className="text-slate-400">Modifica datos del proyecto</p>
            </div>

            <Divider></Divider>

            <p>Fechas de inicio:</p>

            <p>Fechas de fin:</p>
        </div>
    );
}

const deleteProject = () => {
    const idProyecto = 200;

    const resultado = axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proyecto/${idProyecto}/listarHerramientasDeProyecto`
    );
    const herramientas = resultado.data.herramientas;
    axios
        .delete(
            process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/eliminarProyecto",
            {
                idProyecto: idProyecto,
                herramientas: herramientas,
            }
        )
        .then(function (response) {
            console.log(response);
            console.log("Proyecto eliminado con éxito");
        })
        .catch(function (error) {
            console.log(error);
        });
};

function DeleteScreen({ handleDelete }) {
    return (
        <div className="flex flex-col flex-1 h-[100%] space-y-2">
            <div className="flex flex-col mb-3">
                <p className="text-2xl font-medium text-mainHeaders">
                    Eliminar Proyecto
                </p>
                <p className="text-slate-400">
                    Elimina tu proyecto, tus herramientas y todos los datos
                    asociados a él. ¡Ten cuidado!
                </p>
            </div>

            <Divider></Divider>

            <Button
                color="danger"
                className="max-w-xs w-60"
                onPress={handleDelete}
            >
                Eliminar Proyecto
            </Button>
        </div>
    );
}

export default function Settings(props) {
    const router = useRouter();
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    const {
        isOpen: isModalDeleteOpen,
        onOpen: onModalDeleteOpen,
        onOpenChange: onModalDeleteChange,
    } = useDisclosure();

    const [userList, setUserList] = useState([]);

    const [settingsState, setSettingsState] = useState("users");
    const btnStyle =
        "group hover:underline  font-medium px-4 py-2 rounded-md cursor-pointer";
    const btnStyleActive =
        "font-medium px-4 py-2 rounded-md bg-[#F4F4F5] dark:bg-[#414141] cursor-pointer";

    useEffect(() => {
        setIsLoadingSmall(false);
        const usersURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/listarUsuariosXdProyecto/" +
            projectId;
        axios
            .get(usersURL)
            .then(function (response) {
                console.log(response);
                setUserList(response.data.usuarios);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <div className="w-[100%] min-h-full flex justify-center bg-mainBackground">
            <ModalDeleteConfirmation
                isOpen={isModalDeleteOpen}
                onOpenChange={onModalDeleteChange}
                idProyecto={projectId}
                handlePushToDashboard={() => {
                    router.push("/dashboard");
                }}
            />

            <div className="flex flex-col w-[100%] max-w-[1200px] h-[100%] p-[2.5rem] space-y-7 font-[Montserrat]">
                <div className="flex flex-col">
                    <p className="text-4xl font-semibold text-mainHeaders">
                        Configura tu proyecto
                    </p>
                    <p className="text-slate-400">
                        Maneja usuarios, herramientas, fechas y mas
                    </p>
                </div>

                <Divider className="px-[50px]"></Divider>

                <div className="flex flex-row w-[100%] h-[100%] space-x-8">
                    <div className="flex flex-col h-[100%] w-[20%] space-y-1">
                        <p
                            className={
                                settingsState === "users"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            onClick={() => {
                                setSettingsState("users");
                            }}
                        >
                            Usuarios
                        </p>
                        <p
                            className={
                                settingsState === "tools"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            onClick={() => {
                                setSettingsState("tools");
                            }}
                        >
                            Herramientas
                        </p>
                        <p
                            className={
                                settingsState === "dates"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            onClick={() => {
                                setSettingsState("dates");
                            }}
                        >
                            Fechas
                        </p>
                        <p
                            className={
                                settingsState === "delete"
                                    ? btnStyleActive
                                    : btnStyle
                            }
                            onClick={() => {
                                setSettingsState("delete");
                            }}
                        >
                            Eliminar
                        </p>
                    </div>

                    {settingsState === "users" && (
                        <UsersScreen
                            userList={userList}
                            projectId={projectId}
                        ></UsersScreen>
                    )}
                    {settingsState === "tools" && (
                        <ToolsScreen
                            projectId={projectId}
                            refreshPage={() => {
                                console.log("VAMOS A RECARGAR");
                                window.location.reload();
                            }}
                        ></ToolsScreen>
                    )}
                    {settingsState === "dates" && <DatesScreen></DatesScreen>}
                    {settingsState === "delete" && (
                        <DeleteScreen
                            handleDelete={onModalDeleteOpen}
                        ></DeleteScreen>
                    )}
                </div>
            </div>
        </div>
    );
}
