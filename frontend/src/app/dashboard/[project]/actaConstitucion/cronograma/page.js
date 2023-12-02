"use client";
import "@/styles/dashboardStyles/projectStyles/cronogramaStyles/cronogramaPage.css";

import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
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
import { SmallLoadingScreen } from "../../layout";
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
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [listHito, setListHito] = useState([]);
    const [modalContentState, setModalContentState] = useState(0);
    //1 es estado de anadir nuevo hito
    //2 es estado de editar hito
    //3 es estado de eliminar hito

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
    const pages = Math.ceil(listHito.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);

    // Items de tabla filtrados (busqueda, tipo de herramienta)
    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...listHito];

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
    }, [listHito, filterValue, toolsFilter]);

    // Initialize hito on page load
    useEffect(() => {
        initializeHito();
    }, []);

    const initializeHito = () => {
        setIsLoadingSmall(true);
        const listHitoURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/ActaConstitucion/listarHito/" +
            projectId;
        axios
            .get(listHitoURL)
            .then((response) => {
                console.log(response.data.message);
                console.log(
                    "LISTA DE HITOS ==== " +
                        JSON.stringify(response.data.hitoAC)
                );
                const hitosArray = response.data.hitoAC.map((hito) => {
                    const formattedDate = new Date(hito.fechaLimite);
                    return {
                        id: hito.idHito,
                        name: hito.descripcion,
                        dateCreated: formattedDate.toLocaleDateString(),
                        dateModified: formattedDate.toLocaleDateString(),
                        state: "esto es inutil",
                    };
                });
                setListHito(hitosArray);
                setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
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
                        <Dropdown aria-label="dropdownmain">
                            <DropdownTrigger aria-label="dropdowntrig">
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="dropdownmenu">
                                <DropdownItem
                                    onPress={() => {
                                        console.log(
                                            "editar con id " +
                                                template.id +
                                                ", nombre " +
                                                template.name +
                                                " y fecha " +
                                                template.dateCreated +
                                                "."
                                        );

                                        const parts =
                                            template.dateCreated.split("/");
                                        console.log(
                                            "part 1 = " +
                                                parts[0] +
                                                " part 2 = " +
                                                parts[1] +
                                                " part 3 = " +
                                                parts[2]
                                        );
                                        if (parts[0].length === 1) {
                                            parts[0] = "0" + parts[0];
                                        }
                                        if (parts[1].length === 1) {
                                            parts[1] = "0" + parts[0];
                                        }
                                        const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                                        console.log(
                                            "NUEVA FECHA INICIO:" +
                                                formattedDate
                                        );

                                        setModalContentState(2);
                                        setIdSelected(template.id);
                                        setNewDate(formattedDate);
                                        setNewName(template.name);
                                        onOpen();
                                    }}
                                >
                                    Editar
                                </DropdownItem>
                                <DropdownItem
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
                        Total: {listHito.length} interesados
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
        listHito.length,
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
    //para updates
    const [idSelected, setIdSelected] = useState(null);

    const addNewHito = (hitoName, hitoDate) => {
        const addURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/ActaConstitucion/insertarHito";
        axios
            .post(addURL, {
                idProyecto: projectId,
                descripcion: hitoName,
                fechaLimite: hitoDate,
            })
            .then((response) => {
                console.log(response.data);

                //aqui recibimos el id, por lo que podemos armar el objeto y agregarlo a la lista
                console.log("el date es " + hitoDate);
                const parts = hitoDate.split("-");
                const year = parts[0];
                const month = parseInt(parts[1], 10).toString();
                const day = parseInt(parts[2], 10).toString();
                const newHito = {
                    id: response.data.idHito,
                    name: hitoName,
                    dateCreated: `${day}/${month}/${year}`,
                    dateModified: `${day}/${month}/${year}`,
                    state: "esto es inutil",
                };

                setListHito([...listHito, newHito]);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const updateHito = (idSelected, hName, hDate) => {
        const addURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/ActaConstitucion/modificarHito";
        axios
            .put(addURL, {
                idHito: idSelected,
                descripcion: hName,
                fechaLimite: hDate,
            })
            .then((response) => {
                console.log(response.data);
                //actualizamos lista en id de modificado
                const updatedHitos = listHito.map((hito) => {
                    if (hito.id === idSelected) {
                        const parts = hDate.split("-");
                        const year = parts[0];
                        const month = parseInt(parts[1], 10).toString();
                        const day = parseInt(parts[2], 10).toString();
                        return {
                            ...hito,
                            name: hName,
                            dateCreated: `${day}/${month}/${year}`,
                            dateModified: `${day}/${month}/${year}`,
                        };
                    }
                    return hito;
                });
                setListHito(updatedHitos);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const deleteHito = (idSelected) => {
        const deleteURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/ActaConstitucion/eliminarHito";
        axios
            .put(deleteURL, {
                idHito: idSelected,
            })
            .then((response) => {
                console.log(response.data.message);
                //eliminamos de lista segun el id

                const newList = listHito.filter(
                    (hito) => hito.id !== idSelected
                );

                setListHito(newList);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <>
            <div className="flex flex-row space-x-4 mb-4 mt-4">
                <h2 className="montserrat text-[#172B4D] font-bold text-2xl dark:text-white">
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
                    emptyContent={"Aún no has agregado ningún hito."}
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
                            setNewName("");
                            setNewDate("");
                            onClose();
                        };
                        const cerrarModal = () => {
                            if (modalContentState === 3) {
                                deleteHito(idSelected);
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
                                if (newDate === "") {
                                    setValidDate(false);
                                    allValid = false;
                                }
                                if (allValid === true) {
                                    if (modalContentState === 1) {
                                        addNewHito(newName, newDate);
                                    }
                                    if (modalContentState === 2) {
                                        updateHito(
                                            idSelected,
                                            newName,
                                            newDate
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
                                        "Agregar nuevo hito"}
                                    {modalContentState === 2 && "Editar hito"}
                                    {modalContentState === 3 && "Eliminar hito"}
                                </ModalHeader>
                                <ModalBody>
                                    {modalContentState === 1 && (
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
                                                    placeholder={
                                                        "Escribe aquí!"
                                                    }
                                                    classNames={{
                                                        label: "pb-0",
                                                    }} //falta setear un tamano al textbox para que no cambie de tamano al cambiar de no editable a editable
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
                                                    isEditable={true}
                                                    className={""}
                                                    isInvalid={!validDate}
                                                    onChangeHandler={(e) => {
                                                        setNewDate(
                                                            e.target.value
                                                        );
                                                        setValidDate(true);
                                                    }}
                                                ></DateInput>
                                                {!validDate && (
                                                    <p className="text-tiny text-danger pl-1">
                                                        Debe elegir una fecha
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {modalContentState === 2 && (
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
                                                    placeholder={
                                                        "Escribe aquí!"
                                                    }
                                                    classNames={{
                                                        label: "pb-0",
                                                    }} //falta setear un tamano al textbox para que no cambie de tamano al cambiar de no editable a editable
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
                                                    value={newDate}
                                                    onChangeHandler={(e) => {
                                                        setNewDate(
                                                            e.target.value
                                                        );
                                                        setValidDate(true);
                                                    }}
                                                ></DateInput>
                                                {!validDate && (
                                                    <p className="text-tiny text-danger pl-1">
                                                        Debe elegir una fecha
                                                    </p>
                                                )}
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
