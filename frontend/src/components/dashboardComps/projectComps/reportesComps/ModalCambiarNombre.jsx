import React from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import {useEffect, useState} from "react";
import "@/styles/PopUpEliminateHU.css";
import { set } from "date-fns";
import axios from "axios";
axios.defaults.withCredentials = true;
export default function ModalCambiarNombre({ modal, toggle , idReporte, refresh, nombreActual}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [startModal, setStartModal] = useState(false);
  const [filterValue, setFilterValue] = React.useState("");
  const onSearchChange = (value) => {
    setFilterValue(value);
};

  useEffect(() => {
    if (modal) {
      setStartModal(true);
      onOpen();
    }
  }, []);
  const CambiarNombre = (onClose) => {
    console.log(idReporte);
    
    const data = {
        idReporteXProyecto: idReporte,
        nombre: filterValue
    };
    console.log(data);
    axios.put(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/reporte/editarReporte", data )
        .then((response) => {
            // Manejar la respuesta de la solicitud POST
            console.log("Respuesta del servidor:", response.data);
            console.log("Editado correcto");
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
            console.error("Error al realizar la solicitud PUT:", error);
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
                  <ModalHeader className="flex flex-col gap-1">Cambiar nombre</ModalHeader>
                  <ModalBody>
                  {/* <input
                    type="text"
                    className="input-field"
                    defaultValue={taskName} // Cambiar de value a defaultValue
                    readOnly
                  ></input> */}
                    <Input
                        isClearable
                        className="w-full sm:max-w-[100%]"
                        value={filterValue}
                        onClear={() => onClear("")}
                        onValueChange={onSearchChange}
                        variant="faded"
                        placeholder={nombreActual}
                    />
    
                    
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Cancelar
                    </Button>
                    <Button color="primary" onPress={() => CambiarNombre(onClose)}>
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