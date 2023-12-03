import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";

export default function ModalEliminarAR({
    isOpen,
    onOpenChange,
    //eliminarTarea,
}) {
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
            isDismissable={false}
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = () => {
                        //eliminarTarea();
                        onClose();
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col text-red-500 pb-1">
                                Eliminar acta de reunión
                            </ModalHeader>
                            <ModalBody>
                                <div>
                                    ¿Seguro que desea eliminar esta acta de reunión?
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
                                    className="bg-generalBlue "
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
