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

const itemsBreadCrumb = ['Inicio', 'Proyectos', 'Nombre del proyecto', 'Acta de Constitución'];
export default function RootLayout({ children, params }) {
    const decodedUrl = decodeURIComponent(params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf('=') + 1);
    const projectName= decodedUrl.substring(0, decodedUrl.lastIndexOf('='));

    return (
        <Page margin={"20px 20px 20px"}>
            <Breadcrumb items={itemsBreadCrumb} />
            <Title>{"Acta de Constitución"}</Title>
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