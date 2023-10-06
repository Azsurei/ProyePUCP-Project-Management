"use client"
import Link from "next/link";
import TextInfoCard from "@/components/dashboardComps/projectComps/appConstComps/TextInfoCard";
import Breadcrumb from "@/components/dashboardComps/projectComps/appConstComps/BreadCrumb";
import ButtonPanel from "@/components/dashboardComps/projectComps/appConstComps/ButtonPanel";
import Button from  "@/components/dashboardComps/projectComps/appConstComps/Button";
import Title from "@/components/dashboardComps/projectComps/appConstComps/Title";
import Page from "@/components/dashboardComps/projectComps/appConstComps/Page";
import React, { useState , useEffect, useReducer} from 'react';
import AddIcon from "@/components/dashboardComps/projectComps/appConstComps/AddIcon.svg";
import EditIcon from '../../../../../../public/images/EditIcon.svg';
import DocumentFilledIcon from '../../../../../../public/images/DocumentFilledIcon.svg';
import CrossIcon from '../../../../../../public/images/CrossIcon.svg';
import camelCase from "next/dist/build/webpack/loaders/css-loader/src/camelcase";

import { loadState, saveState } from '../../../../localStorage/localStorageUtilities';


const itemsBreadCrumb = ['Inicio', 'Proyectos', 'Nombre del proyecto', 'Acta de Constitución'];

export default function Info() {

    var projectData = [
        { label: "Proyecto", value: "Proyecto de Bajarse a PUCP Movil" },
        { label: "Nombre del equipo", value: "Los Dibujitos" },
        { label: "Fecha", value: "25/12/2023" },
        { label: "Cliente", value: "Sindicato de Católica" },
        { label: "Patrocinador principal", value: "Luis Flores" },
        { label: "Gerente de proyecto", value: "Diego Iwasaki" },
    ];

    var purpouseData = [
        {label: "", value: "Dado que la aplicación PUCP Móvil tiene muchos problemas"
                + "(no sé cuales) hemos decidido tumbar PUCP Móvil."},
    ]

    var descriptionData = [
        {label: "", value: "Descripción del Proyecto totalmente generícas y cualquier"
                + "otro entregable que sea necesario para el desarrollo de este proyecto. \n"
                + "Se espera que para este proyecto se entreguen el Producto1 completamente terminado,"
                + "así como los Documento 1, Documento 2 y Documento 3. Además, se requiere " +
                "que al final del mismo todos los integrantes puedan realizar un nuevo requisito invisible."},
    ]

    var budgetData = [
        {label: "", value: "Las estimaciones de este proyecto se encuentran alrededor de los $10,000.00" +
                " bajo las siguientes razones. Pago a desarrolladores: $10. Pago a sindicato: $99,990.00."},
    ]

    var restrictionData = [
        {label: "", value: "Este proyecto se da a cabo por la Premisa1, Premisa2, Premisa3 y Premisa4. " +
                "Se ha detectado que se cuenta con la Restricción1, Restricción2, Restricción3 y" +
                " Restricción4. Las medidas en contra de la Restricción4 son dejar de alimentar " +
                "a las ardillas y bajar el costo del menú."},
    ]
    var highLevelRisksData = [
        { label: "", value: "Se calculan como Riesgos Iniciales de Alto Nivel el dejar que los " +
                "desarrolladores se tiren una maratón de 10h viendo series. " +
                "Se recomienda bloquear las páginas de streaming." }
    ];

    var projectApprovalData = [
        { label: "", value: "Se tienen el Requisito1, Requisito2 y Requisito3, siendo " +
                "el Requisito3 el más importante." }
    ];

    var highLevelRequirementsData = [
        { label: "", value: "Se calculan como Riesgos Iniciales de Alto Nivel " +
                "el dejar que los desarrolladores se tiren una maratón de 10h viendo series." +
                " Se recomienda bloquear las páginas de streaming." }
    ];

    var productRequirementsData = [
        { label: "", value: "Se calculan como Riesgos Iniciales de Alto Nivel el" +
                " dejar que los desarrolladores se tiren una maratón de 10h viendo series. " +
                "Se recomienda bloquear las páginas de streaming." }
    ];

    var projectRequirementsData = [
        { label: "", value: "Se calculan como Riesgos Iniciales de Alto Nivel el dejar " +
                "que los desarrolladores se tiren una maratón de 10h viendo series. " +
                "Se recomienda bloquear las páginas de streaming." }
    ];

    var elaboratedByData = [
        { label: "", value: "Sebastian Chira Mallqui (20171857)" }
    ];

    var cardDataArray = [
        { title: "Información del Proyecto", data: projectData },
        { title: "Propósito y Justificación del Proyecto", data: purpouseData },
        { title: "Descripción del Proyecto y Entregables", data: descriptionData },
        { title: "Presupuesto Estimado", data: budgetData },
        { title: "Premisas y Restricciones", data: restrictionData },
        { title: "Riesgos Iniciales de Alto Nivel", data: highLevelRisksData },
        { title: "Requisitos de Aprobación del Proyecto", data: projectApprovalData },
        { title: "Requerimientos de Alto Nivel", data: highLevelRequirementsData },
        { title: "Requerimientos del Producto", data: productRequirementsData },
        { title: "Requerimientos del Proyecto", data: projectRequirementsData },
        { title: "Elaborado por", data: elaboratedByData },
    ];

    const [IsCancelling, setIsCancelling] = useState(false);
    const [IsEditingHere, setIsEditingHere] = useState(false); // State to track if user is in "editing" mode
    const [showSaveCancel, setShowSaveCancel] = useState(false); // State to track visibility of "Guardar" and "Cancelar" buttons
    const loadedState = loadState();
    const initialState = loadedState ? loadedState : {
        projectData,
        purpouseData,
        descriptionData,
        budgetData,
        restrictionData,
        highLevelRisksData,
        projectApprovalData,
        highLevelRequirementsData,
        productRequirementsData,
        projectRequirementsData,
        elaboratedByData
    };

    const arrayData = ["projectData",
        "purpouseData",
        "descriptionData",
        "budgetData",
        "restrictionData",
        "highLevelRisksData",
        "projectApprovalData",
        "highLevelRequirementsData",
        "productRequirementsData",
        "projectRequirementsData",
        "elaboratedByData"];
    const dataReducer = (state, action) => {
        switch(action.type) {
            case 'UPDATE_PROJECT_DATA':
                return { ...state, projectData: action.payload };
            case 'UPDATE_PURPOUSE_DATA':
                return { ...state, purpouseData: action.payload };
            case 'UPDATE_DESCRIPTION_DATA':
                return { ...state, descriptionData: action.payload };
            case 'UPDATE_BUDGET_DATA':
                return { ...state, budgetData: action.payload };
            case 'UPDATE_RESTRICTION_DATA':
                return { ...state, restrictionData: action.payload };
            case 'UPDATE_HIGH_LEVEL_RISKS_DATA':
                return { ...state, highLevelRisksData: action.payload };
            case 'UPDATE_PROJECT_APPROVAL_DATA':
                return { ...state, projectApprovalData: action.payload };
            case 'UPDATE_HIGH_LEVEL_REQUIREMENTS_DATA':
                return { ...state, highLevelRequirementsData: action.payload };
            case 'UPDATE_PRODUCT_REQUIREMENTS_DATA':
                return { ...state, productRequirementsData: action.payload };
            case 'UPDATE_PROJECT_REQUIREMENTS_DATA':
                return { ...state, projectRequirementsData: action.payload };
            case 'UPDATE_ELABORATED_BY_DATA':
                return { ...state, elaboratedByData: action.payload };
            case 'RESET_TO_INITIAL':
                return { ...action.payload };
            default:
                return state;
        }
    };

    const [dataState, dispatch] = useReducer(dataReducer, initialState);

    const handleDataChange = (newValue, label, dataKey) => {

        console.log(dataKey);
        const updatedSection = dataState[arrayData[dataKey]].map(item =>
            item.label === label ? { ...item, value: newValue } : item
        );

        // Using dispatch with an action object
        dispatch({
            type: `UPDATE_${arrayData[dataKey].toUpperCase()}`,
            payload: updatedSection
        });
    };

    const handleEditClick = () => {
        setIsEditingHere(true);
        setShowSaveCancel(true);
    };

    const handleCancelClick = () => {
        setIsEditingHere(false);
        setShowSaveCancel(true);
        setIsCancelling(true);
        dispatch({ type: 'RESET_TO_INITIAL', payload: initialState });
    };


    const handleSaveClick = () => {
        // Reset the buttons
        saveState(dataState);
        setIsEditingHere(false);
        setShowSaveCancel(false);
        setIsCancelling(false);
    };

    useEffect(() => {
        const loadedState = loadState();
        if (loadedState) {
            dispatch({ type: 'RESET_TO_INITIAL', payload: loadedState });
        }
    }, []);

    return (
        <div>
            <ButtonPanel margin="20px 20px 20px" align="left">
                <Button appearance="primary" state="default" spacing="compact" onClick={handleEditClick}>
                    <div>
                        <EditIcon />
                        <div>Editar</div>
                    </div>
                </Button>
            </ButtonPanel>
            {cardDataArray.map((card, index) => (
                <TextInfoCard
                    key={index}
                    title={card.title}
                    data={dataState[arrayData[index]]}
                    isEditing={IsEditingHere}
                    isCancel={IsCancelling}
                    handleDataChange={handleDataChange}
                    dataKey={index}
                />
            ))}
            <ButtonPanel margin="20px 20px 20px" align="center" style={{ display: showSaveCancel ? 'flex' : 'none' }}>
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

