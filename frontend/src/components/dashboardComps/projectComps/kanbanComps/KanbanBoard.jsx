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
axios.defaults.withCredentials = true;

export default function KanbanBoard({projectId}) {

    const [stateWhatsHappening, setStateWhatsHappening] = useState("");

    const [columns, setColumns] = useState([]);
    //inicializamos columnas con aquellas cuyas tareas sean null

    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
    //has id and title
    const [tasks, setTasks] = useState([]);
    //has id, columnId, content

    const [activeColumn, setActiveColumn] = useState(null);
    const [activeTask, setActiveTask] = useState(null);

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
                    id: generateId(), //a cambiar en futuro
                    title: `Tareas`,
                };
                setColumns([...columns, columnTareas]);
                setStateWhatsHappening("se asignaron");
                console.log("hello");

                console.log(response.data.data);
                //console.log(response.data.message);
                //console.log("Conexion correcta");
                
            })
            .catch(function (error) {
                console.log(error);
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
            <p className="w-[100px]">{stateWhatsHappening}</p>
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
                                    key={column.id}
                                    column={column}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    tasks={tasks.filter(
                                        (task) => task.columnId === column.id
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
                                tasks={tasks.filter(
                                    (task) => task.columnId === activeColumn.id
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
        </div>
    );

    function createTask(columnId) {
        const newTask = {
            id: generateId(),
            columnId: columnId,
            content: `Tarea ${tasks.length + 1}`,
        };

        console.log(newTask);

        setTasks([...tasks, newTask]);
    }

    function deleteTask(taskId) {
        const newTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(newTasks);
    }

    function updateTask(id, content) {
        const newTasks = tasks.map((task) => {
            if (task.id !== id) return task;
            return { ...task, content: content };
        });

        setTasks(newTasks);
    }

    function createNewColumn() {
        const columnToAdd = {
            id: generateId(), //a cambiar en futuro
            title: `Columna ${columns.length + 1}`,
        };

        console.log(columnToAdd);

        setColumns([...columns, columnToAdd]);
    }

    function deleteColumn(id) {
        const filteredColumn = columns.filter((col) => col.id != id);
        setColumns(filteredColumn);

        const newTasks = tasks.filter((t) => t.columnId !== id);
        setTasks(newTasks);
    }

    function updateColumn(id, title) {
        const newColumns = columns.map((col) => {
            if (col.id !== id) return col;
            return { ...col, title: title };
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
            return;
        }
    }

    function onDragEnd(event) {
        setStateWhatsHappening("entraste a onDragEnd");
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return; //not draggin over smting valid

        const isActiveAColumn = active.data.current?.type === "Column";
        const activeColumnId = active.id;
        const overColumnId = over.id;
        if (activeColumnId === overColumnId) return;

        if(isActiveAColumn){
            setColumns((columns) => {
                const activeColumnIndex = columns.findIndex(
                    (col) => col.id === activeColumnId
                );
                const overColumnIndex = columns.findIndex(
                    (col) => col.id === overColumnId
                );
    
                return arrayMove(columns, activeColumnIndex, overColumnIndex);
            });
        }
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


        setStateWhatsHappening("entraste a onDragOver con isActiveATask = "+isActiveATask+" y isOverATask = "+isOverATask);

        if (!isActiveATask) return;

        //Im dropping a task over another task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                //hacemos el switch de posiciones REPENSAR PARA BD (Se deberia basar en un nuevo atributo llamado POSITION o algo asi)
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                tasks[activeIndex].columnId = tasks[overIndex].columnId;

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";

        setStateWhatsHappening("entraste a onDragOver con isActiveATask = "+isActiveATask+" y isOverAColumn = "+isOverAColumn);

        //im dropping a task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);

                tasks[activeIndex].columnId = overId;

                return arrayMove(tasks, activeIndex, activeIndex); //triggers rerender
            });
        }
    }
}

function generateId() {
    return Math.floor(Math.random() * 100001);
}
