import React from "react";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/projectMenu.css";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/newProjects.css";
import DatePicker1 from "@/components/DatePicker1";
import TextField from "@/components/TextField";
import TextFieldNotEditable from "@/components/TextFieldNotEditable";

export default function CardCreateProject({
    handleChangesNombre,
    handleChangesFechaInicio,
    handleChangesFechaFin,
    projectOwnerData,
    props,
}) {



    return (
        <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "3vw 4vw" }}
        >
            <div className="divProjectNameDiv">
                <p className="projectNametxt">Nombre del Proyecto *</p>
                <TextField handleChange={handleChangesNombre}></TextField>
            </div>

            <div className="divProjectNameDiv">
                <p className="projectNametxt">Dueño del Proyecto</p>
                <TextFieldNotEditable
                    defaultValue={
                        projectOwnerData.nombres +
                        " " +
                        projectOwnerData.apellidos
                    }
                ></TextFieldNotEditable>
            </div>

            <div className="divProjectNameDiv">
                <p className="projectNametxt">Fecha Inicio</p>
                <input
                    type="date"
                    id="inputBoxGeneric"
                    className="NewProjectDatePickerInicio"
                    name="datepicker"
                    onChange={handleChangesFechaInicio}
                ></input>
            </div>

            <div className="divProjectNameDiv">
                <p className="projectNametxt">Fecha Fin</p>
                <input
                    type="date"
                    id="inputBoxGeneric"
                    className="NewProjectDatePickerFin"
                    name="datepicker"
                    onChange={handleChangesFechaFin}
                ></input>
            </div>
        </div>
    );
}
