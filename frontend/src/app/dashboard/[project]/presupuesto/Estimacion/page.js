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
import { set } from "date-fns";
import { tr } from "date-fns/locale";
import EstimacionCostoList from "@/components/dashboardComps/projectComps/presupuestoComps/EstimacionCostoList";

export default function EstimacionCosto(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const stringUrlMonedas = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarMonedasTodas`;
    const [isSelected, setIsSelected] = useState(false);
    const [presupuestoId, setPresupuestoId] = useState("");
    //const router=userRouter();

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

    const [filterValue, setFilterValue] = React.useState("");


    useEffect(()=>{setIsLoadingSmall(false)},[])

    
    // Modales
    const {
        isOpen: isModalFechaOpen,
        onOpen: onModalFecha,
        onOpenChange: onModalFechachange,
    } = useDisclosure();

    
    const { 
        isOpen: isModalCrearOpen, 
        onOpen: onModalCrear, 
        onOpenChange: onModalCrearChange 
    
    
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
        
    
    //Funciones

    let idHerramientaCreada;
    let flag=0;
    function insertarLineaEstimacion() {
        return new Promise((resolve, reject) => {
        let flag=0;
        const stringUrlTipoTransaccion = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/insertarLineaEstimacionCosto`;
        
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
                    idMoneda: selectedMoneda,
                    idPresupuesto:idHerramientaCreada,
                    idProyecto: projectId,
                    descripcion:descripcionLinea,
                    tarifaUnitaria: monto,
                    //Se añade tiempoRequerido
                    tiempoRequerido:mesesRequerido,
                    cantidadRecurso: cantRecurso,
                    subtotal:parseFloat(monto*cantRecurso*mesesRequerido).toFixed(2),
                    fechaInicio:fecha,
                })
        
                .then(function (response) {
                    console.log(response);
                    console.log("Linea Ingresada");
                    DataTable();
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


    //Toast
    const registrarLineaEstimacion = async () => {
        try {
            toast.promise(insertarLineaEstimacion, {
                loading: "Registrando Estimación...",
                success: (data) => {
                    //DataTable();
                    return "La estimación se agregó con éxito!";
                    
                },
                error: "Error al agregar estimación",
                position: "bottom-right",
            });
            
        } catch (error) {
            throw error; // Lanza el error para que se propague
        } 
    };


    //Validciones

    const [validMonto, setValidMonto] = useState(true);
    const [validCantMeses, setValidCantMeses] = useState(true);
    const [validCantRecurso, setValidCantRecurso] = useState(true);
    const [validTipoMoneda, setValidTipoMoneda] = useState(true);
    const [validDescription, setValidDescription] = useState(true);
    const [validFecha, setValidFecha] = useState(true);
    const msgEmptyField = "Este campo no puede estar vacio";
    
    // Fin Validaciones


    const [selectedMoneda, setselectedMoneda] = useState("");
    const [descripcionLinea, setdescripcionLinea] = useState("");

    
    const handleSelectedValueMoneda = (value) => {
        setselectedMoneda(value);
        setValidTipoMoneda(true);
    };

    //onClear
    const onClear = React.useCallback(() => {
        setFilterValue("");
    }, []);



    const [monto, setMonto] = useState("");
    const [cantRecurso, setcantRecurso] = useState("");
    const [mesesRequerido, setmesesRequerido] = useState("");


    const [lineasEstimacion, setLineasEstimacion] = useState([]);

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
        ObtenerPresupuesto();
        DataTable();
      }, [presupuestoId]);
    const hasSearchFilter = Boolean(filterValue);
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

    
    const handleSelectedMoneda = () => {
        setIsSelected(!isSelected);   
    };

    return (

        //Presupuesto/Estimacion
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
                    <BreadcrumbsItem href="" text="Estimacion" />

                </Breadcrumbs>

                <div className="presupuesto">
                    
                    <div className="containerHeader">
                        <div className="titlePresupuesto">Estimacion de Costos</div>
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
                                <button className="btnCommon btnEgreso sm:w-1 sm:h-1" type="button">Egresos</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Estimacion"}>
                                <button className="btnCommon btnEstimacion btnDisabled btnSelected sm:w-1 sm:h-1" disabled type="button">Estimacion</button>
                        </Link>


                    </div>
                    <div className="divFiltroPresupuesto">
                        <Input
                            isClearable
                            className="w-2/4 sm:max-w-[50%]"
                            placeholder="Buscar Estimación..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={() => onClear("")}
                            onValueChange={onSearchChange}
                            variant="faded"
                        />

                    <div className="buttonContainer">

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Estimacion/EstimacionTabla"}>
                            <Button  color="primary" startContent={<VisibilityIcon />} className="btnFiltro">
                                Ver Tabla
                            </Button>
                        </Link>

                        <Button  onPress={onModalFecha} color="primary" startContent={<TuneIcon />} className="btnFiltro">
                            Filtrar
                        </Button>

                        <Button onPress={onModalCrear} color="primary" startContent={<PlusIcon />} className="btnAddIngreso">
                            Agregar
                        </Button>
                       
                        </div>
                    </div>

                    <div className="divListaIngreso">
                        <EstimacionCostoList lista = {filteredItems} refresh ={DataTable} isEdit={true} isSelect = {false} changeMoneda = {handleSelectedMoneda} valueMoneda = {isSelected}></EstimacionCostoList>
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

                                if (parseFloat(monto) < 0 || isNaN(parseFloat(monto))) {
                                    setValidMonto(false);
                                    Isvalid = false;
                                }

                                if (parseInt(cantRecurso) < 0 || isNaN(parseInt(cantRecurso))) {
                                    setValidCantRecurso(false);
                                    Isvalid = false;
                                }

                                if (parseInt(mesesRequerido) < 0 || isNaN(parseInt(mesesRequerido))) {
                                    setValidCantMeses(false);
                                    Isvalid = false;
                                }



                                if(descripcionLinea===""){
                                    setValidDescription(false);
                                    Isvalid = false;
                                }

                                if(selectedMoneda!==1 && selectedMoneda!==2){
                                    setValidTipoMoneda(false);
                                    Isvalid= false;
                                }

                                if(selectedMoneda===1 || selectedMoneda===2){ 
                                    setValidTipoMoneda(true);
                                }

                                if(fecha===""){
                                    setValidFecha(false);
                                    Isvalid = false;
                                }


                                if(Isvalid === true){
                                    try {
                                        await registrarLineaEstimacion();
                                        setMonto("");
                                        setdescripcionLinea("");
                                        setselectedMoneda("");
                                        
                                        setFecha("");

                                        setcantRecurso("");
                                        setmesesRequerido("");

                                        setValidTipoMoneda(true);
                                        setValidMonto(true);

                                        setValidCantRecurso(true);
                                        setValidCantMeses(true);

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
                                                    widthCombo="9"
                                                />
                                                <div className="alertaMonedaIngreso" >
                                                <p className="text-tiny text-danger">            
                                                        {
                                                        !validTipoMoneda
                                                            ? "Seleccione una Moneda"
                                                            : ""
                                                        }                      
                                                    </p>          
                                                </div>
                                            </div>
                                            
                                                <Input
                                                    value={monto}
                                                    onValueChange={setMonto}
                                                    placeholder="0.00"
                                                    labelPlacement="outside"
                                                    isInvalid={!validMonto}
                                                    onChange={()=>{setValidMonto(true)}}
                                                    type="number"
                                                    errorMessage={
                                                        !validMonto
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
                                                Meses Requerido
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
                                                    placeholder="0"
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

                                                 <Input
                                                    value={mesesRequerido}
                                                    onValueChange={setmesesRequerido}
                                                    placeholder="0"
                                                    labelPlacement="outside"
                                                    isInvalid={!validCantMeses}
                                                    onChange={()=>{setValidCantMeses(true)}}
                                                    type="number"
                                                    errorMessage={
                                                        !validCantMeses
                                                            ? "Cantidad Inválida"
                                                            : ""
                                                    }

                                                    endContent={
                                                        <div className="flex items-center">

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
                                                value={descripcionLinea}
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
                                                Fecha Inicio
                                            </p>

                                            <p
                                                style={{
                                                color: "#44546F",
                                                fontSize: "16px",
                                                fontStyle: "normal",
                                                fontWeight: 300,
                                                flex: 0.62,
                                                }}
                                            >
                                                Subtotal
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

                                                onChange={handleChangeFecha}/>

                                                <Input
                                                    isReadOnly
                                                    type="number"
                                                    value={monto * cantRecurso * mesesRequerido < 0 || cantRecurso === 0 ? 0 : monto * cantRecurso * mesesRequerido}
                                                    startContent={
                                                        <div className="pointer-events-none flex items-center">
                                                            <span className="text-default-400 text-small">
                                                                    {selectedMoneda === 2 ? "S/" : selectedMoneda === 1 ? "$" : " "}
                                                            </span>
                                                        </div>
                                                    }
                                                    
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
                                                setMonto("");
                                                setdescripcionLinea("");
                                                setselectedMoneda("");
                                                
                                                setcantRecurso("");
                                                setmesesRequerido("");

                                                setFecha("");
                                                setValidTipoMoneda(true);
                                                setValidMonto(true);
                                                setValidDescription(true);

                                                setValidCantMeses(true);
                                                setValidCantRecurso(true);

                                                setValidFecha(true);
                                              }}
                                        >
                                            Cancelar
                                        </Button>
                                        {mesesRequerido<0?setmesesRequerido(0):""}
                                        {cantRecurso<0?setcantRecurso(0):""}
                                        {monto<0?setMonto(0):""}
                                        
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



