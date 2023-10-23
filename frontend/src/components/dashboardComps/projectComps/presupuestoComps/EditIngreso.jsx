import { set } from "date-fns";
import React from "react";
import { useEffect , useState, useContext} from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import { SmallLoadingScreen } from "@/app/dashboard/[project]/layout";
import MyCombobox from "@/components/ComboBox";
import { Select, SelectItem, Textarea } from "@nextui-org/react";
export default function EditIngreso(modal, descripcionLineaIngreso, montoIngreso, idLineaIngreso, idIngresoTipo, idTransaccionTipo, idMonedaIngreso, fechaTransaccionIngreso, refresh) {
    const [selectedTipoMoneda, setSelectedTipoMoneda] = useState("");
    const [selectedTipoIngreso, setSelectedTipoIngreso] = useState("");
    const [selectedTipoTransaccion, setSelectedTipoTransaccion] = useState("");
    const stringUrlMonedas = `http://localhost:8080/api/proyecto/presupuesto/listarMonedasTodas`;
    const stringUrlTipoIngreso = `http://localhost:8080/api/proyecto/presupuesto/listarTipoIngresosTodos`;
    const stringUrlTipoTransaccion = `http://localhost:8080/api/proyecto/presupuesto/listarTipoTransaccionTodos`;
    const stringUrlPrueba = `http://localhost:8080/api/proyecto/presupuesto/listarLineaXIdProyecto/100`;
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
        selectedTipoTransaccion(value);
    };

    const [monto, setMonto] = useState("");
    useEffect(() => {
        setSelectedTipoMoneda(idMonedaIngreso);
        setSelectedTipoIngreso(idIngresoTipo);
        setSelectedTipoTransaccion(idTransaccionTipo);
        if (modal) {
            setStartModal(true);
            onOpen();
          }
        console.log("EditIngreso");
    }, []); 
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
                                                            initialName={selectedTipoMoneda===1 ? "Dolar" : "Soles"}
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
                                                            <span className="text-default-400 text-small">{selectedTipoMoneda===2 ? "S/" : "$"}</span>
                                                            </div>
                                                        }
                                                        endContent={
                                                            <div className="flex items-center">
            
                                                            </div>
                                                            }
                                                            type="number"
                                                        defaultValue = {montoIngreso}
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
                                                            initialName={selectedTipoIngreso}
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
                                                            initialName={selectedTipoTransaccion}
                                                            inputWidth="64"
                                                        />
            
                                                    </div>
                                                    <p className="textPresuLast">Fecha Transacción</p>
                                                            <input type="date" id="inputFechaPresupuesto" name="datepicker" onChange={handleChangeFecha} defaultValue={fechaTransaccionIngreso}/>
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


            )}
        </div>
    )
}