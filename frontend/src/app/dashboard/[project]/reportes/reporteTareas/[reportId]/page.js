"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
    Button,
    Divider,
    Select,
    SelectItem,
    Tab,
    Tabs,
} from "@nextui-org/react";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reporteTareasStyles/repTareas.css";
import ListTareasReporte from "@/components/dashboardComps/projectComps/reportesComps/reporteTareasComps/ListTareasReporte";
import TaskProgressReport from "@/components/dashboardComps/projectComps/reportesComps/reporteTareasComps/TaskProgressReport";
import TasksGraphicView from "@/components/dashboardComps/projectComps/reportesComps/reporteTareasComps/TasksGraphicView";
import { HerramientasInfo, SmallLoadingScreen } from "../../../layout";
import { useRouter } from "next/navigation";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
axios.defaults.withCredentials = true;

export const TaskSelector = createContext();

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

function reporteTareas(props) {
    //herramientas necesarias para este reporte:
    //Cronograma, EDT y Sprints (deberia ser opcional este ultimo)
    const router = useRouter();
    const { herramientasInfo } = useContext(HerramientasInfo);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [listTareas, setListTareas] = useState(null);

    const [selectedTask, setSelectedTask] = useState(null);

    const [listTableGenData, setListTableGenData] = useState(null);
    const [listSprintData, setListSprintData] = useState(null);

    function countTasksWithStatus(tasks, idVal) {
        let count = 0;

        function traverse(task) {
            if (task.idTareaEstado === idVal) {
                count++;
            }

            if (task.tareasHijas && task.tareasHijas.length > 0) {
                task.tareasHijas.forEach((subtask) => traverse(subtask));
            }
        }

        tasks.forEach((task) => traverse(task));

        return count;
    }

    //state para guardar/exportar
    const [isNewReport, setIsNewReport] = useState(false);

    useEffect(() => {
        const reportId = decodeURIComponent(props.params.reportId);
        console.log(reportId);

        if (reportId === "nuevoReporte") {
            setIsNewReport(true);
            setIsLoadingSmall(true);
            const tareasURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/cronograma/listarTareasXidProyectoConProgresosDetallados/" +
                projectId;
            axios
                .get(tareasURL)
                .then(function (response) {
                    function remapearProgresosTarea(tarea) {
                        const updatedUsers = tarea.usuarios.map((user) => {
                            const progresoDeUsuario = tarea.progresos.filter(
                                (progress) =>
                                    progress.idUsuario === user.idUsuario
                            );
                            return {
                                ...user,
                                progresoDeUsuario,
                            };
                        });

                        return {
                            ...tarea,
                            usuarios: updatedUsers,
                        };
                    }

                    function recorrerTareas(tareas) {
                        tareas.forEach((tarea) => {
                            const nuevaTarea = remapearProgresosTarea(tarea);
                            tareas[tareas.indexOf(tarea)] = nuevaTarea;

                            if (
                                tarea.tareasHijas.length > 0
                            ) {
                                recorrerTareas(tarea.tareasHijas,);
                            }
                        });
                        return tareas;
                    }

                    const nuevasTareas = recorrerTareas(response.data.tareasOrdenadas);
                    console.log(JSON.stringify(nuevasTareas, null, 2)) ; 

                    setListTareas(nuevasTareas);

                    //asignar listTableGenData
                    const notStartedTasksG = countTasksWithStatus(
                        response.data.tareasOrdenadas,
                        1
                    );
                    const inProgressTasksG = countTasksWithStatus(
                        response.data.tareasOrdenadas,
                        2
                    );
                    const delayedTasksG = countTasksWithStatus(
                        response.data.tareasOrdenadas,
                        3
                    );
                    const finishedTasksG = countTasksWithStatus(
                        response.data.tareasOrdenadas,
                        4
                    );

                    setListTableGenData({
                        labels: [
                            "No iniciadas",
                            "En progreso",
                            "Atrasadas",
                            "Finalizadas",
                        ],
                        datasets: [
                            {
                                label: "Cantidad",
                                data: [
                                    notStartedTasksG,
                                    inProgressTasksG,
                                    delayedTasksG,
                                    finishedTasksG,
                                ],
                                backgroundColor: [
                                    "rgb(63, 63, 70)",
                                    "rgb(0, 112, 240)",
                                    "rgb(245, 165, 36)",
                                    "rgb(24, 201, 100)",
                                ],
                                maxBarThickness: 160,
                            },
                        ],
                    });

                    setIsLoadingSmall(false);
                })
                .catch(function (error) {
                    console.log(error);
                    toast.error("Error al cargar reporte");
                });
        } else if (!isNaN(reportId)) {
            setIsNewReport(false);
            setIsLoadingSmall(true);
            const mockObj = [
                {
                    idTarea: 334,
                    idEquipo: null,
                    idPadre: null,
                    idTareaAnterior: null,
                    sumillaTarea: "ser negro",
                    descripcion: "pasar de blanco a negro",
                    fechaInicio: "2023-11-15T05:00:00.000Z",
                    fechaFin: "2023-11-30T05:00:00.000Z",
                    cantSubTareas: 0,
                    cantPosteriores: 0,
                    horasPlaneadas: 1,
                    fechaUltimaModificacionEstado: "2023-11-15T05:00:00.000Z",
                    idTareaEstado: 2,
                    nombreTareaEstado: "En progreso",
                    colorTareaEstado: "primary",
                    esPosterior: 0,
                    idEntregable: null,
                    porcentajeProgreso: 0,
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
                            idUsuario: 93,
                            nombres: "Diego Gustavo",
                            apellidos: "Veramendi Malpartida",
                            correoElectronico: "veramendi.diego@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocJPVGYJZsx94AqeoVQXBVraWBlIpH3CHnmPRQ7nIooe9PA=s96-c",
                        },
                        {
                            idUsuario: 96,
                            nombres: "JUAN ANGELO",
                            apellidos: "FLORES RUBIO",
                            correoElectronico: "angelo.flores@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLWS53LV_YEk7R075wQoeLMJZ7shVi5xzY7MXVFIMu5V5k=s96-c",
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
                            idUsuario: 124,
                            nombres: "GABRIEL OMAR",
                            apellidos: "DURAN RUIZ",
                            correoElectronico: "a20203371@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocITUYDksM0tCrocZRIRPugJ4Fbaob9nn4e7FuDcSlD4=s96-c",
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
                    progresos: [],
                    tareasPosteriores: [],
                    tareasHijas: [],
                },
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
                    fechaUltimaModificacionEstado: "2023-11-15T05:00:00.000Z",
                    idTareaEstado: 2,
                    nombreTareaEstado: "En progreso",
                    colorTareaEstado: "primary",
                    esPosterior: 0,
                    idEntregable: 62,
                    porcentajeProgreso: 0,
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
                            correoElectronico: "angelo.flores@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLWS53LV_YEk7R075wQoeLMJZ7shVi5xzY7MXVFIMu5V5k=s96-c",
                        },
                        {
                            idUsuario: 93,
                            nombres: "Diego Gustavo",
                            apellidos: "Veramendi Malpartida",
                            correoElectronico: "veramendi.diego@pucp.edu.pe",
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
                    progresos: [],
                    tareasPosteriores: [],
                    tareasHijas: [],
                },
                {
                    idTarea: 336,
                    idEquipo: null,
                    idPadre: null,
                    idTareaAnterior: null,
                    sumillaTarea: "nigger",
                    descripcion: "hola soy blanco",
                    fechaInicio: "2023-11-15T05:00:00.000Z",
                    fechaFin: "2023-11-16T05:00:00.000Z",
                    cantSubTareas: 0,
                    cantPosteriores: 0,
                    horasPlaneadas: 1,
                    fechaUltimaModificacionEstado: "2023-11-15T05:00:00.000Z",
                    idTareaEstado: 3,
                    nombreTareaEstado: "Atrasado",
                    colorTareaEstado: "warning",
                    esPosterior: 0,
                    idEntregable: null,
                    porcentajeProgreso: 0,
                    usuarios: [
                        {
                            idUsuario: 96,
                            nombres: "JUAN ANGELO",
                            apellidos: "FLORES RUBIO",
                            correoElectronico: "angelo.flores@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLWS53LV_YEk7R075wQoeLMJZ7shVi5xzY7MXVFIMu5V5k=s96-c",
                        },
                        {
                            idUsuario: 93,
                            nombres: "Diego Gustavo",
                            apellidos: "Veramendi Malpartida",
                            correoElectronico: "veramendi.diego@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocJPVGYJZsx94AqeoVQXBVraWBlIpH3CHnmPRQ7nIooe9PA=s96-c",
                        },
                        {
                            idUsuario: 95,
                            nombres: "RENZO GABRIEL",
                            apellidos: "PINTO QUIROZ",
                            correoElectronico: "a20201491@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocKIk0aM_XpYt59sxRi15OzPyWLHl5oozg8fwR8nzgRy7A=s96-c",
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
                            idUsuario: 101,
                            nombres: "BRANDO LEONARDO",
                            apellidos: "ROJAS ROMERO",
                            correoElectronico: "a20191088@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocJuYBGK6dYubtirEeG47L0vkWKWqNj0I4kiP3gBJRP5CjY=s96-c",
                        },
                        {
                            idUsuario: 102,
                            nombres: "DIEGO JAVIER KITAROU",
                            apellidos: "IWASAKI MOREYRA",
                            correoElectronico: "a20201540@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLYSPcY7AgM2lE2tTdbHWQaD0gMitigp0VlNDaw7sZ4lA=s96-c",
                        },
                        {
                            idUsuario: 112,
                            nombres: "rgpq25",
                            apellidos: "pinto",
                            correoElectronico: "renzopinto25@gmail.com",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocJrt63rMLATn04gpvY9DXaY3w9Qs9fxJUPlKsOjnjMo=s96-c",
                        },
                        {
                            idUsuario: 106,
                            nombres: "AUGUSTO VICTOR",
                            apellidos: "TONG YANG",
                            correoElectronico: "avtong@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLtn0bclifD_j7WYksh4aE1ggmgqiO6mE_PMbd5yUMO=s96-c",
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
                    progresos: [],
                    tareasPosteriores: [],
                    tareasHijas: [],
                },
                {
                    idTarea: 337,
                    idEquipo: null,
                    idPadre: null,
                    idTareaAnterior: null,
                    sumillaTarea: "renzo example",
                    descripcion: "pene",
                    fechaInicio: "2023-11-14T05:00:00.000Z",
                    fechaFin: "2023-11-15T05:00:00.000Z",
                    cantSubTareas: 0,
                    cantPosteriores: 0,
                    horasPlaneadas: 1,
                    fechaUltimaModificacionEstado: "2023-11-15T05:00:00.000Z",
                    idTareaEstado: 3,
                    nombreTareaEstado: "Atrasado",
                    colorTareaEstado: "warning",
                    esPosterior: 0,
                    idEntregable: null,
                    porcentajeProgreso: 88,
                    usuarios: [
                        {
                            idUsuario: 93,
                            nombres: "Diego Gustavo",
                            apellidos: "Veramendi Malpartida",
                            correoElectronico: "veramendi.diego@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocJPVGYJZsx94AqeoVQXBVraWBlIpH3CHnmPRQ7nIooe9PA=s96-c",
                        },
                        {
                            idUsuario: 95,
                            nombres: "RENZO GABRIEL",
                            apellidos: "PINTO QUIROZ",
                            correoElectronico: "a20201491@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocKIk0aM_XpYt59sxRi15OzPyWLHl5oozg8fwR8nzgRy7A=s96-c",
                        },
                        {
                            idUsuario: 96,
                            nombres: "JUAN ANGELO",
                            apellidos: "FLORES RUBIO",
                            correoElectronico: "angelo.flores@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLWS53LV_YEk7R075wQoeLMJZ7shVi5xzY7MXVFIMu5V5k=s96-c",
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
                            idUsuario: 101,
                            nombres: "BRANDO LEONARDO",
                            apellidos: "ROJAS ROMERO",
                            correoElectronico: "a20191088@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocJuYBGK6dYubtirEeG47L0vkWKWqNj0I4kiP3gBJRP5CjY=s96-c",
                        },
                        {
                            idUsuario: 102,
                            nombres: "DIEGO JAVIER KITAROU",
                            apellidos: "IWASAKI MOREYRA",
                            correoElectronico: "a20201540@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLYSPcY7AgM2lE2tTdbHWQaD0gMitigp0VlNDaw7sZ4lA=s96-c",
                        },
                        {
                            idUsuario: 106,
                            nombres: "AUGUSTO VICTOR",
                            apellidos: "TONG YANG",
                            correoElectronico: "avtong@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLtn0bclifD_j7WYksh4aE1ggmgqiO6mE_PMbd5yUMO=s96-c",
                        },
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
                        {
                            idUsuario: 135,
                            nombres: "TFN-yasuoxl",
                            apellidos: "GARCIA",
                            correoElectronico: "yasuogarciahiga3@gmail.com",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLYvTKephtwdwLjNiz9jMTZMitXftRpQ6yb_RwvGZMj=s96-c",
                        },
                    ],
                    equipo: null,
                    progresos: [
                        {
                            idRegistroProgreso: 22,
                            idTarea: 337,
                            idUsuario: 135,
                            descripcion:
                                "muito facil, lo complete hasta pajeandome",
                            porcentajeRegistrado: 80,
                            fechaRegistro: "2023-11-15T05:00:00.000Z",
                            horaRegistro: null,
                            activo: 1,
                            nombres: "TFN-yasuoxl",
                            apellidos: "GARCIA",
                            correoElectronico: "yasuogarciahiga3@gmail.com",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLYvTKephtwdwLjNiz9jMTZMitXftRpQ6yb_RwvGZMj=s96-c",
                        },
                        {
                            idRegistroProgreso: 23,
                            idTarea: 337,
                            idUsuario: 95,
                            descripcion: "yasuo fucki",
                            porcentajeRegistrado: 8,
                            fechaRegistro: "2023-11-15T05:00:00.000Z",
                            horaRegistro: null,
                            activo: 1,
                            nombres: "RENZO GABRIEL",
                            apellidos: "PINTO QUIROZ",
                            correoElectronico: "a20201491@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocKIk0aM_XpYt59sxRi15OzPyWLHl5oozg8fwR8nzgRy7A=s96-c",
                        },
                    ],
                    tareasPosteriores: [],
                    tareasHijas: [],
                },
                {
                    idTarea: 338,
                    idEquipo: null,
                    idPadre: null,
                    idTareaAnterior: null,
                    sumillaTarea: "holis",
                    descripcion: "pura gapin",
                    fechaInicio: "2023-11-15T05:00:00.000Z",
                    fechaFin: "2023-11-16T05:00:00.000Z",
                    cantSubTareas: 0,
                    cantPosteriores: 0,
                    horasPlaneadas: 2,
                    fechaUltimaModificacionEstado: "2023-11-15T05:00:00.000Z",
                    idTareaEstado: 4,
                    nombreTareaEstado: "Finalizado",
                    colorTareaEstado: "success",
                    esPosterior: 0,
                    idEntregable: null,
                    porcentajeProgreso: 100,
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
                            idUsuario: 135,
                            nombres: "TFN-yasuoxl",
                            apellidos: "GARCIA",
                            correoElectronico: "yasuogarciahiga3@gmail.com",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLYvTKephtwdwLjNiz9jMTZMitXftRpQ6yb_RwvGZMj=s96-c",
                        },
                        {
                            idUsuario: 96,
                            nombres: "JUAN ANGELO",
                            apellidos: "FLORES RUBIO",
                            correoElectronico: "angelo.flores@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLWS53LV_YEk7R075wQoeLMJZ7shVi5xzY7MXVFIMu5V5k=s96-c",
                        },
                        {
                            idUsuario: 93,
                            nombres: "Diego Gustavo",
                            apellidos: "Veramendi Malpartida",
                            correoElectronico: "veramendi.diego@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocJPVGYJZsx94AqeoVQXBVraWBlIpH3CHnmPRQ7nIooe9PA=s96-c",
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
                            idUsuario: 101,
                            nombres: "BRANDO LEONARDO",
                            apellidos: "ROJAS ROMERO",
                            correoElectronico: "a20191088@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocJuYBGK6dYubtirEeG47L0vkWKWqNj0I4kiP3gBJRP5CjY=s96-c",
                        },
                        {
                            idUsuario: 102,
                            nombres: "DIEGO JAVIER KITAROU",
                            apellidos: "IWASAKI MOREYRA",
                            correoElectronico: "a20201540@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLYSPcY7AgM2lE2tTdbHWQaD0gMitigp0VlNDaw7sZ4lA=s96-c",
                        },
                        {
                            idUsuario: 106,
                            nombres: "AUGUSTO VICTOR",
                            apellidos: "TONG YANG",
                            correoElectronico: "avtong@pucp.edu.pe",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLtn0bclifD_j7WYksh4aE1ggmgqiO6mE_PMbd5yUMO=s96-c",
                        },
                        {
                            idUsuario: 112,
                            nombres: "rgpq25",
                            apellidos: "pinto",
                            correoElectronico: "renzopinto25@gmail.com",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocJrt63rMLATn04gpvY9DXaY3w9Qs9fxJUPlKsOjnjMo=s96-c",
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
                    progresos: [
                        {
                            idRegistroProgreso: 21,
                            idTarea: 338,
                            idUsuario: 135,
                            descripcion: "---",
                            porcentajeRegistrado: 100,
                            fechaRegistro: "2023-11-15T05:00:00.000Z",
                            horaRegistro: null,
                            activo: 1,
                            nombres: "TFN-yasuoxl",
                            apellidos: "GARCIA",
                            correoElectronico: "yasuogarciahiga3@gmail.com",
                            imgLink:
                                "https://lh3.googleusercontent.com/a/ACg8ocLYvTKephtwdwLjNiz9jMTZMitXftRpQ6yb_RwvGZMj=s96-c",
                        },
                    ],
                    tareasPosteriores: [
                        {
                            idTarea: 339,
                            idEquipo: null,
                            idPadre: null,
                            idTareaAnterior: 338,
                            sumillaTarea: "full anuel",
                            descripcion: "ah caray",
                            fechaInicio: "2023-11-16T05:00:00.000Z",
                            fechaFin: "2023-11-17T05:00:00.000Z",
                            cantSubTareas: 0,
                            cantPosteriores: 0,
                            horasPlaneadas: 2,
                            fechaUltimaModificacionEstado:
                                "2023-11-15T05:00:00.000Z",
                            idTareaEstado: 2,
                            nombreTareaEstado: "En progreso",
                            colorTareaEstado: "primary",
                            esPosterior: 1,
                            idEntregable: null,
                            porcentajeProgreso: 0,
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
                                    idUsuario: 135,
                                    nombres: "TFN-yasuoxl",
                                    apellidos: "GARCIA",
                                    correoElectronico:
                                        "yasuogarciahiga3@gmail.com",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocLYvTKephtwdwLjNiz9jMTZMitXftRpQ6yb_RwvGZMj=s96-c",
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
                                    idUsuario: 97,
                                    nombres: "BRUCE ANTHONY",
                                    apellidos: "ESTRADA MELGAREJO",
                                    correoElectronico: "a20203298@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJfDJJnt4CClfOWItoYOykKhkSPpobVB82pkxKw7MAIOQ=s96-c",
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
                                    idUsuario: 102,
                                    nombres: "DIEGO JAVIER KITAROU",
                                    apellidos: "IWASAKI MOREYRA",
                                    correoElectronico: "a20201540@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocLYSPcY7AgM2lE2tTdbHWQaD0gMitigp0VlNDaw7sZ4lA=s96-c",
                                },
                                {
                                    idUsuario: 106,
                                    nombres: "AUGUSTO VICTOR",
                                    apellidos: "TONG YANG",
                                    correoElectronico: "avtong@pucp.edu.pe",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocLtn0bclifD_j7WYksh4aE1ggmgqiO6mE_PMbd5yUMO=s96-c",
                                },
                                {
                                    idUsuario: 112,
                                    nombres: "rgpq25",
                                    apellidos: "pinto",
                                    correoElectronico: "renzopinto25@gmail.com",
                                    imgLink:
                                        "https://lh3.googleusercontent.com/a/ACg8ocJrt63rMLATn04gpvY9DXaY3w9Qs9fxJUPlKsOjnjMo=s96-c",
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
                            progresos: [],
                            tareasPosteriores: [],
                        },
                    ],
                    tareasHijas: [],
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
                    fechaUltimaModificacionEstado: "2023-11-15T05:00:00.000Z",
                    idTareaEstado: 3,
                    nombreTareaEstado: "Atrasado",
                    colorTareaEstado: "warning",
                    esPosterior: 0,
                    idEntregable: 61,
                    porcentajeProgreso: 0,
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
                    progresos: [],
                    tareasPosteriores: [],
                    tareasHijas: [],
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
                    fechaUltimaModificacionEstado: "2023-11-16T05:00:00.000Z",
                    idTareaEstado: 2,
                    nombreTareaEstado: "En progreso",
                    colorTareaEstado: "primary",
                    esPosterior: 0,
                    idEntregable: 62,
                    porcentajeProgreso: 0,
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
                    progresos: [],
                    tareasPosteriores: [],
                    tareasHijas: [],
                },
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
                    fechaUltimaModificacionEstado: "2023-11-17T05:00:00.000Z",
                    idTareaEstado: 2,
                    nombreTareaEstado: "En progreso",
                    colorTareaEstado: "primary",
                    esPosterior: 0,
                    idEntregable: 61,
                    porcentajeProgreso: 0,
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
                    progresos: [],
                    tareasPosteriores: [],
                    tareasHijas: [],
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
                    fechaUltimaModificacionEstado: "2023-11-17T05:00:00.000Z",
                    idTareaEstado: 2,
                    nombreTareaEstado: "En progreso",
                    colorTareaEstado: "primary",
                    esPosterior: 0,
                    idEntregable: 61,
                    porcentajeProgreso: 0,
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
                    progresos: [],
                    tareasPosteriores: [],
                    tareasHijas: [],
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
                    fechaUltimaModificacionEstado: "2023-11-17T05:00:00.000Z",
                    idTareaEstado: 2,
                    nombreTareaEstado: "En progreso",
                    colorTareaEstado: "primary",
                    esPosterior: 0,
                    idEntregable: 62,
                    porcentajeProgreso: 0,
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
                    progresos: [],
                    tareasPosteriores: [],
                    tareasHijas: [],
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
                    fechaUltimaModificacionEstado: "2023-11-17T05:00:00.000Z",
                    idTareaEstado: 2,
                    nombreTareaEstado: "En progreso",
                    colorTareaEstado: "primary",
                    esPosterior: 0,
                    idEntregable: 62,
                    porcentajeProgreso: 0,
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
                    progresos: [],
                    tareasPosteriores: [],
                    tareasHijas: [],
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
                    fechaUltimaModificacionEstado: "2023-11-17T05:00:00.000Z",
                    idTareaEstado: 2,
                    nombreTareaEstado: "En progreso",
                    colorTareaEstado: "primary",
                    esPosterior: 0,
                    idEntregable: 62,
                    porcentajeProgreso: 0,
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
                    progresos: [],
                    tareasPosteriores: [],
                    tareasHijas: [],
                },
            ];

            setListTareas(mockObj);

            const notStartedTasksG = countTasksWithStatus(mockObj, 1);
            const inProgressTasksG = countTasksWithStatus(mockObj, 2);
            const delayedTasksG = countTasksWithStatus(mockObj, 3);
            const finishedTasksG = countTasksWithStatus(mockObj, 4);

            console.log("1 => " + notStartedTasksG);
            console.log("2 => " + inProgressTasksG);
            console.log("3 => " + delayedTasksG);
            console.log("4 => " + finishedTasksG);

            setListTableGenData({
                labels: [
                    "No iniciadas",
                    "En progreso",
                    "Atrasadas",
                    "Finalizadas",
                ],
                datasets: [
                    {
                        label: "Cantidad",
                        data: [
                            notStartedTasksG,
                            inProgressTasksG,
                            delayedTasksG,
                            finishedTasksG,
                        ],
                        backgroundColor: [
                            "rgb(63, 63, 70)",
                            "rgb(0, 112, 240)",
                            "rgb(245, 165, 36)",
                            "rgb(24, 201, 100)",
                        ],
                        maxBarThickness: 160,
                    },
                ],
            });
            setIsLoadingSmall(false);
        } else {
            router.push("/404");
        }
    }, []);

    const twStyle1 = "font-semibold text-2xl text-mainHeaders";

    return (
        <div className="flex min-h-[1300px] flex-col p-[2.5rem] font-[Montserrat] gap-y-6 flex-1 ">
            <div className="flex flex-row justify-between items-end">
                {/* <p className="text-4xl text-mainHeaders font-semibold">
                    Reporte de tareas
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
                    Reporte de tareas
                </HeaderWithButtonsSamePage>
                {isNewReport === true && (
                    <Button
                        color="warning"
                        className="text-white font-semibold"
                        onPress={() => {
                            handleSaveReport();
                        }}
                    >
                        Guardar reporte
                    </Button>
                )}
                {isNewReport === false && (
                    <Button
                        color="success"
                        className="text-white font-semibold"
                        startContent={<ExportIcon />}
                    >
                        Exportar
                    </Button>
                )}
            </div>

            <Divider></Divider>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="flex flex-row gap-3 absolute top-0 bottom-1/2 left-0 right-0 mb-4">
                    <div className="  flex flex-col overflow-hidden flex-1">
                        <p className={twStyle1}>Listado de tareas</p>
                        <p className=" text-slate-400">
                            Selecciona una tarea para ver su detalle
                        </p>
                        <div className="flex-1  overflow-auto ">
                            <TaskSelector.Provider
                                value={{ selectedTask, handleSetSelectedTask }}
                            >
                                {listTareas !== null && (
                                    <ListTareasReporte
                                        listTareas={listTareas}
                                        leftMargin={"0px"}
                                        idSelected={selectedTask}
                                        setSelectedTask={(idTarea) => {
                                            setSelectedTask(idTarea);
                                        }}
                                    ></ListTareasReporte>
                                )}
                            </TaskSelector.Provider>
                        </div>
                    </div>

                    <Divider orientation="vertical" className=""></Divider>

                    {selectedTask === null && (
                        <div className="flex flex-col flex-1 overflow-y-hidden items-center justify-center">
                            Selecciona una tarea para ver su detalle
                        </div>
                    )}
                    {selectedTask !== null && (
                        <TaskProgressReport
                            generalProgress={selectedTask.porcentajeProgreso}
                            progressEntries={selectedTask.progresos}
                            asignedUsers={selectedTask.usuarios}
                        />
                    )}
                </div>

                <Divider></Divider>

                <div className="flex flex-col absolute top-1/2 bottom-0 left-0 right-0 mt-4">
                    {listTableGenData !== null && (
                        <TasksGraphicView chartGeneralData={listTableGenData} />
                    )}
                </div>
            </div>
        </div>
    );

    function handleSaveReport() {
        const jsonToPrint = {
            listTareas: listTareas,
        };

        console.log(JSON.stringify(jsonToPrint, null, 2));
    }

    function handleSetSelectedTask(task) {
        console.log(" SELECCIONAD LA TAREA " + JSON.stringify(task, null, 2));
        setSelectedTask(task);
    }
}
export default reporteTareas;
