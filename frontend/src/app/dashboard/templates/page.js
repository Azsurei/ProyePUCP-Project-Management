import React from "react";
import Card from "@/components/Card";
import CardTemplate from "@/components/templatesComps/CardTemplate";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/projectMenu.css";

const templates = [
    {
        id: 1,
        imageSrc: "https://via.placeholder.com/150",
        iconSrc: "/icons/icon-excel.svg",
        title: "Backlog estandar 2023",
        description: "Gestion del Product Backlog",
        dateCreated: "2021-10-01",
    },
    {
        id: 2,
        imageSrc: "https://via.placeholder.com/150",
        iconSrc: "/icons/icon-excel.svg",
        title: "Cronograma",
        description: "Cronograma",
        dateCreated: "2021-10-02",
    },
    {
        id: 3,
        imageSrc: "https://via.placeholder.com/150",
        iconSrc: "/icons/icon-word.svg",
        title: "Registro de equipos y participantes",
        description: "Backlog",
        dateCreated: "2021-10-03",
    },
    {
        id: 4,
        imageSrc: "https://via.placeholder.com/150",
        iconSrc: "/icons/icon-excel.svg",
        title: "Backlog estandar 2023",
        description: "Gestion del Product Backlog",
        dateCreated: "2021-10-01",
    },
    {
        id: 5,
        imageSrc: "https://via.placeholder.com/150",
        iconSrc: "/icons/icon-excel.svg",
        title: "Cronograma",
        description: "Cronograma",
        dateCreated: "2021-10-02",
    },
    {
        id: 6,
        imageSrc: "https://via.placeholder.com/150",
        iconSrc: "/icons/icon-word.svg",
        title: "Registro de equipos y participantes",
        description: "Backlog",
        dateCreated: "2021-10-03",
    },
];

export default function Templates() {
    return (
        <>
            <div className="flex flex-row space-x-4 mb-4">
                <h2 className="montserrat text-[#172B4D] font-bold text-2xl">
                    Mis plantillas
                </h2>
                <img src="/icons/info-circle.svg" alt="Informacion"></img>
            </div>
            <div className="flex flex-row justify-between space-x-4 mb-4 w-full">
                <TextField
                    placeholder="Buscar plantilla"
                    width={400}
                    iconAfter={<img src="/icons/icon-searchBar.svg" />}
                />
                <Button
                    text={"Exportar"}
                    iconBefore={<img src="/icons/icon-download.svg" />}
                    className={
                        "montserrat flex flex-row border border-gray-300 rounded-md py-2 px-4"
                    }
                ></Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mx-auto">
                {templates.map((template) => (
                    <div key={template.id}>
                        <Card>
                            <CardTemplate
                                imageSrc={template.imageSrc}
                                iconSrc={template.iconSrc}
                                title={template.title}
                                description={template.description}
                                dateCreated={template.dateCreated}
                            />
                        </Card>
                    </div>
                ))}
            </div>
        </>
    );
}
