import ProjectSidebar from "@/components/dashboardComps/projectComps/ProjectSidebar";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";
import Page from "@/components/dashboardComps/projectComps/appConstComps/Page";
import Breadcrumb from "@/components/dashboardComps/projectComps/appConstComps/BreadCrumb";
import Title from "@/components/dashboardComps/projectComps/appConstComps/Title";
import ButtonPanel from "@/components/dashboardComps/projectComps/appConstComps/ButtonPanel";
import Button from "@/components/dashboardComps/projectComps/appConstComps/Button";
import AddIcon from "@/components/dashboardComps/projectComps/appConstComps/Button";
import Link from "next/link";
import React from "react";


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
                        <Link href="/dashboard/actaConstitucion/info">Informacion</Link>
                    </div>
                </Button>
                <Button appearance="primary" state="default" spacing="compact">
                    <div>
                        <Link href="/dashboard/actaConstitucion/cronograma">Cronograma</Link>
                    </div>
                </Button>
                <Button appearance="primary" state="default" spacing="compact">
                    <div>
                        <Link href="/dashboard/actaConstitucion/interesados">Interesados</Link>
                    </div>
                </Button>
                <Button appearance="primary" state="default" spacing="compact">
                    <div>
                        <Link href="/dashboard/actaConstitucion/aprobacion">Aprobacion</Link>
                    </div>
                </Button>
            </ButtonPanel>
            {children}
        </Page>
    );
}