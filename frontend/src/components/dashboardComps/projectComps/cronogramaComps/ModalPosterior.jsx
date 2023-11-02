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
import {
    dbDateToInputDate,
    inputDateToDisplayDate,
} from "@/common/dateFunctions";

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
    const [fechaFin, setFechaFin] = useState(null);

    const [validFechas, setValidFechas] = useState(true);

    const msgEmptyField = "Este campo no puede estar vacio";

    useEffect(() => {
        setFechaInicio(startDate);
    }, [startDate]);

    const cleanStates = () => {
        setNombreTarea("");
        setDescripcionTarea("");
        setFechaFin("");

        setValidName(true);
        setValidDescripcion(true);
        setValidFechas(true);
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="xl"
            isDismissable={false}
            classNames={
                {
                    closeButton: "hidden",
                }
            }
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = () => {
                        let allValid = true;
                        if (nombreTarea === "") {
                            setValidName(false);
                            allValid = false;
                        }
                        if (descripcionTarea === "") {
                            setValidDescripcion(false);
                            allValid = false;
                        }
                        if (fechaFin <= fechaInicio) {
                            setValidFechas("isFalse");
                            allValid = false;
                        }
                        if (fechaFin === "" || fechaFin === null) {
                            setValidFechas("isEmpty");
                            allValid = false;
                        }
                        if (!allValid) {
                            return;
                        }
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
                        cleanStates();
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
                                                setValidDescripcion(true);
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
                                                isInvalid={false}
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
                                            <div className="flex relative flex-col gap-1.5 pt-1 px-1">
                                                <p className="text-tiny text-danger">
                                                    
                                                    {validFechas==="isFalse" && "Fecha fin no puede ser menor a la fecha inicio"}
                                                    {validFechas==="isEmpty" && "Este campo no puede estar vacio"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={()=>{
                                        cleanStates();
                                        onClose();
                                    }}
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
