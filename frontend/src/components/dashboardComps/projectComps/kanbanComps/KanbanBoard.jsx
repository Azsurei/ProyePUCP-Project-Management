"use client";
import { useEffect, useMemo, useState } from "react";
import PlusIcon from "./PlusIcon";
import ColumnContainer from "./ColumnContainer";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import "@/styles/dashboardStyles/projectStyles/kanbanStyles/KanbanBoard.css";
import TaskCard from "./TaskCard";

import axios from "axios";
import ModalTaskView from "./ModalTaskView";
import { useDisclosure } from "@nextui-org/react";
import { Toaster, toast } from "sonner";
axios.defaults.withCredentials = true;

export default function KanbanBoard({ projectId }) {
    const [stateWhatsHappening, setStateWhatsHappening] = useState("");

    const {
        isOpen: isOpenViewTask,
        onOpenChange: onOpenChangeViewTask,
        onOpen: onOpenViewTask,
    } = useDisclosure();

    const [columns, setColumns] = useState([]);
    //inicializamos columnas con aquellas cuyas tareas sean null

    const columnsId = useMemo(() => {
        const colId = columns.map((col) => col.idColumnaKanban);
        console.log(colId);
        return colId;
    }, [columns]);

    //has id and title
    const [tasks, setTasks] = useState([]);
    //has id, columnId, content

    const [activeColumn, setActiveColumn] = useState(null);
    const [activeTask, setActiveTask] = useState(null);
    const [oldColumn, setOldColumn] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        })
    );

    useEffect(() => {
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/kanban/listarColumnasYTareas/" +
            projectId;
        axios
            .get(stringURL)
            .then(function (response) {
                //añadimos columna Tareas, en la cual deben estar SOLO las tareas con idColumnaKanban = NULL
                const columnTareas = {
                    idColumnaKanban: 0,
                    idProyecto: parseInt(projectId),
                    nombre: `Tareas`,
                    posicion: 0,
                    activo: 1,
                };

                //siempre va a recibir columnas y tareas por orden de posicion
                //setColumns([columnTareas, ...response.data.data.columnas]);
                setColumns([columnTareas, ...response.data.data.columnas]);

                console.log(response.data.data);
                setTasks(response.data.data.tareas);
                //console.log(response.data.message);
                //console.log("Conexion correcta");
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Error en carga. Recarge la pagina");
            });
    }, []);

    return (
        <div
            className="generalKanbanCompCont
    m-auto
    flex
    w-full
    flex-1
    items-center
    overflow-x-auto
    overflow-y-hidden
    py-[20px]"
        >
            <p
                className="w-[100px]"
                onClick={() => {
                    console.log("COLUMNAS: " + JSON.stringify(columns));
                    console.log("TAREAS: " + JSON.stringify(tasks));
                    for (const column of columns) {
                        console.log(
                            "TAREAS DE COL " +
                                column.idColumnaKanban +
                                " => " +
                                JSON.stringify(
                                    tasks.filter(
                                        (task) =>
                                            task.idColumnaKanban ===
                                            column.idColumnaKanban
                                    ),
                                    null,
                                    2
                                )
                        );
                    }
                }}
            >
                {"Click me"}
            </p>
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <div
                    className={
                        columns.length !== 0
                            ? "flex gap-4 h-[100%] min-h-[100%]"
                            : "flex gap-1 h-[100%] min-h-[100%]"
                    }
                >
                    <div className="flex gap-8 h-full min-h-full">
                        {/*La primera columna, debe ser una llamada TAREAS, que contenga toda la lista de tareas con idColumnaKanban y posicionKanban = null*/}

                        <SortableContext items={columnsId}>
                            {columns.map((column) => (
                                <ColumnContainer
                                    key={column.idColumnaKanban}
                                    column={column}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    updateColumnNameDB={updateColumnNameDB}
                                    openViewTask={onOpenViewTask}
                                    tasks={tasks.filter(
                                        (task) =>
                                            task.idColumnaKanban ===
                                            column.idColumnaKanban
                                    )}
                                />
                            ))}
                        </SortableContext>
                    </div>
                    <button
                        onClick={() => {
                            createNewColumn();
                        }}
                        className="
                        h-[60px]
                        w-[350px]
                        min-w-[350px]
                        cursor-pointer
                        rounded-lg
                        bg-slate-100
                        border-2
                        border-white
                        p-4
                        ring-rose-500
                        hover:ring-2
                        flex
                        gap-2"
                    >
                        <PlusIcon /> Agregar columna
                    </button>
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer
                                column={activeColumn}
                                deleteColumn={deleteColumn}
                                updateColumn={updateColumn}
                                createTask={createTask}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                updateColumnNameDB={updateColumnNameDB}
                                tasks={tasks.filter(
                                    (task) =>
                                        task.idColumnaKanban ===
                                        activeColumn.idColumnaKanban
                                )}
                            ></ColumnContainer>
                        )}
                        {activeTask && (
                            <TaskCard
                                task={activeTask}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                            />
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>

            <ModalTaskView
                isOpen={isOpenViewTask}
                onOpenChange={onOpenChangeViewTask}
            />
            <Toaster richColors position="top-center"></Toaster>
        </div>
    );

    function createTask(columnId) {
        const newTask = {
            idTarea: generateId(),
            idColumnaKanban: columnId,
            content: `Tarea ${tasks.length + 1}`,
        };

        console.log(newTask);

        setTasks([...tasks, newTask]);
    }

    function deleteTask(taskId) {
        const newTasks = tasks.filter((task) => task.idTarea !== taskId);
        setTasks(newTasks);
    }

    function updateTask(id, content) {
        const newTasks = tasks.map((task) => {
            if (task.idTarea !== id) return task;
            return { ...task, content: content };
        });

        setTasks(newTasks);
    }

    function createNewColumn() {
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/kanban/crearColumna";
        axios
            .post(stringURL, {
                idProyecto: projectId,
                nombre: `Columna ${columns.length + 1}`,
            })
            .then(function (response) {
                const columnToAdd = {
                    idColumnaKanban: response.data.columnaId, //a cambiar en futuro
                    idProyecto: parseInt(projectId),
                    nombre: `Columna ${columns.length + 1}`,
                    posicion: columns.length - 1,
                    activo: 1,
                };
                setColumns([...columns, columnToAdd]);

                const str =
                    "Columna " +
                    `Columna ${columns.length + 1}` +
                    " registrada";
                toast.success(str);
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Error al crear columna");
            });
    }

    function deleteColumn(id, name) {
        const filteredColumn = columns.filter(
            (col) => col.idColumnaKanban != id
        );
        setColumns(filteredColumn);

        deleteColumnDB(id, name);

        //sacamos el max posicionKanban de columna 0.
        const tareasCol0 = tasks.filter((task) => task.idColumnaKanban === 0);
        let lastPosicionKanban = tareasCol0[tareasCol0.length - 1].posicionKanban;  //+1 para empezar en el siguiente
        console.log("Empezaremos en " + lastPosicionKanban);

        const updatedTasks = tasks.map((task) => {
            if (task.idColumnaKanban === id) {
                lastPosicionKanban++;
                registerTaskPositionChange(
                    task.idTarea,
                    lastPosicionKanban,
                    0,
                    task.sumillaTarea
                );
                return { ...task, posicionKanban: lastPosicionKanban, idColumnaKanban: 0 };
            }
            return task;
        });

        updatedTasks.sort((a, b) => {
            if (a.idColumnaKanban === b.idColumnaKanban) {
              return a.posicionKanban - b.posicionKanban;
            }
            return a.idColumnaKanban - b.idColumnaKanban;
          });

        setTasks(updatedTasks);
    }

    function updateColumn(id, title) {
        const newColumns = columns.map((col) => {
            if (col.idColumnaKanban !== id) return col;
            return { ...col, nombre: title };
        });

        setColumns(newColumns);
    }

    function onDragStart(event) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            setOldColumn(event.active.data.current.task.idColumnaKanban);
            return;
        }
    }

    function onDragEnd(event) {
        console.log("Entraste a onDragEnd");
        setActiveColumn(null);
        setActiveTask(null);
        setOldColumn(null);

        const { active, over } = event;
        if (!over) {
            //not draggin over smting valid
            console.log(
                "No estas cambiando nada, se refiltra arreglo para evitar errores"
            );
            return;
        }

        const isActiveAColumn = active.data.current?.type === "Column";
        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId && isActiveAColumn) {
            console.log("Se movio la columna, pero sigue en el mismo lugar");
            return;
        }

        if (isActiveAColumn) {
            console.log("Se reposiciono una columna");
            setColumns((columns) => {
                const activeColumnIndex = columns.findIndex(
                    (col) => col.idColumnaKanban === activeColumnId
                );
                const overColumnIndex = columns.findIndex(
                    (col) => col.idColumnaKanban === overColumnId
                );

                if (overColumnIndex === 0) return columns;

                console.log("entrando...");
                const newArray = arrayMove(
                    columns,
                    activeColumnIndex,
                    overColumnIndex
                );
                newArray.forEach((columns, index) => {
                    if (columns.posicion !== index) {
                        console.log(
                            "Haciendo cambiaso de columnas en posicion " +
                                columns.posicion +
                                " con index " +
                                index
                        );
                        registerColumnPositionChange(
                            columns.idColumnaKanban,
                            index,
                            columns.nombre
                        );
                    }
                    columns.posicion = index;
                });

                return newArray;
            });
        }

        const isActiveATask = active.data.current?.type === "Task";
        if (isActiveATask) {
            console.log(
                "Se termino de mover una tarea, reordenando si es que la posicion original de esta fue diferente a la final"
            );

            //realmente solo deberiamos reordenar la colummna original y la final (del active)
            const tareaNueva = tasks.find((task) => task.idTarea === active.id);

            console.log(
                "Columna antigua es " +
                    oldColumn +
                    " y nueva columna es " +
                    tareaNueva.idColumnaKanban
            );

            const newTasksArray = [...tasks];

            for (const task of newTasksArray) {
                const column = columns.find(
                    (col) => col.idColumnaKanban === task.idColumnaKanban
                );

                const columnTasks = tasks.filter(
                    (t) => t.idColumnaKanban === column.idColumnaKanban
                );

                const newPosition = columnTasks.findIndex(
                    (t) => t.idTarea === task.idTarea
                );

                if (
                    task.idColumnaKanban === oldColumn ||
                    task.idColumnaKanban === tareaNueva.idColumnaKanban
                ) {
                    console.log(
                        "debemos roeordenar " +
                            task.sumillaTarea +
                            " a posicion = " +
                            newPosition +
                            " de idColumnaKanban = " +
                            task.idColumnaKanban
                    );
                    registerTaskPositionChange(
                        task.idTarea,
                        newPosition,
                        task.idColumnaKanban,
                        task.sumillaTarea
                    );
                }

                task.posicionKanban = newPosition;
            }

            setTasks(newTasksArray);
        }

        //verificar el caso cuando se termina el movimiento de tarea
    }

    function onDragOver(event) {
        setStateWhatsHappening("entraste a onDragOver");

        const { active, over } = event;
        if (!over) return; //not draggin over smting valid

        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveATask) return;

        //Im dropping a task over another task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                //hacemos el switch de posiciones REPENSAR PARA BD (Se deberia basar en un nuevo atributo llamado POSITION o algo asi)
                const activeIndex = tasks.findIndex(
                    (t) => t.idTarea === activeId
                );
                const overIndex = tasks.findIndex((t) => t.idTarea === overId);

                tasks[activeIndex].idColumnaKanban =
                    tasks[overIndex].idColumnaKanban;

                const newArray = arrayMove(tasks, activeIndex, overIndex);

                return newArray;
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";

        //im dropping a task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex(
                    (t) => t.idTarea === activeId
                );

                tasks[activeIndex].idColumnaKanban = overId;

                return arrayMove(tasks, activeIndex, activeIndex); //triggers rerender
            });
        }
    }

    function registerTaskPositionChange(
        idTarea,
        posicionKanban,
        idColumnaKanban,
        sumillaTarea
    ) {
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/kanban/cambiarPosicionTarea";
        axios
            .post(stringURL, {
                idTarea: idTarea,
                posicionKanban: posicionKanban,
                idColumnaKanban: idColumnaKanban,
            })
            .then(function (response) {
                const str = "Tarea " + sumillaTarea + " movida con exito";
                toast.success(str);
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Error al modificar Kanban");
            });
    }

    function registerColumnPositionChange(idColumn, posicion, nombre) {
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/kanban/cambiarPosicionColumna";
        axios
            .post(stringURL, {
                idColumnaKanban: idColumn,
                posicion: posicion,
            })
            .then(function (response) {
                const str = "Columna " + nombre + " movida con exito";
                toast.success(str);
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Error al mover columna en Kanban");
            });
    }

    function updateColumnNameDB(idColumnaKanban, name) {
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/kanban/renombarColumna";
        axios
            .post(stringURL, {
                idColumnaKanban: idColumnaKanban,
                nombre: name,
            })
            .then(function (response) {
                const str = "Columna " + name + " renombrada con exito";
                toast.success(str);
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Error al actualizar nombre de  columna");
                //falta implementar optimistic update failure
            });
    }

    function deleteColumnDB(idColumnaKanban, name){
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/kanban/eliminarColumna";
        axios
            .post(stringURL, {
                idColumnaKanban: idColumnaKanban
            })
            .then(function (response) {
                const str = "Columna " + name + " eliminada";
                toast.success(str);
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Error al eliminar columna columna");
                //falta implementar optimistic update failure
            });
    }
}

function generateId() {
    return Math.floor(Math.random() * 100001);
}
