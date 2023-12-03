"use client";
import CardSelectedUser from "@/components/CardSelectedUser";
import ModalUsersOne from "@/components/ModalUsersOne";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import FileDrop from "@/components/dashboardComps/projectComps/actaReunionComps/FileDrop";
import { Button, Image, Input } from "@nextui-org/react";
import { SearchIcon } from "public/icons/SearchIcon";
import { useState } from "react";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import { useEffect } from "react";
import { useContext } from "react";
import { SmallLoadingScreen } from "../../layout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { dbDateToInputDate } from "@/common/dateFunctions";

function TrashIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
        </svg>
    );
}

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

function UpdateActaR(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const idLineaActaReunion = decodeURIComponent(
        props.params.updateActaReunion
    );
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const router = useRouter();

    const [meetingName, setMeetingName] = useState("");
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const [meetingMotive, setMeetingMotive] = useState("");
    const [meetingConvocante, setMeetingConvocante] = useState([]);
    const [meetingFile, setMeetingFile] = useState(null);

    const [meetingFileId, setMeetingFileId] = useState(null);
    const [meetingFileName, setMeetingFileName] = useState("");
    const [meetingFileExtension, setMeetingFileExtension] = useState("");
    const [hasFileBeenChanged, setHasFileBeenChanged] = useState(false);

    const [isModalConvocanteOpen, setIsModalConvocanteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isPlantillaDownloadLoading, setIsPlantillaDownloadLoading] =
        useState(false);

    const twTitle = "text-lg font-semibold text-mainHeaders  mb-1";

    useEffect(() => {
        setIsLoadingSmall(true);
        const url =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            `/api/proyecto/actaReunion/listarLineaActaReunionXIdLineaActaReunion/` +
            idLineaActaReunion;

        axios
            .get(url)
            .then(function (response) {
                console.log(response);
                const { lineaActaReunion } = response.data;

                setMeetingName(lineaActaReunion.nombreReunion);
                setMeetingDate(
                    dbDateToInputDate(lineaActaReunion.fechaReunion)
                );
                setMeetingTime(lineaActaReunion.horaReunion);
                setMeetingMotive(lineaActaReunion.motivo);
                if (lineaActaReunion.idConvocante === 0) {
                    setMeetingConvocante([]);
                } else {
                    setMeetingConvocante([
                        {
                            idUsuario: lineaActaReunion.idConvocante,
                            nombres: lineaActaReunion.nombreConvocante,
                            apellidos: lineaActaReunion.apellidosConvocante,
                            correoElectronico:
                                lineaActaReunion.correoElectronico,
                            imgLink: lineaActaReunion.imgLink,
                        },
                    ]);
                }

                setMeetingFileId(lineaActaReunion.idArchivo);
                setMeetingFileName(lineaActaReunion.nombreReal);
                setMeetingFileExtension(lineaActaReunion.extension);
                //setMeetingFile(lineaActaReunion.idArchivo)

                setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Error al cargar la acta de reunión");
            });
    }, []);

    const fileIconsMap = [
        {
            extension: ".pdf",
            image: "/images/icnPdf.png",
        },
        {
            extension: ".xls",
            image: "/images/icnExcel.png",
        },
        {
            extension: ".xlsx",
            image: "/images/icnExcel.png",
        },
        {
            extension: ".doc",
            image: "/images/icnWord.png",
        },
        {
            extension: ".docx",
            image: "/images/icnWord.png",
        },
    ];

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
                Editar Acta de Reunion
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
                    {hasFileBeenChanged ? (
                        <FileDrop setFile={setMeetingFile} />
                    ) : (
                        <div
                            className="w-full h-full
                     bg-gray-100 border border-dashed border-slate-400 rounded-lg
                       p-4"
                        >
                            {true && (
                                <div className="border flex flex-row items-center justify-between bg-white p-3 pr-8 rounded-lg shadow-md border-slate-300">
                                    <div className="flex flex-row items-center gap-1">
                                        <Image
                                            alt="Filetype"
                                            height={70}
                                            width={70}
                                            src={
                                                fileIconsMap.find(
                                                    (icon) =>
                                                        icon.extension ===
                                                        meetingFileExtension
                                                )?.image
                                            }
                                        />
                                        <p
                                            className="font-medium text-xl underline text-primary cursor-pointer"
                                            onClick={() => {
                                                downloadOriginalFile(
                                                    meetingFileId,
                                                    meetingFileName
                                                );
                                            }}
                                        >
                                            {meetingFileName}
                                        </p>
                                    </div>
                                    <div
                                        className="stroke-slate-400 hover:bg-red-500 hover:stroke-white rounded-md p-1 transition-colors duration-100 ease-in cursor-pointer"
                                        onClick={() => {
                                            setMeetingFile(null);
                                            setMeetingFileName("");
                                            setMeetingFileExtension("");
                                            setHasFileBeenChanged(true);
                                        }}
                                    >
                                        <TrashIcon />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex justify-end mt-2 gap-2">
                        <Modal
                            nameButton="Cancelar"
                            textHeader="Cancelar Acta de Reunión"
                            textBody="¿Seguro que quiere cancelar la edicion del Acta de Reunión?"
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
                                await updateMeeting();
                            }}
                            textColor="blue"
                            verifyFunction={() => {
                                if (
                                    !hasFileBeenChanged ||
                                    (hasFileBeenChanged && meetingFile !== null)
                                ) {
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
                        console.log(user);
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

    function downloadOriginalFile(idArchivo, nombreDocumento) {
        toast.promise(downloadDocument(idArchivo, nombreDocumento), {
            loading: "Descargando archivo...",
            success: (data) => {
                return "Archivo descargado con exito";
            },
            error: "Error al descargar archivo",
            position: "bottom-right",
        });
    }
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

    async function updateMeeting() {
        try {
            setIsLoading(true);
            const file = new FormData();
            file.append("file", meetingFile);
            file.append("idLineaActaReunion", idLineaActaReunion);
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
            file.append("idArchivo", meetingFileId);
            file.append("hasFileBeenChanged", hasFileBeenChanged === true ? 1 : 0);

            const url =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/api/proyecto/actaReunion/modificarLineaActaReunion`;

            const response = await axios.put(url, file, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                console.log("se subio el archivo con exito");
                toast.success("Se modificó la reunión exitosamente");
                setIsLoading(false);
                router.push(
                    "/dashboard/" +
                        projectName +
                        "=" +
                        projectId +
                        "/actaReunion"
                );
            }else{
                throw new Error("Error al modificar reunión");
            }
        } catch (e) {
            console.log(e);
            toast.error("Error al modificar reunión");
            setIsLoading(false);
        }
    }
}
export default UpdateActaR;
