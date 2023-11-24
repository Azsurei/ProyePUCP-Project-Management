"use client";

import "@/styles/dashboardStyles/projectStyles/EDTStyles/ListElementsEDT.css";
import { useContext, useRef, useState } from "react";
import { OpenMenuContext } from "./EDTVisualization";
import axios from "axios";
axios.defaults.withCredentials = true;

function CardEDT({ showElimConfirm, objComponent, ...props }) {
    const iconRef = useRef(null);
    const [openChilds, setOpenChilds] = useState(false);
    const [openMoreInfo, setOpenMoreInfo] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const { openMenuId, toggleMenu, handlerGoToNew, handleVerDetalle } =
        useContext(OpenMenuContext);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const toggleChildList = () => {
        if (openChilds === true) {
            setOpenChilds(false);
        } else {
            setOpenChilds(true);
        }
    };

    return (
        <div>
            <li className="border border-gray-300 rounded-md shadow-sm flex flex-row justify-between items-center p-5">
                <div className="flex flex-row  flex-1 gap-2">
                    {/* <p className="cardTag" style={{backgroundColor: props.levelColor}}>{props.levelName}</p> */}

                    <div className="w-1/3 flex gap-1 items-center ">
                        {props.childList !== null ? (
                            <div
                                className="hover:scale-125 transition-transform duration-75 ease-in"
                                onClick={toggleChildList}
                            >
                                <img src="/icons/chevron-down.svg" />
                            </div>
                        ) : null}
                        <p className="text-black ">{props.levelCounter}.</p>
                        <p className="text-black ">{props.name}</p>
                    </div>

                    <div className="flex flex-row text-black flex-1 justify-between  items-center">
                        <div className="flex flex-row gap-10 items-center">
                            <div className="flex flex-row gap-2 items-center ">
                                <Chip variant="flat" color="primary" className="text-md">
                                    {dbDateToDisplayDate(
                                        objComponent.fechaInicio
                                    )}
                                </Chip>
                                <p>-</p>
                                <Chip variant="flat" color="success" className="text-md">
                                {dbDateToDisplayDate(objComponent.fechaFin)}
                                </Chip>
                            </div>
                        </div>

                        <Dropdown aria-label="droMenTareasMain">
                            <DropdownTrigger aria-label="droMenTareasTrigger">
                                <Button
                                    size="md"
                                    radius="sm"
                                    variant="flat"
                                    color="default"
                                    className="ButtonMore"
                                >
                                    <p className="lblVerOpciones">
                                        Ver opciones
                                    </p>
                                    {/* <VerticalDotsIcon className="icnVerOpciones text-black-300" /> */}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="droMenTareas"
                                onAction={(key) => {
                                    if (key === "add") {
                                        handlerGoToNew(props.nextSon, props.id);
                                    }
                                    if (key === "view") {
                                        handleVerDetalle(props.id);
                                    }
                                    if (key === "delete") {
                                        showElimConfirm(
                                            props.id,
                                            props.levelCounter
                                        );
                                    }
                                }}
                            >
                                <DropdownItem key={"add"}>
                                    Agregar subcomponente
                                </DropdownItem>
                                <DropdownItem key={"view"}>
                                    Ver detalle
                                </DropdownItem>
                                <DropdownItem
                                    key={"delete"}
                                    color="danger"
                                    className="text-danger"
                                >
                                    Eliminar
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </li>

            <Collapse isOpened={openChilds}>
                {props.childList !== null && (
                    <ListElementsEDT
                        listData={props.childList}
                        initialMargin={30}
                    ></ListElementsEDT>
                )}
            </Collapse>
        </div>
    );
}

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Chip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Collapse } from "react-collapse";
import { dbDateToDisplayDate } from "@/common/dateFunctions";
import { VerticalDotsIcon } from "public/icons/VerticalDotsIcon";

export default function ListElementsEDT(props) {
    const router = useRouter();
    const ListComps = props.listData;

    const [modal, setModal] = useState(false);
    const [idAEliminar, setIdAEliminar] = useState(null);
    const [codAEliminar, setCodAEliminar] = useState(null);

    const showElimConfirm = () => {
        setModal(!modal);
    };

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const mostrarModalConfirmacion = (idComp, codComp) => {
        setIdAEliminar(idComp);
        setCodAEliminar(codComp);
        onOpen();
    };

    const confirmarModalEliminacion = () => {
        console.log("Procediendo con insertar el componente");
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/EDT/eliminarComponenteEDT",
                {
                    idComponente: idAEliminar,
                    codigo: codAEliminar,
                }
            )
            .then(function (response) {
                console.log(response);
                //props.refreshComponentsEDT;
                window.location.reload();
            })
            .catch(function (error) {
                console.log(error);
            });

        //NO SE COMO SE CIERRA MODAAAAAAL
    };

    return (
        <ul
            className="flex flex-col gap-2 mt-2"
            style={{ marginLeft: props.initialMargin }}
        >
            {ListComps.map((component) => {
                return (
                    <CardEDT
                        key={component.idComponente}
                        id={component.idComponente}
                        name={component.nombre}
                        objComponent={component}
                        nextSon={component.nextSon}
                        levelCounter={component.codigo}
                        levelName="FASE"
                        levelColor="purple"
                        childList={component.componentesHijos}
                        initialMargin={component.initialMargin}
                        showElimConfirm={mostrarModalConfirmacion}
                    ></CardEDT>
                );
            })}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-red-500">
                                {"Eliminar componente"}
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    {
                                        "¿Seguro que quiere eliminar este componente de su EDT?"
                                    }
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cerrar
                                </Button>

                                <Button
                                    className="bg-indigo-950 text-slate-50"
                                    onPress={() => {
                                        confirmarModalEliminacion();
                                    }}
                                >
                                    Continuar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </ul>
    );
}

//tu le das click a un CardEDT y se cargara la info de sus
//hijos, repitiendo el ListElementsEDT
