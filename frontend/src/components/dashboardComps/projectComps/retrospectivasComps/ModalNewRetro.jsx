import { HerramientasInfo } from "@/app/dashboard/[project]/layout";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Textarea,
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
axios.defaults.withCredentials = true;

function ModalNewRetro({ isOpen, onOpenChange, listSprints, refreshList }) {
    const { herramientasInfo } = useContext(HerramientasInfo);
    const [retroName, setRetroName] = useState("");
    const [validName, setValidName] = useState(true);

    const [retroSprint, setRetroSprint] = useState(new Set([]));
    const [validSprint, setValidSprint] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const msgEmptyField = "Este campo no puede estar vacio";
    
    useEffect(() => {
        if (isOpen === true) {
            setRetroName("");
            setValidName(true);
            setRetroSprint(new Set([]));
            setValidSprint(true);
            setIsLoading(false);
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            //size="xl"
            isDismissable={false}
            classNames={{
                closeButton: "hidden",
            }}
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = async () => {
                        console.log("NOMBRE => " + retroName);
                        console.log(
                            "SPRINT => " + parseInt(retroSprint.currentKey)
                        );
                            
                        setIsLoading(true);
                        const result = await registerRetrospectiva();
                        if(result === 1){
                            await refreshList();
                            toast.success("Retrospectiva creada con exito");
                            onClose();
                        }
                        else{
                            toast.error("Hubo un error al registrar la retrospectiva");
                        }
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col pb-1">
                                Crear una nueva retrospectiva
                            </ModalHeader>
                            <ModalBody>
                                <div>
                                    <p className="font-[Montserrat] text-medium">
                                        Nombre de retrospectiva
                                    </p>
                                    <Textarea
                                        variant={"bordered"}
                                        readOnly={false}
                                        aria-label="name-lbl"
                                        isInvalid={!validName}
                                        errorMessage={
                                            !validName ? msgEmptyField : ""
                                        }
                                        labelPlacement="outside"
                                        label=""
                                        placeholder="Escriba aquí"
                                        classNames={{ label: "pb-0" }}
                                        value={retroName}
                                        onValueChange={setRetroName}
                                        minRows={1}
                                        size="sm"
                                        onChange={() => {
                                            setValidName(true);
                                        }}
                                    />
                                    <p className="font-[Montserrat] text-medium">
                                        Sprint asociado
                                    </p>
                                    <Select
                                        items={listSprints}
                                        variant="bordered"
                                        isDisabled={false}
                                        aria-label="cbo-lbl"
                                        isInvalid={!validSprint}
                                        errorMessage={
                                            !validSprint ? msgEmptyField : ""
                                        }
                                        label=""
                                        placeholder="Selecciona un sprint"
                                        labelPlacement="outside"
                                        classNames={{ trigger: "h-10" }}
                                        size="sm"
                                        color={"default"}
                                        selectedKeys={retroSprint}
                                        onSelectionChange={setRetroSprint}
                                        onChange={(e)=>{
                                            setValidSprint(true);
                                        }}
                                    >
                                        {(sprint) => (
                                            <SelectItem
                                                key={sprint.idSprintString}
                                            >
                                                {sprint.nombre}
                                            </SelectItem>
                                        )}
                                    </Select>
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
                                    isLoading={isLoading}
                                    color="primary"
                                    onPress={() => {
                                        let allValid = true;
                                        if (retroName.trim() === "") {
                                            setValidName(false);
                                            allValid = false;
                                        }
                                        if (retroSprint.size === 0) {
                                            setValidSprint(false);
                                            allValid = false;
                                        }

                                        if (allValid) {
                                            finalizarModal();
                                        }
                                    }}
                                >
                                    Crear
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );

    async function registerRetrospectiva() {
        try {
            const newURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/retrospectiva/insertarLineaRetrospectiva";

            const objLineaRetro = {
                idRetrospectiva: herramientasInfo.find(herramienta => herramienta.idHerramienta === 10).idHerramientaCreada,
                idSprint: parseInt(retroSprint.currentKey),
                titulo: retroName,
                cantBien: 0,
                cantMal: 0,
                cantQueHacer: 0,
            };

            const lineasRetrospectivaResponse = await axios.post(
                newURL,
                objLineaRetro
            );

            console.log("Se se registro la retrospectiva con exito");
            return 1;
        } catch (error) {
            console.error("Error al registrar retrospectiva: ", error);
            return 0;
        }
    }
}
export default ModalNewRetro;
