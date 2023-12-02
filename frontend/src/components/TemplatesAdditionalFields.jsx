import { v4 } from "uuid";
import "@/styles/TemplatesExtras.css";
import { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import axios from "axios";
axios.defaults.withCredentials = true;

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
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { SessionContext } from "@/app/dashboard/layout";

function TemplatesAdditionalFields({ setBaseFields,baseFields,editState }) {
    if(editState===false){

        return null;
    }
    const { sessionData, setSessionData } = useContext(SessionContext);


    const [isLoading,setIsLoading]=useState(false);

    const guardarPlantillaNueva  = async () => {
        setIsLoading(true);

        const titulos = baseFields.map(function(elemento) {
            return elemento.titulo;
        });

        const titulosFiltrados = titulos.filter(function(titulo) {
            // Usa trim() para eliminar espacios en blanco al principio y al final
            return titulo.trim() !== '';
          });

        if(titulosFiltrados.length===0){
            toast.error("No hay campos para guardar");
            setIsLoading(false);
            return 0;
        }

        const updateURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/plantillas/guardarPlantillaCA";
            
        try{
            const response = await axios.post(updateURL, {
                nombrePlantilla: nombrePlantilla,
                idUsuario: sessionData.idUsuario,
                titulos: titulosFiltrados,
            });

            console.log(response);
            return 1;
        }
        catch(error){
            console.error('Error al Guardar Plantilla:', error);
            return 0;
        }
    
        
    };


    const [nombrePlantilla, setNombrePlantilla] = useState("");
    const [validNombrePlantilla, setValidNombrePlantilla] = useState(true);

    const { 
        isOpen: isModalSavePlantilla, 
        onOpen: onSaveModalPlantilla, 
        onOpenChange: onModaSavePlantillaChange 
    
    
    } = useDisclosure();

    const { 
        isOpen: isModalPlantillas, 
        onOpen: onModalPlantillas, 
        onOpenChange: onModalPlantillasChange 
    
    
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


    return (

        <div>
            <Modal size="md" isOpen={isModalSavePlantilla} onOpenChange={onModaSavePlantillaChange}>
                    <ModalContent>
                        {(onClose) => {
                        const finalizarModal = async () => {
                            let Isvalid = true;

                            if(nombrePlantilla===""){
                                setValidNombrePlantilla(false);
                                Isvalid = false;
                            }

                            if(Isvalid === true){
                                console.log("IdUsuario: "+ sessionData.idUsuario);
                          
                                const response=await guardarPlantillaNueva();

                                if(response===1){
                                    setNombrePlantilla("");
                                    setValidNombrePlantilla(true);
                                    onClose();
                                    toast.success("Plantilla Guardada");
                                    setIsLoading(false);
                                }
                                else{
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
                                    Se guardarán los campos en una plantilla para poder usarlos en otros proyectos.
                                    </p>

                                    <Input type="email" variant={"underlined"} label="Nombre Plantilla" 
                                        value={nombrePlantilla}
                                        onValueChange={setNombrePlantilla}
                                        isInvalid={!validNombrePlantilla}
                                        onChange={()=>{setValidNombrePlantilla(true)}}    
                                        errorMessage={
                                                    !validNombrePlantilla
                                                        ? "Ingrese un nombre"
                                                        : ""
                                            }
                                    
                                    />

                                    <div>


                                    </div>
                                </ModalBody>
                                  

                            <ModalFooter>
                                <Button
                                color="danger" variant="light" 
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
            
        <Dropdown>
            <DropdownTrigger>
                <Button className="btnPlantilla" color="secondary">Plantillas</Button>
            </DropdownTrigger>
            <DropdownMenu
                variant="faded"
                aria-label="Dropdown menu with icons"
            >
                <DropdownItem
                    key="verPlantillasAC"
                    startContent={<ContentPasteGoIcon />}
                    onPress={onModalPlantillas}
                    color="secondary"
                >
                    Ver Plantillas
                </DropdownItem>
                <DropdownItem
                    key="guardarPlantillasAC"
                    startContent={<SaveAsIcon />}
                    onPress={()=>{
                        const titulos = baseFields.map(function(elemento) {
                            return elemento.titulo;
                        });

                        if(titulos.length===0){
                            toast.error("No hay campos para guardar");   
                            return 0;
                        }else{

                            const titulosFiltrados = titulos.filter(function(titulo) {
                                // Usa trim() para eliminar espacios en blanco al principio y al final
                                return titulo.trim() !== '';
                              });
                    
                            if(titulosFiltrados.length===0){
                                toast.error("No hay campos para guardar con titulos");
                                setIsLoading(false);
                                return 0;
                            }else{
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
