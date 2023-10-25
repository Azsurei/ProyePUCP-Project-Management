import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";

export default function ModalDeleteTarea({
    isOpen,
    onOpenChange,
    eliminarTarea,
}) {
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            //size="xl"
            classNames={
                {
                    //closeButton: "hidden",
                }
            }
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = () => {
                        eliminarTarea();
                        onClose();
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col text-red-500">
                                Eliminar una tarea
                            </ModalHeader>
                            <ModalBody>
                                <div>
                                    ¿Seguro que desea eliminar esta tarea?
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
                                    onPress={finalizarModal}
                                >
                                    Aceptar
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );
}
