import { Input } from "@nextui-org/react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
axios.defaults.withCredentials = true;

function TrashIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
        </svg>
    );
}

export default function CardItemRetro({ item, deleteHandler, state, setNewValueDescription }) {
    const [editLineState, setEditLineState] = useState(false);
    const [newDesc, setNewDesc] = useState(item.descripcion);

    return (
        <div className="flex flex-row justify-between bg-white rounded-md w-full py-2 px-2 pl-4 items-center gap-1">
            <div className="flex flex-row gap-3 items-center  flex-1 ">
                {/* <div className="rounded-[100%] bg-mainUserIcon w-[40px] h-[40px] min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px]  flex items-center justify-center flex-1">
                    RP
                </div> */}

                {editLineState === false && (
                    <p
                        className="flex flex-1 break-words max-h-[100px]"
                        onClick={() => {
                            if(state === true){
                                setEditLineState(true);
                            }
                        }}
                    >
                        {item.descripcion}
                    </p>
                )}
                {editLineState === true && (
                    <Input
                        className="text-slate-500"
                        variant="underlined"
                        placeholder=""
                        aria-label="tst"
                        value={newDesc}
                        onValueChange={setNewDesc}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (newDesc === "") {
                                    setEditLineState(false);
                                    setNewDesc(item.descripcion);
                                } else {
                                    //actualizamos nombre
                                    console.log("must update");
                                    setNewValueDescription(newDesc);
                                    handleUpdate();

                                    setEditLineState(false);
                                    toast.success("Se actualizo el nombre con exito" , {position: "top-center"});
                                }
                            }
                        }}
                        onBlur={() => {
                            setEditLineState(false);
                            setNewDesc(item.descripcion);
                        }}
                    />
                )}
            </div>

            {state === true && (
                <button
                    onClick={deleteHandler}
                    className="
                        bg-columnBackgroundColor
                        stroke-gray-500
                        transition-colors duration-75
                        hover:stroke-black
                        dark:hover:stroke-white
                        rounded
                        px-1
                        py-1
                        min-h-[40px]
                        max-w-[50px]
                        "
                >
                    <TrashIcon />
                </button>
            )}
        </div>
    );

    async function handleUpdate() {
        try {
            const updItemURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/retrospectiva/modificarItemLineaRetrospectiva";

            const updItemObj = {
                idItemLineaRetrospectiva: item.idItemLineaRetrospectiva,
                descripcion: newDesc,
            };


            const updItemResp = await axios.put(updItemURL, updItemObj);


            console.log("Se registro el item con exito");
            return 1;
        } catch (error) {
            console.error("Error al obtener los datos: ", error);
            return 0;
        }
    }
}
