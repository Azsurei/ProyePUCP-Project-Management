"use client";

import ButtonAddNew from "@/components/dashboardComps/projectComps/EDTComps/ButtonAddNew";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import ListElementsEDT from "@/components/dashboardComps/projectComps/EDTComps/ListElementsEDT";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import EDTVisualization from "@/components/dashboardComps/projectComps/EDTComps/EDTVisualization";
import EDTNewVisualization from "@/components/dashboardComps/projectComps/EDTComps/EDTNewVisualization";
import EDTCompVisualization from "@/components/dashboardComps/projectComps/EDTComps/EDTCompVisualization";
axios.defaults.withCredentials = true;

export default function EDT(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [screenState, setScreenState] = useState(1);
    const [ListComps, setListComps] = useState([]);
    const [codeNewComponent, setCodeNewComponent] = useState("");
    const [idElementoPadre, setIdElementoPadre] = useState(null);

    //Variables for EDTCompVisualization
    const [idComponentToSee, setIdComponentToSee] = useState(null);

    function refreshComponentsEDT() {
        console.log("rerendering ListComps");
        const stringURL =
            "http://localhost:8080/api/proyecto/EDT/" +
            projectId +
            "/listarComponentesEDTXIdProyecto";

        axios
            .get(stringURL)
            .then(function (response) {
                const componentsArray = response.data.componentesEDT;
                console.log(componentsArray);
                setListComps(componentsArray);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(refreshComponentsEDT, []);

    const handleScreenChange = () => {
        if (screenState === 1) {
            setScreenState(2);
        } else if (screenState === 2) {
            setListComps([]);
            //Refrescamos lista antes de  continuar
            refreshComponentsEDT();
            setScreenState(1);
        } else if (screenState === 3) {
            setListComps([]);
            refreshComponentsEDT();
            setScreenState(1);
        }
    };

    const handleSetCompCode = (newCode, idCompActual) => {
        setCodeNewComponent(newCode);
        setScreenState(2);
        setIdElementoPadre(idCompActual);
        console.log(newCode);
    };

    const handleVerDetalle = (idComp) => {
        setIdComponentToSee(idComp);
        setScreenState(3);
    };

    //#######################################################

    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <>
            {screenState === 1 && (
                <EDTVisualization
                    projectName={projectName}
                    projectId={projectId}
                    ListComps={ListComps}
                    handlerGoToNew={handleSetCompCode}
                    handleVerDetalle={handleVerDetalle}
                ></EDTVisualization>
            )}

            {screenState === 2 && (
                <EDTNewVisualization
                    projectName={projectName}
                    projectId={projectId}
                    handlerReturn={handleScreenChange}
                    codeNewComponent={codeNewComponent}
                    idElementoPadre={idElementoPadre}
                ></EDTNewVisualization>
            )}

            {screenState === 3 && (
                <EDTCompVisualization
                    projectName={projectName}
                    projectId={projectId}
                    handlerReturn={handleScreenChange}
                    idElementoPadre={idElementoPadre}
                ></EDTCompVisualization>
            )}
        </>
    );
}
