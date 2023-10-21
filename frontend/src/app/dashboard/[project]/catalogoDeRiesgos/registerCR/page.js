"use client";
import "@/styles/dashboardStyles/projectStyles/catalogoDeRiesgosStyles/registerCR.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { SmallLoadingScreen } from "../../layout";
import { Textarea } from "@nextui-org/react";
import MyCombobox from "@/components/ComboBox";
import { useRouter } from "next/navigation";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
axios.defaults.withCredentials = true;

export default function CatalogoDeRiesgosRegister(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    console.log("El id del proyecto es:", projectId);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    const [name, setName] = useState("");
    const [detail, setDetail] = useState("");
    const [probability, setProbability] = useState(null);
    const [impact, setImpact] = useState(null);

    const isTextTooLong1 = name.length > 400;
    const isTextTooLong2 = detail.length > 400;

    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    const handleSelectedValueChangeProbability = (value) => {
        setProbability(value);
    };

    const handleSelectedValueChangeImpact = (value) => {
        setImpact(value);
    }

    return (
        <div className="containerRegisterCR">
            <div className="headerRegisterCR">
                Inicio / Proyectos / Nombre del proyecto / Catálogo de Riesgos/
                Registrar riesgo
            </div>
            <div className="riskRegisterCR">
                <div className="titleRiskRegisterCR">Crear nuevo riesgo</div>
                <div>
                    <Textarea
                        label="Nombre del riesgo"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-label"
                        value={name}
                        onValueChange={setName}
                        maxLength="450"
                        isInvalid={isTextTooLong1}
                        errorMessage={
                            isTextTooLong1
                                ? "El texto debe ser como máximo de 400 caracteres."
                                : ""
                        }
                    />
                </div>
                <div>
                    <Textarea
                        label="Detalle del riesgo"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-label"
                        minRows="5"
                        value={detail}
                        onValueChange={setDetail}
                        maxLength="450"
                        isInvalid={isTextTooLong2}
                        errorMessage={
                            isTextTooLong2
                                ? "El texto debe ser como máximo de 400 caracteres."
                                : ""
                        }
                    />
                </div>
                <div className="comboCR">
                    <div className="containerComboCR">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Probabilidad"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi="http://localhost:8080/api/proyecto/matrizDeComunicaciones/listarCanales"
                            property="canales"
                            nameDisplay="nombreCanal"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeProbability}
                            idParam="idCanal"
                        />
                    </div>
                    <div className="containerComboCR">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Impacto"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi="http://localhost:8080/api/proyecto/matrizDeComunicaciones/listarFrecuencia"
                            property="frecuencias"
                            nameDisplay="nombreFrecuencia"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeImpact}
                            idParam="idFrecuencia"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
