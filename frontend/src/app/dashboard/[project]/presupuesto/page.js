"use client"
import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import MyCombobox from "@/components/ComboBox";
import "@/styles/dashboardStyles/projectStyles/presupuesto/presupuesto.css";
import TableBudget from "@/components/TableBudget";
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
    Switch,
  } from "@nextui-org/react";


import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { Sol } from "public/icons/Sol";
import { SmallLoadingScreen } from "../layout";
import {ExportIcon} from "@/../public/icons/ExportIcon";
import { set } from "date-fns";



export default function Presupuesto(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const stringUrlMonedas = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarMonedasTodas`;
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
    const [validMonto, setValidMonto] = useState(true);
    const [validcantMeses, setValidcantMeses] = useState(true);
    const [presupuestoID, setPresupuestoID] = useState(null);
    const [validTipoMoneda, setValidTipoMoneda] = useState(true);

    let idHerramientaCreada;
    let flag=0;
    useEffect(() => {
        console.log(projectId);
    
        const stringURLListaHerramientas = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/herramientas/${projectId}/listarHerramientasDeProyecto`;
        
    
        axios.get(stringURLListaHerramientas)
            .then(function (response) {
                const herramientas = response.data.herramientas;
    
                // Itera sobre las herramientas para encontrar la que tiene idHerramienta igual a 13
                for (const herramienta of herramientas) {
                    if (herramienta.idHerramienta === 13) {
                        idHerramientaCreada = herramienta.idHerramientaCreada;
                        setPresupuestoId(idHerramientaCreada)
                        console.log("idPresupuesto es:", idHerramientaCreada);
                        flag = 1;
                        break; // Puedes salir del bucle si has encontrado la herramienta
                    }
                }
    
            
                if (flag === 1) {
    
                    // Aquí encadenamos el segundo axios
                    const stringURLListarPresupuesto = process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/presupuesto/listarPresupuesto/"+idHerramientaCreada;
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
        setValidTipoMoneda(true);
        
    };

    const [monto, setMonto] = useState("");
    const [cantMeses,setCantMeses]=useState("");
    const [isSelected, setIsSelected] = React.useState(true);

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
                        presupuestoInicial: parseFloat(monto),
                        cantidadMeses: cantMeses,
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
                    <BreadcrumbsItem href="" text="Presupuesto" />

                </Breadcrumbs>

                <div className="presupuesto">
                    <div className="containerHeader">
                        <div className="titlePresupuesto">Presupuesto</div>
                        <div>
                            <Switch isSelected={isSelected} onValueChange={setIsSelected}>
                                 {isSelected ? "Soles" : "Dolares"}
                            </Switch>  
                        </div>
                    </div>
                    

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

                <Modal size='xl' isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} 
                            classNames={{
                                closeButton: "hidden"
                            }}
                >
                <ModalContent>
                        {(onClose) => {
                            const cerrarModal = async() => {

                                let Isvalid = true;
                                if (parseFloat(monto) < 0 || isNaN(parseFloat(monto))) {
                                    setValidMonto(false);
                                    Isvalid = false;
                                
                                }

                                if(parseInt(cantMeses) < 0 || isNaN(parseInt(cantMeses))){
                                    setValidcantMeses(false);
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
                                            <p>Presupuesto Inicial</p>
                                            <p className="cantMeses">Cantidad Meses</p>
                                        </div>
                                        
                                        <div className="modalAddIngreso">
                                            <div className="comboBoxMoneda" style={{width: '9rem'}}>

                                            <MyCombobox
                                                urlApi={stringUrlMonedas}
                                                property="monedas"
                                                nameDisplay="nombre"
                                                hasColor={false}
                                                onSelect={handleSelectedValueMoneda}
                                                idParam="idMoneda"
                                                initialName="Tipo Moneda"
                                                inputWidth="32"
                                                widthCombo="9"
                                            />

                                            </div>


                                           <div style={{ flex: '100%' }}>

                                                <Input
                                                    value={monto}
                                                    onValueChange={setMonto}
                                                    placeholder="0"
                                                    labelPlacement="outside"
                                                    type="number"
                                                    isInvalid={!validMonto}
                                                    onChange={()=>{setValidMonto(true)}}
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
        
                                                    
                                                />
 
                                            </div>

                                            <div style={{ flex: '55%' }}>

                                                    <Input
                                                        type="number"
                                                        value={cantMeses}
                                                        onValueChange={setCantMeses}
                                                        isInvalid={!validcantMeses}
                                                        onChange={()=>{setValidcantMeses(true)}}
                                                        errorMessage={
                                                            !validcantMeses
                                                                ? "Cantidad inválida"
                                                                : ""
                                                        }
                                                        placeholder="0"
                                                        labelPlacement="inside"

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



