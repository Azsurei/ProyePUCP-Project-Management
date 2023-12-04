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
import { useRouter } from "next/navigation";
import "@/styles/dashboardStyles/projectStyles/catalogoDeRiesgosStyles/catalogoRiesgos.css";
import RouteringInteresados from "@/components/dashboardComps/projectComps/catalogoDeInteresadosComps/RouteringInteresados";
import ModalEliminateInteresado from "@/components/dashboardComps/projectComps/catalogoDeInteresadosComps/ModalEliminateInteresado";
import { SessionContext } from "@/app/dashboard/layout";
export default function CatalogoDeInteresados(props) {
    const router = useRouter();
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const { sessionData } = useContext(SessionContext);
    const rol = sessionData.rolInProject;
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const stringPrueba =
        process.env.NEXT_PUBLIC_BACKEND_URL +
        "/api/proyecto/catalogoRiesgos/listarRiesgos/100";
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
                    "/api/proyecto/catalogoInteresados/listarInteresados/" +
                    projectId;
                const response = await axios.get(stringURL);

                // Actualiza el estado 'data' con los datos recibidos
                // setIdMatriz(response.data.matrizComunicacion.idMatrizComunicacion);
                setData(response.data.interesados);
                setPages(
                    Math.ceil(
                        response.data.interesados.length / rowsPerPage
                    )
                );
                console.log(`Esta es la data:`, data);
                console.log(
                    `Datos obtenidos exitosamente:`,
                    response.data.interesados
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
        console.log("El modal es: ", modal1);
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
            name: "Nombre",
            uid: "nombreCompleto",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Rol en el proyecto",
            uid: "rolEnProyecto",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Nivel de autoridad",
            uid: "nombreAutoridad",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Nivel de adhesión actual",
            uid: "nombreAdhesionActual",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Nivel de adhesion deseado",
            uid: "nombreAdhesionDeseado",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: " ",
            uid: "actions",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: false,
        },
    ];
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
    const [pages, setPages] = useState(1);
    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...data];

        if (hasSearchFilter) {
            filteredTemplates = filteredTemplates.filter((data) =>
                data.nombreCompleto
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }
        if (
            toolsFilter !== "all" &&
            Array.from(toolsFilter).length !== toolsOptions.length
        ) {
            filteredTemplates = filteredTemplates.filter((data) =>
                Array.from(toolsFilter).includes(data.nombreCompleto)
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
            case "actions":
                return (
                    <div className=" flex justify-center items-center gap-2 min-w-[24px] min-h-[24px]">
                        <div className="flex min-w-[24px] min-h-[24px]">
                            <Tooltip content="Visualizar" color="primary">
                                <button
                                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-8 md:h-8 min-w-[24px] min-h-[24px]"
                                    type="button"
                                    onClick={() => {
                                        setRoutering(data, false);
                                    }}
                                >
                                    <img src="/icons/view.svg"/>
                                    {/* <EyeFilledIcon /> */}
                                </button>
                            </Tooltip>
                            {
                                rol !== 2 && (
                                    <>
                                    <Tooltip content="Editar" color="warning">
                                <button
                                    className="min-w-[24px] min-h-[24]"
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
                                    className="min-w-[24px] min-h-[24px]"
                                    type="button"
                                    onClick={() => toggleModal(data)}
                                >
                                    <img src="/icons/eliminar.svg" />
                                </button>
                            </Tooltip>
                                    </>
                                )
                            }

                        </div>
                    </div>
                );
            default:
                return cellValue;
        }
    }, [rol]);
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
                        {
                            rol !== 2 && (
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
                                            "/catalogoDeInteresados/registerCI"
                                    );
                                }}
                            >
                                Agregar
                            </Button>
                            )
                        }

                        {/*                         <Button
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
                        </Button> */}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total: {data.length} interesados
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
        rol,
    ]);
    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center gap-4">
                <span className="w-[30%] text-small text-default-400">

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
                Inicio / Proyectos / Nombre del proyecto / Catálogo de
                Interesados
            </div>
            <div className="catalogoRiesgos">
                <div className="titleRiesgos dark:text-white">
                    Catálogo de Interesados
                </div>
                <div>
                    <MyDynamicTable
                        label="Tabla Interesados"
                        bottomContent={bottomContent}
                        selectedKeys={selectedKeys}
                        setSelectedKeys={setSelectedKeys}
                        sortDescriptor={sortDescriptor}
                        setSortDescriptor={setSortDescriptor}
                        topContent={topContent}
                        columns={columns}
                        sortedItems={sortedItems}
                        renderCell={renderCell}
                        idKey="idInteresado"
                    />
                </div>
            </div>
            {modal1 && selectedTask && (
                <ModalEliminateInteresado
                    modal={modal1}
                    toggle={() => toggleModal(selectedTask)} // Pasa la función como una función de flecha
                    taskName={selectedTask.nombreCompleto}
                    idInteresado={selectedTask.idInteresado}
                    refresh={DataTable}
                />
            )}
            {navegate && objectRC.idInteresado && (
                <RouteringInteresados
                    proy_name={projectName}
                    proy_id={projectId}
                    idInteresado={objectRC.idInteresado}
                    isEdit={edit}
                />
            )}
        </div>
    );
}
