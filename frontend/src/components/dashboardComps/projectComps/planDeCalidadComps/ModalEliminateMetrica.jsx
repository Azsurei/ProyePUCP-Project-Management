import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import {useEffect, useState} from "react";
import "@/styles/PopUpEliminateHU.css";
import { set } from "date-fns";
import axios from "axios";
axios.defaults.withCredentials = true;
export default function ModalEliminateMetrica({ modal, toggle, taskName , idMetricaCalidad, refresh}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [startModal, setStartModal] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);
  useEffect(() => {
    if (modal) {
      setStartModal(true);
      onOpen();
      console.log(taskName);
    }
  }, []);
  const Eliminate = (idMetricaCalidad, onClose) => {
    console.log(idMetricaCalidad);
    
    const data = {
        idMetricaCalidad: idMetricaCalidad // Ajusta el nombre del campo según la estructura esperada por el servidor
    };

    axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/planCalidad/eliminarMetricaCalidad", { data })
        .then((response) => {
            // Manejar la respuesta de la solicitud POST
            console.log("Respuesta del servidor:", response.data);
            console.log("Eliminado correcto");
            // Llamar a refresh() aquí después de la solicitud HTTP exitosa
            refresh();
            toggle();
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
                  <ModalHeader className="flex flex-col gap-1">¿Estás seguro que desea eliminar la siguiente metrica?</ModalHeader>
                  <ModalBody>
                  <Input
                    isDisabled
                    className="w-full sm:max-w-[100%]"
                    defaultValue={taskName}
                    />
    
                    
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={()=> {
                        onClose();
                        toggle();
                        
                    }}>
                      Cancelar
                    </Button>
                    <Button color="primary" onPress={() => Eliminate(idMetricaCalidad, onClose)}>
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