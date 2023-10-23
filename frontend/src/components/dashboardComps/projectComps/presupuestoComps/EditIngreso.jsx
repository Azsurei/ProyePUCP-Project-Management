import React from "react";
export default function EditIngreso(descripcionLineaIngreso, monto, idLineaIngreso, idIngresoTipo, idTransaccionTipo, idMoneda, fechaTransaccion, refresh) {
    return (
        <div>
            <Modal size='md' isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                <ModalContent>
                        {(onClose) => {
                            const cerrarModal = async () => {
                                try {
                                    await registrarLineaIngreso();
                                    await DataTable();
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
                                                initialName="Seleccione Ingreso"
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
                                                initialName="Seleccione Transacción"
                                                inputWidth="64"
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
    )
}