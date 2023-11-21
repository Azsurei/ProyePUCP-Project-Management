"use client";
import InConstruction from "@/common/InConstruction";
import { useState, useEffect, useCallback, useContext } from "react";
import { SmallLoadingScreen } from "../layout";
import Link from "next/link";
import MyDynamicTable from "@/components/DynamicTable";
import React from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import {
    Input,
    Button,
    Pagination,
    useDisclosure,
    Tooltip,
} from "@nextui-org/react";
import { ChevronDownIcon } from "@/../public/icons/ChevronDownIcon";
import { VerticalDotsIcon } from "@/../public/icons/VerticalDotsIcon";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { m } from "framer-motion";
import PopUpEliminateAll from "@/components/PopUpEliminateAll";
import { useRouter } from "next/navigation";
import "@/styles/dashboardStyles/projectStyles/catalogoDeRiesgosStyles/catalogoRiesgos.css";
import RouteringRC from "@/components/dashboardComps/projectComps/catalogoDeRiesgosComps/RouteringCR";
import ModalEliminateRC from "@/components/dashboardComps/projectComps/catalogoDeRiesgosComps/ModalEliminateRC";
export default function catalogoDeRiesgos(props) {
    const router = useRouter();
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const stringPrueba =
        "http://localhost:8080/api/proyecto/catalogoRiesgos/listarRiesgos/100";
    console.log(projectId);
    console.log(projectName);

    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [data, setData] = useState([]);
    const [objectRC, setObjectRC] = useState(null);
    const [navegate, setNavegate] = useState(false);
    const [navegateRegister, setNavegateRegister] = useState(false);
    const [edit, setEdit] = useState(false);
    function DataTable() {
        setIsLoadingSmall(true);
        const fetchData = async () => {
            try {
                // Realiza la solicitud HTTP al endpoint del router
                const stringURL =
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/catalogoRiesgos/listarRiesgos/" +
                    projectId;
                const response = await axios.get(stringURL);

                // Actualiza el estado 'data' con los datos recibidos
                // setIdMatriz(response.data.matrizComunicacion.idMatrizComunicacion);
                setData(response.data.riesgos);
                console.log(`Esta es la data:`, data);
                console.log(
                    `Datos obtenidos exitosamente:`,
                    response.data.riesgos
                );
                setIsLoadingSmall(false);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        fetchData();
    }

    useEffect(() => {
        DataTable();
    }, []);

    const toggleModal = (task) => {
        setSelectedTask(task);
        console.log("El id del objeto es: ", selectedTask);
        setModal1(!modal1);
    };
    const setRoutering = (objectID, isEdit) => {
        setObjectRC(objectID);
        console.log("El id del objeto MC es: ", objectRC);
        setNavegate(!navegate);
        setEdit(isEdit);
    };
    const columns = [
        {
            name: "Riesgo",
            uid: "nombreRiesgo",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Fecha identificacion",
            uid: "fechaIdentificacion",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Probabilidad",
            uid: "nombreProbabilidad",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Dueño del riesgo",
            uid: "nombres",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Estado",
            uid: "estado",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: " ",
            uid: "actions",
            className:
                "w-12 px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: false,
        },
    ];
    // const data = [
    //     {
    //         id: 1,
    //         nombreRiesgo: 'Riesgos de recursos',
    //         fechaRiesgo: '07/09/2023',
    //         severidadRiesgo: 'Baja',
    //         dueñoRiesgo: 'Anthony Estrada',
    //         estadoRiesgo: 'Estado',
    //     },

    // ];
    const toolsOptions = [
        { name: "Herramienta 1", uid: "active" },
        { name: "Herramienta 2", uid: "paused" },
        { name: "Herramienta 3", uid: "vacation" },
    ];
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [toolsFilter, setToolsFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "descripcion",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    // Variables adicionales
    const pages = Math.ceil(data.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...data];

        if (hasSearchFilter) {
            filteredTemplates = filteredTemplates.filter((data) =>
                data.nombreRiesgo
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }
        if (
            toolsFilter !== "all" &&
            Array.from(toolsFilter).length !== toolsOptions.length
        ) {
            filteredTemplates = filteredTemplates.filter((data) =>
                Array.from(toolsFilter).includes(data.nombreRiesgo)
            );
        }

        return filteredTemplates;
    }, [data, filterValue, toolsFilter]);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

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

    const renderCell = React.useCallback((data, columnKey) => {
        const cellValue = data[columnKey];

        switch (columnKey) {
            case "fechaIdentificacion":
                const date = new Date(cellValue);
                if (!isNaN(date)) {
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                }
            case "actions":
                return (
                    <div className="relative flex justify-center items-center gap-2">
                        {/* <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem onClick={() => 
                                    setRoutering(data)
                                }>
                                
                                        Editar 
                                </DropdownItem>

                                <DropdownItem onClick={() => toggleModal(data)}>Eliminar</DropdownItem>
                            </DropdownMenu>
                        </Dropdown> */}
                        <div className="flex">
                            <Tooltip content="Visualizar" color="primary">
                                <button
                                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-8 md:h-8"
                                    type="button"
                                    onClick={() => {
                                        setRoutering(data, false);
                                    }}
                                >
                                    <img src="/icons/view.svg" />
                                    {/* <EyeFilledIcon /> */}
                                </button>
                            </Tooltip>
                            <Tooltip content="Editar" color="warning">
                                <button
                                    className=""
                                    type="button"
                                    onClick={() => {
                                        setRoutering(data, true);
                                    }}
                                >
                                    <img src="/icons/editar.svg" />
                                </button>
                            </Tooltip>
                            <Tooltip content="Eliminar" color="danger">
                                <button
                                    className=""
                                    type="button"
                                    onClick={() => toggleModal(data)}
                                >
                                    <img src="/icons/eliminar.svg" />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-10">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por riesgo..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                        variant="faded"
                    />
                    <div className="flex gap-3">
                        <Button
                            color="primary"
                            endContent={<PlusIcon />}
                            className="btnAddRiesgo"
                            onPress={() => {
                                router.push(
                                    "/dashboard/" +
                                        projectName +
                                        "=" +
                                        projectId +
                                        "/catalogoDeRiesgos/registerCR"
                                );
                            }}
                        >
                            Agregar
                        </Button>
                        <Button
                            color="primary"
                            endContent={<PlusIcon />}
                            className="btnRiesgosExport"
                        >
                            Exportar
                        </Button>
                        <Button
                            color="danger"
                            endContent={<PlusIcon />}
                            className="btnRiesgosEliminar"
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total: {data.length} riesgos
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
        data.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center gap-4">
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
        <div className="container">
            <div className="header">
                Inicio / Proyectos / Nombre del proyecto / Catálogo de Riesgos
            </div>
            <div className="catalogoRiesgos">
                <div className="titleRiesgos dark:text-white">
                    Catálogo de Riesgos
                </div>
                <div>
                    <MyDynamicTable
                        label="Tabla Riesgos"
                        bottomContent={bottomContent}
                        selectedKeys={selectedKeys}
                        setSelectedKeys={setSelectedKeys}
                        sortDescriptor={sortDescriptor}
                        setSortDescriptor={setSortDescriptor}
                        topContent={topContent}
                        columns={columns}
                        sortedItems={sortedItems}
                        renderCell={renderCell}
                        idKey="idRiesgo"
                    />
                </div>
            </div>
            {modal1 && selectedTask && (
                <ModalEliminateRC
                    modal={modal1}
                    toggle={() => toggleModal(selectedTask)} // Pasa la función como una función de flecha
                    taskName={selectedTask.nombreRiesgo}
                    idRiesgo={selectedTask.idRiesgo}
                    refresh={DataTable}
                />
            )}
            {navegate && objectRC.idRiesgo && (
                <RouteringRC
                    proy_name={projectName}
                    proy_id={projectId}
                    idRC={objectRC.idRiesgo}
                    isEdit={edit}
                />
            )}
        </div>
    );
}
