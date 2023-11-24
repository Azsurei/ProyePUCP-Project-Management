"use client"
import { useState, useEffect, useCallback } from "react";
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
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
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
    Switch,
  } from "@nextui-org/react";

import { SearchIcon } from "@/../public/icons/SearchIcon";
import TuneIcon from '@mui/icons-material/Tune';

import { PlusIcon } from "@/../public/icons/PlusIcon";
import { SmallLoadingScreen } from "../layout";
import { set } from "date-fns";
import { is } from "date-fns/locale";
import { Today } from "@mui/icons-material";
import { differenceInMonths } from 'date-fns';
import TimelineIcon from '@mui/icons-material/Timeline';

export default function Historial(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const [isSelected, setIsSelected] = useState(false);
    const [presupuestoId, setPresupuestoId] = useState("");
    const stringUrlMonedas = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarMonedasTodas`;

    const router = useRouter();

    const volverMainDashboard = () => {
        router.push("/dashboard/" + projectName + "=" + projectId);
    };


    let idHerramientaCreada;
    let flag=0;
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/herramientas/${projectId}/listarHerramientasDeProyecto`);
              const herramientas = response.data.herramientas;
              for (const herramienta of herramientas) {
                if (herramienta.idHerramienta === 13) {
                    idHerramientaCreada = herramienta.idHerramientaCreada;
                    setPresupuestoId(idHerramientaCreada)
                    console.log("idPresupuesto es:", idHerramientaCreada);
                    flag = 1;
                    break; // Puedes salir del bucle si has encontrado la herramienta
                }
            }
            } catch (error) {
              console.error('Error al obtener el presupuesto:', error);
            }

            if (flag === 1) {
    
                // Aquí encadenamos el segundo axios
                const stringURLListarPresupuesto = process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/presupuesto/listarPresupuesto/"+idHerramientaCreada;
                axios.get(stringURLListarPresupuesto)
                    .then(response => {
                        const presupuesto = response.data.presupuesto;
                        if (presupuesto && ( parseFloat(presupuesto.presupuestoInicial) === 0.00 || presupuesto.presupuestoInicial === null)) {
                            console.log("Presupuesto Nuevo");
                            onOpen();
                        } else {
                            console.log(presupuesto.presupuestoInicial);
                            console.log("Si tiene presupuesto inicial");
                        }
                    })
                    .catch(error => {
                        console.error("Error al llamar a la API:", error);
                    });

            }
          };
            fetchData();

         
    }, []);

    //Obtener Fechas de Proyecto
    const [cantidadMesesProject,setcantidadMesesProject]=useState(0);

    const DataTableProyecto = async () => {
        const fetchFechasProyecto = async () => {
                try {
                    const url = process.env.NEXT_PUBLIC_BACKEND_URL +"/api/proyecto/verInfoProyecto/" +projectId;
                    const response = await axios.get(url);

                    const proyecto = response.data.infoProyecto;

                    const fechaInicio = new Date(proyecto.fechaInicio);
                    const fechaFin = new Date(proyecto.fechaFin);

                    console.log("Fecha Inicio"+fechaInicio);
                    console.log("Fecha Fin"+fechaFin);

                    const diferenciaMeses = differenceInMonths(fechaFin, fechaInicio)+1;
                    console.log("Cantidad Meses "+diferenciaMeses);

                    setcantidadMesesProject(diferenciaMeses);

                } catch (error) {
                    console.error("Error al obtener las plantillas:", error);
                }
        
        };
    
        fetchFechasProyecto();
    };

    useEffect(() => {
        DataTableProyecto();
      }, [projectId]);

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

    //Funcion

    const [validMontoInicial, setValidMontoInicial] = useState(true);
    const [validcantMeses, setValidcantMeses] = useState(true);
    const [validTipoMoneda, setValidTipoMoneda] = useState(true);

    const [selectedMoneda, setselectedMoneda] = useState("");
    const handleSelectedValueMoneda = (value) => {
        setIsSelected(!isSelected);
        setselectedMoneda(value);
        setValidTipoMoneda(true);
        
    };

    const [montoInicial,setMontoInicial]=useState("");
    const [cantMeses,setCantMeses]=useState(0);

    function modificarPresupuesto() {
        return new Promise((resolve, reject) => {
            setIsLoadingSmall(true);
            const stringUrlmodificaPresupuesto = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/modificarPresupuesto`;
            const stringURLListaHerramientas = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/herramientas/${projectId}/listarHerramientasDeProyecto`;
    
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
                        presupuestoInicial: parseFloat(montoInicial),
                        cantidadMeses: cantidadMesesProject,
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

                insertarLineaIngreso();
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



    function insertarLineaIngreso() {
        
        let flag=0;
        const stringUrlTipoTransaccion = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/insertarLineaIngreso`;
        
        console.log(projectId);
        const stringURLListaHerramientas=process.env.NEXT_PUBLIC_BACKEND_URL+"/api/herramientas/"+projectId+"/listarHerramientasDeProyecto";
        

        axios.get(stringURLListaHerramientas)
        .then(function (response) {
            const herramientas = response.data.herramientas;
    
            // Itera sobre las herramientas para encontrar la que tiene idHerramienta igual a 13
            for (const herramienta of herramientas) {
                if (herramienta.idHerramienta === 13) {
                    idHerramientaCreada = herramienta.idHerramientaCreada;
                    console.log("idPresupuesto es:", idHerramientaCreada);
                    flag=1;
                    break; // Puedes salir del bucle si has encontrado la herramienta
                }
            }

            if(flag===1){
                axios.post(stringUrlTipoTransaccion, {
                    idProyecto: projectId,
                    idPresupuesto:idHerramientaCreada,
                    idMoneda: selectedMoneda,
                    idTransaccionTipo:1,
                    idIngresoTipo:1,
                    descripcion:"Presupuesto Inicial",
                    monto:parseFloat(montoInicial).toFixed(2),
                    cantidad:1,
                    fechaTransaccion:new Date(),
                })
        
                .then(function (response) {
                    console.log(response);
                    console.log("Linea Ingresada");
                    DataTable();
                    resolve(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            }else{
                console.log("No se encontró la herramienta");
            }
            

        })
        .catch(function (error) {
            console.error('Error al hacer Listado Herramienta', error);
            reject(error);
        });

       
    }

    //Fin Funcion

    const [filterValue, setFilterValue] = React.useState("");


    useEffect(()=>{setIsLoadingSmall(false)},[])


    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    
    const [fecha, setFecha] = useState("");


    const [activeRefresh, setactiveRefresh] = useState(false);
    const handleChangeFecha = (event) => {
        setFecha(event.target.value);
        setValidFecha(true);
    };


    //Filtro Fecha

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
    const onClear = React.useCallback(() => {
        setFilterValue("");
    }, []);

    const [monto, setMonto] = useState("");

    const [lineasIngreso, setLineasIngreso] = useState([]);
    const [lineasEgreso, setLineasEgreso] = useState([]);
    
    const DataTable = async () => {
        const fetchData = async () => {
            if(presupuestoId!==""){
                try {
                const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasIngresoYEgresoXIdPresupuesto/${presupuestoId}`);
                const data = response.data.lineas;
                setLineasIngreso(response.data.lineas.lineasIngreso);
                setLineasEgreso(response.data.lineas.lineasEgreso);
                console.log(`Esta es la data:`, data);
                    console.log(`Datos obtenidos exitosamente:`, response.data.lineasIngreso);
                } catch (error) {
                console.error('Error al obtener las líneas de ingreso:', error);
                }
            
            }
          };
            fetchData();
    };

    const [presupuestoDisponible, setPresupuestoDisponible] = useState(0);
    const totalCalculate = () => {
        const totalI = lineasIngreso.reduce((total, item) => {
            if (isSelected && item.idMoneda === 1) {
              return total + (item.monto * 3.9);
            } else if (!isSelected && item.idMoneda === 2) {
              return total + (item.monto / 3.9);
            } else {
                return total + item.monto;
            }
          }, 0);
        const totalE = lineasEgreso.reduce((total, item) => {
            if (isSelected && item.idMoneda === 1) {
              return total + (item.costoReal * 3.9);
            } else if (!isSelected && item.idMoneda === 2) {
              return total + (item.costoReal / 3.9);
            } else {
                return total + item.costoReal;
            }
          }, 0);
        const porcentaje = totalI ? (((totalI - totalE) / totalI)) * 100 : 0;
        setIngresosTotales(totalI.toFixed(2));
        console.log("Ingresos Totales",totalI);
        setEgresosTotales( totalE.toFixed(2));
        console.log("Egresos totales",totalE);
        setPerformance(porcentaje);
        setPresupuestoDisponible(totalI.toFixed(2) - totalE.toFixed(2));
        console.log("Performance",porcentaje);
    }
    const [presupuesto, setPresupuesto] = useState([]);
    const ObtenerPresupuesto = async () => {
        const fetchData = async () => {
            if(presupuestoId!==""){

                try {
                const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarPresupuesto/${presupuestoId}`);
                const data = response.data.presupuesto;
                setPresupuesto(data);
                if (presupuesto.idMoneda === 1) {
                    setIsSelected(false);
                } else { 
                    setIsSelected(true);
                }
                console.log(`Esta es la data de presupuesto:`, data);
                    console.log(`Datos obtenidos exitosamente:`, response.data.presupuesto);
                } catch (error) {
                console.error('Error al obtener las líneas de ingreso:', error);
            }
            }
        };
            fetchData();
    };        
    useEffect(() => {
        
        ObtenerPresupuesto();
        DataTable();
      }, [presupuestoId]);
      
    useEffect(() => {
        totalCalculate();
    }, [lineasIngreso, lineasEgreso, isSelected]);


    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...lineasIngreso];
    
        // Filtro de búsqueda
        if (hasSearchFilter) {
            filteredTemplates = filteredTemplates.filter((item) =>
                item.descripcion.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
    
        // Filtro por fechas
        if (fechaInicio && fechaFin && filtrarFecha) {
            const fechaInicioTimestamp = Date.parse(fechaInicio);
            const fechaFinTimestamp = Date.parse(fechaFin);
            filteredTemplates = filteredTemplates.filter((item) => {
                const itemFechaTimestamp = Date.parse(item.fechaTransaccion); // Asumiendo que tienes una propiedad 'fecha' en tus objetos.
                return itemFechaTimestamp >= fechaInicioTimestamp && itemFechaTimestamp <= fechaFinTimestamp;
            });
        }
    
        return filteredTemplates;
    }, [lineasIngreso, filterValue, fechaInicio, fechaFin, filtrarFecha]);
    const filteredEgresos= React.useMemo(() => {
        let filteredEgresos = [...lineasEgreso];
    
        // Filtro de búsqueda
        if (hasSearchFilter) {
            filteredEgresos = filteredEgresos.filter((item) =>
                item.descripcion.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
    
        // Filtro por fechas
        if (fechaInicio && fechaFin && filtrarFecha) {
            const fechaInicioTimestamp = Date.parse(fechaInicio);
            const fechaFinTimestamp = Date.parse(fechaFin);
            filteredEgresos = filteredEgresos.filter((item) => {
                const itemFechaTimestamp = Date.parse(item.fechaRegistro); // Asumiendo que tienes una propiedad 'fecha' en tus objetos.
                return itemFechaTimestamp >= fechaInicioTimestamp && itemFechaTimestamp <= fechaFinTimestamp;
            });
        }
    
        return filteredEgresos;
    }, [lineasEgreso, filterValue, fechaInicio, fechaFin, filtrarFecha]);

    const handleSelectedMoneda = () => {
        setIsSelected(!isSelected);   
    };
    const monedaSymbol = !isSelected ? "$" : "S/";
    return (

        
        //Presupuesto/Ingreso
        <div className="mainDivPresupuesto">
                <Toaster 
                    richColors 
                    closeButton={true}
                    toastOptions={{
                        style: { fontSize: "1rem" },
                    }}
                />

                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId}  text={projectName}/>
                    <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}  text="Presupuesto"/>
                    <BreadcrumbsItem href="" text="Historial" />

                </Breadcrumbs>

                <div className="presupuesto">
                    
                    <div className="containerHeader">
                        <div className="titlePresupuesto text-[#172B4D] dark:text-white">Historial</div>
                        <div>
                            <Switch isSelected={isSelected} onValueChange={handleSelectedMoneda}>
                                 {isSelected ? "Soles" : "Dolares"}
                            </Switch>  
                        </div>
                    </div>
                    <div className="buttonsPresu">

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}>
                                <button className="btnCommon btnHistorial btnDisabled btnSelected sm:w-1 sm:h-1" type="button" disabled>Historial</button> 
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




                    </div>
                    <div className="divFiltroPresupuesto">
                        <Input
                            isClearable
                            className="w-2/4 sm:max-w-[50%]"
                            placeholder="Buscar Movimiento..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={() => onClear("")}
                            onValueChange={onSearchChange}
                            variant="faded"
                        />

                    <div className="buttonContainer">

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/FlujoProyectado"}>
                            <Button  color="primary" startContent={<TimelineIcon />} className="btnFlujoPro">
                                Flujo Proyectado
                            </Button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Flujo"}>
                            <Button  color="primary" startContent={<AssessmentIcon />} className="btnAddIngreso">
                                Flujo Real
                            </Button>
                        </Link>

                        <Button  onPress={onModalFecha} color="primary" startContent={<TuneIcon />} className="btnFiltro">
                            Filtrar
                        </Button>

                    </div>
                    </div>
                    <div className="containerData">
                        <div className="divHistorial w-1/2">
                        <HistorialList listaIngresos={filteredItems} listaEgreso = {filteredEgresos} refresh={DataTable} valueMoneda = {isSelected}></HistorialList>

                        </div>
                        <div className="justify-center items-center w-1/2">
                            <Card className="w-[500px] h-[500px] border-none bg-gradient-to-br from-white-500 to-white-500 mx-auto my-auto">
                                <CardHeader>
                                    <p className="titleBalance text-[#172B4D] dark:text-white">Balance</p>
                                </CardHeader>
                                <CardBody className="justify-center items-center my-0 p-0 flex-none">
                                    <CircularProgress
                                        classNames={{
                                        svg: "w-80 h-80 drop-shadow-md",
                                        indicator: "text-green-500",
                                        track: "stroke-current text-red-500",
                                        value: "text-8xl font-semibold text-black dark:text-white",
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
                                            <div className="titleBalanceData text-[#172B4D] dark:text-white" style={{ textAlign: "left" }}>Ingresos: </div>
                                            <div className="titleBalanceData text-[#172B4D] dark:text-white" style={{ textAlign: "right" }}>{monedaSymbol} {IngresosTotales}</div>
                                        </div>
                                        <div className="flex border-t-2 border-gray-500 border-opacity-75" style={{ display: "grid", gridTemplateColumns: "auto auto" }}>
                                            <div className="titleBalanceData text-[#172B4D] dark:text-white" style={{ textAlign: "left" }}>Egresos: </div>
                                            <div className="titleBalanceData text-[#172B4D] dark:text-white" style={{ textAlign: "right" }}>{monedaSymbol} {EgresosTotales}</div>
                                        </div>
                                        <div className="flex border-t-2 border-gray-500 border-opacity-75" style={{ display: "grid", gridTemplateColumns: "auto auto"}}>
                                            <div className="titleBalanceData text-[#172B4D] dark:text-white" style={{ textAlign: "left" }}>Disponible: </div>
                                            <div className="titleBalanceData text-[#172B4D] dark:text-white" style={{ textAlign: "right" }}>{IngresosTotales - EgresosTotales > 0 ? `${monedaSymbol} ${presupuestoDisponible}` : 'Sin fondos disponibles'}</div>
                                        </div>
                                    </div>
                                </div>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>


                
                </div>
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
                            <ModalHeader>Filtra tus ingresos</ModalHeader>

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
 
                
                <Modal size='lg' isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} 
                            classNames={{
                                closeButton: "hidden"
                            }}
                >
                <ModalContent>
                        {(onClose) => {
                            const cerrarModal = async() => {

                                let Isvalid = true;
                                if (parseFloat(montoInicial) < 0 || isNaN(parseFloat(montoInicial))) {
                                    setValidMontoInicial(false);
                                    Isvalid = false;
                                
                                }

                                if(selectedMoneda!==1 && selectedMoneda!==2){
                                    setValidTipoMoneda(false);
                                    Isvalid= false;
                                }

                                if(selectedMoneda===1 || selectedMoneda===2){ 
                                    setValidTipoMoneda(true);
                                
                                }
                                if(Isvalid === true){


                                    
                                    try {
                                        await nuevoPresupuestoInicial();     
    
                                        
                                    } catch (error) {
                                        console.error('Error al registrar la línea de ingreso o al obtener los datos:', error);
                                    }
              
                                    onClose();
                                    setIsLoadingSmall(false);
                                }



                            };
                            return (
                                <>
                                    <ModalHeader className="flex flex-col gap-1" 
                                        style={{ color: "#000", fontFamily: "Montserrat", fontSize: "16px", fontStyle: "normal", fontWeight: 600 }}>
                                        Crear Presupuesto
                                    </ModalHeader>
                                    <ModalBody>
                                        <p className="textIngreso">
                                                Se creará un nuevo presupuesto para el Proyecto
                                        </p>
                                        <span className="nombreProyecto">{" "+projectName}</span>


                                        <div className="modalPresupuestoTitulos">
                                            <p>Moneda</p>
                                            <p className="cantMeses">Presupuesto Inicial</p>
                                        </div>
                                        
                                        <div className="modalAddIngreso">
                                            <div className="comboBoxMoneda" style={{width: '12rem'}}>

                                            <MyCombobox
                                                urlApi={stringUrlMonedas}
                                                property="monedas"
                                                nameDisplay="nombre"
                                                hasColor={false}
                                                onSelect={handleSelectedValueMoneda}
                                                idParam="idMoneda"
                                                initialName="Tipo Moneda"
                                                inputWidth="32"
                                                widthCombo="19"
                                            />

                                            </div>


                                           <div >

                                                <Input
                                                    value={montoInicial}
                                                    onValueChange={setMontoInicial}
                                                    placeholder="0"
                                                    labelPlacement="outside"
                                                    type="number"
                                                    isInvalid={!validMontoInicial}
                                                    onChange={()=>{setValidMontoInicial(true)}}
                                                    errorMessage={
                                                        !validMontoInicial
                                                            ? "Monto inválido"
                                                            : ""
                                                    }
                                                    
                                                    startContent={
                                                        <div className="pointer-events-none flex items-center">
                                                            <span className="text-default-400 text-small">
                                                                {selectedMoneda === 2 ? "S/" : selectedMoneda === 1 ? "$" : " "}
                                                            </span>
                                                        </div>
                                                    }
        
                                                    
                                                />
 
                                            </div>


              
                                            <div className="alertMoneda" >
                                                <p className="text-tiny text-danger">            
                                                    {
                                                        !validTipoMoneda
                                                        ? "Seleccione Moneda"
                                                        : ""
                                                    }                      
                    
                                                </p>                  
                                            </div>   
                                    
                                         </div>

                                    <div>
                                        
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



