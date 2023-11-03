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
import VisibilityIcon from '@mui/icons-material/Visibility';
import EgresosList from "@/components/dashboardComps/projectComps/presupuestoComps/EgresosList";
import { Toaster, toast } from "sonner";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
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
    Switch,
  } from "@nextui-org/react";

import { SearchIcon } from "@/../public/icons/SearchIcon";
import TuneIcon from '@mui/icons-material/Tune';
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { SmallLoadingScreen } from "../../layout";
import AssignmentIcon from '@mui/icons-material/Assignment';
import EstimacionCostoList from "@/components/dashboardComps/projectComps/presupuestoComps/EstimacionCostoList";
import { set } from "date-fns";
export const UserCardsContextOne = React.createContext();

export default function Egresos(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const [isSelected, setIsSelected] = useState(false);
    const stringUrlMonedas = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarMonedasTodas`;
    const [presupuestoId, setPresupuestoId] = useState("");
    //const router=userRouter();

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
              console.log(`Esta es el id presupuesto:`, data);
                console.log(`Datos obtenidos exitosamente:`, response.data.presupuesto);
            } catch (error) {
              console.error('Error al obtener el presupuesto:', error);
            }
          };
            fetchData();
    }, []);
    //const router=userRouter();

    const onSearchChange = (value) => {
        if(value) {
            setFilterValue(value);
            
        } else {
            setFilterValue("");
            
        }
    };

    const onSearchChange2 = (value) => {
        if(value) {
            setFilterEgreso(value);
        } else {
            setFilterEgreso("");
        }
    };

    const [filterValue, setFilterValue] = React.useState("");
    const [filterEgreso, setFilterEgreso] = React.useState("");


    useEffect(()=>{setIsLoadingSmall(false)},[])

    
    // Modales    
    const { 
        isOpen: isModalCrearOpen, 
        onOpen: onModalCrear, 
        onOpenChange: onModalCrearChange 
    
    
    } = useDisclosure();
    const {
        isOpen: isModalFechaOpen,
        onOpen: onModalFecha,
        onOpenChange: onModalFechachange,
    } = useDisclosure();

    //Fin Modales

    const [fecha, setFecha] = useState("");

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

    //No es prioridad filtro fecha por ahora
    
    //Validciones
    const [cardSelected, setCardSelected] = useState(false);

    const [validMontoReal, setValidMontoReal] = useState(true);
    const [validCantRecurso, setValidCantRecurso] = useState(true);
    const [validDescription, setValidDescription] = useState(true);
    const [validFecha, setValidFecha] = useState(true);
    const msgEmptyField = "Este campo no puede estar vacio";
    
    // Fin Validaciones

    const [descripcionLinea, setdescripcionLinea] = useState("");
    const [montoReal, setMontoReal] = useState("");
    const [montoEgreso, setMontoEgreso] = useState("");
    const [cantRecurso, setcantRecurso] = useState("");

    const [listEstimacionesSelect, setlistEstimacionesSelected] = useState([]);

    const addEstimacionesList = (lineasEstimacion) => {
        setlistEstimacionesSelected([
            lineasEstimacion
        ]);
    };

    const removeEstimacionesInList = (lineasEstimacion) => {
        const newEstimacionList = listEstimacionesSelect.filter(
            (item) => item.idLineaEstimacion !== lineasEstimacion.idLineaEstimacion
        );
        setlistEstimacionesSelected(newEstimacionList);
        console.log(newEstimacionList);
    };

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setFilterEgreso("");
    }, []);

    const data = [
        {
            idLineaEgreso: 1,
            descripcion: "Licencia de Software",
            costoReal: 1000,
            fechaRegistro: "2021-10-10",
            cantidad: 1,
            idMoneda: 1,
            nombreMoneda: "Dolar",
        }
    ];


    function insertatLineaEgreso() {
        return new Promise((resolve, reject) => {
        let flag=0;
        const stringUrlTipoTransaccion = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/insertarLineaEgreso`;
        
        console.log(projectId);
        const stringURLListaHerramientas=process.env.NEXT_PUBLIC_BACKEND_URL+"/api/herramientas/"+projectId+"/listarHerramientasDeProyecto";
        

        let idHerramientaCreada;

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

            /*
            Funcion que me traiga el id de la estimacion de costo

            */

            if(flag===1){
                axios.post(stringUrlTipoTransaccion, {

                    idPresupuesto:idHerramientaCreada,
                    idProyecto: projectId,

                    idMoneda: dataLineaEstimacion.idMoneda,
                    idLineaEstimacionCosto: dataLineaEstimacion.idLineaEstimacion,

                    descripcion:descripcionLinea,
                    costoReal: parseFloat(dataLineaEstimacion.tarifaUnitaria * cantRecurso).toFixed(2),
                    cantidad: cantRecurso,
                    fechaRegistro:fecha,
                })
        
                .then(function (response) {
                    console.log(response);
                    console.log("Egreso Ingresado");
                    //DataTable();
                    resolve(response);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                });
            }else{
                console.log("No se encontró la herramienta");
            }
            

        })
        .catch(function (error) {
            console.error('Error al hacer Listado Herramienta', error);
            reject(error);
        });

        });
    }


    const registrarLineaEgreso = async () => {
        try {
            toast.promise(insertatLineaEgreso, {
                loading: "Registrando Egreso...",
                success: (data) => {
                    DataEgresos();
                    return "El egreso se agregó con éxito!";
                    
                },
                error: "Error al agregar egreso",
                position: "bottom-right",
            });
            
        } catch (error) {
            throw error; // Lanza el error para que se propague
        } 
    };

    const [lineasEstimacion, setLineasEstimacion] = useState([]);
    const [lineasEgreso, setLineasEgreso] = useState([]);
    //Aqui va el data table de Iwa
    
    
    const DataTable = async () => {
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasEstimacionCostoXIdPresupuesto/${presupuestoId}`);
              const data = response.data.lineasEstimacionCosto;
              setLineasEstimacion(data);
              console.log(`Esta es la data:`, data);
                console.log(`Datos obtenidos exitosamente:`, response.data.lineasEstimacionCosto);
            } catch (error) {
              console.error('Error al obtener las líneas de ingreso:', error);
            }
          };
            fetchData();
    };

    const DataEgresos= async () => {
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasEgresoXIdPresupuesto/${presupuestoId}`);
              const data = response.data.lineasEgreso;
              setLineasEgreso(data);
              console.log(`Esta es la data:`, data);
                console.log(`Datos obtenidos exitosamente:`, response.data.lineasEgreso);
            } catch (error) {
              console.error('Error al obtener las líneas de ingreso:', error);
            }
          };
            fetchData();
    };

    const [presupuesto, setPresupuesto] = useState([]);
    const ObtenerPresupuesto = async () => {
        const fetchData = async () => {
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
          };
            fetchData();
    };    
        
    useEffect(() => {
        DataEgresos();
        DataTable();
        ObtenerPresupuesto();   
      }, [presupuestoId]);

    const hasSearchFilter = Boolean(filterValue);
    const hasSearchFilterEgreso = Boolean(filterEgreso);
    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...lineasEstimacion];
    
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
                const itemFechaTimestamp = Date.parse(item.fechaInicio); // Asumiendo que tienes una propiedad 'fecha' en tus objetos.
                return itemFechaTimestamp >= fechaInicioTimestamp && itemFechaTimestamp <= fechaFinTimestamp;
            });
        }
    
        return filteredTemplates;
    }, [lineasEstimacion, filterValue, fechaInicio, fechaFin, filtrarFecha]);
    

    const [dataLineaEstimacion, setDataLineaEstimacion] = useState("");
    const handleCardSelect = (selectedData, isSelect) => {
        // Realiza la lógica deseada con el dato seleccionado
        console.log("Card seleccionado:", selectedData);
        // Puedes actualizar el estado local aquí si es necesario
        if (isSelect) {
            setDataLineaEstimacion(selectedData);
            setCardSelected(true); // Se ha seleccionado un card

        } else {
            setDataLineaEstimacion("");
            setCardSelected(false); // Se ha deseleccionado el card

        }
        
      }
    const filteredEgresos= React.useMemo(() => {
        let filteredEgresos = [...lineasEgreso];
    
        // Filtro de búsqueda
        if (hasSearchFilterEgreso) {
            filteredEgresos = filteredEgresos.filter((item) =>
                item.descripcion.toLowerCase().includes(filterEgreso.toLowerCase())
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
    }, [lineasEgreso, filterEgreso, fechaInicio, fechaFin, filtrarFecha]);
    const handleSelectedMoneda = () => {
        setIsSelected(!isSelected);   
    };
    return (

        
        //Presupuesto/Egreso
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
                    <BreadcrumbsItem href="" text="Egresos" />

                </Breadcrumbs>

                <div className="presupuesto">
                    
                    <div className="containerHeader">
                        <div className="titlePresupuesto">Egresos</div>
                        <div>
                            <Switch isSelected={isSelected} onValueChange={handleSelectedMoneda}>
                                 {isSelected ? "Soles" : "Dolares"}
                            </Switch>  
                        </div>
                    </div>
                    <div className="buttonsPresu">
                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}>
                                <button className="btnCommon btnHistorial sm:w-1 sm:h-1" type="button">Historial</button> 
                        </Link>
                        
                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Ingreso"}>
                                <button className="btnCommon btnIngreso  sm:w-1 sm:h-1"   type="button">Ingresos</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Egresos"}>
                                <button className="btnCommon btnEgreso btnDisabled btnSelected sm:w-1 sm:h-1" disabled type="button">Egresos</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Estimacion"}>
                                <button className="btnCommon btnEstimacion  sm:w-1 sm:h-1"  type="button">Estimacion</button>
                        </Link>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginLeft: 'auto' }}>

                                <Button  onPress={onModalFecha} color="primary" startContent={<TuneIcon />} className="btnFiltro">
                                    Filtrar
                                </Button>
                                
                                <Button onPress={onModalCrear} color="primary" startContent={<AssignmentIcon />} 
                                        isDisabled={!cardSelected} className="btnAddEgreso">
                                        Registrar Egreso
                                </Button>


                        </div>




                    </div>
                    
                    <div className="divFiltroPresupuesto">
                        
                        <Input
                            isClearable
                            className="w-2/4 sm:max-w-[50%]"
                            placeholder="Buscar Partida..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onValueChange={onSearchChange}
                            variant="faded"
                        />
                            <Input
                            isClearable
                            className="w-2/4 sm:max-w-[50%]"
                            placeholder="Buscar Egreso..."
                            startContent={<SearchIcon />}
                            value={filterEgreso}
                            onValueChange={onSearchChange2}
                            variant="faded"
                        />
                         <div className="buttonContainer">

                        </div>
                    </div>
                    <div className="flex">
                        <div className="divListaIngreso w-1/2">
                            <UserCardsContextOne.Provider
                                value={{ addEstimacionesList, removeEstimacionesInList }}
                                >
                                <EstimacionCostoList lista = {filteredItems} refresh = {DataTable} isEdit={false} isSelected = {true} onCardSelect={handleCardSelect} valueMoneda = {isSelected}></EstimacionCostoList>
                            </UserCardsContextOne.Provider>
                            
                        </div>
                        
                        <div className="divListaIngreso w-1/2">

                            <EgresosList lista = {filteredEgresos} refresh ={DataEgresos} valueMoneda = {isSelected}></EgresosList>
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


            <Modal hideCloseButton={false} size='md' isOpen={isModalCrearOpen} onOpenChange={onModalCrearChange} isDismissable={false} >
                <ModalContent >
                        {(onClose) => {
                            const cerrarModal = async () => {

                                let Isvalid = true;

                                if (parseInt(cantRecurso) < 0 || isNaN(parseInt(cantRecurso))) {
                                    setValidCantRecurso(false);
                                    Isvalid = false;
                                }

                                if(descripcionLinea===""){
                                    setValidDescription(false);
                                    Isvalid = false;
                                }

                                if(fecha===""){
                                    setValidFecha(false);
                                    Isvalid = false;
                                }

                                if(Isvalid === true){
                                    try {
                                        await registrarLineaEgreso();
                                    
                                        setdescripcionLinea("");
                                        setFecha("");
                                        setcantRecurso("");

                                        setValidCantRecurso(true);
                                        setValidDescription(true);
                                        setValidFecha(true);
                                        
                                        
                                    } catch (error) {
                                        console.error('Error al registrar la línea de estimación o al obtener los datos:', error);
                                    }
                                    
                                    onClose();
                                
                                }
                            };
                            return (
                                <>
                                    <ModalHeader className="flex flex-col gap-1" 
                                        style={{ color: "#000", fontFamily: "Montserrat", fontSize: "16px", fontStyle: "normal", fontWeight: 600 }}>
                                        Nueva Egreso
                                    </ModalHeader>

                                    <ModalBody>
                      
                                        <p className="textIngreso">Tarifa</p>
                                        
                                        <div className="modalAddIngreso">
                                          
                                                <Input
                                                    isDisabled
                                                    type="number"
                                                    value={dataLineaEstimacion.tarifaUnitaria}
                                                    startContent={
                                                        <div className="pointer-events-none flex items-center">
                                                            <span className="text-default-400 text-small">
                                                                    {dataLineaEstimacion.idMoneda === 2 ? "S/" : dataLineaEstimacion.idMoneda === 1 ? "$" : " "}
                                                            </span>
                                                        </div>
                                                    }
    
                                                    
                                                />                    
                                        </div>

                                                                                
                                        <p className="textIngreso">Descripción</p>

                                        <div className="modalAddIngreso">
                                            

                                            <Textarea
                                                label=""
                                                isInvalid={!validDescription}
                                                errorMessage={!validDescription ? msgEmptyField : ""}
                                                maxLength={35}
                                                variant={"bordered"}
                                                
                                                labelPlacement="outside"
                                                placeholder="Escriba aquí..."
                                                className="max-w-x"
                                                maxRows="2"
                                                
                                                onValueChange={setdescripcionLinea}
                                                onChange={() => {
                                                    setValidDescription(true);
                                                }}
                                                
                                                />
                                         </div>
                                        

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            
                                            }}
                                            >
                                            <p
                                                style={{
                                                color: "#44546F",
                                                fontSize: "16px",
                                                fontStyle: "normal",
                                                fontWeight: 300,
                                                }}
                                            >
                                                Cantidad Recurso
                                            </p>

                                            <p
                                                style={{
                                                color: "#44546F",
                                                fontSize: "16px",
                                                fontStyle: "normal",
                                                fontWeight: 300,
                                                flex: 0.58,
                                                }}
                                            >
                                                {/* Meses Requerido */}
                                            </p>
                                        </div> 

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start", // Alineación en la parte superior

                                                justifyContent: "space-between",
                                                marginTop: "0.5rem",
                                                gap: "4.7rem",
                                                marginBottom: "0.6rem",
                                            }}
                                            >
                                                 <Input
                                                    value={cantRecurso}
                                                    onValueChange={setcantRecurso}
                                                    placeholder={dataLineaEstimacion.cantidadRecurso}
                                                    defaultValue={dataLineaEstimacion.cantidadRecurso}
                                                    labelPlacement="outside"
                                                    isInvalid={!validCantRecurso}
                                                    onChange={()=>{setValidCantRecurso(true)}}
                                                    type="number"
                                                    errorMessage={
                                                        !validCantRecurso
                                                            ? "Cantidad inválida"
                                                            : ""
                                                    }

                                                    endContent={
                                                        <div className="flex items-center">

                                                        </div>
                                                        }                                                      
                                                /> 

                                        </div>                  

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginTop: "0.5rem",
                                            }}
                                            >
                                            <p
                                                style={{
                                                color: "#44546F",
                                                fontSize: "16px",
                                                fontStyle: "normal",
                                                fontWeight: 300,
                                                }}
                                            >
                                                Fecha Registro
                                            </p>

                                            <p
                                                style={{
                                                color: "#44546F",
                                                fontSize: "16px",
                                                fontStyle: "normal",
                                                fontWeight: 300,
                                                flex: 0.66,
                                                }}
                                            >
                                                Costo Real
                                            </p>
                                        </div> 


                                         <div 
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: "2.5rem"
                                            }}>

                                                
                                                <input type="date" id="inputFechaPresupuesto" name="datepicker" 
                                                style={{ width: '18rem' }}

                                                onChange={handleChangeFecha} defaultValue={dataLineaEstimacion.fechaInicio}/>

                                                <Input
                                                    isReadOnly
                                                    type="number"
                                                    placeholder={dataLineaEstimacion.subtotal}
                                                    value={dataLineaEstimacion.tarifaUnitaria * cantRecurso  < 0 || cantRecurso === 0 ? 0 : dataLineaEstimacion.tarifaUnitaria * cantRecurso }
                                                    startContent={
                                                        <div className="pointer-events-none flex items-center">
                                                            <span className="text-default-400 text-small">
                                                                    {dataLineaEstimacion.idMoneda  === 2 ? "S/" : dataLineaEstimacion.idMoneda  === 1 ? "$" : " "}
                                                            </span>
                                                        </div>
                                                    }
                                                    defaultValue={dataLineaEstimacion.subtotal}
                                                />
                                        </div>       
                                    
                                      
                                        <div className="fechaContainer">
                                                <p className="text-tiny text-danger">            
                                                        {
                                                            !validFecha
                                                            ? "Ingrese una fecha válida"
                                                            : ""
                                                        }                      
                                                </p>    
                                        </div>

                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={() => {
                                                onClose(); // Cierra el modal
 
                                                setdescripcionLinea("");
                                                
                                                setcantRecurso("");

                                                setFecha("");

                                                //setValidMonto(true);
                                                setValidDescription(true);
                                                setValidCantRecurso(true);

                                                setValidFecha(true);
                                              }}
                                        >
                                            Cancelar
                                        </Button>
                                        {cantRecurso<0?setcantRecurso(0):""}
                                        <Button
                                            color="primary"
                                            onPress={cerrarModal}
                                            
                                        >
                                            Agregar
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



