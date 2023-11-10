"use client";
import CardTareaDisplay from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardTareaDisplay";
import {
    Button,
    Chip,
    CircularProgress,
    Divider,
    Progress,
    Tabs,
    Tab,
    Card,
    CardBody,
    Input,
    Pagination,
    useDisclosure,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalContent,
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import TablaEntregables from "@/components/dashboardComps/projectComps/reportesComps/reporteGrupoProyectos/tablaEntregables";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
import CardContribuyente from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardContribuyente";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import MyDynamicTable from "@/components/DynamicTable";
import { dbDateToDisplayDate } from "@/common/dateFunctions";
axios.defaults.withCredentials = true;
export default function ReporteAlcance(props) {
    const [filterValue, setFilterValue] = React.useState("");
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [isClient, setIsClient] = useState(false);
    const columns = [
        {
            name: 'Nombre',
            uid: 'nombre',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        
        {
            name: 'Fecha Inicio',
            uid: 'fechaInicio',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: 'Fecha Fin',
            uid: 'fechaFin',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: '% Cumplido',
            uid: 'cumplido',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: 'N° Entregables',
            uid: 'entregables',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: '',
            uid: 'actions',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: false
        }
    ];
    const data = [
        {
            nombre: 'Proyecto A',
            fechaInicio: '2023-01-15',
            fechaFin: '2023-06-30',
            cumplido: 0.75,
            entregables: 10,
            id: 1
        },
        {
            nombre: 'Proyecto B',
            fechaInicio: '2023-03-10',
            fechaFin: '2023-09-20',
            cumplido: 0.60,
            entregables: 15,
            id: 2
        },
        // ... Otros conjuntos de datos
    ];
    
      
      
      
      const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [toolsFilter, setToolsFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(8);
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
                data.nombre.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (
            toolsFilter !== "all" &&
            Array.from(toolsFilter).length !== toolsOptions.length
        ) {
            filteredTemplates = filteredTemplates.filter((data) =>
                Array.from(toolsFilter).includes(data.nombre)
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
    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
        } else {
            setFilterValue("");
        }
    }, []);

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

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);
    const renderCell = React.useCallback((data, columnKey) => {
        const cellValue = data[columnKey];
        
        switch (columnKey) {
                
            case "fechaInicio":
                const dateIni = new Date(cellValue);
                if (!isNaN(dateIni)) {
                    const day = String(dateIni.getDate()).padStart(2, '0');
                    const month = String(dateIni.getMonth() + 1).padStart(2, '0');
                    const year = dateIni.getFullYear();
                    return `${day}/${month}/${year}`;
                }
            case "fechaFin":
                const dateFin = new Date(cellValue);
                if (!isNaN(dateFin)) {
                    const day = String(dateFin.getDate()).padStart(2, '0');
                    const month = String(dateFin.getMonth() + 1).padStart(2, '0');
                    const year = dateFin.getFullYear();
                    return `${day}/${month}/${year}`;
                }
            case "cumplido":
                return (cellValue*100).toFixed(2)+"%";
            case "actions":
                return (
                    <div className="flex justify-center items-center gap-2">
                        <Button
                            size="small"
                            auto
                            variant="ghost"
                            color="primary"
                            onClick={onOpen}
                        >
                            <SearchIcon />
                        </Button>
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
                        className="w-full sm:max-w-[100%]"
                        placeholder="Buscar proyecto.."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                        variant='faded'
                    />
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

        
        setIsClient(true);
      }, []);
      
      
    return (
        <>
            {isClient && (  <div className="ReporteGrupoPresupuesto">
                                
                                    
                                    <div className="TablaComparacion flex-1 shadow-md p-4 rounded border border-solid border-gray-300 max-h-750 transform transition-transform duration-100 ease-in  m-4">
                                        <MyDynamicTable 
                                        label ="Tabla Proyectos" 
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
                                        selectionMode="single"
                                    />
                                    </div>
                                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                                        <ModalContent>
                                            {(onClose) => (
                                                <>
                                                <ModalHeader className="flex flex-col gap-1">Lista de Entregables</ModalHeader>
                                                <ModalBody>
                                                    <TablaEntregables/>
                                                </ModalBody>
                                                <ModalFooter>                                   
                                                    <Button color="primary" onPress={onClose}>
                                                            Aceptar
                                                    </Button>
                                                </ModalFooter>
                                                </>
                                            )}
                                        </ModalContent>
                                    </Modal>

                            </div>
            )}    
        </>                
    );
};