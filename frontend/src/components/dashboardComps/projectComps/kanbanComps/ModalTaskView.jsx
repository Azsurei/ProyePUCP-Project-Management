import { dbDateToDisplayDate, dbDateToInputDate } from "@/common/dateFunctions";
import DateInput from "@/components/DateInput";
import {
    Avatar,
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
import { useState } from "react";
import { Toaster, toast } from "sonner";

function GroupIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
        </svg>
    );
}

function ModalTaskView({ isOpen, onOpenChange, currentTask, goToTaskDetail }) {
    const twStyle1 = "font-[Montserrat] font-medium";
    const [flagCancelRedirection, setFlagCancelRedirection] = useState(0);

    const [isButtonLoading, setIsButtonLoading] = useState(false);

    let timeoutId = null;

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="xl"
            classNames={{
                closeButton: "hidden",
            }}
            isDismissable={false}
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = () => {
                        onClose();
                    };
                    return (
                        <div className="NAME flex flex-col relative">
                            {currentTask === null && (
                                <div
                                    className="absolute top-2 left-2 right-2 bottom-2 z-20 bg-white dark:bg-[#18181b]
                                                flex justify-center items-center"
                                >
                                    <Spinner size="lg" />
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
                                        color={"primary"}
                                    >
                                        {(currentTask !== null
                                            ? currentTask.horasPlaneadas
                                            : "PLACEHOLDER") + " horas"}
                                    </Chip>
                                </div>
                                <Button
                                    color="warning"
                                    className="max-h-[40px] text-white h-[40px] font-medium font-[Montserrat]"
                                    isLoading={isButtonLoading}
                                    onPress={() => {
                                        setIsButtonLoading(true);
                                        const tId = toast(
                                            "Redireccionando a cronograma",
                                            {
                                                action: {
                                                    label: "Cancelar",
                                                    onClick: () => {
                                                        clearTimeout(timeoutId);
                                                        setIsButtonLoading(false);
                                                    },
                                                },
                                            }
                                        );
                                        timeoutId = setTimeout(() => {
                                            if (flagCancelRedirection !== 1) {
                                                toast.dismiss(tId);
                                                setIsButtonLoading(false);
                                                goToTaskDetail(
                                                    currentTask.idTarea,
                                                    currentTask.sumillaTarea
                                                );
                                            }
                                        }, 2000);
                                    }}
                                >
                                    Ver mas detalles
                                </Button>
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col">
                                        <p className={twStyle1}>
                                            Descripcion de tarea
                                        </p>
                                        <Textarea
                                            variant={"flat"}
                                            readOnly={true}
                                            aria-label="name-lbl"
                                            labelPlacement="outside"
                                            label=""
                                            placeholder="Escriba aquí"
                                            classNames={{ label: "pb-0" }}
                                            defaultValue={
                                                currentTask !== null &&
                                                currentTask.descripcion
                                            }
                                            minRows={2}
                                            size="sm"
                                        />
                                    </div>

                                    <div className="flex flex-row gap-5 pb-[.4rem]">
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

                                    <div className="flex flex-col">
                                        <p className={twStyle1}>
                                            Entregable asociado
                                        </p>
                                        <Textarea
                                            variant={"flat"}
                                            readOnly={true}
                                            aria-label="name-lbls"
                                            labelPlacement="outside"
                                            label=""
                                            placeholder="Escriba aquí"
                                            classNames={{ label: "pb-0" }}
                                            defaultValue={
                                                currentTask !== null &&
                                                currentTask.nombreEntregable
                                            }
                                            minRows={1}
                                            size="sm"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <p className={twStyle1}>
                                            Usuarios responsables
                                        </p>

                                        <div className="flex flex-row gap-3 flex-wrap h-[69px] max-h-[69px] overflow-y-auto pl-2 pt-2 pr-2 pb-2">
                                            {currentTask !== null &&
                                                currentTask.idEquipo !==
                                                    null && (
                                                    <div className="border-gray-500 border-1 w-full h-full flex flex-row items-center gap-2 rounded-lg pl-3">
                                                        <GroupIcon />
                                                        <p className="font-[Montserrat] text-lg font-medium">
                                                            {
                                                                currentTask
                                                                    .equipo
                                                                    .nombre
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            {currentTask !== null &&
                                                currentTask.usuarios.length ===
                                                    0 &&
                                                currentTask.idEquipo ===
                                                    null && (
                                                    <div className="flex justify-center items-center w-full h-full font-[Montserrat] text-gray-400">
                                                        Esta tarea no tiene
                                                        responsables
                                                    </div>
                                                )}
                                            {currentTask !== null &&
                                                currentTask.usuarios?.map(
                                                    (user) => {
                                                        return (
                                                            <Avatar
                                                                key={
                                                                    user.idUsuario
                                                                }
                                                                isBordered
                                                                color="default"
                                                                src={
                                                                    user.imgLink
                                                                }
                                                                className="w-[50px] h-[50px] text-base font-[Montserrat]"
                                                                fallback={
                                                                    <p id="UsrNoIcon">
                                                                        {user
                                                                            .nombres[0] +
                                                                            user
                                                                                .apellidos[0]}
                                                                    </p>
                                                                }
                                                            />
                                                        );
                                                    }
                                                )}
                                        </div>
                                    </div>
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
                                    className="font-medium font-[Montserrat]"
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
