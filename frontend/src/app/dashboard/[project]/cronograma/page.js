"use client";
import NormalInput from "@/components/NormalInput";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import AgendaTable from "@/components/dashboardComps/projectComps/cronogramaComps/AgendaTable";
import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/cronogramaPage.css";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import { useState } from "react";
import DateInput from "@/components/DateInput";
import TabUserSelect from "@/components/dashboardComps/projectComps/cronogramaComps/TabUserSelect";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/modalUsers";

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

    const [selected, setSelected] = useState("users");

    const [modal, setModal] = useState(false);

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

            {/*=========================================================================================*/}

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

                <div className="contNombre">
                    <p>Nombre de tarea</p>
                    <NormalInput
                        className={""}
                        onChangeHandler={setTareaName}
                        placeHolder={"Escriba aqui"}
                        maxLength={70}
                        rows={1}
                    ></NormalInput>
                </div>

                <div className="contDescripcion">
                    <p>Descripcion</p>
                    <NormalInput
                        className={""}
                        onChangeHandler={setTareaName}
                        placeHolder={"Escriba aqui"}
                        maxLength={70}
                        rows={3}
                    ></NormalInput>
                </div>

                <div className="containerFechas">
                    <div className="contFechaInicio">
                        <p>Fecha de inicio</p>
                        <DateInput
                            className={""}
                            onChangeHandler={setFechaInicio}
                        ></DateInput>
                    </div>

                    <div className="contFechaFin">
                        <p>Fecha de fin</p>
                        <DateInput
                            className={""}
                            onChangeHandler={setFechaInicio}
                        ></DateInput>
                    </div>
                </div>

                <p style={{ paddingTop: ".7rem" }}>
                    Asigna miembros a tu tarea!
                </p>
                <div className="containerTab">
                    <TabUserSelect
                        selectedKey={selected}
                        onSelectionChange={setSelected}
                    ></TabUserSelect>
                    <div
                        className="btnToPopUp"
                        onClick={()=>{setModal(true)}}
                    >
                        <p>
                            {selected === "users"
                                ? "Buscar un miembro"
                                : "Buscar un subequipo"}
                        </p>
                        <img
                            src="/icons/icon-searchBar.svg"
                            alt=""
                            className="icnSearch"
                        />
                    </div>
                </div>
                <div className="contUsers">
                    <p className="noUsersMsg">
                        {selected === "users"
                            ? "No ha seleccionado ningun usuario"
                            : "No ha seleccionado ningun subequipo"}
                    </p>
                </div>

                <div className="twoButtonsEnd">
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
                        verifyFunction={() => {
                            if(false){
                                //setFieldsEmpty(true);
                                return false;
                            }else{
                                //setFieldsEmpty(false);
                                return true;
                            }
                        }}
                    />
                </div>
            </div>
            {console.log('valor de modal es' + modal)}
            {modal && (
                <ModalUser
                    handlerModalClose={() => {
                        setModal(false);
                    }}
                    //handlerModalFinished={returnListOfMiembros}
                ></ModalUser>
            )}
        </div>
    );
}
