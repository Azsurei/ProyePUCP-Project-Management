"use client";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/presupuesto/ingresosList.css";
import ModalEliminateEstimacion from "./ModalEliminateEstimaciones";
import EditIngreso from "./EditIngreso";
import EditEstimacion from "./EditEstimacion";

axios.defaults.withCredentials = true;

function CardEstimacionCosto({
    descripcionEstimacion,
    EstimacionObject,
    cantidad,
    tarifaEstimacion,
    horaIngreso,
    isEdit,
    refresh,
    onSelect,
}) {
    //const [isSelected, setIsSelected] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedLinea, setSelectedLinea] = useState(null);
    
    const toggleModal = (task) => {
        setSelectedTask(task);
        setModal1(!modal1);
        console.log("Esta es la tarea", selectedTask);
    };

    const toggleModal2 = (task) => {
        setSelectedLinea(task);
        setModal2(!modal2);
        console.log("Esta es la linea", selectedLinea);
    };

    const handleCardSelect = () => {
        if (onSelect) {
            onSelect(EstimacionObject);
        }
    };

    const monedaSymbol = EstimacionObject.nombreMoneda === "USD" ? "$" : "S/";
    return (
        <li
            className="IngresoCard"
            onClick={handleCardSelect}
        >
            <img
                className="imgageIngresoDefault"
                src="/icons/PeopleGroupIcon.svg"
            />
            <div className="informacionIngreso">
                <div style={{ marginTop: "12px", marginLeft: "15px" }}>
                    <p className="titleTipoIngreso">{descripcionEstimacion}</p>
                    <p className="titleEstimacionPago">Cant. {EstimacionObject.cantidadRecurso}</p>
                </div>
                <div style={{ marginTop: "12px", marginLeft: "auto" }}>
                    <p className="titleTarifaEstimacion">{monedaSymbol} {tarifaEstimacion}</p>
                    <p className="titleHoraIngreso">{monedaSymbol} {EstimacionObject.subtotal}</p>
                </div>
                <div className="flex" style={{ marginTop: "12px", marginLeft: "15px" }}>
                {isEdit && (
                    <>
                    <button className="" type="button" onClick={() => toggleModal2(EstimacionObject)}>
                        <img src="/icons/editar.svg" />
                    </button>
                    <button className="" type="button" onClick={() => toggleModal(EstimacionObject)}>
                        <img src="/icons/eliminar.svg" />
                    </button>
                     </>
                )}
                </div>
            </div>
            {modal1 && selectedTask && (
                <ModalEliminateEstimacion
                    modal={modal1} 
                    toggle={() => toggleModal(selectedTask)}
                    taskName={selectedTask.descripcion}
                    idEstimacion={selectedTask.idLineaEstimacion}
                    refresh={refresh}
                />
            )}
            {modal2 && selectedLinea && (
                <EditEstimacion
                    modal={modal2}
                    idLineaEstimacion={selectedLinea.idLineaEstimacion} 
                    descripcionEstimacionCosto={selectedLinea.descripcion}
                    tarifaEstimacion={selectedLinea.tarifaUnitaria}
                    estimacionCosto={selectedLinea}
                    cantidadRecurso={selectedLinea.cantidadRecurso}
                    mesesEstimacion={(selectedLinea.subtotal/(selectedLinea.tarifaUnitaria*selectedLinea.cantidadRecurso)).toFixed(2)}
                    idMonedaEstimacion={selectedLinea.idMoneda}
                    fechaInicio={selectedLinea.fechaInicio}
                    subtotalEstimacion={selectedLinea.subtotal}
                    refresh={refresh}
                />
            )}

        </li>
    );
}

export default function EstimacionCostoList(props) {
    const router = useRouter();

    const { lista, refresh , isEdit} = props;
    console.log("listaEstimaciones", lista);
    if (props.lista.length === 0) {
        return (
            <p className="noResultsMessage">No se encontraron resultados.</p>
        );
    }

    // const primeraLinea = props.lista[0];
    // const fechaTransaccion = new Date(primeraLinea.fechaTransaccion);
    // const options = { day: 'numeric', month: 'long', year: 'numeric' };
    // const fechaFormateada = fechaTransaccion.toLocaleDateString('es-ES', options);
    // const horaIngreso = fechaTransaccion.toLocaleTimeString();
    useEffect(() => {
        const handleRefresh = async () => {
            refresh();
            console.log("refreshed");
        };
        handleRefresh();
    }, []);
    const fechaGroups = {}; // Creamos un objeto para agrupar las fechas

    lista.forEach((component) => {
        const fechaInicio = new Date(component.fechaInicio);
        const fechaKey = fechaInicio.toISOString().split('T')[0]; // Usamos la fecha como clave

        if (!fechaGroups[fechaKey]) {
            fechaGroups[fechaKey] = [];
        }

        fechaGroups[fechaKey].push(component);
    });
    const handleCardSelect = (selectedData) => {
        // Llama a la función proporcionada desde la página principal para pasar el dato de regreso
        props.onCardSelect(selectedData);
      }

    return (
        <div>
            {Object.keys(fechaGroups).map((fechaKey) => {
                const fechaInicio = new Date(fechaGroups[fechaKey][0].fechaInicio);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                const fechaFormateada = fechaInicio.toLocaleDateString('es-ES', options);
                const horaIngreso = fechaInicio.toLocaleTimeString();

                return (
                    <div key={fechaKey}>
                        <div className="fechaCard">
                            <p className="fechaIngreso">{fechaFormateada}</p>
                        </div>
                        <ul className="ListIngresosProject">
                            {fechaGroups[fechaKey].map((component) => (
                                <CardEstimacionCosto
                                    key={component.idLineaEstimacion}
                                    descripcionEstimacion={component.descripcion}
                                    EstimacionObject={component}
                                    cantidad={component.cantidadRecurso}
                                    tarifaEstimacion={component.tarifaUnitaria}
                                    horaIngreso={horaIngreso}
                                    isEdit={isEdit}
                                    refresh={refresh}
                                    onSelect={() => handleCardSelect(component)}
                                />
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}