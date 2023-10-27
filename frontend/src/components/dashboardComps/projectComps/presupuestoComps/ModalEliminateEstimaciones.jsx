import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import {useEffect, useState} from "react";
import "@/styles/PopUpEliminateHU.css";
import { set } from "date-fns";
import axios from "axios";
axios.defaults.withCredentials = true;
export default function ModalEliminateEstimacion({ modal, toggle, taskName , idEstimacion, refresh}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [startModal, setStartModal] = useState(false);

  useEffect(() => {
    if (modal) {
      setStartModal(true);
      onOpen();
      console.log(taskName);
    }
  }, []);
  const Eliminate = (idEstimacion, onClose) => {
    console.log(idEstimacion);
    
    const data = {
        idLineaEstimacionCosto: idEstimacion // Ajusta el nombre del campo según la estructura esperada por el servidor
    };

    axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/presupuesto/eliminarLineaCosto", { data })
        .then((response) => {
            // Manejar la respuesta de la solicitud POST
            console.log("Respuesta del servidor:", response.data);
            console.log("Eliminado correcto");
            // Llamar a refresh() aquí después de la solicitud HTTP exitosa
            const handleRefresh = async () => {
              refresh();
              console.log("refreshed");
            };
            handleRefresh();
            onClose();
        })
        .catch((error) => {
            // Manejar errores si la solicitud POST falla
            console.error("Error al realizar la solicitud POST:", error);
        });

        
       
};
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
                  <ModalHeader className="flex flex-col gap-1">¿Estás seguro que desea eliminar la siguiente estimacion?</ModalHeader>
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
                    <Button color="primary" onPress={() => Eliminate(idEstimacion, onClose)}>
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