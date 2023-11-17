"use client"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
axios.defaults.withCredentials = true;

function ModalDeleteItem({isOpen, onOpenChange, idItemLineRetro, removeFromList}) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen === true) {
            setIsLoading(false);
        }
    }, [isOpen]);


    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            //size="xl"
            isDismissable={false}
            classNames={{
                closeButton: "hidden",
            }}
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = async () => {
                        setIsLoading(true);
                        const result = await deleteItemRetro();
                        if(result === 1){
                            removeFromList();
                            toast.success("Item eliminado con exito", {position: "top-center"});
                            onClose();
                        }
                        else{
                            toast.error("Hubo un error al eliminar el item", {position: "top-center"});
                        }
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col pb-1 text-red-500">
                                Eliminar item de retrospectiva
                            </ModalHeader>
                            <ModalBody>
                                <div>
                                    Esta seguro que desea eliminar este item?
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
                                    isLoading={isLoading}
                                    color="primary"
                                    onPress={()=>{
                                        finalizarModal();
                                    }}
                                >
                                    Eliminar
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );

    async function deleteItemRetro(){
        try {
            const newURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/retrospectiva/eliminarItemLineaRetrospectiva";

            const deleteItemResponse = await axios.delete(
                newURL,
                {
                    data: {
                        idItemLineaRetrospectiva: idItemLineRetro,
                    },
                }
            );

            console.log("Se elimino el item correctamente");
            return 1;
        } catch (error) {
            console.error("Error al eliminar item: ", error);
            return 0;
        }
    }
}
export default ModalDeleteItem;
