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
    idLineaToDelete,
    setIdLineaToDelete
}) {
    const [isLoading, setIsLoading] = useState(false);  
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
                    const finalizarModal = async () => {
                        const response = await deleteActaReunion(idLineaToDelete);

                        if(response === 1){
                            setIdLineaToDelete(null);
                            onClose();
                            return;
                        }
                        else{
                            onClose();
                        }
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
                                    onPress={()=>{
                                        setIdLineaToDelete(null);
                                        onClose();
                                    }}
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

    async function deleteActaReunion(idLinea) {
        setIsLoading(true);
        try {
            const url =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/actaReunion/eliminarLineaActaReunionXIdLineaActaReunion";

            const response = await axios.delete(url, {
                data: {
                    idLineaActaReunion: idLinea,
                },
            });

            if (response.status === 200) {
                toast.success("Acta de reunion eliminada con exito");
                const nuevasReuniones = reuniones.filter(
                    (reunion) => reunion.idLineaActaReunion !== id
                );
                setReuniones(nuevasReuniones);
            }

            setIsLoading(false);
        } catch (e) {
            console.log(e);
            toast.error("Error al eliminar acta de reunion");
        }
    }
}
