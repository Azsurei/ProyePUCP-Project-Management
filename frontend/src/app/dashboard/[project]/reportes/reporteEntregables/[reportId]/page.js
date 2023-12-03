"use client";
import CardTareaDisplay from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardTareaDisplay";
import {
    Button,
    Chip,
    CircularProgress,
    Divider,
    Progress,
    useDisclosure,
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reporteEntregablesStyles/repEntregables.css";
import CardContribuyente from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardContribuyente";
import PieChart from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/PieChart";
import {
    dbDateToDisplayDate,
    inputDateToDisplayDate,
} from "@/common/dateFunctions";
import { SmallLoadingScreen } from "../../../layout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import ModalSave from "@/components/dashboardComps/projectComps/reportesComps/ModalSave";
import { SessionContext } from "@/app/dashboard/layout";
import EmptyBoxIcon from "@/components/EmptyBoxIcon";
axios.defaults.withCredentials = true;

const mockUsers = [
    {
        idUsuario: 4,
        nombres: "Renzo Gabriel",
        apellidos: "Pinto Quiroz",
        correoElectronico: "a20201491@pucp.edu.pe",
        imgLink: "/images/ronaldo_user.png",
    },
    {
        idUsuario: 5,
        nombres: "Renzo Gabriel",
        apellidos: "Pinto Quiroz",
        correoElectronico: "a20201491@pucp.edu.pe",
        imgLink: "/images/ronaldo_user.png",
    },
    {
        idUsuario: 6,
        nombres: "Renzo Gabriel",
        apellidos: "Pinto Quiroz",
        correoElectronico: "a20201491@pucp.edu.pe",
        imgLink: "/images/ronaldo_user.png",
    },
];

const mockEntregablesArray = [
    {
        idEntregable: 1,
        nombre: "El mejor entregable",
    },
    {
        idEntregable: 2,
        nombre: "Backlog",
    },
    {
        idEntregable: 3,
        nombre: "Historias de usuario",
    },
];

function ExportIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
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

function ReporteEntregables(props) {
    const router = useRouter();
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { sessionData } = useContext(SessionContext);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [selectedEntregable, setSelectedEntregable] = useState(null);
    const [listEntregables, setListEntregables] = useState([]);
    const [listTareas, setListTareas] = useState([]);
    const [listContribuyentes, setListContribuyentes] = useState([]);
    const [activeContribuyente, setActiveContribuyente] = useState(null);
    const [chartData, setChartData] = useState(null);

    //entregable general data
    const [entregableName, setEntregableName] = useState("");
    const [entregableChipColor, setEntregableChipColor] = useState("default");
    const [entregableProgress, setEntregableProgress] = useState(0);
    const [entregableComponentName, setEntregableComponentName] = useState("");
    const [entregableDescripcion, setEntregableDescripcion] = useState("");
    const [entregableFechaInicio, setEntregableFechaInicio] = useState("");
    const [entregableFechaFin, setEntregableFechaFin] = useState("");

    //state para guardar/exportar
    const [isNewReport, setIsNewReport] = useState(false);
    const [isSavingLoading, setIsSavingLoading] = useState(false);

    const {
        isOpen: isModalSaveOpen,
        onOpen: onModalSaveOpen,
        onOpenChange: onModalSaveOpenChange,
    } = useDisclosure();

    const [isReportEmpty, setIsReportEmpty] = useState(true);

    useEffect(() => {
        const reportId = decodeURIComponent(props.params.reportId);
        console.log(reportId);
        if (reportId === "nuevoReporte") {
            setIsNewReport(true);
            setIsLoadingSmall(true);
            const tareasURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/reporte/traerInformacionReporteEntregable/" +
                projectId;
            axios
                .get(tareasURL)
                .then(function (response) {
                    if (response.data.entregables.length === 0) {
                        //handleamos caso de entregables vacios
                        console.log("no tiene entregables");
                        setIsReportEmpty(true);
                        setListEntregables([]);
                    } else {
                        console.log("tiene entregables");
                        setIsReportEmpty(false);
                        setListEntregables(response.data.entregables);
                        setSelectedEntregable(
                            response.data.entregables[0].idEntregable
                        );

                        setListTareas(
                            response.data.entregables[0].tareasEntregable
                        );
                        getEntregableStatistics(response.data.entregables[0]);
                        setEntregableName(response.data.entregables[0].nombre);
                        setEntregableComponentName(
                            response.data.entregables[0].ComponenteEDTNombre
                        );
                        setEntregableDescripcion(
                            response.data.entregables[0].descripcion
                        );
                        setEntregableFechaInicio(
                            response.data.entregables[0].fechaInicio
                        );
                        setEntregableFechaFin(
                            response.data.entregables[0].fechaFin
                        );
                    }

                    setIsLoadingSmall(false);
                })
                .catch(function (error) {
                    console.log(error);
                    toast.error("Error de conexion al generar reporte");
                });
        } else if (!isNaN(parseFloat(reportId)) && isFinite(reportId)) {
            setIsReportEmpty(false);
            setIsNewReport(false);
            setIsLoadingSmall(true);

            const mockObj = [
                {
                    idEntregable: 61,
                    nombre: "entregable",
                    idComponente: 94,
                    activo: 1,
                    ComponenteEDTNombre: "mock",
                    descripcion: "",
                    hito: "",
                    fechaInicio: "2023-11-16T05:00:00.000Z",
                    fechaFin: "2023-11-22T05:00:00.000Z",
                    tareasEntregable: [
                        {
                            idTarea: 342,
                            idEquipo: null,
                            idPadre: null,
                            idTareaAnterior: null,
                            sumillaTarea: "mi tareaaa",
                            descripcion: "ascas",
                            fechaInicio: "2023-11-03T05:00:00.000Z",
                            fechaFin: "2023-11-21T05:00:00.000Z",
                            cantSubTareas: 0,
                            cantPosteriores: 0,
                            horasPlaneadas: 2,
                            fechaUltimaModificacionEstado:
                                "2023-11-17T05:00:00.000Z",
                            idTareaEstado: 2,
                            nombreTareaEstado: "En progreso",
                            colorTareaEstado: "primary",
                            esPosterior: 0,
                            idEntregable: 61,
                            usuarios: [
                                {
                                    idUsuario: 112,
                                    nombres: "rgpq25",
                                    apellidos: "pinto",
                                    correoElectronico: "renzopinto25@gmail.com",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJrt63rMLATn04gpvY9DXaY3w9Qs9fxJUPlKsOjnjMo=s96-c",
                                },
                            ],
                            equipo: null,
                        },
                        {
                            idTarea: 350,
                            idEquipo: null,
                            idPadre: null,
                            idTareaAnterior: null,
                            sumillaTarea: "dfvdf",
                            descripcion: "dfvdfv",
                            fechaInicio: "2023-11-08T05:00:00.000Z",
                            fechaFin: "2023-11-23T05:00:00.000Z",
                            cantSubTareas: 0,
                            cantPosteriores: 0,
                            horasPlaneadas: 0,
                            fechaUltimaModificacionEstado:
                                "2023-11-17T05:00:00.000Z",
                            idTareaEstado: 2,
                            nombreTareaEstado: "En progreso",
                            colorTareaEstado: "primary",
                            esPosterior: 0,
                            idEntregable: 61,
                            usuarios: [
                                {
                                    idUsuario: 112,
                                    nombres: "rgpq25",
                                    apellidos: "pinto",
                                    correoElectronico: "renzopinto25@gmail.com",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJrt63rMLATn04gpvY9DXaY3w9Qs9fxJUPlKsOjnjMo=s96-c",
                                },
                                {
                                    idUsuario: 124,
                                    nombres: "GABRIEL OMAR",
                                    apellidos: "DURAN RUIZ",
                                    correoElectronico: "a20203371@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocITUYDksM0tCrocZRIRPugJ4Fbaob9nn4e7FuDcSlD4=s96-c",
                                },
                                {
                                    idUsuario: 134,
                                    nombres: "Diego",
                                    apellidos: "Veramendi Malpartida",
                                    correoElectronico: "v.dvm.dvm@gmail.com",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocLDgSU5Bn-uSVGv5CrZtZZHcAVS-F05WlJ_Y5ZS_leGfH0=s96-c",
                                },
                            ],
                            equipo: null,
                        },
                        {
                            idTarea: 340,
                            idEquipo: null,
                            idPadre: null,
                            idTareaAnterior: null,
                            sumillaTarea: "23",
                            descripcion: "123",
                            fechaInicio: "2023-11-09T05:00:00.000Z",
                            fechaFin: "2023-11-16T05:00:00.000Z",
                            cantSubTareas: 0,
                            cantPosteriores: 0,
                            horasPlaneadas: 1,
                            fechaUltimaModificacionEstado:
                                "2023-11-15T05:00:00.000Z",
                            idTareaEstado: 3,
                            nombreTareaEstado: "Atrasado",
                            colorTareaEstado: "warning",
                            esPosterior: 0,
                            idEntregable: 61,
                            usuarios: [
                                {
                                    idUsuario: 77,
                                    nombres: "Renzo Gabriel",
                                    apellidos: "Pinto Quiroz",
                                    correoElectronico: "admin.com",
                                    imgLink: null,
                                },
                                {
                                    idUsuario: 95,
                                    nombres: "RENZO GABRIEL",
                                    apellidos: "PINTO QUIROZ",
                                    correoElectronico: "a20201491@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocKIk0aM_XpYt59sxRi15OzPyWLHl5oozg8fwR8nzgRy7A=s96-c",
                                },
                            ],
                            equipo: null,
                        },
                    ],
                },
                {
                    idEntregable: 62,
                    nombre: "otro entregable",
                    idComponente: 94,
                    activo: 1,
                    ComponenteEDTNombre: "mock",
                    descripcion: "",
                    hito: "",
                    fechaInicio: "2023-11-16T05:00:00.000Z",
                    fechaFin: "2023-11-22T05:00:00.000Z",
                    tareasEntregable: [
                        {
                            idTarea: 335,
                            idEquipo: null,
                            idPadre: null,
                            idTareaAnterior: null,
                            sumillaTarea: "tyron",
                            descripcion: "me gusta yuniqua",
                            fechaInicio: "2023-11-15T05:00:00.000Z",
                            fechaFin: "2023-11-30T05:00:00.000Z",
                            cantSubTareas: 0,
                            cantPosteriores: 0,
                            horasPlaneadas: 3,
                            fechaUltimaModificacionEstado:
                                "2023-11-15T05:00:00.000Z",
                            idTareaEstado: 2,
                            nombreTareaEstado: "En progreso",
                            colorTareaEstado: "primary",
                            esPosterior: 0,
                            idEntregable: 62,
                            usuarios: [
                                {
                                    idUsuario: 102,
                                    nombres: "DIEGO JAVIER KITAROU",
                                    apellidos: "IWASAKI MOREYRA",
                                    correoElectronico: "a20201540@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocLYSPcY7AgM2lE2tTdbHWQaD0gMitigp0VlNDaw7sZ4lA=s96-c",
                                },
                                {
                                    idUsuario: 101,
                                    nombres: "BRANDO LEONARDO",
                                    apellidos: "ROJAS ROMERO",
                                    correoElectronico: "a20191088@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJuYBGK6dYubtirEeG47L0vkWKWqNj0I4kiP3gBJRP5CjY=s96-c",
                                },
                                {
                                    idUsuario: 97,
                                    nombres: "BRUCE ANTHONY",
                                    apellidos: "ESTRADA MELGAREJO",
                                    correoElectronico: "a20203298@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJfDJJnt4CClfOWItoYOykKhkSPpobVB82pkxKw7MAIOQ=s96-c",
                                },
                                {
                                    idUsuario: 96,
                                    nombres: "JUAN ANGELO",
                                    apellidos: "FLORES RUBIO",
                                    correoElectronico:
                                        "angelo.flores@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocLWS53LV_YEk7R075wQoeLMJZ7shVi5xzY7MXVFIMu5V5k=s96-c",
                                },
                                {
                                    idUsuario: 93,
                                    nombres: "Diego Gustavo",
                                    apellidos: "Veramendi Malpartida",
                                    correoElectronico:
                                        "veramendi.diego@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJPVGYJZsx94AqeoVQXBVraWBlIpH3CHnmPRQ7nIooe9PA=s96-c",
                                },
                                {
                                    idUsuario: 132,
                                    nombres: "CHRISTIAN SEBASTIAN",
                                    apellidos: "CHIRA MALLQUI",
                                    correoElectronico: "s.chira@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJIe497b9iwVshhqsRLw5wG-D38RwfgS8xx0gyn0siNoE8=s96-c",
                                },
                                {
                                    idUsuario: 134,
                                    nombres: "Diego",
                                    apellidos: "Veramendi Malpartida",
                                    correoElectronico: "v.dvm.dvm@gmail.com",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocLDgSU5Bn-uSVGv5CrZtZZHcAVS-F05WlJ_Y5ZS_leGfH0=s96-c",
                                },
                            ],
                            equipo: null,
                        },
                        {
                            idTarea: 341,
                            idEquipo: null,
                            idPadre: null,
                            idTareaAnterior: null,
                            sumillaTarea: "para notis",
                            descripcion: "asc",
                            fechaInicio: "2023-11-10T05:00:00.000Z",
                            fechaFin: "2023-11-18T05:00:00.000Z",
                            cantSubTareas: 0,
                            cantPosteriores: 0,
                            horasPlaneadas: 1,
                            fechaUltimaModificacionEstado:
                                "2023-11-16T05:00:00.000Z",
                            idTareaEstado: 2,
                            nombreTareaEstado: "En progreso",
                            colorTareaEstado: "primary",
                            esPosterior: 0,
                            idEntregable: 62,
                            usuarios: [
                                {
                                    idUsuario: 134,
                                    nombres: "Diego",
                                    apellidos: "Veramendi Malpartida",
                                    correoElectronico: "v.dvm.dvm@gmail.com",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocLDgSU5Bn-uSVGv5CrZtZZHcAVS-F05WlJ_Y5ZS_leGfH0=s96-c",
                                },
                                {
                                    idUsuario: 132,
                                    nombres: "CHRISTIAN SEBASTIAN",
                                    apellidos: "CHIRA MALLQUI",
                                    correoElectronico: "s.chira@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJIe497b9iwVshhqsRLw5wG-D38RwfgS8xx0gyn0siNoE8=s96-c",
                                },
                                {
                                    idUsuario: 112,
                                    nombres: "rgpq25",
                                    apellidos: "pinto",
                                    correoElectronico: "renzopinto25@gmail.com",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJrt63rMLATn04gpvY9DXaY3w9Qs9fxJUPlKsOjnjMo=s96-c",
                                },
                            ],
                            equipo: null,
                        },
                        {
                            idTarea: 351,
                            idEquipo: null,
                            idPadre: null,
                            idTareaAnterior: null,
                            sumillaTarea: "asc",
                            descripcion: "asc",
                            fechaInicio: "2023-11-09T05:00:00.000Z",
                            fechaFin: "2023-11-23T05:00:00.000Z",
                            cantSubTareas: 0,
                            cantPosteriores: 0,
                            horasPlaneadas: 0,
                            fechaUltimaModificacionEstado:
                                "2023-11-17T05:00:00.000Z",
                            idTareaEstado: 2,
                            nombreTareaEstado: "En progreso",
                            colorTareaEstado: "primary",
                            esPosterior: 0,
                            idEntregable: 62,
                            usuarios: [
                                {
                                    idUsuario: 95,
                                    nombres: "RENZO GABRIEL",
                                    apellidos: "PINTO QUIROZ",
                                    correoElectronico: "a20201491@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocKIk0aM_XpYt59sxRi15OzPyWLHl5oozg8fwR8nzgRy7A=s96-c",
                                },
                                {
                                    idUsuario: 112,
                                    nombres: "rgpq25",
                                    apellidos: "pinto",
                                    correoElectronico: "renzopinto25@gmail.com",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJrt63rMLATn04gpvY9DXaY3w9Qs9fxJUPlKsOjnjMo=s96-c",
                                },
                            ],
                            equipo: null,
                        },
                        {
                            idTarea: 352,
                            idEquipo: null,
                            idPadre: null,
                            idTareaAnterior: null,
                            sumillaTarea: "asc",
                            descripcion: "asc",
                            fechaInicio: "2023-11-09T05:00:00.000Z",
                            fechaFin: "2023-11-23T05:00:00.000Z",
                            cantSubTareas: 0,
                            cantPosteriores: 0,
                            horasPlaneadas: 0,
                            fechaUltimaModificacionEstado:
                                "2023-11-17T05:00:00.000Z",
                            idTareaEstado: 2,
                            nombreTareaEstado: "En progreso",
                            colorTareaEstado: "primary",
                            esPosterior: 0,
                            idEntregable: 62,
                            usuarios: [
                                {
                                    idUsuario: 95,
                                    nombres: "RENZO GABRIEL",
                                    apellidos: "PINTO QUIROZ",
                                    correoElectronico: "a20201491@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocKIk0aM_XpYt59sxRi15OzPyWLHl5oozg8fwR8nzgRy7A=s96-c",
                                },
                                {
                                    idUsuario: 112,
                                    nombres: "rgpq25",
                                    apellidos: "pinto",
                                    correoElectronico: "renzopinto25@gmail.com",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJrt63rMLATn04gpvY9DXaY3w9Qs9fxJUPlKsOjnjMo=s96-c",
                                },
                            ],
                            equipo: null,
                        },
                        {
                            idTarea: 353,
                            idEquipo: null,
                            idPadre: null,
                            idTareaAnterior: null,
                            sumillaTarea: "Ser el mejor",
                            descripcion: "asc",
                            fechaInicio: "2023-11-03T05:00:00.000Z",
                            fechaFin: "2023-11-22T05:00:00.000Z",
                            cantSubTareas: 0,
                            cantPosteriores: 0,
                            horasPlaneadas: 0,
                            fechaUltimaModificacionEstado:
                                "2023-11-17T05:00:00.000Z",
                            idTareaEstado: 2,
                            nombreTareaEstado: "En progreso",
                            colorTareaEstado: "primary",
                            esPosterior: 0,
                            idEntregable: 62,
                            usuarios: [
                                {
                                    idUsuario: 112,
                                    nombres: "rgpq25",
                                    apellidos: "pinto",
                                    correoElectronico: "renzopinto25@gmail.com",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJrt63rMLATn04gpvY9DXaY3w9Qs9fxJUPlKsOjnjMo=s96-c",
                                },
                            ],
                            equipo: null,
                        },
                    ],
                },
            ];

            console.log("EL fileId del reporte es " + reportId);
            const listURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/reporte/obtenerJSONReporteEntregableXIdArchivo/" +
                reportId;
            axios
                .get(listURL)
                .then(function (response) {
                    console.log(" ====== json esta aqui ======");
                    console.log(response);
                    if (response.data.entregables) {
                        console.log("SETEANDO LA DATA");
                        setListEntregables(response.data.entregables);
                        console.log(response.data.entregables);

                        setSelectedEntregable(
                            response.data.entregables[0].idEntregable
                        );
                        console.log(response.data.entregables[0].tareasEntregable);

                        setListTareas(
                            response.data.entregables[0].tareasEntregable
                        );
                        console.log(response.data.entregables[0].tareasEntregable);

                        getEntregableStatistics(response.data.entregables[0]);
                        console.log(response.data.entregables[0]);

                        setEntregableName(response.data.entregables[0].nombre);
                        setEntregableComponentName(
                            response.data.entregables[0].ComponenteEDTNombre
                        );
                        setEntregableDescripcion(
                            response.data.entregables[0].descripcion
                        );
                        setEntregableFechaInicio(
                            response.data.entregables[0].fechaInicio
                        );
                        setEntregableFechaFin(
                            response.data.entregables[0].fechaFin
                        );
                    }
                    console.log("DATA SETTEADA, APAGANDO LOADING SCREEN");
                    setIsLoadingSmall(false);
                })
                .catch(function (error) {
                    console.log(error);
                    toast.error("Error de conexion al generar reporte");
                });
        } else {
            router.push("/404");
        }
    }, []);

    const btnStyle =
        "group hover:underline  font-medium px-4 py-2 rounded-md cursor-pointer";
    const btnStyleActive =
        "font-medium px-4 py-2 rounded-md bg-[#F4F4F5] dark:bg-[#414141] cursor-pointer";

    // if (isReportEmpty === true) {
    //     return (
    //         <div className="flex flex-col p-[2.5rem] flex-1 h-full">
    //             <HeaderWithButtonsSamePage
    //                 haveReturn={true}
    //                 haveAddNew={false}
    //                 handlerReturn={() => {
    //                     router.push(
    //                         "/dashboard/" +
    //                             projectName +
    //                             "=" +
    //                             projectId +
    //                             "/reportes"
    //                     );
    //                 }}
    //                 breadcrump={
    //                     "Inicio / Proyectos / " + projectName + " / Reportes"
    //                 }
    //             >
    //                 Reporte de entregables
    //             </HeaderWithButtonsSamePage>
    //             <div className="flex flex-col flex-1 justify-center items-center gap-3">
    //                 <p className="m-0 font-medium text-xl">
    //                     Este proyecto no cuenta con entregables, no hay nada que
    //                     mostrar
    //                 </p>
    //                 <EmptyBoxIcon width={200} height={200} />
    //             </div>
    //         </div>
    //     );
    // }
    
    async function handlerExport() {
        const reportId = decodeURIComponent(props.params.reportId);
        try {
            setIsExportLoading(true);
            const exportURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/reporte/descargarExcelReporteEntregableXIdArchivo";

            const response = await axios.post(
                exportURL,
                {
                  idArchivo: reportId,
                },
                {
                    responseType: "blob", // Important for binary data
                }
            );

            
        } catch (error) {
            setIsExportLoading(false);
            toast.error("Error al exportar reporte entregable");
            console.log(error);
        }
    }
    return (
        <div className="flex h-full flex-col p-[2.5rem] font-[Montserrat] gap-y-6 min-h-[800px]">
            <ModalSave
                isOpen={isModalSaveOpen}
                onOpenChange={onModalSaveOpenChange}
                guardarReporte={async (name) => {
                    return await handleSaveReport(name);
                }}
                tipo = "Entregables"
            />

            <div className="flex flex-row justify-between items-end">
                {/* <p className="text-4xl text-mainHeaders font-semibold">
                    Reporte de entregables
                </p> */}
                <HeaderWithButtonsSamePage
                    haveReturn={true}
                    haveAddNew={false}
                    handlerReturn={() => {
                        router.push(
                            "/dashboard/" +
                                projectName +
                                "=" +
                                projectId +
                                "/reportes"
                        );
                    }}
                    //newPrimarySon={ListComps.length + 1}
                    breadcrump={
                        "Inicio / Proyectos / " + projectName + " / Reportes"
                    }
                >
                    Reporte de entregables
                </HeaderWithButtonsSamePage>
                {isNewReport === true && (
                    <Button
                        color="warning"
                        className="text-white font-semibold"
                        onPress={() => {
                            // console.log(
                            //     JSON.stringify(listEntregables, null, 2)
                            // );
                            //handleSaveReport(listEntregables);
                            onModalSaveOpen();
                        }}
                        isLoading={isSavingLoading}
                    >
                        Guardar reporte
                    </Button>
                )}
                {isNewReport === false && (
                    <Button
                        color="success"
                        className="text-white font-semibold"
                        onClick={async () => {
                            await handlerExport();
                        }}
                        startContent={<ExportIcon />}
                    >
                        Exportar
                    </Button>
                )}
            </div>

            <Divider></Divider>

            <div className="flex flex-row overflow-hidden gap-x-4 mt-2 flex-1">
                <div className="w-[15%] flex flex-col space-y-1">
                    {listEntregables.map((entregable) => {
                        return (
                            <p
                                key={entregable.idEntregable}
                                className={
                                    selectedEntregable ===
                                    entregable.idEntregable
                                        ? btnStyleActive
                                        : btnStyle
                                }
                                onClick={() => {
                                    setSelectedEntregable(
                                        entregable.idEntregable
                                    );
                                    setListTareas(entregable.tareasEntregable);
                                    getEntregableStatistics(entregable);
                                    setEntregableName(entregable.nombre);
                                    setEntregableComponentName(
                                        entregable.ComponenteEDTNombre
                                    );
                                    setEntregableDescripcion(
                                        entregable.descripcion
                                    );
                                    setEntregableFechaInicio(
                                        entregable.fechaInicio
                                    );
                                    setEntregableFechaFin(entregable.fechaFin);
                                }}
                            >
                                {entregable.nombre}
                            </p>
                        );
                    })}
                </div>

                <Divider orientation="vertical" />

                <div className="w-[85%] flex flex-col">
                    <div className="flex flex-row h-full gap-5">
                        <div className="w-[70%] text-lg flex flex-col">
                            <div className="flex flex-row items-center gap-x-4 mb-3">
                                <p className="text-3xl text-mainHeaders font-semibold">
                                    {entregableName}
                                </p>
                                <Chip
                                    color={entregableChipColor}
                                    size="lg"
                                    variant="flat"
                                    radius="lg"
                                    className=" min-h-[40px] text-lg"
                                >
                                    {parseInt(entregableProgress) < 1 && "No iniciado"}
                                    {parseInt(entregableProgress) > 1 &&
                                        parseInt(entregableProgress) < 100 &&
                                        "En progreso"}
                                    {parseInt(entregableProgress) === 100 && "Finalizado"}
                                </Chip>
                            </div>

                            <div className="flex flex-row items-center gap-3 mb-3">
                                <Progress
                                    size="md"
                                    aria-label="Loading..."
                                    value={entregableProgress}
                                    color={entregableChipColor}
                                />
                                <p className="text-lg font-semibold text-mainHeaders">
                                    {entregableProgress + "%"}
                                </p>
                            </div>

                            <p className="text-gray-400">
                                {"Componente EDT asociado: " +
                                    entregableComponentName}
                            </p>

                            <p className="text-gray-400">
                                {"Descripcion: " + (entregableDescripcion==="" ? "Sin descripcion" : entregableDescripcion)}
                            </p>
                            <div className="flex flex-row item-center gap-3 ">
                                <p className="font-medium flex items-center">
                                    Fechas del entregable
                                </p>
                                <Chip
                                    color="success"
                                    size="md"
                                    variant="flat"
                                    className="min-h-[35px] text-base"
                                >
                                    {entregableFechaInicio !== "" &&
                                        dbDateToDisplayDate(
                                            entregableFechaInicio
                                        )}
                                </Chip>
                                <p>-</p>
                                <Chip
                                    color="danger"
                                    size="md"
                                    variant="flat"
                                    className="min-h-[35px] text-base"
                                >
                                    {entregableFechaFin !== "" &&
                                        dbDateToDisplayDate(entregableFechaFin)}
                                </Chip>
                            </div>

                            <div
                                className="flex flex-row py-[.4rem] px-[1rem] 
                                bg-mainSidebar rounded-xl text-sm tracking-wider 
                                items-center mt-5 mb-2 text-[#a1a1aa]"
                            >
                                <p className="flex-1">NOMBRE</p>
                                <p className="w-[30%]">ASIGNADOS</p>
                                <p className="w-[20%]">ESTADOS</p>
                                <p className="w-[20%]">FECHAS</p>
                            </div>

                            <div className="flex flex-col flex-1 space-y-1">
                                {listTareas !== null &&
                                listTareas.length !== 0 ? (
                                    listTareas.map((tarea) => {
                                        return (
                                            <CardTareaDisplay
                                                key={tarea.idTarea}
                                                tarea={tarea}
                                            />
                                        );
                                    })
                                ) : (
                                    <div className=" flex-1 text-slate-400 flex justify-center items-center">
                                        No hay tareas asignadas a este
                                        entregable
                                    </div>
                                )}
                            </div>
                        </div>
                        <div
                            className="w-[30%] bg-mainSidebar rounded-xl p-3 
                            flex flex-col items-start"
                        >
                            <p className="text-xl font-semibold text-mainHeaders  mb-3">
                                Grafico de contribucion
                            </p>
                            <div
                                className="w-full h-[40%]
                                bg-mainBackground rounded-xl 
                                flex justify-center
                                border-[1px] border-[#797979]
                                mb-3
                            "
                            >
                                {chartData !== null &&
                                listTareas.length !== 0 ? (
                                    <PieChart data={chartData} />
                                ) : (
                                    <div className="flex justify-center items-center flex-1 text-slate-400">
                                        {" "}
                                        No hay datos
                                    </div>
                                )}
                            </div>

                            <div
                                className="participantsContainer flex-1 w-full overflow-y-scroll 
                                pr-2 flex flex-col gap-y-2 pb-1
                            "
                            >
                                {listContribuyentes !== null &&
                                listContribuyentes.length !== 0 ? (
                                    listContribuyentes.map((contribuyente) => {
                                        return (
                                            <CardContribuyente
                                                key={
                                                    contribuyente.idContribuyente
                                                }
                                                contribuyente={contribuyente}
                                                user={contribuyente.usuario}
                                                equipo={contribuyente.equipo}
                                                isEquipo={
                                                    contribuyente.usuario ===
                                                    null
                                                        ? true
                                                        : false
                                                }
                                            />
                                        );
                                    })
                                ) : (
                                    <div className="flex-1 text-slate-400 flex justify-center items-center text-center">
                                        No hay contribuyentes asignados a este
                                        entregable
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    async function handleSaveReport(reportName) {
        setIsSavingLoading(true);
        for (const entregable of listEntregables) {
            const {
                entCharData,
                entBarProgress,
                entColorState,
                entContribuyentes,
            } = forSaveReportStatistics(entregable);

            //entregable.chartData = entCharData,
            (entregable.barProgress = entBarProgress),
                (entregable.colorState = entColorState),
                (entregable.contribuyentes = entContribuyentes);
        }

        console.log(
            "==================== DATA A MANDAR ========================="
        );
        console.log(JSON.stringify(listEntregables, null, 2));

        try {
            const saveURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/reporte/subirReporteEntregableJSON";

            const response = await axios.post(saveURL, {
                entregables: listEntregables,
                idProyecto: projectId,
                nombre: reportName,
                idUsuarioCreador: sessionData.idUsuario,
            });

            setIsSavingLoading(false);
            console.log(response);
            toast.success("Su reporte se guardo con exito");
            router.push(
                "/dashboard/" +
                    projectName +
                    "=" +
                    projectId +
                    "/reportes"
            );
            return 1;
        } catch (error) {
            toast.error("Error al guardar tu reporte");
            console.log(error);
            return 0;
        }
    }

    function getEntregableStatistics(entregable) {
        const contribuyentes = [];

        //agregamos sin repetir a los equipos y usuarios al arreglo de contribuyentes
        const participanteEstructura = {
            idContribuyente: 1,
            usuario: 1,
            equipo: 1,
            tareasAsignadas: 1,
            porcentajeTotal: 1,
        };

        entregable.tareasEntregable.forEach((tarea) => {
            //iteramos tareas de un entregable
            if (tarea.idEquipo !== null) {
                let flagHasBeenAddedE = 0;
                for (const contribuyente of contribuyentes) {
                    if (contribuyente.equipo !== null) {
                        if (contribuyente.equipo.idEquipo === tarea.idEquipo) {
                            flagHasBeenAddedE = 1;
                            break;
                        }
                    }
                }

                if (flagHasBeenAddedE === 0) {
                    console.log(
                        "agregando nuevo equipo " + tarea.equipo.nombre
                    );
                    contribuyentes.push({
                        idContribuyente: contribuyentes.length + 1,
                        usuario: null,
                        equipo: tarea.equipo,
                        tareasAsignadas: 1,
                        porcentajeTotal: 0,
                    });
                } else {
                    //buscamos al equipo en contribuyentes y aumentamos su asigned +1
                    console.log(
                        "agregando +1 tarea a el equipo " + tarea.equipo.nombre
                    );
                    const indexYaAsignado = contribuyentes.findIndex(
                        (elemento) =>
                            elemento.equipo?.idEquipo === tarea.equipo.idEquipo
                    );
                    contribuyentes[indexYaAsignado].tareasAsignadas =
                        contribuyentes[indexYaAsignado].tareasAsignadas + 1;
                }
            } else {
                tarea.usuarios.forEach((usuario) => {
                    //itereamos usuarios de la tarea

                    let flagHasBeenAdded = 0;
                    for (const contribuyente of contribuyentes) {
                        if (
                            contribuyente.usuario?.idUsuario ===
                            usuario.idUsuario
                        ) {
                            flagHasBeenAdded = 1;
                            break;
                        }
                    }

                    if (flagHasBeenAdded === 0) {
                        console.log(
                            "agregando nuevo usuario " + usuario.nombres
                        );
                        contribuyentes.push({
                            idContribuyente: contribuyentes.length + 1,
                            usuario: usuario,
                            equipo: null,
                            tareasAsignadas: 1,
                            porcentajeTotal: 0,
                        });
                    } else {
                        //buscamos al usuario en contribuyentes y aumentamos su asigned +1
                        console.log(
                            "agregando +1 tarea a el usuario " + usuario.nombres
                        );

                        const indexYaAsignado = contribuyentes.findIndex(
                            (elemento) =>
                                elemento.usuario?.idUsuario ===
                                usuario.idUsuario
                        );
                        contribuyentes[indexYaAsignado].tareasAsignadas =
                            contribuyentes[indexYaAsignado].tareasAsignadas + 1;
                    }
                });
            }
        });

        const listaContribuyentes = [...contribuyentes];

        for (const contribuyente of listaContribuyentes) {
            let contribPorTarea = 0;
            for (const tarea of entregable.tareasEntregable) {
                if (tarea.idEquipo !== null) {
                    if (tarea.idEquipo === contribuyente.equipo?.idEquipo) {
                        contribPorTarea +=
                            1 / entregable.tareasEntregable.length;
                    }
                } else {
                    const usuarioEncontrado = tarea.usuarios.find(
                        (user) =>
                            user.idUsuario === contribuyente.usuario?.idUsuario
                    );

                    if (usuarioEncontrado) {
                        contribPorTarea +=
                            (1 / tarea.usuarios.length) *
                            (1 / entregable.tareasEntregable.length);
                    }
                }
            }
            contribuyente.porcentajeTotal = contribPorTarea * 100;
        }

        console.log(JSON.stringify(listaContribuyentes, null, 2));

        console.log("LISTA LABELS");
        console.log(
            listaContribuyentes.map((contrib) => {
                if (contrib.usuario === null) {
                    return contrib.equipo.nombre;
                } else {
                    return contrib.usuario.nombres;
                }
            })
        );
        console.log("LISTA DATA");
        console.log(
            listaContribuyentes.map((contrib) => {
                return contrib.porcentajeTotal;
            })
        );

        setChartData({
            labels: listaContribuyentes.map((contrib) => {
                if (contrib.usuario === null) {
                    return contrib.equipo.nombre;
                } else {
                    return contrib.usuario.nombres;
                }
            }),
            datasets: [
                {
                    label: "% Contribucion",
                    data: listaContribuyentes.map((contrib) => {
                        return contrib.porcentajeTotal;
                    }),
                    backgroundColor: listaContribuyentes.map((contrib) => {
                        return randomHex();
                    }),
                },
            ],
        });

        //get finished tasks / total tasks
        let finishedTasks = 0;
        let totalTasks = 0;
        entregable.tareasEntregable.forEach((tarea) => {
            if (tarea.idTareaEstado === 4) {
                finishedTasks++;
            }
            totalTasks++;
        });
        if (totalTasks !== 0) {
            const finalProgress = (finishedTasks / totalTasks) * 100;
            const formattedProgress =
                typeof finalProgress === "number"
                    ? finalProgress.toFixed(2)
                    : finalProgress;
            console.log("el progreso es " + formattedProgress);
            setEntregableProgress(formattedProgress);

            //assign colors
            if (parseInt(formattedProgress) <= 10) setEntregableChipColor("danger");
            if (parseInt(formattedProgress) > 10 && parseInt(formattedProgress) <= 50)
                setEntregableChipColor("warning");
            if (parseInt(formattedProgress) > 50 && parseInt(formattedProgress) < 100)
                setEntregableChipColor("primary");
            if (parseInt(formattedProgress) === 100) setEntregableChipColor("success");
            if (parseInt(formattedProgress) === 100) console.log("se asigno success");
        } else {
            setEntregableProgress(0);
            setEntregableChipColor("default");
        }

        setListContribuyentes(listaContribuyentes);
    }

    function forSaveReportStatistics(entregable) {
        const contribuyentes = [];

        //agregamos sin repetir a los equipos y usuarios al arreglo de contribuyentes
        const participanteEstructura = {
            idContribuyente: 1,
            usuario: 1,
            equipo: 1,
            tareasAsignadas: 1,
            porcentajeTotal: 1,
        };

        entregable.tareasEntregable.forEach((tarea) => {
            //iteramos tareas de un entregable
            if (tarea.idEquipo !== null) {
                let flagHasBeenAddedE = 0;
                for (const contribuyente of contribuyentes) {
                    if (contribuyente.equipo !== null) {
                        if (contribuyente.equipo.idEquipo === tarea.idEquipo) {
                            flagHasBeenAddedE = 1;
                            break;
                        }
                    }
                }

                if (flagHasBeenAddedE === 0) {
                    // console.log(
                    //     "agregando nuevo equipo " + tarea.equipo.nombre
                    // );
                    contribuyentes.push({
                        idContribuyente: contribuyentes.length + 1,
                        usuario: null,
                        equipo: tarea.equipo,
                        tareasAsignadas: 1,
                        porcentajeTotal: 0,
                    });
                } else {
                    //buscamos al equipo en contribuyentes y aumentamos su asigned +1
                    // console.log(
                    //     "agregando +1 tarea a el equipo " + tarea.equipo.nombre
                    // );
                    const indexYaAsignado = contribuyentes.findIndex(
                        (elemento) =>
                            elemento.equipo?.idEquipo === tarea.equipo.idEquipo
                    );
                    contribuyentes[indexYaAsignado].tareasAsignadas =
                        contribuyentes[indexYaAsignado].tareasAsignadas + 1;
                }
            } else {
                tarea.usuarios.forEach((usuario) => {
                    //itereamos usuarios de la tarea

                    let flagHasBeenAdded = 0;
                    for (const contribuyente of contribuyentes) {
                        if (
                            contribuyente.usuario?.idUsuario ===
                            usuario.idUsuario
                        ) {
                            flagHasBeenAdded = 1;
                            break;
                        }
                    }

                    if (flagHasBeenAdded === 0) {
                        // console.log(
                        //     "agregando nuevo usuario " + usuario.nombres
                        // );
                        contribuyentes.push({
                            idContribuyente: contribuyentes.length + 1,
                            usuario: usuario,
                            equipo: null,
                            tareasAsignadas: 1,
                            porcentajeTotal: 0,
                        });
                    } else {
                        //buscamos al usuario en contribuyentes y aumentamos su asigned +1
                        // console.log(
                        //     "agregando +1 tarea a el usuario " + usuario.nombres
                        // );

                        const indexYaAsignado = contribuyentes.findIndex(
                            (elemento) =>
                                elemento.usuario?.idUsuario ===
                                usuario.idUsuario
                        );
                        contribuyentes[indexYaAsignado].tareasAsignadas =
                            contribuyentes[indexYaAsignado].tareasAsignadas + 1;
                    }
                });
            }
        });

        const listaContribuyentes = [...contribuyentes];

        for (const contribuyente of listaContribuyentes) {
            let contribPorTarea = 0;
            for (const tarea of entregable.tareasEntregable) {
                if (tarea.idEquipo !== null) {
                    if (tarea.idEquipo === contribuyente.equipo?.idEquipo) {
                        contribPorTarea +=
                            1 / entregable.tareasEntregable.length;
                    }
                } else {
                    const usuarioEncontrado = tarea.usuarios.find(
                        (user) =>
                            user.idUsuario === contribuyente.usuario?.idUsuario
                    );

                    if (usuarioEncontrado) {
                        contribPorTarea +=
                            (1 / tarea.usuarios.length) *
                            (1 / entregable.tareasEntregable.length);
                    }
                }
            }
            contribuyente.porcentajeTotal = contribPorTarea * 100;
        }

        // console.log(JSON.stringify(listaContribuyentes, null, 2));

        // console.log("LISTA LABELS");
        // console.log(
        //     listaContribuyentes.map((contrib) => {
        //         if (contrib.usuario === null) {
        //             return contrib.equipo.nombre;
        //         } else {
        //             return contrib.usuario.nombres;
        //         }
        //     })
        // );
        // console.log("LISTA DATA");
        // console.log(
        //     listaContribuyentes.map((contrib) => {
        //         return contrib.porcentajeTotal;
        //     })
        // );

        const entCharData = {
            labels: listaContribuyentes.map((contrib) => {
                if (contrib.usuario === null) {
                    return contrib.equipo.nombre;
                } else {
                    return contrib.usuario.nombres;
                }
            }),
            datasets: [
                {
                    label: "% Contribucion",
                    data: listaContribuyentes.map((contrib) => {
                        return contrib.porcentajeTotal;
                    }),
                    backgroundColor: listaContribuyentes.map((contrib) => {
                        return randomHex();
                    }),
                },
            ],
        };

        //get finished tasks / total tasks
        let finishedTasks = 0;
        let totalTasks = 0;
        entregable.tareasEntregable.forEach((tarea) => {
            if (tarea.idTareaEstado === 4) {
                finishedTasks++;
            }
            totalTasks++;
        });
        const finalProgress = (finishedTasks / totalTasks) * 100;
        const formattedProgress =
            typeof finalProgress === "number"
                ? finalProgress.toFixed(2)
                : finalProgress;

        const entBarProgress = formattedProgress;

        //assign colors
        let entColorState;
        if (formattedProgress <= 10) entColorState = "danger";
        if (formattedProgress > 10 && formattedProgress <= 50)
            entColorState = "warning";
        if (formattedProgress > 50 && formattedProgress < 100)
            entColorState = "primary";
        if (formattedProgress === 100) entColorState = "success";

        const entContribuyentes = listaContribuyentes;

        return {
            entCharData,
            entBarProgress,
            entColorState,
            entContribuyentes,
        };
    }

    function randomHex() {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
}

export default ReporteEntregables;
