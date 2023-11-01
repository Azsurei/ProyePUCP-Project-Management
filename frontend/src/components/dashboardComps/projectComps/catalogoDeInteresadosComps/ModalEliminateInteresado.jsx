import React from "react";
import "@/styles/PopUpEliminateHU.css";
import axios from "axios";
axios.defaults.withCredentials = true;
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import {useEffect, useState} from "react";
function ModalEliminateInteresado({ modal, toggle, taskName, idInteresado, refresh}) {

    const Eliminate = (idInteresado, onClose) => {
        console.log("Id: ", idInteresado);
        
        const data = {
            idInteresado: idInteresado // Ajusta el nombre del campo según la estructura esperada por el servidor
        };

        axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/catalogoInteresados/eliminarInteresado", { data })
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
                  <ModalHeader className="flex flex-col gap-1">Eliminar informacion del interesado {idInteresado}</ModalHeader>
                  <ModalBody>
                  <h3 className="advertisement">
                            ¿Estás seguro que desea eliminar el siguiente interesado?
                    </h3>

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
                    <Button color="primary" onPress={() => Eliminate(idInteresado, onClose)}>
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

export default ModalEliminateInteresado;