"use client"
import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";

import "@/styles/dashboardStyles/projectStyles/presupuesto/presupuesto.css";
import TableBudget from "@/components/tableBudget";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

axios.defaults.withCredentials = true;
import {
    Input,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@nextui-org/react";


import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { SmallLoadingScreen } from "../layout";
import {ExportIcon} from "@/../public/icons/ExportIcon";



export default function Presupuesto(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    
    console.log(projectId);
    console.log(projectName);
    //const router=userRouter();

    //States from Cronograma
    const [presupuestoId, setPresupuestoId] = useState(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        const stringURL =
            "http://localhost:8080/api/proyecto/cronograma/listarPresupuesto";

        axios
            .post(stringURL, { idProyecto: projectId })
            .then(function (response) {
                const presupuestoData = response.data.cronograma;
                console.log(presupuestoData);
                setPresupuestoId(presupuestoData.idCronograma);
                if (
                    Math.abs(presupuestoData.presupuestoInicial - 0) < 0.001
                
                ) {
            
                    onOpen();
                } 
                /*else {
                    const tareasURL =
                        "http://localhost:8080/api/proyecto/cronograma/listarTareasXidProyecto/" +
                        projectId;
                    axios
                        .get(tareasURL)
                        .then(function (response) {
                            setListTareas(response.data.tareas);
                            console.log(response.data.tareas);
                            setIsLoadingSmall(false);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }*/

                setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);





    const modificarPresupuesto = () => {
        //Revisar Api cuando esté lista
        const stringUrlmodificaPresupuesto = `http://localhost:8080/api/proyecto/presupuesto/modificarPresupuesto`;

        console.log(projectId);

        axios.post(stringUrlmodificaPresupuesto, {
            idProyecto: projectId,
            idMoneda: selectedMoneda,
            monto:parseFloat(monto),
            cantidadMeses:1,
        })

        .then(function (response) {
            console.log(response);
            console.log("Presupuesto modificado");
        })
        .catch(function (error) {
            console.log(error);
        });
    }


    const [filterValue, setFilterValue] = React.useState("");

    useEffect(()=>{setIsLoadingSmall(false)},[])
    return (
        //Presupuesto/Ingreso
        <div className="mainDivPresupuesto">

                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId}  text={projectName}/>
                    <BreadcrumbsItem href="" text="Presupuesto" />

                </Breadcrumbs>

                <div className="presupuesto">
                    <div className="titlePresupuesto">Presupuesto</div>

                    <div className="buttonsPresu">
                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}>
                                <button className="btnCommon btnFlujo btnDisabled btnSelected sm:w-1 sm:h-1" type="button" disabled>Flujo</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Historial"}>
                                <button className="btnCommon btnHistorial sm:w-1 sm:h-1" type="button">Historial</button> 
                        </Link>
                        
                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Ingreso"}>
                                <button className="btnCommon btnIngreso sm:w-1 sm:h-1" type="button">Ingresos</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Egresos"}>
                                <button className="btnCommon btnEgreso sm:w-1 sm:h-1" type="button">Egresos</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Estimacion"}>
                                <button className="btnCommon btnEstimacion sm:w-1 sm:h-1" type="button">Estimacion</button>
                        </Link>

                        <Button color="primary" startContent={<ExportIcon />} className="btnExportPresupuesto">
                            Exportar
                        </Button>
                    </div>

                    <div className="subtitlePresupuesto">Flujo de Caja Enero - Junio</div>
                    
                    <TableBudget> </TableBudget>

                </div>

                <Modal size='md' isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                <ModalContent>
                        {(onClose) => {
                            const cerrarModal = () => {
                                modificarPresupuesto();
                                onClose();
                            };
                            return (
                                <>
                                    <ModalHeader className="flex flex-col gap-1" 
                                        style={{ color: "#000", fontFamily: "Montserrat", fontSize: "16px", fontStyle: "normal", fontWeight: 600 }}>
                                        Crear Presupuesto
                                    </ModalHeader>
                                    <ModalBody>
                                        <p className="textIngreso">
                                                Se creará el presupuesto para el Proyecto: 
                                                <span className="nombreProyecto">{projectName}</span>
                                        </p>
                                        
                                        <div className="modalAddIngreso">
                                            <div className="comboBoxMoneda">
                                            <MyCombobox
                                                urlApi={stringUrlMonedas}
                                                property="monedas"
                                                nameDisplay="nombre"
                                                hasColor={false}
                                                onSelect={handleSelectedValueMoneda}
                                                idParam="idMoneda"
                                                initialName="Tipo Moneda"
                                                inputWidth="2/3"
                                            />

                                            </div>
                                        
                                            <Input
                                            value={monto}
                                            onValueChange={setMonto}
                                            placeholder="0.00"
                                            labelPlacement="outside"
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <span className="text-default-400 text-small">{selectedMoneda===2 ? "S/" : "$"}</span>
                                                </div>
                                            }
                                            endContent={
                                                <div className="flex items-center">

                                                </div>
                                                }
                                                type="number"
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



