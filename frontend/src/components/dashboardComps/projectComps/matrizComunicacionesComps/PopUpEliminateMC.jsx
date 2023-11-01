import React from "react";
import "@/styles/PopUpEliminateHU.css";
import axios from "axios";
axios.defaults.withCredentials = true;
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import {useEffect, useState} from "react";
function PopUpEliminateMC({ modal, toggle, taskName, idComunicacion, refresh}) {

    const Eliminate = (idComunicacion, onClose) => {
        console.log(idComunicacion);
        
        const data = {
            idComunicacion: idComunicacion // Ajusta el nombre del campo según la estructura esperada por el servidor
        };

        axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/matrizDeComunicaciones/eliminarComunicacion", { data })
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
            {/* {modal && (
                <div className="popUp">
                    <div onClick={toggle} className="overlay"></div>
                    <div className="popUp-content">
                        <h2 className="popUp-title">
                            Eliminar informacion de la matriz {idComunicacion}
                        </h2>
                        <h3 className="advertisement">
                            ¿Estás seguro que desea eliminar la siguiente informacion?
                        </h3>
                        <label
                            for="TextBoxEliminate"
                            className="label-Eliminate"
                        >
                            <strong>Nombre de la informacion: </strong>
                        </label>
                        <input
                            type="text"
                            className="input-field"
                            readonly
                            value={taskName}
                        ></input>

                        <div className="buttonSection">
                            <button className="close-modal" onClick={toggle}>
                                Cancelar
                            </button>
                            <button className="close-modal" onClick={() => Eliminate(idComunicacion)}>
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <p></p> */}
            {startModal && (
            <Modal 
            isOpen={isOpen} 
            onOpenChange={onOpenChange}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Eliminar informacion de la matriz {idComunicacion}</ModalHeader>
                  <ModalBody>
                  <h3 className="advertisement">
                            ¿Estás seguro que desea eliminar la siguiente informacion?
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
                    <Button color="primary" onPress={() => Eliminate(idComunicacion, onClose)}>
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

export default PopUpEliminateMC;
