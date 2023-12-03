"use client";
import CardSelectedUser from "@/components/CardSelectedUser";
import ModalUsersOne from "@/components/ModalUsersOne";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import FileDrop from "@/components/dashboardComps/projectComps/actaReunionComps/FileDrop";
import { Button, Input } from "@nextui-org/react";
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
    const idLineaActaReunion = decodeURIComponent(props.params.updateActaReunion);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const router = useRouter();

    const [meetingName, setMeetingName] = useState("");
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const [meetingMotive, setMeetingMotive] = useState("");
    const [meetingConvocante, setMeetingConvocante] = useState([]);
    const [meetingFile, setMeetingFile] = useState(null);

    const [isModalConvocanteOpen, setIsModalConvocanteOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isPlantillaDownloadLoading, setIsPlantillaDownloadLoading] =
        useState(false);

    const twTitle = "text-lg font-semibold text-mainHeaders  mb-1";

    useEffect(() => {
        setIsLoadingSmall(true);
        const url =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            `/api/proyecto/actaReunion/listarLineaActaReunionXIdLineaActaReunion/` + idLineaActaReunion;

        axios.get(url).then(function(response){
            console.log(response);
            const {lineaActaReunion} = response.data;

            setMeetingName(lineaActaReunion.nombreReunion);
            setMeetingDate(dbDateToInputDate(lineaActaReunion.fechaReunion));
            setMeetingTime(lineaActaReunion.horaReunion);
            setMeetingMotive(lineaActaReunion.motivo);
            console.log(lineaActaReunion.nombres);
            setMeetingConvocante([{
                idUsuario: lineaActaReunion.idConvocante,
                nombres: lineaActaReunion.nombreConvocante,
                apellidos: lineaActaReunion.apellidosConvocante,
                correoElectronico: lineaActaReunion.correoElectronico,  
                imgLink: lineaActaReunion.imgLink
            }]);
            //setMeetingFile(lineaActaReunion.idArchivo)

            setIsLoadingSmall(false);
        }).catch(function(error){
            console.log(error);
            toast.error("Error al cargar la acta de reunión");
        })
    }, []);

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
                    <FileDrop setFile={setMeetingFile} />
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
}
export default UpdateActaR;
