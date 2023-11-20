"use client";

import React, { useState, useEffect, useCallback, useContext } from "react";
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
} from "@nextui-org/react";
import { ChevronDownIcon } from "@/../public/icons/ChevronDownIcon";
import { VerticalDotsIcon } from "@/../public/icons/VerticalDotsIcon";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

import { SmallLoadingScreen, HerramientasInfo } from "../layout";
import { dbDateToDisplayDate, dbDateToInputDate } from "@/common/dateFunctions";
import { toast, Toaster } from "sonner";
import axios from "axios";

axios.defaults.withCredentials = true;

const columns = [
    { name: "Nombre", uid: "name", sortable: true },
    { name: "Herramienta", uid: "tool", sortable: true },
    { name: "Fecha de creacion", uid: "dateCreated", sortable: true },
    { name: "Acciones", uid: "actions" },
];
const toolsOptions = [
    { name: "Kanban", uid: "active" },
    { name: "Acta de constitucion", uid: "paused" },
    { name: "Matriz Responsabilidades", uid: "vacation" },
];
const extensionOptions = [
    { name: ".docx", uid: "word" },
    { name: ".xlsx", uid: "excel" },
    { name: ".pptx", uid: "powerpoint" },
];
const templates = [
    {
        id: 1,
        name: "Backlog estandar 2023",
        tool: "Gestion del Product Backlog",
        dateCreated: "2021-10-01",
    },
    {
        id: 2,
        name: "Registro de equipos",
        tool: "Cronograma",
        dateCreated: "2021-10-02",
    },
    {
        id: 3,
        name: "Presupuesto",
        tool: "Backlog",
        dateCreated: "2021-10-03",
    },
    {
        id: 4,
        name: "Catalogo",
        tool: "Gestion del Product Backlog",
        dateCreated: "2021-10-01",
    },
    {
        id: 5,
        name: "Acta de constitucion",
        tool: "Cronograma",
        dateCreated: "2021-10-02",
    },
    {
        id: 6,
        name: "Matriz de retrospectivas",
        tool: "Backlog",
        dateCreated: "2021-10-03",
    },
];

let projectId = 0;

// Funciones de APIs
const getRepository = async (projectId) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/repositorioDocumento/obtenerRepositorio/` +
                    projectId
            )
            .then((response) => {
                console.log(response);
                resolve(response.data.repositorio);
            })
            .catch((error) => {
                console.error("Error al obtener el repositorio: ", error);
                reject(error);
            });
    });
};
const downloadDocument = async (projectId, idDocumento) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/repositorioDocumento/descargarDocumento/` +
                    projectId +
                    `/` +
                    idDocumento
            )
            .then((response) => {
                console.log(response);
                resolve(response.data.documento);
            })
            .catch((error) => {
                console.error("Error al obtener el documento: ", error);
                reject(error);
            });
    });
};
const uploadDocument = async (projectId, idDocumento, data) => {
    return new Promise((resolve, reject) => {
        axios
            .put(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/repositorioDocumento/subirDocumento/` +
                    projectId +
                    `/` +
                    idDocumento,
                data
            )
            .then((response) => {
                console.log(response);
                resolve(response.data.documento);
            })
            .catch((error) => {
                console.error("Error al subir el documento: ", error);
                reject(error);
            });
    });
};
const deleteDocument = async (projectId, idDocumento) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/repositorioDocumento/eliminarDocumento/` +
                    projectId +
                    `/` +
                    idDocumento
            )
            .then((response) => {
                console.log(response);
                resolve(response.data.documento);
            })
            .catch((error) => {
                console.error("Error al eliminar el documento: ", error);
                reject(error);
            });
    });
};

const repositorioDocumentos = (props) => {
    // Variables globales
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    setIsLoadingSmall(false);

    // Variables y funciones de uso
    const [repository, setRepository] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    
    const handleGet = useCallback(
        async (projectId) => {
            setIsLoadingSmall(true);
            try {
                const repository = await getRepository(projectId);
                console.log(repository);
                setRepository(repository);
            } catch (error) {
                console.error(error);
                toast.error("Error al obtener los datos del repositorio.");
            } finally {
                setIsLoadingSmall(false);
            }
        },
    );
    const handleDownload = useCallback(
        async (projectId, idDocumento) => {
            const toastId = toast("Sonner");
            toast.loading("Descargando documento...", {
                id: toastId,
            });
            try {
                const document = await downloadDocument(projectId, idDocumento);
                console.log(document);
                toast.success("El documento se ha descargado exitosamente.", {
                    id: toastId,
                });
            } catch (error) {
                console.error(error);
                toast.error("Error al descargar el documento.", {
                    id: toastId,
                });
            }
        },
    );
    const handleUpload = useCallback(
        async (projectId, idDocumento, data) => {
            const toastId = toast("Sonner");
            toast.loading("Subiendo documento...", {
                id: toastId,
            });
            try {
                const document = await uploadDocument(projectId, idDocumento, data);
                console.log(document);
                toast.success("El documento se ha subido exitosamente.", {
                    id: toastId,
                });
            } catch (error) {
                console.error(error);
                toast.error("Error al subir el documento.", {
                    id: toastId,
                });
            }
        },
    );
    const handleDelete = useCallback(
        async (projectId, idDocumento) => {
            const toastId = toast("Sonner");
            toast.loading("Eliminando documento...", {
                id: toastId,
            });
            try {
                const document = await deleteDocument(projectId, idDocumento);
                console.log(document);
                toast.success("El documento se ha eliminado exitosamente.", {
                    id: toastId,
                });
            } catch (error) {
                console.error(error);
                toast.error("Error al eliminar el documento.", {
                    id: toastId,
                });
            }
        },
    );

    useEffect(() => {
        handleGet(projectId);
    }, []);

    // Estados generales (uso de tabla)
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [extensionFilter, setExtensionFilter] = React.useState("all");
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
            extensionFilter !== "all" &&
            Array.from(extensionFilter).length !== toolsOptions.length
        ) {
            filteredTemplates = filteredTemplates.filter((template) =>
                Array.from(extensionFilter).includes(template.tools)
            );
        }

        return filteredTemplates;
    }, [templates, filterValue, extensionFilter]);

    // Items de tabla paginados
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    // Items de tabla ordenados
    const sortedItems = React.useMemo(() => {
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
                                <DropdownItem>Descargar</DropdownItem>
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
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex .roboto">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                    className="font-['Roboto']"
                                >
                                    Extensión
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={extensionFilter}
                                selectionMode="multiple"
                                onSelectionChange={setExtensionFilter}
                            >
                                {extensionOptions.map((status) => (
                                    <DropdownItem key={status.uid}>
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button color="success" startContent={<PlusIcon />}>
                            Subir documento
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total: {templates.length} documentos
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
        extensionFilter,
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

    return (
        <div className="p-10">
            <div className="space-x-4 mb-2">
                <Breadcrumbs>
                    <BreadcrumbsItem
                        href="/dashboard"
                        text={"Inicio"}
                    ></BreadcrumbsItem>
                    <BreadcrumbsItem
                        href="/dashboard"
                        text={"Proyectos"}
                    ></BreadcrumbsItem>
                    <BreadcrumbsItem
                        href={"/dashboard/" + projectName + "=" + projectId}
                        text={projectName}
                    ></BreadcrumbsItem>
                    <BreadcrumbsItem
                        text={"Repositorio de documentos"}
                    ></BreadcrumbsItem>
                </Breadcrumbs>
            </div>
            <div className="flex flex-row space-x-4 mb-4">
                <h2 className="montserrat text-[#172B4D] font-bold text-2xl">
                    Repositorio de documentos
                </h2>
            </div>
            <Table
                aria-label="Tabla de documentos"
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
                    emptyContent={"Sin documentos registrados"}
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
        </div>
    );
};

export default repositorioDocumentos;
