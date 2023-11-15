import DateInput from "@/components/DateInput";
import {
    Avatar,
    Badge,
    Button,
    Chip,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Spinner,
    Textarea,
} from "@nextui-org/react";
import { SearchIcon } from "public/icons/SearchIcon";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ListUsers.css";
import TrashIcon2 from "./TrashIcon2";
import { Toaster, toast } from "sonner";
import { HerramientasInfo } from "@/app/dashboard/[project]/layout";

function CardUser({
    isSelected,
    usuarioObject,
    addUserList,
    removeUserInList,
}) {
    //const [isSelected, setIsSelected] = useState(false);

    const handleSelectedOn = () => {
        addUserList(usuarioObject);
        //setIsSelected(true);
    };

    const handleSelectedOff = () => {
        removeUserInList(usuarioObject);
        //setIsSelected(false);
    };

    return (
        <li
            className={
                isSelected
                    ? "UserCard bg-green-300 dark:bg-success-300 active hover:bg-green-300"
                    : "UserCard dark:hover:bg-slate-700 hover:bg-slate-100 bg-mainBackground "
            }
            onClick={isSelected ? handleSelectedOff : handleSelectedOn}
        >
            <Avatar
                className="transition-transform w-[48px] min-w-[48px] h-[48px] min-h-[48px] bg-mainUserIcon"
                src={usuarioObject.imgLink}
                fallback={
                    <p className="usrLeftIconNull bg-mainUserIcon">
                        {usuarioObject.nombres[0] +
                            (usuarioObject.apellidos !== null
                                ? usuarioObject.apellidos[0]
                                : "")}
                    </p>
                }
            />

            <div className="cardUserDataSection">
                <p className="titleUserName">
                    {usuarioObject.nombres +
                        " " +
                        (usuarioObject.apellidos !== null
                            ? usuarioObject.apellidos
                            : "")}
                </p>
                <p className="titleUserEmail text-mainHeaders dark:text-slate-300 dark:font-normal">
                    {usuarioObject.correoElectronico}
                </p>
            </div>
        </li>
    );
}

function ListUsers({ lista, listaSelected, addUserList, removeUserInList }) {
    if (lista.length === 0) {
        return (
            <p className="noResultsMessage flex flex-1 items-center justify-center">
                No se encontraron resultados.
            </p>
        );
    }
    return (
        <ul className="ListUsersProject">
            {lista.map((component) => {
                return (
                    <CardUser
                        key={component.idUsuario}
                        isSelected={listaSelected.some(
                            (user) => user.idUsuario === component.idUsuario
                        )}
                        usuarioObject={component}
                        addUserList={addUserList}
                        removeUserInList={removeUserInList}
                    ></CardUser>
                );
            })}
        </ul>
    );
}

function ModalNewTask({
    isOpen,
    onOpenChange,
    currentColumn,
    currentSprint,
    flagOpeningModal,
    resetFlagOpeningModal,
    idProyecto,
    insertTask
}) {
    const { herramientasInfo } = useContext(HerramientasInfo);

    const twStyle1 = "font-[Montserrat] font-medium";

    const [isUsrSearchOpen, setIsUsrSearchOpen] = useState(false);
    const [isLoadingTask, setIsLoadingTask] = useState(false);

    const [taskName, setTaskName] = useState("");
    const [taskHorasAsignadas, setTaskHorasAsignadas] = useState(0);
    const [taskDescription, setTaskDescription] = useState("");
    const [taskFechaInicio, setTaskFechaInicio] = useState("");
    const [taskFechaFin, setTaskFechaFin] = useState("");
    const [taskEntregable, setTaskEntregable] = useState(new Set([]));
    const [validEntregable, setValidEntregable] = useState(true);
    const [taskUsers, setTaskUsers] = useState([]);

    //from 2nd modal
    const [filterValue, setFilterValue] = useState("");
    const [listUsers, setListUsers] = useState([]);
    const [listSelectedUsers, setListSelectedUsers] = useState([]);
    const [listEntregables, setListEntregables] = useState([]);

    useEffect(() => {
        if (flagOpeningModal === 1) {
            //reiniciamos atributos y apagamos flag
            console.log("REINICIANDO");
            setTaskName("");
            setTaskHorasAsignadas(0);
            setTaskDescription("");
            setTaskFechaInicio("");
            setTaskFechaFin("");
            setTaskEntregable(new Set([]));
            setTaskUsers([]);

            setFilterValue("");
            setListUsers([]);
            setListSelectedUsers([]);

            resetFlagOpeningModal();
        }
    }, [flagOpeningModal]);

    useEffect(() => {
        const entregablesURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/cronograma/listarEntregablesXidProyecto/" +
            idProyecto;
        axios
            .get(entregablesURL)
            .then(function (response) {
                console.log(response);
                const entregablesArray = response.data.entregables.map(
                    (entregable) => {
                        return {
                            ...entregable,
                            idEntregableString:
                                entregable.idEntregable.toString(),
                        };
                    }
                );

                setListEntregables(entregablesArray);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const msgEmptyField = "Este campo no puede estar vacio";

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={() => {
                setIsUsrSearchOpen(false);
                onOpenChange();
            }}
            size={isUsrSearchOpen ? "5xl" : "xl"}
            classNames={{
                closeButton: "hidden",
                base: "transition-all ease duration-300 min-h-[500px] flex flex-row ",
            }}
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = () => {
                        const result = onSubmit();
                        
                        if (result === 1) {
                            const objTareaNueva = {
                                idCronograma: herramientasInfo.find(herramienta => herramienta.idHerramienta === 4).idHerramientaCreada, 
                                idTareaEstado: 1, //No iniciado
                                idSubGrupo: null,
                                idPadre: null,
                                idTareaAnterior: null,
                                idSprint: currentSprint,
                                sumillaTarea: taskName,
                                descripcion: taskDescription,
                                fechaInicio: taskFechaInicio,
                                fechaFin: taskFechaFin,
                                cantSubtareas: 0,
                                cantPosteriores: 0,
                                horasPlaneadas: taskHorasAsignadas,
                                usuarios: taskUsers, //veriifcar posible error
                                subTareas: null,
                                tareasPosteriores: null,
                                idEntregable: parseInt(taskEntregable[0], 10),
                                idColumnaKanban: currentColumn,
                            };

                            insertTask(objTareaNueva);
                            setIsUsrSearchOpen(false);
                            onClose();
                        } else {
                            toast.error("Debe completar todos los campos");
                        }
                    };
                    return (
                        <div className="flex flex-row justify-between w-full relative">
                            <div
                                className={
                                    "flex flex-col max-w-[576px] h-full w-full z-20 bg-mainModalColor relative transition-opacity duration-0 ease " +
                                    (isUsrSearchOpen
                                        ? "opacity-40"
                                        : "opacity-100")
                                }
                            >
                                <ModalHeader className="flex flex-row  justify-between items-center pb-2">
                                    Agrega una nueva tarea
                                </ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex flex-row w-full items-center gap-4">
                                                <div className="flex flex-col w-full">
                                                    <p className={twStyle1}>
                                                        Nombre de tarea
                                                    </p>

                                                    <Textarea
                                                        variant={"bordered"}
                                                        isDisabled={
                                                            isUsrSearchOpen
                                                                ? true
                                                                : false
                                                        }
                                                        //readOnly={false}
                                                        aria-label="namet-lbl"
                                                        //isInvalid={!validName}
                                                        //errorMessage={
                                                        //    !validName ? msgEmptyField : ""
                                                        //}
                                                        labelPlacement="outside"
                                                        label=""
                                                        placeholder="Nombre de la tarea"
                                                        classNames={{
                                                            label: "pb-0",
                                                        }}
                                                        value={taskName}
                                                        onValueChange={
                                                            setTaskName
                                                        }
                                                        minRows={1}
                                                        size="sm"
                                                        //onChange={() => {
                                                        //    setValidName(true);
                                                        //}}
                                                    />
                                                </div>
                                                <div className="flex flex-col h-full w-[40%]">
                                                    <p className={twStyle1}>
                                                        Horas asignadas
                                                    </p>
                                                    <Input
                                                        variant="bordered"
                                                        type="number"
                                                        label=""
                                                        placeholder="0 horas"
                                                        labelPlacement="outside"
                                                        classNames={{
                                                            label: "pb-0",
                                                        }}
                                                        value={
                                                            taskHorasAsignadas
                                                        }
                                                        onValueChange={
                                                            setTaskHorasAsignadas
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col">
                                                <p className={twStyle1}>
                                                    Descripcion de tarea
                                                </p>
                                                <Textarea
                                                    variant={"bordered"}
                                                    isDisabled={
                                                        isUsrSearchOpen
                                                            ? true
                                                            : false
                                                    }
                                                    //readOnly={false}
                                                    aria-label="name-lbl"
                                                    //isInvalid={!validName}
                                                    //errorMessage={
                                                    //    !validName ? msgEmptyField : ""
                                                    //}
                                                    labelPlacement="outside"
                                                    label=""
                                                    placeholder="Escriba aquí"
                                                    classNames={{
                                                        label: "pb-0",
                                                    }}
                                                    value={taskDescription}
                                                    onValueChange={
                                                        setTaskDescription
                                                    }
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
                                                        isEditable={
                                                            isUsrSearchOpen
                                                                ? false
                                                                : true
                                                        }
                                                        className={""}
                                                        value={taskFechaInicio}
                                                        onChangeHandler={(
                                                            e
                                                        ) => {
                                                            setTaskFechaInicio(
                                                                e.target.value
                                                            );
                                                        }}
                                                    ></DateInput>
                                                </div>
                                                <div className="flex flex-col w-full">
                                                    <p className={twStyle1}>
                                                        {" "}
                                                        Fecha fin
                                                    </p>
                                                    <DateInput
                                                        isEditable={
                                                            isUsrSearchOpen
                                                                ? false
                                                                : true
                                                        }
                                                        className={""}
                                                        value={taskFechaFin}
                                                        onChangeHandler={(
                                                            e
                                                        ) => {
                                                            setTaskFechaFin(
                                                                e.target.value
                                                            );
                                                        }}
                                                    ></DateInput>
                                                </div>
                                            </div>

                                            <div className="flex flex-col">
                                                <p className={twStyle1}>
                                                    Entregable asociado
                                                </p>
                                                <Select
                                                    onClick={()=>{
                                                        if(listEntregables.length === 0){
                                                            toast.warning("No cuenta con entregables en el proyecto");
                                                        }
                                                    }}
                                                    items={listEntregables}
                                                    variant="bordered"
                                                    isInvalid={!validEntregable}
                                                    errorMessage={
                                                        !validEntregable
                                                            ? msgEmptyField
                                                            : ""
                                                    }
                                                    isDisabled={
                                                        isUsrSearchOpen
                                                            ? true
                                                            : false
                                                    }
                                                    aria-label="cbo-lbl-ent"
                                                    label=""
                                                    placeholder="Selecciona un entregable"
                                                    labelPlacement="outside"
                                                    classNames={{
                                                        trigger: "h-10",
                                                    }}
                                                    size="md"
                                                    //color={}
                                                    onChange={(e) => {
                                                        // const state = {
                                                        //     id: dropBoxItems.find(item => item.itemKey === e.target.value).id,
                                                        //     itemKey: e.target.value
                                                        // }
                                                        if (
                                                            e.target.value ===
                                                            ""
                                                        ) {
                                                            console.log(
                                                                "caso 1"
                                                            );
                                                            setTaskEntregable(
                                                                new Set([])
                                                            );
                                                        } else {
                                                            setTaskEntregable([
                                                                e.target.value,
                                                            ]);
                                                            setValidEntregable(
                                                                true
                                                            );
                                                        }
                                                    }}
                                                    selectedKeys={
                                                        taskEntregable
                                                    }
                                                >
                                                    {listEntregables.map(
                                                        (items) => (
                                                            <SelectItem
                                                                key={
                                                                    items.idEntregable
                                                                }
                                                                value={
                                                                    items.idEntregableString
                                                                }
                                                            >
                                                                {items.nombre}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="flex flex-row items-center gap-4">
                                            <p className={twStyle1}>
                                                Usuarios responsables
                                            </p>
                                            <Button
                                                color="primary"
                                                isDisabled={
                                                    isUsrSearchOpen
                                                        ? true
                                                        : false
                                                }
                                                onPress={() => {
                                                    setIsUsrSearchOpen(true);
                                                }}
                                            >
                                                Buscar
                                            </Button>
                                        </div>
                                        <div className="flex flex-row gap-3 flex-wrap h-[65px] max-h-[65px] overflow-y-auto pl-2 pt-2 pr-2 ">
                                            {taskUsers.length === 0 && (
                                                <div className="flex justify-center items-center w-full h-full font-[Montserrat] text-gray-400">
                                                    Empieza a agregar algunos
                                                    usuarios
                                                </div>
                                            )}
                                            {taskUsers.map((user) => {
                                                return (
                                                    <Badge
                                                        key={user.idUsuario}
                                                        shape="circle"
                                                        content={
                                                            <div className="stroke-white w-4 h-6 flex items-center justify-center relative">
                                                                <TrashIcon2 />
                                                            </div>
                                                        }
                                                        color="danger"
                                                        disableOutline={true}
                                                        onClick={() => {
                                                            removeUserInTaskList(
                                                                user.idUsuario
                                                            );
                                                        }}
                                                    >
                                                        <Avatar
                                                            isBordered
                                                            color="default"
                                                            src={user.imgLink}
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
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                        isDisabled={
                                            isUsrSearchOpen ? true : false
                                        }
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={finalizarModal}
                                        isDisabled={
                                            isUsrSearchOpen ? true : false
                                        }
                                    >
                                        Crear
                                    </Button>
                                </ModalFooter>
                            </div>
                            <div className="flex flex-col border-l-1 absolute top-0 bottom-0 right-0 z-10 w-[440px] ">
                                <ModalHeader className="flex flex-row  justify-between items-center pb-2">
                                    <div className="flex flex-col gap-3 w-full">
                                        <p className="font-[Montserrat] text-xl font-semibold">
                                            Busca a un usuario
                                        </p>
                                        <div className="flex flex-row justify-between gap-3">
                                            <Input
                                                isClearable
                                                className="w-full sm:max-w-[100%]"
                                                placeholder="Ingresa un miembro..."
                                                startContent={<SearchIcon />}
                                                value={filterValue}
                                                onValueChange={setFilterValue}
                                                variant="faded"
                                            />
                                            <Button
                                                color="primary"
                                                onPress={refreshList}
                                            >
                                                Buscar
                                            </Button>
                                        </div>
                                    </div>
                                </ModalHeader>
                                <ModalBody className="overflow-y-auto">
                                    <ListUsers
                                        lista={listUsers}
                                        listaSelected={listSelectedUsers}
                                        addUserList={addUserList}
                                        removeUserInList={removeUserInList}
                                    ></ListUsers>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={() => {
                                            restoreOriginalSelectedUsers();
                                            setIsUsrSearchOpen(false);
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            console.log(listUsers);
                                            addUsersToTaskList();
                                            setIsUsrSearchOpen(false);
                                        }}
                                    >
                                        Aceptar
                                    </Button>
                                </ModalFooter>
                            </div>
                        </div>
                    );
                }}
            </ModalContent>
        </Modal>
    );

    function onSubmit() {
        if (
            taskName === "" ||
            taskHorasAsignadas === 0 ||
            taskDescription === "" ||
            taskFechaInicio === "" ||
            taskFechaFin === "" ||
            taskEntregable.size === 0 ||
            taskUsers.length === 0
        ) {
            console.log(taskEntregable);
            console.log("hola");
            return 0;
        } else {
            return 1;
        }
    }


    function refreshList() {
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            `/api/proyecto/listarUsuariosXidRolXidProyecto`;
        axios
            .post(stringURL, {
                idRol: 3,
                idProyecto: idProyecto,
            })
            .then(function (response) {
                setListUsers(response.data.usuarios);
            })
            .catch(function (error) {
                console.log(error);
                toast.error("Error en carga de usuarios. Sesion expirada");
            });
    }

    function addUserList(user) {
        const newUserList = [...listSelectedUsers, user];
        setListSelectedUsers(newUserList);
    }

    function removeUserInList(user) {
        const newUserList = listSelectedUsers.filter(
            (item) => item.idUsuario !== user.idUsuario
        );
        setListSelectedUsers(newUserList);
    }

    function addUsersToTaskList() {
        const newUserList = [...listSelectedUsers];
        setTaskUsers(newUserList);
    }

    function removeUserInTaskList(userId) {
        const newUserList = taskUsers.filter(
            (item) => item.idUsuario !== userId
        );
        setTaskUsers(newUserList);
        setListSelectedUsers(newUserList);
    }

    function restoreOriginalSelectedUsers() {
        const newUserList = [...taskUsers];
        setListSelectedUsers(newUserList);
    }
}
export default ModalNewTask;
