"use client";
import "@/styles/dashboardStyles/projectStyles/MComunicationStyles/registerMC.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { HerramientasInfo, SmallLoadingScreen } from "../../layout";
import { Textarea, Avatar, Button, Input } from "@nextui-org/react";
import MyCombobox from "@/components/ComboBox";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/IconLabel";
import ButtonIconLabel from "@/components/dashboardComps/projectComps/matrizComunicacionesComps/ButtonIconLabel";
import { useRouter } from "next/navigation";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import ModalUsersOne from "@/components/ModalUsersOne";
import ListAdditionalFields, {
    getAdditionalFields,
    registerAdditionalFields,
} from "@/components/ListAdditionalFields";
import { Toaster, toast } from "sonner";
import { SessionContext } from "@/app/dashboard/layout";
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
    const keyParamURL = decodeURIComponent(props.params.updateMC);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const { sessionData } = useContext(SessionContext);
    const rol = sessionData.rolInProject;
    console.log("El id del proyecto es:", projectId);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { herramientasInfo } = useContext(HerramientasInfo);
    const idMatrizComunicaciones = herramientasInfo.find(
        (herramienta) => herramienta.idHerramienta === 8
    ).idHerramientaCreada;
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
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
    const isTextTooLong1 = sumilla.length > 130;
    const isTextTooLong2 = detail.length > 400;
    const isTextTooLong3 = groupReceiver.length > 400;
    const [matrizComunicaciones, setMatrizComunicaciones] = useState(null);
    const [listAdditionalFields, setListAdditionalFields] = useState([]);

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
            if (mcData.nombres !== null) {
                const miembro = {
                    imgLink: mcData.imgLink,
                    correoElecronico: mcData.correoElectronico,
                    idUsuario: mcData.responsableDeComunicar,
                    apellidos: mcData.apellidos,
                    nombres: mcData.nombres,
                };
                setSelectedMiembrosList([miembro]);
            }
            console.log("Terminó de cargar los datos");
            //setIsLoading(false);
            setIsLoadingSmall(false);
        }
        getAdditionalFields(
            idMatrizComunicaciones,
            6,
            setListAdditionalFields,
            (response) => {
                console.log("response", response);
                setIsLoadingSmall(false);
            }
        );
    }, [matrizComunicaciones]);

    useEffect(() => {
        const numberPattern = /^\d+$/;
        const editPattern = /^\d+=edit$/;
        let stringURLMC;
        console.log("El keyParamURL es:", keyParamURL);
        if (numberPattern.test(keyParamURL)) {
            console.log("It's a number:", keyParamURL);
            setEditMode(false);
            stringURLMC =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/api/proyecto/matrizDeComunicaciones/listarComunicacion/${props.params.updateMC}`;
        } else if (editPattern.test(keyParamURL)) {
            console.log("It's a number followed by '=edit':", keyParamURL);
            setEditMode(true);
            const updateId = parseInt(
                keyParamURL.substring(0, keyParamURL.lastIndexOf("="))
            );
            stringURLMC =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/api/proyecto/matrizDeComunicaciones/listarComunicacion/${updateId}`;
        }

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
        return sumilla.trim() === "";
    }

    function verifyFieldsExcessive() {
        return (
            sumilla.length > 130 ||
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
            responsableDeComunicar: selectedMiembrosList[0]
                ? selectedMiembrosList[0].idUsuario
                : null,
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
        registerAdditionalFields(
            listAdditionalFields,
            idMatrizComunicaciones,
            6,
            1,
            (response) => {
                console.log("response", response);
            }
        );
    };

    return (
        <div className="containerRegisterMC">
            <div className="headerRegisterMC">
                Inicio / Proyectos / Nombre del proyecto / Matriz de
                Comunicaciones/ Actualizar elemento
            </div>
            <div className="backlogRegisterMC">
                <div className="flex justify-between items-center">
                    <div className="titleBacklogRegisterMC dark:text-white">
                        Actualizar información requerida
                    </div>
                    <div>
                        {(!editMode && rol !== 2) && (
                            <Button
                                color="primary"
                                onPress={() => {
                                    setIsLoadingSmall(true);
                                    router.push(
                                        "/dashboard/" +
                                            projectName +
                                            "=" +
                                            projectId +
                                            "/matrizDeComunicaciones/" +
                                            props.params.updateMC +
                                            "=edit"
                                    );
                                }}
                            >
                                Editar
                            </Button>
                        )}
                    </div>
                </div>
                <div>
                    <Input
                        {...(!editMode ? { isClearable: false } : {})}
                        label="Sumilla de la información requerida"
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-label"
                        value={sumilla}
                        onValueChange={setSumilla}
                        maxLength="135"
                        isInvalid={isTextTooLong1}
                        errorMessage={
                            isTextTooLong1
                                ? "El texto debe ser como máximo de 130 caracteres."
                                : ""
                        }
                        {...(!editMode ? { isReadOnly: true } : {})}
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
                            isDisabled={!editMode}
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
                            isDisabled={!editMode}
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
                            isDisabled={!editMode}
                        />
                    </div>
                    <div className="containerButtonMC">
                        <ButtonIconLabel
                            icon="/icons/icon-searchBar.svg"
                            label1="Buscar"
                            label2="responsable"
                            className="iconLabelButtonMC"
                            onClickFunction={toggleModal2}
                            isDisabled={!editMode}
                        />
                        {selectedMiembrosList.length > 0 ? (
                            selectedMiembrosList.map((component) => (
                                <div className="iconLabel2MC">
                                    <Avatar
                                        className="transition-transform w-[2.5rem] min-w-[2.5rem] h-[2.5rem] min-h-[2.5rem]"
                                        src={component.imgLink}
                                        fallback={
                                            <p className="profilePicMC">
                                                {(component.nombres !== null
                                                    ? component.nombres[0]
                                                    : "") +
                                                    (component.apellidos !==
                                                    null
                                                        ? component.apellidos[0]
                                                        : "")}
                                            </p>
                                        }
                                    />
                                    <div className="labelDatoUsuarioMC">
                                        {capitalizeWords(
                                            `${
                                                component.nombres != null
                                                    ? component.nombres
                                                    : ""
                                            } ${
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
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
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
                        {...(!editMode ? { isReadOnly: true } : {})}
                    />
                </div>
                <div>
                    <Textarea
                        label="Grupo receptor"
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
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
                        {...(!editMode ? { isReadOnly: true } : {})}
                    />
                </div>
                <div>
                    <div className="flex items-center text-[16px] font-semibold mb-1">
                        Campos Adicionales
                    </div>
                    <ListAdditionalFields
                        editState={editMode}
                        baseFields={listAdditionalFields}
                        setBaseFields={setListAdditionalFields}
                    />
                </div>
                <div className="containerBottomMC">
                    {editMode === true && (
                        <div className="twoButtonsMC">
                            <div className="buttonContainerMC">
                                <Modal
                                    nameButton="Descartar"
                                    textHeader="Descartar Actualización"
                                    textBody="¿Seguro que quiere descartar la actualización de la información?"
                                    colorButton="w-36 bg-slate-100 text-black"
                                    oneButton={false}
                                    secondAction={() => {
                                        router.push(
                                            "/dashboard/" +
                                                projectName +
                                                "=" +
                                                projectId +
                                                "/matrizDeComunicaciones"
                                        );
                                    }}
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
                                        router.push(
                                            "/dashboard/" +
                                                projectName +
                                                "=" +
                                                projectId +
                                                "/matrizDeComunicaciones"
                                        );
                                    }}
                                    textColor="blue"
                                    verifyFunction={() => {
                                        if (
                                            verifyFieldsEmpty() &&
                                            verifyFieldsExcessive()
                                        ) {
                                            toast.error(
                                                "Faltan completar campos y se excedió el límite de caractéres",
                                                { position: "bottom-left" }
                                            );
                                            return false;
                                        } else if (
                                            verifyFieldsEmpty() &&
                                            !verifyFieldsExcessive()
                                        ) {
                                            toast.error(
                                                "Faltan completar campos",
                                                {
                                                    position: "bottom-left",
                                                }
                                            );
                                            return false;
                                        } else if (
                                            verifyFieldsExcessive() &&
                                            !verifyFieldsEmpty()
                                        ) {
                                            toast.error(
                                                "Se excedió el límite de caractéres",
                                                { position: "bottom-left" }
                                            );
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
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
