import React from "react";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";

export default function BtnToModal({
    nameButton,
    textHeader,
    textBody,
    headerColor,
    colorButton,
    oneButton,
    leftBtnText,
    rightBtnText,
    doBeforeClosing,
    verifyFunction,
}) {
    //Este modal cierra automaticamente tras tocar el segundo boton, y ejecuta la funcion pasada en doBeforeClosing
    //Se asume que el boton de la izquierda de "Cancelar" siempre cierra el modal, si alguien necesita cambiar esto comentelo por el grupo

    //Su uso en general es para confirmar el registro o edicion de algo, SOLO PARA CONFIRMAR
    //Si quieren introducir contenido en este modal, no les servira porque no recoge informacion y tendrian que modificar la estructura
    //En esos casos, usar el modal de NextUI y personalizarlo a su gusto

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    //verificacion previa a abrir modal (opcional)
    const verifyFirst = () => {
        if (typeof verifyFunction === "function") {
            if (verifyFunction()) {
                onOpen();
            }
        } else {
            onOpen();
        }
    };

    return (
        <>
            <Button onPress={verifyFirst} className={`${colorButton}`}>
                {nameButton}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => {
                        const cancelarModal = () => {
                            onClose();
                        };
                        const cerrarModal = () => {
                            if(typeof doBeforeClosing === "function"){
                                doBeforeClosing();
                            }
                            onClose();
                        };
                        return (
                            <>
                                <ModalHeader
                                    className={
                                        "flex flex-col gap-1 text-" +
                                        headerColor +
                                        "-500"
                                    }
                                >
                                    {textHeader}
                                </ModalHeader>
                                <ModalBody>
                                    <p>{textBody}</p>
                                </ModalBody>
                                <ModalFooter>
                                    {!oneButton && (
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={onClose}
                                        >
                                            {leftBtnText}
                                        </Button>
                                    )}
                                    <Button
                                        className="bg-indigo-950 text-slate-50"
                                        onPress={cerrarModal}
                                    >
                                        {rightBtnText}
                                    </Button>
                                </ModalFooter>
                            </>
                        );
                    }}
                </ModalContent>
            </Modal>
        </>
    );
}
