"use client";
import "@/styles/dashboardStyles/projectStyles/MComunicationStyles/registerMC.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { SmallLoadingScreen } from "../../layout";
import { Textarea } from "@nextui-org/react";
import MyCombobox from "@/components/ComboBox";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/IconLabel";
import ButtonIconLabel from "@/components/dashboardComps/projectComps/matrizComunicacionesComps/ButtonIconLabel";
import { useRouter } from "next/navigation";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import ModalUsersOne from "@/components/ModalUsersOne";
axios.defaults.withCredentials = true;

function capitalizeWords(str) {
    // Dividimos la cadena en palabras usando el espacio como separador
    const words = str.split(" ");

    // Iteramos por cada palabra y aplicamos la capitalización
    const capitalizedWords = words.map((word) => {
        // Convierte la primera letra a mayúscula y el resto a minúscula
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // Unimos las palabras nuevamente en una cadena
    return capitalizedWords.join(" ");
}

export default function MatrizComunicacionesRegister(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    console.log("El id del proyecto es:", projectId);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    const [sumilla, setSumilla] = useState("");
    const [detail, setDetail] = useState("");
    const [groupReceiver, setGroupReceiver] = useState("");
    const [canal, setCanal] = useState(null); //id
    const [frecuency, setFrecuency] = useState(null); //id
    const [format, setFormat] = useState(null); //id
    const [modal2, setModal2] = useState(false);
    const [selectedMiembrosList, setSelectedMiembrosList] = useState([]); //solo un objeto contiene
    const isTextTooLong1 = sumilla.length > 400;
    const isTextTooLong2 = detail.length > 400;
    const isTextTooLong3 = groupReceiver.length > 400;
    const [fieldsEmpty, setFieldsEmpty] = useState(false);
    const [fieldsExcessive, setFieldsExcessive] = useState(false);

    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    const handleSelectedValueChangeCanal = (value) => {
        setCanal(value);
    };

    const handleSelectedValueChangeFrecuency = (value) => {
        setFrecuency(value);
    };

    const handleSelectedValueChangeFormat = (value) => {
        setFormat(value);
    };

    const toggleModal2 = () => {
        setModal2(!modal2);
    };

    const returnListOfMiembros = (newMiembrosList) => {
        console.log("En return:", newMiembrosList[0]);

        // Verificar si newMiembrosList es un arreglo con contenido
        if (Array.isArray(newMiembrosList) && newMiembrosList.length > 0) {
            // Establecer el arreglo como un arreglo que contiene solo el nuevo objeto
            setSelectedMiembrosList([newMiembrosList[0]]);
        }

        setModal2(false);
    };

    function verifyFieldsEmpty() {
        return (
            sumilla === "" ||
            detail === "" ||
            groupReceiver === "" ||
            canal === null ||
            frecuency === null ||
            format === null ||
            selectedMiembrosList.length === 0
        );
    }

    function verifyFieldsExcessive() {
        return (
            sumilla.length > 400 ||
            detail.length > 400 ||
            groupReceiver.length > 400
        );
    }

    const onSubmit = () => {
        const postData = {
            idProyecto: parseInt(projectId),
            idCanal: canal,
            idFrecuencia: frecuency,
            idFormato: format,
            sumillaInformacion: sumilla,
            detalleInformacion: detail,
            responsableDeComunicar: selectedMiembrosList[0].idUsuario,
            grupoReceptor: groupReceiver,
        };
        console.log("El postData es :", postData);
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/matrizDeComunicaciones/insertarMatrizComunicacion",
                postData
            )
            .then((response) => {
                // Manejar la respuesta de la solicitud POST
                console.log("Respuesta del servidor:", response.data);
                console.log("Registro correcto");
                // Realizar acciones adicionales si es necesario
            })
            .catch((error) => {
                // Manejar errores si la solicitud POST falla
                console.error("Error al realizar la solicitud POST:", error);
            });
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
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-label"
                        value={sumilla}
                        onValueChange={setSumilla}
                        maxLength="450"
                        isInvalid={isTextTooLong1}
                        errorMessage={
                            isTextTooLong1
                                ? "El texto debe ser como máximo de 400 caracteres."
                                : ""
                        }
                    />
                </div>
                <div className="comboMC">
                    <div className="containerComboMC">
                        <IconLabel
                            icon="/icons/channelMC.svg"
                            label="Canal"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi={process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/matrizDeComunicaciones/listarCanales"}
                            property="canales"
                            nameDisplay="nombreCanal"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeCanal}
                            idParam="idCanal"
                            initialName="Seleccione un canal"
                        />
                    </div>
                    <div className="containerComboMC">
                        <IconLabel
                            icon="/icons/frecuencyMC.svg"
                            label="Frecuencia"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi={process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/matrizDeComunicaciones/listarFrecuencia"}
                            property="frecuencias"
                            nameDisplay="nombreFrecuencia"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeFrecuency}
                            idParam="idFrecuencia"
                            initialName="Seleccione una frecuencia"
                        />
                    </div>
                    <div className="containerComboMC">
                        <IconLabel
                            icon="/icons/formatMC.svg"
                            label="Formato"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi={process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/matrizDeComunicaciones/listarFormato"}
                            property="formatos"
                            nameDisplay="nombreFormato"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeFormat}
                            idParam="idFormato"
                            initialName="Seleccione un formato"
                        />
                    </div>
                    <div className="containerButtonMC">
                        <ButtonIconLabel
                            icon="/icons/icon-searchBar.svg"
                            label1="Buscar"
                            label2="responsable"
                            className="iconLabelButtonMC"
                            onClickFunction={toggleModal2}
                        />
                        {selectedMiembrosList.length > 0 ? (
                            selectedMiembrosList.map((component) => (
                                <div className="iconLabel2MC">
                                    <p className="profilePicMC">
                                        {component.nombres[0] +
                                            component.apellidos[0]}
                                    </p>
                                    <div className="labelDatoUsuarioMC">
                                        {capitalizeWords(
                                            `${component.nombres} ${component.apellidos}`
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="labelSinDataUsuarioMC">
                                ¡Seleccione un responsable de comunicar!
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <Textarea
                        label="Detalle de la información requerida"
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
                <div>
                    <Textarea
                        label="Grupo receptor"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-label"
                        value={groupReceiver}
                        onValueChange={setGroupReceiver}
                        maxLength="450"
                        isInvalid={isTextTooLong3}
                        errorMessage={
                            isTextTooLong3
                                ? "El texto debe ser como máximo de 400 caracteres."
                                : ""
                        }
                    />
                </div>
                <div className="containerBottomMC">
                    {fieldsEmpty && !fieldsExcessive && (
                        <IconLabel
                            icon="/icons/alert.svg"
                            label="Faltan completar campos"
                            className="iconLabel3"
                        />
                    )}
                    {fieldsExcessive && !fieldsEmpty && (
                        <IconLabel
                            icon="/icons/alert.svg"
                            label="Se excedió el límite de caracteres"
                            className="iconLabel3"
                        />
                    )}
                    {fieldsExcessive && fieldsEmpty && (
                        <IconLabel
                            icon="/icons/alert.svg"
                            label="Faltan completar campos y se excedió el límite de caracteres"
                            className="iconLabel3"
                        />
                    )}
                    <div className="twoButtonsMC">
                        <div className="buttonContainerMC">
                            <Modal
                                nameButton="Descartar"
                                textHeader="Descartar Registro"
                                textBody="¿Seguro que quiere descartar el registro de la información?"
                                colorButton="w-36 bg-slate-100 text-black"
                                oneButton={false}
                                secondAction={() => router.back()}
                                textColor="red"
                            />
                            <Modal
                                nameButton="Aceptar"
                                textHeader="Registrar información"
                                textBody="¿Seguro que quiere registrar la información?"
                                colorButton="w-36 bg-blue-950 text-white"
                                oneButton={false}
                                secondAction={() => {
                                    onSubmit();
                                    router.back();
                                }}
                                textColor="blue"
                                verifyFunction={() => {
                                    if (
                                        verifyFieldsEmpty() &&
                                        verifyFieldsExcessive()
                                    ) {
                                        setFieldsEmpty(true);
                                        setFieldsExcessive(true);
                                        return false;
                                    } else if (
                                        verifyFieldsEmpty() &&
                                        !verifyFieldsExcessive()
                                    ) {
                                        setFieldsEmpty(true);
                                        setFieldsExcessive(false);
                                        return false;
                                    } else if (
                                        verifyFieldsExcessive() &&
                                        !verifyFieldsEmpty()
                                    ) {
                                        setFieldsExcessive(true);
                                        setFieldsEmpty(false);
                                        return false;
                                    } else {
                                        setFieldsExcessive(false);
                                        setFieldsEmpty(false);
                                        return true;
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {modal2 && (
                <ModalUsersOne
                    listAllUsers={false}
                    handlerModalClose={toggleModal2}
                    handlerModalFinished={returnListOfMiembros}
                    excludedUsers={selectedMiembrosList}
                    idProyecto={projectId}
                ></ModalUsersOne>
            )}
        </div>
    );
}
