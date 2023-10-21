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
    

    //const router=userRouter();
    const [listUsers, setListUsers] = useState([]);

    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    const [modal1, setModal1] = useState(false);

    const [filterValue, setFilterValue] = React.useState("");


    useEffect(()=>{setIsLoadingSmall(false)},[])


    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalContentState, setModalContentState] = useState(0);
    //1 es estado de anadir nuevo hito
    //2 es estado de editar hito

    
    const insertarLineaIngreso = () => {
        const stringUrlTipoTransaccion = `http://localhost:8080/api/proyecto/presupuesto/insertarLineaIngreso`;

        console.log(projectId);

        axios.post(stringUrlTipoTransaccion, {
            idProyecto: projectId,
            idMoneda: selectedMoneda,
            idTransaccionTipo:selectedTipoTransaccion,
            idIngresoTipo:selectedTipo,
            descripcion:descripcionLinea,
            monto:parseFloat(monto),
            cantidad:1,
            fechaTransaccion:selectedDate,
        })

        .then(function (response) {
            console.log(response);
            console.log("Linea Ingresada");
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const stringUrlMonedas = `http://localhost:8080/api/proyecto/presupuesto/listarMonedasTodas`;
    const stringUrlTipoIngreso = `http://localhost:8080/api/proyecto/presupuesto/listarTipoIngresosTodos`;
    const stringUrlTipoTransaccion = `http://localhost:8080/api/proyecto/presupuesto/listarTipoTransaccionTodos`;
    
    const [selectedMoneda, setselectedMoneda] = useState("");

    
    const [descripcionLinea, setdescripcionLinea] = useState("");

    
    const handleSelectedValueMoneda = (value) => {
        setselectedMoneda(value);
    };

    const [selectedTipo, setselectedTipo] = useState("");
    
    const handleSelectedValueTipo = (value) => {
        setselectedTipo(value);
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

    const data = [
        {
            id: 1,
            tipoIngreso: 'Ingreso por Efectivo',
            tipoPago: 'Pago de Cliente',
            montoIngreso: 'S/ 1000.00',
            horaIngreso: '12:00 PM',
        },
        {
            id: 2,
            tipoIngreso: 'Ingreso por Transferencia',
            tipoPago: 'Donacion',
            montoIngreso: 'S/ 1000.00',
            horaIngreso: '12:00 PM',
        },
        
    ];
    
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
                        <Button  color="primary" startContent={<TuneIcon />} className="btnFiltro">
                            Filtrar
                        </Button>

                        <Button onPress={onOpen} color="primary" startContent={<PlusIcon />} className="btnAddIngreso">
                            Agregar
                        </Button>
                       
                        </div>
                    </div>
                    <div className="divListaIngreso">
                        <IngresosList lista = {data}></IngresosList>
                        <IngresosList lista = {data}></IngresosList>
                        <IngresosList lista = {data}></IngresosList>
                        <IngresosList lista = {data}></IngresosList>
                    </div>

                
                </div>

                <Modal size='md' isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
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
                                        



                                         <div className="comboBoxTipo">
                                            
                                            <MyCombobox
                                                urlApi={stringUrlTipoTransaccion}
                                                property="tiposTransaccion"
                                                nameDisplay="descripcion"
                                                hasColor={false}
                                                onSelect={handleSelectedValueTipoTransaccion}
                                                idParam="idTransaccionTipo"
                                                initialName="Seleccione Transaccion"
                                                inputWidth="64"
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
                                                initialName="Seleccione Ingreso"
                                                inputWidth="64"
                                            />

                                        </div>
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



