import React from "react";
import { useEffect, useState } from "react";
import "@/styles/dashboardStyles/projectStyles/productBacklog/PopUpEpica.css";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { Input, Button } from "@nextui-org/react";
import "@/styles/dashboardStyles/projectStyles/productBacklog/LisEpic.css";
import { Toaster, toast } from "sonner";

export const UserCardsContext = React.createContext();

export default function PopUpRolEquipo({
    modal,
    toggle,
    handleAddRoles,
    initialListRoles,
    ListComps,
}) {
    const [listRoles, setListRoles] = useState(initialListRoles);
    const [newRolName, setNewRolName] = useState("");
    const [addErrorRol, setAddErrorRol] = useState("");
    const [addRol, setAddRol] = useState(false);

    const handleInsertRol = () => {
        setNewRolName("");
        handleAddRoles(listRoles);
        toggle();
    };

    const EliminateRoles = (rol) => {
        const isRolInUse = ListComps.some((equipo) => {
            return equipo.participantes.some((participante) => participante.nombreRol === rol.nombreRol);
        });
        if (isRolInUse) {
            toast.error("No se puede eliminar el rol porque está en uso.",{ position: "bottom-left" });
        } else {
            setListRoles((prevRoles) => {
                return prevRoles.filter((role) => role.idRolEquipo !== rol.idRolEquipo);
            });
        }
    };

    function generateId() {
        return Math.floor(Math.random() * 100001);
    }

    return (
        modal && (
            <div className="popUp" style={{ animation: "droptop .3s linear" }}>
                <div onClick={toggle} className="overlay"></div>
                <div className="containerRolEquipoPrincipal">
                    {/*HEADER*/}
                    <div className="w-full">
                        <div className="buscarEpic">
                            Listado de Roles por Equipo
                        </div>
                        <div className="flex w-full gap-2 mt-2 items-center">
                            {/*No modifiques este boton, ya esta bien*/}
                            <Input
                                variant="bordered"
                                placeholder="Ingrese un rol"
                                className="w-4/5"
                                value={newRolName}
                                onValueChange={setNewRolName}
                            />
                            <Button
                                color="primary"
                                endContent={<PlusIcon />}
                                className="btnAddEpic"
                                onClick={() => {
                                    if (newRolName.trim() === "") {
                                        toast.error(
                                            "El nombre del rol no puede estar vacío.",
                                            { position: "bottom-left" }
                                        );
                                    } else if (
                                        listRoles.some(
                                            (rol) =>
                                                rol.nombreRol === newRolName
                                        )
                                    ) {
                                        toast.error(
                                            "El nombre del rol ya existe en la lista.",
                                            { position: "bottom-left" }
                                        );
                                    } else {
                                        // Generar un nuevo idRol único
                                        let newIdRol;
                                        do {
                                            newIdRol = generateId();
                                        } while (
                                            listRoles.some(
                                                (rol) => rol.idRolEquipo === newIdRol
                                            )
                                        );

                                        const newRol = {
                                            idRolEquipo: newIdRol,
                                            nombreRol: newRolName,
                                        };

                                        setListRoles([newRol, ...listRoles]);
                                        console.log(
                                            "La lista de roles es:",
                                            listRoles
                                        );
                                        setNewRolName(""); // Limpia el input de nombre del rol
                                    }
                                }}
                            >
                                Agregar Rol
                            </Button>
                        </div>
                    </div>
                    {/*LISTADO*/}
                    <div className="w-full flex-1 overflow-y-auto">
                        <div className="containerModal">
                            <div className="divEpics">
                                <ul className="ListEpicsProject">
                                    {listRoles.map((role, index) => {
                                        return (
                                            <li
                                                key={index}
                                                className="UserCardRol"
                                            >
                                                <div
                                                    style={{
                                                        marginTop: "12px",
                                                        marginLeft: "15px",
                                                    }}
                                                >
                                                    <p className="titleUserName">
                                                        {role.nombreRol}
                                                    </p>
                                                </div>
                                                {role.nombreRol !== "Miembro" &&
                                                    role.nombreRol !=
                                                        "Líder" && (
                                                        <img
                                                            src="/icons/icon-trash.svg"
                                                            alt="delete"
                                                            className="mb-4 cursor-pointer mr-2 absolute right-0 top-1/2 transform -translate-y-1/2"
                                                            onClick={() => {
                                                                EliminateRoles(
                                                                    role
                                                                );
                                                            }}
                                                        />
                                                    )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/*FOOTER*/}
                    {/*ya esta esto, no o modifiques */}
                    <div className="w-full flex justify-end">
                        <div className="flex gap-2">
                            <Button
                                color="danger"
                                variant="light"
                                onClick={toggle}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="bg-indigo-950 text-slate-50"
                                onClick={handleInsertRol}
                            >
                                Aceptar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
}
