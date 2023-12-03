// actaReunion/page.js
"use client";

import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { HerramientasInfo, SmallLoadingScreen } from "../layout";
axios.defaults.withCredentials = true;
import { Toaster, toast } from "sonner";
import {
    Button,
    Avatar,
    AvatarGroup,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Spacer,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
} from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import { useRouter } from "next/navigation";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import MissingEDTComponents from "../../../../../public/images/missing_EDTComponents.svg";
import { dbDateToDisplayDate } from "@/common/dateFunctions";
import { VerticalDotsIcon } from "public/icons/VerticalDotsIcon";

export default function ActaReunion(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen); // Assuming SmallLoadingScreen is the context you're using
    const { herramientasInfo } = useContext(HerramientasInfo);
    const [reuniones, setReuniones] = useState([]);
    const router = useRouter();

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const [idActa, setIdActa] = useState(null); // Use camelCase for consistency

    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingSmall(true);
            try {
                const idActa = herramientasInfo.find(
                    (herramienta) => herramienta.idHerramienta === 11
                ).idHerramientaCreada;
                if (idActa === null) router.push("/404");

                const resultado = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/proyecto/actaReunion/listarLineaActaReunionXIdActaReunion/${idActa}`
                );
                const lineasActaReunion = resultado.data.lineasActaReunion;
                console.log(lineasActaReunion);

                // const pendientes = lineasActaReunion.filter(reunion => new Date(reunion.fechaReunion) >= new Date());
                // const finalizadas = lineasActaReunion.filter(reunion => new Date(reunion.fechaReunion) < new Date());
                // setReuniones({ pendientes, finalizadas });
                setReuniones(lineasActaReunion);
                setIsLoadingSmall(false);
            } catch (error) {
                console.error("Error al obtener los datos de la API:", error);
                toast.error("Error al obtener reuniones");
                setIsLoadingSmall(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (reunion) => {
        const idAR = reunion.idLineaActaReunion;

        router.push(
            "/dashboard/" +
                projectName +
                "=" +
                projectId +
                "/actaReunion/e?edit=" +
                idAR +
                "&" +
                "acta=" +
                idActa
        );
    };

    const handleDelete = async (id) => {
        // Aquí puedes mostrar un modal para confirmar la acción
        const response = await axios.delete(
            process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/actaReunion/eliminarLineaActaReunionXIdLineaActaReunion",
            {
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    idLineaActaReunion: id,
                },
            }
        );

        if (response.status === 200) {
            console.log("Reunión eliminada con éxito");

            setReuniones((prevReuniones) => {
                const newPendientes = prevReuniones.pendientes.filter(
                    (reunion) => reunion.idLineaActaReunion !== id
                );
                const newFinalizadas = prevReuniones.finalizadas.filter(
                    (reunion) => reunion.idLineaActaReunion !== id
                );
                return {
                    pendientes: newPendientes,
                    finalizadas: newFinalizadas,
                };
            });
        }
    };

    const renderCard = (reunion) => {
        const participantes = Array.isArray(reunion.participantesXReunion)
            ? reunion.participantesXReunion
            : reunion.participantesXReunion
            ? [reunion.participantesXReunion]
            : [];
        return (
            <div
                key={reunion.idLineaActaReunion}
                className="flex flex-wrap items-start my-4 space-x-4 justify-center border border-slate-300 shadow-md relative rounded-lg"
            >
                <div
                    key={reunion.idLineaActaReunion}
                    className="flex-grow w-full sm:w-72 md:w-80 lg:w-96 xl:w-[400px] mx-auto"
                    isPressable={true}
                >
                    <div className="p-4">
                        <h3 className="text-xl font-bold text-blue-900 montserrat">
                            {reunion.nombreReunion}
                        </h3>
                    </div>
                    <Divider orientation={"horizontal"} />
                    <div className="flex flex-row justify-between items-center h-36 p-4">
                        <div className="mr-4">
                            <p className="text-blue-900 montserrat">
                                Reunión convocada por:
                            </p>
                            <p className="text-blue-900 montserrat">
                                {reunion.nombreConvocante}
                            </p>
                            <p className="text-gray-700 montserrat">
                                Fecha:{" "}
                                {new Date(
                                    reunion.fechaReunion
                                ).toLocaleDateString()}
                            </p>
                            <p className="text-gray-700 montserrat">
                                Hora: {reunion.horaReunion.slice(0, 5)}
                            </p>
                        </div>
                        <div className="flex text-gray-700 montserrat">
                            Convocados :
                        </div>
                        {participantes.length > 0 && (
                            <AvatarGroup isBordered max={3}>
                                {participantes.map((participante, index) => (
                                    <Avatar
                                        key={
                                            participante.idParticipanteXReunion
                                        }
                                        src={participante.imgLink}
                                        fallback={
                                            <p className="bg-gray-300 cursor-pointer rounded-full flex justify-center items-center text-base w-12 h-12 text-black">
                                                {participante.nombres[0] +
                                                    participante.apellidos[0]}
                                            </p>
                                        }
                                    />
                                ))}
                            </AvatarGroup>
                        )}
                        <div className="flex flex-col space-y-2 mt-0.5">
                            <Button
                                className="w-36 bg-blue-900 text-white font-semibold"
                                onClick={() => handleEdit(reunion)}
                            >
                                Editar
                            </Button>
                            <Modal
                                nameButton="Eliminar"
                                textHeader="Eliminar reunion"
                                textBody="¿Seguro que quiere eliminar esta reunion?"
                                colorButton="w-36 bg-red-600 text-white font-semibold"
                                oneButton={false}
                                secondAction={() => {
                                    handleDelete(
                                        reunion.idLineaActaReunion
                                    ).then((r) => console.log(r));
                                    toast.success(
                                        "Se ha eliminado el Acta de Reunion exitosamente"
                                    );
                                }}
                                textColor="red"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const listaMock = [
        {
            idLineaActaReunion: 1,
            nombreReunion: "Reunion 1",
            fechaReunion: "2021-10-10",
            horaReunion: "10:00",
            motivoReunion: "Motivo 1",
            nombreConvocante: "Juan",
            archivo: "archivo 1",
        },
        {
            idLineaActaReunion: 2,
            nombreReunion: "Reunion 2",
            fechaReunion: "2021-10-10",
            horaReunion: "10:00",
            motivoReunion: "Motivo 2",
            nombreConvocante: "Renzo",
            archivo: "archivo 1",
        },
    ];
    const newHref =
        "/dashboard/" +
        projectName +
        "=" +
        projectId +
        "/actaReunion/registerAR";
    const actualHref =
        "/dashboard/" + projectName + "=" + projectId + "/actaReunion";
    return (
        <div className="border min-h-full p-[2.5rem]">
            <HeaderWithButtons
                haveReturn={false}
                haveAddNew={true}
                hrefToReturn={actualHref}
                hrefForButton={newHref}
                breadcrump={`Inicio / Proyectos / ${projectName} / Acta de Reunión`}
                btnText={"+ Agregar reunión"}
            >
                Acta de Reunión
            </HeaderWithButtons>

            {/* {
                reuniones && reuniones.pendientes && reuniones.finalizadas ? (
                    <div>
                        <Tabs aria-label="Options" radius="full" color="warning">
                            <Tab key="pending" title="Pendientes" className="montserrat text-blue-900">
                                {reuniones.pendientes.length > 0 ? (
                                    reuniones.pendientes.map(renderCard)
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <Spacer y={1} />
                                        <MissingEDTComponents />
                                        <p className="montserrat text-blue-900">No hay reuniones pendientes</p>
                                    </div>
                                )}
                            </Tab>
                            <Tab key="finished" title="Finalizados" className="montserrat text-blue-900">
                                {reuniones.finalizadas.length > 0 ? (
                                    reuniones.finalizadas.map(renderCard)
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <Spacer y={1} />
                                        <MissingEDTComponents />
                                        <p>No hay reuniones finalizadas</p>
                                    </div>
                                )}
                            </Tab>
                        </Tabs>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <Spacer y={1} />
                        <MissingEDTComponents />
                        <p>No hay reuniones programadas</p>
                    </div>
                )
            } */}
            <div className="flex flex-col gap-2 mt-3">
                {reuniones.map((meeting) => {
                    return (
                        <div
                            key={meeting.idLineaActaReunion}
                            className="border border-gray-300 p-4 rounded-md shadow-sm flex flex-row items-center"
                        >
                            <div className="flex flex-col w-[50%] max-w-[50%] gap-0">
                                <p className="font-semibold text-xl truncate">
                                    {meeting.nombreReunion}
                                </p>
                                <p className="truncate">
                                    <span className="font-medium">Motivo:</span>{" "}
                                    {meeting.motivo}
                                </p>
                                <div className="flex flex-row items-center gap-2">
                                    <p className="truncate font-medium">
                                        Convocada por:{" "}
                                    </p>
                                    <div className="flex flex-row items-center gap-2 truncate">
                                        <Avatar
                                            src={meeting.imgLink}
                                            size="sm"
                                        />
                                        <p>
                                            {meeting.nombres === null
                                                ? "Sin convocante"
                                                : meeting.nombres}
                                        </p>
                                    </div>
                                </div>
                                <p className="truncate font-medium">
                                    Archivo:{" "}
                                    <span
                                        className="underline font-medium text-primary cursor-pointer"
                                        onClick={() => {
                                            downloadFile(
                                                meeting.idArchivo,
                                                meeting.nombreArchivo
                                            );
                                        }}
                                    >
                                        {meeting.nombreArchivo}
                                    </span>
                                </p>
                            </div>
                            <div className="flex flex-row  gap-4 flex-1 justify-start">
                                <div className="flex flex-col items-center">
                                    <p className="font-semibold text-md">
                                        Fecha de reunion:
                                    </p>
                                    <p>
                                        {meeting.fechaReunion === "0000-00-00"
                                            ? "Sin fecha registrada "
                                            : dbDateToDisplayDate(
                                                  meeting.fechaReunion
                                              )}
                                    </p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="font-semibold text-md">
                                        Hora registrada:
                                    </p>
                                    <p>
                                        {meeting.horaReunion === "00:00:00"
                                            ? "Sin hora registrada "
                                            : meeting.horaReunion}
                                    </p>
                                </div>
                            </div>
                            <Button>Ver opciones</Button>
                            <Dropdown aria-label="droMenTareasMain">
                                <DropdownTrigger aria-label="droMenTareasTrigger">
                                    <Button
                                        size="md"
                                        radius="sm"
                                        variant="flat"
                                        color="default"
                                        className="ButtonMore"
                                    >
                                        <p className="lblVerOpciones">
                                            Ver opciones
                                        </p>
                                        <VerticalDotsIcon className="icnVerOpciones text-black-300" />
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="droMenTareas">
                                    {handleAddNewSon && (
                                        <DropdownItem
                                            aria-label="addSon"
                                            onClick={() =>
                                                handleAddNewSon(tarea)
                                            }
                                        >
                                            Agregar subtarea
                                        </DropdownItem>
                                    )}
                                    {tarea.tareasHijas.length === 0 &&
                                        handleRegisterProgress && (
                                            <DropdownItem
                                                aria-label="regProg"
                                                onClick={() =>
                                                    handleRegisterProgress(
                                                        tarea
                                                    )
                                                }
                                            >
                                                Registrar progreso
                                            </DropdownItem>
                                        )}
                                    {handleVerDetalle && (
                                        <DropdownItem
                                            aria-label="seeDetail"
                                            onClick={() =>
                                                handleVerDetalle(tarea)
                                            }
                                        >
                                            Ver detalle
                                        </DropdownItem>
                                    )}
                                    {handleEdit && (
                                        <DropdownItem
                                            aria-label="edit"
                                            onClick={() => handleEdit(tarea)}
                                        >
                                            Editar
                                        </DropdownItem>
                                    )}
                                    {handleDelete && (
                                        <DropdownItem
                                            aria-label="delete"
                                            className="text-danger"
                                            color="danger"
                                            onClick={() => handleDelete(tarea)}
                                        >
                                            Eliminar
                                        </DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    function downloadDocument(idArchivo, nombreDocumento) {
        return new Promise((resolve, reject) => {
            const downloadURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/api/files/descargarArchivo/` +
                idArchivo;

            axios
                .get(downloadURL)
                .then((response) => {
                    console.log(response);

                    if (response.data.url) {
                        const link = document.createElement("a");
                        link.href = response.data.url;
                        link.download = nombreDocumento;
                        document.body.appendChild(link);
                        link.click();
                        resolve("success");
                    }
                })
                .catch((error) => {
                    console.error("Error al descargar documento: ", error);
                    reject(error);
                });
        });
    }

    function downloadFile(idArchivo, nombreDocumento) {
        toast.promise(downloadDocument(idArchivo, nombreDocumento), {
            loading: "Descargando archivo...",
            success: (data) => {
                return "Archivo descargado con exito";
            },
            error: "Error al descargar archivo",
            position: "bottom-right",
        });
    }
}
