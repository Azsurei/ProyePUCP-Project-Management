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
import { set } from "date-fns";


export default function Ingresos(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const stringUrlMonedas = `http://localhost:8080/api/proyecto/presupuesto/listarMonedasTodas`;
    const stringUrlTipoIngreso = `http://localhost:8080/api/proyecto/presupuesto/listarTipoIngresosTodos`;
    const stringUrlTipoTransaccion = `http://localhost:8080/api/proyecto/presupuesto/listarTipoTransaccionTodos`;
    const stringUrlPrueba = `http://localhost:8080/api/proyecto/presupuesto/listarLineasIngresoXIdProyecto/100`;

    //const router=userRouter();

    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    const [filterValue, setFilterValue] = React.useState("");


    useEffect(()=>{setIsLoadingSmall(false)},[])


    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalContentState, setModalContentState] = useState(0);
    //1 es estado de anadir nuevo hito
    //2 es estado de editar hito

    const [fecha, setFecha] = useState("");
    const [activeRefresh, setactiveRefresh] = useState(false);
    const handleChangeFecha = (event) => {
        setFecha(event.target.value);
    };


    const handleChangeFechaInicio = () => {
        const datepickerInput = document.getElementById("inputFechaPresupuesto");
        const selectedDate = datepickerInput.value;
        console.log(selectedDate);
        setFecha(selectedDate);
    }
    
    let idHerramientaCreada;

    function insertarLineaIngreso() {
        return new Promise((resolve, reject) => {
        let flag=0;
        const stringUrlTipoTransaccion = `http://localhost:8080/api/proyecto/presupuesto/insertarLineaIngreso`;
        
        console.log(projectId);
        const stringURLListaHerramientas="http://localhost:8080/api/herramientas/"+projectId+"/listarHerramientasDeProyecto";
        

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
                    monto:parseFloat(monto),
                    cantidad:1,
                    fechaTransaccion:fecha,
                })
        
                .then(function (response) {
                    console.log(response);
                    console.log("Linea Ingresada");
                    resolve(response);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                });
            }else{
                console.log("No se encontró la herramienta");
            }
            DataTable();

        })
        .catch(function (error) {
            console.error('Error al hacer Listado Herramienta', error);
            reject(error);
        });

        });
    }

    const registrarLineaIngreso = async () => {
        // toast.promise(insertarLineaIngreso, {
        //     loading: "Registrando Ingreso...",
        //     success: (data) => {
        //         return "El ingreso se agregó con éxito!";
        //     },
        //     error: "Error al agregar ingreso",
        //     position: "bottom-right",
        // });
        try {
            toast.promise(insertarLineaIngreso, {
                loading: "Registrando Ingreso...",
                success: (data) => {
                    return "El ingreso se agregó con éxito!";
                },
                error: "Error al agregar ingreso",
                position: "bottom-right",
            });
            
        } catch (error) {
            throw error; // Lanza el error para que se propague
        }
    };



    
    const [selectedMoneda, setselectedMoneda] = useState("");
    const [descripcionLinea, setdescripcionLinea] = useState("");
    
    
    const handleSelectedValueMoneda = (value) => {
        setselectedMoneda(value);
    };

    const [selectedTipo, setselectedTipo] = useState("");
    
    const handleSelectedValueTipo = (value) => {
        setselectedTipo(value);
    };

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

        
    useEffect(() => {
    
        DataTable();
      }, [projectId]);
    
    return (

        
        //Presupuesto/Ingreso
        <div className="mainDivPresupuesto">
            <Toaster richColors closeButton={true}/>

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
                        <Button  color="primary" startContent={<TuneIcon />} className="btnFiltro">
                            Filtrar
                        </Button>

                        <Button onPress={onOpen} color="primary" startContent={<PlusIcon />} className="btnAddIngreso">
                            Agregar
                        </Button>
                       
                        </div>
                    </div>
                    <div className="divListaIngreso">
                        <IngresosList lista = {lineasIngreso} refresh ={DataTable}></IngresosList>
                    </div>

                
                </div>

                <Modal hideCloseButton={false} size='md' isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} >
                <ModalContent >
                        {(onClose) => {
                            const cerrarModal = async () => {
                                try {
                                    await registrarLineaIngreso();

                                    
                                } catch (error) {
                                    console.error('Error al registrar la línea de ingreso o al obtener los datos:', error);
                                }

                                onClose();
                                
                                
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

                                        </div>
                                        <p className="textPresuLast">Fecha Transacción</p>
                                                <input type="date" id="inputFechaPresupuesto" name="datepicker" onChange={handleChangeFecha}/>
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



