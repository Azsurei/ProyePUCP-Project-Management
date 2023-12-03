// actaReunion/registerAR/page.js
"use client";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import { HerramientasInfo, SmallLoadingScreen } from "../../layout";

import { useRouter, useSearchParams } from "next/navigation";
import {
    Input,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Spacer,
    Select,
    SelectItem,
    Tabs,
    Tab,
    Textarea,
} from "@nextui-org/react";

import ModalUsersOne from "@/components/ModalUsersOne";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ChoiceUser.css";
import "@/styles/dashboardStyles/projectStyles/actaReunionStyles/CrearActaReunion.css";
import CardSelectedUser from "@/components/CardSelectedUser";

import ListEditableInput from "@/components/dashboardComps/projectComps/EDTComps/ListEditableInput";
import ButtonAddNew from "@/components/dashboardComps/projectComps/EDTComps/ButtonAddNew";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";

import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/IconLabel";
import FileDrop from "@/components/dashboardComps/projectComps/actaReunionComps/FileDrop";
import { Toaster, toast } from "sonner";
import { NotificationsContext, SessionContext } from "@/app/dashboard/layout";
import { SearchIcon } from "public/icons/SearchIcon";

axios.defaults.withCredentials = true;

function DownloadIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
        </svg>
    );
}

function EditableItem({
    item,
    onChangeAcuerdo,
    onRemoveAcuerdo,
    temas,
    onTemaChange,
    isAcuerdo,
}) {
    const [selectedTema, setSelectedTema] = useState(0);

    const handleTemaChange = (e) => {
        const selectedTemaIndex = e.target.value;
        setSelectedTema(selectedTemaIndex);
        onChangeAcuerdo(item.id, item.descripcion, selectedTemaIndex);
    };

    const handleDescripcionChange = (e) => {
        onChangeAcuerdo(item.id, e.target.value, selectedTema);
    };

    return (
        <div className="flex items-center mb-2">
            <Select
                label="Selecciona un tema"
                className="mr-2"
                value={selectedTema}
                onChange={handleTemaChange}
            >
                {temas &&
                    temas.map((tema) => (
                        <SelectItem key={tema.index} value={tema.index}>
                            {tema.data}
                        </SelectItem>
                    ))}
            </Select>
            <Input
                type="text"
                value={item.descripcion}
                onChange={handleDescripcionChange}
            />
            <Button
                onClick={() => onRemoveAcuerdo(item.id)}
                className="p-2 bg-red-500 text-white rounded"
            >
                X
            </Button>
        </div>
    );
}

function EditableList({
    items,
    onAdd,
    onChange,
    onRemove,
    temas,
    onTemaChange,
    isAcuerdo,
}) {
    return (
        <div>
            {items.map((item) => (
                <EditableItem
                    key={item.id}
                    item={item}
                    onChangeAcuerdo={onChange}
                    onRemoveAcuerdo={onRemove}
                    temas={temas}
                    onTemaChange={onTemaChange}
                    isAcuerdo={isAcuerdo}
                />
            ))}
        </div>
    );
}

export default function crearActaReunion(props) {
    // *********************************************************************************************
    // Various Variables
    // *********************************************************************************************
    // Router. Helps you to move between pages

    const router = useRouter();
    const { herramientasInfo } = useContext(HerramientasInfo);
    const { sessionData } = useContext(SessionContext);
    const { sendNotification } = useContext(NotificationsContext);

    // Project Info
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const previousUrl =
        "/dashboard/" + projectName + "=" + projectId + "/actaReunion";

    // Loading Window
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    // Edit Mode: False for New Meeting, True for Edit Meeting
    const [isEditMode, setIsEditMode] = useState(false);

    //Vital Data for Creating Meeting
    const [titleValue, setTitleValue] = useState("");
    const [motiveValue, setMotiveValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [timeValue, setTimeValue] = useState("");

    const handleChangeDate = (event) => {
        setDateValue(event.target.value);
    };

    const handleChangeTime = (event) => {
        setTimeValue(event.target.value);
    };

    // *********************************************************************************************
    // Validations
    // *********************************************************************************************
    const [fieldsEmpty, setFieldsEmpty] = useState(false);

    function verifyFieldsEmpty() {
        return (
            titleValue === "" ||
            dateValue === "" ||
            timeValue === "" ||
            motiveValue === ""
        );
    }

    function getMinDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Los meses se indexan a partir de 0
        const day = today.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function getMinTime() {
        const today = new Date();
        const selectedDate = new Date(dateValue);
        const currentTime = today.getHours() * 60 + today.getMinutes();

        if (
            selectedDate.getDate() === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear()
        ) {
            const selectedTime =
                parseInt(timeValue.split(":")[0]) * 60 +
                parseInt(timeValue.split(":")[1]);
            if (selectedTime < currentTime) {
                // Muestra un mensaje de advertencia si la hora elegida es anterior a la hora actual
                return "00:00";
            }
        }
        // Si la fecha seleccionada es hoy y la hora es actual o posterior, o cualquier otra fecha, no hay restricciones
        return "00:00";
    }

    // *********************************************************************************************
    // Handlers of Topics, Agreements and Comments
    // *********************************************************************************************
    const [listTemas, setListTemas] = useState([]);
    const [listAcuerdos, setListAcuerdos] = useState([]);

    // Funciones para temas
    const handleAddTema = () => {
        const newList_T = [
            ...listTemas,
            {
                index: listTemas.length + 1,
                data: "",
            },
        ];
        setListTemas(newList_T);
    };

    const handleChangeTema = (e, index) => {
        const updated = [...listTemas];
        updated[index - 1].data = e.target.value;
        console.log(updated);
        setListTemas(updated);
    };

    const handleRemoveTema = (index) => {
        const updatedEntregables = [...listTemas];
        updatedEntregables.splice(index - 1, 1); // Remove the element at the given index
        for (let i = index - 1; i < updatedEntregables.length; i++) {
            updatedEntregables[i].index = updatedEntregables[i].index - 1;
        }
        console.log(updatedEntregables);
        setListTemas(updatedEntregables);
    };

    // Funciones para acuerdos
    const handleAddAcuerdo = (idTema, descripcionAcuerdo) => {
        const nuevoAcuerdo = {
            id: Date.now(),
            idTema: 0,
            descripcion: descripcionAcuerdo,
        };
        setListAcuerdos([...listAcuerdos, nuevoAcuerdo]);
    };

    const handleChangeAcuerdo = (acuerdoId, nuevaDescripcion, temaselect) => {
        const acuerdosActualizados = listAcuerdos.map((acuerdo) =>
            acuerdo.id === acuerdoId
                ? {
                      ...acuerdo,
                      descripcion: nuevaDescripcion,
                      idTema: temaselect,
                  }
                : acuerdo
        );
        setListAcuerdos(acuerdosActualizados);
        console.log(listAcuerdos);
    };

    const handleRemoveAcuerdo = (acuerdoId) => {
        const acuerdosActualizados = listAcuerdos.filter(
            (acuerdo) => acuerdo.id !== acuerdoId
        );
        setListAcuerdos(acuerdosActualizados);
    };

    //-----------------------------------------------------------
    const [listComentarios, setListComentarios] = useState([
        { index: 1, data: "" },
    ]);
    const handleAddComentario = () => {
        const newList_C = [
            ...listComentarios,
            {
                index: listComentarios.length + 1,
                data: "",
            },
        ];
        setListComentarios(newList_C);
    };
    const handleChangeComentario = (e, index) => {
        const updatedEntregables = [...listComentarios];
        updatedEntregables[index - 1].data = e.target.value;
        console.log("Changed comentario:");
        console.log(updatedEntregables);
        setListComentarios(updatedEntregables);
    };
    const handleRemoveComentario = (index) => {
        const updatedEntregables = [...listComentarios];
        updatedEntregables.splice(index - 1, 1); // Remove the element at the given index
        for (let i = index - 1; i < updatedEntregables.length; i++) {
            updatedEntregables[i].index = updatedEntregables[i].index - 1;
        }
        console.log(updatedEntregables);
        setListComentarios(updatedEntregables);
    };

    // *********************************************************************************************
    // About User Information
    // *********************************************************************************************
    const [datosUsuario, setDatosUsuario] = useState({
        idUsuario: 0,
        nombres: " ",
        apellidos: " ",
        correoElectronico: " ",
        activo: 0,
        imgLink: "",
        idUsuarioRolProyecto: 0,
    });

    // *********************************************************************************************
    // About Convenor and Metting Members
    // *********************************************************************************************
    const [convocante, setConvocante] = useState(datosUsuario);

    // For convocante to have datosUsuario
    // useEffect(() => {
    //     setConvocante(datosUsuario);
    // }, [datosUsuario]);

    // Modal1: Choose convenor. Modal2: Choose participants
    const [modal1, setModal1] = useState(false);
    const [selectedConvocanteList, setSelectedConvocanteList] = useState([]);
    const [selectedMiembrosList, setSelectedMiembrosList] = useState([]);
    const [modal2, setModal2] = useState(false);

    const toggleModal1 = () => {
        setModal1(!modal1);
    };

    const toggleModal2 = () => {
        setModal2(!modal2);
    };

    // Modal1 returns a list of only one object
    const returnListConvocante = (newMiembrosList) => {
        const nuevoConvocante = newMiembrosList[0];

        const newMembrsList = [...selectedConvocanteList, ...newMiembrosList];
        setSelectedConvocanteList(newMembrsList);
        setModal1(!modal1);
        console.log(convocante);
        if (newMiembrosList.length > 0) {
            setConvocante(nuevoConvocante);
        }
    };

    const resetConvocante = () => {
        setConvocante(datosUsuario);
    };

    const returnListOfMiembros = (newMiembrosList) => {
        const newMembrsList = [...selectedMiembrosList, ...newMiembrosList];

        setSelectedMiembrosList(newMembrsList);
        setModal2(!modal2);
    };

    const removeMiembro = (miembro) => {
        const newMembrsList = selectedMiembrosList.filter(
            (item) => item.idUsuario !== miembro.idUsuario
        );
        console.log("Muestra los seleccionados");
        console.log(selectedMiembrosList);
        setSelectedMiembrosList(newMembrsList);
        console.log(newMembrsList);
    };

    const [isLoading, setIsLoading] = useState(false);

    const [idActa, setidActa] = useState(null);

    // useEffect(() => {
    //     setIsLoadingSmall(true);
    //     const stringURL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proyecto/actaReunion/listarActaReunionXIdProyecto/${projectId}`;
    //     axios
    //         .get(stringURL)
    //         .then(
    //             ({
    //                 data: {
    //                     data: { idActaReunion },
    //                 },
    //             }) => {
    //                 console.log(
    //                     "Listando ActasReunion. Respuesta del servidor:",
    //                     idActaReunion
    //                 );
    //                 console.log(projectId);
    //                 setidActa(idActaReunion);
    //             }
    //         )
    //         .catch((error) => {
    //             console.error("Error fetching meeting record ID:", error);
    //         })
    //         .finally(() => {
    //             setIsLoadingSmall(false);
    //         });
    // }, [setIsLoadingSmall, projectId]);

    // *********************************************************************************************
    // Creating a Meeting Record Line
    // *********************************************************************************************
    const createMeeting = () => {
        const idActaReunion = idActa;
        const nombreReunion = titleValue;
        const fechaReunion = dateValue;
        const horaReunion = timeValue;
        const motivo = motiveValue;
        const nombreConvocante =
            convocante.nombres + " " + convocante.apellidos;
        const temas = listTemas.map((tema) => ({
            descripcion: tema.data,
            acuerdos: listAcuerdos
                .filter((acuerdo) => acuerdo.idTema === tema.index.toString())
                .map((acuerdo) => ({
                    descripcion: acuerdo.descripcion,
                })),
        }));
        const participantes = selectedMiembrosList.map((participante) => ({
            // assuming you have a list of participants
            idUsuarioXRolXProyecto: participante.idUsuarioRolProyecto,
            asistio: false,
        }));
        const comentarios = listComentarios.map((value) => ({
            // assuming you have a list of comments
            descripcion: value.data,
        }));

        console.log("Temas:");
        console.log(listTemas);
        console.log("Acuerdos:");
        console.log(listAcuerdos);

        const meeting = {
            idActaReunion,
            nombreReunion,
            fechaReunion,
            horaReunion,
            nombreConvocante,
            motivo,
            temas,
            participantes,
            comentarios,
        };

        // Convert the meeting object to JSON format
        const meetingJSON = JSON.stringify(meeting, null, 2);

        // Now you can save meetingJSON to a file or send it in a request
        console.log("===============================");
        console.log("Json al enviar");
        console.log(meetingJSON);
        console.log("===============================");
        console.log("Seleccionados: ", selectedMiembrosList);
        console.log("id de acta reunion:", idActaReunion);
        console.log("Titulo de Reunion: ", nombreReunion);
        console.log("Convocante de Reunion: ", nombreConvocante);
        console.log("Fecha de Reunion: ", fechaReunion);
        console.log("Hora de Reunion: ", horaReunion);
        console.log("Motivo de Reunion: ", motivo);
        console.log("Participantes: ", participantes);

        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/actaReunion/crearLineaActaReunion",
                {
                    idActaReunion: idActaReunion,
                    nombreReunion: nombreReunion,
                    fechaReunion: fechaReunion,
                    horaReunion: horaReunion,
                    nombreConvocante: nombreConvocante,

                    motivo: motivo,
                    temas: temas,
                    participantes: participantes,
                    comentarios: comentarios,
                }
            )
            .then(function (response) {
                console.log(response);
                console.log("Conexion correcta");
                const nuevoIdLineaAR = response.data.idLineaActaReunion;
                for (const usuario of selectedMiembrosList) {
                    if (usuario.idUsuario !== sessionData.idUsuario) {
                        sendNotification(
                            usuario.idUsuario,
                            3,
                            nuevoIdLineaAR,
                            projectId
                        );
                        console.log(
                            "Mandando notificacion a " + usuario.idUsuario
                        );
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const [tabSelected, setTabSelected] = useState("form");
    const [fileIsUploaded, setFileIsUploaded] = useState(false);

    const [meetingName, setMeetingName] = useState("");
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const [meetingMotive, setMeetingMotive] = useState("");
    const [meetingConvocante, setMeetingConvocante] = useState([]);
    const [meetingFile, setMeetingFile] = useState(null);

    const [isModalConvocanteOpen, setIsModalConvocanteOpen] = useState(false);

    const twTitle = "text-lg font-semibold text-mainHeaders  mb-1";

    const [isPlantillaDownloadLoading, setIsPlantillaDownloadLoading] =
        useState(false);

    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    // *********************************************************************************************
    // Page
    // *********************************************************************************************
    return (
        <div className="p-[2.5rem] min-h-full">
            <HeaderWithButtons
                haveReturn={true}
                haveAddNew={false}
                hrefToReturn={
                    "/dashboard/" +
                    projectName +
                    "=" +
                    projectId +
                    "/actaReunion"
                }
                hrefForButton={
                    "/dashboard/" +
                    projectName +
                    "=" +
                    projectId +
                    "/actaReunion"
                }
                breadcrump={
                    "Inicio / Proyectos / " +
                    projectName +
                    " / Acta de Reunion / Nueva Reunion"
                }
                btnText={"Volver"}
            >
                Crear Acta de Reunion
            </HeaderWithButtons>

            <div className="flex flex-col gap-4">
                <p className="text-md text-slate-500 ">
                    Con esta opcion podras usar nuestra plantilla (o la tuya)
                    para registrar tus actas de reunión
                </p>

                <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                        <p className={twTitle}>Nombre de reunión</p>
                        <Input
                            variant="bordered"
                            value={meetingName}
                            onValueChange={setMeetingName}
                            placeholder="Escribe aquí"
                        />
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="flex flex-col w-full">
                            <p className={twTitle}>Fecha de reunion</p>
                            <Input
                                variant="bordered"
                                type="date"
                                value={meetingDate}
                                onValueChange={setMeetingDate}
                                placeholder="Escribe aquí"
                            />
                        </div>
                        <div className="flex flex-col w-full">
                            <p className={twTitle}>Hora planificada</p>
                            <Input
                                variant="bordered"
                                type="time"
                                value={meetingTime}
                                onValueChange={setMeetingTime}
                                placeholder="Escribe aquí"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className={twTitle}>Motivo</p>
                        <Input
                            variant="bordered"
                            value={meetingMotive}
                            onValueChange={setMeetingMotive}
                            placeholder="Escribe aquí"
                        />
                    </div>
                    <div className="flex flex-col  gap-2">
                        <div className="flex flex-row items-center gap-2">
                            <p className={twTitle}>Convocante</p>
                            <Button
                                color="primary"
                                className="font-medium text-white py-0"
                                endContent={<SearchIcon />}
                                size="md"
                                onPress={() => setIsModalConvocanteOpen(true)}
                            >
                                Buscar
                            </Button>
                        </div>
                        {meetingConvocante.length === 0 ? (
                            <div className="flex justify-start py-4 text-slate-400">
                                Agrega un convocante
                            </div>
                        ) : (
                            <CardSelectedUser
                                isEditable={true}
                                usuarioObject={meetingConvocante[0]}
                                removeHandler={() => {
                                    setMeetingConvocante([]);
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-2">
                        <p className={twTitle}>Archivo de reunión</p>
                        <Button
                            className="text-white font-medium"
                            color="primary"
                            startContent={
                                isPlantillaDownloadLoading ? null : (
                                    <DownloadIcon />
                                )
                            }
                            onPress={() => {
                                downloadPlantillaAC();
                            }}
                            isLoading={isPlantillaDownloadLoading}
                        >
                            Descarga plantilla aqui
                        </Button>
                    </div>
                    <FileDrop setFile={setMeetingFile} />
                    <div className="flex justify-end mt-2 gap-2">
                        <Modal
                            nameButton="Descartar"
                            textHeader="Descartar Acta de Reunión"
                            textBody="¿Seguro que quiere descartar esta acta de reunión?"
                            colorButton="w-36 bg-slate-100 text-black"
                            oneButton={false}
                            isLoading={isLoading}
                            secondAction={async () => {
                                setIsLoading(true);
                                router.push(
                                    "/dashboard/" +
                                        projectName +
                                        "=" +
                                        projectId +
                                        "/actaReunion"
                                );
                            }}
                            textColor="blue"
                            verifyFunction={() => {
                                return true;
                            }}
                        />
                        <Modal
                            nameButton="Guardar"
                            textHeader="Registrar Acta de Reunión"
                            textBody="¿Seguro que quiere registrar el Acta de Reunión?"
                            colorButton="w-36 bg-blue-950 text-white"
                            oneButton={false}
                            isLoading={isLoading}
                            secondAction={async () => {
                                console.log(meetingFile);
                                await registerMeeting();
                            }}
                            textColor="blue"
                            verifyFunction={() => {
                                if (meetingFile !== null) {
                                    return true;
                                } else {
                                    toast.warning("Debe subir un archivo");
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {isModalConvocanteOpen && (
                <ModalUsersOne
                    idProyecto={projectId}
                    listAllUsers={false}
                    handlerModalClose={() => {
                        setIsModalConvocanteOpen(false);
                    }}
                    handlerModalFinished={(user) => {
                        setMeetingConvocante(user);
                        setIsModalConvocanteOpen(false);
                    }}
                    excludedUsers={[]}
                    excludedUniqueUser={[]}
                    isExcludedUniqueUser={true}
                />
            )}
        </div>
    );

    function downloadPlantillaAC() {
        setIsPlantillaDownloadLoading(true);
        const downloadURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            `/api/files/getArchivoActaReunion`;

        axios
            .get(downloadURL)
            .then((response) => {
                console.log(response);

                if (response.data.url) {
                    const link = document.createElement("a");
                    link.href = response.data.url;
                    link.download = "Acta_de_Reunion.doc";
                    document.body.appendChild(link);
                    link.click();
                    toast.success("Se descargo la plantilla con exito");

                    setIsPlantillaDownloadLoading(false);
                }
            })
            .catch((error) => {
                console.error("Error al descargar documento: ", error);
                toast.error("Error al descargar plantilla");
                setIsPlantillaDownloadLoading(false);
            });
    }

    async function registerMeeting() {
        try {
            setIsLoading(true);
            const file = new FormData();
            file.append("file", meetingFile);
            file.append(
                "idActaReunion",
                herramientasInfo.find(
                    (herramienta) => herramienta.idHerramienta === 11
                ).idHerramientaCreada
            );
            file.append(
                "nombreReunion",
                meetingName === "" ? "Reunion sin nombre" : meetingName
            );
            file.append(
                "fechaReunion",
                meetingDate === "" ? null : meetingDate
            );
            file.append("horaReunion", meetingTime === "" ? null : meetingTime);
            file.append(
                "idConvocante",
                meetingConvocante.length !== 0
                    ? meetingConvocante[0].idUsuario
                    : 0
            );
            file.append(
                "motivo",
                meetingMotive === "" ? "Sin motivo" : meetingMotive
            );
            file.append("temas", []);
            file.append("participantes", []);
            file.append("comentarios", []);
            const newURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/api/proyecto/actaReunion/crearLineaActaReunion`;

            await axios.post(newURL, file, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("se subio el archivo con exito");
            toast.success("Se registró la reunión exitosamente");
            setIsLoading(false);
            router.push(
                "/dashboard/" + projectName + "=" + projectId + "/actaReunion"
            );
        } catch (e) {
            console.log(e);
            toast.error("Error al registrar reunión");
        }
    }
}
