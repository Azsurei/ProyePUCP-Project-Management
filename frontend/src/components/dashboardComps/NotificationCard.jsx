//tipos de notificaciones
//tareas asignadas
//limites de presupuestos
//nuevas actas de reunion con ellos incluidos de participantes
//que mas?

import {
    dbDateToDisplayDate,
    inputDateToDisplayDate,
} from "@/common/dateFunctions";
import { Spinner } from "@nextui-org/react";
import { useState } from "react";

function TimeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 min-w-7 min-h-7"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
}

function GroupIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 min-w-7 min-h-7"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
        </svg>
    );
}

function MoneyIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 min-w-7 min-h-7"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
}

function TaskIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 min-w-7 min-h-7"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
            />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-full h-full"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
        </svg>
    );
}

function NotificationCard({ type, campoAdicional, handleDelete }) {
    const [isLoading, setIsLoading] = useState(false);
    const msgTxtTask =
        'Te han asignado una nueva tarea "' + campoAdicional + '". ';
    const msgTxtMoney = "Estas por superar el limite de presupuesto. ";
    const msgActa =
        "Tienes una nueva reunion agendada el " +
        inputDateToDisplayDate(campoAdicional) +
        ". ";
    const msgTxtTaskAlert = "Se acerca la fecha de entrega de 1 tarea ";
    return (
        <div className="border dark:border-slate-600 flex flex-row items-center px-2 py-3 rounded-md gap-2 cursor-pointer shadow-sm">
            {type === 1 && <TaskIcon />}
            {type === 2 && <MoneyIcon />}
            {type === 3 && <GroupIcon />}
            {type === 4 && <TimeIcon />}
            <div className="font-medium font-[Montserrat] flex-1">
                {type === 1 && msgTxtTask}
                {type === 2 && msgTxtMoney}
                {type === 3 && msgActa}
                {type === 4 && msgTxtTaskAlert}
                <span className="text-primary underline">Ver mas</span>
            </div>
            {isLoading === false && (
                <div
                    className="bg-slate-200 dark:bg-slate-800 p-[.3rem] rounded-lg stroke-slate-500 hover:stroke-black dark:hover:stroke-white 
                transition-colors duration-75 ease-in
                min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] w-[32px] h-[32px]"
                    onClick={() => {
                        setIsLoading(true);
                        handleDelete();
                    }}
                >
                    <TrashIcon />
                </div>
            )}
            {isLoading === true && (
                <div
                    className="bg-slate-200 dark:bg-slate-800 p-[.3rem] rounded-lg stroke-slate-500 hover:stroke-black dark:hover:stroke-white 
                transition-colors duration-75 ease-in
                min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] w-[32px] h-[32px]"
                    onClick={() => {
                        console.log("ya no puedes hacer nada");
                    }}
                >
                    <Spinner size="sm" color="default" />
                </div>
            )}
        </div>
    );
}
export default NotificationCard;
