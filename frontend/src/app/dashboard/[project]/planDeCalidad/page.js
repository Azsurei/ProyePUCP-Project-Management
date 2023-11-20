"use client";
import axios from "axios";
import { useState, useEffect, useContext, use } from "react";
import { HerramientasInfo, SmallLoadingScreen } from "../layout";
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
import { Toaster } from "sonner";
import {
    Pagination,
    Tooltip,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@nextui-org/react";
import id from "date-fns/locale/id/index";
import { set } from "date-fns";
import ModalEliminateMetrica from "@/components/dashboardComps/projectComps/planDeCalidadComps/ModalEliminateMetrica";
axios.defaults.withCredentials = true;

export default function PlanDeCalidad(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const { herramientasInfo } = useContext(HerramientasInfo);
    const idPlanCalidad = herramientasInfo.find(
        (herramienta) => herramienta.idHerramienta === 15
    ).idHerramientaCreada;
    //console.log("El id del proyecto es:", projectId);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [standars, setStandars] = useState([]);
    const [standarsOriginales, setStandarsOriginales] = useState([]);
    const [activities, setActivities] = useState([]);
    const [activitiesOriginales, setActivitiesOriginales] = useState([]);
    const [activitiesControl, setActivitiesControl] = useState([]);
    const [activitiesControlOriginales, setActivitiesControlOriginales] =
        useState([]);
    const [quantity1, setQuantity1] = useState(0);
    const [quantity2, setQuantity2] = useState(0);
    const [quantity3, setQuantity3] = useState(0);
    const [metrica, setMetrica] = useState("");
    const [fuente, setFuente] = useState("");
    const [frecuencia, setFrecuencia] = useState("");
    const [responsable, setResponsable] = useState("");
    const [limitesControl, setLimitesControl] = useState("");
    const [validMetrica, setValidMetrica] = useState(true);
    const [validFuente, setValidFuente] = useState(true);
    const [validFrecuencia, setValidFrecuencia] = useState(true);
    const [validResponsable, setValidResponsable] = useState(true);
    const [validLimitesControl, setValidLimitesControl] = useState(true);
    const [dataIngresado, setDataIngresado] = useState(false);
    const [idMetricaCalidad, setIdMetricaCalidad] = useState("");
    const [modal, setModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [planCalidad, setPlanCalidad] = useState(null);
    //console.log("El id del plan de calidad es:", idPlanCalidad);
    const toggleModal = (task) => {
        setSelectedTask(task);
        setModal(!modal);

        console.log("Esta es la tarea", selectedTask);
        console.log("modal", modal);
    };
    const activeModal = () => {
        onOpen();
    };
    const editModal = (data) => {
        setIdMetricaCalidad(data.idMetricaCalidad);
        setMetrica(data.descripcionMetrica);
        setFuente(data.fuente);
        setFrecuencia(data.frecuencia);
        setResponsable(data.responsable);
        setLimitesControl(data.limitesControl);
        if (data.limitesControl !== "") {
            onOpen();
        }
    };
    const [data, setData] = useState([]);
    // const data = [
    //     {
    //         idMetricaCalidad: 1,
    //         descripcionMetrica: "Metrica 1",
    //         fuente: "Fuente 1",
    //         frecuencia: "Frecuencia 1",
    //         responsable: "Responsable 1",
    //         limitesControl: "Limites de control 1",
    //     }
    // ]
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
                                    onClick={() => editModal(data)}
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
                        placeholder="Buscar por metrica..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                        variant="faded"
                    />
                    <div className="flex gap-3">
                        {editMode && (
                            <Button
                                color="primary"
                                endContent={<PlusIcon />}
                                className="btnAddRiesgo"
                                onPress={() => activeModal()}
                            >
                                Agregar
                            </Button>
                        )}
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
        editMode,
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
        if (
            planCalidad &&
            planCalidad.estandaresCalidad &&
            planCalidad.actividadesPrevencion &&
            planCalidad.actividadesControlCalidad
        ) {
            const ciData= planCalidad.estandaresCalidad;
            const ciData1 = planCalidad.actividadesPrevencion;
            const ciData2 = planCalidad.actividadesControlCalidad;

            const standarsOriginal = ciData;
            const standarsActualizados = standarsOriginal.map(
                (standar) => ({
                    idStandars: standar.idEstandarCalidad || "", // Puedes agregar un valor predeterminado en caso de que falte
                    standars: standar.descripcion || "", // Puedes agregar un valor predeterminado en caso de que falte
                })
            );
            setStandars(standarsActualizados);
            setStandarsOriginales(standarsActualizados);
            setQuantity1(standarsActualizados.length);

            const activitiesOriginal = ciData1;
            const activitiesActualizados = activitiesOriginal.map(
                (activity) => ({
                    idActivities: activity.idActividadPrevencion || "", // Puedes agregar un valor predeterminado en caso de que falte
                    activities: activity.descripcion || "", // Puedes agregar un valor predeterminado en caso de que falte
                })
            );
            setActivities(activitiesActualizados);
            setActivitiesOriginales(activitiesActualizados);
            setQuantity2(activitiesActualizados.length);

            const activitiesControlOriginal = ciData2;
            const activitiesControlActualizados = activitiesControlOriginal.map(
                (activity) => ({
                    idActivitiesControl: activity.idActividadControlCalidad || "", // Puedes agregar un valor predeterminado en caso de que falte
                    activitiesControl: activity.descripcion || "", // Puedes agregar un valor predeterminado en caso de que falte
                })
            );
            setActivitiesControl(activitiesControlActualizados);
            setActivitiesControlOriginales(activitiesControlActualizados);
            setQuantity3(activitiesControlActualizados.length);
            console.log("Terminó de cargar los datos");
            setIsLoadingSmall(false);
        }
    }, [planCalidad]);

    useEffect(() => {
        setIsLoadingSmall(true);
        const stringURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/api/proyecto/planCalidad/listarPlanCalidadXIdPlanCalidad/${idPlanCalidad}`;
        axios
        .get(stringURL)
        .then(function (response) {
            const data = response.data;
            console.log("DATA:", data);
            setPlanCalidad(data);
        })
        .catch(function (error) {
            console.log(error);
        })
        .finally(() => {
            //setIsLoadingSmall(false);
            console.log("Finalizó la carga de datos");
        });
        DataTable();
    }, []);

    useEffect(() => {
        DataTable();
    }, [dataIngresado]);

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

    function DataTable() {
        const fetchData = async () => {
            try {
                // Realiza la solicitud HTTP al endpoint del router
                const stringURL =
                    process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/planCalidad/listarMetricaCalidadXIdPlanCalidad/" +
                    idPlanCalidad;
                const response = await axios.get(stringURL);

                // Actualiza el estado 'data' con los datos recibidos
                // setIdMatriz(response.data.matrizComunicacion.idMatrizComunicacion);
                setData(response.data.metricasCalidad);
                console.log(`Esta es la data:`, data);
                console.log(
                    `Datos obtenidos exitosamente:`,
                    response.data.metricasCalidad
                );
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        fetchData();
    }
    function ingresarMetrica() {
        return new Promise((resolve, reject) => {
            const stringURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/planCalidad/crearMetricaCalidad";
            const postData = {
                idPlanCalidad: idPlanCalidad,
                descripcionMetrica: metrica,
                fuente: fuente,
                frecuencia: frecuencia,
                responsable: responsable,
                limitesControl: limitesControl,
            };
            console.log("El postData es :", postData);
            axios
                .post(stringURL, postData)
                .then((response) => {
                    // Manejar la respuesta de la solicitud POST
                    console.log("Respuesta del servidor:", response.data);
                    console.log("Guardado de la metrica correcto");
                    setIdMetricaCalidad("");
                    resolve(response);
                    // Realizar acciones adicionales si es necesario
                })
                .catch((error) => {
                    // Manejar errores si la solicitud POST falla
                    console.error(
                        "Error al realizar la solicitud POST:",
                        error
                    );
                    reject(error);
                });
        });
    }
    function modificarMetrica() {
        return new Promise((resolve, reject) => {
            const stringURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/planCalidad/modificarMetricaCalidad";
            const putData = {
                idMetricaCalidad: idMetricaCalidad,
                descripcionMetrica: metrica,
                fuente: fuente,
                frecuencia: frecuencia,
                responsable: responsable,
                limitesControl: limitesControl,
            };
            console.log("El putData es :", putData);
            axios
                .put(stringURL, putData)
                .then((response) => {
                    // Manejar la respuesta de la solicitud POST
                    console.log("Respuesta del servidor:", response.data);
                    console.log("Modicado de la metrica correcto");
                    setIdMetricaCalidad("");
                    setMetrica("");
                    setFuente("");
                    setFrecuencia("");
                    setResponsable("");
                    setLimitesControl("");

                    resolve(response);

                    // Realizar acciones adicionales si es necesario
                })
                .catch((error) => {
                    // Manejar errores si la solicitud POST falla
                    console.error("Error al realizar la solicitud PUT:", error);
                    reject(error);
                });
        });
    }
    const nuevaMetrica = () => {
        toast.promise(ingresarMetrica, {
            loading: "Registrando nuevo metrica...",
            success: (data) => {
                setDataIngresado(!dataIngresado);
                return "La metrica se agregó con éxito!";
            },
            error: "Error al agregar metrica",
            position: "bottom-right",
        });
    };
    const cambiarMetrica = () => {
        toast.promise(modificarMetrica, {
            loading: "Modificando nuevo metrica...",
            success: (data) => {
                setDataIngresado(!dataIngresado);
                return "La metrica se modifico con éxito!";
            },
            error: "Error al modficar metrica",
            position: "bottom-right",
        });
    };

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

    const onSubmit = () => {
        const standarOriginal = standarsOriginales;
        const standar = standars;
        const activityOriginal = activitiesOriginales;
        const activity = activities;
        const activityControlOriginal = activitiesControlOriginales;
        const activityControl = activitiesControl;
        console.log("Original:", standarOriginal);
        console.log("Nuevo:", standar);
        console.log("Original1:", activityOriginal);
        console.log("Nuevo1:", activity);
        console.log("Original2:", activityControlOriginal);
        console.log("Nuevo2:", activityControl);

        const {
            modifiedArray: modifiedArray,
            deletedArray: deletedArray,
            addedArray: addedArray,
        } = findModifiedDeletedAdded(
            standarOriginal,
            standar,
            "idStandars"
        );

        const {
            modifiedArray: modifiedArray1,
            deletedArray: deletedArray1,
            addedArray: addedArray1,
        } = findModifiedDeletedAdded(
            activityOriginal,
            activity,
            "idActivities"
        );

        const {
            modifiedArray: modifiedArray2,
            deletedArray: deletedArray2,
            addedArray: addedArray2,
        } = findModifiedDeletedAdded(
            activityControlOriginal,
            activityControl,
            "idActivitiesControl"
        );

        console.log("Modified:", modifiedArray);
        console.log("Deleted:", deletedArray);
        console.log("Added:", addedArray);
        console.log("Modified1:", modifiedArray1);
        console.log("Deleted1:", deletedArray1);
        console.log("Added1:", addedArray1);
        console.log("Modified2:", modifiedArray2);
        console.log("Deleted2:", deletedArray2);
        console.log("Added2:", addedArray2);

        const putData = {
            idPlanCalidad: idPlanCalidad,
            estandares: modifiedArray,
            actividadesPrevencion: modifiedArray1,
            actividadesControl: modifiedArray2,
        };
        console.log("Actualizado correctamente");
        console.log(putData);
        const postData = {
            idPlanCalidad: idPlanCalidad,
            estandares: addedArray,
            actividadesPrevencion: addedArray1,
            actividadesControl: addedArray2,
        };
        console.log("Agregado correctamente");
        console.log(postData);
        const deleteData = {
            idPlanCalidad: idPlanCalidad,
            estandares: deletedArray,
            actividadesPrevencion: deletedArray1,
            actividadesControl: deletedArray2,
        };
        console.log("Eliminado correctamente");
        console.log(deleteData);

        axios
        .put(
            process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/planCalidad/modificarPlanCalidad",
            putData
        )
        .then((response) => {
            // Manejar la respuesta de la solicitud PUT
            console.log("Respuesta del servidor:", response.data);
            console.log("Registro correcto");
            // Realizar acciones adicionales si es necesario
        })
        .catch((error) => {
            // Manejar errores si la solicitud PUT falla
            console.error("Error al realizar la solicitud PUT:", error);
        });

        axios
        .post(
            process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/planCalidad/insertarPlanCalidad",
            postData
        )
        .then((response) => {
            // Manejar la respuesta de la solicitud POST
            console.log("Respuesta del servidor (POST):", response.data);
            console.log("Registro correcto (POST)");
            // Realizar acciones adicionales si es necesario
        })
        .catch((error) => {
            // Manejar errores si la solicitud POST falla
            console.error("Error al realizar la solicitud POST:", error);
        });
        
        axios
        .delete(
            process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/planCalidad/eliminarCamposDinamicos",
            {
                data: deleteData,
            }
        )
        .then((response) => {
            // Manejar la respuesta de la solicitud DELETE
            console.log("Respuesta del servidor (DELETE):", response.data);
            console.log("Eliminación correcta (DELETE)");
            // Realizar acciones adicionales si es necesario
        })
        .catch((error) => {
            // Manejar errores si la solicitud DELETE falla
            console.error("Error al realizar la solicitud DELETE:", error);
        });

    };

    return (
        <div className="flex-1 font-[Montserrat] flex flex-col w-full h-auto pl-8 pr-8 gap-4">
            <div className="flex items-center w-full pt-4">
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
                                onSubmit();
                            }}
                        >
                            Guardar
                        </Button>
                    )}
                </div>
            </div>
            <div>
                <div className="flex gap-3">
                    <h4 className="font-semibold">
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
                <div className="flex gap-3">
                    <h4 className="font-semibold">
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
                <div className="flex gap-3">
                    <h4 className="font-semibold">
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
                <div className="flex items-center text-[24px] font-semibold mt-8 mb-4">
                    Metricas
                </div>
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
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => {
                        const cerrarModal = async () => {
                            let Isvalid = true;
                            if (metrica === "") {
                                setValidMetrica(false);
                                Isvalid = false;
                            }

                            if (fuente === "") {
                                setValidFuente(false);
                                Isvalid = false;
                            }

                            if (frecuencia === "") {
                                setValidFrecuencia(false);
                                Isvalid = false;
                            }
                            if (responsable === "") {
                                setValidResponsable(false);
                                Isvalid = false;
                            }
                            if (limitesControl === "") {
                                setValidLimitesControl(false);
                                Isvalid = false;
                            }
                            if (Isvalid === true) {
                                try {
                                    if (idMetricaCalidad === "") {
                                        await nuevaMetrica();
                                    } else {
                                        console.log("cambiooo");
                                        await cambiarMetrica();
                                    }
                                } catch (error) {
                                    console.error(
                                        "Error al registrar la línea de ingreso o al obtener los datos:",
                                        error
                                    );
                                }

                                onClose();
                                setIsLoadingSmall(false);
                            }
                        };
                        return (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Registrar nueva metrica
                                </ModalHeader>
                                <ModalBody>
                                    <Input
                                        autoFocus
                                        label="Metrica"
                                        placeholder="Ingresa tu metrica"
                                        variant="bordered"
                                        value={metrica}
                                        onValueChange={setMetrica}
                                        isInvalid={!validMetrica}
                                        onChange={() => {
                                            setValidMetrica(true);
                                        }}
                                        errorMessage={
                                            !validMetrica
                                                ? "La metrica no puede estar vacia"
                                                : ""
                                        }
                                    />
                                    <Input
                                        label="Fuente"
                                        placeholder="Ingresa la fuente"
                                        variant="bordered"
                                        value={fuente}
                                        onValueChange={setFuente}
                                        isInvalid={!validFuente}
                                        onChange={() => {
                                            setValidFuente(true);
                                        }}
                                        errorMessage={
                                            !validFuente
                                                ? "La fuente no puede estar vacia"
                                                : ""
                                        }
                                    />
                                    <Input
                                        label="Frecuencia"
                                        placeholder="Ingresa la frecuencia"
                                        variant="bordered"
                                        value={frecuencia}
                                        onValueChange={setFrecuencia}
                                        isInvalid={!validFrecuencia}
                                        onChange={() => {
                                            setValidFrecuencia(true);
                                        }}
                                        errorMessage={
                                            !validFrecuencia
                                                ? "La frecuencia no puede estar vacia"
                                                : ""
                                        }
                                    />
                                    <Input
                                        label="Responsable"
                                        placeholder="Ingresa un responsable"
                                        variant="bordered"
                                        value={responsable}
                                        onValueChange={setResponsable}
                                        isInvalid={!validResponsable}
                                        onChange={() => {
                                            setValidResponsable(true);
                                        }}
                                        errorMessage={
                                            !validResponsable
                                                ? "El responsable no puede estar vacio"
                                                : ""
                                        }
                                    />
                                    <Input
                                        label="Limites de Control"
                                        placeholder="Ingresa la fuente"
                                        variant="bordered"
                                        value={limitesControl}
                                        onValueChange={setLimitesControl}
                                        isInvalid={!validLimitesControl}
                                        onChange={() => {
                                            setValidLimitesControl(true);
                                        }}
                                        errorMessage={
                                            !validLimitesControl
                                                ? "El limite de control no puede estar vacio"
                                                : ""
                                        }
                                    />
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
                                        className="bg-blue-950 text-white"
                                        onPress={cerrarModal}
                                    >
                                        Guardar
                                    </Button>
                                </ModalFooter>
                            </>
                        );
                    }}
                </ModalContent>
            </Modal>
            {modal && selectedTask && (
                <ModalEliminateMetrica
                    modal={modal}
                    toggle={() => toggleModal(selectedTask)}
                    taskName={selectedTask.descripcionMetrica}
                    idMetricaCalidad={selectedTask.idMetricaCalidad}
                    refresh={DataTable}
                />
            )}
        </div>
    );
}
