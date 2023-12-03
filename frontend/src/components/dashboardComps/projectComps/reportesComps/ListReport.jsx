"use client";

import "@/styles/dashboardStyles/projectStyles/reportesStyles/ListReport.css";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SessionContext } from "@/app/dashboard/layout";
import { 
    Avatar, 
    Chip, 
    Tooltip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Button,
    useDisclosure,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalContent, 
} from "@nextui-org/react";
axios.defaults.withCredentials = true;
import { BudgetIcon } from "@/../public/icons/BudgetIcon";
import { TaskIcon } from "@/../public/icons/TaskIcon";
import { GroupProject } from "@/../public/icons/GroupProject";
import { Cronograma } from "@/../public/icons/Cronograma";
import { Risks } from "@/../public/icons/Risks";
import { AdvanceProject } from "@/../public/icons/AdvanceProject";
import { dbDateToDisplayDate } from "@/common/dateFunctions";
import { MenuIcon } from "@/../public/icons/MenuIcon";
import { EyeFilledIcon } from "@/../public/icons/EyeFilledIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { DeleteDocumentIcon } from "public/icons/deleteDocument";
import ModalCambiarNombre from "./ModalCambiarNombre";
function ReporteCard({ report, onClick, refresh }) {
    console.log("Herramienta reporte", report.idHerramienta);
    const colorOptions = {
        Presupuesto: "success",
        EDT: "warning",
        Cronograma: "secondary",
        Riesgos: "danger",
        "Avance general": "primary",
        "Grupos de proyectos": "primary",
        // Agrega más opciones según sea necesario
    };
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [modal, setModal] = useState(false);
    const toggleModal = () => {

        setModal(!modal);
    };
    const handleModal = (list) => {
        onOpen(); 
    };
    const Eliminate = (idReporte, onClose) => {
        console.log(idReporte);
        
        const data = {
            idReporteXProyecto: idReporte // Ajusta el nombre del campo según la estructura esperada por el servidor
        };
    
        axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/reporte/eliminarReporte", { data })
            .then((response) => {
                // Manejar la respuesta de la solicitud POST
                console.log("Respuesta del servidor:", response.data);
                console.log("Eliminado correcto");
                // Llamar a refresh() aquí después de la solicitud HTTP exitosa
                refresh();
                onClose();
            })
            .catch((error) => {
                // Manejar errores si la solicitud POST falla
                console.error("Error al realizar la solicitud:", error);
            });
        };
    return (
        <li
            className="ReportCard bg-mainBackground hover:bg-[#eeeeee] dark:hover:bg-opacity-10"
            // onClick={onClick}
        >
            <div className="flex flex-col justify-between">
                <div className="flex flex-row items-center justify-between">
                    {/* <div className="flex flex-row items-center gap-2">
                        <Tooltip content={report.nombre}>
                        <p className="font-semibold text-lg" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>{report.nombre}</p>
                        </Tooltip>
                        <Chip
                            className="capitalize mt-1 mb-1"
                            size="md"
                            variant="flat"
                            color={colorOptions[report.nombreHerramienta]}
                        >
                            {report.nombreHerramienta}
                        </Chip>
                    </div>
                    <p className="font-medium">
                        {dbDateToDisplayDate(report.fechaCreacion)}
                    </p>
                    <Dropdown>
                    <DropdownTrigger>
                    <Button 
                        variant="light" 
                        endContent={<MenuIcon size={24} />}
                    >
                         Menu
                    </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded" aria-label="Dropdown menu with description" disabledKeys="reporte">
                      <DropdownItem
                        key="new"
                        description="Visualiza el reporte creado"
                        startContent={<EyeFilledIcon size={24} />}
                        onClick={onClick}
                      >
                        Ver Reporte
                        
                      </DropdownItem>
                      <DropdownItem
                        key="reporte"
                        description="Cambia el nombre del reporte"
                        startContent={<PlusIcon size={24} />}
                        onPress={() => toggleModal()}
                      >
                        Cambiar nombre
                      </DropdownItem>
                      <DropdownItem
                        key="eliminar"
                        className="text-danger"
                        color="danger"
                        description="Elimina el reporte "
                        startContent={<DeleteDocumentIcon/>}
                        onPress={() => handleModal()}
                        >
                            Eliminar Reporte
                        </DropdownItem>
                    </DropdownMenu>
                  </Dropdown> */}
                  <Tooltip content={report.nombre}>
                        <p className="font-semibold text-lg" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>{report.nombre}</p>
                    </Tooltip>
                    <Dropdown>
                    <DropdownTrigger>
                    <Button 
                        variant="light" 
                        endContent={<MenuIcon size={24} />}
                    >
                         Menu
                    </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded" aria-label="Dropdown menu with description" disabledKeys="reporte">
                      <DropdownItem
                        key="new"
                        description="Visualiza el reporte creado"
                        startContent={<EyeFilledIcon size={24} />}
                        onClick={onClick}
                      >
                        Ver Reporte
                        
                      </DropdownItem>
                      <DropdownItem
                        key="reporte"
                        description="Cambia el nombre del reporte"
                        startContent={<PlusIcon size={24} />}
                        onPress={() => toggleModal()}
                      >
                        Cambiar nombre
                      </DropdownItem>
                      <DropdownItem
                        key="eliminar"
                        className="text-danger"
                        color="danger"
                        description="Elimina el reporte "
                        startContent={<DeleteDocumentIcon/>}
                        onPress={() => handleModal()}
                        >
                            Eliminar Reporte
                        </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                <div className="flex flex-row items-center justify-between gap-24">
                <Chip
                            className="capitalize mt-1 mb-1"
                            size="md"
                            variant="flat"
                            color={colorOptions[report.nombreHerramienta]}
                        >
                            {report.nombreHerramienta}
                        </Chip>
                        <p className="font-medium">
                        {dbDateToDisplayDate(report.fechaCreacion)}
                    </p>
                </div>

                <div className="flex flex-row justify-between flex-1">
                    <div className="flex flex-col justify-center flex-1">
                        <p className="font-medium">Creado por: </p>
                            <div className="flex flex-row items-center gap-1">
                                <Avatar
                                    className="transition-transform w-[2.5rem] min-w-[2.5rem] h-[2.5rem] min-h-[2.5rem] bg-mainUserIcon"
                                    src={report.imgLink}
                                />
                                <p className="">{report.nombresUsuario}</p>
                            </div>
                    </div>
                    {/* <img
                            className="w-160 h-150"
                            src="/icons/budget.svg"
                        /> */}
                    {/* {props.tipo === "Presupuesto" && (
                            <BudgetIcon />
                        )} */}
                    {report.idHerramienta === 4 && <Cronograma />}
                    {report.idHerramienta === 2 && <TaskIcon />}
                    {report.idHerramienta === 13 && <BudgetIcon />}
                    {report.idHerramienta === 5 && <Risks />}
                    {/* {props.tipo === "Cronograma" && (
                            <Cronograma />
                        )}
                        {props.tipo === "Riesgos" && (
                            <Risks />
                        )}
                        {props.tipo === "Avance general" && (
                            <AdvanceProject />
                        )}
                        {props.tipo === "Grupos de proyectos" && (
                            <GroupProject />
                        )} */}
                </div>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">¿Estás seguro que desea eliminar el reporte?</ModalHeader>
                  <ModalBody>
                    
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={()=> {
                        onClose();
                        
                    }}>
                      Cancelar
                    </Button>
                    <Button color="primary" onPress={() => Eliminate(report.idReporteXProyecto, onClose)}>
                      Aceptar
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
            </Modal>
            {modal && (
                <ModalCambiarNombre
                    modal={modal}
                    toggle={() => toggleModal()} // Pasa la función como una función de flecha
                    idReporte={report.idReporteXProyecto}
                    refresh={refresh}
                    nombreActual={report.nombre}
                />
            )}
        </li>
    );
}

//Aqui es la lista de Proyectos

export default function ListReport({ listReportes, handleViewReport, refresh }) {
    //const {sessionData, setSession} = useContext(SessionContext);

    function handleClick(proy_id, proy_name) {
        // router.push("/dashboard/" + proy_name + "=" + proy_id);
    }

    const ListReportes = [
        {
            id: 1,
            name: "Reporte 1",
            usuario: "Juan Perez",
            tipo: "Presupuesto",
            fecha: "2021-10-10",
        },
        {
            id: 2,
            name: "Reporte 2",
            usuario: "Juan Perez",
            tipo: "Entregables",
            fecha: "2021-10-10",
        },
        {
            id: 3,
            name: "Reporte 3",
            usuario: "Juan Perez",
            tipo: "Cronograma",
            fecha: "2021-10-10",
        },
        {
            id: 4,
            name: "Reporte 4",
            usuario: "Juan Perez",
            tipo: "Riesgos",
            fecha: "2021-10-10",
        },
        {
            id: 5,
            name: "Reporte 5",
            usuario: "Juan Perez",
            tipo: "Avance general",
            fecha: "2021-10-10",
        },
        {
            id: 6,
            name: "Reporte 6",
            usuario: "Juan Perez",
            tipo: "Grupos de proyectos",
            fecha: "2021-10-10",
        },
    ];

    return (
        <ul className="text-xl font-montserrat font-semibold flex flex-wrap justify-start gap-16 mt-8">
            {listReportes.map((report) => {
                return (
                    <ReporteCard
                        key={report.idReporteXProyecto}
                        report={report}
                        onClick={() => {
                            handleViewReport(report.idReporteXProyecto, report.fileId, report.idHerramienta);
                        }}
                        refresh={() => {
                            refresh();
                        }}
                    ></ReporteCard>
                );
            })}
        </ul>
    );
}
