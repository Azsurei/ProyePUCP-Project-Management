"use client";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/presupuesto/ingresosList.css";
import ModalEliminateEgreso from "./ModalEliminateEgreso";
import EditEgreso from "./EditEgreso";
axios.defaults.withCredentials = true;

function CardEgreso({
    tipoEgreso,
    EgresoObject,
    cantidad,
    costoRealEgreso,
    horaEgreso,
    refresh,
    initialMoneda,
}) {
    //const [isSelected, setIsSelected] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedLinea, setSelectedLinea] = useState(null);
    const [costoAdapt, setCostoAdapt] = useState(costoRealEgreso);
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

    const imageEgresoOptions = {
        "Licencia de Software": "/icons/icon-licencia.svg",
        "Ingeniero Industrial": "/icons/icon-ingeniero.svg",
        // Agrega más opciones según sea necesario
    };
    const isEgreso= ["Licencia de Software", "Ingeniero Industrial"].includes(tipoEgreso);
    const monedaSymbol = !initialMoneda ? "$" : "S/";
    useEffect(() => {
        console.log("initialMoneda", initialMoneda);
        console.log("IngresoObject.idMoneda", EgresoObject.idMoneda);
        if (initialMoneda && EgresoObject.idMoneda === 1) {
          const nuevoMonto = (costoRealEgreso * 3.9).toFixed(2); // Redondear a 2 decimales
          setCostoAdapt(nuevoMonto);
          console.log("montoAdapt", nuevoMonto);
        } else if (!initialMoneda && EgresoObject.idMoneda === 2) {
          // Segunda situación
          const nuevoMonto = (costoRealEgreso / 3.9).toFixed(2); // Redondear a 2 decimales
          setCostoAdapt(nuevoMonto);
          console.log("montoAdapt", nuevoMonto);
        } else {
          const nuevoMonto = costoRealEgreso.toFixed(2); // Redondear a 2 decimales
          setCostoAdapt(nuevoMonto);
          console.log("montoAdapt", nuevoMonto);
        }
      }, [initialMoneda]);
    return (
        <li
            className="IngresoCard"
        >
            <img
                className="imgageIngresoDefault"
                src="/icons/icon-licencia.svg"
            />
            <div className="informacionIngreso">
                <div style={{ marginTop: "12px", marginLeft: "15px" }}>
                    <p className="titleTipoIngreso">{tipoEgreso}</p>
                    <p className={isEgreso ? "titleTipoPagoEgresoHistorial" : "titleTipoPagoEgresoHistorial"}>Cant. {cantidad}</p>
                </div>
                <div style={{ marginTop: "12px", marginLeft: "auto" }}>
                    <p className={isEgreso ? "titleMontoEgresoHistorial" : "titleMontoEgresoHistorial"}>{monedaSymbol} {costoAdapt}</p>
                    {/* <p className="titleHoraIngreso">{horaEgreso}</p> */}
                </div>
                <div className="flex" style={{ marginTop: "12px", marginLeft: "15px" }}>
                    <button className="" type="button" onClick={() => toggleModal2(EgresoObject)}>
                        <img src="/icons/editar.svg"/>
                    </button>
                    <button className="" type="button" onClick={() => toggleModal(EgresoObject)}>
                        <img src="/icons/eliminar.svg"/>
                    </button>
                </div>
            </div>
            {modal1 && selectedTask && (
                <ModalEliminateEgreso
                    modal={modal1} 
                    toggle={() => toggleModal(selectedTask)}
                    taskName={selectedTask.descripcion}
                    idLineaEgreso={selectedTask.idLineaEgreso}
                    refresh={refresh}
                />
            )}
             {modal2 && selectedLinea && (
                <EditEgreso
                    modal={modal2} 
                    descripcionLineaEgreso={selectedLinea.descripcion}
                    costoRealEgreso={selectedLinea.costoReal}
                    lineaEgreso={selectedLinea}
                    idMonedaIngreso={selectedLinea.idMoneda}
                    fechaRegistroEgreso={selectedLinea.fechaRegistro}
                    refresh={refresh}
                    idLineaEstimacion={selectedLinea.idLineaEstimacionCosto}
                    cantidadEgreso={selectedLinea.cantidad}
                    
                    
                />
            )}
        </li>
    );
}

export default function EgresosList(props) {
    const router = useRouter();

    const { lista, refresh, valueMoneda } = props;

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
            // refresh();
            console.log("refreshed");
        };
        handleRefresh();
    }, []);
    const fechaGroups = {}; // Creamos un objeto para agrupar las fechas

    lista.forEach((component) => {
        const fechaRegistro = new Date(component.fechaRegistro);
        const fechaKey = fechaRegistro.toISOString().split('T')[0]; // Usamos la fecha como clave

        if (!fechaGroups[fechaKey]) {
            fechaGroups[fechaKey] = [];
        }

        fechaGroups[fechaKey].push(component);
    });
    return (
        <div>
            {Object.keys(fechaGroups).map((fechaKey) => {
                const fechaRegistro = new Date(fechaGroups[fechaKey][0].fechaRegistro);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                const fechaFormateada = fechaRegistro.toLocaleDateString('es-ES', options);
                const horaEgreso = fechaRegistro.toLocaleTimeString();

                return (
                    <div key={fechaKey}>
                        <div className="fechaCard">
                            <p className="fechaIngreso">{fechaFormateada}</p>
                        </div>
                        <ul className="ListIngresosProject">
                            {fechaGroups[fechaKey].map((component) => (
                                <CardEgreso
                                    key={component.idLineaEgreso}
                                    tipoEgreso={component.descripcion}
                                    EgresoObject={component}
                                    cantidad={component.cantidad}
                                    costoRealEgreso={component.costoReal}
                                    horaEgreso={horaEgreso}
                                    refresh={refresh}
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