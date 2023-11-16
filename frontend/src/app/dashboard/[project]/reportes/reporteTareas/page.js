"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { HerramientasInfo, SmallLoadingScreen } from "../../layout";
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
axios.defaults.withCredentials = true;

export const TaskSelector = createContext();

function reporteTareas(props) {
    //herramientas necesarias para este reporte:
    //Cronograma, EDT y Sprints (deberia ser opcional este ultimo)
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

    useEffect(() => {
        setIsLoadingSmall(true);
        const tareasURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/cronograma/listarTareasXidProyectoConProgresosDetallados/" +
            projectId;
        axios
            .get(tareasURL)
            .then(function (response) {
                setListTareas(response.data.tareasOrdenadas);
                console.log(response);
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

                axios
                    .get(
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                            `/api/proyecto/backlog/listarSprintsXIdBacklogcronograma/` +
                            herramientasInfo.find(herramienta => herramienta.idHerramienta === 1).idHerramientaCreada + //id backlog
                            `/` +
                            herramientasInfo.find(herramienta => herramienta.idHerramienta === 4).idHerramientaCreada //id cronograma
                    )
                    .then((response) => {
                        console.log(response);

                        const sprintLabels = response.data.sprints
                            .filter((sprint) => sprint.idSprint !== 0)
                            .map((sprint) => {
                                return sprint.nombre;
                            });

                        console.log(
                            "SPRINT LABELS => " +
                                JSON.stringify(sprintLabels, null, 2)
                        );

                        const sprintTasksData = response.data.sprints
                            .filter((sprint) => sprint.idSprint !== 0)
                            .map((sprint) => {
                                let notStartedTasks;
                                let inProgressTasks;
                                let delayedTasks;
                                let finishedTasks;

                                notStartedTasks = sprint.tareas.filter(
                                    (tarea) => tarea.idTareaEstado === 1
                                ).length;
                                inProgressTasks = sprint.tareas.filter(
                                    (tarea) => tarea.idTareaEstado === 2
                                ).length;
                                delayedTasks = sprint.tareas.filter(
                                    (tarea) => tarea.idTareaEstado === 3
                                ).length;
                                finishedTasks = sprint.tareas.filter(
                                    (tarea) => tarea.idTareaEstado === 4
                                ).length;

                                return {
                                    notStartedTasks,
                                    inProgressTasks,
                                    delayedTasks,
                                    finishedTasks,
                                };
                            });
                        console.log(
                            "SPRINT TASK DATA => " +
                                JSON.stringify(sprintTasksData, null, 2)
                        );

                        setListSprintData({ sprintLabels, sprintTasksData });

                        //primer dataset contiene las tareas en estado = 1, todas del mismo color
                        setListSprintData({
                            labels: sprintLabels,
                            datasets: [
                                {
                                    label: "No iniciado",
                                    data: sprintTasksData.map((sprint) => {
                                        return sprint.notStartedTasks;
                                    }),
                                    backgroundColor: [
                                        "rgb(63, 63, 70)",
                                        "rgb(63, 63, 70)",
                                        "rgb(63, 63, 70)",
                                        "rgb(63, 63, 70)",
                                    ],
                                },
                                {
                                    label: "En progreso",
                                    data: sprintTasksData.map((sprint) => {
                                        return sprint.inProgressTasks;
                                    }),
                                    backgroundColor: [
                                        "rgb(0, 112, 240)",
                                        "rgb(0, 112, 240)",
                                        "rgb(0, 112, 240)",
                                        "rgb(0, 112, 240)",
                                    ],
                                },
                                {
                                    label: "Atrasado",
                                    data: sprintTasksData.map((sprint) => {
                                        return sprint.delayedTasks;
                                    }),
                                    backgroundColor: [
                                        "rgb(245, 165, 36)",
                                        "rgb(245, 165, 36)",
                                        "rgb(245, 165, 36)",
                                        "rgb(245, 165, 36)",
                                    ],
                                },
                                {
                                    label: "Finalizado",
                                    data: sprintTasksData.map((sprint) => {
                                        return sprint.finishedTasks;
                                    }),
                                    backgroundColor: [
                                        "rgb(24, 201, 100)",
                                        "rgb(24, 201, 100)",
                                        "rgb(24, 201, 100)",
                                        "rgb(24, 201, 100)",
                                    ],
                                },
                            ],
                        });

                        setIsLoadingSmall(false);
                    })
                    .catch((error) => {
                        console.error(
                            "Error al obtener los datos de sprints: ",
                            error
                        );
                        toast.error("Error al cargar reporte con sprints");
                    });
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Error al cargar reporte");
            });
    }, []);

    const twStyle1 = "font-semibold text-2xl text-mainHeaders";

    return (
        <div className="flex min-h-[1300px] flex-col p-[2.5rem] font-[Montserrat] gap-y-6 flex-1 ">
            <div className="flex flex-row justify-between items-center">
                <p className="text-4xl text-mainHeaders font-semibold">
                    Reporte de tareas
                </p>
                <Button color="warning" className="text-white">
                    Guardar reporte
                </Button>
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
                    {listSprintData !== null && (
                        <TasksGraphicView
                            chartGeneralData={listTableGenData}
                            chartSprintData={listSprintData}
                        />
                    )}
                </div>
            </div>
        </div>
    );

    function handleSetSelectedTask(task) {
        console.log(" SELECCIONAD LA TAREA " + JSON.stringify(task, null, 2));
        setSelectedTask(task);
    }
}
export default reporteTareas;
