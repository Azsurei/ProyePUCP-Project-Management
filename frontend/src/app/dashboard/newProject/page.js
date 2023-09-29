"use client"
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/projectMenu.css";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/newProjects.css";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb"

import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import RadioButtonCheckedSharpIcon from '@mui/icons-material/RadioButtonCheckedSharp';




axios.defaults.withCredentials = true;

export default function newProject() {


    return (
        
        <div className="mainDiv">


            <div className="headerDiv">
                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem href="/dashboard/newProject" text="Nuevo Proyecto" />
                </Breadcrumbs>
                <p className="textProject2">
                    Proyecto
                </p>
            </div>


            <BottomNavigationAction label="Recents" icon={<RadioButtonCheckedSharpIcon />} />
        </div>
        


    );
}