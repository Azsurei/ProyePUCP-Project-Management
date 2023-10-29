import { set } from "date-fns";
import React from "react";
import { useEffect , useState, useContext} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { SmallLoadingScreen } from "@/app/dashboard/[project]/layout";
import MyCombobox from "@/components/ComboBox";
import { Select, SelectItem, Textarea } from "@nextui-org/react";
import axios from "axios";
axios.defaults.withCredentials = true;
export default function EditEgreso({modal, descripcionLineaEgreso, costoRealEgreso, lineaEgreso, idMonedaEgreso, fechaRegistroEgreso, refresh, idLineaEstimacionCosto, cantidadEgreso}) {
    const [selectedTipoMoneda, setSelectedTipoMoneda] = useState("");
    const [selectedEstimacionCosto, setSelectedEstimacionCosto] = useState("");
    const [selectedFecha, setSelectedFecha] = useState("");
    const [selectedMonto, setSelectedMonto] = useState("");
    const [selectedCantidad, setSelectedCantidad] = useState("");
    const [selectedIdEgreso, setSelectedIdEgreso] = useState("");
    const stringUrlMonedas = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarMonedasTodas`;
    const stringUrlTipoIngreso = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarTipoIngresosTodos`;
    const stringUrlTipoTransaccion = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarTipoTransaccionTodos`;
    const stringUrlPrueba = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasIngresoXIdProyecto/100`;
    const [validMontoReal, setValidMontoReal] = useState(true);
    const [validCantRecurso, setValidCantRecurso] = useState(true);
    const [validDescription, setValidDescription] = useState(true);
    const [validFecha, setValidFecha] = useState(true);
    const msgEmptyField = "Este campo no puede estar vacio";
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    //const router=userRouter();
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

    const onSearchChange = (value) => {
        setFilterValue(value);
    };

    const [filterValue, setFilterValue] = React.useState("");


    useEffect(()=>{setIsLoadingSmall(false)},[])


    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [startModal, setStartModal] = useState(false);
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
    const [selectedMoneda, setselectedMoneda] = useState("");
    const [descripcionLinea, setdescripcionLinea] = useState("");
    
    
    const handleSelectedValueMoneda = (value) => {
        setselectedMoneda(value);
    };

   
    const [montoReal, setMontoReal] = useState("");
    const [montoEgreso, setMontoEgreso] = useState("");
    const [cantRecurso, setcantRecurso] = useState("");

    const [monto, setMonto] = useState("");
    const [selectedNombreTransaccion, setSelectedNombreTransaccion] = useState("");
    useEffect(() => {
        setSelectedIdEgreso(lineaEgreso.idLineaEgreso);
        setMonto(costoRealEgreso);
        setSelectedMonto(costoRealEgreso);
        setSelectedTipoMoneda(lineaEgreso.idMoneda);
        setSelectedEstimacionCosto(lineaEgreso.idLineaEstimacionCosto);
        setSelectedCantidad(cantidadEgreso);
        setcantRecurso(cantidadEgreso);
        setdescripcionLinea(descripcionLineaEgreso);
        const formattedDate = new Date(fechaRegistroEgreso).toISOString().split('T')[0];
        setFecha(formattedDate);
        if (modal) {
            setStartModal(true);
            onModalCrear();
          }
        console.log("EditEgreso");
    }, []); 
    const onSubmit = () => {
        console.log("Que data estoy enviando:", lineaEgreso);
        const putData = {
            idLineaEgreso: selectedIdEgreso,
            idMoneda: selectedTipoMoneda,
            idLineaEstimacionCosto: selectedEstimacionCosto,
            descripcion: descripcionLinea,
            costoReal: parseFloat((selectedMonto/selectedCantidad) * cantRecurso).toFixed(2),
            fechaRegistro: fecha,
            cantidad: cantRecurso,
        };
        console.log("Actualizado correctamente");
        console.log("El put data", putData);
        axios.put(
                process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/presupuesto/modificarLineaEgreso",
                putData
            )
            .then((response) => {
                // Manejar la respuesta de la solicitud PUT
                console.log("Respuesta del servidor:", response.data);
                console.log("Actualización correcta");
                const handleRefresh = async () => {
                    refresh();
                    console.log("refreshed");
                  };
                  handleRefresh();
                // Realizar acciones adicionales si es necesario
            })
            .catch((error) => {
                // Manejar errores si la solicitud PUT falla
                console.error("Error al realizar la solicitud PUT:", error);
            });
            
        
    };
    return (
        <div>
            {startModal && (
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
                                                    onSubmit();
                                                
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
                                                                value={(selectedMonto/selectedCantidad).toFixed(2)}
                                                                startContent={
                                                                    <div className="pointer-events-none flex items-center">
                                                                        <span className="text-default-400 text-small">
                                                                                {selectedMoneda === 2 ? "S/" : selectedMoneda === 1 ? "$" : " "}
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
                                                            defaultValue = {descripcionLineaEgreso}
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
                                                                placeholder={selectedCantidad}
                                                                defaultValue={selectedCantidad}
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
            
                                                            onChange={handleChangeFecha} defaultValue={fecha}/>
            
                                                            <Input
                                                                isReadOnly
                                                                type="number"
                                                                placeholder={selectedMonto}
                                                                value={(selectedMonto/selectedCantidad) * cantRecurso  < 0 || cantRecurso === 0 ? 0 : (selectedMonto/selectedCantidad) * cantRecurso }
                                                                startContent={
                                                                    <div className="pointer-events-none flex items-center">
                                                                        <span className="text-default-400 text-small">
                                                                                {selectedMoneda  === 2 ? "S/" : selectedMoneda  === 1 ? "$" : " "}
                                                                        </span>
                                                                    </div>
                                                                }
                                                                defaultValue="0.00"
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


            )}
        </div>
    )
}