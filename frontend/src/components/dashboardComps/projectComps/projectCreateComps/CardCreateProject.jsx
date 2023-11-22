import React from "react";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/projectMenu.css";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/newProjects.css";
import DatePicker1 from "@/components/DatePicker1";
import TextField from "@/components/TextField";
import TextFieldNotEditable from "@/components/TextFieldNotEditable";
import DateInput from "@/components/DateInput";
import { Textarea } from "@nextui-org/react";

export default function CardCreateProject({
    nameProject,
    fechaInicio,
    fechaFin,
    handleChangesNombre,
    handleChangesFechaInicio,
    handleChangesFechaFin,
    projectOwnerData,
    props,
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                padding: "3vw 4vw",
            }}
        >
            <div className="divProjectNameDiv">
                <p className="projectNametxt">Nombre del Proyecto *</p>
                {/* <TextField handleChange={handleChangesNombre}></TextField> */}
                <Textarea
                    variant={"bordered"}
                    readOnly={false}
                    aria-label="name-lbl"
                    labelPlacement="outside"
                    label=""
                    placeholder="Escriba aquí"
                    classNames={{ label: "pb-0", input: "text-md" }}
                    value={nameProject}
                    onChange={handleChangesNombre}
                    minRows={1}
                    size="sm"
                />
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
                {/* <input
                    type="date"
                    id="inputBoxGeneric"
                    className="NewProjectDatePickerInicio"
                    name="datepicker"   
                    onChange={handleChangesFechaInicio}
                ></input> */}
                <DateInput
                    isEditable={true}
                    isInvalid={false}
                    value={fechaInicio}
                    onChangeHandler={handleChangesFechaInicio}
                />
            </div>

            <div className="divProjectNameDiv">
                <p className="projectNametxt">Fecha Fin</p>
                {/* <input
                    type="date"
                    id="inputBoxGeneric"
                    className="NewProjectDatePickerFin"
                    name="datepicker"
                    onChange={handleChangesFechaFin}
                ></input> */}
                <DateInput
                    isEditable={true}
                    isInvalid={false}
                    value={fechaFin}
                    onChangeHandler={handleChangesFechaFin}
                />
            </div>
        </div>
    );
}
