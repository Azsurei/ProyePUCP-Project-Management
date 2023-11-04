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
import { Toaster, toast } from "sonner";
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
                correoElecronico: mcData.correoElectronico,
                idUsuario: mcData.responsableDeComunicar,
                apellidos: mcData.apellidos,
                nombres: mcData.nombres,
            };
            setSelectedMiembrosList([miembro]);
            console.log("Terminó de cargar los datos");
            //setIsLoading(false);
            setIsLoadingSmall(false);
        }
    }, [matrizComunicaciones]);

    useEffect(() => {
        const stringURLMC =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            `/api/proyecto/matrizDeComunicaciones/listarComunicacion/${props.params.updateMC}`;
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
            sumilla.trim() === "" ||
            detail.trim() === "" ||
            groupReceiver.trim() === "" ||
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
            responsableDeComunicar: selectedMiembrosList[0].idUsuario,
            grupoReceptor: groupReceiver,
        };
        console.log("Actualizado correctamente");
        console.log(putData);
        axios
            .put(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/matrizDeComunicaciones/modificarMatrizComunicacion",
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
                            icon="/icons/channelMC.svg"
                            label="Canal"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/matrizDeComunicaciones/listarCanales"
                            }
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
                            icon="/icons/frecuencyMC.svg"
                            label="Frecuencia"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/matrizDeComunicaciones/listarFrecuencia"
                            }
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
                            icon="/icons/formatMC.svg"
                            label="Formato"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/matrizDeComunicaciones/listarFormato"
                            }
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
                                            (component.apellidos !== null
                                                ? component.apellidos[0]
                                                : "")}
                                    </p>
                                    <div className="labelDatoUsuarioMC">
                                        {capitalizeWords(
                                            `${component.nombres} ${
                                                component.apellidos !== null
                                                    ? component.apellidos
                                                    : ""
                                            }`
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
                                textHeader="Descartar Actualización"
                                textBody="¿Seguro que quiere descartar la actualización de la información?"
                                colorButton="w-36 bg-slate-100 text-black"
                                oneButton={false}
                                secondAction={() => router.back()}
                                textColor="red"
                            />
                            <Modal
                                nameButton="Aceptar"
                                textHeader="Actualizar información"
                                textBody="¿Seguro que quiere actualizar la información?"
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
                                        toast.error(
                                            "Faltan completar campos y se excedió el límite de caractéres"
                                        );
                                        return false;
                                    } else if (
                                        verifyFieldsEmpty() &&
                                        !verifyFieldsExcessive()
                                    ) {
                                        toast.error("Faltan completar campos");
                                        return false;
                                    } else if (
                                        verifyFieldsExcessive() &&
                                        !verifyFieldsEmpty()
                                    ) {
                                        toast.error(
                                            "Se excedió el límite de caractéres"
                                        );
                                        return false;
                                    } else {
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
            <Toaster
                position="bottom-left"
                richColors
                theme={"light"}
                closeButton={true}
                toastOptions={{
                    style: { fontSize: "1rem" },
                }}
            />
        </div>
    );
}
