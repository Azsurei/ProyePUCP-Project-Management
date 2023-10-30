import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "./TrashIcon";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
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
}) {
    const [editMode, setEditMode] = useState(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
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
        bg-slate-100
        opacity-40
        border-2
        border-rose-500
        w-[350px]
        h-[500px]
        max-h-[500px]
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
    bg-slate-100
    w-[350px]
    h-[500px]
    max-h-[500px]
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
                    setEditMode(true);
                }}
                className="
            bg-white
            text-md
            h-[60px]
            cursor-grab
            rounded-md
            rounded-b-none
            p-3
            font-bold
            border-slate-100
            border-4
            flex
            items-center
            justify-between"
            >
                <div className="flex gap-2 items-center">
                    <div
                        className="
                    flex
                    justify-center
                    items-center
                    bg-slate-100
                    px-2
                    py-1
                    text-sm
                    rounded-full
                    "
                    >
                        0
                    </div>
                    {!editMode && column.title}
                    {editMode && (
                        <input
                            className="bg-white focus:border-rose-500 border rounded outline-none px-2"
                            value={column.title}
                            onChange={(e) =>
                                updateColumn(column.id, e.target.value)
                            }
                            autoFocus
                            onBlur={() => {
                                setEditMode(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                setEditMode(false);
                            }}
                        />
                    )}
                </div>
                <button
                    onClick={() => {
                        deleteColumn(column.id);
                    }}
                    className="
                stroke-gray-500
                hover:stroke-black
                hover: bg-slate-100
                rounded
                px-1
                py-1"
                >
                    <TrashIcon />
                </button>
            </div>

            {/****************Main content **************/}
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                    />
                ))}
            </div>

            {/****************Main footer **************/}
            <button
                className="flex gap-2 items-center border-slate-100 border-2 rounded-md p-4
            border-x-slate-100 hover:bg-white hover:text-rose-500 active:bg-slate-50"
                onClick={() => {
                    createTask(column.id);
                }}
            >
                <PlusIcon /> Add task
            </button>
        </div>
    );
}

export default ColumnContainer;