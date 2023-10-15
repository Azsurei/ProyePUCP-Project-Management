"use client";
import NormalInput from "@/components/NormalInput";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import AgendaTable from "@/components/dashboardComps/projectComps/cronogramaComps/AgendaTable";
import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/cronogramaPage.css";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import { useState } from "react";
import DateInput from "@/components/DateInput";

export default function Cronograma(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [toggleNew, setToggleNew] = useState(false);
    const handlerGoToNew = () => {
        setToggleNew(!toggleNew);
    };

    const [tareaName, setTareaName] = useState("");
    const [tareaDescripcion, setTareaDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");

    return (
        <div className="cronogramaDiv">
            <div className={toggleNew ? "divLeft closed" : "divLeft"}>
                <HeaderWithButtonsSamePage
                    haveReturn={false}
                    haveAddNew={true}
                    handlerAddNew={handlerGoToNew}
                    //newPrimarySon={ListComps.length + 1}
                    breadcrump={"Inicio / Proyectos / " + projectName}
                    btnText={"Nueva tarea"}
                >
                    Cronograma
                </HeaderWithButtonsSamePage>

                <AgendaTable></AgendaTable>
            </div>

            <div className={toggleNew ? "divRight open" : "divRight"}>
                <HeaderWithButtonsSamePage
                    haveReturn={true}
                    haveAddNew={false}
                    //handlerAddNew={handlerGoToNew}
                    handlerReturn={handlerGoToNew}
                    //newPrimarySon={ListComps.length + 1}
                    breadcrump={
                        "Inicio / Proyectos / " + projectName + " / Cronograma"
                    }
                    btnText={"Nueva tarea"}
                >
                    Nueva tarea
                </HeaderWithButtonsSamePage>

                <p>Nombre de tarea</p>
                <NormalInput
                    className={""}
                    onChangeHandler={setTareaName}
                    placeHolder={"Escriba aqui"}
                    maxLength={70}
                    rows={1}
                ></NormalInput>

                <p>Descripcion</p>
                <NormalInput
                    className={""}
                    onChangeHandler={setTareaName}
                    placeHolder={"Escriba aqui"}
                    maxLength={70}
                    rows={3}
                ></NormalInput>

                <p>Fecha de inicio</p>
                <DateInput
                    className={""}
                    onChangeHandler={setFechaInicio}
                ></DateInput>

                <p>Fecha de fin</p>
                <DateInput
                    className={""}
                    onChangeHandler={setFechaInicio}
                ></DateInput>

                <p>Asigna miembros a tu tarea!</p>

                <div className="twoButtons">
                    <Modal
                        nameButton="Descartar"
                        textHeader="Descartar Registro"
                        textBody="¿Seguro que quiere descartar el registro de el componente EDT?"
                        colorButton="w-36 bg-slate-100 text-black"
                        oneButton={false}
                        //secondAction={handlerReturn}
                    />
                    <Modal
                        nameButton="Aceptar"
                        textHeader="Registrar Componente"
                        textBody="¿Seguro que quiere desea registrar el componente?"
                        colorButton="w-36 bg-blue-950 text-white"
                        oneButton={false}
                        secondAction={() => {
                            console.log(tareaName);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
