import { useState } from "react";
import HeaderWithButtonsSamePage from "./HeaderWithButtonsSamePage";
import ListEditableInput from "./ListEditableInput";
import ButtonAddNew from "./ButtonAddNew";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDTNew.css";

import axios from "axios";
axios.defaults.withCredentials = true;

export default function EDTCompVisualization({
    projectName,
    projectId,
    handlerReturn,
    idElementoPadre
}) {
    //Variables para input
    const [inComponentName, setInComponentName] = useState("");
    const [inTipoComponente, setInTipoComponente] = useState("");
    const [inCodigoComponente, setInCodigoComponente] = useState("");
    const [inFechaInicio, setInFechaInicio] = useState("");
    const [inFechaFin, setInFechaFin] = useState("");
    const [inResponsables, setInResponsables] = useState("");
    const [inDescripcion, setInDescripcion] = useState("");
    const [inRecursos, setInRecursos] = useState("");
    const [inHito, setInHito] = useState("");
    const [inObservaciones, setInObservaciones] = useState("");

    const [listEntregables, setListEntregables] = useState([
        { index: 1, data: "" },
    ]);
    const [listCriterios, setListCriterios] = useState([
        { index: 1, data: "" },
    ]);

    const [datosComponente, setDatosComponente] = useState(null);

    const handleChangeTipoComponente = (e) => {
        //tengo que investigar como se hace en un combo box
    };

    const handleChangeFechaInicio = () => {
        const datepickerInput = document.getElementsByClassName(
            "EDTNewDatepickerInicio"
        );
        const selectedDate = datepickerInput.value;
        setInFechaInicio(selectedDate);
    };

    const handleChangeFechaFin = () => {
        const datepickerInputF = document.getElementsByClassName(
            "EDTNewDatepickerFin"
        );
        const selectedDateF = datepickerInputF.value;
        setInFechaFin(selectedDateF);
    };

    const printAllVariables = () => {
        console.log(inComponentName);
        console.log(inFechaInicio);
        console.log(inFechaFin);
        console.log(inDescripcion);
        console.log(inRecursos);
        console.log(inHito);
        console.log(inObservaciones);
    };

    const handleAddEntregable = () => {
        const newList = [
            ...listEntregables,
            {
                index: listEntregables.length + 1,
                data: "",
            },
        ];
        setListEntregables(newList);
    };

    const handleAddCriterio = () => {
        const newLista = [
            ...listCriterios,
            {
                index: listCriterios.length + 1,
                data: "",
            },
        ];
        setListCriterios(newLista);
    };

    const handleChangeEntregable = (e, index) => {
        const updatedEntregables = [...listEntregables];
        updatedEntregables[index - 1].data = e.target.value;
        console.log(updatedEntregables);
        setListEntregables(updatedEntregables);
    };

    const handleRemoveEntregable = (index) => {
        const updatedEntregables = [...listEntregables];
        updatedEntregables.splice(index - 1, 1); // Remove the element at the given index
        for (let i = index - 1; i < updatedEntregables.length; i++) {
            updatedEntregables[i].index = updatedEntregables[i].index - 1;
        }
        console.log(updatedEntregables);
        setListEntregables(updatedEntregables);
    };

    const handleChangeCriterio = (e, index) => {
        const updatedCriterios = [...listCriterios];
        updatedCriterios[index - 1].data = e.target.value;
        console.log(updatedCriterios);
        setListCriterios(updatedCriterios);
    };

    const handleRemoveCriterio = (index) => {
        const updatedCriterios = [...listCriterios];
        updatedCriterios.splice(index - 1, 1); // Remove the element at the given index
        for (let i = index - 1; i < updatedCriterios.length; i++) {
            updatedCriterios[i].index = updatedCriterios[i].index - 1;
        }
        console.log(updatedCriterios);
        setListCriterios(updatedCriterios);
    };



    const axiosOptions = {
        method: "post", // El método de solicitud puede variar según tus necesidades
        url: "http://localhost:8080/api/proyecto/" + projectId +"/insertarComponenteEDT",
        headers: {
            "Content-Type": "application/json",
        },
        // Otros parámetros de la solicitud, como los datos JSON, deben agregarse aquí
    };


    const handleComponentRegister = () => {
        console.log("Procediendo con insertar el componente");
        axios
            .post(
                "http://localhost:8080/api/proyecto/EDT/" + projectId +"/insertarComponenteEDT",
                {
                    idElementoPadre: idElementoPadre,
                    idProyecto: projectId,
                    descripcion: inDescripcion,
                    codigo: inCodigoComponente,
                    observaciones: inObservaciones,
                    nombre: inComponentName,
                    responsables: inResponsables,
                    fechaInicio: inFechaInicio,
                    fechaFin: inFechaFin,
                    recursos: inRecursos,
                    hito: inHito,
                    criterioAceptacion: listCriterios,
                    entregables: listEntregables,
                }
            )
            .then(function (response) {
                console.log(response);
                console.log(
                    "creo que se inserto tu componente, reza para que todo este en laa bd"
                );

                //cambiamos a la otra paginaa
                handlerReturn();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <div className="EDTNew">
            <HeaderWithButtonsSamePage
                haveReturn={true}
                haveAddNew={false}
                handlerReturn={handlerReturn}
                breadcrump={
                    "Inicio / Proyectos / Proyect X / EDT y Diccionario EDT"
                }
                btnText={"Agregar elemento"}
            >
                Ver detalles de componente
            </HeaderWithButtonsSamePage>

            <div className="EDTNewResponsiveContainer">
                <div className="NewEDTSection">
                    <p className="Header">Informacion basica</p>
                    <div className="FirstCardContainer">
                        <div className="FirstLeftCont">
                            <p>Nombre del componente</p>
                            <textarea
                                rows="1"
                                id="inputBoxGeneric"
                                placeholder="Escribe aquí"
                                maxLength="70"
                                onChange={(e) => {
                                    setInComponentName(e.target.value);
                                }}
                            />
                            <p>Tipo de componente</p>
                            <p>FASE</p>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <p>Posicion</p>
                                <img
                                    src="/icons/icon-info.svg"
                                    alt="help"
                                ></img>
                            </div>
                            <input type="text" readOnly={true}></input>
                        </div>
                        <div className="FirstRightCont">
                            <p>Fecha de inicio</p>
                            <input
                                type="date"
                                id="inputBoxGeneric"
                                className="EDTNewDatepickerInicio"
                                name="datepicker"
                                onChange={handleChangeFechaInicio}
                            ></input>
                            <p>Fecha de fin</p>
                            <input
                                type="date"
                                id="inputBoxGeneric"
                                className="EDTNewDatepickerFin"
                                name="datepicker"
                                onChange={handleChangeFechaFin}
                            ></input>
                            <p>Responsables</p>
                            <textarea
                                rows="1"
                                id="inputBoxGeneric"
                                placeholder="Escribe aquí"
                                maxLength="70"
                                onChange={(e) => {
                                    setInResponsables(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="NewEDTSection">
                    <p className="Header">Detalles del componente</p>
                    <div className="SecondCardContainer">
                        <p>Descripcion detallada</p>
                        <textarea
                            rows="1"
                            id="inputBoxGeneric"
                            placeholder="Escribe aquí"
                            maxLength="70"
                            onChange={(e) => {
                                setInDescripcion(e.target.value);
                            }}
                        />
                        <p>Recursos</p>
                        <textarea
                            rows="1"
                            id="inputBoxGeneric"
                            placeholder="Escribe aquí"
                            maxLength="70"
                            onChange={(e) => {
                                setInRecursos(e.target.value);
                            }}
                        />
                        <p>Hito asociado</p>
                        <textarea
                            rows="1"
                            id="inputBoxGeneric"
                            placeholder="Escribe aquí"
                            maxLength="70"
                            onChange={(e) => {
                                setInHito(e.target.value);
                            }}
                        />
                        <p>Observaciones</p>
                        <textarea
                            rows="1"
                            id="inputBoxGeneric"
                            placeholder="Escribe aquí"
                            maxLength="70"
                            onChange={(e) => {
                                setInObservaciones(e.target.value);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="EDTNewResponsiveContainer">
                <div className="NewEDTSection">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignContent: "center",
                        }}
                    >
                        <p className="Header">Entregables</p>
                        <button
                            onClick={handleAddEntregable}
                            className="btnEDTAnadir"
                        >
                            Anadir entregable
                        </button>
                    </div>

                    <div className="ThirdCardContainer">
                        <ListEditableInput
                            ListInputs={listEntregables}
                            typeName="Entregable"
                            handleChanges={handleChangeEntregable}
                            handleRemove={handleRemoveEntregable}
                        ></ListEditableInput>
                    </div>
                </div>

                <div className="NewEDTSection">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignContent: "center",
                        }}
                    >
                        <p className="Header">Criterios de aceptacion</p>
                        <button
                            onClick={handleAddCriterio}
                            className="btnEDTAnadir"
                        >
                            Anadir criterio
                        </button>
                    </div>

                    <div className="FourthCardContainer">
                        <ListEditableInput
                            ListInputs={listCriterios}
                            typeName="Criterio"
                            handleChanges={handleChangeCriterio}
                            handleRemove={handleRemoveCriterio}
                        ></ListEditableInput>
                    </div>
                </div>
            </div>

            <div className="ButtonsContainer">
                <button>Cancelar</button>
                <button onClick={handleComponentRegister}>Guardar</button>
            </div>
        </div>
    );
}
