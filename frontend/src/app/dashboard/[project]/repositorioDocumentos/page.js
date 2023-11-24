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
    Pagination,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import { ChevronDownIcon } from "@/../public/icons/ChevronDownIcon";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { ExportIcon } from "@/../public/icons/ExportIcon";
import { DeleteDocumentIcon } from "public/icons/deleteDocument";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

import { SmallLoadingScreen, HerramientasInfo } from "../layout";
import { dbDateToDisplayDate, dbDateToInputDate } from "@/common/dateFunctions";
import { toast, Toaster } from "sonner";
import axios from "axios";

axios.defaults.withCredentials = true;

const columns = [
    { name: "Nombre", uid: "nombreReal", sortable: true },
    { name: "Extension", uid: "tipoArchivo", sortable: true },
    { name: "Tamaño", uid: "tamano", sortable: true },
    { name: "Fecha de registro", uid: "fechaSubida", sortable: true },
    { name: "Acciones", uid: "actions" },
];
const extensionOptions = [
    { name: ".docx", uid: "docx" },
    { name: ".xlsx", uid: "xlsx" },
    { name: ".pptx", uid: "pptx" },
    { name: ".pdf", uid: "pdf" },
    { name: ".png", uid: "png" },
    { name: "Otros", uid: "otros" },
];

let projectId = 0;
let idRepositorioDocumentos = 0;

// Funciones de APIs
const getRepository = async (idRepositorioDocumentos) => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("Tiempo de espera agotado"));
        }, 10000); // 10 segundos de tiempo de espera

        axios
            .get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/repositorioDocumento/listarArchivos/ ` +
                    idRepositorioDocumentos
            )
            .then((response) => {
                clearTimeout(timeout);
                console.log(response);
                resolve(response.data.archivos);
            })
            .catch((error) => {
                clearTimeout(timeout);
                console.error("Error al obtener el repositorio: ", error);
                reject(error);
            });
    });
};
const downloadDocument = async (idDocumento) => {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error("Tiempo de espera agotado"));
        }, 10000); // 10 segundos de tiempo de espera

        axios
            .get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/repositorioDocumento/getArchivo/` +
                    idDocumento
            )
            .then((response) => {
                clearTimeout(timeout);
                console.log(response);
                console.log(response.data.url);
                resolve(response.data.url);
            })
            .catch((error) => {
                clearTimeout(timeout);
                console.error("Error al obtener el documento: ", error);
                reject(error);
            });
    });
};
const uploadDocument = async (documento) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/repositorioDocumento/subirArchivo`,
                documento,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                console.log(response);
                resolve();
            })
            .catch((error) => {
                console.error("Error al subir el documento: ", error);
                reject(error);
            });
    });
};
const deleteDocument = async (idDocumento) => {
    return new Promise((resolve, reject) => {
        axios
            .delete(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/repositorioDocumento/eliminarArchivo`,
                {
                    data: {
                        idArchivo: idDocumento,
                    },
                }
            )
            .then((response) => {
                console.log(response);
                resolve();
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
    const { herramientasInfo } = useContext(HerramientasInfo);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    idRepositorioDocumentos = herramientasInfo.find(
        (herramienta) => herramienta.idHerramienta === 14
    ).idHerramientaCreada;
    console.log(idRepositorioDocumentos);

    // Variables de modales
    const {
        isOpen: isModalDeleteOpen,
        onOpen: onModalDeleteOpen,
        onOpenChange: onModalDeleteChange,
    } = useDisclosure();

    // Variables y funciones de uso
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);

    const handleGet = useCallback(async (idRepositorioDocumentos) => {
        setIsLoadingSmall(true);
        try {
            const repository = await getRepository(idRepositorioDocumentos);
            console.log(repository);
            if (repository === undefined) setDocuments([]);
            else setDocuments(repository);
        } catch (error) {
            console.error(error);
            toast.error("Error al obtener los datos del repositorio.");
        } finally {
            setIsLoadingSmall(false);
        }
    });
    const handleDownload = useCallback(async (nombreDocumento, idDocumento) => {
        const toastId = toast("Sonner");
        toast.loading("Descargando documento...", {
            id: toastId,
        });
        const link = document.createElement("a");
        try {
            const url = await downloadDocument(idDocumento);
            console.log(url);

            link.href = url;
            link.download = nombreDocumento;
            document.body.appendChild(link);
            link.click();

            toast.success("El documento se ha descargado exitosamente.", {
                id: toastId,
            });
        } catch (error) {
            console.error(error);
            toast.error("Error al descargar el documento.", {
                id: toastId,
            });
        } finally {
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
        }
    });
    const handleUpload = useCallback(async (documento) => {
        const toastId = toast("Sonner");
        toast.loading("Subiendo documento...", {
            id: toastId,
        });
        try {
            await uploadDocument(documento);
            toast.success("El documento se ha subido exitosamente.", {
                id: toastId,
            });
            await handleGet(idRepositorioDocumentos);
        } catch (error) {
            console.error(error);
            toast.error("Error al subir el documento.", {
                id: toastId,
            });
        }
    });
    const handleDelete = useCallback(async (idDocumento) => {
        const toastId = toast("Sonner");
        toast.loading("Eliminando documento...", {
            id: toastId,
        });
        try {
            const document = await deleteDocument(idDocumento);
            console.log(document);
            toast.success("El documento se ha eliminado exitosamente.", {
                id: toastId,
            });
            await handleGet(idRepositorioDocumentos);
        } catch (error) {
            console.error(error);
            toast.error("Error al eliminar el documento.", {
                id: toastId,
            });
        }
    });

    useEffect(() => {
        handleGet(idRepositorioDocumentos);
    }, []);
    console.log(selectedDocument);

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
    const pages = Math.ceil(documents.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);

    // Items de tabla filtrados (busqueda, tipo de herramienta)
    const filteredItems = React.useMemo(() => {
        let filteredDocuments = [...documents];

        if (hasSearchFilter) {
            filteredDocuments = filteredDocuments.filter((document) =>
                document.nombreReal
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }
        if (
            extensionFilter !== "all" &&
            Array.from(extensionFilter).length !== extensionOptions.length
        ) {
            if (Array.from(extensionFilter).includes("otros")) {
                filteredDocuments = filteredDocuments.filter(
                    (document) =>
                        !extensionOptions
                            .filter(
                                (option) =>
                                    !Array.from(extensionFilter).includes(
                                        option.uid
                                    )
                            )
                            .map((option) => option.uid)
                            .includes(document.tipoArchivo)
                );
            } else {
                filteredDocuments = filteredDocuments.filter((document) =>
                    Array.from(extensionFilter).includes(document.tipoArchivo)
                );
            }
        }

        return filteredDocuments;
    }, [documents, filterValue, extensionFilter]);

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

    // Funciones de conversion de datos
    const convertBytesToMegabytes = React.useCallback((bytes) => {
        return (bytes / (1024 * 1024)).toFixed(2);
    }, []);
    const convertBytesToKilobytes = React.useCallback((bytes) => {
        return (bytes / 1024).toFixed(2);
    }, []);

    // Renderizado de contenidos de tabla (celdas, parte superior, y parte inferior)
    const renderCell = React.useCallback((document, columnKey) => {
        const cellValue = document[columnKey];

        switch (columnKey) {
            case "nombreReal":
                return cellValue.substring(0, cellValue.lastIndexOf("."));
            case "tipoArchivo":
                return "." + cellValue;
            case "tamano":
                if (cellValue >= 1024 * 1024)
                    return convertBytesToMegabytes(cellValue) + " MB";
                else if (cellValue >= 1024)
                    return convertBytesToKilobytes(cellValue) + " KB";
                else return cellValue + " B";
            case "fechaSubida":
                return dbDateToDisplayDate(cellValue);
            case "actions":
                return (
                    <div className="relative flex justify-start items-center gap-2">
                        <Button
                            isIconOnly
                            variant="default"
                            onPress={() => {
                                setSelectedDocument(document);
                                handleDownload(
                                    document.nombreReal,
                                    document.idArchivo
                                );
                            }}
                        >
                            <ExportIcon />
                        </Button>
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={() => {
                                setSelectedDocument(document);
                                onModalDeleteOpen();
                            }}
                        >
                            <DeleteDocumentIcon width="1.5em" height="auto" />
                        </Button>
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
                        <Input
                            type="file"
                            id="fileInput"
                            onChange={(e) => {
                                const selectedFile = e.target.files[0];
                                if (selectedFile) {
                                    const file = new FormData();
                                    file.append(
                                        "idRepositorioDocumentos",
                                        idRepositorioDocumentos
                                    );
                                    file.append(
                                        "extension",
                                        selectedFile.name.substring(
                                            selectedFile.name.lastIndexOf(".") +
                                                1
                                        )
                                    );
                                    file.append("file", selectedFile);
                                    handleUpload(file);
                                }
                            }}
                            className="hidden"
                        />
                        <Button
                            type="file"
                            id="fileInput"
                            color="success"
                            startContent={<PlusIcon />}
                            onPress={() => {
                                const fileInput =
                                    document.getElementById("fileInput");
                                fileInput.click();
                            }}
                        >
                            Subir documento
                        </Button>
                        <div className="roboto text-xs text-default-500 flex flex-col justify-center items-center whitespace-nowrap">
                            <span>Max.</span>
                            <span>50 MB</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total: {documents.length} documentos
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
        documents.length,
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
                                align={"center"}
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
                            <TableRow key={item.idArchivo}>
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

            <ModalDeleteDocument
                isOpen={isModalDeleteOpen}
                onOpenChange={onModalDeleteChange}
                handleDelete={handleDelete}
                selectedDocument={selectedDocument}
            />
        </>
    );
};

function ModalDeleteDocument({
    isOpen,
    onOpenChange,
    handleDelete,
    selectedDocument,
}) {
    // Variables generales
    const [isSending, setIsSending] = useState(false);

    // Componente de modal
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            isDismissable={false}
        >
            <ModalContent>
                {(onClose) => {
                    const endDelete = async () => {
                        setIsSending(true);
                        await handleDelete(selectedDocument.idArchivo);
                        setIsSending(false);
                        onClose();
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Eliminar documento
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    ¿Seguro que desea eliminar este doocumento?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={endDelete}
                                    isLoading={isSending}
                                    isDisabled={isSending}
                                >
                                    Eliminar
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>
    );
}

export default repositorioDocumentos;
