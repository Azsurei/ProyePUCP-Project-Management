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
import CardSelectedUser from "@/components/CardSelectedUser";
axios.defaults.withCredentials = true;

function ModalDeleteTool({
    isOpen,
    onOpenChange,
    idProyecto,
    tool,
    refreshPage,
}) {
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
            isDismissable={false}
            classNames={{
                closeButton: "hidden",
            }}
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = async () => {
                        setIsLoading(true);
                        const result = await deleteTool();
                        if (result === 1) {
                            toast.success("Herramienta eliminada con exito");
                            setTimeout(() => {
                                refreshPage();
                            }, 1000);
                            //onClose();
                        } else {
                            toast.error("Error al eliminar herramienta");
                            setIsLoading(false);
                        }
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col pb-1 text-red-500 text-xl">
                                Eliminar {tool !== null && tool.nombre}
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-1">
                                    <p className="text-base">
                                        Esta seguro que desea eliminar esta
                                        herramienta?
                                    </p>
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

    async function deleteTool() {
        try {
            const deleteURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/eliminarHerramientaDeProyecto";

            const deleteResponse = await axios.delete(deleteURL, {
                data: {
                    idProyecto: idProyecto,
                    idHerramienta: tool.idHerramienta,
                    idHerramientaCreada: tool.idHerramientaCreada,
                },
            });

            console.log("Se elimino la herramienta correctamente");
            return 1;
        } catch (error) {
            console.error("Error al eliminar herramienta: ", error);
            return 0;
        }
    }
}
export default ModalDeleteTool;
