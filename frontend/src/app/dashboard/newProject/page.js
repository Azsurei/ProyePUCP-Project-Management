"use client"
import axios from "axios";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/projectMenu.css";

axios.defaults.withCredentials = true;

export default function newProject() {


    return (
        
        <div className="mainDiv">


            <div className="headerDiv">
            <HeaderWithButtons haveReturn={false} 
                               haveAddNew={false}
                               hrefToReturn={''}
                               hrefForButton={'/dashboard/project/newProject'}
                               breadcrump={'Inicio / Proyectos / Crea un Proyecto'}
                               btnText={'Crear Proyecto'}>Crea un Proyecto</HeaderWithButtons>
            </div>

            <div className="divSearch">
            </div>

        </div>
        


    );
}