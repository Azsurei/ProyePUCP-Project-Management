"use client"

import axios from "axios";
axios.defaults.withCredentials = true;

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";

export default function ModalEliminarAR({
    isOpen,
    onOpenChange,
    idLineaToDelete,
    setIdLineaToDelete,
    deleteActaReunion
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
                        setIsLoading(true);
                        const response = await deleteActaReunion(idLineaToDelete);

                        if(response === 1){
                            toast.success("Acta de reunion eliminada con exito");
                            setIdLineaToDelete(null);
                            setIsLoading(false);
                            onClose();
                            return;
                        }
                        else{
                            toast.error("Error al eliminar acta de reunion");
                            setIdLineaToDelete(null);
                            setIsLoading(false);
                            onClose();
                            return;
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
                                    isDisabled={isLoading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={finalizarModal}
                                    className="bg-generalBlue "
                                    isLoading={isLoading}
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
