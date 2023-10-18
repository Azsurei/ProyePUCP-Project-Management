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
    colorButton,
    oneButton,
    secondAction,
    textColor,
    verifyFunction
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const verifyFirst = () => {
        if (typeof verifyFunction === 'function') {
            if (verifyFunction()) {
                onOpen();
            }
        } else {
            onOpen();
        }
    }

    return (
        <>
            <Button onPress={verifyFirst} className={`${colorButton}`}>
                {nameButton}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={"flex flex-col gap-1 text-"+textColor+"-500"}>
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
                                        Cerrar
                                    </Button>
                                )}
                                <Button
                                    className="bg-indigo-950 text-slate-50"
                                    onPress={secondAction}
                                >
                                    Continuar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
