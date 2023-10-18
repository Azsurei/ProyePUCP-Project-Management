"use client";
import "@/styles/dashboardStyles/projectStyles/MComunicationStyles/registerMC.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { SmallLoadingScreen } from "../../layout";
axios.defaults.withCredentials = true;

export default function MatrizComunicacionesRegister(props){
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    return (
        <div className="containerRegisterMC">
            <div className="headerRegisterMC">
                Inicio / Proyectos / Nombre del proyecto / Matriz de Comunicaciones/ Registrar elemento
            </div>
            <div className="titleBacklogRegisterMC">
                Crear nueva información requerida
            </div>
        </div>
    );
}