"use client"

import React, { useEffect, useState } from "react";
import AcuerdosListEditableInput from "./ARListEditableInput";
import "@/styles/dashboardStyles/projectStyles/actaReunionStyles/TopicEditableList.css";

import {
    Input, Textarea,
    Card, CardHeader, CardBody, CardFooter,
} from "@nextui-org/react";


function EditableTopic(props) {

    const [mostrarAcuerdos, setMostrarAcuerdos] = useState(false);

    const toggleAcuerdos = () => {
        setMostrarAcuerdos(!mostrarAcuerdos);
    };
    console.log("Props:")
    console.log(props);

    const handleAddAcuerdo = () => {
        // Assuming that 'props.acuerdos' cannot be null or undefined.
        const nextIndex = props.acuerdos.length + 1;
        const nuevosAcuerdos = [
            ...props.acuerdos,
            {
                index: nextIndex,
                data: '',
                date: '',
                responsables: [],
            }
        ];
        props.updateAcuerdos(props.number, nuevosAcuerdos);
    };

    const handleChangeAcuerdo = (e, index) => {
        const updatedAcuerdos = props.acuerdos.map(acuerdo => {
            if (acuerdo.index === index) {
                return { ...acuerdo, data: e.target.value };
            }
            return acuerdo;
        });
        props.updateAcuerdos(props.number, updatedAcuerdos);
    };

    const handleRemoveAcuerdo = (indexToRemove) => {
        const updatedAcuerdos = props.acuerdos.filter(acuerdo => acuerdo.index !== indexToRemove);
        props.updateAcuerdos(indexToRemove, updatedAcuerdos);
    };

    const updateResponsables = (index, nuevosResponsables) => {
        const updatedAcuerdos = props.acuerdos.map(acuerdo => {
            if (acuerdo.index === index) {
                return { ...acuerdo, responsables: nuevosResponsables };
            }
            return acuerdo;
        });
        props.updateAcuerdos(props.number, updatedAcuerdos);
    };

    const handleDateChange = (e, index) => {
        const updatedAcuerdos = props.acuerdos.map(acuerdo => {
            if (acuerdo.index === index) {
                const formattedDate = e.target.value.split('T')[0];
                return { ...acuerdo, date: formattedDate };
            }
            return acuerdo;
        });
        props.updateAcuerdos(props.number, updatedAcuerdos);
    };

    return (
        <li className="EditableTopic">
            <div className="topicContainer">
                <p className="newInputEntrName">
                    Tema.
                </p>
                <div className="inputAndDeleteContainer">
                    <Textarea
                        isInvalid={false}
                        isDisabled={false}
                        //errorMessage="Este campo no puede estar vacio"
                        key={"bordered"}
                        variant={"bordered"}
                        labelPlacement="outside"
                        placeholder="Escribe aquí"
                        className="textTema col-span-12 md:col-span-6 mb-6 md:mb-0"
                        value={props.data}
                        onChange={(e) => {
                            props.handleChanges(e, props.number);
                        }}
                        minRows={1}
                        size="sm"
                        readOnly={false}
                    />
                    {props.beEditable && (
                        <img
                            src="/icons/icon-cross.svg"
                            alt="Eliminar"
                            className="iconDeleteInput"
                            onClick={() => {
                                props.handleRemove(props.number);
                            }}
                        />
                    )}
                </div>
            </div>
            <div className="flex align-center gap-3">
                <button
                    onClick={toggleAcuerdos}
                    className="btnMostrarAcuerdos"
                >
                    {mostrarAcuerdos ? "▲ Ocultar acuerdos" : "▼   Ver acuerdos"}  
                </button>
                {props.beEditable && (
                <button
                    onClick={() => {
                        setMostrarAcuerdos(true);
                        handleAddAcuerdo();
                    }}
                    className="btnMostrarAcuerdos"
                >
                    Agregar Acuerdo   
                </button>
                )}
            </div>
            
            {mostrarAcuerdos && (
            <div className="agreementsPerTopic p-2">
                <Card 
                    className="w-full"
                    shadow="none"
                    isBlurred="false">
                    <CardBody className="mt-0 py-0 pl-8">
                        <div className="agreementsContainer w-full">
                            <AcuerdosListEditableInput
                                beEditable={true}
                                handleChanges={handleChangeAcuerdo}
                                handleRemove={handleRemoveAcuerdo}
                                ListInputs={props.acuerdos}
                                participantes={props.participantes}
                                updateResponsables={updateResponsables}
                                handleDateChange={handleDateChange}
                                typeFault="acuerdos"
                                typeName="Acuerdo">
                            </AcuerdosListEditableInput>
                        </div>
                    </CardBody>
                    <CardFooter></CardFooter>
                </Card>
            </div>
            )}
        </li>
    )
}

export function TopicEditableList(props) {

    if (props.ListInputs.length === 0) {
        return <div>No cuenta con tareas</div>;
    }

    // Sort the list based on the item.data property
    const sortedListInputs = [...props.ListInputs].sort((a, b) => {
        // Assuming item.data is a string
        return a.idTemaReunion > b.idTemaReunion;
    });

    console.log('TopicEditableList');
    console.log(props);

    return (
        <ul className="ListEditableInput">
            {sortedListInputs.map((item, index) => (
                <EditableTopic
                    key={item.index} // It's better to use a unique identifier rather than array index
                    typeName={props.typeName}
                    number={item.index}
                    data={item.data}
                    handleChanges={props.handleChanges}
                    handleRemove={props.handleRemove}
                    beEditable={props.beEditable}
                    acuerdos={item.acuerdos}
                    updateAcuerdos={props.updateAcuerdos}
                    participantes={props.participantes}
                />
            ))}
        </ul>
    );
}