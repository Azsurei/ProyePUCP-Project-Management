"use client";
import TextInfoCard from "@/components/dashboardComps/projectComps/appConstComps/TextInfoCard";
import ButtonPanel from "@/components/dashboardComps/projectComps/appConstComps/ButtonPanel";
import Button from "@/components/dashboardComps/projectComps/appConstComps/Button";
import React, { useState, useEffect, useReducer, useContext } from "react";
import AddIcon from "@/components/dashboardComps/projectComps/appConstComps/AddIcon.svg";
import EditIcon from "../../../../../../public/images/EditIcon.svg";
import DocumentFilledIcon from "../../../../../../public/images/DocumentFilledIcon.svg";
import CrossIcon from "../../../../../../public/images/CrossIcon.svg";
import axios from "axios";
import { SmallLoadingScreen } from "../../layout";
axios.defaults.withCredentials = true;

import "../../../../../styles/dashboardStyles/projectStyles/actaConstStyles/TextInfoCard.css";
import "../../../../../styles/dashboardStyles/projectStyles/actaConstStyles/CardItem.css";
import { Textarea } from "@nextui-org/react";

function DetailCard({ detail , handleModifyField, isEditable}) {
    return (
        <div className="project-card">
            <div className="project-card__title">{detail.nombre}</div>

            <Textarea
                //isInvalid={!validDescripcion}
                //errorMessage={!validDescripcion ? msgEmptyField : ""}
                //key={"bordered"}
                aria-label="custom-txt"
                variant={isEditable ? "bordered" : "flat"}
                labelPlacement="outside"
                placeholder={isEditable ? "Escribe aquí!" : "Aún no tiene información."}
                classNames={{ label: "pb-0" }}              //falta setear un tamano al textbox para que no cambie de tamano al cambiar de no editable a editable
                readOnly={!isEditable}
                value={detail.detalle === null ? "" : detail.detalle}
                //onValueChange={setTareaDescripcion}
                minRows={1}
                size="sm"
                onChange={(e) => {
                    handleModifyField(detail.idDetalle,e.target.value);
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

    // Manejando la carga de la lista de detalles de acta de constitucion
    const [details, setDetails] = useState([]);
    const [detailEdited, setDetailsEdited] = useState([]);

    useEffect(() => {
        const listURL =
            "http://localhost:8080/api/proyecto/ActaConstitucion/listarActaConstitucion/" +
            projectId;
        axios
            .get(listURL)
            .then((response) => {
                console.log(response.data.detalleAC);
                setDetails(response.data.detalleAC.actaData);
                setDetailsEdited(response.data.detalleAC.actaData);
                setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);


    const handleCancelEdit = () => {
        //reestablecemos el arreglo con lo que estaba originalmente en el arreglo del fetch
        setDetailsEdited([...details]);
    }

    const handleSave = () => {
        //no olvides actualizar el details original con lo ya editado para no recargar toda la pagina



    }
    // const handleModifyField = async (detail) => {
    //     try {
    //         await axios.put(
    //             "http://localhost:8080/api/proyecto/ActaConstitucion/modificarCampos",
    //             detail,
    //             {
    //                 headers: { "Content-Type": "application/json" },
    //             }
    //         );
    //     } catch (err) {
    //         setError(err);
    //     }
    // };

    // Manejando estados de los botones
    const [isEditActive, setEditActive] = useState(false);

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

    return (
        <div>
            <ButtonPanel margin="20px 20px 20px" align="left">
                <Button
                    appearance="primary"
                    state="default"
                    spacing="compact"
                    onClick={()=>{setEditActive(true)}}
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
                    //onClick={handleAddClick}
                >
                    <div>
                        <AddIcon />
                        <div>Agregar Campo</div>
                    </div>
                </Button>
            </ButtonPanel>

            {detailEdited.map((detail) => (
                <DetailCard
                    key={detail.idDetalle}
                    detail={detail}
                    handleModifyField={updateDetail}
                    isEditable={isEditActive}
                />
            ))}
            <ButtonPanel
                margin="20px 20px 20px"
                align="center"
                style={{ display: isEditActive ? "flex" : "none" }}
            >
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
            </ButtonPanel>
        </div>
    );
}
