import { useState } from "react";
import HeaderWithButtonsSamePage from "./HeaderWithButtonsSamePage";
import ListEditableInput from "./ListEditableInput";
import ButtonAddNew from "./ButtonAddNew";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDTNew.css";

export default function EDTNewVisualization({projectName,projectId, handlerReturn}) {
    //Variables para input
    const [inComponentName,setInComponentName] = useState('');
    const [inTipoComponente,setInTipoComponente] = useState('');
    //const [inPosicionComponente, setInPosicionComponente] = useState(''); QUEDA PENDIENTE A FUTURO QUE SEA EDITABLE
    const [inFechaInicio, setInFechaInicio] = useState('');
    const [inFechaFin, setInFechaFin] = useState('');
    
    const [inDescripcion  ,setInDescripcion] = useState('');
    const [inRecursos, setInRecursos] = useState('');
    const [inHito, setInHito] = useState('');
    const [inObservaciones, setInObservaciones] = useState('');
    
    const [listEntregables, setListEntregables] = useState([{index: 1, data: ''}]);
    const [listCriterios, setListCriterios] = useState([{index: 1, data: ''}]);



    const handleChangeComponentName = (e) => {
        setInComponentName(e.target.value);
    }

    const handleChangeTipoComponente = (e) => {
        //tengo que investigar como se hace en un combo box
    }

    const handleChangeFechaInicio = () => {
        const datepickerInput = document.getElementById("datepickerInicio");
        const selectedDate = datepickerInput.value;
        console.log(selectedDate);
        setInFechaInicio(selectedDate);
    }

    const handleChangeFechaFin = () => {
        const datepickerInputF = document.getElementById("datepickerFin");
        const selectedDateF = datepickerInputF.value;
        console.log(selectedDateF);
        setInFechaFin(selectedDateF);
    }

    const handleChangeDescripcion = (e) => {
        setInDescripcion(e.target.value);
    }

    const handleChangeRecursos = (e) => {
        setInRecursos(e.target.value);
    }

    const handleChangeHito = (e) => {
        setInHito(e.target.value);
    }

    const handleChangeObservacines = (e) => {
        setInObservaciones(e.target.value);
    }


    const handleAddEntregable = ()=>{
        const newList =  [
            ...listEntregables, 
            {
            index: listEntregables.length + 1,
            data: ''
            }
        ];
        setListEntregables(newList);
    }

    const handleAddCriterio = ()=>{
        const newLista = [
            ...listCriterios, 
            {
            index: listCriterios.length + 1,
            data: ''
            }
        ];
        setListCriterios(newLista);
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
                Crear nuevo componente
            </HeaderWithButtonsSamePage>

            <div className="NewEDTSection">
                <p className="Header">Informacion basica</p>
                <div className="FirstCardContainer">
                    <div className="FirstLeftCont">
                        <p>Nombre del componente</p>
                        <input
                            type="text"
                            onChange={handleChangeComponentName}
                        ></input>
                        <p>Tipo de componente</p>
                        <p>FASE</p>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <p>Posicion</p>
                            <img src="/icons/icon-info.svg" alt="help"></img>
                        </div>
                        <input
                            tpye="text"
                            onChange={
                                {
                                    /*</div>hand*/
                                }
                            }
                        ></input>
                    </div>
                    <div className="FirstRightCont">
                        <p>Fecha de inicio</p>
                        <input
                            type="date"
                            id="datepickerInicio"
                            name="datepicker"
                            onChange={handleChangeFechaInicio}
                        ></input>
                        <p>Fecha de fin</p>
                        <input
                            type="date"
                            id="datepickerFin"
                            name="datepicker"
                            onChange={handleChangeFechaFin}
                        ></input>
                        <p>Responsables</p>
                        <input></input>
                    </div>
                </div>
            </div>

            <div className="NewEDTSection">
                <p className="Header">Detalles del componente</p>
                <div className="SecondCardContainer">
                    <p>Descripcion detallada</p>
                    <input></input>
                    <p>Recursos</p>
                    <input></input>
                    <p>Hito asociado</p>
                    <input></input>
                    <p>Observaciones</p>
                    <input></input>
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
                    ></ListEditableInput>
                </div>
            </div>
            <div className="ButtonsContainer">
                <ButtonAddNew>Cancelar</ButtonAddNew>
                <ButtonAddNew>Guardar elemento</ButtonAddNew>
            </div>
        </div>
    );
}
