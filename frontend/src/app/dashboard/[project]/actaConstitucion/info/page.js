"use client";
import TextInfoCard from "@/components/dashboardComps/projectComps/appConstComps/TextInfoCard";
import ButtonPanel from "@/components/dashboardComps/projectComps/appConstComps/ButtonPanel";
import Button from "@/components/dashboardComps/projectComps/appConstComps/Button";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import React, { useState, useEffect, useReducer, useContext } from "react";
import AddIcon from "@/components/dashboardComps/projectComps/appConstComps/AddIcon.svg";
import EditIcon from "../../../../../../public/images/EditIcon.svg";
import DocumentFilledIcon from "../../../../../../public/images/DocumentFilledIcon.svg";
import CrossIcon from "../../../../../../public/images/CrossIcon.svg";
import axios from "axios";
import { SmallLoadingScreen } from "../../layout";
axios.defaults.withCredentials = true;
import SaveIcon from '@mui/icons-material/Save';
import "../../../../../styles/dashboardStyles/projectStyles/actaConstStyles/TextInfoCard.css";
import "../../../../../styles/dashboardStyles/projectStyles/actaConstStyles/CardItem.css";
import "@/styles/dashboardStyles/projectStyles/actaConstStyles/infoPage.css";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    useDisclosure,
    Button as NextUIButton,
    CircularProgress,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import {Input} from "@nextui-org/react";

import { flushSync } from "react-dom";
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { set } from "date-fns";
import { HerramientasInfo } from "../../layout";
import { useRouter } from "next/navigation";
import { SessionContext } from "@/app/dashboard/layout";

import { SearchIcon } from "@/../public/icons/SearchIcon";
import SaveAsIcon from '@mui/icons-material/SaveAs';

import ModalPlantilla from "@/components/dashboardComps/projectComps/appConstComps/ModalPlantilla";
import DateInput from "@/components/DateInput";
function DetailCard({
    detail,
    handleModifyTitle,
    handleModifyField,
    handleDeleteField,
    isEditable,
}) {
    return (
        <div
            className={
                isEditable
                    ? "projectCardContainer delete"
                    : "projectCardContainer"
            }
        >
            <div className="project-card">
                {!isEditable && (
                    <div className="project-card__title dark:text-white">{detail.nombre}</div>
                )}
                {isEditable && (
                    <Textarea
                        //isInvalid={!validDescripcion}
                        //errorMessage={!validDescripcion ? msgEmptyField : ""}
                        //key={"bordered"}
                        aria-label="custom-txt"
                        variant={isEditable ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder={
                            isEditable
                                ? "Escribe aquí!"
                                : "Aún no tiene información."
                        }
                        classNames={{
                            label: "pb-0",
                            input: "text-lg font-bold",
                        }} //falta setear un tamano al textbox para que no cambie de tamano al cambiar de no editable a editable
                        readOnly={!isEditable}
                        value={detail.nombre === null ? "" : detail.nombre}
                        //onValueChange={setTareaDescripcion}
                        minRows={1}
                        size="sm"
                        onChange={(e) => {
                            handleModifyTitle(detail.idDetalle, e.target.value);
                        }}
                    />
                )}

                <Textarea
                    //isInvalid={!validDescripcion}
                    //errorMessage={!validDescripcion ? msgEmptyField : ""}
                    //key={"bordered"}
                    aria-label="custom-txt"
                    variant={isEditable ? "bordered" : "flat"}
                    labelPlacement="outside"
                    placeholder={
                        isEditable
                            ? "Escribe aquí!"
                            : "Aún no tiene información."
                    }
                    classNames={{ label: "pb-0" }} //falta setear un tamano al textbox para que no cambie de tamano al cambiar de no editable a editable
                    readOnly={!isEditable}
                    value={detail.detalle === null ? "" : detail.detalle}
                    //onValueChange={setTareaDescripcion}
                    minRows={1}
                    size="sm"
                    onChange={(e) => {
                        handleModifyField(detail.idDetalle, e.target.value);
                    }}
                />
            </div>
            {isEditable && (
                <img
                    src="/icons/whiteTrash.svg"
                    className="cardDeleteIcn show"
                    onClick={() => handleDeleteField(detail)}
                />
            )}
        </div>
    );
}

export default function Info(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();


    // Manejando la carga de la lista de detalles de acta de constitucion
    const [details, setDetails] = useState([]);
    const [detailEdited, setDetailsEdited] = useState([]);

    // Manejando estados de los botones
    const [isEditActive, setEditActive] = useState(false);

    // Para nuevo campo
    const [isNewFieldOpen, setIsNewFieldOpen] = useState("");
    const [newFieldTitle, setNewFieldTitle] = useState("");
    const [validNewTitle, setValidNewTitle] = useState(true);
    const [newFieldDetail, setNewFieldDetail] = useState("");

    const [isNewLoading, setIsNewLoading] = useState(false);

    // Para eliminar campo
    const [fieldToDelete, setFieldToDelete] = useState(null);

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

    const [nombreProyecto, setNombreProyecto] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [cliente, setCliente] = useState('');
    const [patrocinador, setPatrocinador] = useState('');
    const [gerente, setGerente] = useState('');
    const [fechaCreacion, setFechaCreacion] = useState('');

    const formatDateForInput = (dateString) => {
        // Check if dateString is not null, undefined, or an empty string
        if (!dateString) {
            return '';
        }

        // Parse the date using the Date constructor
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date)) {
            // Handle invalid date, perhaps set a default or return an empty string
            console.error('Invalid date string provided: ' + dateString);
            return '';
        }

        // Ensure the date is converted to UTC
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = date.getUTCDate().toString().padStart(2, '0');

        // Format the date to YYYY-MM-DD
        return `${year}-${month}-${day}`;
    };


    const actualizarListado = () => {
        setIsLoadingSmall(true);
        const listURL =
            process.env.NEXT_PUBLIC_BACKEND_URL + "/api/proyecto/ActaConstitucion/listarActaConstitucion/" +
            projectId;
        axios
            .get(listURL)
            .then((response) => {

                const data = response.data.detalleAC.general[0];

                setIdActa(data.idActaConstitucion);
                setNombreProyecto(data.nombreProyecto);
                setEmpresa(data.empresa);
                setCliente(data.cliente);
                setPatrocinador(data.patrocinador);
                setGerente(data.gerente);
                setFechaCreacion(formatDateForInput(data.fechaCreacion));

                setDetails(response.data.detalleAC.actaData);
                setDetailsEdited(response.data.detalleAC.actaData);
                setIsLoadingSmall(false);
                DataTable();
            })
            .catch(function (error) {
                console.log(error);
            });


    };
    
    useEffect(() => {
        actualizarListado();
    }, []);
    

    const updateListado = () => {
        actualizarListado();
    };

    const handleCancelEdit = () => {
        //reestablecemos el arreglo con lo que estaba originalmente en el arreglo del fetch
        setDetailsEdited([...details]);
        setEditActive(false);
    };



    const handleSave = () => {
        setIsLoadingSmall(true);
        const updateURL = process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/ActaConstitucion/modificarCampos";

        axios.put(updateURL, {
            idProyecto: projectId,
            nombreProyecto: nombreProyecto,
            empresa: empresa,
            cliente: cliente,
            patrocinador: patrocinador,
            gerente: gerente,
            actaData: detailEdited,
        })
            .then((response) => {
                console.log(response.data.message);
                setDetails([...detailEdited]);
                setEditActive(false);
                setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    };


    //Guardar Plantilla de AC

    const [isModalOpen, setIsModalOpen] = useState(false);

    // La función que recibiría la plantilla seleccionada

    
    const [nombrePlantilla, setNombrePlantilla] = useState("");
    const [validNombrePlantilla, setValidNombrePlantilla] = useState(true);
    const [IdUsuario, setIdUsuario] = useState("");

    //Obtener idHerramienta AC
    const {herramientasInfo} = useContext(HerramientasInfo);
    const [IdActa,setIdActa]= useState("");



    //obtener idUsuario
    const {sessionData} = useContext(SessionContext);


    const savePlantilla = () => {

        return new Promise((resolve, reject) => {
        //no olvides actualizar el details original con lo ya editado para no recargar toda la pagina
        setIsLoadingSmall(true);
        const updateURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/plantillas/guardarPlantillaAC";
        axios
            .post(updateURL, {
                nombrePlantilla: nombrePlantilla,
                idUsuario: sessionData.idUsuario,
                idActaConstitucion: IdActa,
            })
            .then((response) => {
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

    const usarPlantilla = async () => {
        try {
            toast.promise(usePlantillaAC, {
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

    const usePlantillaAC = () => {
        return new Promise((resolve, reject) => {
            setIsLoadingSmall(true);
    
            const updateData = {
                idActaConstitucion: IdActa,
                idPlantillaAC: selectedPlantilla.idPlantillaAC,
                
            };
    
            const updateURL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/proyecto/plantillas/seleccionarPlantillaAC";
    
            axios
                .put(updateURL, updateData)
                .then((response) => {
                    setEditActive(false);
                    resolve(response);
                })
                .catch(function (error) {
                    console.log(error);
                    reject(error);
                })
                .finally(() => {
                    setIsLoadingSmall(false);
                });
        });
    };

    //Fin Plantilla AC

    const handleAddField = () => {
        setEditActive(false);

        flushSync(() => {
            setIsNewFieldOpen(true);
        });

        const element = document.getElementById("new-field-created");
        element.scrollIntoView({ behavior: "smooth" });
    };

    const handleCancelNewField = () => {
        setNewFieldTitle("");
        setNewFieldDetail("");
        setIsNewFieldOpen(false);
    };

    const handleSaveNewField = async () => {
        setIsNewFieldOpen(false);
        setIsNewLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {}
        const addNewURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/ActaConstitucion/crearCampos";
        axios
            .post(addNewURL, {
                idProyecto: projectId,
                nombreCampo: newFieldTitle,
                detalleCampo: newFieldDetail,
            })
            .then((response) => {
                console.log(response.data.message);
                // tenemos que actualizar ambas listas de details setDetails([...detailEdited]);
                console.log(
                    "NUEVO CAMPO DATA======= : " +
                        JSON.stringify(response.data.campoCreado)
                );
                setDetails([...details, response.data.campoCreado]);
                setDetailsEdited([...detailEdited, response.data.campoCreado]);
                handleCancelNewField();
                setIsNewLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    };



    const handleDeleteField = (detail) => {
        setFieldToDelete(detail);
        onOpen();
    };

    const updateTitle = (id, newTitle) => {
        const updatedDetails = detailEdited.map((item) => {
            if (item.idDetalle === id) {
                // Update 'detalle' for the element with the specified id
                return { ...item, nombre: newTitle };
            }
            return item;
        });
        setDetailsEdited(updatedDetails);
    };

    const updateDetail = (id, newDetail) => {
        const updatedDetails = detailEdited.map((item) => {
            if (item.idDetalle === id) {
                // Update 'detalle' for the element with the specified id
                return { ...item, detalle: newDetail };
            }
            return item;
        });
        setDetailsEdited(updatedDetails);
    };

    const deleteDetail = () => {
        console.log(JSON.stringify(fieldToDelete));
        const deleteURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/ActaConstitucion/eliminarCampo";
        axios
            .put(deleteURL, {
                idDetalle: fieldToDelete.idDetalle,
            })
            .then((response) => {
                console.log(response.data.message);

                //setIsNewLoading(false);

                const newList = details.filter(
                    (item) => item.idDetalle !== fieldToDelete.idDetalle
                );

                setDetails(newList);
                setDetailsEdited(newList);

                setFieldToDelete(null);
            })
            .catch(function (error) {
                console.log(error);
            });
    };


    const [plantillas, setPlantillas] = useState([]);
    const [selectedPlantilla, setSelectedPlantilla] = useState(null);
    const [plantillaElegida, setPlantillaElegida] = useState(false);

    const handlePlantillaClick = (plantilla) => {
        setSelectedPlantilla(plantilla);
        setPlantillaElegida(true);
        setError(null);
        console.log("Plantilla seleccionada:", plantilla.nombrePlantilla);

      };

      const DataTable = async () => {
        const fetchPlantillas = async () => {
          
            try {
                const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/proyecto/plantillas/listarPlantillasAC/' + sessionData.idUsuario;

                const response = await axios.get(url);

                const plantillasInvertidas = response.data.plantillasAC.reverse();

                setPlantillas(plantillasInvertidas);
            } catch (error) {
                console.error("Error al obtener las plantillas:", error);
            }
        
        };
    
        fetchPlantillas();
    };
    
    


      const [error, setError] = useState(null);
      //Buscar PLantilla
      const [filterValue, setFilterValue] = useState("");  
      const onSearchChange = (value) => {
          setFilterValue(value);
      };

      const limpiarInput = () => {
            setFilterValue("");
            DataTable();
      }


      //lamado a la api de listar PLantillas por Nombre

      const refreshList = async () => {
        if (filterValue !== "") {
            try {
                const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/proyecto/plantillas/listarPlantillasACXNombre/' + sessionData.idUsuario+'/'+filterValue;

                const response = await axios.get(url);

                const plantillasInvertidas = response.data.plantillasAC;
                console.log(plantillasInvertidas);

                setPlantillas(plantillasInvertidas);
            } catch (error) {
                console.error("Error al obtener las plantillas:", error);
            }
            }
        }

  


    return (
        <div className="ACInfoContainer">
            
            {<Modal size="md" isOpen={isModalSavePlantilla} onOpenChange={onModaSavePlantillaChange}>
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
                                <NextUIButton
                                color="danger" variant="light" 
   
                                onClick={() => {
                                    onClose(); // Cierra el modal
                                    setNombrePlantilla("");
                                    setValidNombrePlantilla(true);
  
                                }}
                            
                                >
                                Cancelar
                                
                                </NextUIButton>
                                <NextUIButton
                                    className="bg-generalBlue text-white font-medium"
                                    onClick={finalizarModal}
                                >
                                Guardar Plantilla
                                </NextUIButton>
                            </ModalFooter>
                            </>
                        );
                        }}
                    </ModalContent>
            </Modal>
            }

            
            {<Modal size="lg" isOpen={isModalPlantillas} onOpenChange={onModalPlantillasChange}>
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
                        updateListado();
                        DataTable(); // Llamada a fetchPlantillas después de usar la plantilla


                        setTimeout(() => {
                            updateListado();
                        }, 2000);
                        setFilterValue(""); 
                    }
                    else{
                        setError("Seleccione una plantilla");
                    }
                };

                return ( 
                    <>
        
                <ModalHeader className="flex flex-col gap-1">
                    Plantillas Acta de Constitución
                </ModalHeader>
                <ModalBody>
                <div className="modal-body">
                    
                    <div style={{ marginBottom: '25px' }}>

                    <p style={{ fontSize: "15px" }}>Seleccione una plantilla para cargar los campos</p>
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
                            onClear={limpiarInput}
                            variant="faded"
                        />
                    </div>
                    <NextUIButton
                        className="bg-generalBlue text-white font-medium"
                        onClick={refreshList}
                    >
                        Buscar
                    </NextUIButton>
                </div>




                    <ul className="cardPlantillaACList">
                    {plantillas.map((plantilla) => (
                        <li key={plantilla.idPlantillaAC}>
                            <div
                                className={`cardPlantillaAC ${selectedPlantilla && selectedPlantilla === plantilla ? 'selected' : ''}`}
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
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        
                </div>
        
                    <NextUIButton
                        color="danger" variant="light" 
            
                        onClick={() => {
                            onClose(); // Cierra el modal
                            setSelectedPlantilla(null);
                            setError(null); // Establece error en null para desactivar el mensaje de error
                            limpiarInput();                                
                        }}
                        
                        >
                        Cancelar
                    
                    </NextUIButton>
                    <NextUIButton
                        className="bg-generalBlue text-white font-medium"
                        onClick={finalizarModalP}
                    >
                    Usar
                    </NextUIButton>
                </ModalFooter>
                </>
            );
            }}
        
            </ModalContent>
        
            </Modal>
            }




            {!isEditActive ? (
                <ButtonPanel margin="10px 0 15px" align="right">
                    {sessionData.rolNameInProject !== "Supervisor" && (
                        <>
                            <Dropdown>
                                <DropdownTrigger>
                                    <NextUIButton color="secondary">Plantillas</NextUIButton>
                                </DropdownTrigger>
                                <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
                                    <DropdownItem key="verPlantillasAC" startContent={<ContentPasteGoIcon />} onPress={() => { DataTable();
                                     onModalPlantillas(); }}
                                    color="secondary">
                                        Ver Plantillas
                                    </DropdownItem>
                                    <DropdownItem key="guardarPlantillasAC" startContent={<SaveAsIcon />} onPress={onSaveModalPlantilla} color="secondary">
                                        Guardar Plantilla
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Button appearance="primary" state="default" spacing="compact" onClick={() => { setEditActive(true); handleCancelNewField(); }}>
                                <div><EditIcon /><div>Editar</div></div>
                            </Button>
                            <Button appearance="primary" state="default" spacing="compact" onClick={handleAddField}>
                                <div style={{ display: "flex", flexDirection: "row", gap: ".4rem", }}>
                                    <div style={{ fontSize: "2rem" }}>+</div>
                                    <div>Agregar Campo</div>
                                </div>
                            </Button>
                        </>
                    )}
                </ButtonPanel>
            ) : (
                <ButtonPanel margin="10px 0 15px" align="right">
                    <Button appearance="primary" state="default" spacing="compact" onClick={handleSave}>
                        <div><DocumentFilledIcon /><div>Guardar</div></div>
                    </Button>
                    <Button appearance="subtle" state="default" spacing="compact" onClick={handleCancelEdit}>
                        <div><CrossIcon /><div>Cancelar</div></div>
                    </Button>
                </ButtonPanel>
            )}


            <div className="fieldsBigContainer">
                <div className="flex flex-row w-full border shadow-sm rounded-md p-3">
                    <div className="flex flex-col flex-1 mr-3">
                        <div className="project-card__title dark:text-white">Proyecto</div>
                        <Textarea
                            variant={isEditActive ? "bordered" : "flat"}
                            value={projectName}
                            isDisabled
                            minRows={1}
                            size="sm"
                        ></Textarea>
                    </div>
                    <div className="flex flex-col flex-1 mx-3">
                        <div className="project-card__title dark:text-white">Empresa/Organización</div>
                        <Textarea
                            variant={isEditActive ? "bordered" : "flat"}
                            value={empresa}
                            onValueChange={setEmpresa}
                            disabled={!isEditActive} // Disable when not in edit mode
                            minRows={1}
                            size="sm"
                        ></Textarea>
                    </div>
                    <div className="flex flex-col flex-1 ml-3">
                        <div className="project-card__title dark:text-white">Fecha de preparación</div>
                        <Input
                            type="date"
                            value={formatDateForInput(fechaCreacion)}
                            onChange={(e) => setFechaCreacion(e.target.value)}
                            disabled={!isEditActive} // Disable when not in edit mode
                        />
                    </div>
                </div>
                <div className="flex flex-row w-full border shadow-sm rounded-md p-3 mt-3">
                    <div className="flex flex-col flex-1 mr-3">
                        <div className="project-card__title dark:text-white">Cliente</div>
                        <Textarea
                            variant={isEditActive ? "bordered" : "flat"}
                            value={cliente}
                            onValueChange={setCliente}
                            disabled={!isEditActive}
                            minRows={1}
                            size="sm"
                        ></Textarea>
                    </div>
                    <div className="flex flex-col flex-1 mx-3">
                        <div className="project-card__title dark:text-white">Patrocinador</div>
                        <Textarea
                            variant={isEditActive ? "bordered" : "flat"}
                            value={patrocinador}
                            onValueChange={setPatrocinador}
                            disabled={!isEditActive}
                            minRows={1}
                            size="sm"
                        ></Textarea>
                    </div>
                    <div className="flex flex-col flex-1 ml-3">
                        <div className="project-card__title dark:text-white">Gerente</div>
                        <Textarea
                            variant={isEditActive ? "bordered" : "flat"}
                            value={gerente}
                            onValueChange={setGerente}
                            disabled={!isEditActive}
                            minRows={1}
                            size="sm"
                        ></Textarea>
                    </div>
                </div>
                {detailEdited.map((detail) => (
                    <DetailCard
                        key={detail.idDetalle}
                        detail={detail}
                        handleModifyTitle={updateTitle}
                        handleModifyField={updateDetail}
                        handleDeleteField={handleDeleteField}
                        isEditable={isEditActive}
                    />
                ))}

                {isNewFieldOpen && (
                    <div className="newFieldContainer dark:bg-black" id="new-field-created">
                        <div className="newFieldHeader">
                            <Textarea
                                isInvalid={!validNewTitle}
                                errorMessage={
                                    !validNewTitle
                                        ? "Debes introducir el titulo"
                                        : ""
                                }
                                aria-label="custom-txt"
                                variant={"bordered"}
                                labelPlacement="outside"
                                placeholder={"Nuevo titulo"}
                                classNames={{
                                    label: "pb-0",
                                    input: "text-lg",
                                }}
                                value={newFieldTitle}
                                onValueChange={setNewFieldTitle}
                                minRows={1}
                                size="sm"
                                onChange={() => {
                                    setValidNewTitle(true);
                                }}
                                autoFocus={true}
                            />

                            <div className="newFieldImgsContainer">
                                <img
                                    src="/icons/icon-confirm.svg"
                                    className="newFieldConfirm"
                                    onClick={() => {
                                        if (newFieldTitle === "") {
                                            setValidNewTitle(false);
                                        } else {
                                            console.log(
                                                "Registrando nuevo campo"
                                            );
                                            handleSaveNewField();
                                        }
                                    }}
                                />
                                <img
                                    src="/icons/icon-crossBlue.svg"
                                    className="newFieldCancel"
                                    onClick={handleCancelNewField}
                                />
                            </div>
                        </div>
                        <div className="newFieldDetail">
                            <Textarea
                                //isInvalid={!validNewTitle}
                                //errorMessage={
                                //    !validNewTitle ? "Debes introducir el titulo" : ""
                                //}
                                //key={"bordered"}
                                aria-label="custom-txt"
                                variant={"bordered"}
                                labelPlacement="outside"
                                placeholder={"Contenido del nuevo campo"}
                                classNames={{ label: "pb-0" }}
                                //readOnly={!isEditable}
                                value={newFieldDetail}
                                onValueChange={setNewFieldDetail}
                                minRows={2}
                                size="sm"
                                //onChange={() => {
                                //    setValidNewTitle(true);
                                //}}
                            />
                        </div>
                    </div>
                )}
                {isNewLoading && (
                    <div
                        style={{
                            width: "auto",
                            height: "auto",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <CircularProgress aria-label="Loading..." size="lg" />
                    </div>
                )}
            </div>

            {isEditActive && (
                <ButtonPanel margin="1.5rem 0 0" align="right">
                    <Button
                        appearance="primary"
                        state="default"
                        spacing="compact"
                        onClick={handleSave}
                    >
                        <div>
                            <DocumentFilledIcon />
                            <div>Guardar</div>
                        </div>
                    </Button>
                    <Button
                        appearance="subtle"
                        state="default"
                        spacing="compact"
                        onClick={handleCancelEdit}
                    >
                        <div>
                            <CrossIcon />
                            <div>Cancelar</div>
                        </div>
                    </Button>
                </ButtonPanel>
            )}

            {
                <Modal
                    onOpenChange={onOpenChange}
                    isDismissable={false}
                    isOpen={isOpen}
                    classNames={{
                        header: "pb-0",
                        body: "pb-0",
                        footer: "pt-3",
                    }}
                >
                    <ModalContent>
                        {(onClose) => {
                            const cancelarModal = () => {
                                setFieldToDelete(null);
                                onClose();
                            };
                            const cerrarModal = () => {
                                //mandamos a eliminar el seleccionado
                                deleteDetail();
                                onClose();
                            };
                            return (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        Eliminar campo
                                    </ModalHeader>
                                    <ModalBody>
                                        <p>
                                            ¿Seguro que desea eliminar este
                                           campo?
                                        </p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <NextUIButton
                                            color="danger"
                                            variant="light"
                                            onPress={cancelarModal}
                                        >
                                            Cancelar
                                        </NextUIButton>
                                        <NextUIButton
                                            color="primary"
                                            onPress={cerrarModal}
                                        >
                                            Eliminar
                                        </NextUIButton>
                                    </ModalFooter>
                                </>
                            );
                        }}
                    </ModalContent>
                </Modal>
            }
        </div>
    );
}
