"use client"

import Link from "next/link";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/projectMenu.css";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import ListProject from "@/components/dashboardComps/projectComps/ListProject";
import axios from "axios";
import SearchBar from "@/components/SearchBar";


axios.defaults.withCredentials = true;




export default function Dashboard() {

    

    const componenteProject=[
        {
            id: 1,
            name: 'Gestion de proyecto',

        },
        {
            id: 2,
            name: 'xd',

        }
    ];


    return (
        
        <div className="mainDiv">


            <div className="headerDiv">
            <HeaderWithButtons haveReturn={false} 
                               haveAddNew={false}
                               hrefToReturn={''}
                               hrefForButton={'/dashboard/project/newProject'}
                               breadcrump={'Inicio / Proyectos '}
                               btnText={'Crear Proyecto'}>Proyectos</HeaderWithButtons>
            </div>

            <div className="divSearch">

                <SearchBar placeholder='Buscar Proyecto'>

                </SearchBar>

                <div className="divtextProject">
                    <p className="textProject">
                        ¿Tienes ya la idea ganadora?
                    </p>
                </div>

                <a href="/dashboard/newProject">
                <button className="addProjectbtn">
                        Crear Proyecto
                </button>
                </a>
            </div>


        
            <ListProject listData={componenteProject}></ListProject>
        </div>

        


    );
}