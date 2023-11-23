import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import {useEffect, useState} from "react";
import "@/styles/PopUpEliminateHU.css";
import { set } from "date-fns";
import axios from "axios";
axios.defaults.withCredentials = true;
export default function ModalEliminateGroup({ modal, toggle, idGrupoProyecto, refresh}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [startModal, setStartModal] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);
  useEffect(() => {
    if (modal) {
      setStartModal(true);
      onOpen();
    }
  }, []);
  const Eliminate = (idGrupoProyecto, onClose) => {
    console.log(idGrupoProyecto);
    
    const data = {
        idGrupoDeProyecto: idGrupoProyecto // Ajusta el nombre del campo según la estructura esperada por el servidor
    };

    axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/grupoProyectos/eliminarGrupoProyectos", { data })
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
                  <ModalHeader className="flex flex-col gap-1">¿Estás seguro que desea eliminar el grupo de proyecto?</ModalHeader>
                  <ModalBody>
                    
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={()=> {
                        onClose();
                        toggle();
                        
                    }}>
                      Cancelar
                    </Button>
                    <Button color="primary" onPress={() => Eliminate(idGrupoProyecto, onClose)}>
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