import DateInput from "@/components/DateInput";
import { Slider as SliderMaterial } from "@mui/material";
import axios from "axios";
axios.defaults.withCredentials = true;

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { SessionContext } from "@/app/dashboard/layout";
import { toast } from "sonner";

function ModalRegisterProgress({
    isOpen,
    onOpenChange,
    tarea,
    refreshListTareas,
}) {
    const { sessionData } = useContext(SessionContext);

    const [isLoading, setIsLoading] = useState(false);

    const [progDescription, setProgDescription] = useState("");

    //const baseOriginal = tarea?.porcentajeProgreso === null ? 0 : tarea.porcentajeProgreso;
    const [baseOriginal, setBaseOriginal] = useState(0);
    const [baseProgressVal, setBaseProgressVal] = useState(baseOriginal);
    const [newProgressVal, setNewProgressVal] = useState(0);

    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so we add 1.
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    useEffect(() => {
        console.log(isOpen);
        console.log(sessionData);
        if (isOpen === true) {
            setProgDescription("");
            setBaseOriginal(tarea.porcentajeProgreso);
            setBaseProgressVal(tarea.porcentajeProgreso);
            setNewProgressVal(0);
            setIsLoading(false);
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="xl"
            isDismissable={false}
            classNames={{
                closeButton: "hidden",
            }}
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = async () => {
                        const result = await handleRegisterProgress();
                        if (result === 1) {
                            console.log(
                                "desde modal estoy mandando al refresh"
                            );
                            await refreshListTareas();
                            toast.success("Progreso registrado con exito");
                            onClose();
                        } else {
                            toast.error("Error al registrar progreso");
                        }
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col pb-1">
                                <p className="truncate">
                                    Registra progreso en la tarea &quot;
                                    {tarea.sumillaTarea}&quot;
                                </p>
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-4 font-[Montserrat]">
                                    <div className="flex flex-row gap-1">
                                        <p>
                                            Este registro se guardara a su
                                            nombre en la fecha
                                        </p>
                                        <p className="font-semibold">
                                            {formattedDate}
                                        </p>
                                    </div>
                                    <div className="flex flex-row w-full gap-2">
                                        <div className="flex flex-col w-full">
                                            <p className="text-md font-medium">
                                                Descripcion
                                            </p>
                                            <Textarea
                                                variant={"bordered"}
                                                aria-label="desc-lbl"
                                                labelPlacement="outside"
                                                placeholder="Escriba aquí"
                                                classNames={{ label: "pb-0" }}
                                                value={progDescription}
                                                onValueChange={
                                                    setProgDescription
                                                }
                                                minRows={1}
                                                size="sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 justify-center">
                                        <div className="flex flex-row items-center gap-0 px-10">
                                            <SliderMaterial
                                                marks={false}
                                                value={baseProgressVal}
                                                onChange={(e) => {
                                                    if (
                                                        e.target.value >=
                                                        baseOriginal
                                                    ) {
                                                        setNewProgressVal(
                                                            e.target.value -
                                                                baseOriginal
                                                        );
                                                        setBaseProgressVal(
                                                            e.target.value
                                                        );
                                                    }
                                                }}
                                                max={100}
                                                min={0}
                                                size="medium"
                                                valueLabelDisplay="auto"
                                            />
                                            <p className="font-semibold text-xl  w-unit-16 translate-x-4">
                                                {baseProgressVal}%
                                            </p>
                                        </div>

                                        <div className="flex flex-row justify-center gap-1">
                                            <p>Registrando un progreso de</p>

                                            <p className="text-success-600 font-semibold w-unit-13">
                                                {"+" + newProgressVal + "%"}
                                            </p>
                                        </div>

                                        {baseProgressVal === 100 && (
                                            <div className="flex flex-row gap-1 justify-center">
                                                <p className="font-semibold">
                                                    La tarea se marcara como
                                                </p>
                                                <p className="font-bold underline text-success-600">
                                                    Finalizada
                                                </p>
                                            </div>
                                        )}
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
                                    isDisabled={newProgressVal === 0}
                                    isLoading={isLoading}
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

    async function handleRegisterProgress() {
        setIsLoading(true);

        const objNewReg = {
            idTarea: tarea.idTarea,
            idUsuario: sessionData.idUsuario,
            descripcion: progDescription === "" ? "---" : progDescription,
            porcentajeRegistrado: newProgressVal,
            porcentajeDeTarea: baseProgressVal,
        };

        const newURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/cronograma/registrarProgresoTarea";

        try {
            const response = await axios.post(newURL, objNewReg);
            console.log("enviando resultado 1");
            return 1;
        } catch (error) {
            console.error(error);
            toast.error("Error al registrar progreso");
            return 0;
        }
    }
}
export default ModalRegisterProgress;
