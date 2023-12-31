"use client";

import ButtonAddNew from "@/components/dashboardComps/projectComps/EDTComps/ButtonAddNew";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import ListElementsEDT from "@/components/dashboardComps/projectComps/EDTComps/ListElementsEDT";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import Link from "next/link";
import React from "react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import EDTVisualization from "@/components/dashboardComps/projectComps/EDTComps/EDTVisualization";
import EDTNewVisualization from "@/components/dashboardComps/projectComps/EDTComps/EDTNewVisualization";
import EDTCompVisualization from "@/components/dashboardComps/projectComps/EDTComps/EDTCompVisualization";
import { SmallLoadingScreen } from "../layout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

axios.defaults.withCredentials = true;

export default function EDT(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [screenState, setScreenState] = useState(1);
    const [ListComps, setListComps] = useState([]);
    const [codeNewComponent, setCodeNewComponent] = useState("");
    const [idElementoPadre, setIdElementoPadre] = useState(null);

    //Variables for EDTCompVisualization
    const [idComponentToSee, setIdComponentToSee] = useState(null);

    const [isListLoading, setIsListLoading] = useState(true);

    const [selectedTab, setSelectedTab] = useState("dropdown");

    function refreshComponentsEDT() {
        setIsLoadingSmall(false);
        setIsListLoading(true);
        console.log("rerendering ListComps");
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/EDT/" +
            projectId +
            "/listarComponentesEDTXIdProyecto";

        axios
            .get(stringURL)
            .then(function (response) {
                const componentsArray = response.data.componentesEDT;
                console.log(JSON.stringify(componentsArray, null, 2));
                setListComps(componentsArray);

                setIsListLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                setIsLoadingSmall(false);
                toast.error("Error al ver lista de componentes");
            });
    }

    useEffect(()=>{
        setIsLoadingSmall(false);
        refreshComponentsEDT();
    }, []);

    const handleScreenChange = () => {
        if (screenState === 1) {
            setScreenState(2);
        } else if (screenState === 2) {
            setIsLoadingSmall(true);
            setListComps([]);
            //Refrescamos lista antes de  continuar
            refreshComponentsEDT();
            setScreenState(1);
        } else if (screenState === 3) {
            setIsLoadingSmall(true);
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

    const router = useRouter();

    //#######################################################

    

    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <div style={{ height: "100%" }}>
            {screenState === 1 && (
                <EDTVisualization
                    projectName={projectName}
                    projectId={projectId}
                    ListComps={ListComps}
                    handlerGoToNew={handleSetCompCode}
                    handleVerDetalle={handleVerDetalle}
                    refreshComponentsEDT={refreshComponentsEDT}
                    isListLoading={isListLoading}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
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
                    idComponentToSee={idComponentToSee}
                ></EDTCompVisualization>
            )}
        </div>
    );
}
