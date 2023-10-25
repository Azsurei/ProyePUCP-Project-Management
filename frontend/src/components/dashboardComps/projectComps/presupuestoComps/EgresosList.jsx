"use client";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/presupuesto/ingresosList.css";
import ModalEliminateIngreso from "./ModalEliminateIngreso";

axios.defaults.withCredentials = true;

function CardEgreso({
    tipoIngreso,
    IngresoObject,
    cantidad,
    montoIngreso,
    horaIngreso,
    refresh,
}) {
    //const [isSelected, setIsSelected] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const toggleModal = (task) => {
        setSelectedTask(task);
        setModal1(!modal1);
        console.log("Esta es la tarea", selectedTask);
    };


    const imageIngresoOptions = {
        "Efectivo": "/icons/icon-Efectivo.svg",
        "Transferencia": "/icons/icon-transferencia.svg",
        "Licencia de Software": "/icons/icon-licencia.svg",
        "Ingeniero Industrial": "/icons/icon-ingeniero.svg",
        // Agrega más opciones según sea necesario
    };
    const isEgreso= ["Licencia de Software", "Ingeniero Industrial"].includes(tipoIngreso);
    const monedaSymbol = IngresoObject.nombreMoneda === "Dolar" ? "$" : "S/";
    return (
        <li
            className="IngresoCard"
        >
            <img
                className="imgageIngresoDefault"
                src={imageIngresoOptions[IngresoObject.descripcionTransaccionTipo]}
            />
            <div className="informacionIngreso">
                <div style={{ marginTop: "12px", marginLeft: "15px" }}>
                    <p className="titleTipoIngreso">{tipoIngreso}</p>
                    <p className={isEgreso ? "titleTipoPagoEgresoHistorial" : "titleTipoPago"}>Cant. {cantidad}</p>
                </div>
                <div style={{ marginTop: "12px", marginLeft: "auto" }}>
                    <p className={isEgreso ? "titleMontoEgresoHistorial" : "titleMontoIngreso"}>{monedaSymbol} {montoIngreso}</p>
                    <p className="titleHoraIngreso">{horaIngreso}</p>
                </div>
                <div className="flex" style={{ marginTop: "12px", marginLeft: "15px" }}>
                    <button className="" type="button">
                        <img src="/icons/editar.svg"/>
                    </button>
                    <button className="" type="button" onClick={() => toggleModal(IngresoObject)}>
                        <img src="/icons/eliminar.svg"/>
                    </button>
                </div>
            </div>
            {modal1 && selectedTask && (
                <ModalEliminateIngreso
                    modal={modal1} 
                    toggle={() => toggleModal(selectedTask)}
                    taskName={selectedTask.descripcion}
                    idLineaIngreso={selectedTask.idLineaIngreso}
                    refresh={refresh}
                />
            )}

        </li>
    );
}

export default function EgresosList(props) {
    const router = useRouter();

    const { lista, refresh } = props;

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
        const fechaTransaccion = new Date(component.fechaTransaccion);
        const fechaKey = fechaTransaccion.toISOString().split('T')[0]; // Usamos la fecha como clave

        if (!fechaGroups[fechaKey]) {
            fechaGroups[fechaKey] = [];
        }

        fechaGroups[fechaKey].push(component);
    });
    return (
        <div>
            {Object.keys(fechaGroups).map((fechaKey) => {
                const fechaTransaccion = new Date(fechaGroups[fechaKey][0].fechaTransaccion);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                const fechaFormateada = fechaTransaccion.toLocaleDateString('es-ES', options);
                const horaIngreso = fechaTransaccion.toLocaleTimeString();

                return (
                    <div key={fechaKey}>
                        <div className="fechaCard">
                            <p className="fechaIngreso">{fechaFormateada}</p>
                        </div>
                        <ul className="ListIngresosProject">
                            {fechaGroups[fechaKey].map((component) => (
                                <CardEgreso
                                    key={component.idLineaIngreso}
                                    tipoIngreso={component.descripcion}
                                    IngresoObject={component}
                                    cantidad={component.cantidad}
                                    montoIngreso={component.monto}
                                    horaIngreso={horaIngreso}
                                    refresh={refresh}
                                />
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}