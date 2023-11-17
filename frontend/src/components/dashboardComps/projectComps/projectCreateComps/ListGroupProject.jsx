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
axios.defaults.withCredentials = true;
function GroupCard(props) {
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
    const setRoutering = (objectID) => {
        setIdGrupo(objectID);
        setNavegate(!navegate);
    };
    const handleModal = (list) => {
        onOpen();
        
    };
    const DataProyectos = async () => {
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
            <p className="cardTitleProject">{props.name}</p>
            <Dropdown>
                    <DropdownTrigger>
                    <Button 
                        variant="bordered" 
                    >
                         Menu
                    </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="faded" aria-label="Dropdown menu with description" >
                      <DropdownItem
                        key="new"
                        description="Visualiza los proyectos relacionados del grupo"
                        onPress={() => handleModal(proyectos)}
                      >
                        Visualizar Proyectos
                        
                      </DropdownItem>
                      <DropdownItem
                        key="copy"
                        description="Crea un reporte de grupo de proyectos"
                        onPress={() => {
                            setRoutering(idGrupoProyecto);
                        }
                        }
                      >
                        Crear Reporte
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
            </div>
            

            <p className="cardDates text-xl">
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

            <p className="cardDates text-xl">
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
        </>
        
    );
}
export default function ListGroupProject(props) {
    const router = useRouter();
    const {sessionData} = useContext(SessionContext);
    const { filterValue, onSearchChange } = props;

    function handleClick(proy_id, proy_name) {
        // router.push("/dashboard/" + proy_name + "=" + proy_id);
    }

    const [isLoading, setIsLoading] = useState(true); //loading screen seteada por defecto
    const [ListComps, setListComps] = useState([]);

    useEffect(() => {
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
    }, []);

    const filteredProjects = ListComps.filter((component) => {
        const projectName = component.name.toLowerCase();
        return projectName.includes(filterValue.toLowerCase());
    });
    return (
        <ul className="ListProject">
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
                                    ></GroupCard>   
                );
            })}

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </ul>
    );
}