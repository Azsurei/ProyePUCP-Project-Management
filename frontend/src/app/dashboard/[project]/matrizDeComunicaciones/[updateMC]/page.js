"use client";
import "@/styles/dashboardStyles/projectStyles/MComunicationStyles/registerMC.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { SmallLoadingScreen } from "../../layout";
import { Textarea } from "@nextui-org/react";
import MyCombobox from "@/components/ComboBox";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
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

export default function MatrizComunicacionesUpdate(props) {
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
    const [selectedNameCanal, setSelectedNameCanal] = useState("");
    const [selectedNameFrecuency, setSelectedNameFrecuency] = useState("");
    const [selectedNameFormat, setSelectedNameFormat] = useState("");
    const [modal2, setModal2] = useState(false);
    const [selectedMiembrosList, setSelectedMiembrosList] = useState([]); //solo un objeto contiene
    const isTextTooLong1 = sumilla.length > 400;
    const isTextTooLong2 = detail.length > 400;
    const isTextTooLong3 = groupReceiver.length > 400;
    const [fieldsEmpty, setFieldsEmpty] = useState(false);
    const [fieldsExcessive, setFieldsExcessive] = useState(false);
    const [matrizComunicaciones, setMatrizComunicaciones] = useState(null);

    useEffect(() => {
        if (matrizComunicaciones && matrizComunicaciones.comunicacion) {
            const mcData = matrizComunicaciones.comunicacion[0];
            console.log("F: La data es:", mcData);
            setSumilla(mcData.sumillaInformacion);
            setDetail(mcData.detalleInformacion);
            setGroupReceiver(mcData.grupoReceptor);
            setSelectedNameCanal(mcData.nombreCanal);
            setCanal(mcData.idCanal);
            setSelectedNameFrecuency(mcData.nombreFrecuencia);
            setFrecuency(mcData.idFrecuencia);
            setSelectedNameFormat(mcData.nombreFormato);
            setFormat(mcData.idFormato);
            const miembro = {
                email: mcData.correoElectronico,
                id: mcData.responsableDeComunicar,
                lastName: mcData.apellidos,
                name: mcData.nombres,
            };
            setSelectedMiembrosList([miembro]);
            console.log("Terminó de cargar los datos");
            //setIsLoading(false);
            setIsLoadingSmall(false);
        }
    }, [matrizComunicaciones]);

    useEffect(() => {
        const stringURLMC = `http://localhost:8080/api/proyecto/matrizDeComunicaciones/listarComunicacion/${props.params.updateMC}`;
        axios
            .get(stringURLMC)
            .then(function (response) {
                const mcData = response.data;
                console.log("ID MC:", props.params.updateMC);
                console.log("DATA:", mcData);
                setMatrizComunicaciones(mcData);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(() => {
                //setIsLoadingSmall(false);
                console.log("Finalizó la carga de datos");
            });
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
        console.log("Que data estoy enviando:", selectedMiembrosList);
        const putData = {
            idComunicacion: props.params.updateMC,
            idCanal: canal,
            idFrecuencia: frecuency,
            idFormato: format,
            sumillaInformacion: sumilla,
            detalleInformacion: detail,
            responsableDeComunicar: selectedMiembrosList[0].id,
            grupoReceptor: groupReceiver,
        };
        console.log("Actualizado correctamente");
        console.log(putData);
        axios
            .put(
                "http://localhost:8080/api/proyecto/matrizDeComunicaciones/modificarMatrizComunicacion",
                putData
            )
            .then((response) => {
                // Manejar la respuesta de la solicitud PUT
                console.log("Respuesta del servidor:", response.data);
                console.log("Actualización correcta");
                // Realizar acciones adicionales si es necesario
            })
            .catch((error) => {
                // Manejar errores si la solicitud PUT falla
                console.error("Error al realizar la solicitud PUT:", error);
            });
    };

    return (
        <div className="containerRegisterMC">
            <div className="headerRegisterMC">
                Inicio / Proyectos / Nombre del proyecto / Matriz de
                Comunicaciones/ Actualizar elemento
            </div>
            <div className="backlogRegisterMC">
                <div className="titleBacklogRegisterMC">
                    Crear nueva información requerida
                </div>
                <div>
                    {matrizComunicaciones ? (
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
                    ) : (
                        <div>Cargando datos...</div>
                    )}
                </div>
                <div className="comboMC">
                    <div className="containerComboMC">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Canal"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi="http://localhost:8080/api/proyecto/matrizDeComunicaciones/listarCanales"
                            property="canales"
                            nameDisplay="nombreCanal"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeCanal}
                            idParam="idCanal"
                            initialName={selectedNameCanal}
                        />
                    </div>
                    <div className="containerComboMC">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Frecuencia"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi="http://localhost:8080/api/proyecto/matrizDeComunicaciones/listarFrecuencia"
                            property="frecuencias"
                            nameDisplay="nombreFrecuencia"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeFrecuency}
                            idParam="idFrecuencia"
                            initialName={selectedNameFrecuency}
                        />
                    </div>
                    <div className="containerComboMC">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Formato"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi="http://localhost:8080/api/proyecto/matrizDeComunicaciones/listarFormato"
                            property="formatos"
                            nameDisplay="nombreFormato"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeFormat}
                            idParam="idFormato"
                            initialName={selectedNameFormat}
                        />
                    </div>
                    <div className="containerButtonMC">
                        <ButtonIconLabel
                            icon="/icons/icon-searchBar.svg"
                            label1="Responsable"
                            label2="de comunicar"
                            className="iconLabelButtonMC"
                            onClickFunction={toggleModal2}
                        />
                        {selectedMiembrosList.map((component) => {
                            return (
                                <div className="iconLabel2MC">
                                    <p className="profilePicMC">
                                        {component.name[0] +
                                            component.lastName[0]}
                                    </p>
                                    <div className="labelDatoUsuarioMC">
                                        {capitalizeWords(
                                            `${component.name} ${component.lastName}`
                                        )}
                                    </div>
                                </div>
                            );
                        })}
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
