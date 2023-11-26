import { Button, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";
import { v4 } from "uuid";

function PlusIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
}

function DeleteIcon() {
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
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );
}

function AdditionalField({
    editState,
    field,
    deleteField,
    onTitleChange,
    onDescriptionChange,
}) {
    return (
        <div className="flex flex-col gap-0 p-3 border border-slate-200 rounded-lg shadow-md">
            {editState ? (
                <div className="flex flex-row justify-between items-center gap-3">
                    <Textarea
                        variant="bordered"
                        minRows={1}
                        value={field.titulo}
                        onChange={(e) => {
                            onTitleChange(e.target.value);
                        }}
                        classNames={{ input: "text-lg font-medium" }}
                    />
                    <div
                        className="rounded-md bg-slate-200 stroke-slate-400 p-1 hover:stroke-white hover:bg-red-500 transition-colors duration-[500ms] ease-in cursor-pointer"
                        onClick={deleteField}
                    >
                        <DeleteIcon />
                    </div>
                </div>
            ) : (
                <p className="font-medium text-lg">{field.titulo}</p>
            )}
            <Textarea
                variant={editState === true ? "bordered" : "flat"}
                readOnly={!editState}
                minRows={2}
                value={field.descripcion}
                onChange={(e) => {
                    onDescriptionChange(e.target.value);
                }}
            />
        </div>
    );
}

//must recieve an edit state
//if edit, pop a delete button togetther with an edit title

//main editor llamara a query con el parametro del id de la linea
//trayendo los campos solo de ese id

function ListAdditionalFields({ editState, baseFields, setBaseFields }) {
    return (
        <div className="flex flex-col gap-2">
            {baseFields.length === 0 ? (
                <div className="pt-4 flex justify-center text-[#b3b3b3] ">No ha creado campos adicionales</div>
            ) : (
                baseFields.map((field) => {
                    return (
                        <AdditionalField
                            key={field.idCampoAdicional}
                            editState={editState === null ? false : editState}
                            field={field}
                            deleteField={() => {
                                handleDeleteField(field.idCampoAdicional);
                            }}
                            onTitleChange={(newTitle) => {
                                handleTitleChange(
                                    field.idCampoAdicional,
                                    newTitle
                                );
                            }}
                            onDescriptionChange={(newDescription) => {
                                handleDescriptionChange(
                                    field.idCampoAdicional,
                                    newDescription
                                );
                            }}
                        />
                    );
                })
            )}
            {editState === true ? (
                <div className="flex flex-row justify-center py-6">
                    <Button
                        endContent={<PlusIcon />}
                        color="warning"
                        className="font-semibold text-white"
                        onPress={() => {
                            handleAddNewField();
                        }}
                    >
                        Agrega un nuevo campo
                    </Button>
                </div>
            ) : null}
        </div>
    );

    function handleDescriptionChange(idCampo, newDescription) {
        const updatedList = baseFields.map((field) => {
            if (field.idCampoAdicional === idCampo) {
                return { ...field, descripcion: newDescription };
            }
            return field;
        });
        setBaseFields(updatedList);
    }

    function handleTitleChange(idCampo, newTitle) {
        const updatedList = baseFields.map((field) => {
            if (field.idCampoAdicional === idCampo) {
                return { ...field, titulo: newTitle };
            }
            return field;
        });
        setBaseFields(updatedList);
    }

    function handleDeleteField(idCampo) {
        const tempList = baseFields.filter(
            (field) => field.idCampoAdicional !== idCampo
        );
        setBaseFields(tempList);
    }

    function handleAddNewField() {
        const newField = {
            idCampoAdicional: v4(), //esto genera random ids que son basicamente imposibles de replicar
            titulo: "Título del campo ",
            descripcion: "Descripción detallada del campo ",
        };
        const tempList = [...baseFields, newField];

        setBaseFields(tempList);
    }
}
export default ListAdditionalFields;


export function getAdditionalFields(
    idLineaAsociada,
    idHerramienta,
    setList,
    actionsAfter
) {
    const url =
        process.env.NEXT_PUBLIC_BACKEND_URL +
        "/api/proyecto/camposAdicionales/listarCamposAdicionales";
    axios
        .post(url, {
            idLineaAsociada: idLineaAsociada,
            idHerramienta: idHerramienta,
        })
        .then(function (response) {
            console.log(response);
            setList(response.data.camposAdicionales);
            actionsAfter(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function registerAdditionalFields(
    listFields,
    idLineaAsociada,
    idHerramienta,
    tipoInput,
    actionsAfter
) {
    const url =
        process.env.NEXT_PUBLIC_BACKEND_URL +
        "/api/proyecto/camposAdicionales/registrarCamposAdicionales";
    axios
        .post(url, {
            listaCampos: listFields,
            idLineaAsociada: idLineaAsociada,
            idHerramienta: idHerramienta,
            tipoInput: tipoInput,
        })
        .then(function (response) {
            actionsAfter(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}

export async function AsyncRegisterAdditionalFields(
    listFields,
    idLineaAsociada,
    idHerramienta,
    tipoInput,
    actionsAfter
){
    try{
        const url =
        process.env.NEXT_PUBLIC_BACKEND_URL +
        "/api/proyecto/camposAdicionales/registrarCamposAdicionales";
        const response = await axios.post(url, {
            listaCampos: listFields,
            idLineaAsociada: idLineaAsociada,
            idHerramienta: idHerramienta,
            tipoInput: tipoInput,
        });

        await actionsAfter(response);
    }catch(e){
        console.log(error);
    }
}