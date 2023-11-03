"use client";
import React, { useEffect, useState, useContext } from "react";
import { SmallLoadingScreen } from "../layout";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { 
    Button,
    Input,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
import { SearchIcon } from "@/../public/icons/SearchIcon";
import TuneIcon from '@mui/icons-material/Tune';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { ChevronDownIcon } from "@/../public/icons/ChevronDownIcon";
import AssessmentIcon from '@mui/icons-material/Assessment';
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import ReportTypeCard from "@/components/dashboardComps/projectComps/reportesComps/ReportTypeCard";
import ListReport from "@/components/dashboardComps/projectComps/reportesComps/ListReport";
export default function Reportes(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const [filterValue, setFilterValue] = React.useState("");
    const [toolsFilter, setToolsFilter] = React.useState("all");
    const onSearchChange = (value) => {
        setFilterValue(value);
    };
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [filtrarFecha, setFiltrarFecha] = useState(false);

    const handleChangeFechaInicioFilter = (event) => {
        setFechaInicio(event.target.value);
    };

    const handleChangeFechaFinFilter = (event) => {
        setFechaFin(event.target.value);
    };
    const {
        isOpen: isModalFechaOpen,
        onOpen: onModalFecha,
        onOpenChange: onModalFechachange,
    } = useDisclosure();
    const toolsOptions = [
        { name: "Reporte de Avance", uid: "active" },
        { name: "Grupo de Reporte", uid: "active" },
    ];

    const [screenState, setScreenState] = useState(0);
    //0 para la vista de reportes generados previamente
    //1 para la vista de seleccion de tipo de nuevo reporte

    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    //esta sera la pantalla de vista de reportes generados y la pantalla para crear uno nuevo (seleccionar cual)

    return (
        <div className="divHistorialReportes">
            {screenState === 0 && (
                <div className="flex-1 border border-green-400">
                    <Breadcrumbs>
                        <BreadcrumbsItem href="/" text="Inicio" />
                        <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                        <BreadcrumbsItem
                            href={"/dashboard/" + projectName + "=" + projectId}
                            text={projectName}
                        />
                        <BreadcrumbsItem href="" text="Historial de Reportes" />
                    </Breadcrumbs>
                    <div className="historialReportes">
                        <div className="headHistorialReportes">
                            <div className="titleHistorialReporte text-mainHeaders">
                                Historial de Reportes
                            </div>
                            <Button
                                color="primary"
                                startContent={<PlusIcon />}
                                className="btnCreateReporte"
                                onClick={() => {
                                    setScreenState(1);
                                }}
                            >
                                Nuevo
                            </Button>
                        </div>
                        <div className="divFiltrosReporte">
                            <Input
                                isClearable
                                className="w-2/4 sm:max-w-[50%]"
                                placeholder="Buscar reporte..."
                                startContent={<SearchIcon />}
                                value={filterValue}
                                onClear={() => onClear("")}
                                onValueChange={onSearchChange}
                                variant="faded"
                            />
                            <div className="buttonReporteContainer"> 
                                <Button  onPress={onModalFecha} color="primary" startContent={<TuneIcon />} className="btnFiltro">
                                 Filtrar
                                </Button>
                                <Dropdown>
                                    <DropdownTrigger className="btnFiltro">
                                        <Button
                                            endContent={
                                                <ChevronDownIcon className="text-small" />
                                            }
                                            variant="flat"
                                            className="font-['Roboto']"
                                        >
                                            Proyectos
                                        </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            disallowEmptySelection
                                             aria-label="Table Columns"
                                            closeOnSelect={false}
                                            selectedKeys={toolsFilter}
                                            selectionMode="multiple"
                                            onSelectionChange={setToolsFilter}
                                        >
                                            {toolsOptions.map((status) => (
                                                <DropdownItem
                                                    key={status.uid}
                                                 >
                                                    {status.name}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div> 
                        <div className="mt-5 ">
                            <ListReport></ListReport>
                        </div>
                    </div>
                    

                </div>
            )}

            {screenState === 1 && (
                <div className="flex-1 flex flex-col">
                    <HeaderWithButtonsSamePage
                        haveReturn={true}
                        haveAddNew={false}
                        handlerReturn={() => {
                            setScreenState(0);
                        }}
                        breadcrump={
                            "Inicio / Proyectos / " +
                            projectName +
                            " / Historial de Reportes"
                        }
                    >
                        Crea un nuevo reporte
                    </HeaderWithButtonsSamePage>

                    <div className="flex flex-row gap-5 flex-1 mt-3">
                        <ReportTypeCard />
                        <ReportTypeCard />
                        <ReportTypeCard />
                        <ReportTypeCard />
                    </div>
                </div>
            )}
            <Modal size="xl" isOpen={isModalFechaOpen} onOpenChange={onModalFechachange}>
                    <ModalContent>
                        {(onClose) => {
                        const finalizarModal = () => {
                            //filtraFecha();
                            setFiltrarFecha(true);
                            onClose();
                        };
                        return (
                            <>
                            <ModalHeader>Filtra tus reportes</ModalHeader>

                            <ModalBody>
                                <p
                                style={{
                                    color: "#494949",
                                    fontSize: "16px",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                }}
                                >
                                Elige la fecha que deseas consultar
                                </p>

                                <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginTop: "1rem",
                                }}
                                >
                                <p
                                    style={{
                                    color: "#002D74",
                                    fontSize: "16px",
                                    fontStyle: "normal",
                                    fontWeight: 500,
                                    }}
                                >
                                    Desde
                                </p>

                                <p
                                    style={{
                                    color: "#002D74",
                                    fontSize: "16px",
                                    fontStyle: "normal",
                                    fontWeight: 500,
                                    flex: 0.43,
                                    }}
                                >
                                    Hasta
                                </p>
                                </div>

                                <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "2rem",
                                    marginBottom: "1.2rem",
                                }}
                                >
                                <DateInput
                                    isEditable={true}
                                    value={fechaInicio}
                                    onChangeHandler={handleChangeFechaInicioFilter}
                                />

                                <span style={{ margin: "0 10px" }}>
                                    <ArrowRightAltIcon />
                                </span>

                                <DateInput
                                    value={fechaFin}
                                    isEditable={true}
                                    onChangeHandler={handleChangeFechaFinFilter}
                                />
                                </div>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                className="text-white"
                                variant="light"
                                onPress={() => {
                                    onClose(); // Cierra el modal
                                    setFechaInicio("");
                                    setFechaFin("");
                                }}
                                style={{ color: "#EA541D" }}
                                >
                                Limpiar Búsqueda
                                </Button>
                                <Button
                                style={{ backgroundColor: "#EA541D" }}
                                className="text-white"
                                onPress={finalizarModal}
                                >
                                Filtrar
                                </Button>
                            </ModalFooter>
                            </>
                        );
                        }}
                    </ModalContent>
                </Modal>
        </div>
    );
}
