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
import { useEffect, useState } from "react";
import { dbDateToInputDate, inputDateToDisplayDate } from "@/common/dateFunctions";

export default function ModalPosterior({
    idCronograma,
    isOpen,
    onOpenChange,
    addTareaPosterior,
    startDate,
}) {
    const [nombreTarea, setNombreTarea] = useState("");
    const [validName, setValidName] = useState(true);

    const [descripcionTarea, setDescripcionTarea] = useState("");
    const [validDescripcion, setValidDescripcion] = useState(true);

    const [fechaInicio, setFechaInicio] = useState(startDate);
    const [fechaFin, setFechaFin] = useState("");
    const [validFechaFin, setValidFechaFin] = useState(true);

    const [validFechas, setValidFechas] = useState(true);

    const msgEmptyField = "Este campo no puede estar vacio";

    useEffect(() => {
        setFechaInicio(startDate);
    }, [startDate]);

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
                        const objTarea = {
                            index: null,
                            idCronograma: idCronograma,
                            idTareaEstado: 1, //No iniciado
                            idSubGrupo: null,
                            idPadre: null,
                            idTareaAnterior: null,
                            sumillaTarea: nombreTarea,
                            descripcion: descripcionTarea,
                            fechaInicio: fechaInicio,
                            fechaFin: fechaFin,
                            cantSubtareas: 0,
                            cantPosteriores: 0,
                            horasPlaneadas: null,
                            usuarios: null,
                            subTareas: null,
                            tareasPosteriores: null,
                        };
                        addTareaPosterior(objTarea);
                        console.log(startDate + "  " + fechaInicio);
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
                                    <div className="postNombreContainer">
                                        <p>Descripcion de tarea</p>
                                        <Textarea
                                            aria-label="name-lbl"
                                            isInvalid={!validDescripcion}
                                            errorMessage={
                                                !validDescripcion
                                                    ? msgEmptyField
                                                    : ""
                                            }
                                            variant={"bordered"}
                                            labelPlacement="outside"
                                            label=""
                                            placeholder="Escriba aquí"
                                            classNames={{ label: "pb-0" }}
                                            value={descripcionTarea}
                                            onValueChange={setDescripcionTarea}
                                            minRows={2}
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
                                                value={fechaInicio}
                                                isEditable={false}
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
                                                isEditable={true}
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
