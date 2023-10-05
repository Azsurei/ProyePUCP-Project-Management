"use client"
import Link from "next/link";
import TextInfoCard from "@/components/dashboardComps/projectComps/appConstComps/TextInfoCard";
import Breadcrumb from "@/components/dashboardComps/projectComps/appConstComps/BreadCrumb";
import ButtonPanel from "@/components/dashboardComps/projectComps/appConstComps/ButtonPanel";
import Button from  "@/components/dashboardComps/projectComps/appConstComps/Button";
import Title from "@/components/dashboardComps/projectComps/appConstComps/Title";
import Page from "@/components/dashboardComps/projectComps/appConstComps/Page";
import React, { useState } from 'react';
import AddIcon from "@/components/dashboardComps/projectComps/appConstComps/Button";

/// Lista de labels sobre info del Proyecto

const projectData = [
    { label: "Proyecto", value: "Proyecto de Bajarse a PUCP Movil" },
    { label: "Nombre del equipo", value: "Los Dibujitos" },
    { label: "Fecha", value: "25/12/2023" },
    { label: "Cliente", value: "Sindicato de Católica" },
    { label: "Patrocinador principal", value: "Luis Flores" },
    { label: "Gerente de proyecto", value: "Diego Iwasaki" },
];

const purpouseData = [
    {label: "", value: "Dado que la aplicación PUCP Móvil tiene muchos problemas"
                    + "(no sé cuales) hemos decidido tumbar PUCP Móvil."},
]

const descriptionData = [
    {label: "", value: "Descripción del Proyecto totalmente generícas y cualquier"
                    + "otro entregable que sea necesario para el desarrollo de este proyecto. \n"
                    + "Se espera que para este proyecto se entreguen el Producto1 completamente terminado,"
                    + "así como los Documento 1, Documento 2 y Documento 3. Además, se requiere " +
            "que al final del mismo todos los integrantes puedan realizar un nuevo requisito invisible."},
]

const budgetData = [
    {label: "", value: "Las estimaciones de este proyecto se encuentran alrededor de los $10,000.00" +
            " bajo las siguientes razones. Pago a desarrolladores: $10. Pago a sindicato: $99,990.00."},
]

const restrictionData = [
    {label: "", value: "Este proyecto se da a cabo por la Premisa1, Premisa2, Premisa3 y Premisa4. " +
            "Se ha detectado que se cuenta con la Restricción1, Restricción2, Restricción3 y" +
            " Restricción4. Las medidas en contra de la Restricción4 son dejar de alimentar " +
            "a las ardillas y bajar el costo del menú."},
]
const highLevelRisksData = [
    { label: "", value: "Se calculan como Riesgos Iniciales de Alto Nivel el dejar que los " +
            "desarrolladores se tiren una maratón de 10h viendo series. " +
            "Se recomienda bloquear las páginas de streaming." }
];

const projectApprovalData = [
    { label: "", value: "Se tienen el Requisito1, Requisito2 y Requisito3, siendo " +
            "el Requisito3 el más importante." }
];

const highLevelRequirementsData = [
    { label: "", value: "Se calculan como Riesgos Iniciales de Alto Nivel " +
            "el dejar que los desarrolladores se tiren una maratón de 10h viendo series." +
            " Se recomienda bloquear las páginas de streaming." }
];

const productRequirementsData = [
    { label: "", value: "Se calculan como Riesgos Iniciales de Alto Nivel el" +
            " dejar que los desarrolladores se tiren una maratón de 10h viendo series. " +
            "Se recomienda bloquear las páginas de streaming." }
];

const projectRequirementsData = [
    { label: "", value: "Se calculan como Riesgos Iniciales de Alto Nivel el dejar " +
            "que los desarrolladores se tiren una maratón de 10h viendo series. " +
            "Se recomienda bloquear las páginas de streaming." }
];

const elaboratedByData = [
    { label: "", value: "Sebastian Chira Mallqui (20171857)" }
];

const cardDataArray = [
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
/// Fin de Lista
const itemsBreadCrumb = ['Inicio', 'Proyectos', 'Nombre del proyecto', 'Acta de Constitución'];

export default function actaConstitucion() {
    const [isEditing, setIsEditing] = useState(false); // State to track if user is in "editing" mode
    const [showSaveCancel, setShowSaveCancel] = useState(false); // State to track visibility of "Guardar" and "Cancelar" buttons

    return (
        <div>
            <ButtonPanel margin="20px 20px 20px" align="left">
                <Button appearance="primary" state="default" spacing="compact">
                    Editar
                </Button>
            </ButtonPanel>
            {cardDataArray.map((card, index) => (
                <TextInfoCard key={index} title={card.title} data={card.data} />
            ))}
            <ButtonPanel margin="20px 20px 20px" align="center" style={{ display: showSaveCancel ? 'flex' : 'none' }}>
                <Button appearance="subtle" state="default" spacing="compact">
                    Cancelar
                </Button>
                <Button appearance="primary" state="default" spacing="compact">
                    Guardar
                </Button>
            </ButtonPanel>
        </div>
    );
}

