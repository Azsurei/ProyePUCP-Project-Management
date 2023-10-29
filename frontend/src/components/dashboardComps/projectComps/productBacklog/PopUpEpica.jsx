import React from "react";
import { useEffect, useState } from "react";
import "@/styles/dashboardStyles/projectStyles/productBacklog/PopUpEpica.css";
//import ListUsers from "./ListUsers";
import ListEpic from "@/components/dashboardComps/projectComps/productBacklog/ListEpic";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Link} from "@nextui-org/react";
import axios from "axios";
import { CrossIcon } from "@/../public/icons/CrossIcon";
import { CheckIcon } from "@/../public/icons/CheckIcon";
axios.defaults.withCredentials = true;
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    Popover, 
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";

import { SearchIcon } from "@/../public/icons/SearchIcon";


export const UserCardsContext = React.createContext();

export default function PopUpEpica({ modal, toggle, url, backlogID, urlAdd, urlEliminate}) {
    const [filterValue, setFilterValue] = useState("");
    const [listEpics, setListEpics] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [newEpicName, setNewEpicName] = useState("");
    const [addErrorEpic, setAddErrorEpic] = useState("");
    const [eliminateError, setEliminateError] = useState("");
    const [noEpic, setNoEpic] = useState("");
    const [isSelected, setIsSelected] = useState(false);
    const [addEpic, setAddEpic] = useState(false);
    const [isEpicValid, setIsEpicValid] = useState(false);
    const onSearchChange = (value) => {
        setFilterValue(value);
    };
    const onAddEpicChange = (value) => {
        setNewEpicName(value);
    };
    const AddNewEpic = () => {
        setAddEpic(true);
        setIsEpicValid(false);
    }

    const fetchData = async () => {
        try {
          const response = await axios.get(url);
          const epicas = response.data["epicas"];
          const filteredEpicas = filterValue
              ? epicas.filter((epica) =>
                  epica.nombre.toLowerCase().includes(filterValue.toLowerCase())
              )
              : epicas;

          setListEpics(filteredEpicas); 
          if (filteredEpicas.length === 0) {
              setNoResults(true);
          } else {
              setNoResults(false);
          }
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      };
    const handleInsertEpic = (onClose) => {
        if (newEpicName.trim() === "") {
            setIsEpicValid(true);
            setAddErrorEpic("El nombre de la épica no puede estar vacío.");
        } else if (listEpics.some((epic) => epic.nombre === newEpicName)) {
            setIsEpicValid(true);
            setAddErrorEpic("El nombre de la épica ya existe en la lista.");
        } else {
            // Realiza la inserción de la nueva épica aquí, por ejemplo, con una solicitud axios.
            // Luego, limpia el campo de entrada y el mensaje de error.
            setNewEpicName("");
            setAddErrorEpic("");
            const data = {
                idProductBacklog: backlogID, // Reemplaza con el valor deseado
                nombre: newEpicName // Reemplaza con el valor deseado
              };
              
             
                axios.post(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/backlog/hu/insertarEpica", data)
                .then((response) => {
                // Manejar la respuesta de la solicitud POST
                console.log("Respuesta del servidor:", response.data);
                console.log("Registro correcto de la epica")
                // Realizar acciones adicionales si es necesario
                fetchData();
                })
                .catch((error) => {
                 // Manejar errores si la solicitud POST falla
                console.error("Error al realizar la solicitud POST:", error);
                });
            fetchData();
        }
    };

    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [startModal, setStartModal] = useState(false);
  
    useEffect(() => {
      if (modal) {
        setStartModal(true);
        onOpen();
        
      }
    }, []);

    const EliminateEpic = (name) => {
        console.log(name);
        setEliminateError("");
        
        const data = {
            nombreEpica: name // Ajusta el nombre del campo según la estructura esperada por el servidor
        };
        axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/backlog/hu/eliminarEpica", { data })
            .then((response) => {
                // Manejar la respuesta de la solicitud DELETE
                console.log("Respuesta del servidor:", response.data);
                console.log("Eliminado correcto");
                // Llamar a refresh() aquí después de la solicitud HTTP exitosa
                fetchData();
            })
            .catch((error) => {
                // Manejar errores si la solicitud DELETE falla
                console.error("Error al realizar la solicitud DELETE:", error);
            });
    };
    
    const [selectedEpic, setSelectedEpic] = useState(null);

    const selectEpic = (epic) => {
        setSelectedEpic(epic);
        setEliminateError("");
        setIsSelected(true);
        setNoEpic("");
        console.log(epic);
    };

    const deselectEpic = (epic) => {
        setSelectedEpic(null);
        setIsSelected(false);
    };

    const handleEliminateError = (nameError) => {
        setEliminateError(nameError);
        setAddErrorEpic("");
    }

    useEffect(() => {
        
    
        fetchData();
      }, [filterValue]);

    return (
        // (modal && <div className="popUp" style={{animation: "droptop .3s linear"}}>
		// 	<div onClick={toggle} className="overlay"></div>
        //     <div className="modalEpic">
                
        //         <div className="containerModal">
                    
        //             <p className="buscarEpic">Lista de Epicas</p>
        //             <div className="subcontainer flex justify-end">
        //                     <Button color="primary" endContent={<PlusIcon />} className="btnAddEpic" onClick={AddNewEpic}>
        //                         Agregar Epica
        //                     </Button>
        //                     <Button color="danger"  onClick={() => {
        //                                             isSelected ? handleEliminateError("Seguro desea eliminar la epica?") : setNoEpic("Falta seleccionar una epica");
        //                                             }} endContent={<PlusIcon />} className="btnElimanteEpic" >
        //                         Eliminar
        //                     </Button>
                            
        //             </div>
                    
        //         </div>
        //         <div className="divBuscador">
        //                 <Input
        //                     isClearable
        //                     className="w-full sm:max-w-[100%]"
        //                     placeholder="Ingresa una epica..."
        //                     startContent={<SearchIcon />}
        //                     value={filterValue}
        //                     onValueChange={onSearchChange}
        //                     variant="faded"
        //                 />
        //         </div>
                
        //         <div className="containerModal">
        //             <div className="divEpics">
        //                 <UserCardsContext.Provider
        //                     value={{ selectEpic, deselectEpic }}
        //                 >
        //                     <ListEpic lista={listEpics}></ListEpic>
        //                 </UserCardsContext.Provider>
        //                 {noResults && (
        //                     <p className="error-message">
        //                         No se encontraron resultados.
        //                     </p>
        //                 )}
        //             </div>
                     
        //         </div>
        //         <div className="subcontainer">
                        
                        
        //                 {addEpic ? (
        //                     <input
        //                     type="text" 
        //                     autoFocus 
        //                     className="inputEpica"
        //                     placeholder="Escribe la nueva epica"
        //                     value={newEpicName}
        //                     onChange={(e) => {
        //                         setNewEpicName(e.target.value);
        //                         setAddErrorEpic("");
        //                     }}
        //                     ></input>
        //                 ):null}
        //                 {addErrorEpic && <p className="error-message">{addErrorEpic}</p>}
        //                 {noEpic && <p className="error-message">{noEpic}</p>}
        //                 {eliminateError ? (
        //                     <div>
        //                         <p className="error-message">{eliminateError}</p>
        //                         <div className="endButtons">
        //                             <button
        //                                 className="buttonTwoUser"
        //                                 onClick={() => setEliminateError("")}
        //                             >
        //                                 Cancelar
        //                             </button>
        //                             <button
        //                                 className="buttonOneUser"
        //                                 onClick={() => EliminateEpic(selectedEpic.nombre)}
        //                             >
        //                                 Confirmar
        //                              </button>
        //                         </div>
        //                     </div>
        //                 ) : null}
        //         </div> 
                
        //         <div className="buttonSection">
        //             <button className="close-modal" onClick={toggle}>
        //                 Cancelar
        //             </button>
        //             <div className="right-buttons">
        //                 <button className="btn-modal" onClick={handleInsertEpic}>
        //                     Aceptar
        //                 </button>
        //             </div>
        //         </div>
                
        //     </div>
        // </div>
        // )
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
                        
                    
                            <ModalHeader className="flex flex-col gap-1">Lista de epicas</ModalHeader>
                                <div className="subcontainer flex justify-center gap-percent-22">
                                    <Button color="primary" endContent={<PlusIcon />} className="btnAddEpic" onClick={AddNewEpic}>
                                        Agregar Epica
                                    </Button>
                                    
                                        <Button color="danger"  onClick={() => {
                                                                 isSelected ? handleEliminateError("Seguro desea eliminar la epica?") : setNoEpic("Falta seleccionar una epica");
                                                                 }} endContent={<PlusIcon />} className="btnElimanteEpic" >
                                             Eliminar
                                        </Button>       
                                 </div>
                                
                        
                      
                      <ModalBody>
                            <div className="divBuscador">
                                <Input
                                    isClearable
                                    className="w-full sm:max-w-[100%]"
                                    placeholder="Ingresa una epica..."
                                    startContent={<SearchIcon />}
                                    value={filterValue}
                                    onValueChange={onSearchChange}
                                    variant="faded"
                                />
                            </div>
                            <div className="containerModal">
                                <div className="divEpics">
                                    <UserCardsContext.Provider
                                    value={{ selectEpic, deselectEpic }}
                                    >
                                    <ListEpic lista={listEpics}></ListEpic>
                                    </UserCardsContext.Provider>
                                    {noResults && (
                                        <p className="error-message">
                                            No se encontraron resultados.
                                        </p>
                                    )}
                                </div>    
                            </div>
                            <div className="subcontainer">
                        
                        
                                         {addEpic ? (
                                            //  <input
                                            //  type="text" 
                                            //  autoFocus 
                                            //  className="inputEpica"
                                            //  placeholder="Escribe la nueva epica"
                                            //  value={newEpicName}
                                            //  onChange={(e) => {
                                            //      setNewEpicName(e.target.value);
                                            //      setAddErrorEpic("");
                                            //  }}
                                            //  ></input>
                                             <Input
                                             isClearable
                                             className="w-full sm:max-w-[100%]"
                                             placeholder="Escribe la nueva epica..."
                                             value={newEpicName}
                                             onValueChange={onAddEpicChange}
                                             variant="faded"
                                             isInvalid={isEpicValid}
                                            color={isEpicValid ? "danger" : "default"}
                                            errorMessage={
                                                isEpicValid
                                                ? addErrorEpic
                                                : ""
                                            }
                                         />
                                         ):null}
                                         {/* {addErrorEpic && <p className="error-message">{addErrorEpic}</p>} */}
                                         {noEpic && <p className="error-message">{noEpic}</p>}
                                         {eliminateError && isSelected ? (
                                             <div className="bg-gray-300 bg-opacity-25 p-2 rounded-lg mt-4">
                                                 <p className="error-message">{eliminateError}</p>
                                                 <div className="endButtons">

                                                    <Button isIconOnly color="danger" variant="light" onPress={() => setEliminateError("")}>
                                                        <CrossIcon />
                                                    </Button>
                                                    <Button isIconOnly color="primary" variant="light" onPress={() => EliminateEpic(selectedEpic.nombre)} className="bg-blue-950 text-white">
                                                        <CheckIcon />
                                                    </Button>
                                                </div>
                                            </div>
                                         ) : null}
                                 </div> 
                        
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose} className="">
                          Cancelar
                        </Button>
                        <Button color="primary" onPress={handleInsertEpic} className="bg-blue-950 text-white">
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