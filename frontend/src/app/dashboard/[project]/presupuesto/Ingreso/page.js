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
import IngresosList from "@/components/dashboardComps/projectComps/presupuestoComps/IngresosList";
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

import {
    dbDateToDisplayDate,
    dbDateToInputDate,
    inputDateToDisplayDate,
} from "@/common/dateFunctions";

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
    const stringUrlMonedas = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarMonedasTodas`;
    const stringUrlTipoIngreso = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarTipoIngresosTodos`;
    const stringUrlTipoTransaccion = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarTipoTransaccionTodos`;
    const stringUrlPrueba = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasIngresoXIdProyecto/100`;
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


    const [activeRefresh, setactiveRefresh] = useState(false);
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




    //Funciones
    

    let idHerramientaCreada;

    function insertarLineaIngreso() {
        return new Promise((resolve, reject) => {
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
                    idTransaccionTipo:selectedTipoTransaccion,
                    idIngresoTipo:selectedTipo,
                    descripcion:descripcionLinea,
                    monto:parseFloat(monto).toFixed(2),
                    cantidad:1,
                    fechaTransaccion:fecha,
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

    const registrarLineaIngreso = async () => {
        try {
            toast.promise(insertarLineaIngreso, {
                loading: "Registrando Ingreso...",
                success: (data) => {
                    DataTable();
                    return "El ingreso se agregó con éxito!";
                    
                },
                error: "Error al agregar ingreso",
                position: "bottom-right",
            });
            
        } catch (error) {
            throw error; // Lanza el error para que se propague
        } 
    };





    //Validciones

    const [validMonto, setValidMonto] = useState(true);
    const [validTipoMoneda, setValidTipoMoneda] = useState(true);
    const [validDescription, setValidDescription] = useState(true);
    const [validTipoIngreso, setValidTipoIngreso] = useState(true);
    const [validTipoTransacc, setValidTipoTransacc] = useState(true);
    const [validFecha, setValidFecha] = useState(true);
    const [filtrarFecha, setFiltrarFecha] = useState(false);
    const msgEmptyField = "Este campo no puede estar vacio";

    // Fin Validaciones


    const [selectedMoneda, setselectedMoneda] = useState("");
    const [descripcionLinea, setdescripcionLinea] = useState("");
    
    
    const handleSelectedValueMoneda = (value) => {
        setselectedMoneda(value);
        setValidTipoMoneda(true);
    };

    const [selectedTipo, setselectedTipo] = useState("");
    
    const handleSelectedValueTipo = (value) => {
        setselectedTipo(value);
        setValidTipoIngreso(true);
    };

    const [selectedTipoTransaccion, setselectedTipoTransacciono] = useState("");
    
    const handleSelectedValueTipoTransaccion = (value) => {
        setselectedTipoTransacciono(value);
        setValidTipoTransacc(true)
    };

    const onClear = React.useCallback(() => {
        setFilterValue("");
    }, []);

    const [monto, setMonto] = useState("");
    
    const [lineasIngreso, setLineasIngreso] = useState([]);

    const DataTable = async () => {
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasIngresoXIdPresupuesto/${presupuestoId}`);
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

        
    useEffect(() => {
    
        DataTable();
      }, [presupuestoId]);
    const hasSearchFilter = Boolean(filterValue);
    // const filteredItems = React.useMemo(() => {
    //     let filteredTemplates = [...lineasIngreso]

    //     if (hasSearchFilter) {
    //         filteredTemplates = filteredTemplates.filter((item) =>
    //         item.descripcion.toLowerCase().includes(filterValue.toLowerCase())
    //         );
    //     }

    //     return filteredTemplates;
    // }, [lineasIngreso, filterValue]);
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
                    <BreadcrumbsItem href="" text="Ingresos" />

                </Breadcrumbs>

                <div className="presupuesto">
                    <div className="titlePresupuesto">Ingresos</div>

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

                    </div>
                    <div className="divFiltroPresupuesto">
                        <Input
                            isClearable
                            className="w-2/4 sm:max-w-[50%]"
                            placeholder="Buscar Ingreso..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={() => onClear("")}
                            onValueChange={onSearchChange}
                            variant="faded"
                        />

                    <div className="buttonContainer">
                        <Button  onPress={onModalFecha} color="primary" startContent={<TuneIcon />} className="btnFiltro">
                            Filtrar
                        </Button>

                        <Button onPress={onModalCrear} color="primary" startContent={<PlusIcon />} className="btnAddIngreso">
                            Agregar
                        </Button>
                       
                        </div>
                    </div>
                    <div className="divListaIngreso">
                        <IngresosList lista = {filteredItems} refresh ={DataTable}></IngresosList>
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
                                    console.log("aqui 1");
                                }

                                if(descripcionLinea===""){
                                    setValidDescription(false);
                                    Isvalid = false;
                                }

                                if(selectedTipoTransaccion===""){
                                    setValidTipoTransacc(false);
                                    Isvalid = false;
                                }
                                if(selectedTipo===""){
                                    setValidTipoIngreso(false);
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
                                        await registrarLineaIngreso();
                                        setMonto("");
                                        setdescripcionLinea("");
                                        setselectedMoneda("");
                                        setselectedTipo("");
                                        setselectedTipoTransacciono("");
                                        setFecha("");
                                        setValidTipoMoneda(true);
                                        setValidMonto(true);
                                        setValidDescription(true);
                                        setValidTipoIngreso(true);
                                        setValidTipoTransacc(true);
                                        setValidFecha(true);

                                        
                                    } catch (error) {
                                        console.error('Error al registrar la línea de ingreso o al obtener los datos:', error);
                                    }

                                    onClose();
                                
                                }
                            };
                            return (
                                <>
                                    <ModalHeader className="flex flex-col gap-1" 
                                        style={{ color: "#000", fontFamily: "Montserrat", fontSize: "16px", fontStyle: "normal", fontWeight: 600 }}>
                                        Nuevo Ingreso
                                    </ModalHeader>
                                    <ModalBody>
                                        <p className="textIngreso">Monto Recibido</p>
                                        
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

                                         <p className="textIngreso">Tipo Ingreso</p>
                                


                                         <div className="comboBoxTipo">
                                            
                                            <MyCombobox
                                                urlApi={stringUrlTipoTransaccion}
                                                property="tiposTransaccion"
                                                nameDisplay="descripcion"
                                                hasColor={false}
                                                onSelect={handleSelectedValueTipoTransaccion}
                                                idParam="idTransaccionTipo"
                                                initialName="Seleccione Ingreso"
                                                inputWidth="64"
                                                widthCombo="15"
                                            />
                                            <div className="divValidaciones" >
                                            <p className="text-tiny text-danger">            
                                                        {
                                                        !validTipoTransacc
                                                            ? "Seleccione un tipo de Transacción"
                                                            : ""
                                                        }                      
                                            </p>        
                                            </div>

                                        </div>
                                         
                                         
                                        <p className="textIngreso">Tipo Transacción</p>

                                        <div className="comboBoxTipo">
                                            
                                            <MyCombobox
                                                urlApi={stringUrlTipoIngreso}
                                                property="tiposIngreso"
                                                nameDisplay="descripcion"
                                                hasColor={false}
                                                onSelect={handleSelectedValueTipo}
                                                idParam="idIngresoTipo"
                                                initialName="Seleccione Transacción"
                                                inputWidth="64"
                                                widthCombo="15"
                                            />

                                            <div className="divValidaciones" >
                                                <p className="text-tiny text-danger">            
                                                            {
                                                            !validTipoIngreso
                                                                ? "Seleccione un tipo de Ingreso"
                                                                : ""
                                                            }                      
                                                </p>        
                                            </div> 

        

                                        </div>
                                        <p className="textPresuLast">Fecha Transacción</p>
                                                <input type="date" id="inputFechaPresupuesto" name="datepicker" onChange={handleChangeFecha}/>
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
                                                setselectedTipo("");
                                                setselectedTipoTransacciono("");
                                                setFecha("");
                                                setValidTipoMoneda(true);
                                                setValidMonto(true);
                                                setValidDescription(true);


                                                setValidTipoIngreso(true);
                                                setValidTipoTransacc(true);
                                                setValidFecha(true);
                                              }}
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



