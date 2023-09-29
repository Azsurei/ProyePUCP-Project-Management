import React from 'react';
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/projectMenu.css";
import "@/styles/dashboardStyles/projectStyles/ProjectMenuStyles/newProjects.css";
import TimePicker1 from "@/components/TimePicker1";
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
            <TimePicker1></TimePicker1>

            <div className="divProjectNameDiv">
                <p className="projectNametxt">Fecha Fin</p>
            </div>
            <TimePicker1></TimePicker1>

            


        </div>
    
    )
}