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
import React, { useState, useEffect, useReducer, useContext, createContext } from "react";
import { usePathname } from "next/navigation";
import SaveIcon from '@mui/icons-material/Save';
import { Toaster, toast } from "sonner";
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { SessionContext } from "../../layout";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/productBacklog/plantillaKB.css";
import { set } from "date-fns";
export const FlagRefreshContext = createContext();
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { SearchIcon } from "@/../public/icons/SearchIcon";


export default function RootLayout({ children, params }) {
    const decodedUrl = decodeURIComponent(params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const [error, setError] = useState(null);


    const decodedProjectName = decodeURIComponent(projectName);
    const constructedUrl = new URL(`/dashboard/${decodedProjectName}=${projectId}/backlog/kanban`, window.location.origin);
    const isKanbanPage = usePathname() === constructedUrl.pathname;
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


    const savePlantillaKB = () => {
        return new Promise((resolve, reject) => {
        const updateURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/plantillas/guardarPlantillaKanban";

        axios
            .post(updateURL, {
                nombrePlantilla: nombrePlantilla,
                idUsuario: IdUsuario,
                idProyecto: projectId,
            })
            .then((response) => {
                console.log(response.data.message);
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
            await toast.promise(savePlantillaKB, {
                loading: "Guardando PsavePlantillalantilla Nueva...",
                success: (data) => {
                    DataTable();
                    return "La plantilla se agregó con éxito!";
                    
                },
                error: "Error al agregar plantilla",
                position: "bottom-right",
            });
            
        } catch (error) {
            throw error; 
        } 
    };

    const [plantillas, setPlantillas] = useState([]);
    const [selectedPlantilla, setSelectedPlantilla] = useState(null);


    const DataTable = async () => {
    const fetchPlantillas = async () => {
        try {
          const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/proyecto/plantillas/listarPlantillasKanban/' + IdUsuario;
          const response = await axios.get(url);
          const plantillasInvertidas = response.data.plantillasKanban.reverse();
          setPlantillas(plantillasInvertidas);
        } catch (error) {
          console.error("Error al obtener las plantillas:", error);
        }
      };
      fetchPlantillas();
    };
    
      useEffect(() => {
        if (IdUsuario !== "") {
            DataTable();
        }
      }, [IdUsuario]);

      const handlePlantillaClick = (plantilla) => {
        setSelectedPlantilla(plantilla);
        setError(null);
        console.log("Plantilla seleccionada:", plantilla.nombrePlantilla);

      };

    const [flagRefresh,setFlagRefresh] = useState(false);

    const usePlantillaKanban = () => {
        return new Promise((resolve, reject) => {
            console.log("idProyecto:"+ projectId);
            console.log("idPlantillaKanban:"+ selectedPlantilla.idPlantillaKanban);
            const updateData = {
                idProyecto: projectId,
                idPlantillaKanban: selectedPlantilla.idPlantillaKanban,
                
            };
    
            const updateURL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/proyecto/plantillas/seleccionarPlantillaKanban";
    
            axios
                .put(updateURL, updateData)
                .then((response) => {
                    setFlagRefresh(true);
                    resolve(response);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                })

        });
    };

    const usarPlantilla = async () => {
        try {
            toast.promise(usePlantillaKanban, {
                loading: "Cargando Plantilla...",
                success: (data) => {
                    return "La plantilla se cargó con éxito!";
                    
                },
                error: "Error al usar plantilla",
                position: "bottom-right",
            });
            
        } catch (error) {
            throw error; 
        }

    };
    const [plantillaElegida, setPlantillaElegida] = useState(false);


    //Fin Plantillas

    //Buscar PLantilla
    const [filterValue, setFilterValue] = useState("");  
    const onSearchChange = (value) => {
        setFilterValue(value);
    };

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

            {isKanbanPage &&   
                     <Modal size="lg" isOpen={isModalverPlantillas} onOpenChange={onModalverPlantillasChange}>
                     <ModalContent>
                     {(onClose) => { 

                            const finalizarModalP = async () => {
                                let Isvalid = true;
                                if (selectedPlantilla === null) {
                                    setPlantillaElegida(false);
                                    Isvalid = false;
                                }

                                if(Isvalid === true){
                                    try {
                                        await usarPlantilla();
                                        setPlantillaElegida(false);
                                        
                                    } catch (error) {
                                        console.error('Error al Utilizar Plantilla:', error);
                                    }
                                    onClose();
                                    DataTable();

 
                                }
                                else{
                                    setError("Seleccione una plantilla");
                                    console.log("algo pasa xd")
                                }
                            };

                        


                        return ( 
                             <>
               
                         <ModalHeader className="flex flex-col gap-1">
                             Plantillas Kanban
                         </ModalHeader>
                         <ModalBody>
                         <div className="modal-body">

                            <div style={{ marginBottom: '25px' }}>
                                <p style={{ fontSize: "15px" }}>Seleccione una plantilla para cargar los campos:</p>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    gap: ".6rem",
                                    marginBottom:"25px",
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
                                        variant="faded"
                                    />
                                </div>
                                <Button
                                    className="text-slate-50"
                                    color="primary"
                                    // onClick={refreshList}
                                >
                                    Buscar
                                </Button>
                            </div>


                           <ul>
                                {plantillas.map((plantilla) => (
                                    <li key={plantilla.idPlantillaKanban}>
                                    <div className={`cardPlantillaKB ${selectedPlantilla === plantilla ? 'selected' : ''}`}

                                        onClick={() => handlePlantillaClick(plantilla)}>
                                        {plantilla.nombrePlantilla}
                                        
                                        </div>
                                    </li>
                                ))}
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
                           onPress={finalizarModalP}
                           >
                           Continuar
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

                    
                    <Button onPress={onModalSavePLantilla} color="primary" startContent={<SaveAsIcon />}>
                        Guardar Plantilla
                    </Button>

                
            </div>
            }

            </div>    
        
            <FlagRefreshContext.Provider value={{flagRefresh,setFlagRefresh}}>
                {children}
            </FlagRefreshContext.Provider>
        </div>
    );
}
