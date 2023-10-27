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
  } from "@nextui-org/react";

import { SearchIcon } from "@/../public/icons/SearchIcon";
import TuneIcon from '@mui/icons-material/Tune';
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { SmallLoadingScreen } from "../../layout";
import AssignmentIcon from '@mui/icons-material/Assignment';
import EstimacionCostoList from "@/components/dashboardComps/projectComps/presupuestoComps/EstimacionCostoList";
export const UserCardsContextOne = React.createContext();

export default function Ingresos(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const stringUrlMonedas = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarMonedasTodas`;

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
        
    const handleChangeFechaInicioFilter = (event) => {
        setFechaInicio(event.target.value);
    };
        
    const handleChangeFechaFinFilter = (event) => {
        setFechaFin(event.target.value);
    };

    //No es prioridad filtro fecha por ahora
    
    //Validciones

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
                    //DataTable();
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
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasEstimacionCostoXIdProyecto/${projectId}`);
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
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasEgresoXIdProyecto/${projectId}`);
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

        
    useEffect(() => {
        DataEgresos();
        DataTable();
      }, [projectId]);

    const hasSearchFilter = Boolean(filterValue);
    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...lineasEstimacion]

        if (hasSearchFilter) {
            filteredTemplates = filteredTemplates.filter((item) =>
            item.descripcion.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredTemplates;
    }, [lineasEstimacion, filterValue]);
    

    const [dataLineaEstimacion, setDataLineaEstimacion] = useState("");
    const handleCardSelect = (selectedData, isSelect) => {
        // Realiza la lógica deseada con el dato seleccionado
        console.log("Card seleccionado:", selectedData);
        // Puedes actualizar el estado local aquí si es necesario
        if (isSelect) {
            setDataLineaEstimacion(selectedData);
        } else {
            setDataLineaEstimacion("");
        }
        
      }
      
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
                    <div className="titlePresupuesto">Egresos</div>

                    <div className="buttonsPresu">
                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}>
                                <button className="btnCommon btnFlujo  sm:w-1 sm:h-1" type="button">Flujo</button>
                        </Link>

                        <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Historial"}>
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

                        {/* <Button  onPress={onModalFecha} color="primary" startContent={<TuneIcon />} className="btnFiltro">
                            Filtrar
                        </Button> */}
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
                            value={filterValue}
                            onValueChange={onSearchChange}
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
                                <EstimacionCostoList lista = {filteredItems} refresh = {DataTable} isEdit={false} onCardSelect={handleCardSelect}></EstimacionCostoList>
                            </UserCardsContextOne.Provider>
                            
                        </div>
                        
                        <div className="divListaIngreso w-1/2">

                            <EgresosList lista = {lineasEgreso}></EgresosList>
                        </div> 
                    </div>
                    

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <Button onPress={onModalCrear} color="primary" startContent={<AssignmentIcon />} className="btnAddEgreso">
                                Registrar Egreso
                        </Button>

                    </div>

                </div>



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
                                        DataEgresos();
                                        
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
                                                value={dataLineaEstimacion.descripcion}
                                                onValueChange={setdescripcionLinea}
                                                onChange={() => {
                                                    setValidDescription(true);
                                                }}
                                                defaultValue = {dataLineaEstimacion.descripcion}
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



