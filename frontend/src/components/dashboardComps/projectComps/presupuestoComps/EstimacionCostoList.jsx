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
    canSelect,
    onSelect,
    initialMoneda,
}) {
    //const [isSelected, setIsSelected] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedLinea, setSelectedLinea] = useState(null);
    const [isSelected, setIsSelected] = useState(false);
    const [tarifaAdapt, setTarifaAdapt] = useState(tarifaEstimacion);
    const [subtotalAdapt, setSubtotalAdapt] = useState("");

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

    // const handleCardSelect = () => {
    //     if (onSelect) {
    //         if (isSelected) {
    //             setIsSelected(false);
    //             onSelect(null);
    //             console.log("deseleccionado");
    //         } else {
    //             setIsSelected(!isSelected);
    //         onSelect(EstimacionObject);
    //         }
            
    //     }
    // };
    const handleCardSelect = () => {
        if (onSelect && canSelect) {
            setIsSelected(!isSelected); // Cambiar el estado isSelected
            onSelect(EstimacionObject, !isSelected); // Pasar el elemento y el estado de selección
        }
    };
    

    const monedaSymbol = !initialMoneda ? "$" : "S/";
    useEffect(() => {
        console.log("initialMoneda", initialMoneda);
        console.log("IngresoObject.idMoneda", EstimacionObject.idMoneda);
        if (initialMoneda && EstimacionObject.idMoneda === 1) {
          const nuevoMonto = (tarifaEstimacion * 3.9).toFixed(2); // Redondear a 2 decimales
          const nuevoSubtotal = (EstimacionObject.subtotal * 3.9).toFixed(2);
          setTarifaAdapt(nuevoMonto);
          setSubtotalAdapt(nuevoSubtotal);
          console.log("montoAdapt", nuevoMonto);
        } else if (!initialMoneda && EstimacionObject.idMoneda === 2) {
          // Segunda situación
          const nuevoMonto = (tarifaEstimacion / 3.9).toFixed(2); // Redondear a 2 decimales
          const nuevoSubtotal = (EstimacionObject.subtotal / 3.9).toFixed(2);
          setTarifaAdapt(nuevoMonto);
          setSubtotalAdapt(nuevoSubtotal);
          console.log("montoAdapt", nuevoMonto);
        } else {
          const nuevoMonto = tarifaEstimacion.toFixed(2); // Redondear a 2 decimales
            const nuevoSubtotal = EstimacionObject.subtotal.toFixed(2);
          setTarifaAdapt(nuevoMonto);
            setSubtotalAdapt(nuevoSubtotal);
          console.log("montoAdapt", nuevoMonto);
        }
      }, [initialMoneda]);
    return (
        <li
            className={isSelected ? "IngresoCard active" : "IngresoCard"}
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
                    <p className="titleTarifaEstimacion">{monedaSymbol} {tarifaAdapt}</p>
                    <p className="titleHoraIngreso">Subtotal: {monedaSymbol} {subtotalAdapt}</p>
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

    const { lista, refresh , isEdit , isSelected, changeMoneda, valueMoneda} = props;
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
    const handleCardSelect = (selectedData, isSelected) => {
        // Llama a la función proporcionada desde la página principal para pasar el dato de regreso
        props.onCardSelect(selectedData, isSelected);
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
                                    canSelect={isSelected}
                                    onSelect={(selectedData, isSelected) => handleCardSelect(selectedData, isSelected)}
                                    initialMoneda = {valueMoneda}
                                />
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}