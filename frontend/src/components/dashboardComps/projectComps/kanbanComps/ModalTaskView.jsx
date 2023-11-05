import { dbDateToDisplayDate, dbDateToInputDate } from "@/common/dateFunctions";
import DateInput from "@/components/DateInput";
import {
    Button,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    Textarea,
} from "@nextui-org/react";

function ModalTaskView({ isOpen, onOpenChange, currentTask }) {
    const twStyle1 = "font-[Montserrat] font-medium";

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="xl"
            classNames={{
                closeButton: "hidden",
            }}
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = () => {
                        onClose();
                    };
                    return (
                        <div className="NAME flex flex-col relative">
                            {currentTask === null && (
                                <div className="absolute top-2 left-2 right-2 bottom-2 z-20 bg-white dark:bg-[#18181b]
                                                flex justify-center items-center">
                                    <Spinner size="lg"/>
                                </div>
                            )}
                            <ModalHeader className="flex flex-row  justify-between items-center pb-2">
                                <div className="flex flex-row items-center gap-3">
                                    <p className="font-[Montserrat] text-xl font-semibold">
                                        {currentTask !== null
                                            ? currentTask.sumillaTarea
                                            : "placeholder"}
                                    </p>
                                    <Chip
                                        size="lg"
                                        variant="flat"
                                        color={
                                            currentTask !== null
                                                ? currentTask.colorTareaEstado
                                                : "default"
                                        }
                                    >
                                        {currentTask !== null
                                            ? currentTask.nombreTareaEstado
                                            : "PLACEHOLDER"}
                                    </Chip>
                                </div>
                                <Button
                                    color="warning"
                                    className="max-h-[40px] text-white"
                                >
                                    Editar
                                </Button>
                            </ModalHeader>
                            <ModalBody>
                                {/* {currentTask === null && <Spinner size="lg" />} */}

                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col">
                                        <p className={twStyle1}>
                                            Descripcion de tarea
                                        </p>
                                        <Textarea
                                            variant={"flat"}
                                            //readOnly={false}
                                            aria-label="name-lbl"
                                            //isInvalid={!validName}
                                            //errorMessage={
                                            //    !validName ? msgEmptyField : ""
                                            //}
                                            labelPlacement="outside"
                                            label=""
                                            placeholder="Escriba aquí"
                                            classNames={{ label: "pb-0" }}
                                            defaultValue={
                                                currentTask !== null
                                                    && currentTask.descripcion
                                            }
                                            //onValueChange={setTareaName}
                                            minRows={2}
                                            size="sm"
                                            //onChange={() => {
                                            //    setValidName(true);
                                            //}}
                                        />
                                    </div>

                                    <div className="flex flex-row gap-5">
                                        <div className="flex flex-col w-full">
                                            <p className={twStyle1}>
                                                Fecha inicio
                                            </p>
                                            <DateInput
                                                isEditable={false}
                                                value={
                                                    currentTask !== null &&
                                                    dbDateToInputDate(
                                                        currentTask.fechaInicio
                                                    )
                                                }
                                                className={""}
                                            ></DateInput>
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <p className={twStyle1}>
                                                {" "}
                                                Fecha fin
                                            </p>
                                            <DateInput
                                                isEditable={false}
                                                value={
                                                    currentTask !== null &&
                                                    dbDateToInputDate(
                                                        currentTask.fechaFin
                                                    )
                                                }
                                                className={""}
                                            ></DateInput>
                                        </div>
                                    </div>

                                    <p className={twStyle1}>
                                        Usuarios responsables
                                    </p>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                {/* <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancelar
                                </Button> */}
                                <Button
                                    color="primary"
                                    onPress={finalizarModal}
                                >
                                    Cerrar
                                </Button>
                            </ModalFooter>
                        </div>
                    );
                }}
            </ModalContent>
        </Modal>
    );
}

export default ModalTaskView;
