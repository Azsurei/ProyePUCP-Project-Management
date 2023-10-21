import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";


export default function ModalEliminateIngreso(modal, toggle, taskName) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <Modal 
        isOpen={modal} 
        onOpenChange={toggle}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">¿Estás seguro que desea eliminar el siguiente ingreso?</ModalHeader>
              <ModalBody>
                <input
                    type="text"
                    className="input-field"
                    readonly
                    value={taskName}
                ></input>
                
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onPress={onClose}>
                  Aceptar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}