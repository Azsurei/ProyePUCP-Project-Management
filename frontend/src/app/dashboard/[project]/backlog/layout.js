"use client";

import NavigationTab from "@/components/NavigationTab";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import {
    Modal, 
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    useDisclosure,
    Input,
    Button,
  } from "@nextui-org/react";
import React, { useState, useEffect, useReducer, useContext } from "react";
import { usePathname } from "next/navigation";
import SaveIcon from '@mui/icons-material/Save';
import { Toaster, toast } from "sonner";
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { SessionContext } from "../../layout";
import { HerramientasInfo } from "../../layout";

export default function RootLayout({ children, params }) {
    const decodedUrl = decodeURIComponent(params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const {herrarmientasInfo}=useContext(HerramientasInfo);
    const isKanbanPage = usePathname() === `/dashboard/${projectName}=${projectId}/backlog/kanban`;
    


    console.log(herrarmientasInfo);
    //Plantillas

    const {
        isOpen: isModalSavePlantilla,
        onOpen: onModalSavePLantilla,
        onOpenChange: onModalSavePlantillaChange,
    } = useDisclosure();

    const {
        isOpen: isModalverPlantillas,
        onOpen: onModalverPlantillas,
        onOpenChange: onModalverPlantillasChange,
    } = useDisclosure();
    const [nombrePlantilla, setNombrePlantilla] = useState("");
    const [validNombrePlantilla, setValidNombrePlantilla] = useState(true);
    const [IdUsuario, setIdUsuario] = useState("");

    //obtener idUsuario
    const {sessionData} = useContext(SessionContext);
    useEffect(() => {
        setIdUsuario(sessionData.idUsuario);
    }, []);

    const [IdKanban,setIdKanban]=useState("");


    const savePlantilla = () => {

        return new Promise((resolve, reject) => {
        //no olvides actualizar el details original con lo ya editado para no recargar toda la pagina
        setIsLoadingSmall(true);
        const updateURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/Kanban/guardarPlantilla";
        axios
            .put(updateURL, {
                nombrePlantilla: nombrePlantilla,
                idUsuario: IdUsuario,
                idKanban: IdKanban,
            })
            .then((response) => {
                console.log(response.data.message);
                setEditActive(false);
                resolve(response);

                setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
                reject(error);
            });

        });
    };

    const guardarPlantillaNueva = async () => {
        try {
            toast.promise(savePlantilla, {
                loading: "Guardando Plantilla Nueva...",
                success: (data) => {
                    return "La plantilla se agregó con éxito!";
                    
                },
                error: "Error al agregar plantilla",
                position: "bottom-right",
            });
            
        } catch (error) {
            throw error; 
        } 
    };


    //Fin Plantillas

    return (

        
        <div className="p-[2.5rem] flex flex-col space-y-2 min-w-[100%] min-h-[100%]">

            {isKanbanPage &&   
                <Modal size="md" isOpen={isModalSavePlantilla} onOpenChange={onModalSavePlantillaChange}>
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
                                try {
                                    await guardarPlantillaNueva();
                                    setNombrePlantilla("");
                                    setValidNombrePlantilla(true);
                                    
                                } catch (error) {
                                    console.error('Error al Guardar Plantilla:', error);
                                }

                                onClose();
                            
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
                                    Se guardarán los campos en una plantilla para poder usarlos en otros proyectos
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
    
                                onClick={() => {
                                    onClose(); // Cierra el modal
                                    setNombrePlantilla("");
                                    setValidNombrePlantilla(true);
    
                                }}
                            
                                >
                                Cancelar
                                
                                </Button>
                                <Button
                                color="primary"
                                
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
            }

        

            <HeaderWithButtonsSamePage
                haveReturn={false}
                haveAddNew={false}
                //handlerAddNew={handlerGoToNew}
                //newPrimarySon={ListComps.length + 1}
                breadcrump={
                    "Inicio / Proyectos / " + projectName + " / Backlog"
                }
                //btnText={"Nueva tarea"}
            >
                Backlog
            </HeaderWithButtonsSamePage>
            
            <div style={{ display: 'flex', flexDirection: 'row' }}>
            <NavigationTab
                listNames={["Kanban", "Sprint Backlog", "Product Backlog"]}
                listGoTo={[
                    `/dashboard/${projectName}=${projectId}/backlog/kanban`,
                    `/dashboard/${projectName}=${projectId}/backlog/sprintBacklog`,
                    `/dashboard/${projectName}=${projectId}/backlog/productBacklog`,
                ]}
            ></NavigationTab>
            

            {isKanbanPage &&
            <div style={{ display: 'flex', marginLeft: 'auto' ,gap:'20px'}}>
            
                    <Button onPress={onModalverPlantillas} color="primary" startContent={<ContentPasteGoIcon />}>

                        Plantillas
                    </Button>

                    
                    <Button onPress={onModalSavePLantilla} color="primary" startContent={<SaveIcon />}>
                        Guardar Plantilla
                    </Button>

                
            </div>
            }

            </div>    
            
            {children}
        </div>
    );
}
