import { v4 } from "uuid";
import "@/styles/TemplatesExtras.css";
import { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import axios from "axios";
axios.defaults.withCredentials = true;
import { SearchIcon } from "@/../public/icons/SearchIcon";
import "@/styles/dashboardStyles/projectStyles/actaConstStyles/infoPage.css";

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { SessionContext } from "@/app/dashboard/layout";
import { tr } from "date-fns/locale";

function TemplatesAdditionalFields({ setBaseFields, baseFields, editState }) {
  if (editState === false) {
    return null;
  }

  // useEffect(() => {
  //     DataTable();
  // });

  const [plantillaElegida, setPlantillaElegida] = useState(false);
  const [selectedPlantilla, setSelectedPlantilla] = useState(null);
  const [error, setError] = useState(null);
  const [plantillas, setPlantillas] = useState([]);

  const refreshList = async () => {
    if (sessionData.idUsuario !== "" && filterValue !== "") {
      try {
        const url =
          process.env.NEXT_PUBLIC_BACKEND_URL +
          "/api/proyecto/plantillas/listarPlantillasCAXNombre/" +
          sessionData.idUsuario +
          "/" +
          filterValue;

        const response = await axios.get(url);

        const plantillasInvertidas = response.data.plantillasCA;
        console.log(plantillasInvertidas);

        setPlantillas(plantillasInvertidas);
      } catch (error) {
        console.error("Error al obtener las plantillas:", error);
      }
    }
  };

  const [filterValue, setFilterValue] = useState("");
  const onSearchChange = (value) => {
    setFilterValue(value);
  };

  const limpiarInput = () => {
    setFilterValue("");
    DataTable();
  };

  const DataTable = async () => {
    const fetchPlantillas = async () => {
      if (sessionData.idUsuario !== "") {
        try {
          const url =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/plantillas/listarPlantillasCA/" +
            sessionData.idUsuario;
            const response = await axios.get(url);
            const plantillasInvertidas = response.data.plantillasCA.reverse();

            setPlantillas(plantillasInvertidas);
        } catch (error) {
          console.error("Error al obtener las plantillas:", error);
        }
      }
    };

    fetchPlantillas();
  };

  const { sessionData, setSessionData } = useContext(SessionContext);

  const [isLoading, setIsLoading] = useState(false);

  const guardarPlantillaNueva = async () => {
    setIsLoading(true);

    const titulos = baseFields.map(function (elemento) {
      return elemento.titulo;
    });

    const titulosFiltrados = titulos.filter(function (titulo) {
      // Usa trim() para eliminar espacios en blanco al principio y al final
      return titulo.trim() !== "";
    });

    if (titulosFiltrados.length === 0) {
      toast.error("No hay campos para guardar");
      setIsLoading(false);
      return 0;
    }

    const updateURL =
      process.env.NEXT_PUBLIC_BACKEND_URL +
      "/api/proyecto/plantillas/guardarPlantillaCA";

    try {
      const response = await axios.post(updateURL, {
        nombrePlantilla: nombrePlantilla,
        idUsuario: sessionData.idUsuario,
        titulos: titulosFiltrados,
      });

      console.log(response);
      return 1;
    } catch (error) {
      console.error("Error al Guardar Plantilla:", error);
      return 0;
    }
  };

  const usarPlantilla = async () => {
    setIsLoading(true);

    const updateData = {
      idPlantillaCampoAdicional: selectedPlantilla.idPlantillaCampoAdicional,
    };

    const updateURL =
      process.env.NEXT_PUBLIC_BACKEND_URL +
      "/api/proyecto/plantillas/seleccionarPlantillaCA";

    try {
      const response = await axios.post(updateURL, updateData);

      const array = response.data.camposAdicionales.map((campo) => {
        return campo.nombre;
      });

      const mappedArray = array.map((titulo) => {
        return {
          idCampoAdicional: v4(), //esto genera random ids que son basicamente imposibles de replicar
          titulo: titulo,
          descripcion: "",
        };
      });

      setBaseFields(mappedArray);
      console.log(mappedArray);

      return 1;
    } catch (error) {
      console.error("Error al Usar Plantilla:", error);
      return 0;
    }
  };

  const [nombrePlantilla, setNombrePlantilla] = useState("");
  const [validNombrePlantilla, setValidNombrePlantilla] = useState(true);

  const {
    isOpen: isModalSavePlantilla,
    onOpen: onSaveModalPlantilla,
    onOpenChange: onModaSavePlantillaChange,
  } = useDisclosure();

  const {
    isOpen: isModalPlantillas,
    onOpen: onModalPlantillas,
    onOpenChange: onModalPlantillasChange,
  } = useDisclosure();

  function handleSetPlantilla() {
    const array = ["tit1", "tit2"];

    const mappedArray = array.map((titulo) => {
      return {
        idCampoAdicional: v4(), //esto genera random ids que son basicamente imposibles de replicar
        titulo: titulo,
        descripcion: "Descripción detallada del campo ",
      };
    });

    setBaseFields(mappedArray);
    console.log(mappedArray);
  }

  const handlePlantillaClick = (plantilla) => {
    setSelectedPlantilla(plantilla);
    setPlantillaElegida(true);
    setError(null);
    console.log("Plantilla seleccionada:", plantilla.nombrePlantilla);
  };

  return (
    <div>
      <Modal
        size="md"
        isOpen={isModalSavePlantilla}
        onOpenChange={onModaSavePlantillaChange}
      >
        <ModalContent>
          {(onClose) => {
            const finalizarModal = async () => {
              let Isvalid = true;

              if (nombrePlantilla === "") {
                setValidNombrePlantilla(false);
                Isvalid = false;
              }

              if (Isvalid === true) {
                const response = await guardarPlantillaNueva();

                if (response === 1) {
                  setNombrePlantilla("");
                  setValidNombrePlantilla(true);
                  onClose();
                  toast.success("Plantilla Guardada");
                  setIsLoading(false);
                } else {
                  toast.error("Error al Guardar Plantilla");
                  setIsLoading(false);
                }
              }
            };
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Guardado de Plantilla
                </ModalHeader>
                <ModalBody>
                  <p
                    style={{
                      color: "#494949",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                    }}
                  >
                    Se guardarán los campos en una plantilla para poder usarlos
                    en otros proyectos.
                  </p>

                  <Input
                    type="email"
                    variant={"underlined"}
                    label="Nombre Plantilla"
                    value={nombrePlantilla}
                    onValueChange={setNombrePlantilla}
                    isInvalid={!validNombrePlantilla}
                    onChange={() => {
                      setValidNombrePlantilla(true);
                    }}
                    errorMessage={
                      !validNombrePlantilla ? "Ingrese un nombre" : ""
                    }
                  />

                  <div></div>
                </ModalBody>

                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    isDisabled={isLoading}
                    onClick={() => {
                      onClose(); // Cierra el modal
                      setNombrePlantilla("");
                      setValidNombrePlantilla(true);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="bg-generalBlue text-white font-medium"
                    isLoading={isLoading}
                    onClick={finalizarModal}
                  >
                    Guardar Plantilla
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>

      {
        <Modal
          size="lg"
          isOpen={isModalPlantillas}
          onOpenChange={onModalPlantillasChange}
        >
          <ModalContent>
            {(onClose) => {
              const finalizarModalP = async () => {
                let Isvalid = true;

                if (selectedPlantilla === null) {
                  setPlantillaElegida(false);
                  Isvalid = false;
                }

                if (Isvalid === true) {
                  // handleSetPlantilla();
                  const response = await usarPlantilla();

                  if (response === 1) {
                    setPlantillaElegida(false);
                    onClose();
                    toast.success("Plantilla Usada");
                    setIsLoading(false);
                    DataTable(); // Llamada a fetchPlantillas después de usar la plantilla
                  } else {
                    toast.error("Error al Usar Plantilla");
                    setIsLoading(false);
                  }

                  setFilterValue("");
                } else {
                  setError("Seleccione una plantilla");
                }
              };

              return (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Plantillas Campos Adicionales
                  </ModalHeader>
                  <ModalBody>
                    <div className="modal-body">
                      <div style={{ marginBottom: "25px" }}>
                        <p style={{ fontSize: "15px" }}>
                          Seleccione una plantilla para cargar los campos
                        </p>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                          gap: ".6rem",
                          marginBottom: "25px",
                        }}
                      >
                        <div className="divBuscador">
                          <Input
                            isClearable
                            className="w-full sm:max-w-[100%]"
                            placeholder="Ingresa una plantilla..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onValueChange={onSearchChange}
                            onClear={limpiarInput}
                            variant="faded"
                          />
                        </div>
                        <Button
                          className="bg-generalBlue text-white font-medium"
                          color="primary"
                          onClick={refreshList}
                        >
                          Buscar
                        </Button>
                      </div>

                      <ul className="cardPlantillaACList">
                        {plantillas.map((plantilla) => (
                          <li key={plantilla.idPlantillaCampoAdicional}>
                            <div
                              className={`cardPlantillaAC ${
                                selectedPlantilla === plantilla
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => handlePlantillaClick(plantilla)}
                            >
                              {plantilla.nombrePlantilla}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ModalBody>

                  <ModalFooter>
                    <div
                      style={{ display: "flex", alignItems: "center", flex: 1 }}
                    >
                      {error && (
                        <p style={{ color: "red", fontSize: "14px" }}>
                          {error}
                        </p>
                      )}
                    </div>

                    <Button
                      color="danger"
                      variant="light"
                      isDisabled={isLoading}
                      onClick={() => {
                        onClose(); // Cierra el modal
                        setSelectedPlantilla(null);
                        setError(null); // Establece error en null para desactivar el mensaje de error
                        limpiarInput();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="bg-generalBlue text-white font-medium"
                      onClick={finalizarModalP}
                      isLoading={isLoading}
                    >
                      Usar
                    </Button>
                  </ModalFooter>
                </>
              );
            }}
          </ModalContent>
        </Modal>
      }

      <Dropdown>
        <DropdownTrigger>
          <Button className="btnPlantilla" color="secondary">
            Plantillas
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
          <DropdownItem
            key="verPlantillasAC"
            startContent={<ContentPasteGoIcon />}
            onPress={() => {
              DataTable();
              onModalPlantillas();
            }}
            color="secondary"
          >
            Ver Plantillas
          </DropdownItem>
          <DropdownItem
            key="guardarPlantillasAC"
            startContent={<SaveAsIcon />}
            onPress={() => {
              const titulos = baseFields.map(function (elemento) {
                return elemento.titulo;
              });

              if (titulos.length === 0) {
                toast.error("No hay campos para guardar");
                return 0;
              } else {
                const titulosFiltrados = titulos.filter(function (titulo) {
                  // Usa trim() para eliminar espacios en blanco al principio y al final
                  return titulo.trim() !== "";
                });

                if (titulosFiltrados.length === 0) {
                  toast.error("No hay campos para guardar con titulos");
                  setIsLoading(false);
                  return 0;
                } else {
                  onSaveModalPlantilla();
                }
              }
            }}
            color="secondary"
          >
            Guardar Plantilla
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
export default TemplatesAdditionalFields;
