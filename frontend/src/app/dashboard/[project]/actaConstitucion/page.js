"use client"
import Link from "next/link";
import TextInfoCard from "@/components/dashboardComps/projectComps/appConstComps/TextInfoCard";
import Breadcrumb from "@/components/dashboardComps/projectComps/appConstComps/BreadCrumb";
import ButtonPanel from "@/components/dashboardComps/projectComps/appConstComps/ButtonPanel";
import Button from  "@/components/dashboardComps/projectComps/appConstComps/Button";
import Title from "@/components/dashboardComps/projectComps/appConstComps/Title";
import Page from "@/components/dashboardComps/projectComps/appConstComps/Page";
import AddIcon from  "@/components/dashboardComps/projectComps/appConstComps/Button";
import React, { useState } from 'react';

const itemsBreadCrumb = ['Inicio', 'Proyectos', 'Nombre del proyecto', 'Acta de Constitución'];
export default function actaConstitucion() {

    return (
        <Page margin={"20px 20px 20px"}>
            <Breadcrumb items={itemsBreadCrumb} />
            <Title>{"Acta de Constitución"}</Title>
            <ButtonPanel margin="20px 20px 20px" align="left">
                <Button appearance="primary" state="default" spacing="compact">
                    <div>
                        <AddIcon />
                        <Link href="/dashboard/actaConstitucion/info">Crear Nueva Acta</Link>
                    </div>
                </Button>
            </ButtonPanel>
        </Page>
    );
}

