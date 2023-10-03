"use client";

import Link from "next/link";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/projectMenu.css";
import ListProject from "@/components/dashboardComps/projectComps/projectCreateComps/ListProject";
import axios from "axios";
import SearchBar from "@/components/SearchBar";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

axios.defaults.withCredentials = true;

export default function Dashboard() {
    return (
        <div className="mainDiv">
            <div className="headerDiv">
                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                </Breadcrumbs>
                <p className="textProject2">Proyectos</p>
            </div>

            <div className="divSearch">
                <SearchBar placeholder="Buscar Proyecto"></SearchBar>

                <div className="contentDer">
                    <p className="textProject">¿Tienes ya la idea ganadora?</p>

                    <div className="butonAddProject">
                        <Link href="/dashboard/newProject" id="newProBtnContainer">
                            <button className="addProjectbtn">
                                Crear Proyecto
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <ListProject></ListProject>
        </div>
    );
}
