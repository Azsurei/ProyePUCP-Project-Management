import React from "react";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/projectMenu.css";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/newProjects.css";
import DatePicker1 from "@/components/DatePicker1";
import TextField from "@/components/TextField";

export default function CardCreateProject({
    handleChangesNombre,
    handleChangesFechaInicio,
    handleChangesFechaFin,
    props,
}) {
    return (
        <div>
            <div className="divProjectNameDiv">
                <p className="projectNametxt">Nombre del Proyecto</p>
            </div>

            <div>
                <TextField handleChange={handleChangesNombre}></TextField>
            </div>

            <div className="divProjectNameDiv">
                <p className="projectNametxt">Dueño del Proyecto</p>
            </div>
            <TextField></TextField>

            <div className="divProjectNameDiv">
                <p className="projectNametxt">Fecha Inicio</p>
            </div>
            <input
                type="date"
                id="inputBoxGeneric"
                className="NewProjectDatePickerInicio"
                name="datepicker"
                onChange={handleChangesFechaInicio}
            ></input>

            <div className="divProjectNameDiv">
                <p className="projectNametxt">Fecha Fin</p>
            </div>
            <input
                type="date"
                id="inputBoxGeneric"
                className="NewProjectDatePickerFin"
                name="datepicker"
                onChange={handleChangesFechaFin}
            ></input>
        </div>
    );
}
