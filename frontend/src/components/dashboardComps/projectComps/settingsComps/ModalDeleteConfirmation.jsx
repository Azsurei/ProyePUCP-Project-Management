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
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { HerramientasInfo } from "@/app/dashboard/[project]/layout";
axios.defaults.withCredentials = true;

function ModalDeleteConfirmation({ isOpen, onOpenChange, idProyecto, handlePushToDashboard }) {
    const [isLoading, setIsLoading] = useState(false);
    const [inputText, setInputText] = useState("");
    const [validText, setValidText] = useState(true);

    const { herramientasInfo } = useContext(HerramientasInfo);

    useEffect(() => {
        if (isOpen === true) {
            setIsLoading(false);
            setInputText("");
            setValidText(true);
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="xl"
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
                            const result = await deleteProyect();
                            if(result === 1){
                                toast.success("Proyecto eliminado con exito");
                                handlePushToDashboard();
                            }
                            else{
                                toast.error("Error al eliminar proyecto");
                            }
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
                                <div className="flex flex-col gap-1">
                                    <p className="text-base">
                                        Esta seguro que desea eliminar este
                                        proyecto?
                                    </p>
                                    <p className="text-base">
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

    async function deleteProyect() {
        try {
            const deleteURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/eliminarProyecto";

            const deleteResponse = await axios.delete(deleteURL, {
                data: {
                    idProyecto: idProyecto,
                    herramientas: herramientasInfo,
                },
            });

            console.log("Se elimino el proyecto correctamente");
            return 1;
        } catch (error) {
            console.error("Error al eliminar proyecto: ", error);
            return 0;
        }
    }
}
export default ModalDeleteConfirmation;
