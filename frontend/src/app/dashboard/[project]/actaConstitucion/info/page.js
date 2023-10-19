"use client"
import ButtonPanel from "@/components/dashboardComps/projectComps/appConstComps/ButtonPanel";
import Button from  "@/components/dashboardComps/projectComps/appConstComps/Button";
import React, { useState , useEffect, useReducer, useContext} from 'react';
import AddIcon from "@/components/dashboardComps/projectComps/appConstComps/AddIcon.svg";
import EditIcon from '../../../../../../public/images/EditIcon.svg';
import DocumentFilledIcon from '../../../../../../public/images/DocumentFilledIcon.svg';
import CrossIcon from '../../../../../../public/images/CrossIcon.svg';
import axios from 'axios';
import { SmallLoadingScreen } from "../../layout";
axios.defaults.withCredentials = true;

function DetailCard({ detail, onSave }) {

    const [editMode, setEditMode] = useState(false);
    const [editedDetail, setEditedDetail] = useState(detail);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleChange = (field, value) => {
        setEditedDetail(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(editedDetail);
        setEditMode(false);
    };

    return (
        <div className="card">
            {editMode ? (
                <>
                    <input value={editedDetail.nombre} onChange={e => handleChange('nombre', e.target.value)} />
                    <input value={editedDetail.detalle} onChange={e => handleChange('detalle', e.target.value)} />
                    <button onClick={handleSave}>Save</button>
                </>
            ) : (
                <>
                    <div>{detail.nombre}</div>
                    <div>{detail.detalle}</div>
                    <button onClick={handleEdit}>Edit</button>
                </>
            )}
        </div>
    );
}

export default function Info() {

    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    // Manejando la carga de la lista de detalles de acta de constitucion
    const [details, setDetails] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response =
                    await axios.get('http://localhost:8080/api/proyecto/ActaConstitucion/listarActaConstitucion/11', {
                    headers: { 'Content-Type': 'application/json' },
                }).then(
                    response => {
                        console.log(response.data.detalleAC);
                        setDetails(response.data.detalleAC);
                        setIsLoadingSmall(false);
                    }
                );
                console.log(response);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);


    const handleModifyField = async (detail) => {
        try {
            await axios.put('http://localhost:8080/api/proyecto/ActaConstitucion/modificarCampos', detail, {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (err) {
            setError(err);
        }
    };

    // Manejando estados de los botones
    const [isEditActive, setEdit] = useState(false);
    const [isAddActive, setAdd] = useState(false);
    const [isCancelActive, setCancel] = useState(false);
    const [isSaveActive, setSave] = useState(false);
    const handleEditClick = () => {
        setEdit(true);
    };
    const handleCancelClick = () => {
        setCancel(true);
    };
    const handleSaveClick = () => {
        setSave(true);
    }
    const handleAddClick = () => {
        setAdd(true);
    };

    return (
        <div>
            <ButtonPanel margin="20px 20px 20px" align="left">
                <Button appearance="primary" state="default" spacing="compact" onClick={handleEditClick}>
                    <div>
                        <EditIcon />
                        <div>Editar</div>
                    </div>
                </Button>
                <Button appearance="primary" state="default" spacing="compact" onClick={handleAddClick}>
                    <div>
                        <AddIcon />
                        <div>Agregar Campo</div>
                    </div>
                </Button>
            </ButtonPanel>
            {details.map((detail, index) => (
                <DetailCard key={index} detail={detail} onSave={handleModifyField} />
            ))}
            <ButtonPanel margin="20px 20px 20px" align="center" style={{ display: isEditActive ? 'flex' : 'none' }}>
                <Button appearance="subtle" state="default" spacing="compact" onClick={handleCancelClick}>
                    <div>
                        <CrossIcon />
                        <div>Cancelar</div>
                    </div>
                </Button>
                <Button appearance="primary" state="default" spacing="compact" onClick={handleSaveClick}>
                    <div>
                        <DocumentFilledIcon />
                        <div>Guardar</div>
                    </div>
                </Button>
            </ButtonPanel>
        </div>
    );
}
