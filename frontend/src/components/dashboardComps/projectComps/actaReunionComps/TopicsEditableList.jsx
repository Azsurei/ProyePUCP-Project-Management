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

    const handleAddAcuerdo = ()=>{
        const nuevosAcuerdos =  [
            ...props.acuerdos,
            {
                index: props.acuerdos.length + 1,
                data: '',
                date: '',
                responsables: [],
            }
        ];
        //props.setAcuerdos(newList_A);
        props.updateAcuerdos(props.number - 1, nuevosAcuerdos);
    }

    const handleChangeAcuerdo = (e, index) => {
        const updatedEntregables = [...props.acuerdos];
        updatedEntregables[index - 1].data = e.target.value;
        console.log(updatedEntregables);
        //props.setAcuerdos(updatedEntregables);
        props.updateAcuerdos(props.number - 1, updatedEntregables);
    };

    const handleRemoveAcuerdo = (index) => {
        const updatedEntregables = [...props.acuerdos];
        updatedEntregables.splice(index - 1, 1); // Remove the element at the given index
        for (let i = index - 1; i < updatedEntregables.length; i++) {
            updatedEntregables[i].index = updatedEntregables[i].index - 1;
        }
        console.log(updatedEntregables);
        //props.setAcuerdos(updatedEntregables);
        props.updateAcuerdos(props.number - 1, updatedEntregables);
    }

    const updateResponsables = (index, nuevosResponsables) => {
        const nuevosAcuerdos = [...props.acuerdos];
        nuevosAcuerdos[index].responsables = nuevosResponsables;
        props.updateAcuerdos(props.number - 1, nuevosAcuerdos);
    };

    const handleDateChange = (e, index) => {
        const nuevosAcuerdos = [...props.acuerdos];
        nuevosAcuerdos[index - 1].date = e.target.value;
        props.updateAcuerdos(props.number - 1, nuevosAcuerdos);
    };

    return (
        <li className="EditableTopic">
            <div className="topicContainer">
                <p className="newInputEntrName">
                    {props.number}. 
                </p>
                <div className="inputAndDeleteContainer">
                    <Textarea
                        isInvalid={false}
                        isDisabled={!props.beEditable}
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
                        readOnly={!props.beEditable}
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
            <div className="agreementsPerTopic p-2 w-full">
                <Card 
                    //className="mx-auto w-full"
                    shadow="none"
                    isBlurred="false"
                >
                    <CardBody className="mt-0 py-0 pl-8">
                        <div className="agreementsContainer w-full">
                            <AcuerdosListEditableInput
                                beEditable={props.beEditable}
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
    return (
        <ul className="ListEditableInput">
            {props.ListInputs.map((item) => {
                return (
                    <EditableTopic
                        key={item.index}
                        typeName={props.typeName}
                        number={item.index}
                        data={item.data}
                        handleChanges={props.handleChanges}
                        handleRemove={props.handleRemove}
                        beEditable={props.beEditable}
                        acuerdos={item.acuerdos}
                        updateAcuerdos={props.updateAcuerdos}
                        participantes={props.participantes}
                    ></EditableTopic>
                );
            })}
        </ul>
    );
}