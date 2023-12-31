"use client";

import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListProject.css";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import { Avatar, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Modal, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure } from "@nextui-org/react";
import { SessionContext } from "@/app/dashboard/layout";
import TablaProyectos from "@/components/dashboardComps/projectComps/projectCreateComps/TablaProyectos";
import RouteringReporteGrupo from "./RouteringReporteGrupo";
import { MenuIcon } from "@/../public/icons/MenuIcon";
import { EyeFilledIcon } from "@/../public/icons/EyeFilledIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { DeleteDocumentIcon } from "public/icons/deleteDocument";
import ModalEliminateGroup from "./ModalEliminateGroup";
import RouteringEditarGrupo from "./RouteringEditarGrupo";
axios.defaults.withCredentials = true;
function GroupCard(props) {
    const router = useRouter();
    const fechaTransaccion = new Date(props.fechaCreacion);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = fechaTransaccion.toLocaleDateString('es-ES', options);
    const idUsuario = props.idUsuario;
    const idGrupoProyecto = props.id;
    const urlPrueba = "http://localhost:8080/api/usuario/verInfoUsuario/"
    const [usuario, setUsuario] = useState([]);
    const [proyectos, setProyectos] = useState([]);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [idGrupo, setIdGrupo] = useState("");
    const [navegate, setNavegate] = useState(false);
    const [edit, setEdit] = useState(false);
    const [modal, setModal] = useState(false);
    const setRoutering = (objectID) => {
        setIdGrupo(objectID);
        setNavegate(!navegate);
    };
    const setRoutering2 = (objectID) => {
        setIdGrupo(objectID);
        setEdit(!edit);
    };
    const toggleModal = () => {

        setModal(!modal);
    };
    const handleModal = (list) => {
        onOpen();
        
    };
    function DataProyectos() {
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/grupoProyectos/listarDatosProyectosXGrupo/${idGrupoProyecto}`);
              console.log("Id Grupo: ", idGrupoProyecto);
              const data = response.data.proyectos;
              setProyectos(data);
              console.log(`Estos son los proyectos:`, data);
            } catch (error) {
              console.error('Error al obtener los proyectos:', error);
            }
          };
            fetchData();
    };
    useEffect(() => {
        DataProyectos();
    }, [idGrupoProyecto]);
    useEffect(() => {
        const stringURLUsuario =
            process.env.NEXT_PUBLIC_BACKEND_URL + "/api/usuario/verInfoUsuario";

        axios
            .get(stringURLUsuario)
            .then(function (response) {
                const userData = response.data.usuario[0];
                setUsuario(userData);
                setIsLoading(false);
                setIsLoadingSmall(false);
                console.log("Usuario: ", userData)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [idUsuario]);

    return (
        <>
        <li className="ProjectCard bg-mainBackground hover:bg-[#eeeeee] dark:hover:bg-opacity-10" onClick={props.onClick}>
            <div className="flex justify-between items-center">
            <p className="text-xl font-montserrat font-semibold">{props.name}</p>
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
                        description="Visualiza los proyectos relacionados del grupo"
                        onPress={() => handleModal(proyectos)}
                        startContent={<EyeFilledIcon size={24} />}
                      >
                        Visualizar Proyectos
                        
                      </DropdownItem>
                      <DropdownItem
                        key="new"
                        description="Editar Grupos de Proyectos"
                        onPress={() => setRoutering2(idGrupoProyecto)}
                        startContent={<PlusIcon size={24} />}
                      >
                        Editar grupo de proyectos
                        
                      </DropdownItem>
                      <DropdownItem
                        key="reporte"
                        description="Crea un reporte de grupo de proyectos"
                        onPress={() => {
                            setRoutering(idGrupoProyecto);
                        }
                        }
                        startContent={<PlusIcon size={24} />}
                        isDisabled={proyectos.length === 0}
                      >
                        Ver Reporte
                      </DropdownItem>
                      <DropdownItem
                        key="eliminar"
                        className="text-danger"
                        color="danger"
                        description="Elimina este grupo de proyectos"
                        startContent={<DeleteDocumentIcon/>}
                        onPress={() => toggleModal()}
                        >
                            Eliminar Grupo
                        </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
            </div>
            

            <p className="text-gray-600 font-montserrat text-base font-semibold leading-2 mt-2 mb-2">
                {fechaFormateada}
            </p>
            
            {usuario && (
                <div className="flex items-center justify-center gap-4">
                    <Avatar
                        key={usuario.idUsuario}
                        className="transition-transform w-[2.5rem] min-w-[2.5rem] h-[2.5rem] min-h-[2.5rem] bg-mainUserIcon"
                        radius="md"
                        src={usuario.imgLink}
                        fallback={
                            <p
                                className="membersIcon bg-mainUserIcon"
                                key={usuario.idUsuario}
                            >
                                {usuario.nombres}
                                {usuario.apellidos !== null
                                    ? usuario.apellidos
                                : ""}
                            </p>
                        }
                        
                    />
                     <Chip
                        className="capitalize"
                        color="primary"
                        size="md"
                        variant="flat"
                    >
                        {usuario.nombres} {usuario.apellidos}
                    </Chip>
            </div>
            )}

            <p className="text-gray-600 font-montserrat text-base font-semibold leading-2 mt-2">
                {proyectos.length} Proyectos involucrados 
            </p>
            


           
        </li>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                                        <ModalContent>
                                            {(onClose) => (
                                                <>
                                                <ModalHeader className="flex flex-col gap-1">Lista de Proyectos</ModalHeader>
                                                <ModalBody>
                                                {proyectos && proyectos.length > 0 ? (
                                                    <TablaProyectos proyectos={proyectos} />
                                                ) : (
                                                    <p>No hay datos de proyectos disponibles.</p>
                                                )}
                                                    
                                                </ModalBody>
                                                <ModalFooter>                                   
                                                    <Button color="primary" onPress={onClose}>
                                                            Aceptar
                                                    </Button>
                                                </ModalFooter>
                                                </>
                                            )}
                                        </ModalContent>
                                    </Modal>
            {navegate && idGrupo && (
                <RouteringReporteGrupo
                idGrupoProyecto={idGrupo}
                />
            )}
            {modal && (
                <ModalEliminateGroup
                    modal={modal}
                    toggle={() => toggleModal()} // Pasa la función como una función de flecha
                    idGrupoProyecto={idGrupoProyecto}
                    refresh={props.refresh}
                />
            )}
            {edit && idGrupo && (
                <RouteringEditarGrupo
                idGrupoProyecto={idGrupo}
                />
            )}

        </>
        
    );
}
export default function 
ListGroupProject(props) {
    const router = useRouter();
    const {sessionData} = useContext(SessionContext);
    const { filterValue, onSearchChange } = props;

    function handleClick(proy_id, proy_name) {
        // router.push("/dashboard/" + proy_name + "=" + proy_id);
    }

    const [isLoading, setIsLoading] = useState(true); //loading screen seteada por defecto
    const [ListComps, setListComps] = useState([]);

    const fetchData = () => {
        let gruposArray;
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/grupoProyectos/listarGruposProyecto/" + sessionData.idUsuario;
    
        axios
            .get(stringURL)
            .then(function (response) {
                console.log(response);
                gruposArray = response.data.grupos;
    
                gruposArray = gruposArray.map((grupos) => {
                    return {
                        id: grupos.idGrupoDeProyecto,
                        name: grupos.nombre,
                        date: grupos.fechaCreacion,
                        usuuario: grupos.idUsuario,
                    };
                });
    
                setListComps(gruposArray);
                console.log(gruposArray);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const filteredProjects = ListComps.filter((component) => {
        const projectName = component.name.toLowerCase();
        return projectName.includes(filterValue.toLowerCase());
    });
    return (
        <ul className="text-xl font-montserrat font-semibold flex flex-wrap justify-start gap-16 mt-16">
            {filteredProjects.map((component) => {
                return (
                                        <GroupCard
                                        key={component.id}
                                        id={component.id}
                                        name={component.name}
                                        fechaCreacion = {component.date}
                                        idUsuario = {component.usuario}
                                        onClick={() => {
                                            // const updSessionData = {...sessionData};
                                            // updSessionData.rolInProject = component.roleId;
                                            // setSession(updSessionData);
                                            // handleClick(component.id, component.name);
                                        }}
                                        refresh={fetchData}
                                    ></GroupCard>   
                );
            })}

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </ul>
    );
}