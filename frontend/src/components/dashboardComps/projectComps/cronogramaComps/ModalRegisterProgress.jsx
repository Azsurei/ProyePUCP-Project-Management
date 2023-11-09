import DateInput from "@/components/DateInput";
import { Slider as SliderMaterial } from "@mui/material";

import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

function ModalRegisterProgress({ isOpen, onOpenChange, tarea }) {
    const [progDescription, setProgDescription] = useState("");

    const baseOriginal = 32;
    const [baseProgressVal, setBaseProgressVal] = useState(32);
    const [newProgressVal, setNewProgressVal] = useState(0);

    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based, so we add 1.
    const year = currentDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    useEffect(() => {
        console.log(isOpen);
        if (isOpen === true) {
            setProgDescription("");
            setBaseProgressVal(baseOriginal);
            setNewProgressVal(0);
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
                    const finalizarModal = () => {
                        console.log("BASE " + baseProgressVal);
                        console.log("NEW " + newProgressVal);
                        console.log(currentDate);
                        console.log(formattedDate);
                        console.log("la tarea => " + tarea.idTarea)
                        //onClose();
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col pb-1">
                                <p className="truncate">Registra progreso en la tarea &quot;{tarea.sumillaTarea}&quot;</p>
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
                                                //isInvalid={!validDescripcion}
                                                //errorMessage={
                                                //    !validDescripcion
                                                //        ? msgEmptyField
                                                //        : ""
                                                //}
                                                labelPlacement="outside"
                                                placeholder="Escriba aquí"
                                                classNames={{ label: "pb-0" }}
                                                value={progDescription}
                                                onValueChange={
                                                    setProgDescription
                                                }
                                                minRows={1}
                                                size="sm"
                                                //onChange={() => {
                                                //    setValidDescripcion(true);
                                                //}}
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
                                                    console.log(e.target.value);
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
export default ModalRegisterProgress;
