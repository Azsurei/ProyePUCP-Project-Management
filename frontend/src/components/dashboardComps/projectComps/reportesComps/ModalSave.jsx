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
import { toast } from "sonner";

function ModalSave({ isOpen, onOpenChange, guardarReporte }) {
    const [reportName, setReportName] = useState("");
    const [validName, setValidName] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen === true) {
            setReportName("");
            setValidName(true);
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
                        if (reportName === "") {
                            setValidName(false);
                        } else {
                            setIsLoading(true);
                            const response = await guardarReporte(reportName);
                            if(response === 1){
                                onClose();
                            } else {
                                setIsLoading(false);
                            }
                            
                        }
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col">
                                Guardar reporte de entregables
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-1">
                                    <p>¿Con que nombre guardaras el reporte?</p>
                                    <Textarea
                                        isDisabled={isLoading}
                                        isInvalid={!validName}
                                        errorMessage={
                                            !validName
                                                ? "Debe introducir un nombre"
                                                : ""
                                        }
                                        //key={"bordered"}
                                        aria-label="custom-txt"
                                        variant={"bordered"}
                                        labelPlacement="outside"
                                        placeholder={"Escribe aquí"}
                                        classNames={{
                                            label: "pb-0",
                                        }}
                                        value={reportName}
                                        onValueChange={setReportName}
                                        minRows={1}
                                        size="sm"
                                        onChange={() => {
                                            setValidName(true);
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
                                    color="primary"
                                    onPress={finalizarModal}
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
export default ModalSave;
