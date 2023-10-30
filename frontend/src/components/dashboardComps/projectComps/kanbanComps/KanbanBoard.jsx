"use client";
import { useMemo, useState } from "react";
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

export default function KanbanBoard() {
    const [columns, setColumns] = useState([]);
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
    //has id and title
    const [tasks, setTasks] = useState([]);
    //has id, columnId, content

    const [activeColumn, setActiveColumn] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3,
            },
        })
    );

    return (
        <div
            className="generalKanbanCompCont
    m-auto
    flex
    min-h-full
    flex-1
    w-full
    items-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
    border border-red-500"
        >
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                <div className="m-auto flex gap-4">
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((column) => (
                                <ColumnContainer
                                    key={column.id}
                                    column={column}
                                    deleteColumn={deleteColumn}
                                    updateColumn={updateColumn}
                                    createTask={createTask}
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
                        <PlusIcon /> Add Column
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
                            ></ColumnContainer>
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
            content: `Task ${tasks.length + 1}`,
        };

        console.log(newTask);

        setTasks([...tasks, newTask]);
    }

    function createNewColumn() {
        const columnToAdd = {
            id: generateId(), //a cambiar en futuro
            title: `Column ${columns.length + 1}`,
        };

        console.log(columnToAdd);

        setColumns([...columns, columnToAdd]);
    }

    function deleteColumn(id) {
        const filteredColumn = columns.filter((col) => col.id != id);
        setColumns(filteredColumn);
    }

    function updateColumn(id, title) {
        const newColumns = columns.map((col) => {
            if (col.id !== id) return col;
            return { ...col, title: title };
        });

        setColumns(newColumns);
    }

    function onDragStart(event) {
        console.log("DRAG STR", event);
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }
    }

    function onDragEnd(event) {
        const { active, over } = event;
        if (!over) return; //not draggin over smting valid

        const activeColumnId = active.id;
        const overColumnId = over.id;
        if (activeColumnId === overColumnId) return;

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

function generateId() {
    return Math.floor(Math.random() * 100001);
}
