import { useEffect, useState } from "react";
import TrashIcon from "./TrashIcon";
import "@/styles/dashboardStyles/projectStyles/kanbanStyles/KanbanBoard.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarGroup } from "@nextui-org/react";

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

    useEffect(() => {
        console.log("DATA TASK");
        console.log(task);
    }, []);

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
            onClick={() => {
                openViewTask(task.idTarea);
            }}
            className="TaskContainerCard 
            bg-taskBackgroundColor
            p-2.5 h-[100px]
            min-h-[100px] items-center flex text-left rounded-xl
            hover:ring-2 hover:ring-inset hover:ring-primary
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

            <AvatarGroup
                //isBordered
                max={1}
                renderCount={(count) => (
                    <Avatar
                        isBordered={false}
                        color={"primary"}
                        className="w-[35px] h-[35px] min-w-[35px] min-h-[35px] text-tiny"
                        fallback={<p className="font-[Montserrat] font-medium text-sm">+{count}</p>}
                    />
                )}
                className=" absolute bottom-1 right-1 px-1 py-1"
            >
                {task.usuarios.map((user) => {
                    return (
                        <Avatar
                            isBordered
                            color="default"
                            //as="button"
                            key={user.idUsuario}
                            className="transition-transform min-w-[35px] min-h-[35px] max-w-[35px] max-h-[35px]"
                            src={user.imgLink}
                            fallback={
                                <p className=" bg-mainUserIcon">
                                    {user.nombres[0] +
                                        (user.apellidos !== null
                                            ? user.apellidos[0]
                                            : "")}
                                </p>
                            }
                        />
                    );
                })}
            </AvatarGroup>
            {/* {mouseIsOver && (
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
            )} */}
        </div>
    );
}

export default TaskCard;
