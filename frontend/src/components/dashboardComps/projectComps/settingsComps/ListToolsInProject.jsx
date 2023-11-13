"use client";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { HerramientasInfo } from "@/app/dashboard/[project]/layout";
import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Spinner,
    Switch,
    useDisclosure,
} from "@nextui-org/react";
import ModalDeleteTool from "./ModalDeleteTool";
import { Toaster, toast } from "sonner";
axios.defaults.withCredentials = true;

function CrossIcon() {
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
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );
}

function PlusIcon() {
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
                d="M12 4.5v15m7.5-7.5h-15"
            />
        </svg>
    );
}

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

function ToolCard({
    tool,
    isSelected,
    isDisabled,
    handlerDelete,
    handlerAdd,
    isAdding,
}) {
    return (
        <div className="flex flex-row gap-2 px-4 py-4 rounded-lg border items-center">
            {/* <p>A</p> IMAGEN EN UN FUTURO*/}
            <div className="flex flex-col flex-1">
                <p className="text-xl font-medium">{tool.nombre}</p>
                <p>{tool.descripcion}</p>
            </div>
            {isSelected === true && isDisabled === false && (
                <Button
                    color="danger"
                    endContent={<CrossIcon />}
                    onPress={handlerDelete}
                    isDisabled={
                        isAdding !== tool.idHerramienta && isAdding !== null
                    }
                >
                    Eliminar
                </Button>
            )}
            {isSelected === false && isDisabled === false && (
                <Button
                    color="success"
                    className="text-white"
                    endContent={<PlusIcon />}
                    onPress={handlerAdd}
                    isLoading={isAdding === tool.idHerramienta}
                    isDisabled={
                        isAdding !== tool.idHerramienta && isAdding !== null
                    }
                >
                    Agregar
                </Button>
            )}
            {isDisabled === true && (
                <Button color="primary" isDisabled endContent={<CheckIcon />}>
                    Presente
                </Button>
            )}
        </div>
    );
}

function ListToolsInProject({ projectId, refreshPage }) {
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [baseToolsList, setBaseToolsList] = useState([]);
    const [projectToolsList, setProjectToolsList] = useState([]);

    const { herramientasInfo } = useContext(HerramientasInfo);

    const [toolToDelete, setToolToDelete] = useState(null);

    const [isAdding, setIsAdding] = useState(null);

    const {
        isOpen: isModalDeleteOpen,
        onOpen: onModalDeleteOpen,
        onOpenChange: onModalDeleteChange,
    } = useDisclosure();

    useEffect(() => {
        setIsLoadingInitial(true);
        const usersURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/herramientas/listarHerramientas";
        axios
            .get(usersURL)
            .then(function (response) {
                console.log(response);
                setBaseToolsList(response.data.herramientas);
                setProjectToolsList(herramientasInfo);
                console.log(herramientasInfo);
                setIsLoadingInitial(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    if (isLoadingInitial === true) {
        return (
            <div className="flex justify-center items-center flex-1">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 overflow-y-auto">
            <ModalDeleteTool
                isOpen={isModalDeleteOpen}
                onOpenChange={onModalDeleteChange}
                idProyecto={projectId}
                tool={toolToDelete}
                refreshPage={refreshPage}
            />
            {baseToolsList.map((tool) => {
                return (
                    <ToolCard
                        key={tool.idHerramienta}
                        tool={tool}
                        isSelected={
                            projectToolsList.find(
                                (toolCustom) =>
                                    toolCustom.idHerramienta ===
                                    tool.idHerramienta
                            )
                                ? true
                                : false
                        }
                        isDisabled={
                            tool.idHerramienta === 1 ||
                            tool.idHerramienta === 2 ||
                            tool.idHerramienta === 4 ||
                            tool.idHerramienta === 13
                        }
                        handlerDelete={() => {
                            setToolToDelete({
                                ...tool,
                                idHerramientaCreada: projectToolsList.find(
                                    (toolCustom) =>
                                        toolCustom.idHerramienta ===
                                        tool.idHerramienta
                                ).idHerramientaCreada,
                            });
                            onModalDeleteOpen();
                        }}
                        handlerAdd={() => {
                            setIsAdding(tool.idHerramienta);
                            addTool();
                        }}
                        isAdding={isAdding}
                    />
                );
            })}
            <Toaster richColors></Toaster>
        </div>
    );

    async function addTool() {
        //FUNCION NO ESTA LISTA CUIDADO !!!!! //!!!!!
        const addURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/agregarHerramientaAProyecto";
        const objToSend = {
            idProyecto: projectId,
            idHerramienta: isAdding,
        }
        axios
            .post(addURL, objToSend)
            .then(function (response) {
                console.log(response);

                toast.success("Herramienta agregada con exito");
                setTimeout(() => {
                    console.log("vamos a refrescar");
                    refreshPage();
                }, 500);
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Error al agregar herramienta");
            });
    }
}
export default ListToolsInProject;
