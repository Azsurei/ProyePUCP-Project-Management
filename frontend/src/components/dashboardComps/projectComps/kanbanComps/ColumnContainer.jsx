import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "./TrashIcon";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "./PlusIcon";
import TaskCard from "./TaskCard";

function ColumnContainer({
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
    updateColumnNameDB,
    openViewTask,
}) {
    const [editMode, setEditMode] = useState(false);

    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.idTarea);
    }, [tasks]);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.idColumnaKanban,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="
        bg-slate-100 dark:bg-black
        opacity-40
        border-2
        border-rose-500
        w-[350px]
        h-[100%]
        min-h-[100%]
        rounded-md
        flex
        flex-col
        "
            ></div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="
            ColumnContainer
            bg-columnBackgroundColor
            w-[350px]
            h-full
            min-h-full
            rounded-md
            flex
            flex-col
            "
        >
            {/****************Column title **************/}
            <div
                {...attributes}
                {...listeners}
                onClick={() => {
                    if(column.idColumnaKanban !== 0 ){
                        setEditMode(true);
                    }
                }}
                className="
                ColumnContainer
                bg-taskBackgroundColor
                text-md
                h-[60px]
                cursor-grab
                rounded-md
                rounded-b-none
                p-3
                font-bold
                border-columnBackgroundColor
                border-4
                flex
                items-center
                justify-between"
            >
                <div className="flex gap-2 items-center">
                    <div
                        className="
                    ColumnContainer
                    flex
                    justify-center
                    items-center
                    bg-columnBackgroundColor
                    px-2
                    py-1
                    text-sm
                    rounded-full
                    "
                    >
                        {tasks.length}
                    </div>
                    {!editMode && column.nombre}
                    {editMode && (
                        <input
                            className="ColumnContainer bg-white focus:border-rose-500 border rounded outline-none px-2"
                            value={column.nombre}
                            onChange={(e) =>
                                updateColumn(
                                    column.idColumnaKanban,
                                    e.target.value
                                )
                            }
                            autoFocus
                            onBlur={() => {
                                setEditMode(false);
                                updateColumnNameDB(
                                    column.idColumnaKanban,
                                    column.nombre
                                );
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                setEditMode(false);
                                updateColumnNameDB(
                                    column.idColumnaKanban,
                                    column.nombre
                                );
                            }}
                        />
                    )}
                </div>
                {column.idColumnaKanban !== 0 && (
                    <button
                        onClick={() => {
                            deleteColumn(column.idColumnaKanban, column.nombre);
                        }}
                        className="
                        bg-columnBackgroundColor
                        stroke-gray-500
                        transition-colors duration-75
                        hover:stroke-black
                        dark:hover:stroke-white
                        rounded
                        px-1
                        py-1"
                    >
                        <TrashIcon />
                    </button>
                )}
            </div>

            {/****************Main content **************/}
            <div className="ColumnContainer ColumnContentTasks flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.idTarea}
                            task={task}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                            openViewTask={openViewTask}
                        />
                    ))}
                </SortableContext>
            </div>

            {/****************Main footer **************/}
            <button
                className="ColumnContainer flex gap-2 items-center border-columnBackgroundColor border-4 rounded-md p-4
                 hover:text-rose-500 hover:bg-taskBackgroundColor"
                onClick={() => {
                    createTask(column.idColumnaKanban);
                }}
            >
                <PlusIcon /> Añadir tarea
            </button>
        </div>
    );
}

export default ColumnContainer;
