import { set } from "date-fns";
import React from "react";
import { useEffect , useState, useContext} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { SmallLoadingScreen } from "@/app/dashboard/[project]/layout";
import MyCombobox from "@/components/ComboBox";
import { Select, SelectItem, Textarea } from "@nextui-org/react";
import axios from "axios";
axios.defaults.withCredentials = true;
export default function EditIngreso({modal, descripcionLineaIngreso, montoIngreso, lineaIngreso, idIngresoTipo, nombreIngresoTipo, idTransaccionTipo, nombreTransaccionTipo, idMonedaIngreso, fechaTransaccionIngreso, refresh}) {
    const [selectedTipoMoneda, setSelectedTipoMoneda] = useState("");
    const [selectedTipoIngreso, setSelectedTipoIngreso] = useState("");
    const [selectedTipoTransaccion, setSelectedTipoTransaccion] = useState("");
    const [selectedFecha, setSelectedFecha] = useState("");
    const [selectedMonto, setSelectedMonto] = useState("");
    const stringUrlMonedas = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarMonedasTodas`;
    const stringUrlTipoIngreso = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarTipoIngresosTodos`;
    const stringUrlTipoTransaccion = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarTipoTransaccionTodos`;
    const stringUrlPrueba = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasIngresoXIdProyecto/100`;
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
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
    const [descripcionLinea, setdescripcionLinea] = useState("");
    
    
    const handleSelectedValueMoneda = (value) => {
        setselectedMoneda(value);
    };

    const [selectedTipo, setselectedTipo] = useState("");
    
    const handleSelectedValueTipo = (value) => {
        setselectedTipo(value);
    };

    
    
    const handleSelectedValueTipoTransaccion = (value) => {
        setSelectedTipoTransaccion(value);
    };

    const [monto, setMonto] = useState("");
    const [selectedNombreTransaccion, setSelectedNombreTransaccion] = useState("");
    useEffect(() => {
        setMonto(montoIngreso);
        setselectedTipo(idIngresoTipo);
        setSelectedMonto(montoIngreso);
        setSelectedTipoMoneda(idMonedaIngreso);
        setSelectedTipoIngreso(nombreIngresoTipo);
        setSelectedTipoTransaccion(idTransaccionTipo);
        setSelectedNombreTransaccion(nombreTransaccionTipo);
        setdescripcionLinea(descripcionLineaIngreso);
        const formattedDate = new Date(fechaTransaccionIngreso).toISOString().split('T')[0];
        setFecha(formattedDate);
        if (modal) {
            setStartModal(true);
            onOpen();
          }
        console.log("EditIngreso");
    }, []); 
    const onSubmit = () => {
        console.log("Que data estoy enviando:", lineaIngreso);
        const putData = {
            idLineaIngreso: lineaIngreso.idLineaIngreso,
            idMoneda: selectedTipoMoneda,
            idTransaccionTipo: selectedTipoTransaccion,
            idIngresoTipo: selectedTipo,
            descripcion: descripcionLinea,
            monto: monto,
            cantidad: 1,
            fechaTransaccion: fecha,
        };
        console.log("Actualizado correctamente");
        console.log(putData);
        axios.put(
                process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/presupuesto/modificarLineaIngreso",
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
                            <Modal size='md' isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                            <ModalContent>
                                    {(onClose) => {
                                        const cerrarModal = async () => {
                                            try {
                                                // await registrarLineaIngreso();
                                                // await DataTable();
                                            } catch (error) {
                                                console.error('Error al registrar la línea de ingreso o al obtener los datos:', error);
                                            }
                                            onClose();
                                        };
                                        return (
                                            <>
                                                <ModalHeader className="flex flex-col gap-1" 
                                                    style={{ color: "#000", fontFamily: "Montserrat", fontSize: "16px", fontStyle: "normal", fontWeight: 600 }}>
                                                    Editar Ingreso
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
                                                            initialName={selectedTipoMoneda===1 ? "Dolar" : "Soles"}
                                                            inputWidth="2/3"
                                                            widthCombo="9"
                                                        />
            
                                                        </div>
                                                    
                                                        <Input
                                                        value={monto}
                                                        onValueChange={setMonto}
                                                        // placeholder="0.00"
                                                        placeholder={selectedMonto}
                                                        labelPlacement="outside"
                                                        startContent={
                                                            <div className="pointer-events-none flex items-center">
                                                            <span className="text-default-400 text-small">{selectedTipoMoneda===2 ? "S/" : "$"}</span>
                                                            </div>
                                                        }
                                                        endContent={
                                                            <div className="flex items-center">
            
                                                            </div>
                                                            }
                                                            type="number"
                                                        initialValue={selectedMonto}
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
                                                        defaultValue = {descripcionLineaIngreso}
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
                                                            initialName={selectedNombreTransaccion}
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
                                                            initialName={selectedTipoIngreso}
                                                            inputWidth="64"
                                                            widthCombo="15"
                                                        />
            
                                                    </div>
                                                    <p className="textPresuLast">Fecha Transacción</p>
                                                            <input type="date" id="inputFechaPresupuesto" name="datepicker" onChange={handleChangeFecha} defaultValue={fecha}/>
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