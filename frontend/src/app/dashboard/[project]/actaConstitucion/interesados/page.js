"use client";

import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useContext,
} from "react";
import TextInfoCard from "@/components/dashboardComps/projectComps/appConstComps/TextInfoCard";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Textarea,
    ModalFooter,
} from "@nextui-org/react";
import { ChevronDownIcon } from "@/../public/icons/ChevronDownIcon";
import { VerticalDotsIcon } from "@/../public/icons/VerticalDotsIcon";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import axios from "axios";
import { SmallLoadingScreen } from "../../layout";
axios.defaults.withCredentials = true;
const columns = [
    { name: "Nombre", uid: "name", sortable: true },
    { name: "Cargo", uid: "position", sortable: true },
    { name: "Organizacion", uid: "organization", sortable: true },
    { name: "Acciones", uid: "actions" },
];

const toolsOptions = [
    { name: "Backlog", uid: "active" },
    { name: "Acta de constitucion", uid: "paused" },
    { name: "EDT", uid: "vacation" },
];

const extensionOptions = [
    { name: ".docx", uid: "word" },
    { name: ".xlsx", uid: "excel" },
    { name: ".pptx", uid: "powerpoint" },
];

const templates = [
    {
        id: 1,
        name: "Hernando Vazquez",
        position: "Cargo",
        organization: "UNI",
        //tool: "",
    },
    {
        id: 2,
        name: "Alberto Quiroz",
        position: "Cargo",
        organization: "ULIMA",
        //tool: "",
    },
    {
        id: 3,
        name: "Paolo Perez",
        position: "Cargo",
        organization: "ULIMA",
        //tool: "",
    },
    {
        id: 4,
        name: "Enrique Torres",
        position: "Cargo",
        organization: "ULIMA",
        //tool: "",
    },
    {
        id: 5,
        name: "Armando Casas",
        position: "Cargo",
        organization: "ULIMA",
        //tool: "",
    },
    {
        id: 6,
        name: "Junior Aguilar",
        position: "Cargo",
        organization: "ULIMA",
        //tool: "",
    },
];

export default function Interesados(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Estados generales
    const [filterValue, setFilterValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [toolsFilter, setToolsFilter] = useState("all");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "name",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [interesados, setInteresados] = useState([]); // State to hold interesados data

    const [modalContentState, setModalContentState] = useState(0);

    //del nuevo y edit
    const [idSelected, setIdSelected] = useState(null);
    const [newName, setNewName] = useState("");
    const [validName, setValidName] = useState(true);
    const [newPosition, setNewPosition] = useState("");
    const [validPosition, setValidPosition] = useState(true);
    const [newOrganization, setNewOrganization] = useState("");
    const [validOrganization, setValidOrganization] = useState(true);

    useEffect(() => {
        setIsLoadingSmall(true);
        const listIntrURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/ActaConstitucion/listarInteresados/" +
            projectId;
        axios
            .get(listIntrURL)
            .then((response) => {
                console.log(response.data.message);
                console.log(
                    "LISTA DE INTERESADOS ==== " +
                        JSON.stringify(response.data.interesadoAC)
                );

                const interesadosArray = response.data.interesadoAC.map(
                    (intr) => {
                        return {
                            id: intr.idInteresado,
                            name: intr.nombre,
                            position: intr.cargo,
                            organization: intr.organizacion,
                        };
                    }
                );
                setInteresados(interesadosArray);
                setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    // Function to list interesados
    const listarInteresados = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/listarInteresados"); // Replace with the correct API endpoint
            // Assuming the response contains an array of interesados data
            setInteresados(response.data);
        } catch (error) {
            console.error("Error fetching interesados:", error);
        }
    };

    const addNewInteresado = (newName, newPosition, newOrganization) => {
        const addURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/ActaConstitucion/insertarInteresado";
        axios
            .post(addURL, {
                idProyecto: projectId,
                nombre: newName,
                cargo: newPosition,
                organizacion: newOrganization,
            })
            .then((response) => {
                console.log(response.data.message);
                console.log(
                    "ID DE INTERESADO INSERTADO ==== " +
                        JSON.stringify(response.data.idInteresado)
                );

                const newIntrElem = {
                    id: response.data.idInteresado,
                    name: newName,
                    position: newPosition,
                    organization: newOrganization,
                };

                setInteresados([...interesados, newIntrElem]);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const updateInteresado = (
        idSelected,
        newName,
        newPosition,
        newOrganization
    ) => {
        const updURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/ActaConstitucion/modificarInteresado";
        axios
            .put(updURL, {
                idInteresado: idSelected,
                nombre: newName,
                cargo: newPosition,
                organizacion: newOrganization,
            })
            .then((response) => {
                console.log(response.data);
                //actualizamos lista en id de modificado
                const updatedInteresados = interesados.map((intr) => {
                    if (intr.id === idSelected) {
                        return {
                            ...intr,
                            name: newName,
                            position: newPosition,
                            organization: newOrganization,
                        };
                    }
                    return intr;
                });
                setInteresados(updatedInteresados);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const deleteInteresado = (idSelected) => {
        const deleteURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/ActaConstitucion/eliminarInteresado";
        axios
            .put(deleteURL, {
                idInteresado: idSelected,
            })
            .then((response) => {
                console.log(response.data.message);
                //eliminamos de lista segun el id

                const newList = interesados.filter(
                    (intr) => intr.id !== idSelected
                );

                setInteresados(newList);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // Variables adicionales
    const pages = Math.ceil(interesados.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);

    // Items de tabla filtrados (busqueda, tipo de herramienta)
    const filteredItems = useMemo(() => {
        let filteredInteresados = [...interesados];

        if (hasSearchFilter) {
            filteredInteresados = filteredInteresados.filter((interesado) =>
                interesado.name
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }
        if (
            toolsFilter !== "all" &&
            Array.from(toolsFilter).length !== toolsOptions.length
        ) {
            filteredInteresados = filteredInteresados.filter((interesado) =>
                Array.from(toolsFilter).includes(interesado.tools)
            );
        }

        return filteredInteresados;
    }, [interesados, filterValue, toolsFilter]);

    // Items de tabla paginados
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    // Items de tabla ordenados
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    // Acciones relacionadas a paginacion y busqueda
    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    // Renderizado de contenidos de tabla (celdas, parte superior, y parte inferior)
    const renderCell = React.useCallback((template, columnKey) => {
        const cellValue = template[columnKey];

        switch (columnKey) {
            case "iconSrc":
                return <img src={cellValue} alt="Icono de plantilla"></img>;
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown aria-label="dropdownGen">
                            <DropdownTrigger aria-label="dropTrig">
                                <Button
                                    aria-label="dropBtn"
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                >
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="dropMenu">
                                <DropdownItem
                                    aria-label="editar"
                                    onPress={() => {
                                        setModalContentState(2);
                                        setIdSelected(template.id);
                                        setNewName(template.name);
                                        setNewPosition(template.position);
                                        setNewOrganization(
                                            template.organization
                                        );
                                        onOpen();
                                    }}
                                >
                                    Editar
                                </DropdownItem>
                                <DropdownItem
                                    aria-label="eliminar"
                                    className="text-danger"
                                    color="danger"
                                    onPress={() => {
                                        console.log(
                                            "vas a eliminar el de id " +
                                                template.id
                                        );
                                        setModalContentState(3);
                                        setIdSelected(template.id);
                                        onOpen();
                                    }}
                                >
                                    Eliminar
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por nombre..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                        variant="faded"
                    />
                    <div className="flex gap-3">
                        <Button color="secondary" endContent={<PlusIcon />}>
                            Exportar
                        </Button>
                        <Button
                            color="primary"
                            endContent={<PlusIcon />}
                            onPress={() => {
                                setModalContentState(1);
                                onOpen();
                            }}
                        >
                            Añadir Interesado
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total: {interesados.length} interesados
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        Filas por página:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        toolsFilter,
        onRowsPerPageChange,
        interesados.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400">
                    {selectedKeys === "all"
                        ? "Todos los items seleccionados"
                        : `${selectedKeys.size} de ${filteredItems.length} seleccionados`}
                </span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onPreviousPage}
                    >
                        Ant.
                    </Button>
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onNextPage}
                    >
                        Sig.
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    return (
        <>
            <div className="flex flex-row space-x-4 mb-4 mt-4">
                <h2 className="montserrat text-[#172B4D] font-bold text-2xl">
                    Lista de Interesados (StakeHolders)
                </h2>
                <img src="/icons/info-circle.svg" alt="Informacion"></img>
            </div>
            <Table
                aria-label="Tabla de plantillas"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[382px]",
                }}
                selectedKeys={selectedKeys}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSelectionChange={setSelectedKeys}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={
                                column.uid === "actions" ? "center" : "start"
                            }
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={"Aún no has agregado ningún interesado."}
                    items={sortedItems}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* <div className="flex flex-row space-x-4 mb-4">
                <TextInfoCard
                    key={1}
                    title={"Otros Interesados"}
                    data={[{ label: "", value: "Sebastian Chira (20191088)" }]}
                />
            </div> */}

            <Modal
                onOpenChange={onOpenChange}
                isDismissable={false}
                isOpen={isOpen}
                classNames={{
                    header: "pb-1",
                    body: "pb-0",
                    footer: "pt-3",
                }}
                size="lg"
            >
                <ModalContent>
                    {(onClose) => {
                        const cancelarModal = () => {
                            setNewName("");
                            setNewPosition("");
                            setNewOrganization("");
                            setValidName(true);
                            setValidPosition(true);
                            setValidOrganization(true);
                            onClose();
                        };
                        const cerrarModal = () => {
                            if (modalContentState === 3) {
                                deleteInteresado(idSelected);
                                onClose();
                            }
                            if (
                                modalContentState === 1 ||
                                modalContentState === 2
                            ) {
                                let allValid = true;
                                if (newName === "") {
                                    setValidName(false);
                                    allValid = false;
                                }
                                if (newPosition === "") {
                                    setValidPosition(false);
                                    allValid = false;
                                }
                                if (newOrganization === "") {
                                    setValidOrganization(false);
                                    allValid = false;
                                }
                                if (allValid === true) {
                                    if (modalContentState === 1) {
                                        console.log("paso la prueba, añade");
                                        console.log(newName);
                                        console.log(newPosition);
                                        console.log(newOrganization);
                                        addNewInteresado(
                                            newName,
                                            newPosition,
                                            newOrganization
                                        );
                                    }
                                    if (modalContentState === 2) {
                                        // updateHito(
                                        //     idSelected,
                                        //     newName,
                                        //     newDate
                                        // );
                                        console.log(
                                            "paso la prueba, actualiza"
                                        );
                                        updateInteresado(
                                            idSelected,
                                            newName,
                                            newPosition,
                                            newOrganization
                                        );
                                    }
                                    onClose();
                                }
                            }
                        };
                        return (
                            <>
                                <ModalHeader
                                    className={
                                        modalContentState === 3
                                            ? "flex flex-col gap-1 text-danger"
                                            : "flex flex-col gap-1"
                                    }
                                >
                                    {modalContentState === 1 &&
                                        "Agregar nuevo interesado"}
                                    {modalContentState === 2 &&
                                        "Editar interesado"}
                                    {modalContentState === 3 &&
                                        "Eliminar interesado"}
                                </ModalHeader>
                                <ModalBody>
                                    {modalContentState === 1 && (
                                        <div className="modalContentContainer">
                                            <div className="fieldAndHeaderCont">
                                                <p className="modalFieldHeader">
                                                    Nombre del interesado
                                                </p>
                                                <Textarea
                                                    isInvalid={!validName}
                                                    errorMessage={
                                                        !validName
                                                            ? "Debe introducir un nombre"
                                                            : ""
                                                    }
                                                    aria-label="custom-txt"
                                                    variant={"bordered"}
                                                    labelPlacement="outside"
                                                    placeholder={
                                                        "Escribe aquí!"
                                                    }
                                                    classNames={{
                                                        label: "pb-0",
                                                    }}
                                                    onValueChange={setNewName}
                                                    minRows={1}
                                                    size="sm"
                                                    onChange={() => {
                                                        setValidName(true);
                                                    }}
                                                />
                                            </div>

                                            <div className="fieldAndHeaderCont">
                                                <p className="modalFieldHeader">
                                                    Cargo del interesado
                                                </p>
                                                <Textarea
                                                    isInvalid={!validPosition}
                                                    errorMessage={
                                                        !validPosition
                                                            ? "Debe introducir un cargo"
                                                            : ""
                                                    }
                                                    aria-label="custom-txt"
                                                    variant={"bordered"}
                                                    labelPlacement="outside"
                                                    placeholder={
                                                        "Escribe aquí!"
                                                    }
                                                    classNames={{
                                                        label: "pb-0",
                                                    }}
                                                    onValueChange={
                                                        setNewPosition
                                                    }
                                                    minRows={1}
                                                    size="sm"
                                                    onChange={() => {
                                                        setValidPosition(true);
                                                    }}
                                                />
                                            </div>

                                            <div className="fieldAndHeaderCont">
                                                <p className="modalFieldHeader">
                                                    Organización del interesado
                                                </p>
                                                <Textarea
                                                    isInvalid={
                                                        !validOrganization
                                                    }
                                                    errorMessage={
                                                        !validOrganization
                                                            ? "Debe introducir un cargo"
                                                            : ""
                                                    }
                                                    aria-label="custom-txt"
                                                    variant={"bordered"}
                                                    labelPlacement="outside"
                                                    placeholder={
                                                        "Escribe aquí!"
                                                    }
                                                    classNames={{
                                                        label: "pb-0",
                                                    }}
                                                    onValueChange={
                                                        setNewOrganization
                                                    }
                                                    minRows={1}
                                                    size="sm"
                                                    onChange={() => {
                                                        setValidOrganization(
                                                            true
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {modalContentState === 2 && (
                                        <div className="modalContentContainer">
                                            <div className="fieldAndHeaderCont">
                                                <p className="modalFieldHeader">
                                                    Nombre del interesado
                                                </p>
                                                <Textarea
                                                    isInvalid={!validName}
                                                    errorMessage={
                                                        !validName
                                                            ? "Debe introducir un nombre"
                                                            : ""
                                                    }
                                                    aria-label="custom-txt"
                                                    variant={"bordered"}
                                                    labelPlacement="outside"
                                                    placeholder={
                                                        "Escribe aquí!"
                                                    }
                                                    classNames={{
                                                        label: "pb-0",
                                                    }}
                                                    value={newName}
                                                    onValueChange={setNewName}
                                                    minRows={1}
                                                    size="sm"
                                                    onChange={() => {
                                                        setValidName(true);
                                                    }}
                                                />
                                            </div>

                                            <div className="fieldAndHeaderCont">
                                                <p className="modalFieldHeader">
                                                    Cargo del interesado
                                                </p>
                                                <Textarea
                                                    isInvalid={!validPosition}
                                                    errorMessage={
                                                        !validPosition
                                                            ? "Debe introducir un cargo"
                                                            : ""
                                                    }
                                                    aria-label="custom-txt"
                                                    variant={"bordered"}
                                                    labelPlacement="outside"
                                                    placeholder={
                                                        "Escribe aquí!"
                                                    }
                                                    classNames={{
                                                        label: "pb-0",
                                                    }}
                                                    value={newPosition}
                                                    onValueChange={
                                                        setNewPosition
                                                    }
                                                    minRows={1}
                                                    size="sm"
                                                    onChange={() => {
                                                        setValidPosition(true);
                                                    }}
                                                />
                                            </div>

                                            <div className="fieldAndHeaderCont">
                                                <p className="modalFieldHeader">
                                                    Organización del interesado
                                                </p>
                                                <Textarea
                                                    isInvalid={
                                                        !validOrganization
                                                    }
                                                    errorMessage={
                                                        !validOrganization
                                                            ? "Debe introducir un cargo"
                                                            : ""
                                                    }
                                                    aria-label="custom-txt"
                                                    variant={"bordered"}
                                                    labelPlacement="outside"
                                                    placeholder={
                                                        "Escribe aquí!"
                                                    }
                                                    classNames={{
                                                        label: "pb-0",
                                                    }}
                                                    value={newOrganization}
                                                    onValueChange={
                                                        setNewOrganization
                                                    }
                                                    minRows={1}
                                                    size="sm"
                                                    onChange={() => {
                                                        setValidOrganization(
                                                            true
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {modalContentState === 3 && (
                                        <p>
                                            Seguro que desea eliminar este hito?
                                        </p>
                                    )}
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={cancelarModal}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={cerrarModal}
                                    >
                                        {modalContentState === 1 && "Agregar"}
                                        {modalContentState === 2 && "Aceptar"}
                                        {modalContentState === 3 && "Eliminar"}
                                    </Button>
                                </ModalFooter>
                            </>
                        );
                    }}
                </ModalContent>
            </Modal>
        </>
    );
}
