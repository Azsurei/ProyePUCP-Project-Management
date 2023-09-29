"use client";

import Link from "next/link";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/projectMenu.css";
import ListProject from "@/components/dashboardComps/projectComps/ListProject";
import axios from "axios";
import SearchBar from "@/components/SearchBar";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

axios.defaults.withCredentials = true;

export default function Dashboard() {
    const componenteProject = [
        {
            id: 1,
            name: "Gestion de proyecto",
        },
        {
            id: 2,
            name: "xd",
        },
    ];

    return (
        <div className="mainDiv">
            <div className="headerDiv">
                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                </Breadcrumbs>
                <p className="textProject2">
                    Proyecto
                </p>
            </div>

            <div className="divSearch">
                
                <SearchBar placeholder="Buscar Proyecto"></SearchBar>
                
            <div className="contentDer">
                <div className="divtextProject">
                        <p className="textProject">¿Tienes ya la idea ganadora?</p>
                </div>

                <div className="butonAddProject">
                    <a href="/dashboard/newProject">
                        <button className="addProjectbtn">Crear Proyecto</button>
                    </a>

                </div>


            </div>

            </div>

            <ListProject listData={componenteProject}></ListProject>
        </div>
    );
}
