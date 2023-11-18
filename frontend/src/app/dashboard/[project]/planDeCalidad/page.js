"use client";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { SmallLoadingScreen } from "../layout";
import { Textarea, Input, Button } from "@nextui-org/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import ContainerStandarsPC from "@/components/dashboardComps/projectComps/planDeCalidadComps/ContainerStandarsPC";
import ContainerActivitiesPC from "@/components/dashboardComps/projectComps/planDeCalidadComps/ContainerActivitiesPC";
import ContainerActivitiesControlPC from "@/components/dashboardComps/projectComps/planDeCalidadComps/ContainerActivitiesControlPC";
import MyDynamicTable from "@/components/DynamicTable";
import React from "react";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import {
    Pagination,
    Tooltip
} from "@nextui-org/react";
axios.defaults.withCredentials = true;

export default function PlanDeCalidad(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    console.log("El id del proyecto es:", projectId);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
    const [standars, setStandars] = useState([]);
    const [activities, setActivities] = useState([]);
    const [activitiesControl, setActivitiesControl] = useState([]);
    const [quantity1, setQuantity1] = useState(0);
    const [quantity2, setQuantity2] = useState(0);
    const [quantity3, setQuantity3] = useState(0);
    // const [data, setData] = useState([]);
    const data = [
        {
            idMetricaCalidad: 1,
            descripcionMetrica: "Metrica 1",
            fuente: "Fuente 1",
            frecuencia: "Frecuencia 1",
            responsable: "Responsable 1",
            limitesControl: "Limites de control 1",
        }
    ]
    const columns = [
        {
            name: "Metrica",
            uid: "descripcionMetrica",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Fuente",
            uid: "fuente",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Frecuencia",
            uid: "frecuencia",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Responsable",
            uid: "responsable",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Limites de control",
            uid: "limitesControl",
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
                data.descripcionMetrica
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }
        if (
            toolsFilter !== "all" &&
            Array.from(toolsFilter).length !== toolsOptions.length
        ) {
            filteredTemplates = filteredTemplates.filter((data) =>
                Array.from(toolsFilter).includes(data.descripcionMetrica)
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
                    <div className="relative flex justify-center items-center gap-2">
                        <div className="flex">
                            <Tooltip content="Editar" color="warning">
                                <button
                                    className=""
                                    type="button"
                                >
                                    <img src="/icons/editar.svg" />
                                </button>
                            </Tooltip>
                            <Tooltip content="Eliminar" color="danger">
                                <button
                                    className=""
                                    type="button"
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
                        placeholder="Buscar por metrica..."
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
                        >
                                Agregar

                        </Button>
                    </div>
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
    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    function addContainer1() {
        setStandars([
            ...standars,
            {
                idStandars: `a${quantity1}`,
                standars: "",
            },
        ]);
        setQuantity1(quantity1 + 1);
    }

    function addContainer2() {
        setActivities([
            ...activities,
            {
                idActivities: `a${quantity2}`,
                activities: "",
            },
        ]);
        setQuantity2(quantity2 + 1);
    }

    function addContainer3() {
        setActivitiesControl([
            ...activitiesControl,
            {
                idActivitiesControl: `a${quantity3}`,
                activitiesControl: "",
            },
        ]);
        setQuantity3(quantity3 + 1);
    }

    const updateStandarsField = (index, value) => {
        setStandars((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index - 1].standars = value;
            return updatedFields;
        });
    };

    const updateActivitiesField = (index, value) => {
        setActivities((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index - 1].activities = value;
            return updatedFields;
        });
    };

    const updateActivitiesControlField = (index, value) => {
        setActivitiesControl((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index - 1].activitiesControl = value;
            return updatedFields;
        });
    };

    function removeContainer1(indice) {
        setQuantity1(quantity1 - 1);
        setStandars((prevFields) => {
            const updatedFields = [...prevFields];
            // Elimina el elemento con el índice proporcionado
            updatedFields.splice(indice, 1);
            return updatedFields;
        });
    }

    function removeContainer2(indice) {
        setQuantity2(quantity2 - 1);
        setActivities((prevFields) => {
            const updatedFields = [...prevFields];
            // Elimina el elemento con el índice proporcionado
            updatedFields.splice(indice, 1);
            return updatedFields;
        });
    }

    function removeContainer3(indice) {
        setQuantity3(quantity3 - 1);
        setActivitiesControl((prevFields) => {
            const updatedFields = [...prevFields];
            // Elimina el elemento con el índice proporcionado
            updatedFields.splice(indice, 1);
            return updatedFields;
        });
    }

    const findModifiedDeletedAdded = (
        originalArray,
        newArray,
        comparisonField
    ) => {
        const modifiedArray = [];
        const deletedArray = [];
        const addedArray = [];

        // Encuentra elementos modificados y eliminados
        originalArray.forEach((originalItem) => {
            const newItem = newArray.find(
                (newItem) =>
                    newItem[comparisonField] === originalItem[comparisonField]
            );

            if (newItem) {
                modifiedArray.push(newItem);
                /*                 if (JSON.stringify(originalItem) !== JSON.stringify(newItem)) {
                    modifiedArray.push(newItem);
                } */
            } else {
                deletedArray.push(originalItem);
            }
        });

        // Encuentra elementos añadidos
        newArray.forEach((newItem) => {
            if (
                !originalArray.some(
                    (originalItem) =>
                        originalItem[comparisonField] ===
                        newItem[comparisonField]
                )
            ) {
                addedArray.push(newItem);
            }
        });

        return { modifiedArray, deletedArray, addedArray };
    };

    return (
        <div class="flex-1 font-[Montserrat] flex flex-col w-full h-auto pl-8 pr-8 gap-4">
            <div class="flex items-center w-full pt-4">
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
                            "/matrizDeResponsabilidades"
                        }
                        text={"Plan de calidad"}
                    ></BreadcrumbsItem>
                </Breadcrumbs>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center text-[32px] font-semibold">
                    Plan de calidad
                </div>
                <div>
                    {!editMode && (
                        <Button
                            color="primary"
                            onPress={() => {
                                setEditMode(true);
                            }}
                        >
                            Editar
                        </Button>
                    )}

                    {editMode && (
                        <Button
                            color="primary"
                            onPress={() => {
                                setEditMode(false);
                            }}
                        >
                            Cancelar
                        </Button>
                    )}
                </div>
            </div>
            <div>
                <div class="flex gap-3">
                    <h4 class="font-semibold">
                        Estándares y normas de calidad
                    </h4>
                </div>
                {quantity1 === 0 ? (
                    <div className="flex justify-center items-center">
                        <div className="mt-2">
                            ¡Puede agregar algunos estándares y normas de
                            calidad!
                        </div>
                    </div>
                ) : (
                    standars.map((standars, index) => (
                        <ContainerStandarsPC
                            key={index}
                            indice={index + 1}
                            updateStandarsField={updateStandarsField}
                            standars={standars}
                            functionRemove={removeContainer1}
                            isDisabled={!editMode}
                        />
                    ))
                )}
                {editMode === true && (
                    <div className="flex justify-end">
                        <div className="flex gap-10 p-4">
                            <Button
                                onClick={addContainer1}
                                className="bg-yellow-500 border-2 border-yellow-500 h-10 text-white text-sm font-semibold w-28 cursor-pointer outline-none"
                                type="button"
                            >
                                Agregar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <div class="flex gap-3">
                    <h4 class="font-semibold">
                        Actividades de prevención y aseguramiento de calidad
                    </h4>
                </div>
                {quantity2 === 0 ? (
                    <div className="flex justify-center items-center">
                        <div className="mt-2">
                            ¡Puede agregar algunas actividades de prevención y
                            aseguramiento de calidad!
                        </div>
                    </div>
                ) : (
                    activities.map((activities, index) => (
                        <ContainerActivitiesPC
                            key={index}
                            indice={index + 1}
                            updateActivitiesField={updateActivitiesField}
                            activities={activities}
                            functionRemove={removeContainer2}
                            isDisabled={!editMode}
                        />
                    ))
                )}
                {editMode === true && (
                    <div className="flex justify-end">
                        <div className="flex gap-10 p-4">
                            <Button
                                onClick={addContainer2}
                                className="bg-yellow-500 border-2 border-yellow-500 h-10 text-white text-sm font-semibold w-28 cursor-pointer outline-none"
                                type="button"
                            >
                                Agregar
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <div>
                <div class="flex gap-3">
                    <h4 class="font-semibold">
                        Actividades de control de calidad
                    </h4>
                </div>
                {quantity3 === 0 ? (
                    <div className="flex justify-center items-center">
                        <div className="mt-2">
                            ¡Puede agregar algunas actividades de control de
                            calidad!
                        </div>
                    </div>
                ) : (
                    activitiesControl.map((activitiesControl, index) => (
                        <ContainerActivitiesControlPC
                            key={index}
                            indice={index + 1}
                            updateActivitiesControlField={
                                updateActivitiesControlField
                            }
                            activitiesControl={activitiesControl}
                            functionRemove={removeContainer3}
                            isDisabled={!editMode}
                        />
                    ))
                )}
                {editMode === true && (
                    <div className="flex justify-end">
                        <div className="flex gap-10 p-4">
                            <Button
                                onClick={addContainer3}
                                className="bg-yellow-500 border-2 border-yellow-500 h-10 text-white text-sm font-semibold w-28 cursor-pointer outline-none"
                                type="button"
                            >
                                Agregar
                            </Button>
                        </div>
                    </div>
                )}

            </div>
            <div>
                <MyDynamicTable 
                        label="Tabla Metricas de calidad"
                        bottomContent={bottomContent}
                        selectedKeys={selectedKeys}
                        setSelectedKeys={setSelectedKeys}
                        sortDescriptor={sortDescriptor}
                        setSortDescriptor={setSortDescriptor}
                        topContent={topContent}
                        columns={columns}
                        sortedItems={sortedItems}
                        renderCell={renderCell}
                        idKey="idMetricaCalidad"                
                />
            </div>
        </div>
    );
}
