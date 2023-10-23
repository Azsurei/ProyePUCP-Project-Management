"use client"
import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import MyCombobox from "@/components/ComboBox";
import "@/styles/dashboardStyles/projectStyles/presupuesto/presupuesto.css";
import TableBudget from "@/components/tableBudget";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { Toaster, toast } from "sonner";

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
    const stringUrlMonedas = `http://localhost:8080/api/proyecto/presupuesto/listarMonedasTodas`;
    const router = useRouter();

    const volverMainDashboard = () => {
        router.push("/dashboard/" + projectName + "=" + projectId);
    };
    
    console.log(projectId);
    console.log(projectName);
    //const router=userRouter();

    //States from Cronograma
    const [presupuestoId, setPresupuestoId] = useState(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    let idHerramientaCreada;
    let flag=0;
    useEffect(() => {
        console.log(projectId);
    
        const stringURLListaHerramientas = `http://localhost:8080/api/herramientas/${projectId}/listarHerramientasDeProyecto`;
        
    
        axios.get(stringURLListaHerramientas)
            .then(function (response) {
                const herramientas = response.data.herramientas;
    
                // Itera sobre las herramientas para encontrar la que tiene idHerramienta igual a 13
                for (const herramienta of herramientas) {
                    if (herramienta.idHerramienta === 13) {
                        idHerramientaCreada = herramienta.idHerramientaCreada;
                        console.log("idPresupuesto es:", idHerramientaCreada);
                        flag = 1;
                        break; // Puedes salir del bucle si has encontrado la herramienta
                    }
                }
    
            
                if (flag === 1) {
    
                    // Aquí encadenamos el segundo axios
                    const stringURLListarPresupuesto = "http://localhost:8080/api/proyecto/presupuesto/listarPresupuesto/"+idHerramientaCreada;
                    axios.get(stringURLListarPresupuesto)
                        .then(response => {
                            const presupuesto = response.data.presupuesto;
                            if (presupuesto[0] && parseFloat(presupuesto[0].presupuestoInicial) === 0.00) {
                                console.log("Presupuesto Nuevo");
                                onOpen();
                            } else {
                                console.log("Si tiene presupuesto inicial");
                            }
                        })
                        .catch(error => {
                            console.error("Error al llamar a la API:", error);
                        });
                }
            });
    }, []);
    


    const [selectedMoneda, setselectedMoneda] = useState("");
    const handleSelectedValueMoneda = (value) => {
        setselectedMoneda(value);
    };

    const [monto, setMonto] = useState("");



    function modificarPresupuesto() {
        return new Promise((resolve, reject) => {
            const stringUrlmodificaPresupuesto = `http://localhost:8080/api/proyecto/presupuesto/modificarPresupuesto`;
            const stringURLListaHerramientas = `http://localhost:8080/api/herramientas/${projectId}/listarHerramientasDeProyecto`;
    
            axios.get(stringURLListaHerramientas)
                .then(function (response) {
                    const herramientas = response.data.herramientas;
                    let idPresupuestoCreado;
    
                    // Itera sobre las herramientas para encontrar la que tiene idHerramienta igual a 13
                    for (const herramienta of herramientas) {
                        if (herramienta.idHerramienta === 13) {
                            idPresupuestoCreado = herramienta.idHerramientaCreada;
                            console.log("idPresupuesto es:", idPresupuestoCreado);
                            break; // Puedes salir del bucle si has encontrado la herramienta
                        }
                    }
    
                    const data = {
                        idMoneda: selectedMoneda,
                        presupuestoInicial: parseFloat(monto),
                        cantidadMeses: 3,
                        idPresupuesto: idPresupuestoCreado
                    };
    
                    axios.put(stringUrlmodificaPresupuesto, data)
                        .then(response => {
                            console.log(response.data.message); // Debería mostrar "Presupuesto modificado"
                            console.log("Presupuesto SI Modificado");
                            resolve(response);
                        })
                        .catch(error => {
                            console.error('Error al modificar el presupuesto:', error);
                            reject(error);
                        });
                });
        });
    }

    const nuevoPresupuestoInicial = () => {
        toast.promise(modificarPresupuesto, {
            loading: "Registrando nuevo presupuesto...",
            success: (data) => {
                return "El presupuesto se agregó con éxito!";
            },
            error: "Error al agregar presupuesto",
            position: "bottom-right",
        });
    };


    const [filterValue, setFilterValue] = React.useState("");

    useEffect(()=>{setIsLoadingSmall(false)},[])
    return (
        //Presupuesto/Ingreso
        <div className="mainDivPresupuesto">

            <Toaster richColors closeButton={true}/>

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
                                nuevoPresupuestoInicial();
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
                                                        <span className="text-default-400 text-small">
                                                            {selectedMoneda === 2 ? "S/" : selectedMoneda === 1 ? "$" : " "}
                                                        </span>
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
                                            onPress={volverMainDashboard}
                                            
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



