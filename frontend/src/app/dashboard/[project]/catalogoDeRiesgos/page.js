"use client"
import InConstruction from "@/common/InConstruction";
import { useState, useEffect, useCallback, useContext } from "react";
import { SmallLoadingScreen } from "../layout";
import Link from "next/link";
import MyDynamicTable from "@/components/DynamicTable";
import React from "react";
import axios from "axios"
axios.defaults.withCredentials = true;
import {
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
  } from "@nextui-org/react";
import { ChevronDownIcon } from "@/../public/icons/ChevronDownIcon";
import { VerticalDotsIcon } from "@/../public/icons/VerticalDotsIcon";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";
import { m } from "framer-motion";
import PopUpEliminateAll from "@/components/PopUpEliminateAll";
import { useRouter } from 'next/navigation';
import "@/styles/dashboardStyles/projectStyles/catalogoDeRiesgosStyles/catalogoRiesgos.css";
export default function MatrizDeComunicaciones(props){
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    
    console.log(projectId);
    console.log(projectName);
    
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    
    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    const toggleModal = (task) => {
        setSelectedTask(task);
        setModal1(!modal1);
    };
    const columns = [
        {
            name: 'Riesgo',
            uid: 'nombreRiesgo',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: 'Fecha identificacion',
            uid: 'fechaRiesgo',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: 'Severidad',
            uid: 'severidadRiesgo',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: 'Dueño del riesgo',
            uid: 'dueñoRiesgo',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: 'Estado',
            uid: 'estadoRiesgo',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: ' ',
            uid: 'actions',
            className: 'w-12 px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: false
        }
    ];
    const data = [
        {
            id: 1,
            nombreRiesgo: 'Riesgos de recursos',
            fechaRiesgo: '07/09/2023',
            severidadRiesgo: 'Baja',
            dueñoRiesgo: 'Anthony Estrada',
            estadoRiesgo: 'Estado',
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
    const pages = Math.ceil(data.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...data];

        if (hasSearchFilter) {
            filteredTemplates = filteredTemplates.filter((data) =>
                data.nombreRiesgo.toLowerCase().includes(filterValue.toLowerCase())
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
                                <DropdownItem >
                                {/* <Link href={"/dashboard/"+projectName+"="+projectId+"/productBacklog/"+object?.idHistoriaDeUsuario}> */}
                                        Editar 
                                {/* </Link> */}
                                </DropdownItem>

                                <DropdownItem onClick={() => toggleModal(data)}>Eliminar</DropdownItem>
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
                        variant='faded'
                    />
                    <div className="flex gap-3">
                        <Dropdown>
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
                                    <DropdownItem
                                        key={status.uid}
                                    >
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button color="primary" endContent={<PlusIcon />} className="btnRiesgosExport">
                            Exportar
                        </Button>
                        <Button color="danger" endContent={<PlusIcon />} className="btnRiesgosEliminar">
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
    return(

        <div className="container">
            <div className="header">
                Inicio / Proyectos / Nombre del proyecto / Catalogo de Riesgos
            </div>
            <div className="catalogoRiesgos">
                <div className="titleRiesgos">Catalogo de Riesgos</div>
                <div>
                       <MyDynamicTable 
                            label ="Tabla Riesgos" 
                            bottomContent={bottomContent} 
                            selectedKeys={selectedKeys}
                            setSelectedKeys={setSelectedKeys}
                            sortDescriptor = {sortDescriptor}
                            setSortDescriptor={setSortDescriptor}
                            topContent={topContent}
                            columns={columns}
                            sortedItems={sortedItems}
                            renderCell={renderCell}
                            idKey="id"
                        />
                
                </div>
            </div>
        </div>
        
    );
}