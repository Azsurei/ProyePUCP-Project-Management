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

function ModalDeleteUser({ isOpen, onOpenChange, idProyecto, currentUser, removeFromList }) {
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
                        const result = await deleteUser();
                        if (result === 1) {
                            removeFromList();
                            toast.success("Usuario eliminado con exito");
                            onClose();
                        } else {
                            toast.error("Error al eliminar usuario");
                            setIsLoading(false);
                        }
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col pb-1 text-red-500 text-xl">
                                Eliminar usuario
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-1">
                                    <p className="text-base">
                                        Esta seguro que desea eliminar este
                                        usuario?
                                    </p>
                                    {currentUser !== null && (
                                        <CardSelectedUser
                                            isEditable={false}
                                            usuarioObject={currentUser}
                                        />
                                    )}
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

    async function deleteUser() {
        try {
            const deleteURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/eliminarUsuarioDeProyecto";

            const deleteResponse = await axios.delete(deleteURL, {
                data: {
                    idUsuario: currentUser.idUsuario,
                    idProyecto: idProyecto,
                },
            });

            console.log("Se elimino el usuario correctamente");
            return 1;
        } catch (error) {
            console.error("Error al eliminar usuario: ", error);
            return 0;
        }
    }
}
export default ModalDeleteUser;
