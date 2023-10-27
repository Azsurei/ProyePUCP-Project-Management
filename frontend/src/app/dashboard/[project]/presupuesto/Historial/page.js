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
import HistorialList from "@/components/dashboardComps/projectComps/presupuestoComps/HistorialList";
import { Toaster, toast } from "sonner";
import { ExportIcon } from "@/../public/icons/ExportIcon";
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
    CircularProgress,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Chip,
  } from "@nextui-org/react";

import { SearchIcon } from "@/../public/icons/SearchIcon";
import TuneIcon from '@mui/icons-material/Tune';

import { PlusIcon } from "@/../public/icons/PlusIcon";
import { SmallLoadingScreen } from "../../layout";
import { set } from "date-fns";


export default function Ingresos(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const stringUrlPrueba = `http://localhost:8080/api/proyecto/presupuesto/listarLineasIngresoYEgresoXIdProyecto/100`;
    

    //const router=userRouter();
    const [listUsers, setListUsers] = useState([]);

    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [IngresosTotales, setIngresosTotales] = useState(null);
    const [EgresosTotales, setEgresosTotales] = useState(null);
    const [performance, setPerformance] = useState(null);
    const toggleModal = (task) => {
        setSelectedTask(task);
        setModal1(!modal1);
    };
    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    

    const [filterValue, setFilterValue] = React.useState("");


    useEffect(()=>{setIsLoadingSmall(false)},[])


    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalContentState, setModalContentState] = useState(0);
    //1 es estado de anadir nuevo hito
    //2 es estado de editar hito

    


    const stringUrlMonedas = `http://localhost:8080/api/proyecto/presupuesto/listarMonedasTodas`;
    
    const [selectedMoneda, setselectedMoneda] = useState("");

    
    const [descripcionLinea, setdescripcionLinea] = useState("");

    
    const handleSelectedValueMoneda = (value) => {
        setselectedMoneda(value);
    };

    const [inFechaInicio, setInFechaInicio] = useState('');
    const handleChangeFechaInicio = () => {
        const datepickerInput = document.getElementById("inputFechaPresupuesto");
        const selectedDate = datepickerInput.value;
        console.log(selectedDate);
        setInFechaInicio(selectedDate);
    }

    const [selectedTipoTransaccion, setselectedTipoTransacciono] = useState("");
    
    const handleSelectedValueTipoTransaccion = (value) => {
        setselectedTipoTransacciono(value);
    };

    const [monto, setMonto] = useState("");

    const [lineasIngreso, setLineasIngreso] = useState([]);

    const DataTable = async () => {
        const fetchData = async () => {
            try {
              const response = await axios.get(`http://localhost:8080/api/proyecto/presupuesto/listarLineasIngresoXIdProyecto/${projectId}`);
              const data = response.data.lineasIngreso;
              setLineasIngreso(data);
              console.log(`Esta es la data:`, data);
                console.log(`Datos obtenidos exitosamente:`, response.data.lineasIngreso);
            } catch (error) {
              console.error('Error al obtener las líneas de ingreso:', error);
            }
          };
            fetchData();
    };
    const dataEgreso = [
        {
            idLineaEgreso: 1,
            descripcion: "Licencia de Software",
            costoReal: 1000,
            fechaRegistro: "2023-10-15T05:00:00.000Z",
            cantidad: 1,
            idMoneda: 1,
            nombreMoneda: "Dolar",
        }
    ];
    const totalCalculate = () => {
        const totalI = lineasIngreso.reduce((total, item) => total + item.monto, 0);
        const totalE = dataEgreso.reduce((total, item) => total + item.costoReal, 0);
        const porcentaje = (1-((totalI-totalE)/totalI))*100;
        setIngresosTotales(totalI);
        console.log("Ingresos Totales",totalI);
        setEgresosTotales( totalE);
        console.log("Egresos totales",totalE);
        setPerformance(porcentaje);
        console.log("Performance",porcentaje);
    }    
    useEffect(() => {
        
        
        DataTable();
      }, [projectId]);
      
    useEffect(() => {
        totalCalculate();
    }, [lineasIngreso]);

    return (

        
        //Presupuesto/Ingreso
        <div className="mainDivPresupuesto">

                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId}  text={projectName}/>
                    <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}  text="Presupuesto"/>
                    <BreadcrumbsItem href="" text="Historial" />

                </Breadcrumbs>

                <div className="presupuesto">
                    <div className="titlePresupuesto">Historial</div>

                    <div className="buttonsPresu">
                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}>
                                <button className="btnCommon btnFlujo  sm:w-1 sm:h-1" type="button">Flujo</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Historial"}>
                                <button className="btnCommon btnHistorial btnDisabled btnSelected sm:w-1 sm:h-1" disabled type="button">Historial</button> 
                        </Link>
                        
                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Ingreso"}>
                                <button className="btnCommon btnIngreso  sm:w-1 sm:h-1"   type="button">Ingresos</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Egresos"}>
                                <button className="btnCommon btnEgreso sm:w-1 sm:h-1" type="button">Egresos</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Estimacion"}>
                                <button className="btnCommon btnEstimacion  sm:w-1 sm:h-1"  type="button">Estimacion</button>
                        </Link>

                        <Button color="primary" startContent={<ExportIcon />} className="btnExportPresupuesto">
                            Exportar
                        </Button>


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


                       
                        </div>
                    </div>
                    <div className="containerData">
                        <div className="divHistorial w-1/2">
                        <HistorialList listaIngresos={lineasIngreso} listaEgreso = {dataEgreso}></HistorialList>

                        </div>
                        <div className="justify-center items-center w-1/2">
                            <Card className="w-[500px] h-[500px] border-none bg-gradient-to-br from-white-500 to-white-500 mx-auto my-auto">
                                <CardHeader>
                                    <p className="titleBalance">Balance</p>
                                </CardHeader>
                                <CardBody className="justify-center items-center my-0 p-0 flex-none">
                                    <CircularProgress
                                        classNames={{
                                        svg: "w-80 h-80 drop-shadow-md",
                                        indicator: "text-red-500",
                                        track: "stroke-current text-green-500",
                                        value: "text-8xl font-semibold text-black",
                                    }}
                                    value={performance}
                                    strokeWidth={4}
                                    showValueLabel={true}
                                    />
                                </CardBody>
                                <CardFooter className="justify-center items-center p-0 text-center">
                                <div className="text-left textBalance">
                                    <div className="dataBalance ">
                                        <div className="flex border-t-2 border-gray-500 border-opacity-75" style={{ display: "grid", gridTemplateColumns: "auto auto"}}>
                                            <div className="titleBalanceData" style={{ textAlign: "left" }}>Ingresos: </div>
                                            <div className="titleBalanceData" style={{ textAlign: "right" }}>S/ {IngresosTotales}</div>
                                        </div>
                                        <div className="flex border-t-2 border-gray-500 border-opacity-75" style={{ display: "grid", gridTemplateColumns: "auto auto" }}>
                                            <div className="titleBalanceData" style={{ textAlign: "left" }}>Egresos: </div>
                                            <div className="titleBalanceData" style={{ textAlign: "right" }}>S/{EgresosTotales}</div>
                                        </div>
                                        <div className="flex border-t-2 border-gray-500 border-opacity-75" style={{ display: "grid", gridTemplateColumns: "auto auto"}}>
                                            <div className="titleBalanceData" style={{ textAlign: "left" }}>Disponible: </div>
                                            <div className="titleBalanceData" style={{ textAlign: "right" }}>{IngresosTotales - EgresosTotales > 0 ? `S/ ${IngresosTotales - EgresosTotales}` : 'Sin fondos disponibles'}</div>
                                        </div>
                                    </div>
                                </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>


                
                </div>

                <Modal size='md' isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                <ModalContent>
                        {(onClose) => {
                            const cerrarModal = () => {
                                //insertarLineaIngreso();
                                onClose();
                            };
                            return (
                                <>
                                    <ModalHeader className="flex flex-col gap-1" 
                                        style={{ color: "#000", fontFamily: "Montserrat", fontSize: "16px", fontStyle: "normal", fontWeight: 600 }}>
                                        Nueva Estimación
                                    </ModalHeader>
                                    <ModalBody>
                                        <p className="textIngreso">Tarifa</p>
                                        
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
                                        <p className="textIngreso">Descripción</p>

                                        <div className="modalAddIngreso">
                                            

                                        <Textarea
                                            label=""
                                            labelPlacement="outside"
                                            placeholder=""
                                            className="max-w-x"
                                            maxRows="2"
                                            onValueChange={setdescripcionLinea}
                                            />
                                         </div>

                                         <p className="textIngreso">Tipo Ingreso</p>
                                    


                                       
                                        <p className="textPresuLast">Fecha Transacción</p>
                                                <input type="date" id="inputFechaPresupuesto" name="datepicker" onChange={handleChangeFechaInicio}/>
                                        <div className="fechaContainer">
 
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



