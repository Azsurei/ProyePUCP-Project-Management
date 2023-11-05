import { useState } from "react";
import TrashIcon from "./TrashIcon";
import "@/styles/dashboardStyles/projectStyles/kanbanStyles/KanbanBoard.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function TaskCard({ task, deleteTask, updateTask, openViewTask }) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.idTarea,
        data: {
            type: "Task",
            task,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false);
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="
            opacity-30
            bg-taskBackgroundColor
            p-2.5 h-[100px]
        min-h-[100px] items-center flex text-left rounded-xl
        border-2 border-rose-500
        cursor-grab relative TaskContainerCard
            "
            >
                La tarea se moverá aqui
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={()=>{openViewTask(task.idTarea)}}
            className="TaskContainerCard 
            bg-taskBackgroundColor
            p-2.5 h-[100px]
            min-h-[100px] items-center flex text-left rounded-xl
            hover:ring-2 hover:ring-inset hover:ring-rose-500
            cursor-grab relative"
            onMouseEnter={() => {
                setMouseIsOver(true);
            }}
            onMouseLeave={() => {
                setMouseIsOver(false);
            }}
        >
            <p
                className="
                my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden 
                whitespace-pre-wrap TaskContainerCard
            "
            >
                {task.sumillaTarea}
            </p>
            {mouseIsOver && (
                <button
                    onClick={() => {
                        deleteTask(task.idTarea);
                    }}
                    className=" absolute right-4 top-1/2 
                                -translate-y-1/2 
                                bg-columnBackgroundColor 
                                stroke-gray-500
                        transition-colors duration-75
                        hover:stroke-black
                        dark:hover:stroke-white
                                p-1 
                                rounded 
                                opacity-60 
                                hover:opacity-100"
                >
                    <TrashIcon />
                </button>
            )}
        </div>
    );
}

export default TaskCard;
