"use client";
import { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import CardItemRetro from "./CardItemRetro";

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

function ColumnRetro({ columnState, state }) {
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
    const [itemValue, setItemValue] = useState("");

    const addItem = () => {
        setItemsList([...itemsList, itemValue]);
        setItemValue("");
    };

    return (
        <div className={"flex-1 flex flex-col " + twStyle1}>
            <p className="text-white py-7 flex justify-center font-semibold text-3xl">
                {title}
            </p>
            <div className="bg-white flex flex-row py-3 pr-2  gap-2 items-center">
                <Button
                    isIconOnly
                    aria-label="Add"
                    className="bg-white"
                    onPress={addItem}
                >
                    <PlusIcon />
                </Button>
                {state === false ? (
                    <p className="text-slate-500">
                        Escribe tu idea aqui y presiona enter
                    </p>
                ) : (
                    <Input
                        className="text-slate-500"
                        variant="underlined"
                        placeholder="Escribe tu idea aqui y presiona enter"
                        value={itemValue}
                        onValueChange={setItemValue}
                    />
                )}
            </div>
            <div className="bg-gray-300 flex-1 flex">
                {itemsList.length === 0 ? (
                    <p className="text-center">
                        Prueba escribiendo una retrospectiva en la barra
                        superior para que figure aquí
                    </p>
                ) : (
                    <div>
                        {itemsList.map((item) => (
                            <CardItemRetro item={item}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
export default ColumnRetro;
