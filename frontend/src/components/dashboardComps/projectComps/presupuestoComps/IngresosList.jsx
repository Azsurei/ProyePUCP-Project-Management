"use client";
import { useContext,useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/presupuesto/ingresosList.css";
import ModalEliminateIngreso from "./ModalEliminateIngreso";
import EditIngreso from "./EditIngreso";
import { set } from "date-fns";
import { NotificationsContext, SessionContext } from "@/app/dashboard/layout";


axios.defaults.withCredentials = true;

function CardIngresos({
    tipoIngreso,
    IngresoObject,
    cantidad,
    montoIngreso,
    horaIngreso,
    refresh,
    handleMoneda,
    initialMoneda,
}) {
    //const [isSelected, setIsSelected] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedLinea, setSelectedLinea] = useState(null);
    const [montoAdapt, setMontoAdapt] = useState(montoIngreso);
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

    const { sessionData } = useContext(SessionContext);
    const userId = sessionData.idUsuario.toString();
    const rol = sessionData.rolInProject;

    const imageIngresoOptions = {
        "Efectivo": "/icons/icon-Efectivo.svg",
        "Transferencia": "/icons/icon-transferencia.svg",
        "Cheque": "/icons/icon-cheque.svg",
        "Licencia de Software": "/icons/icon-licencia.svg",
        "Ingeniero Industrial": "/icons/icon-ingeniero.svg",
        // Agrega más opciones según sea necesario
    };
    const isEgreso= ["Licencia de Software", "Ingeniero Industrial"].includes(tipoIngreso);
    const monedaSymbol = !initialMoneda ? "$" : "S/";
    useEffect(() => {
        console.log("initialMoneda", initialMoneda);
        console.log("IngresoObject.idMoneda", IngresoObject.idMoneda);
        if (initialMoneda && IngresoObject.idMoneda === 1) {
          const nuevoMonto = (montoIngreso * 3.9).toFixed(2); // Redondear a 2 decimales
          setMontoAdapt(nuevoMonto);
          console.log("montoAdapt", nuevoMonto);
        } else if (!initialMoneda && IngresoObject.idMoneda === 2) {
          // Segunda situación
          const nuevoMonto = (montoIngreso / 3.9).toFixed(2); // Redondear a 2 decimales
          setMontoAdapt(nuevoMonto);
          console.log("montoAdapt", nuevoMonto);
        } else {
          const nuevoMonto = montoIngreso.toFixed(2); // Redondear a 2 decimales
          setMontoAdapt(nuevoMonto);
          console.log("montoAdapt", nuevoMonto);
        }
      }, [initialMoneda, IngresoObject.idMoneda]);
      
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
                    <p className={isEgreso ? "titleTipoPagoEgresoHistorial" : "titleTipoPago"}>{IngresoObject.descripcionTransaccionTipo}</p>
                </div>
                <div style={{ marginTop: "12px", marginLeft: "auto" }}>
                    <p className={isEgreso ? "titleMontoEgresoHistorial" : "titleMontoIngreso"}>{monedaSymbol} {montoAdapt}</p>
                    <p className="titleHoraIngreso">{IngresoObject.descripcionIngresoTipo}</p>
                </div>

                {rol !== 2 && (
                    <div className="flex" style={{ marginTop: "12px", marginLeft: "15px" }}>
                    <button className="" type="button" onClick={()=>toggleModal2(IngresoObject)}>
                        <img src="/icons/editar.svg"/>
                    </button>
                    <button className="" type="button" onClick={() => toggleModal(IngresoObject)}>
                        <img src="/icons/eliminar.svg"/>
                    </button>
                    </div>
                    )
                }





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
            {modal2 && selectedLinea && (
                <EditIngreso
                    modal={modal2} 
                    descripcionLineaIngreso={selectedLinea.descripcion}
                    montoIngreso={selectedLinea.monto}
                    lineaIngreso={selectedLinea}
                    idIngresoTipo={selectedLinea.idIngresoTipo}
                    nombreIngresoTipo={selectedLinea.descripcionIngresoTipo}
                    idTransaccionTipo={selectedLinea.idTransaccionTipo}
                    nombreTransaccionTipo={selectedLinea.descripcionTransaccionTipo}
                    idMonedaIngreso={selectedLinea.idMoneda}
                    fechaTransaccionIngreso={selectedLinea.fechaTransaccion}
                    refresh={refresh}
                />
            )}

        </li>
    );
}

export default function IngresosList(props) {
    const router = useRouter();

    const { lista, refresh, changeMoneda, valueMoneda } = props;
    console.log("listaIngresos", lista);
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
    // useEffect(() => {
    //     const handleRefresh = async () => {
    //         refresh();
            
    //         console.log("refreshed");
    //     };
    //     handleRefresh();
    // }, []);
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
                                <CardIngresos
                                    key={component.idLineaIngreso}
                                    tipoIngreso={component.descripcion}
                                    IngresoObject={component}
                                    cantidad={component.cantidad}
                                    montoIngreso={component.monto}
                                    horaIngreso={horaIngreso}
                                    refresh={refresh}
                                    handleMoneda = {changeMoneda}
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