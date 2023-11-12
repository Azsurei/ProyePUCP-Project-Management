"use client";
import { useState } from "react";
import { Input, Button, useDisclosure } from "@nextui-org/react";
import CardItemRetro from "./CardItemRetro";
import { toast } from "sonner";
import axios from "axios";
import ModalDeleteItem from "./ModalDeleteItem";
axios.defaults.withCredentials = true;

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

function ColumnRetro({
    columnState,
    state,
    idLineaRetrospectiva,
    baseItemsList,
}) {
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

    const [itemsList, setItemsList] = useState(baseItemsList);
    const [itemValue, setItemValue] = useState("");

    const [itemToDelete, setItemToDelete] = useState(null);

    const {
        isOpen: isModalDeleteOpen,
        onOpen: onModalDeleteOpen,
        onOpenChange: onModalDeleteOpenChange,
    } = useDisclosure();

    return (
        <div className={"w-1/3 flex flex-col overflow-y-auto " + twStyle1}>
            <ModalDeleteItem
                isOpen={isModalDeleteOpen}
                onOpenChange={onModalDeleteOpenChange}
                idItemLineRetro={itemToDelete}
                removeFromList={()=>{
                    removeFromList();
                }}
            />


            <p className="text-white py-7 flex justify-center font-semibold text-3xl">
                {title}
            </p>
            <div className="bg-white flex flex-row py-3 pr-2  gap-2 items-center">
                <Button
                    isIconOnly
                    aria-label="Add"
                    className="bg-white"
                    onPress={addItem} // Trigger addItem when the plus icon is clicked
                    isDisabled={state===false}
                >
                    <PlusIcon />
                </Button>
                {state === false ? (
                    <p className="text-slate-500">
                        Presiona Editar para agregar items
                    </p>
                ) : (
                    <Input
                        className="text-slate-500"
                        variant="underlined"
                        placeholder="Escribe tu idea aqui"
                        value={itemValue}
                        onValueChange={setItemValue}
                        // onBlur removed to keep the value when clicking outside
                    />
                )}
            </div>
            <div className="bg-gray-300 flex-1 flex flex-col p-1 gap-1">
                {itemsList.length === 0 ? (
                    <p className="text-center border h-full w-full flex justify-center items-center text-slate-500 font-[Montserrat]">
                        Prueba escribiendo una retrospectiva en la barra
                        superior para que figure aquí
                    </p>
                ) : (
                    <>
                        {itemsList.map((item) => (
                            <CardItemRetro
                                key={item.idItemLineaRetrospectiva}
                                item={item}
                                deleteHandler = {()=>{
                                    onModalDeleteOpen();
                                    setItemToDelete(item.idItemLineaRetrospectiva);
                                }}
                                state={state}
                                setNewValueDescription = {(newDesc)=>{
                                    updateMainList(item.idItemLineaRetrospectiva,newDesc);
                                }}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );

    function updateMainList(idItem, newDesc){
        const newItemsList = itemsList.map((item)=>{
            return{
                ...item,
                descripcion: item.idItemLineaRetrospectiva === idItem ? newDesc: item.descripcion,
            };
        });
        setItemsList(newItemsList);
    }

    function removeFromList(){
        const newItemsList = itemsList.filter(item => item.idItemLineaRetrospectiva !== itemToDelete);
        setItemsList(newItemsList);
    }

    async function addItem() {
        // Check if the input field is not empty
        if (itemValue.trim() === "") {
            // Optionally show a message or handle the empty input scenario
            toast.error("Por favor, ingrese un item a agregar");
            return;
        }

        // Continue with the existing addItem logic
        const regResult = await handleRegisterItem();
        if (regResult === 1) {
            setItemValue("");
            toast.success("Se registro el item con exito");
        } else {
            toast.error("Error al registrar item");
        }

    }

    async function handleRegisterItem() {
        try {
            const newItemURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/retrospectiva/insertarItemLineaRetrospectiva";

            const newItemObj = {
                idLineaRetrospectiva: idLineaRetrospectiva,
                idCriterioRetrospectiva: columnState,
                descripcion: itemValue,
            };

            console.log(JSON.stringify(newItemObj, null, 2));

            const insertItemResponse = await axios.post(newItemURL, newItemObj);
            console.log(
                "respuesta de server => " +
                    JSON.stringify(
                        insertItemResponse.data.idItemLineaRetrospectiva
                    )
            );

            const newItem = {
                idItemLineaRetrospectiva:
                    insertItemResponse.data.idItemLineaRetrospectiva,
                descripcion: itemValue,
            };
            setItemsList([...itemsList, newItem]);

            console.log("Se registro el item con exito");
            return 1;
        } catch (error) {
            console.error("Error al obtener los datos: ", error);
            return 0;
        }
    }
}
export default ColumnRetro;
