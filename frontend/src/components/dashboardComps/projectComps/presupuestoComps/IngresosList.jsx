"use client";
import { useContext, useEffect, useState } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/presupuesto/ingresosList.css";


axios.defaults.withCredentials = true;

function CardIngresos({
    tipoIngreso,
    usuarioObject,
    tipoPago,
    montoIngreso,
    horaIngreso,
}) {
    //const [isSelected, setIsSelected] = useState(false);

    const imageIngresoOptions = {
        "Ingreso por Efectivo": "/icons/icon-Efectivo.svg",
        "Ingreso por Transferencia": "/icons/icon-transferencia.svg",
        "Licencia de Software": "/icons/icon-licencia.svg",
        "Ingeniero Industrial": "/icons/icon-ingeniero.svg",
        // Agrega más opciones según sea necesario
    };
    const isEgreso= ["Licencia de Software", "Ingeniero Industrial"].includes(tipoIngreso);
    return (
        <li
            className="IngresoCard"
        >
            <img
                className="imgageIngresoDefault"
                src={imageIngresoOptions[tipoIngreso]}
            />
            <div className="informacionIngreso">
                <div style={{ marginTop: "12px", marginLeft: "15px" }}>
                    <p className="titleTipoIngreso">{tipoIngreso}</p>
                    <p className={isEgreso ? "titleTipoPagoEgresoHistorial" : "titleTipoPago"}>{tipoPago}</p>
                </div>
                <div style={{ marginTop: "12px", marginLeft: "auto" }}>
                    <p className={isEgreso ? "titleMontoEgresoHistorial" : "titleMontoIngreso"}>{montoIngreso}</p>
                    <p className="titleHoraIngreso">{horaIngreso}</p>
                </div>
                <div className="flex" style={{ marginTop: "12px", marginLeft: "15px" }}>
                    <button className="" type="button">
                        <img src="/icons/editar.svg"/>
                    </button>
                    <button className="" type="button">
                        <img src="/icons/eliminar.svg"/>
                    </button>
                </div>
            </div>
        </li>
    );
}

export default function IngresosList(props) {
    const router = useRouter();


    if (props.lista.length === 0) {
        return (
            <p className="noResultsMessage">No se encontraron resultados.</p>
        );
    }
    return (
        <div>
            <div className="fechaCard">
                <p className="fechaIngreso">09 de Mayo de 2023</p>
            </div>
            <ul className="ListIngresosProject">
                {props.lista.map((component) => {
                    return (
                        
                        <CardIngresos
                            key={component.id}
                            tipoIngreso={component.tipoIngreso}
                            IngresoObject={component}
                            tipoPago={component.tipoPago}
                            montoIngreso={component.montoIngreso}
                            horaIngreso={component.horaIngreso}
                        ></CardIngresos>
                    );
                })}
            </ul>
        </div>
    );
}