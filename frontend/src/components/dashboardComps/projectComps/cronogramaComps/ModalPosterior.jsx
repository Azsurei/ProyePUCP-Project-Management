import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/ModalPosterior.css";
import DateInput from "@/components/DateInput";
import {
    Button,
    Chip,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
    dbDateToDisplayDate,
    dbDateToInputDate,
    inputDateToDisplayDate,
} from "@/common/dateFunctions";
import { SearchIcon } from "public/icons/SearchIcon";
import { toast } from "sonner";
import axios from "axios";
import { Collapse } from "react-collapse";
import { createContext } from "react";
import { useContext } from "react";
axios.defaults.withCredentials = true;

const TaskSelectorContext = createContext();

function CheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
}

function ChevronIcon({ isOpen }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 transition-transform transform ${
                isOpen ? "rotate-180" : ""
            }`}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
        </svg>
    );
}

function TaskCard({ task, isSelected }) {
    const { selectedTasks, setSelectedTasks } = useContext(TaskSelectorContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const toggleTaskSelection = () => {
        if (isSelected) {
            setSelectedTasks(
                selectedTasks.filter((tarea) => tarea.idTarea !== task.idTarea)
            );
        } else {
            setSelectedTasks([...selectedTasks, task]);
        }
    };

    const twStyle1 =
        "border-2 rounded-md flex flex-row p-3 hover:bg-gray-200 dark:hover:bg-slate-700 items-center cursor-pointer  border-primary gap-1";
    const twStyle2 =
        "border-2 rounded-md flex flex-row p-3 hover:bg-gray-200 dark:hover:bg-slate-700 items-center cursor-pointer gap-1";

    return (
        <div className="flex flex-col ">
            <div
                className={isSelected ? twStyle1 : twStyle2}
                onClick={()=>{
                    toggleTaskSelection();
                }}
            >
                {task.tareasHijas.length !== 0 ? (
                    <div
                        className="flex items-center justify-center min-h-5 min-w-5 mr-1"
                        onClick={(e)=>{
                            e.stopPropagation();
                            toggleOpen();
                        }}
                    >
                        <ChevronIcon isOpen={isOpen} />
                    </div>
                ) : null}

                <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex flex-row flex-1 overflow-hidden">
                        <p className="truncate">{task.sumillaTarea}</p>
                        {isSelected ? <div className="stroke-primary ml-1"><CheckIcon/></div> : null}
                    </div>
                    <p><span className="font-medium">Fecha fin:</span> {dbDateToDisplayDate(task.fechaFin)}</p>
                </div>
                

                <Chip variant="flat" color={task.colorTareaEstado}>
                    {task.nombreTareaEstado}
                </Chip>
            </div>

            {task.tareasHijas.length !== 0 ? (
                <Collapse isOpened={isOpen}>
                    <div className="mt-2">
                        <ListAllTasks
                            listTasks={task.tareasHijas}
                            marginLeft={"20px"}
                        />
                    </div>
                </Collapse>
            ) : null}
        </div>
    );
}

function ListAllTasks({ listTasks, marginLeft }) {
    const { selectedTasks, setSelectedTasks } = useContext(TaskSelectorContext);

    return (
        <div
            className=" flex flex-col gap-2"
            style={{ marginLeft: marginLeft }}
        >
            {listTasks.map((task) => {
                return (
                    <TaskCard
                        key={task.idTarea}
                        task={task}
                        isSelected={selectedTasks.some(
                            (tarea) => tarea.idTarea === task.idTarea
                        )}
                    />
                );
            })}
        </div>
    );
}

export default function ModalPosterior({
    idCronograma,
    isOpen,
    onOpenChange,
    addTareaPosterior,
    startDate,
    projectId,
    dependencies,
    setDependencies
}) {
    const [searchValue, setSearchValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [listTasks, setListTasks] = useState([]);


    const [selectedTasks, setSelectedTasks] = useState([]);


    const msgEmptyField = "Este campo no puede estar vacio";

    useEffect(() => {
        if (isOpen === true) {
            setIsLoading(true);
            const stringURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/cronograma/listarTareasXidProyecto/" +
                projectId;

            axios
                .get(stringURL)
                .then(function (response) {
                    console.log(response);
                    setListTasks(response.data.tareasOrdenadas);
                    setSelectedTasks(dependencies);
                    setIsLoading(false);
                })
                .catch(function (error) {
                    toast.error("Error al cargar tareas");
                    console.log(error);
                    setIsLoading(false);
                });
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="2xl"
            isDismissable={false}
            classNames={{
                closeButton: "hidden",
            }}
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = () => {
                        setDependencies(selectedTasks);
                        onClose();
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col">
                                Agrega una dependencia
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-2">
                                    <Input
                                        isClearable
                                        className="w-full"
                                        placeholder="Busca tarea por nombre..."
                                        startContent={<SearchIcon />}
                                        value={searchValue}
                                        onClear={() => {
                                            setSearchValue("");
                                        }}
                                        onValueChange={setSearchValue}
                                        variant="faded"
                                    />
                                    <div className="flex flex-col h-[300px] overflow-auto">
                                        {isLoading ? (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Spinner size="lg" />
                                            </div>
                                        ) : (
                                            <TaskSelectorContext.Provider
                                                value={{
                                                    selectedTasks,
                                                    setSelectedTasks,
                                                }}
                                            >
                                                <ListAllTasks
                                                    listTasks={listTasks}
                                                    marginLeft={"0px"}
                                                />
                                            </TaskSelectorContext.Provider>
                                        )}
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
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
