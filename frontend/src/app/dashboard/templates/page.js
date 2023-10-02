"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
    Chip,
    User,
    Pagination,
  } from "@nextui-org/react";
import { ChevronDownIcon } from "@/../public/icons/ChevronDownIcon";
import { VerticalDotsIcon } from "@/../public/icons/VerticalDotsIcon";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import { PlusIcon } from "@/../public/icons/PlusIcon";

const columns = [
    { name: "Nombre", uid: "name", sortable: true},
    { name: "Herramienta", uid: "tool", sortable: true },
    { name: "Fecha de creacion", uid: "dateCreated", sortable: true },
    { name: "Fecha de modificacion", uid: "dateModified", sortable: true },
    { name: "Tipo", uid: "iconSrc"},
    { name: "Tamaño", uid: "fileSize", sortable: true},
    { name: "Acciones", uid: "actions"},
];

const toolsOptions = [
    { name: "Backlog", uid: "active" },
    { name: "Acta de constitucion", uid: "paused" },
    { name: "EDT", uid: "vacation" },
];

const extensionOptions = [
    { name: ".docx", uid: "word" },
    { name: ".xlsx", uid: "excel" },
    { name: ".pptx", uid: "powerpoint" },
];

const templates = [
    {
        id: 1,
        name: 'Backlog estandar 2023',
        tool: "Gestion del Product Backlog",
        dateCreated: "2021-10-01",
        dateModified: "2021-10-01",
        iconSrc: "/icons/icon-excel.svg",
        fileSize: "1.2 MB",	
    },
    {
        id: 2,
        name: 'Registro de equipos',
        tool: "Cronograma",
        dateCreated: "2021-10-02",
        dateModified: "2021-10-01",
        iconSrc: "/icons/icon-excel.svg",
        fileSize: "1.2 MB",
    },
    {
        id: 3,
        name: 'Presupuesto',
        tool: "Backlog",
        dateCreated: "2021-10-03",
        dateModified: "2021-10-01",
        iconSrc: "/icons/icon-word.svg",
        fileSize: "1.2 MB",
    },
    {
        id: 4,
        name: 'Catalogo',
        tool: "Gestion del Product Backlog",
        dateCreated: "2021-10-01",
        dateModified: "2021-10-01",
        iconSrc: "/icons/icon-excel.svg",
        fileSize: "1.2 MB",
    },
    {
        id: 5,
        name: 'Acta de constitucion',
        tool: "Cronograma",
        dateCreated: "2021-10-02",
        dateModified: "2021-10-01",
        iconSrc: "/icons/icon-excel.svg",
        fileSize: "1.2 MB",
    },
    {
        id: 6,
        name: 'Matriz de retrospectivas',
        tool: "Backlog",
        dateCreated: "2021-10-03",
        dateModified: "2021-10-01",
        iconSrc: "/icons/icon-word.svg",
        fileSize: "1.2 MB",
    },
];

export default function MyTemplates() {
    // Estados generales
    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [toolsFilter, setToolsFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "name",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    // Variables adicionales
    const pages = Math.ceil(templates.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);

    // Items de tabla filtrados (busqueda, tipo de herramienta)
    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...templates];

        if (hasSearchFilter) {
            filteredTemplates = filteredTemplates.filter((template) =>
                template.name.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (
            toolsFilter !== "all" &&
            Array.from(toolsFilter).length !== toolsOptions.length
        ) {
            filteredTemplates = filteredTemplates.filter((template) =>
                Array.from(toolsFilter).includes(template.tools)
            );
        }

        return filteredTemplates;
    }, [templates, filterValue, toolsFilter]);

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
            case "iconSrc":
                return <img src={cellValue} alt="Icono de plantilla"></img>;
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
                                <DropdownItem>Editar</DropdownItem>
                                <DropdownItem>Eliminar</DropdownItem>
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
                                    <DropdownItem
                                        key={status.uid}
                                    >
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Button color="primary" endContent={<PlusIcon />}>
                            Exportar
                        </Button>
                        <Button color="danger" endContent={<PlusIcon />}>
                            Eliminar
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total: {templates.length} plantillas
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
        templates.length,
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
                                column.uid === "actions" ? "center" : "start"
                            }
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"Sin plantillas registradas"} items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.id}>
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
