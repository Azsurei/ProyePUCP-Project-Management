import { set } from "date-fns";
import React from "react";
import { useEffect , useState, useContext} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { SmallLoadingScreen } from "@/app/dashboard/[project]/layout";
import MyCombobox from "@/components/ComboBox";
import { Select, SelectItem, Textarea } from "@nextui-org/react";
import axios from "axios";
axios.defaults.withCredentials = true;
export default function EditEstimacion({modal, idLineaEstimacion, descripcionEstimacionCosto, tarifaEstimacion, estimacionCosto, cantidadRecurso, mesesEstimacion, idMonedaEstimacion, fechaInicio, subtotalEstimacion, refresh}) {
    const [selectedTipoMoneda, setSelectedTipoMoneda] = useState("");
    const [selectedFecha, setSelectedFecha] = useState("");
    const [selectedMonto, setSelectedMonto] = useState("");
    const stringUrlMonedas = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarMonedasTodas`;
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const [selectCantidadRecurso, setSelectCantidadRecurso] = useState("");
    const[selectMeses, setSelectMeses] = useState("");
    const [selectSubtotal, setSelectSubtotal] = useState("");
    const [selectedDescripcion, setSelectedDescripcion] = useState("");

    //const router=userRouter();

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
    const [descripcionEstimacion, setdescripcionEstimacion] = useState("");
    
    
    const handleSelectedValueMoneda = (value) => {
        setselectedMoneda(value);
        setValidTipoMoneda(true);
    };
    const { 
        isOpen: isModalCrearOpen, 
        onOpen: onModalCrear, 
        onOpenChange: onModalCrearChange 
    
    
    } = useDisclosure();

    const [selectedTipo, setselectedTipo] = useState("");
    const [descripcionLinea, setdescripcionLinea] = useState("");

    const [cantRecurso, setcantRecurso] = useState("");
    const [mesesRequerido, setmesesRequerido] = useState("");

    const [monto, setMonto] = useState("");
    const [selectedNombreTransaccion, setSelectedNombreTransaccion] = useState("");
    const [validMonto, setValidMonto] = useState(true);
    const [validCantMeses, setValidCantMeses] = useState(true);
    const [validCantRecurso, setValidCantRecurso] = useState(true);
    const [validTipoMoneda, setValidTipoMoneda] = useState(true);
    const [validDescription, setValidDescription] = useState(true);
    const [validFecha, setValidFecha] = useState(true);
    const msgEmptyField = "Este campo no puede estar vacio";
    

    useEffect(() => {
        setMonto(tarifaEstimacion);
        setSelectedMonto(tarifaEstimacion);
        setSelectedTipoMoneda(idMonedaEstimacion);
        setSelectCantidadRecurso(cantidadRecurso);
        setcantRecurso(cantidadRecurso);
        setSelectMeses(mesesEstimacion);
        setSelectSubtotal(subtotalEstimacion);
        setSelectedDescripcion(descripcionEstimacionCosto);
        setdescripcionLinea(descripcionEstimacionCosto);
        setdescripcionEstimacion(descripcionEstimacionCosto);
        const formattedDate = new Date(fechaInicio).toISOString().split('T')[0];
        setFecha(formattedDate);
        if (modal) {
            setStartModal(true);
            onModalCrear();
          }
        console.log("EditIngreso", subtotalEstimacion);
    }, []); 
    const onSubmit = () => {
        console.log("Que data estoy enviando:", estimacionCosto);
        const putData = {
            idLineaEstimacionCosto: idLineaEstimacion,
            idMoneda: selectedTipoMoneda,
            descripcion: descripcionLinea,
            tarifaUnitaria: monto,
            cantidadRecurso: cantRecurso,
            subtotal: parseFloat(monto*cantRecurso*mesesRequerido).toFixed(2),
            fechaInicio: fecha,
        };
        console.log("Actualizado correctamente");
        console.log(putData);
        axios.put(
                process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/presupuesto/modificarLineaEstimacionCosto",
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
                                                    Editar Estimación
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
                                                                initialName={selectedTipoMoneda===1 ? "Dolar" : "Soles"}
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
                                                                placeholder={selectedMonto}
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
                                                                initialValue={selectedMonto}                                                      
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
                                                                placeholder={selectCantidadRecurso}
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
                                                                initialValue={selectCantidadRecurso}                                                      
                                                            /> 
            
                                                             <Input
                                                                value={mesesRequerido}
                                                                onValueChange={setmesesRequerido}
                                                                placeholder={selectMeses}
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
                                                                initialValue={selectMeses}                                                      
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
                                                            // value={descripcionLinea}
                                                            onValueChange={setdescripcionLinea}
                                                            onChange={() => {
                                                                setValidDescription(true);
                                                            }}
                                                            defaultValue={descripcionEstimacionCosto}
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
            
                                                            onChange={handleChangeFecha} defaultValue={fecha}/>
            
                                                            <Input
                                                                isReadOnly
                                                                type="number"
                                                                placeholder={selectSubtotal}
                                                                value={monto * cantRecurso * mesesRequerido < 0 || cantRecurso === 0 ? 0 : monto * cantRecurso * mesesRequerido}
                                                                startContent={
                                                                    <div className="pointer-events-none flex items-center">
                                                                        <span className="text-default-400 text-small">
                                                                                {selectedMoneda === 2 ? "S/" : selectedMoneda === 1 ? "$" : " "}
                                                                        </span>
                                                                    </div>
                                                                }
                                                                defaultValue={selectSubtotal}
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
                                                    <Button
                                                        color="primary"
                                                        onPress={() => {
                                                            onSubmit();
                                                            onClose();
                                                        }}
                                                        
                                                    >
                                                        Guardar
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