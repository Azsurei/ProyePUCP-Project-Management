"use client";
import NormalInput from "@/components/NormalInput";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import AgendaTable from "@/components/dashboardComps/projectComps/cronogramaComps/AgendaTable";
import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/cronogramaPage.css";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import { useEffect, useState } from "react";
import DateInput from "@/components/DateInput";
import TabUserSelect from "@/components/dashboardComps/projectComps/cronogramaComps/TabUserSelect";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/modalUsers";
import CardSelectedUser from "@/components/CardSelectedUser";
import { Textarea } from "@nextui-org/react";

import axios from "axios";
axios.defaults.withCredentials = true;

export default function Cronograma(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [toggleNew, setToggleNew] = useState(false);
    const handlerGoToNew = () => {
        setToggleNew(!toggleNew);
    };

    const [tareaName, setTareaName] = useState("");
    const [validName, setValidName] = useState(true);

    const [tareaDescripcion, setTareaDescripcion] = useState("");
    const [validDescripcion, setValidDescripcion] = useState(true);

    const [fechaInicio, setFechaInicio] = useState("");
    const [validFechaI, setValidFechaI] = useState(true);

    const [fechaFin, setFechaFin] = useState("");
    const [validFechaF, setValidFechaF] = useState(true);

    const [tabSelected, setTabSelected] = useState("users");
    const [modal, setModal] = useState(false);

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedSubteam, setSelectedSubteam] = useState({
        idSubequipo: 1,
        nombre: "Backend Team",
    });

    
    const [modalFirstTime, setModalFirstTime] = useState(false);

    const returnListOfUsers = (newUsersList) => {
        const newList = [...selectedUsers, ...newUsersList];

        setSelectedUsers(newList);
        setModal(false);
    };

    const removeUser = (user) => {
        const newList = selectedUsers.filter((item) => item.id !== user.id);
        setSelectedUsers(newList);
        console.log(newList);
    };

    // useEffect(() => {
    //     setSelectedSubteam(null);
    // }, [selectedUsers]);

    // useEffect(() => {
    //     setSelectedUsers([]);
    // }, [selectedSubteam]);

    useEffect(() => {
        const stringURL =
            "http://localhost:8080/api/proyecto/cronograma/listarCronograma";

        axios
            .post(stringURL,{idProyecto: projectId})
            .then(function (response) {
                const cronogramaData = response.data.cronograma;
                console.log(cronogramaData);

                if(cronogramaData.fechaInicio === null || cronogramaData.fechaFin ===null){
                    setModalFirstTime(true);
                }
                //setIsLoading(false);
                
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const msgEmptyField = "Este campo no puede estar vacio";

    return (
        <div className="cronogramaDiv">
            {modalFirstTime && (<div>hey</div>)}
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
                <div className="containerGeneralRight">
                    <HeaderWithButtonsSamePage
                        haveReturn={true}
                        haveAddNew={false}
                        //handlerAddNew={handlerGoToNew}
                        handlerReturn={handlerGoToNew}
                        //newPrimarySon={ListComps.length + 1}
                        breadcrump={
                            "Inicio / Proyectos / " +
                            projectName +
                            " / Cronograma"
                        }
                        btnText={"Nueva tarea"}
                    >
                        Nueva tarea
                    </HeaderWithButtonsSamePage>

                    <div className="contNombre">
                        <p>Nombre de tarea</p>

                        <Textarea
                            isInvalid={!validName}
                            errorMessage={!validName ? msgEmptyField : ""}
                            key={"bordered"}
                            variant={"bordered"}
                            labelPlacement="outside"
                            placeholder="Escriba aquí"
                            className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                            value={tareaName}
                            onValueChange={setTareaName}
                            minRows={1}
                            size="sm"
                            onChange={() => {
                                setValidName(true);
                            }}
                        />
                    </div>

                    <div className="contDescripcion">
                        <p>Descripcion</p>

                        <Textarea
                            isInvalid={!validDescripcion}
                            errorMessage={
                                !validDescripcion ? msgEmptyField : ""
                            }
                            key={"bordered"}
                            variant={"bordered"}
                            labelPlacement="outside"
                            placeholder="Escriba aquí"
                            className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                            value={tareaDescripcion}
                            onValueChange={setTareaDescripcion}
                            minRows={4}
                            size="sm"
                            onChange={() => {
                                setValidDescripcion(true);
                            }}
                        />
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
                            selectedKey={tabSelected}
                            onSelectionChange={setTabSelected}
                        ></TabUserSelect>
                        <div
                            className="btnToPopUp"
                            onClick={() => {
                                setModal(true);
                            }}
                        >
                            <p>
                                {tabSelected === "users"
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

                    <ul className="contUsers">
                        {tabSelected === "users" ? (
                            selectedUsers.length !== 0 ? (
                                selectedUsers.map((component) => (
                                    <CardSelectedUser
                                        key={component.id}
                                        name={component.name}
                                        lastName={component.lastName}
                                        usuarioObject={component}
                                        email={component.email}
                                        removeHandler={removeUser}
                                    ></CardSelectedUser>
                                ))
                            ) : (
                                <p className="noUsersMsg">
                                    No ha seleccionado ningun usuario
                                </p>
                            )
                        ) : selectedSubteam !== null ? (
                            <div className="cardSubteam">
                                <div className="cardLeftSide">
                                    <img src="/icons/sideBarDropDown_icons/sbdd14.svg"></img>
                                    <p>{selectedSubteam.nombre}</p>
                                </div>
                                <img
                                    src="/icons/icon-crossBlack.svg"
                                    onClick={() => {
                                        setSelectedSubteam(null);
                                    }}
                                ></img>
                            </div>
                        ) : (
                            <p className="noUsersMsg">
                                No ha seleccionado ningun subequipo
                            </p>
                        )}
                    </ul>

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
                                let allValid = true;
                                if (tareaName === "") {
                                    setValidName(false);
                                    allValid = false;
                                }
                                if (tareaDescripcion === "") {
                                    setValidDescripcion(false);
                                    allValid = false;
                                }

                                if (allValid) {
                                    return true;
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            {modal && (
                <ModalUser
                    handlerModalClose={() => {
                        setModal(false);
                    }}
                    handlerModalFinished={returnListOfUsers}
                    excludedUsers={selectedUsers}
                ></ModalUser>
            )}
        </div>
    );
}
