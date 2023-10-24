import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/ModalPosterior.css";
import DateInput from "@/components/DateInput";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
} from "@nextui-org/react";
import { useState } from "react";

export default function ModalPosterior({
    isOpen,
    onOpenChange,
    addTaraPosterior,
}) {
    const [nombreTarea, setNombreTarea] = useState("");
    const [validName, setValidName] = useState(true);

    const [descripcionTarea, setDescripcionTarea] = useState("");

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [validFechaFin, setValidFechaFin] = useState(true);

    const [validFechas, setValidFechas] = useState(true);

    const msgEmptyField = "Este campo no puede estar vacio";

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="xl"
            classNames={
                {
                    //closeButton: "hidden",
                }
            }
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = () => {
                        // const objTarea = {
                        //     //idCronograma: cronogramaId,
                        //     idTareaEstado: 1, //No iniciado
                        //     idSubGrupo:
                        //         selectedSubteam === null
                        //             ? null
                        //             : selectedSubteam.idEquipo,
                        //     idPadre:
                        //         tareaPadre !== null ? tareaPadre.idTarea : null,
                        //     idTareaAnterior: null,
                        //     sumillaTarea: tareaName,
                        //     descripcion: tareaDescripcion,
                        //     fechaInicio: fechaInicio,
                        //     fechaFin: fechaFin,
                        //     cantSubtareas: 0,
                        //     cantPosteriores: 0,
                        //     horasPlaneadas: null,
                        //     usuarios:
                        //         selectedUsers.length === 0
                        //             ? null
                        //             : selectedUsers,
                        //     subTareas: null,
                        //     tareasPosteriores: null,
                        //};
                        addTaraPosterior();
                        onClose();
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col">
                                Nueva tarea posterior
                            </ModalHeader>
                            <ModalBody>
                                <div className="posteriorModalContainer">
                                    <div className="postNombreContainer">
                                        <p>Nombre de tarea</p>
                                        <Textarea
                                            aria-label="name-lbl"
                                            isInvalid={!validName}
                                            errorMessage={
                                                !validName ? msgEmptyField : ""
                                            }
                                            variant={"bordered"}
                                            labelPlacement="outside"
                                            label=""
                                            placeholder="Escriba aquí"
                                            classNames={{ label: "pb-0" }}
                                            value={nombreTarea}
                                            onValueChange={setNombreTarea}
                                            minRows={1}
                                            size="sm"
                                            onChange={() => {
                                                setValidName(true);
                                            }}
                                        />
                                    </div>
                                    <div className="postDatesContainer">
                                        <div className="postDateStart">
                                            <p>Fecha inicio</p>
                                            <DateInput
                                                className={""}
                                                isInvalid={
                                                    validFechas === true
                                                        ? false
                                                        : true
                                                }
                                                onChangeHandler={(e) => {
                                                    setFechaInicio(
                                                        e.target.value
                                                    );
                                                    setValidFechas(true);
                                                }}
                                            ></DateInput>
                                        </div>

                                        <div className="postDateEnd">
                                            <p>Fecha fin</p>
                                            <DateInput
                                                className={""}
                                                isInvalid={
                                                    validFechas === true
                                                        ? false
                                                        : true
                                                }
                                                onChangeHandler={(e) => {
                                                    setFechaFin(e.target.value);
                                                    setValidFechas(true);
                                                }}
                                            ></DateInput>
                                        </div>
                                    </div>

                                    <div>
                                        <p>
                                            Usuarios asignados: (Mismos que
                                            tarea previa)
                                        </p>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={finalizarModal}
                                >
                                    Aceptar
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );
}
