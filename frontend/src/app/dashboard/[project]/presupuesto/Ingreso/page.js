"use client"
import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import DateInput from "@/components/DateInput";
import MyCombobox from "@/components/ComboBox";
import "@/styles/dashboardStyles/projectStyles/presupuesto/presupuesto.css";
import "@/styles/dashboardStyles/projectStyles/presupuesto/ingresos.css";
import { Select, SelectItem, Textarea } from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
axios.defaults.withCredentials = true;
import {
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    useDisclosure,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
  } from "@nextui-org/react";

import { SearchIcon } from "@/../public/icons/SearchIcon";
import TuneIcon from '@mui/icons-material/Tune';

import { PlusIcon } from "@/../public/icons/PlusIcon";
import { SmallLoadingScreen } from "../../layout";


export default function Ingresos(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    
    console.log(projectId);
    console.log(projectName);
    //const router=userRouter();
    const [listUsers, setListUsers] = useState([]);

    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    const [modal1, setModal1] = useState(false);

    const [filterValue, setFilterValue] = React.useState("");


    useEffect(()=>{setIsLoadingSmall(false)},[])


    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const insertarLineaIngreso = () => {

    };

    const stringUrlMonedas = `http://localhost:8080/api/proyecto/presupuesto/listarMonedasTodas`;
    const stringUrlTipoIngreso = `http://localhost:8080/api/proyecto/presupuesto/listarTipoIngresosTodos `;
    
    const [selectedMoneda, setselectedMoneda] = useState("");
    
    const handleSelectedValueMoneda = (value) => {
        setselectedMoneda(value);
    };
    
    return (

        
        //Presupuesto/Ingreso
        <div className="mainDivPresupuesto">

                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId}  text={projectName}/>
                    <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}  text="Presupuesto"/>
                    <BreadcrumbsItem href="" text="Ingresos" />

                </Breadcrumbs>

                <div className="presupuesto">
                    <div className="titlePresupuesto">Ingresos</div>

                    <div className="buttonsPresu">
                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}>
                                <button className="btnCommon btnFlujo  sm:w-1 sm:h-1" type="button">Flujo</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Historial"}>
                                <button className="btnCommon btnHistorial sm:w-1 sm:h-1" type="button">Historial</button> 
                        </Link>
                        
                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Ingreso"}>
                                <button className="btnCommon btnIngreso btnDisabled btnSelected sm:w-1 sm:h-1"  disabled type="button">Ingresos</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Egresos"}>
                                <button className="btnCommon btnEgreso sm:w-1 sm:h-1" type="button">Egresos</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Estimacion"}>
                                <button className="btnCommon btnEstimacion sm:w-1 sm:h-1" type="button">Estimacion</button>
                        </Link>


                    </div>
                    <div className="divFiltroPresupuesto">
                        <Input
                            isClearable
                            className="w-2/4 sm:max-w-[50%]"
                            placeholder="Buscar Ingreso..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onValueChange={onSearchChange}
                            variant="faded"
                        />

                    <div className="buttonContainer">
                        <Button color="primary" startContent={<TuneIcon />} className="btnFiltro">
                            Filtrar
                        </Button>

                        <Button onPress={onOpen} color="primary" startContent={<PlusIcon />} className="btnAddIngreso">
                            Agregar
                        </Button>
                       
                        </div>
                    </div>


                
                </div>

                <Modal size='lg' isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                <ModalContent>
                        {(onClose) => {
                            const cerrarModal = () => {
                                insertarLineaIngreso();
                                onClose();
                            };
                            return (
                                <>
                                    <ModalHeader className="flex flex-col gap-1" 
                                        style={{ color: "#000", fontFamily: "Montserrat", fontSize: "16px", fontStyle: "normal", fontWeight: 600 }}>
                                        Completar Campos
                                    </ModalHeader>
                                    <ModalBody>
                                        <p className="textIngreso">Monto Entrante</p>
                                        
                                        <div className="modalAddIngreso">
                                            <div className="comboBoxMoneda">
                                            <MyCombobox
                                                urlApi={stringUrlMonedas}
                                                property="monedas"
                                                nameDisplay="nombre"
                                                hasColor={false}
                                                onSelect={handleSelectedValueMoneda}
                                                idParam="idMoneda"
                                                initialName={selectedMoneda}
                                                inputWidth="16"
                                            />
                                            </div>

                                            <Textarea
                                                label=""
                                                labelPlacement="outside"
                                                placeholder=""
                                                className="max-w-x"
                                                maxRows="1"
                                                />
                                        
                                        </div>

                                        <p className="textIngreso">Descripción</p>

                                        <Textarea
                                            label=""
                                            labelPlacement="outside"
                                            placeholder=""
                                            className="max-w-x"
                                            maxRows="2"
                                            />

                                        <div className="comboBoxMoneda">
                                            <p className="textIngreso">Tipo Transaccion</p>
                                            <MyCombobox
                                                urlApi={stringUrlMonedas}
                                                property="monedas"
                                                nameDisplay="nombre"
                                                hasColor={false}
                                                onSelect={handleSelectedValueMoneda}
                                                idParam="idMoneda"
                                                initialName={selectedMoneda}
                                                inputWidth="16"
                                            />

                                        </div>


                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={onClose}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            color="primary"
                                            onPress={cerrarModal}
                                        >
                                            Guardar
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



