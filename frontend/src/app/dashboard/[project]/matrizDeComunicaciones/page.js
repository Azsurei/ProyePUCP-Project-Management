"use client";
import { useState, useEffect, useCallback, useContext } from "react";
import { SmallLoadingScreen } from "../layout";
import Link from "next/link";
import MyDynamicTable from "@/components/DynamicTable";
import React from "react";
import axios from "axios";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
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
import "@/styles/dashboardStyles/projectStyles/MComunicationStyles/MComunication.css";
import PopUpEliminateMC from "@/components/dashboardComps/projectComps/matrizComunicacionesComps/PopUpEliminateMC";
import { set } from "date-fns";
import RouteringMC from "@/components/dashboardComps/projectComps/matrizComunicacionesComps/RouteringMC";
import RouteringRegisterMC from "@/components/dashboardComps/projectComps/matrizComunicacionesComps/RouteringRegisterMC";
import { EyeFilledIcon } from "@/../public/icons/EyeFilledIcon";
import { SessionContext } from "@/app/dashboard/layout";
export default function MatrizDeComunicaciones(props) {
    const router = useRouter();
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const { sessionData } = useContext(SessionContext);
    const rol = sessionData.rolInProject;
    const stringURL =
        process.env.NEXT_PUBLIC_BACKEND_URL +
        `/api/proyecto/matrizDeComunicaciones/listarMatrizComunicacion/59`;
    console.log(projectId);
    console.log(projectName);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [data, setData] = useState([]);
    const [objectMC, setObjectMC] = useState(null);
    const [navegate, setNavegate] = useState(false);
    const [idMatriz, setIdMatriz] = useState(null);
    const [edit, setEdit] = useState(null);
    function DataTable() {
        setIsLoadingSmall(true);
        const fetchData = async () => {
            try {
                // Realiza la solicitud HTTP al endpoint del router
                const stringURL =
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/matrizDeComunicaciones/listarMatrizComunicacion/" +
                    projectId;
                const response = await axios.get(stringURL);

                // Actualiza el estado 'data' con los datos recibidos
                // setIdMatriz(response.data.matrizComunicacion.idMatrizComunicacion);
                setData(response.data.matrizComunicacion);
                setPages(
                    Math.ceil(
                        response.data.matrizComunicacion.length / rowsPerPage
                    )
                );
                console.log(`Esta es la data:`, data);
                console.log(
                    `Datos obtenidos exitosamente:`,
                    response.data.matrizComunicacion
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
        setObjectMC(objectID);
        console.log("El id del objeto MC es: ", objectMC);
        setNavegate(!navegate);
        setEdit(isEdit);
    };

    const columns = [
        {
            name: "Informacion Requerida",
            uid: "sumillaInformacion",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Formato",
            uid: "nombreFormato",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Responsable de comunicar",
            uid: "nombres",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Grupo receptor",
            uid: "grupoReceptor",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Canal",
            uid: "nombreCanal",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Frecuencia",
            uid: "nombreFrecuencia",
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
    // const data = [
    //     {
    //         id: 1,
    //         sumillaInformacion: 'Acta de constitucion',
    //         nombreFormato: 'Word',
    //         responsableDeComunicar: 'Gestor de proyecto',
    //         grupoReceptor: 'Todos los interesados',
    //         nombreCanal: 'Reunion presencial',
    //         nombreFrecuencia: 'Una sola vez',
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
    const [pages, setPages] = useState(1);
    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...data];

        if (hasSearchFilter) {
            filteredTemplates = filteredTemplates.filter((item) =>
                item.sumillaInformacion
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }
        if (
            toolsFilter !== "all" &&
            Array.from(toolsFilter).length !== toolsOptions.length
        ) {
            filteredTemplates = filteredTemplates.filter((item) =>
                Array.from(toolsFilter).includes(item.sumillaInformacion)
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
        const imageOptions = {
            WORD: "/icons/icon-word.svg",
            "Documento Excel": "/icons/icon-excel.svg",
            PDF: "/icons/icon-pdf.svg",
            "Informe Escrito": "/icons/icon-information.svg",
            "Informe Verbal": "/icons/icon-verbal.svg",
            Otros: "/icons/icon-other.svg",
            // Agrega más opciones según sea necesario
        };

        switch (columnKey) {
            case "nombreFormato":
                // return <img src={cellValue} alt="Icono de plantilla"></img>;
                const imageSrc = cellValue ? imageOptions[cellValue] : null; // Establecer null si cellValue es nulo
                return imageSrc ? (
                    <img src={imageSrc} alt={`Icono de ${cellValue}`} />
                ) : null;
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
                        <div className="flex items-center">
                            <Tooltip content="Visualizar" color="primary">
                                <button
                                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-8 md:h-8 min-w-[24px] min-h-[24px]"
                                    type="button"
                                    onClick={() => {
                                        setRoutering(data, false);
                                    }}
                                >
                                    <img src="/icons/view.svg" />
                                    {/* <EyeFilledIcon /> */}
                                </button>
                            </Tooltip>
                            {
                                rol !==2 && (
                                    <>
                                    <Tooltip content="Editar" color="warning">
                                    <button
                                        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-8 md:h-8 min-w-[24px] min-h-[24px]"
                                        
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
                                        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-8 md:h-8 min-w-[24px] min-h-[24px]"
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
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-10">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por informacion..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                        variant="faded"
                    />
                    <div className="flex gap-3">
                        {
                            rol !==2 && (
                                <Button
                                color="primary"
                                endContent={<PlusIcon />}
                                className="btnAddComunicacion"
                                onPress={() => {
                                    router.push(
                                        "/dashboard/" +
                                            projectName +
                                            "=" +
                                            projectId +
                                            "/matrizDeComunicaciones/registerMC"
                                    );
                                }}
                            >
                                Agregar
                            </Button>
                            )
                        }

                        {/* <Button
                            color="primary"
                            endContent={<PlusIcon />}
                            className="btnComunicacionExport"
                        >
                            Exportar
                        </Button>
                        <Button
                            color="danger"
                            endContent={<PlusIcon />}
                            className="btnComunicacionEliminar"
                        >
                            Eliminar
                        </Button> */}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total: {data.length} informaciones
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
                        href={
                            "/dashboard/" +
                            projectName +
                            "=" +
                            projectId +
                            "/MatrizDeComunicaciones"
                        }
                        text={"Matriz de Comunicaciones"}
                    ></BreadcrumbsItem>
                </Breadcrumbs>
            </div>
            <div className="matrizComunicaciones">
                <div className="titleComunicaciones h-auto my-4 text-center dark:text-white">
                    Matriz de Comunicaciones
                </div>
                <div className="w-auto h-auto">
                    <MyDynamicTable
                        label="Tabla Matriz de Comunicaciones"
                        bottomContent={bottomContent}
                        selectedKeys={selectedKeys}
                        setSelectedKeys={setSelectedKeys}
                        sortDescriptor={sortDescriptor}
                        setSortDescriptor={setSortDescriptor}
                        topContent={topContent}
                        columns={columns}
                        sortedItems={sortedItems}
                        renderCell={renderCell}
                        idKey="idComunicacion"
                    />
                </div>
            </div>
            {modal1 && selectedTask && (
                <PopUpEliminateMC
                    modal={modal1}
                    toggle={() => toggleModal(selectedTask)} // Pasa la función como una función de flecha
                    taskName={selectedTask.sumillaInformacion}
                    idComunicacion={selectedTask.idComunicacion}
                    refresh={DataTable}
                />
            )}
            {navegate && objectMC.idComunicacion && (
                <RouteringMC
                    proy_name={projectName}
                    proy_id={projectId}
                    idMC={objectMC.idComunicacion}
                    isEdit={edit}
                />
            )}
        </div>
    );
}
