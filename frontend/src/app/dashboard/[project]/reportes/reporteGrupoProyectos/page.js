"use client";
import CardTareaDisplay from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardTareaDisplay";
import {
    Button,
    Chip,
    CircularProgress,
    Divider,
    Progress,
    Tabs,
    Tab,
    Card,
    CardBody,
    Input,
    Pagination,
} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { HerramientasInfo, SmallLoadingScreen } from "../../layout";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
import CardContribuyente from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardContribuyente";
import PieChart from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/PieChart";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import MyDynamicTable from "@/components/DynamicTable";
import { dbDateToDisplayDate } from "@/common/dateFunctions";
import  ReportePresupuesto  from "@/components/dashboardComps/projectComps/reportesComps/reporteGrupoProyectos/ReportePresupuesto";
import ReporteAlcance from "@/components/dashboardComps/projectComps/reportesComps/reporteGrupoProyectos/ReporteAlcance";
import ReporteCronograma from "@/components/dashboardComps/projectComps/reportesComps/reporteGrupoProyectos/ReporteCronograma";
import MyCombobox from "@/components/ComboBox";
import { useRouter } from "next/navigation";
import { setId } from "@material-tailwind/react/components/Tabs/TabsContext";
import { SessionContext } from "@/app/dashboard/layout";
axios.defaults.withCredentials = true;

export default function ReporteGrupoProyectos(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const {sessionData} = useContext(SessionContext);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [proyecto1, setProyecto1] = useState([]);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [selectedGrupoProyecto, setSelectedGrupoProyecto,] = useState("");
    const [selectedGrupoProyectoId, setSelectedGrupoProyectoId,] = useState("");
    const pruebaURl = "http://localhost:8080/api/proyecto/grupoProyectos/listarGruposProyecto"
    const [isId, setIsId] = useState(false);
    const handleSelectedValueChange= (value) => {
        setSelectedGrupoProyecto(value);
    };
    useEffect(() => {
        setIsLoadingSmall(true);
        onOpen();
        setIsLoadingSmall(false);
        
        setIsClient(true);
    }, [projectId]);

    

   
    // useEffect(() => {
    //     setIsClient(true);
    // }, []);
    return (
        <>
        <div className="divHistorialReportes"> 
            <div className="flex-1">
                    <Breadcrumbs>
                        <BreadcrumbsItem href="/" text="Inicio" />
                        <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                        <BreadcrumbsItem
                            href={"/dashboard/" + projectName + "=" + projectId}
                            text={projectName}
                        />
                        <BreadcrumbsItem href="" text="Historial de Reportes" />
                    </Breadcrumbs>
                {isId && (<div className="reporteGrupoProyectos">
                    <div className="titleHistorialReporte text-mainHeaders">
                        Nombre Proyecto
                    </div>
                    <Tabs aria-label="Options" color="warning">
                        <Tab key="photos" title="Alcance">
                            <ReporteAlcance isClient={isClient}/>
                        </Tab>
                        <Tab key="music" title="Cronograma">
                            <ReporteCronograma isClient={isClient} groupProject={selectedGrupoProyecto}/>
                        </Tab>
                        <Tab key="presupuesto" title="Presupuesto">
                            <ReportePresupuesto isClient={isClient} groupProject={selectedGrupoProyecto}/>
                        </Tab>
                    </Tabs>
                </div>
                )}
            </div>
            
            <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Seleccionar Grupo Proyecto</ModalHeader>
                                <ModalBody>
                                    <MyCombobox
                                        urlApi={
                                            process.env.NEXT_PUBLIC_BACKEND_URL +
                                            "/api/proyecto/grupoProyectos/listarGruposProyecto/" + sessionData.idUsuario
                                        }
                                        property="grupos"
                                        nameDisplay="nombre"
                                        hasColor={false}
                                        onSelect={handleSelectedValueChange}
                                        onSelectValor={handleSelectedValueChange}
                                        idParam="idGrupoDeProyecto"
                                        valorParam="idGrupoDeProyecto"
                                        label="Seleccionar Grupo Proyecto"
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={() => router.back()}>
                                        Cerrar
                                    </Button>
                                    <Button color="primary" onPress={() => { setIsId(true); onClose(); }}>
                                        Action
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
            </Modal>
        </div>
        
        </>
    );
}