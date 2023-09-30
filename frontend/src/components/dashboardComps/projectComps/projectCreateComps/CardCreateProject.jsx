import React from 'react';
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/projectMenu.css";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/newProjects.css";
import DatePicker1 from "@/components/DatePicker1";
import TextField from "@/components/TextField";

export default function CardCreateProject(props) {
    return (

        
        <div >

            <div className="divProjectNameDiv">
                    <p className="projectNametxt">Nombre del Proyecto</p>
                </div>

            <div>
                <TextField></TextField>
            </div>

            <div className="divProjectNameDiv">
                <p className="projectNametxt">Dueño del Proyecto</p>
            </div>
            <TextField></TextField>

            <div className="divProjectNameDiv">
                <p className="projectNametxt">Fecha Inicio</p>
            </div>
            <DatePicker1></DatePicker1>

            <div className="divProjectNameDiv">
                <p className="projectNametxt">Fecha Fin</p>
            </div>
            <DatePicker1></DatePicker1>

            


        </div>
    
    )
}