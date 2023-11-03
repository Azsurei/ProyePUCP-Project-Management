"use client";
import TextInfoCard from "@/components/dashboardComps/projectComps/appConstComps/TextInfoCard";
import ButtonPanel from "@/components/dashboardComps/projectComps/appConstComps/ButtonPanel";
import Button from "@/components/dashboardComps/projectComps/appConstComps/Button";
import AddIcon from "@/components/dashboardComps/projectComps/appConstComps/AddIcon.svg";
import EditIcon from "../../../../../../../public/images/EditIcon.svg";
import DocumentFilledIcon from "../../../../../../../public/images/DocumentFilledIcon.svg";
import CrossIcon from "../../../../../../../public/images/CrossIcon.svg";


import React, { useState, useEffect, useReducer, useContext } from "react";

import axios from "axios";
import { SmallLoadingScreen } from "../../../layout";
axios.defaults.withCredentials = true;

import "../../../../../../styles/dashboardStyles/projectStyles/actaConstStyles/TextInfoCard.css";
import "../../../../../../styles/dashboardStyles/projectStyles/actaConstStyles/CardItem.css";
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
import { flushSync } from "react-dom";
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';


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
        isOpen: isModalPlantilla, 
        onOpen: onModalPlantilla, 
        onOpenChange: onModalPlantillaChange 
    
    } = useDisclosure();


    return (
        <div className="ACInfoContainer">

            <Modal size="xl" isOpen={isModalPlantilla} onOpenChange={onModalPlantillaChange}>
                    <ModalContent>
                        {(onClose) => {
                        const finalizarModal = () => {

                            onClose();
                        };
                        return (
                            <>
                            <ModalHeader>Eligue una Plantilla</ModalHeader>

                            <ModalBody>

                                <p>
                                    Listado de Plantillas
                                </p>



                            </ModalBody>

                            <ModalFooter>
                                <Button
                                className="text-white"
                                variant="light"
                                onClick={() => {
                                    onClose(); // Cierra el modal
  
                                }}
                                style={{ color: "#EA541D" }}
                                >
                                Cancelar
                                </Button>
                                <Button
                                style={{ backgroundColor: "#e74c3c" }}
                                className="text-white"
                                onClick={finalizarModal}
                                >
                                Seleccionar
                                </Button>
                            </ModalFooter>
                            </>
                        );
                        }}
                    </ModalContent>
            </Modal>



        </div>
    );
}
