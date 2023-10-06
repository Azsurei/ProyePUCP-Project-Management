import ProjectSidebar from "@/components/dashboardComps/projectComps/ProjectSidebar";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";
import Page from "@/components/dashboardComps/projectComps/appConstComps/Page";
import Breadcrumb from "@/components/dashboardComps/projectComps/appConstComps/BreadCrumb";
import Title from "@/components/dashboardComps/projectComps/appConstComps/Title";
import ButtonPanel from "@/components/dashboardComps/projectComps/appConstComps/ButtonPanel";
import Button from "@/components/dashboardComps/projectComps/appConstComps/Button";
import InfoIcon from '../../../../../public/images/InfoIcon.svg';
import CalendarIcon from '../../../../../public/images/CalendarIcon.svg';
import PersonWithCircleIcon from '../../../../../public/images/PersonWithCircleIcon.svg';
import TaskIcon from '../../../../../public/images/TaskIcon.svg';
import Link from "next/link";
import React from "react";
import {Breadcrumbs, BreadcrumbsItem} from "@/components/Breadcrumb";

const itemsBreadCrumb = ['Inicio', 'Proyectos', 'Nombre del proyecto', 'Acta de Constitución'];
export default function RootLayout({ children, params }) {
    const decodedUrl = decodeURIComponent(params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf('=') + 1);
    const projectName= decodedUrl.substring(0, decodedUrl.lastIndexOf('='));

    return (
        <Page margin={"20px 20px 20px"}>
            <div className="space-x-4 mb-2">
                <Breadcrumbs>
                    <BreadcrumbsItem
                        href="/dashboard"
                        text={"Inicio"}
                    ></BreadcrumbsItem>
                    <BreadcrumbsItem
                        href="/dashboard/project"
                        text={"Proyectos"}
                    ></BreadcrumbsItem>
                    <BreadcrumbsItem
                        href="/dashboard/6/"
                        text={"Nombre del proyecto"}
                    ></BreadcrumbsItem>
                    <BreadcrumbsItem
                        href="/dashboard/project/actaConstitucion/info"
                        text={"Acta de Constitución"}
                    ></BreadcrumbsItem>
                </Breadcrumbs>
            </div>
            <h1 className="montserrat text-[#172B4D] font-bold text-3xl">
                Acta de Constitución
            </h1>
            <ButtonPanel margin="20px 20px 20px" align="left">
                <Button appearance="primary" state="default" spacing="compact">
                    <div>
                        <InfoIcon />
                        <Link href="/dashboard/project/actaConstitucion/info">Informacion</Link>
                    </div>
                </Button>
                <Button appearance="primary" state="default" spacing="compact">
                    <div>
                        <CalendarIcon />
                        <Link href="/dashboard/project/actaConstitucion/cronograma">Cronograma</Link>
                    </div>
                </Button>
                <Button appearance="primary" state="default" spacing="compact">
                    <div>
                        <PersonWithCircleIcon />
                        <Link href="/dashboard/project/actaConstitucion/interesados">Interesados</Link>
                    </div>
                </Button>
                <Button appearance="primary" state="default" spacing="compact">
                    <div>
                        <TaskIcon />
                        <Link href="/dashboard/project/actaConstitucion/aprobacion">Aprobacion</Link>
                    </div>
                </Button>
            </ButtonPanel>
            {children}
        </Page>
    );
}