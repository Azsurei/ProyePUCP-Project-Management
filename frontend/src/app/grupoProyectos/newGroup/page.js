"use client";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/projectMenu.css";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/newProjects.css";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

import ListTools from "@/components/dashboardComps/projectComps/projectCreateComps/ListTools";
import CardCreateProject from "@/components/dashboardComps/projectComps/projectCreateComps/CardCreateProject";
import ChoiceUser from "@/components/dashboardComps/projectComps/projectCreateComps/ChoiceUser";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";

import Link from "next/link";
import { useState } from "react";
import * as React from "react";
import TracerNewProject  from "@/components/TracerNewProject";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createContext } from "react";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Typography from '@mui/material/Typography';
import { useContext, useCallback } from "react";
import { SessionContext } from "../layout";
import { 
    Card, 
    CardBody, 
    Input,
    Pagination,
    Button, 
} from "@nextui-org/react";
import { PlusIcon } from "public/icons/PlusIcon";
import { SearchIcon } from "public/icons/SearchIcon";
import { set } from "date-fns";
import MyDynamicTable from "@/components/DynamicTable";

axios.defaults.withCredentials = true;

const items = [
    {
        id: "1",
        label: "Informacion General",
        percentageComplete: 0,
        status: "current",
    },
    {
        id: "2",
        label: "Herramientas",
        percentageComplete: 0,
        status: "unvisited",
    },
    {
        id: "3",
        label: "Participantes",
        percentageComplete: 0,
        status: "unvisited",
    },
];

const items2 = [
    {
        id: "1",
        label: "Informacion General",
        percentageComplete: 100,
        status: "visited",
    },
    {
        id: "2",
        label: "Herramientas",
        percentageComplete: 0,
        status: "current",
    },
    {
        id: "3",
        label: "Participantes",
        percentageComplete: 0,
        status: "unvisited",
    },
];

const items3 = [
    {
        id: "1",
        label: "Informacion General",
        percentageComplete: 100,
        status: "visited",
    },
    {
        id: "2",
        label: "Herramientas",
        percentageComplete: 100,
        status: "visited",
    },
    {
        id: "3",
        label: "Participantes",
        percentageComplete: 0,
        status: "current",
    },
];

export const ToolCardsContext = createContext();

export default function newProject() {
    const router = useRouter();
    const {sessionData} = useContext(SessionContext);

    const [isLoading, setIsLoading] = useState(true);
    const [nombreGrupo, setNombreGrupo] = React.useState("");

    const onValueGrupuChange = (value) => {
        setNombreGrupo(value);
        setValidValue(true);
    }
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [toolsFilter, setToolsFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "descripcion",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);
    const [ListComps, setListComps] = useState([]);
    const [validValue, setValidValue] = useState(true);
    const isSetEmpty = selectedKeys.size === 0;
    const columns = [
        {
            name: "Proyecto",
            uid: "name",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Fecha Inicio",
            uid: "dateStart",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
        {
            name: "Fecha Fin",
            uid: "dateEnd",
            className:
                "px-4 py-2 text-xl font-semibold tracking-wide text-left",
            sortable: true,
        },
       
    ];

    useEffect(() => {
        let proyectsArray;
        const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/listarProyectos";

        axios
            .get(stringURL)
            .then(function (response) {
                console.log(response);
                proyectsArray = response.data.proyectos;

                proyectsArray = proyectsArray.map((proyect) => {
                    return {
                        id: proyect.idProyecto,
                        name: proyect.nombre,
                        dateStart: proyect.fechaInicio,
                        dateEnd: proyect.fechaFin,
                        members: proyect.miembros,
                        roleId: proyect.idRol,
                        roleName: proyect.nombrerol,
                    };
                });

                setListComps(proyectsArray);
                console.log(proyectsArray);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    // Variables adicionales
    const pages = Math.ceil(ListComps.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...ListComps];

        if (hasSearchFilter) {
            filteredTemplates = filteredTemplates.filter((data) =>
                data.name.toLowerCase().includes(
                    filterValue.toLowerCase()
                )
            );
        }
        if (
            toolsFilter !== "all" &&
            Array.from(toolsFilter).length !== toolsOptions.length
        ) {
            filteredTemplates = filteredTemplates.filter((data) =>
                Array.from(toolsFilter).includes(data.name)
            );
        }

        return filteredTemplates;
    }, [ListComps, filterValue, toolsFilter]);

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
            case "dateStart":
                const dateIni = new Date(cellValue);
                if (!isNaN(dateIni)) {
                    const day = String(dateIni.getDate()).padStart(2, '0');
                    const month = String(dateIni.getMonth() + 1).padStart(2, '0');
                    const year = dateIni.getFullYear();
                    return `${day}/${month}/${year}`;
                }
            case "dateEnd":
                const dateEnd = new Date(cellValue);
                if (!isNaN(dateEnd)) {
                    const day = String(dateEnd.getDate()).padStart(2, '0');
                    const month = String(dateEnd.getMonth() + 1).padStart(2, '0');
                    const year = dateEnd.getFullYear();
                    return `${day}/${month}/${year}`;
                }
            default:
                return cellValue;
        }
    }, []);

    const topContent = React.useMemo(() => {
        const agregarGrupo = () => {
            console.log("Tamano: ", selectedKeys.size);
            console.log("Select: ", selectedKeys);
            if (nombreGrupo === "") {
                setValidValue(false);
            } else {
                const postData = {
                    nombreGrupo: nombreGrupo,
                    idUsuario: sessionData.idUsuario,
                    proyectos: [...selectedKeys],
                };
                console.log("El postData es :", postData);
                axios
                    .post(
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                            "/api/proyecto/grupoProyectos/insertarGrupoProyectos",
                        postData
                    )
                    .then((response) => {
                        // Manejar la respuesta de la solicitud POST
                        console.log("Respuesta del servidor:", response.data);
                        console.log("Registro correcto");
                        // Realizar acciones adicionales si es necesario
                    })
                    .catch((error) => {
                        // Manejar errores si la solicitud POST falla
                        console.error("Error al realizar la solicitud POST:", error);
                    });
            }

    
        };
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
                        variant='faded'
                    />
                    <div className="flex gap-3">
                        <Button isDisabled={selectedKeys.size === 0} color="primary" endContent={<PlusIcon />} className="createProjectButtonEnd"  onPress={() => {agregarGrupo(); router.back();}}>
                            Agregar
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total: {ListComps.length} proyectos
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        Filas por proyecto:
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
        ListComps.length,
        onSearchChange,
        hasSearchFilter,
        selectedKeys,
        nombreGrupo,
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
        <div className="flex flex-col w-full h-auto p-10">
            <div className="headerDiv mb-4">
                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Grupo de Proyectos" />
                    <BreadcrumbsItem
                        href="/dashboard/newProject"
                        text="Nuevo Grupo"
                    />
                </Breadcrumbs>
                <p className="textProject2">Crea un Grupo</p>
            </div>

            
                <Card className="w-4/5 mx-auto shadow-md p-4 rounded border border-solid border-gray-300">
                    <CardBody>
                        <div className="flex items-center text-2xl font-montserrat font-bold">Nombre del Grupo</div>
                        <Input
                        isClearable
                        className="w-full sm:max-w-[80%] mb-4 mt-4"
                        placeholder="Ingresas nombre del grupo"
                        startContent={<PlusIcon />}
                        value={nombreGrupo}
                        onValueChange={onValueGrupuChange}
                        variant="faded"
                        errorMessage={
                            !validValue
                                ? "Nombre inválido"
                                : ""
                        }
                        />
                        <div className="flex items-center text-2xl font-montserrat font-bold">Seleccionar Proyectos</div>
                        <MyDynamicTable
                        label="Tabla Proyectos"
                        bottomContent={bottomContent}
                        selectedKeys={selectedKeys}
                        setSelectedKeys={setSelectedKeys}
                        sortDescriptor={sortDescriptor}
                        setSortDescriptor={setSortDescriptor}
                        topContent={topContent}
                        columns={columns}
                        sortedItems={sortedItems}
                        renderCell={renderCell}
                        idKey="id"
                        selectionMode="multiple"
                        />
                    </CardBody>
                </Card>
            

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </div>
    );
}