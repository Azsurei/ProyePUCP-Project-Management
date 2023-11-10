"use client";
import { useState } from "react";

function PlusIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
            />
        </svg>
    );
}

function ColumnRetro({ columnState }) {
    let twStyle1;
    let title;
    if (columnState === 1) {
        twStyle1 = "bg-green-500";
        title = "¿Qué salió bien?";
    }
    if (columnState === 2) {
        twStyle1 = "bg-red-500";
        title = "¿Qué salió mal?";
    }
    if (columnState === 3) {
        twStyle1 = "bg-yellow-500";
        title = "¿Qué vamos a hacer?";
    }

    const [itemsList, setItemsList] = useState([]);

    return (
        <div className={"flex-1 flex flex-col " + twStyle1}>
            <p className="text-white py-7 flex justify-center font-semibold text-3xl">
                {title}
            </p>
            <div className="bg-white flex flex-row py-3 px-2  gap-2">
                <PlusIcon />
                <p className="text-slate-500">Escribe tu idea aqui y presiona enter</p>
            </div>
            <div className="bg-gray-300 flex-1 flex items-center justify-center">
                <p className="text-center">
                    Prueba escribiendo una retrospectiva en la barra superior para
                    que figure aquí
                </p>
            </div>
        </div>
    );
}
export default ColumnRetro;
