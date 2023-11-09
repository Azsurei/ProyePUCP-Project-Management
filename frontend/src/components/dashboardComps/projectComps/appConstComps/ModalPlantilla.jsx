import React, { useState, useEffect, useReducer, useContext } from "react";
import axios from "axios";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@nextui-org/react";
import { id } from "date-fns/locale";

export default function ModalPlantilla({
  isOpen,
  onClose,
  onPlantillaSelect, // La función de devolución de llamada para la selección de plantilla
  idUsuario,
}) {
  const [plantillas, setPlantillas] = useState([]);
  const [selectedPlantilla, setSelectedPlantilla] = useState(null);
  const [error, setError] = useState(null);


  const fetchPlantillas = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/proyecto/plantillas/listarPlantillasAC/'+idUsuario;
      const response = await axios.get(url);

      console.log("El id es:"+ idUsuario);

      setPlantillas(response.data);
    } catch (error) {
      console.error("Error al obtener las plantillas:", error);
    }
  };

  useEffect(() => {
    fetchPlantillas();
  }, []);

  const selectPlantilla = (plantilla) => {
    setSelectedPlantilla(plantilla);
  };

  const continueWithPlantilla = () => {
    if (selectedPlantilla) {
      onPlantillaSelect(selectedPlantilla); // Llama a la función de devolución de llamada con la plantilla seleccionada
      setError(null); // Establece error en null para desactivar el mensaje de error
      onClose();
    } else {
      setError("Debes seleccionar una plantilla");
    }
  };

  return (
    <Modal size="lg" isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
      {(onClose) => (
              <>

          <ModalHeader className="flex flex-col gap-1">
              Plantillas
          </ModalHeader>
          <ModalBody>
          <div className="modal-body">
            <p style={{ fontSize: "15px" }}>Seleccione una plantilla para cargar los campos:</p>
            <ul>
              {/* {plantillas.map((plantilla) => (
                <li key={plantilla.id}>
                  <button onClick={() => selectPlantilla(plantilla)}>
                    {plantilla.nombre}
                  </button>
                </li>
              ))} */}
            </ul>
          </div>

          </ModalBody>

        <ModalFooter>
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}

        </div>

            <Button
            color="danger" variant="light" 

            onClick={() => {
                onClose(); // Cierra el modal
                setError(null); // Establece error en null para desactivar el mensaje de error

            }}
            
            >
            Cancelar
            
            </Button>
            <Button
            color="primary"
            onClick={continueWithPlantilla}
            >
            Continuar
            </Button>
        </ModalFooter>
      </>
      )}

      </ModalContent>

    </Modal>
  );
}
