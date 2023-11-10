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
} from "@nextui-org/react";
import {Input} from "@nextui-org/react";

import { flushSync } from "react-dom";
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import { set } from "date-fns";
import { SessionContext } from "../../../layout";
import { HerramientasInfo } from "../../layout";
import { useRouter } from "next/navigation";



import ModalPlantilla from "@/components/dashboardComps/projectComps/appConstComps/ModalPlantilla";

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
                    <div className="project-card__title">{detail.nombre}</div>
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
                        value={detail.nombre}
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
            <img
                src="/icons/whiteTrash.svg"
                className={isEditable ? "cardDeleteIcn show" : "cardDeleteIcn"}
                onClick={() => {
                    handleDeleteField(detail);
                }}
            />
        </div>
    );
}

export default function Info(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();

    const handleRecargarPagina = () => {
        console.log("xd");
        router.refresh();
  
    };




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


    const actualizarListado = () => {
        setIsLoadingSmall(true);
        const listURL =
            process.env.NEXT_PUBLIC_BACKEND_URL + "/api/proyecto/ActaConstitucion/listarActaConstitucion/" +
            projectId;
        axios
            .get(listURL)
            .then((response) => {
                setIdActa(response.data.detalleAC.general[0].idActaConstitucion);
                setDetails(response.data.detalleAC.actaData);
                setDetailsEdited(response.data.detalleAC.actaData);
                setIsLoadingSmall(false);
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
        //no olvides actualizar el details original con lo ya editado para no recargar toda la pagina
        setIsLoadingSmall(true);
        const updateURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/ActaConstitucion/modificarCampos";
        axios
            .put(updateURL, {
                idProyecto: projectId,
                nombreProyecto: "test",
                empresa: "test",
                cliente: "test",
                patrocinador: "test",
                gerente: "test",
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
    useEffect(() => {
        setIdUsuario(sessionData.idUsuario);
      }, [sessionData.idUsuario]);

    const savePlantilla = () => {

        return new Promise((resolve, reject) => {
        //no olvides actualizar el details original con lo ya editado para no recargar toda la pagina
        setIsLoadingSmall(true);
        const updateURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/plantillas/guardarPlantillaAC";
        axios
            .post(updateURL, {
                nombrePlantilla: nombrePlantilla,
                idUsuario: IdUsuario,
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


    const fetchPlantillas = async () => {
        try {
          const url = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/proyecto/plantillas/listarPlantillasAC/' + IdUsuario;
          const response = await axios.get(url);
    
          response.data.plantillasAC.forEach((plantilla) => {
            console.log("Nombre de la plantilla:", plantilla.nombrePlantilla); // Accede a la propiedad 'nombre' (ajusta según la estructura de tus objetos)
            // Agrega más líneas para acceder a otras propiedades si es necesario
        });
          setPlantillas(response.data.plantillasAC);
        } catch (error) {
          console.error("Error al obtener las plantillas:", error);
        }
      };
    
      useEffect(() => {
        if (IdUsuario !== null) {
          fetchPlantillas();
        }
      }, [IdUsuario]);

      const [error, setError] = useState(null);






    return (
        <div className="ACInfoContainer">
            <Toaster 
                richColors 
                closeButton={true}
                toastOptions={{
                    style: { fontSize: "1rem" },
                }}
                />
            
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
                                console.log("IdUsuario: "+ sessionData.idUsuario);
                                try {
                                    await guardarPlantillaNueva();
                                    setNombrePlantilla("");
                                    setValidNombrePlantilla(true);
                                    console.log("xd");
                                    
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
                                color="primary"
                                
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

                        setTimeout(() => {
                            updateListado();
                        }, 2000);
                    
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

                    <p style={{ fontSize: "15px" }}>Seleccione una plantilla para cargar los campos:</p>
                    </div>
                    <ul>
                        {plantillas.map((plantilla) => (
                            <li key={plantilla.id}>
                            <div className={`cardPlantillaAC ${selectedPlantilla === plantilla ? 'selected' : ''}`}

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
                {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        
                </div>
        
                    <NextUIButton
                        color="danger" variant="light" 
            
                        onClick={() => {
                            onClose(); // Cierra el modal
                            setSelectedPlantilla(null);
                            setError(null); // Establece error en null para desactivar el mensaje de error
            
                        }}
                        
                        >
                        Cancelar
                    
                    </NextUIButton>
                    <NextUIButton
                    color="primary"
                    onClick={finalizarModalP}
                    >
                    Continuar
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
                    <Button
                        appearance="primary"
                        state="default"
                        spacing="compact"
                        onClick={() => {
                            setEditActive(true);
                            handleCancelNewField();
                        }}
                    >
                        <div>
                            <EditIcon />
                            <div>Editar</div>
                        </div>
                    </Button>
                    <Button
                        appearance="primary"
                        state="default"
                        spacing="compact"
                        onClick={handleAddField}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: ".4rem",
                            }}
                        >
                            <div style={{ fontSize: "2rem" }}>+</div>
                            <div>Agregar Campo</div>
                        </div>
                    </Button>

                    <Button
                        appearance="primary"
                        state="default"
                        spacing="compact"
                        onClick={onSaveModalPlantilla}
                    >
                        <div>
                            <SaveIcon />
                            <div>Guardar Plantilla</div>
                        </div>
                    </Button>
                    
                    <Button
                        appearance="primary"
                        state="default"
                        spacing="compact"
                        onClick={onModalPlantillas}

                    >
                        <div>
                            <ContentPasteGoIcon />
                            <div>Plantillas</div>
                        </div>
                    </Button>
                    
                </ButtonPanel>
            ) : (
                <ButtonPanel margin="10px 0 15px" align="right">
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

            <div className="fieldsBigContainer">
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
                    <div className="newFieldContainer" id="new-field-created">
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
