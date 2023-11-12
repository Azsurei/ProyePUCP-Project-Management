"use client";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
axios.defaults.withCredentials = true;

function ModalDeleteConfirmation({ isOpen, onOpenChange, idProyecto }) {
    const [isLoading, setIsLoading] = useState(false);
    const [inputText, setInputText] = useState("");
    const [validText, setValidText] = useState(true);

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
                        if (inputText === "eliminar") {
                            setIsLoading(true);
                            //const result = await deleteItemRetro();
                            //if (result === 1) {
                                //removeFromList();
                                //toast.success("Item eliminado con exito");
                                //onClose();
                            //} else {
                                //toast.error(
                                    //"Hubo un error al eliminar el item"
                                //);
                            //}
                        } else {
                            setValidText(false);
                        }
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col pb-1 text-red-500 text-xl">
                                Eliminar proyecto
                            </ModalHeader>
                            <ModalBody>
                                <div>
                                    <p className="text-lg">
                                        Esta seguro que desea eliminar este
                                        proyecto?
                                    </p>
                                    <p>
                                        Para confirmar su decisión, escribe
                                        "eliminar":
                                    </p>
                                    <Textarea
                                        isInvalid={!validText}
                                        errorMessage={
                                            !validText
                                                ? "Debe introducir la palabra"
                                                : ""
                                        }
                                        aria-label="custom-txt"
                                        variant={"bordered"}
                                        labelPlacement="outside"
                                        placeholder={"Escribe aquí"}
                                        classNames={{
                                            label: "pb-0",
                                        }}
                                        value={inputText}
                                        onValueChange={setInputText}
                                        minRows={1}
                                        size="sm"
                                        onChange={() => {
                                            setValidText(true);
                                        }}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    isDisabled={isLoading}
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    isLoading={isLoading}
                                    color="primary"
                                    onPress={() => {
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

    async function deleteItemRetro() {
        try {
            const newURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/retrospectiva/eliminarItemLineaRetrospectiva";

            const deleteItemResponse = await axios.delete(newURL, {
                data: {
                    idItemLineaRetrospectiva: idItemLineRetro,
                },
            });

            console.log("Se elimino el item correctamente");
            return 1;
        } catch (error) {
            console.error("Error al eliminar item: ", error);
            return 0;
        }
    }
}
export default ModalDeleteConfirmation;
