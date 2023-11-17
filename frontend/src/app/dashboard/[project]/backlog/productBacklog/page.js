"use client";
import "@/styles/dashboardStyles/projectStyles/productBacklog/productBacklog.css";

//import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
import { useState, useEffect, useCallback } from "react";
import PopUpEliminateHU from "@/components/PopUpEliminateHU";
import Link from "next/link";
import BacklogRow from "@/components/dashboardComps/projectComps/productBacklog/BacklogRow";
import TableComponent from "@/components/dashboardComps/projectComps/productBacklog/TableComponent";
import MyDynamicTable from "@/components/DynamicTable";
import { data } from "autoprefixer";
import React from "react";
import axios from "axios";
import RouteringBacklog from "@/components/dashboardComps/projectComps/productBacklog/RouteringBacklog";
import { useContext } from "react";
axios.defaults.withCredentials = true;
import {
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
    Tooltip,
} from "@nextui-org/react";
import { ChevronDownIcon } from "@/../public/icons/ChevronDownIcon";
import { VerticalDotsIcon } from "@/../public/icons/VerticalDotsIcon";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { m } from "framer-motion";
import PopUpEliminateAll from "@/components/PopUpEliminateAll";
import { useRouter } from "next/navigation";
import { SmallLoadingScreen } from "../../layout";

export default function ProductBacklog(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    console.log(projectId);
    console.log(projectName);

    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [data, setData] = useState([]);
    const [objectID, setObjectID] = useState(null);
    const [navegate, setNavegate] = useState(false);
    const [edit, setEdit] = useState(null);
    function DataTable() {
        setIsLoadingSmall(true);
        const fetchData = async () => {
            try {
                // Realiza la solicitud HTTP al endpoint del router
                const stringURL =
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/backlog/listarHistorias/" +
                    projectId;
                console.log("URL: ", stringURL);
                const response = await axios.get(stringURL);

                // Actualiza el estado 'data' con los datos recibidos
                setData(response.data.historias);
                console.log(
                    `Datos obtenidos exitosamente:`,
                    response.data.historias
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
        console.log(task.idHistoriaDeUsuario);
        setModal1(!modal1);
    };

    const setRoutering = (objectID, isEdit) => {
        setObjectID(objectID);
        setNavegate(!navegate);
        setEdit(isEdit);
    };

    const toggleModalAll = () => {
        setModal2(!modal2);
    };

    useEffect(() => {
        if (modal1 || modal2) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [modal1, modal2]);

    const columns = [
        {
            name: "Nombre",
            uid: "DescripcionHistoria",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Epica",
            uid: "NombreEpica",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Prioridad",
            uid: "NombrePrioridad",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Color",
            uid: "color",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: false,
        },
        {
            name: "Estado",
            uid: "NombreEstado",
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

    const toolsOptions = [
        { name: "Herramienta 1", uid: "active" },
        { name: "Herramienta 2", uid: "paused" },
        { name: "Herramienta 3", uid: "vacation" },
    ];

    //const [datas, setDatas] = useState([]);
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
                data.DescripcionHistoria.toLowerCase().includes(
                    filterValue.toLowerCase()
                )
            );
        }
        if (
            toolsFilter !== "all" &&
            Array.from(toolsFilter).length !== toolsOptions.length
        ) {
            filteredTemplates = filteredTemplates.filter((data) =>
                Array.from(toolsFilter).includes(data.DescripcionHistoria)
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
            case "iconSrc":
                return <img src={cellValue} alt="Icono de plantilla"></img>;
            case "actions":
                return (
                    <div className="relative flex justify-center items-center gap-2">
                        <div className="flex items-center">
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
            case "NombrePrioridad":
                return (
                    <span
                        className="p-1.5 text-sm uppercase tracking-wider rounded-lg bg-opacity-50"
                        style={{
                            backgroundColor:
                                data.ColorPrioridad || "transparent",
                        }}
                    >
                        {cellValue}
                    </span>
                );
            case "NombreEstado":
                return (
                    (cellValue && (
                        <span className="p-1.5 text-sm uppercase tracking-wider text-gray-800 bg-gray-200 rounded-lg bg-opacity-50">
                        {cellValue}
                    </span>
                    ))

                );
            case "color":
                return null;
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
                        placeholder="Buscar por nombre..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                        variant="faded"
                    />
                    <div className="flex gap-3">
                        {/* <Dropdown>
                            <DropdownTrigger className="hidden sm:flex .roboto">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                    className="font-['Roboto'] color-['#172B4D']"
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
                        </Dropdown> */}
                        <Link
                            href={
                                "/dashboard/" +
                                projectName +
                                "=" +
                                projectId +
                                "/backlog/productBacklog/registerPB"
                            }
                        >
                            <button
                                className="btnBacklogPrimary sm:w-1 sm:h-1"
                                type="button"
                            >
                                Añadir elemento
                            </button>
                        </Link>
                        <Button
                            color="primary"
                            endContent={<PlusIcon />}
                            className="btnBacklogExport"
                        >
                            Exportar
                        </Button>
                        <Button
                            color="danger"
                            onClick={() => toggleModalAll()}
                            endContent={<PlusIcon />}
                            className="btnBacklogEliminar"
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total: {data.length} historias
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
        //Aqui va el codigo del contenido del dashboard
        <div className="container">
            {/* <div className="header">
                Inicio / Proyectos / Nombre del proyecto / Backlog / Product
                Backlog
            </div> */}
            <div className="backlog">
                {/* <div className="titleBacklog"></div>
                <div className="navigationBacklog">
                    <div className="navigationBacklogIzquierda">
                        <Link
                            href="#tableroKanban"
                            style={{ border: "1px red solid", height: "auto" }}
                        >
                            <button
                                className="btnBacklog sm:w-1 sm:h-1"
                                type="button"
                            >
                                Tablero Kanban
                            </button>
                        </Link>
                        <Link href="#sprintBacklog">
                            <button
                                className="btnBacklog sm:w-1 sm:h-1"
                                type="button"
                            >
                                Sprint Backlog
                            </button>
                        </Link>
                        <Link href="#productBacklog">
                            <button
                                className="btnBacklogPrimary sm:w-1 sm:h-1"
                                type="button"
                            >
                                Product Backlog
                            </button>
                        </Link>
                    </div>
                    <div className="navigationBacklogDerecha">
                        <Link
                            href={
                                "/dashboard/" +
                                projectName +
                                "=" +
                                projectId +
                                "/backlog/productBacklog/registerPB"
                            }
                        >
                            <button
                                className="btnBacklogPrimary sm:w-1 sm:h-1"
                                type="button"
                            >
                                Añadir elemento
                            </button>
                        </Link>
                    </div>
                </div> */}
                <div className="mt-16">
                    <MyDynamicTable
                        label="Tabla Backlog"
                        bottomContent={bottomContent}
                        selectedKeys={selectedKeys}
                        setSelectedKeys={setSelectedKeys}
                        sortDescriptor={sortDescriptor}
                        setSortDescriptor={setSortDescriptor}
                        topContent={topContent}
                        columns={columns}
                        sortedItems={sortedItems}
                        renderCell={renderCell}
                        idKey="idHistoriaDeUsuario"
                    />
                    {/*<TableComponent data={data} /*urlApi = {stringURL} columns={columns} toggleModal={toggleModal} rowComponent={BacklogRow}/>*/}{" "}
                    {/* Pasa toggleModal como prop al componente TableComponent */}
                </div>
            </div>
            {modal1 && selectedTask && (
                <PopUpEliminateHU
                    modal={modal1}
                    toggle={() => toggleModal(selectedTask)} // Pasa la función como una función de flecha
                    taskName={selectedTask.DescripcionHistoria}
                    idHistoriaDeUsuario={selectedTask.idHistoriaDeUsuario}
                    refresh={DataTable}
                />
            )}
            {modal2 && (
                <PopUpEliminateAll
                    modal={modal2}
                    toggle={() => toggleModalAll()}
                />
            )}
            {navegate && objectID.idHistoriaDeUsuario && (
                <RouteringBacklog
                    proy_name={projectName}
                    proy_id={projectId}
                    idHu={objectID.idHistoriaDeUsuario}
                    isEdit={edit}
                />
            )}
        </div>
    );
}
