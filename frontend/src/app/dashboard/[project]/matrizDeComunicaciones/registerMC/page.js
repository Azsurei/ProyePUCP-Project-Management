"use client";
import "@/styles/dashboardStyles/projectStyles/MComunicationStyles/registerMC.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { SmallLoadingScreen } from "../../layout";
import { Textarea } from "@nextui-org/react";
axios.defaults.withCredentials = true;

export default function MatrizComunicacionesRegister(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const [sumilla, setSumilla] = useState("");
    const [detalle, setDetalle] = useState("");
    const [grupoReceptor, setGrupoReceptor] = useState("");

    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    return (
        <div className="containerRegisterMC">
            <div className="headerRegisterMC">
                Inicio / Proyectos / Nombre del proyecto / Matriz de
                Comunicaciones/ Registrar elemento
            </div>
            <div className="backlogRegisterMC">
                <div className="titleBacklogRegisterMC">
                    Crear nueva información requerida
                </div>
                <div>
                    <Textarea
                        label="Sumilla de la información requerida"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-label"
                        value={sumilla}
                        onValueChange={setSumilla}
                    />
                </div>
                <div className="comboMC">

                </div>
                <div>
                    <Textarea
                        label="Detalle de la información requerida"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-label"
                        minRows="5"
                        value={detalle}
                        onValueChange={setDetalle}
                    />
                 </div>   
                 <div>
                    <Textarea
                        label="Grupo receptor"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-label"
                        value={grupoReceptor}
                        onValueChange={setGrupoReceptor}
                    />
                 </div>
            </div>
        </div>
    );
}
