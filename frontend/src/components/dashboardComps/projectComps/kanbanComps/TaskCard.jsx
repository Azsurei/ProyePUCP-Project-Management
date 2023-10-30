import { useState } from "react";
import TrashIcon from "./TrashIcon";

function TaskCard({ task }) {
    const [mouseIsOver, setMouseIsOver] = useState(false);

    return (
        <div
            className="bg-white p-2.5 h-[100px]
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
            {task.content}
            {mouseIsOver && (
                <button
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
