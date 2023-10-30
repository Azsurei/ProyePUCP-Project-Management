import React from "react";
import "../styles/PopUpEliminateHU.css";
import axios from "axios";
axios.defaults.withCredentials = true;
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import {useEffect, useState} from "react";
function PopUpEliminate({ modal, toggle, taskName, idHistoriaDeUsuario , refresh}) {

    const Eliminate = (idHistoriaDeUsuario, onClose) => {
        console.log(idHistoriaDeUsuario);
        axios.post(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/backlog/hu/eliminarHistoria", { idHistoriaDeUsuario: idHistoriaDeUsuario })
            .then((response) => {
                // Manejar la respuesta de la solicitud POST
                console.log("Respuesta del servidor:", response.data);
                console.log("Eliminado correcto");
                // Llamar a refresh() aquí después de la solicitud HTTP exitosa
                refresh();
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
                            Eliminar elemento del Backlog {idHistoriaDeUsuario}
                        </h2>
                        <h3 className="advertisement">
                            ¿Estás seguro que desea eliminar la siguiente tarea?
                        </h3>
                        <label
                            for="TextBoxEliminate"
                            className="label-Eliminate"
                        >
                            <strong>Nombre del elemento: </strong>
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
                            <button className="close-modal" onClick={() => Eliminate(idHistoriaDeUsuario)}>
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
                  <ModalHeader className="flex flex-col gap-1">Eliminar elemento del Backlog {idHistoriaDeUsuario}</ModalHeader>
                  <ModalBody>
                  <h3 className="advertisement">
                            ¿Estás seguro que desea eliminar la siguiente tarea?
                    </h3>
                    <Input
                        isDisabled
                        className="w-full sm:max-w-[100%]"
                        defaultValue={taskName}    
                    />
                    
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button color="primary" onPress={() => Eliminate(idHistoriaDeUsuario, onClose)}>
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

export default PopUpEliminate;
