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

import React, { useEffect, useState } from "react";

function ModalDetalleResponsables({isOpen, onOpenChange, responsables, removeResponsable}) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader>Responsables del Acuerdo</ModalHeader>
                    <ModalBody>
                        {responsables.length > 0 ? (
                            responsables.map((responsable, index) => (
                                <div 
                                    key={index} 
                                    style={{ display: 'flex', justifyContent: 'space-between', 
                                        alignItems: 'center', marginBottom: '10px' }}>
                                    <span>{responsable.nombres} {responsable.apellidos}</span>
                                    <Button size="xs" color="error" onClick={() => removeResponsable(responsable)}>
                                        X
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p>No hay responsables</p>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Cerrar
                        </Button>
                    </ModalFooter>
                </>
            )} 
          </ModalContent>
        </Modal>
      );
}

function EditableInput(props) {
    const [responsables, setResponsables] = useState([]);
    const [modal, setModal] = useState(false);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const toggleModal = () => {
        setModal(!modal);
    };

    const returnResponsables = (newMiembrosList) => {
        const newMembrsList = [...responsables, ...newMiembrosList];

        setResponsables(newMembrsList);
        setModal(!modal);
    };

    const removeResponsable = (miembro) => {
        const newMembrsList = responsables.filter(
            (item) => item.idUsuario !== miembro.idUsuario
        );
        setResponsables(newMembrsList);
        console.log(newMembrsList);
    };
/*
    useEffect(() => {
        console.log("Los responsables son: " + responsables);
    }, [responsables])
*/
    return (
        <li className="EditableInput">
            <div className="ml-2">
                <div className="inputXdeleteContainer flex items-center gap-5">
                    <p className="check">✔</p>
                    <div className="inputContainer flex flex-col">
                        <p>Acuerdo {props.number}</p>
                        <Textarea
                            isInvalid={false}
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
                            <button
                                onClick={toggleModal}
                                className="ml-3 bg-[#f0ae19] text-white w-8 h-8
                                    rounded-full">
                                <img src="/icons/icon-searchBar.svg"/>
                            </button>
                            {modal && (
                                <ModalUsers
                                    listAllUsers={true}
                                    handlerModalClose={toggleModal}
                                    handlerModalFinished={returnResponsables}
                                    excludedUsers={[]}
                                    //idProyecto={projectId}
                                ></ModalUsers>
                            )}
                        </div>
                        <div className="responsablesContainer">
                            {responsables.length > 0 ? (
                                <AvatarGroup isBordered max={4}>
                                    {responsables.map((responsable, index) => (
                                        <Avatar key={responsable.idUsuario} src="" fallback={
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
                                responsables={responsables}
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
                            value={props.fecha}
                            onChange={(e) => {
                                props.handleChanges(e, props.number);
                            }}
                            className="w-full col-span-12 md:col-span-6 mb-6 md:mb-0"
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
            {props.ListInputs.map((item) => {
                return (
                    <EditableInput
                        key={item.index}
                        typeName={props.typeName}
                        number={item.index}
                        data={item.data}
                        handleChanges={props.handleChanges}
                        handleRemove={props.handleRemove}
                        beEditable={props.beEditable}
                        participantes={props.participantes}
                        fecha={item.fecha}
                        tema={item.tema}
                    ></EditableInput>
                );
            })}
        </ul>
    );
}