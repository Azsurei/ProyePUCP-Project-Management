import { useState } from "react";
import TrashIcon from "./TrashIcon";
import "@/styles/dashboardStyles/projectStyles/kanbanStyles/KanbanBoard.css";

function TaskCard({ task, deleteTask, updateTask }) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false);
    };

    if (editMode) {
        return (
            <div
                className="bg-white p-2.5 h-[100px]
        min-h-[100px] items-center flex text-left rounded-xl
        hover:ring-2 hover:ring-inset hover:ring-rose-500
        cursor-grab relative TaskContainerCard"
            >
                <textarea className="
                TaskContainerCard
                h-[90%]
                w-full
                resize-none
                border-none
                rounded
                bg-transparent
                text-black focus:outline-none
                "
                value={task.content}
                autoFocus
                placeholder="Task content here"
                onBlur={toggleEditMode}             //aqui y en onKeyDown deberiamos actualizar el contenido en la DB
                onKeyDown={e => {
                    if(e.key === "Enter" && !e.shiftKey)toggleEditMode();
                }}
                onChange={e => updateTask(task.id, e.target.value)}></textarea>
            </div>
        );
    }

    return (
        <div
            onClick={toggleEditMode}
            className="TaskContainerCard bg-white p-2.5 h-[100px]
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
            <p className="
                my-auto h-[90%] w-full overflow-y-auto overflow-x-auto whitespace-pre-wrap TaskContainerCard
            ">
                {task.content}
            </p>
            {mouseIsOver && (
                <button
                    onClick={() => {
                        deleteTask(task.id);
                    }}
                    className="stroke-black absolute right-4 top-1/2 
                                -translate-y-1/2 bg-slate-100 p-1 rounded opacity-60 hover:opacity-100"
                >
                    <TrashIcon />
                </button>
            )}
        </div>
    );
}

export default TaskCard;
