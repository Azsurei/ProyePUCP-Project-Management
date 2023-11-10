"use client"

import "@/styles/dashboardStyles/projectStyles/actaReunionStyles/TopicEditableList.css";
import { 
    Textarea, 
    Avatar, AvatarGroup,
    Tooltip,
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
    useDisclosure,
    Button,
} from "@nextui-org/react";
import ModalUsers from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import ModalParticipantes from "./ModalParticipantes";

import React, { useEffect, useState } from "react";

function ModalDetalleResponsables({isOpen, onOpenChange, responsables, removeResponsable}) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
          <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="p-5 pb-0">
                        <h2 className="responsablesDelAcuerdo">Responsables del Acuerdo</h2>
                    </ModalHeader>
                    <ModalBody className="pb-3">
                        <p className="pb-2">Elige a quienes se encargarán de cumplir con el acuerdo</p>
                        {responsables.length > 0 ? (
                            responsables.map((responsable, index) => (
                                <div 
                                    key={index} 
                                    className="flex items-center justify-between mb-2.5"
                                    >
                                    <div className="flex items-center">
                                        <span className="bg-gray-300 cursor-pointer rounded-full flex justify-center 
                                                    items-center text-base w-12 h-12 text-black mr-5">
                                        {responsable.nombres[0] + responsable.apellidos[0]}
                                        </span>
                                        <span className="text-lg font-normal text-gray-400 mr-5">
                                        {responsable.nombres} {responsable.apellidos}
                                        </span>
                                    </div>
                                    <img
                                        src="/icons/icon-cross.svg"
                                        alt="Eliminar"
                                        className="iconDeleteInput cursor-pointer"
                                        onClick={() => {removeResponsable(responsable);}}
                                    />
                                    </div>

                            ))
                        ) : (
                            <p>No hay responsables</p>
                        )}
                    </ModalBody>
                </>
            )} 
          </ModalContent>
        </Modal>
      );
}

function EditableInput(props) {
    const [responsables, setResponsables] = useState(props.responsables || []);
    const [modal, setModal] = useState(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const toggleModal = () => {
        setModal(!modal);
    };
    console.log('Props');
    console.log(props);

    const handleResponsablesChange = (newResponsables) => {
        setResponsables(newResponsables);
        props.updateResponsables(props.number, newResponsables);
    };

    const returnResponsables = (newMiembrosList) => {
        const newMembrsList = [...props.responsables, ...newMiembrosList];
        props.updateResponsables(props.number, newMembrsList);

        console.log('props.number - 1');
        console.log(props.number - 1);
        console.log('new members list');
        console.log(newMembrsList);
        setResponsables(newMembrsList);
        setModal(!modal);
    };

    const removeResponsable = (miembro) => {
        const newMembrsList = props.responsables.filter(
            (item) => item.idUsuario !== miembro.idUsuario
        );
        props.updateResponsables(props.number, newMembrsList);
        //setResponsables(newMembrsList);
        console.log(newMembrsList);
    };

    const handleDateChange = (e) => {
        //setFecha(e.target.value);
        props.handleDateChange(e, props.number);
    }
/*
    useEffect(() => {
        console.log("Los responsables son: " + responsables);
    }, [responsables])
*/
    return (
        <li className="EditableInput w-full">
            <div className="ml-2 w-full">
                <div className="inputXdeleteContainer flex align-center gap-8 w-full">
                    <p className="check">✔</p>
                    <div className="inputContainer flex flex-col">
                        <p>Acuerdo {props.number}</p>
                        <Textarea
                            isInvalid={false}
                            isDisabled={!props.beEditable}
                            key={"bordered"}
                            variant={"bordered"}
                            labelPlacement="outside"
                            placeholder="Escribe aquí"
                            className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                            value={props.data}
                            onChange={(e) => {
                                props.handleChanges(e, props.number);
                            }}
                            minRows={1}
                            size="sm"
                            readOnly={!props.beEditable}
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="titleResponsbles flex align-center">
                            <p>Responsable</p>
                            {props.beEditable && (
                            <button
                                onClick={toggleModal}
                                className="ml-3 bg-[#f0ae19] text-white w-7 h-7
                                    rounded-full">
                                <img src="/icons/icon-searchBar.svg" className="mr-1"/>
                            </button>
                            )}
                            {modal && (
                                <ModalParticipantes
                                    participantes={props.participantes}
                                    handlerModalClose={toggleModal}
                                    handlerModalFinished={returnResponsables}
                                    responsables={props.responsables}
                                ></ModalParticipantes>
                            )}
                        </div>
                        <div className="responsablesContainer">
                            {responsables && responsables.length > 0 ? (
                                <AvatarGroup isBordered max={4}>
                                    {responsables.map((responsable, index) => (
                                        <Avatar key={responsable.idUsuario} src={responsable.imgLink} fallback={
                                            <Tooltip 
                                                content={
                                                    <div className="text-small font-bold">
                                                        {responsable.nombres + responsable.apellidos}
                                                    </div>
                                            }>
                                            <p className="bg-gray-300 cursor-pointer rounded-full flex justify-center 
                                                items-center text-base w-12 h-12 text-black" onClick={onOpen}>
                                                    {responsable.nombres[0] + responsable.apellidos[0]}
                                            </p>
                                            </Tooltip> 
                                        } />
                                    ))}
                                </AvatarGroup>
                            ) : (
                                <p>Aún no hay responsables</p>
                            )}
                        </div>
                        {isOpen &&
                            <ModalDetalleResponsables 
                                isOpen={isOpen}
                                onOpenChange={onOpenChange}
                                responsables={props.responsables}
                                removeResponsable={removeResponsable}
                            />
                        }

                    </div>
                    <div className="dateContainer flex flex-col">
                        <p>Fecha</p>
                        <input
                            type="date"
                            id="acuerdoDatePicker"
                            name="fecha"
                            value={props.date}
                            onChange={handleDateChange}
                            className="w-full col-span-12 md:col-span-6 mb-6 md:mb-0"
                            readOnly={!props.beEditable}
                        ></input>
                    </div>
                    {props.beEditable && (
                        <img
                            src="/icons/icon-cross.svg"
                            alt="Eliminar"
                            className="iconDeleteInput mt-5"
                            onClick={() => {
                                props.handleRemove(props.number);
                            }}
                        />
                    )}
                </div>
            </div>
        </li>
    );
}

export default function AcuerdosListEditableInput(props) {
    //recibe un array con los entregables
    // 'number' y 'data'
    if (props.ListInputs.length === 0) {
        return <div>No cuenta con {props.typeFault}</div>;
    }
    return (
        <ul className="ListEditableInput">
            {props.ListInputs.map((item, index) => {
                return (
                    <EditableInput
                        key={index}
                        typeName={props.typeName}
                        number={item.index}
                        data={item.data}
                        handleChanges={props.handleChanges}
                        handleRemove={props.handleRemove}
                        handleDateChange={props.handleDateChange}
                        beEditable={props.beEditable}
                        responsables={item.responsables}
                        updateResponsables={props.updateResponsables}
                        participantes={props.participantes}
                        date={item.date}
                    ></EditableInput>
                );
            })}
        </ul>
    );
}