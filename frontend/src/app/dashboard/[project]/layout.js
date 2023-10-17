"use client"
import ProjectSidebar from "@/components/dashboardComps/projectComps/ProjectSidebar";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";
import { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;


export default function RootLayout({ children, params }) {
    const decodedUrl = decodeURIComponent(params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf('=') + 1);
    const projectName= decodedUrl.substring(0, decodedUrl.lastIndexOf('='));



    return ( //AQUI CAMBIE BODY POR DIV, YA QUE AL TENER BODY QUITA EL LAYOUT DEL DASHBOARD
        <div className="DashboardProjectContainer" style={{width: '100%'}}>   
            <ProjectSidebar projectName={projectName} projectId={projectId} currentUrl={params.project}></ProjectSidebar>
            <div style={{flex:'1', backgroundColor:'white'}} className="h-[100%] overflow-auto">
                {children}
            </div>
            
        </div>
    );
}