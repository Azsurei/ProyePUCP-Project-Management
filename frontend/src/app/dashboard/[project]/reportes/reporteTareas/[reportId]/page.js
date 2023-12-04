"use client";
import { createContext, use, useContext, useEffect, useState } from "react";
import {
    Button,
    Divider,
    Select,
    SelectItem,
    Tab,
    Tabs,
    useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reporteTareasStyles/repTareas.css";
import ListTareasReporte from "@/components/dashboardComps/projectComps/reportesComps/reporteTareasComps/ListTareasReporte";
import TaskProgressReport from "@/components/dashboardComps/projectComps/reportesComps/reporteTareasComps/TaskProgressReport";
import TasksGraphicView from "@/components/dashboardComps/projectComps/reportesComps/reporteTareasComps/TasksGraphicView";
import { HerramientasInfo, SmallLoadingScreen } from "../../../layout";
import { useRouter } from "next/navigation";
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import ModalSave from "@/components/dashboardComps/projectComps/reportesComps/ModalSave";
import { set } from "date-fns";
import { SessionContext } from "@/app/dashboard/layout";
import { saveAs } from "file-saver";
import { toast } from "sonner";
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
    const { sessionData } = useContext(SessionContext);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [listTareas, setListTareas] = useState(null);

    const [selectedTask, setSelectedTask] = useState(null);

    const [listTableGenData, setListTableGenData] = useState(null);
    const [listSprintData, setListSprintData] = useState(null);
    const {
        isOpen: isModalSaveOpen,
        onOpen: onModalSaveOpen,
        onOpenChange: onModalSaveOpenChange,
    } = useDisclosure();

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
    function handleSaveReport(name) {
        const jsonToPrint = {
            idProyecto: projectId,
            nombre: name,
            tareas: listTareas,
            idUsuarioCreador: sessionData.idUsuario,
        };

        console.log(JSON.stringify(jsonToPrint, null, 2));
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/reporte/subirReporteTareasJSON",
                jsonToPrint
            )
            .then((response) => {
                // Manejar la respuesta de la solicitud POST
                console.log("Respuesta del servidor:", response.data);
                console.log("Guardado del reporte correcto");
                router.back();
                // Realizar acciones adicionales si es necesario
            })
            .catch((error) => {
                // Manejar errores si la solicitud POST falla
                console.error("Error al realizar la solicitud POST:", error);
            });
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

                            if (tarea.tareasHijas.length > 0) {
                                recorrerTareas(tarea.tareasHijas);
                            }
                        });
                        return tareas;
                    }

                    const nuevasTareas = recorrerTareas(
                        response.data.tareasOrdenadas
                    );
                    console.log(JSON.stringify(nuevasTareas, null, 2));

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

            const fetchData = async () => {
                try {
                    // Realiza la solicitud HTTP al endpoint del router
                    const stringURL =
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                        "/api/proyecto/reporte/obtenerJSONReporteTareasXIdArchivo/" +
                        reportId;
                    console.log("URL: ", stringURL);
                    const response = await axios.get(stringURL);

                    const { tareas: mockObj } = response.data;
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
                    console.log(
                        `Datos obtenidos exitosamente:`,
                        response.data.jsonData
                    );
                    setIsLoadingSmall(false);
                } catch (error) {
                    console.error("Error al obtener datos:", error);
                    toast.error("Error al cargar reporte");
                }
            };

            fetchData();
        } else {
            router.push("/404");
        }
    }, []);
    useEffect(() => {
        console.log("listTareas: ", listTareas);
    }, [listTareas]);
    const twStyle1 = "font-semibold text-2xl text-mainHeaders";
    const [isExportLoading, setIsExportLoading] = useState(false);
    async function handlerExport() {
        const reportId = decodeURIComponent(props.params.reportId);
        try {
            setIsExportLoading(true);
            const exportURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/reporte/descargarExcelReporteTareasXIdArchivo";

            const response = await axios.post(
                exportURL,
                {
                    idArchivo: reportId,
                },
                {
                    responseType: "blob", // Important for binary data
                }
            );
            const today = new Date();

            let day = today.getDate();
            let month = today.getMonth() + 1;
            let year = today.getFullYear();

            day = day < 10 ? "0" + day : day;
            month = month < 10 ? "0" + month : month;

            // Create the formatted date string
            let formattedDate = `${day}_${month}_${year}`;

            const fileName =
                projectName.split(" ").join("") + "_" + formattedDate + ".xlsx";
            console.log(fileName);
            saveAs(response.data, fileName);

            setIsExportLoading(false);
            toast.success("Se exporto el cronograma con exito");
        } catch (error) {
            setIsExportLoading(false);
            toast.error("Error al exportar reporte cronograma");
            console.log(error);
        }
    }
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
                        onClick={() => onModalSaveOpen()}
                    >
                        Guardar reporte
                    </Button>
                )}
                {isNewReport === false && (
                    <Button
                        color="success"
                        className="text-white font-semibold"
                        startContent={<ExportIcon />}
                        onPress={async () => {
                            await handlerExport();
                        }}
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
            <ModalSave
                isOpen={isModalSaveOpen}
                onOpenChange={onModalSaveOpenChange}
                guardarReporte={async (name) => {
                    return await handleSaveReport(name);
                }}
                tipo="Tareas"
            />
        </div>
    );

    function handleSetSelectedTask(task) {
        console.log(" SELECCIONAD LA TAREA " + JSON.stringify(task, null, 2));
        setSelectedTask(task);
    }
}
export default reporteTareas;
