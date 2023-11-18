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
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Chip,
    User,
    Pagination,
    useDisclosure,
} from "@nextui-org/react";
import { ChevronDownIcon } from "@/../public/icons/ChevronDownIcon";
import { VerticalDotsIcon } from "@/../public/icons/VerticalDotsIcon";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import DeleteIcon from "@mui/icons-material/Delete";
import { SessionContext } from "../layout";
import axios from "axios";
import { set } from "date-fns";
import { dbDateToDisplayDate, dbDateToInputDate } from "@/common/dateFunctions";
import { Toaster, toast } from "sonner";


const columns = [
    { name: "Nombre", uid: "nombrePlantilla", sortable: true },
    { name: "Herramienta", uid: "nombreHerramienta", sortable: true },
    { name: "Fecha de creacion", uid: "fechaCreacion", sortable: true },
    { name: "Acciones", uid: "acciones" },
];

const toolsOptions = [
    { name: "Kanban", uid: "kanban" },
    { name: "Acta de constitucion", uid: "actaconst" },
    { name: "Matriz Responsabilidades", uid: "matrizresp" },
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

export default function MyTemplates() {
    
    // Variables de plantillas
    const [plantillasAC, setPlantillasAC] = useState([]);
    const [plantillasMR, setPlantillasMR] = useState([]);
    const [plantillasKB, setPlantillasKB] = useState([]);
    const [plantillasUnidas, setPlantillasUnidas] = useState([]);

    // Obtencion de idUsuario
    const [IdUsuario, setIdUsuario] = useState("");
    const { sessionData } = useContext(SessionContext);
    useEffect(() => {
        setIdUsuario(sessionData.idUsuario);
    }, [sessionData.idUsuario]);

    //Kanban
    const DataTable2 = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                        "/api/proyecto/plantillas/listarPlantillasKanban/" +
                        IdUsuario
                );

                resolve(response.data.plantillasKanban);
            } catch (error) {
                console.log("Error Plantilla MR");
                reject(error);
            }
        });
    };

    //Acta de constitucion
    const DataTable = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                        "/api/proyecto/plantillas/listarPlantillasAC/" +
                        IdUsuario
                );

                resolve(response.data.plantillasAC);
            } catch (error) {
                console.log("Error Plantilla MR");
                reject(error);
            }
        });
    };

    //Matriz de responsabilidades
    const DataTable1 = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                        "/api/proyecto/plantillas/listarPlantillasMR/" +
                        IdUsuario
                );

                resolve(response.data.plantillasMR);
            } catch (error) {
                console.log("Error Plantilla MR");
                reject(error);
            }
        });
    };

    // Unir todas las plantillas
    const fecthData = async () => {
        try {
            const pKB = await DataTable2();
            const pAC = await DataTable();
            const pMR = await DataTable1();

            setPlantillasKB(pKB);
            setPlantillasAC(pAC);
            setPlantillasMR(pMR);

            const pKBNombre = pKB.map(item => ({ ...item, nombreHerramienta: 'Kanban' }));
            const pAcNombre = pAC.map(item => ({ ...item, nombreHerramienta: 'Acta Constitución' }));
            const pMRNombre = pMR.map(item => ({ ...item, nombreHerramienta: 'Matriz Responsabilidades' }));

            const listaUnida = [...pAcNombre, ...pKBNombre, ...pMRNombre].map((item, index) => ({
                ...item,
                idPlantilla: index + 1,
            }));
            setPlantillasUnidas(listaUnida);

            // Asignar nuevo campo idPlantilla de forma consecutiva
            console.log("Todas las llamadas asincronas se han completado");
        } catch (error) {
            console.error("Error en fecthData:", error);
        }
    };

    // Funcion de effect inicial
    useEffect(() => {
        if (IdUsuario !== "") {
            console.log("idUsuario: " + IdUsuario);
            fecthData();
        }
    }, [IdUsuario]);

    console.log(plantillasUnidas);

    // Estados generales
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [toolsFilter, setToolsFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "nombreHerramienta",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    // Variables adicionales
    const pages = Math.ceil(plantillasUnidas.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);

    // Items de tabla filtrados (busqueda, tipo de herramienta)
    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...plantillasUnidas];

        if (hasSearchFilter) {
            filteredTemplates = filteredTemplates.filter((template) =>
                template.nombrePlantilla.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (
            toolsFilter !== "all" &&
            Array.from(toolsFilter).length !== toolsOptions.length
        ) {
            filteredTemplates = filteredTemplates.filter((template) =>
                Array.from(toolsFilter).includes(template.nombreHerramienta)
            );
        }

        return filteredTemplates;
    }, [plantillasUnidas, filterValue, toolsFilter]);

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
            case "acciones":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                
                                <DropdownItem onPress={()=>{
                                    onOpen();
                                    setPlantillaSeleccionada(template);
                                    }}>Eliminar</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );

            case "fechaCreacion":


                if(cellValue === null){
                return "Sin fecha"
                }else{
                return dbDateToDisplayDate(cellValue)
                }


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
                                    Herramienta
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={toolsFilter}
                                selectionMode="multiple"
                                onSelectionChange={setToolsFilter}
                            >
                                {toolsOptions.map((status) => (
                                    <DropdownItem key={status.uid}>
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total: {plantillasUnidas.length} plantillas
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
        plantillasUnidas.length,
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

    //Elimnacion Plantillas APIS

    const deletePlantilla = (template) => {
        var idPlanttillaEliminar;
        switch (template.nombreHerramienta) {
            case "Kanban":
                idPlanttillaEliminar=template.idPlantillaKanban;
                break;
            case "Acta Constitución":
                idPlanttillaEliminar=template.idPlantillaAC;
                break;
            case "Matriz Responsabilidades":
                idPlanttillaEliminar=template.idPlantillaMR;
                break;
            default:
                break;
        }

        console.log(idPlanttillaEliminar);
        console.log(template.nombreHerramienta);
        console.log(template.nombrePlantilla);

        return new Promise(async (resolve, reject) => {
            try {
                let url;
                let dataKey;
        
                switch (template.nombreHerramienta) {
                    case "Kanban":
                        url = "/api/proyecto/plantillas/eliminarPlantillaKanban";
                        dataKey = "idPlantillaKanban";
                        break;
                    case "Acta Constitución":
                        url = "/api/proyecto/plantillas/eliminarPlantillaAC";
                        dataKey = "idPlantillaAC";
                        break;
                    case "Matriz Responsabilidades":
                        url = "/api/proyecto/plantillas/eliminarPlantillaMR";
                        dataKey = "idPlantillaMR";
                        break;
                    default:
                        reject("Nombre de herramienta no reconocido");
                        return;
                }
        
                const response = await axios.delete(
                    process.env.NEXT_PUBLIC_BACKEND_URL + url,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        data: {
                            [dataKey]: idPlanttillaEliminar,
                        },
                    }
                );
        
                console.log('Deleted successfully', response);

                setPlantillasUnidas((prevPlantillas) =>
                    prevPlantillas.filter(
                        (plantilla) =>
                            plantilla.idPlantilla !== template.idPlantilla
                    )
                );

                resolve(response);
            } catch (error) {
                console.error('Error deleting', error);
                reject(error);
            }
        });
       
    };
    
    
    const eliminarPlantilla = async (plantillaSeleccionada) => {
        try {
            toast.promise(deletePlantilla(plantillaSeleccionada), {
                loading: "Eliminando Plantilla...",
                success: (data) => {
                    return "La plantilla se eliminó con éxito!";
                },
                error: "Error al eliminar plantilla",
                position: "bottom-right",
            });
        } catch (error) {
            throw error;
        }
    };
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [plantillaSeleccionada, setPlantillaSeleccionada] = useState({});

    return (

        <>



        <Toaster
            position="bottom-left"
            richColors
            theme={"light"}
            closeButton={true}
            toastOptions={{
                style: { fontSize: "1rem" },
            }}
        />

        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={
                {
                    //closeButton: "hidden",
                }
            }
        >
            <ModalContent>
                {(onClose) => {
                    const finalizarModal = () => {
                        eliminarPlantilla(plantillaSeleccionada);
                        onClose();
                    };
                    return (
                        <>
                            <ModalHeader className="flex flex-col text-red-500">
                                Eliminar una plantilla
                            </ModalHeader>
                            <ModalBody>
                                <div>
                                    ¿Seguro que desea eliminar esta plantilla?
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
                                >
                                    Aceptar
                                </Button>
                            </ModalFooter>
                        </>
                    );
                }}
            </ModalContent>
        </Modal>


            <div className="space-x-4 mb-2">
                <Breadcrumbs>
                    <BreadcrumbsItem
                        href="/dashboard"
                        text={"Inicio"}
                    ></BreadcrumbsItem>
                    <BreadcrumbsItem text={"Mis plantillas"}></BreadcrumbsItem>
                </Breadcrumbs>
            </div>
            <div className="flex flex-row space-x-4 mb-4">
                <h2 className="montserrat text-[#172B4D] font-bold text-2xl">
                    Mis plantillas
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
                                column.uid === "acciones" ? "center" : "start"
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
                        <TableRow key={item.idPlantilla}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
