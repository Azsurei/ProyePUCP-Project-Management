import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";

function ModalTaskView({ isOpen, onOpenChange }) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            //size="xl"
            classNames={
                {
                    closeButton: "hidden",
                }
            }
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = () => {
                        //eliminarTarea();
                        onClose();
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-row  justify-between items-center pb-2">
                                Detalles de tarea
                                <Button
                                    color="warning"
                                    className="max-h-[40px] text-white"
                                >
                                    Editar
                                </Button>
                            </ModalHeader>
                            <ModalBody>
                                <div>
                                    <p>Nombre de tarea</p>

                                    <p>Descripcion de tarea</p>

                                    <p> Fecha inicio</p>
                                    <p> Fecha fin</p>

                                    <p>Usuarios responsables</p>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {/* <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancelar
                                </Button> */}
                                <Button
                                    color="primary"
                                    onPress={finalizarModal}
                                >
                                    Cerrar
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );
}

export default ModalTaskView;
