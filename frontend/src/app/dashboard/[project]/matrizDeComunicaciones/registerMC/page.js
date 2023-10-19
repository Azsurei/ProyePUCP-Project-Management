"use client";
import "@/styles/dashboardStyles/projectStyles/MComunicationStyles/registerMC.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { SmallLoadingScreen } from "../../layout";
import { Textarea } from "@nextui-org/react";
import MyCombobox from "@/components/ComboBox";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
import { useRouter } from "next/navigation";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
axios.defaults.withCredentials = true;

export default function MatrizComunicacionesRegister(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    const [sumilla, setSumilla] = useState("");
    const [detail, setDetail] = useState("");
    const [groupReceiver, setGroupReceiver] = useState("");
    const [canal, setCanal] = useState("");
    const [frecuency, setFrecuency] = useState("");
    const [format, setFormat] = useState("");

    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    const handleSelectedValueChangeCanal = (value) => {
        setCanal(value);
    };

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
                    <div className="containerComboMC">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Canal"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi="http://localhost:8080/api/proyecto/backlog/hu/listarHistoriasPrioridad"
                            property="historiasPrioridad"
                            nameDisplay="nombre"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeCanal}
                            idParam="idHistoriaPrioridad"
                        />
                    </div>
                    <div className="containerComboMC">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Frecuencia"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi="http://localhost:8080/api/proyecto/backlog/hu/listarHistoriasPrioridad"
                            property="historiasPrioridad"
                            nameDisplay="nombre"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeCanal}
                            idParam="idHistoriaPrioridad"
                        />
                    </div>
                    <div className="containerComboMC">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Formato"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi="http://localhost:8080/api/proyecto/backlog/hu/listarHistoriasPrioridad"
                            property="historiasPrioridad"
                            nameDisplay="nombre"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeCanal}
                            idParam="idHistoriaPrioridad"
                        />
                    </div>
                    <div className="containerComboMC">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Responsable de comunicar"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi="http://localhost:8080/api/proyecto/backlog/hu/listarHistoriasPrioridad"
                            property="historiasPrioridad"
                            nameDisplay="nombre"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeCanal}
                            idParam="idHistoriaPrioridad"
                        />
                    </div>
                </div>
                <div>
                    <Textarea
                        label="Detalle de la información requerida"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-label"
                        minRows="5"
                        value={detail}
                        onValueChange={setDetail}
                    />
                </div>
                <div>
                    <Textarea
                        label="Grupo receptor"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-label"
                        value={groupReceiver}
                        onValueChange={setGroupReceiver}
                    />
                </div>
                <div className="containerBottomMC">
                    <div className="twoButtonsMC">
                        <div className="buttonContainerMC">
                            <Modal
                                nameButton="Descartar"
                                textHeader="Descartar Registro"
                                textBody="¿Seguro que quiere descartar el registro de la historia de usuario?"
                                colorButton="w-36 bg-slate-100 text-black"
                                oneButton={false}
                                secondAction={() => router.back()}
                                textColor="red"
                            />
                            <Modal
                                nameButton="Aceptar"
                                textHeader="Registrar Historia de Usuario"
                                textBody="¿Seguro que quiere registrar la historia de usuario?"
                                colorButton="w-36 bg-blue-950 text-white"
                                oneButton={false}
                                secondAction={() => {
                                    //onSubmit();
                                    router.back();
                                }}
                                textColor="blue"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
