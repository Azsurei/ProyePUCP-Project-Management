import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import {useEffect, useState} from "react";
import "@/styles/PopUpEliminateHU.css";
import { set } from "date-fns";

export default function ModalEliminateIngreso({ modal, toggle, taskName }) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [startModal, setStartModal] = useState(false);

  useEffect(() => {
    if (modal) {
      setStartModal(true);
      onOpen();
      console.log(taskName);
    }
  }, []);
  return (
    <>
    {startModal && (
            <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
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
                    defaultValue={taskName} // Cambiar de value a defaultValue
                    readOnly
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
    )}

    </>
  );
}