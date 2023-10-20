"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Textarea,
} from "@nextui-org/react";
import "@/styles/dashboardStyles/projectStyles/actaConstStyles/cronogramaACPage.css";
import { VerticalDotsIcon } from "@/../public/icons/VerticalDotsIcon";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import axios from "axios";
import DateInput from "@/components/DateInput";
axios.defaults.withCredentials = true;

const columns = [
    { name: "Hito", uid: "name", sortable: true },
    //{ name: "Estado", uid: "state", sortable: true },
    { name: "Fecha Tope", uid: "dateModified", sortable: true },
    { name: "Acciones", uid: "actions" },
];

const toolsOptions = [{ name: "Sebastian Chira", uid: "paused" }];

const templates = [
    {
        id: 1,
        name: "Descripcion Hito 1",
        dateCreated: "2021-10-01",
        dateModified: "2021-10-01",
        state: "No iniciado",
    },
    {
        id: 2,
        name: "Descripcion Hito 2",
        dateCreated: "2021-10-02",
        dateModified: "2021-10-01",
        state: "No iniciado",
    },
    {
        id: 3,
        name: "Descripcion Hito 3",
        dateCreated: "2021-10-03",
        dateModified: "2021-10-01",
        state: "No iniciado",
    },
    {
        id: 4,
        name: "Descripcion Hito 4",
        dateCreated: "2021-10-01",
        dateModified: "2021-10-01",
        state: "No iniciado",
    },
    {
        id: 5,
        name: "Descripcion Hito 5",
        dateCreated: "2021-10-02",
        dateModified: "2021-10-01",
        state: "No iniciado",
    },
    {
        id: 6,
        name: "Descripcion Hito 6",
        dateCreated: "2021-10-03",
        dateModified: "2021-10-01",
        state: "No iniciado",
    },
];

export default function CronogramaActa(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    //const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Estados generales
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [toolsFilter, setToolsFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "name",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    // Variables adicionales
    const pages = Math.ceil(templates.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);

    // Items de tabla filtrados (busqueda, tipo de herramienta)
    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...templates];

        if (hasSearchFilter) {
            filteredTemplates = filteredTemplates.filter((template) =>
                template.name.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (
            toolsFilter !== "all" &&
            Array.from(toolsFilter).length !== toolsOptions.length
        ) {
            filteredTemplates = filteredTemplates.filter((template) =>
                Array.from(toolsFilter).includes(template.tools)
            );
        }

        return filteredTemplates;
    }, [templates, filterValue, toolsFilter]);

    // Initialize hito on page load
    useEffect(() => {
        initializeHito();
    }, []);

    const initializeHito = () => {
        const listHitoURL =
            "http://localhost:8080/api/proyecto/ActaConstitucion/listarHito/" +
            projectId;
        axios
            .get(listHitoURL)
            .then((response) => {
                console.log(response.data.message);
                console.log(
                    "LISTA DE INTERESADOS ==== " +
                        JSON.stringify(response.data.hitoAC)
                );
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // Function to insert a new hito
    const insertarHito = async () => {
        try {
            const response = await axios.post("/api/insertarHito", { hito });
        } catch (error) {
            console.error("Error inserting hito:", error);
        }
    };

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
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem>Editar</DropdownItem>
                                <DropdownItem>Eliminar</DropdownItem>
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
                            onPress={onOpen}
                        >
                            Añadir Interesado
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total: {templates.length} interesados
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
        templates.length,
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

    const [newName, setNewName] = useState("");
    const [validName, setValidName] = useState(true);
    const [newDate, setNewDate] = useState("");
    const [validDate, setValidDate] = useState(true);

    return (
        <>
            <div className="flex flex-row space-x-4 mb-4">
                <h2 className="montserrat text-[#172B4D] font-bold text-2xl">
                    Lista de Hitos
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
                    emptyContent={"Sin plantillas registradas"}
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
                            //setFieldToDelete(null);
                            onClose();
                        };
                        const cerrarModal = () => {
                            let allValid = true;
                            if (newName === "") {
                                setValidName(false);
                                allValid = false;
                            }
                            if (newDate === "") {
                                setValidDate(false);
                                allValid = false;
                            }
                            if (allValid === true) {
                                onClose();
                            }
                        };
                        return (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Eliminar campo
                                </ModalHeader>
                                <ModalBody>
                                    <div className="modalContentContainer">
                                        <div className="fieldAndHeaderCont">
                                            <p className="modalFieldHeader">
                                                Nombre del hito
                                            </p>
                                            <Textarea
                                                isInvalid={!validName}
                                                errorMessage={
                                                    !validName
                                                        ? "Debe introducir un nombre"
                                                        : ""
                                                }
                                                //key={"bordered"}
                                                aria-label="custom-txt"
                                                variant={"bordered"}
                                                labelPlacement="outside"
                                                placeholder={"Escribe aquí!"}
                                                classNames={{ label: "pb-0" }} //falta setear un tamano al textbox para que no cambie de tamano al cambiar de no editable a editable
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
                                                Fecha tope
                                            </p>
                                            <DateInput
                                                className={""}
                                                isInvalid={!validDate}
                                                onChangeHandler={(e) => {
                                                    setValidDate(true);
                                                }}
                                            ></DateInput>
                                            {!validDate && (
                                                <p>Debe elegir una fecha</p>
                                            )}
                                        </div>
                                    </div>
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
                                        Agregar
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
