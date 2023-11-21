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

function AdditionalField({ editState, field, deleteField }) {
    const [fieldTitle, setFieldTitle] = useState(field.titulo);
    const [fieldText, setFieldText] = useState(field.descripcion);

    return (
        <div className="flex flex-col gap-0 p-3 border border-slate-200 rounded-lg shadow-md">
            {editState ? (
                <div className="flex flex-row justify-between items-center gap-3">
                    <Textarea
                        variant="bordered"
                        minRows={1}
                        value={fieldTitle}
                        onValueChange={setFieldTitle}
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
                <p className="font-medium text-lg">{fieldTitle}</p>
            )}
            <Textarea
                variant={editState === true ? "bordered" : "flat"}
                readOnly={!editState}
                minRows={2}
                value={fieldText}
                onValueChange={setFieldText}
            />
        </div>
    );
}

//must recieve an edit state
//if edit, pop a delete button togetther with an edit title

//main editor llamara a query con el parametro del id de la linea
//trayendo los campos solo de ese id

function ListAdditionalFields({
    editState,
    baseFields,
    addBaseField,
    removeBaseField,
}) {

    return (
        <div className="flex flex-col gap-2">
            {baseFields.map((field) => {
                return (
                    <AdditionalField
                        key={field.idCampoAdicional}
                        editState={editState === null ? false : editState}
                        field={field}
                        deleteField={() => {
                            handleDeleteField(field.idCampoAdicional);
                        }}
                    />
                );
            })}
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

    function handleDeleteField(idCampo) {
        removeBaseField(idCampo);
    }

    function handleAddNewField() {
        console.log("anadiendo campo")
        const newField = {
            idCampoAdicional: v4(), //esto genera random ids que son basicamente imposibles de replicar
            titulo: "Titulo del campo ",
            descripcion: "Descripcion detallada del campo ",
        };

        addBaseField(newField);
    }
}
export default ListAdditionalFields;

export function getAdditionalFields(idLineaAsociada, idHerramienta){
        
}

export function registerAdditionalFields(idLineaAsociada, idHerramienta, listFields, actionsAfter){
    const url="laala";
    axios.post(url,{
        idLineaAsociada: idLineaAsociada,
        idHerramienta: idHerramienta,
        listaCamposAdicionales: listFields
    }).then(function(response){
        console.log(response);
        actionsAfter();
    }).catch(function(error){
        console.log(error);
    });
};
