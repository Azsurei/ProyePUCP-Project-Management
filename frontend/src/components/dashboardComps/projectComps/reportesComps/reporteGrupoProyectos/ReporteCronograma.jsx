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
import TablaCronograma from "@/components/dashboardComps/projectComps/reportesComps/reporteGrupoProyectos/TablaCronograma";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
import CardContribuyente from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardContribuyente";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import MyDynamicTable from "@/components/DynamicTable";
import { dbDateToDisplayDate } from "@/common/dateFunctions";
import BarGraphic from "@/components/BarGraphic";
axios.defaults.withCredentials = true;
export default function ReporteCronograma(props) {
    const [filterValue, setFilterValue] = React.useState("");
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [isClient, setIsClient] = useState(false);
    const idGrupoProyecto = props.groupProject;
    const urlPrueba = "http://localhost:8080/api/proyecto/grupoProyectos/listarDatosProyectosXGrupo/6";
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/grupoProyectos/listarDatosProyectosXGrupo/${idGrupoProyecto}`);
              console.log("Id Grupo: ", idGrupoProyecto);
              const data = response.data.proyectos;
              console.log(`Estos son los proyectos:`, data);
              
            } catch (error) {
              console.error('Error al obtener los proyectos:', error);
            }
          };
            fetchData();
        setIsClient(true);
    }, []);
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
            name: 'Progreso Total',
            uid: 'progreso',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: 'N° tareas',
            uid: 'tareas',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: '',
            uid: 'actions',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: false
        },
        {
            name: 'Entrega',
            uid: 'entrega',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        }

    ];
    const data = [
        {
            nombre: 'Proyecto A',
            fechaInicio: '2023-01-15',
            fechaFin: '2023-06-30',
            progreso: 0.75,
            tareas: 10,
            entrega: 'Cumplido',
            id: 1,
            idCronograma: 1
        },
        {
            nombre: 'Proyecto B',
            fechaInicio: '2023-03-10',
            fechaFin: '2023-09-20',
            progreso: 0.60,
            tareas: 15,
            entrega: 'Atrasado',
            id: 2,
            idCronograma: 1
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
            case "progreso":
                return (
                    <Progress size="md" aria-label="Loading..." value={data.progreso*100} />
                );
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
      
      const seriesBar = [
        {
          data: [44, 55, 41, 67, 22, 43],
        },
      ];
      const optionsBar = {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
            'United States', 'China', 'Germany'
          ],
        }
      };
      const seriesTime = [
        {
          data: [
            {
              x: 'Analysis',
              y: [
                new Date('2019-02-27').getTime(),
                new Date('2019-03-04').getTime()
              ],
              fillColor: '#008FFB'
            },
            {
              x: 'Design',
              y: [
                new Date('2019-03-04').getTime(),
                new Date('2019-03-08').getTime()
              ],
              fillColor: '#00E396'
            },
            {
              x: 'Coding',
              y: [
                new Date('2019-03-07').getTime(),
                new Date('2019-03-10').getTime()
              ],
              fillColor: '#775DD0'
            },
            {
              x: 'Testing',
              y: [
                new Date('2019-03-08').getTime(),
                new Date('2019-03-12').getTime()
              ],
              fillColor: '#FEB019'
            },
            {
              x: 'Deployment',
              y: [
                new Date('2019-03-12').getTime(),
                new Date('2019-03-17').getTime()
              ],
              fillColor: '#FF4560'
            }
          ]
        }
      ]
      const optionsTime = {
        chart: {
            height: 350,
            type: 'rangeBar'
          },
          plotOptions: {
            bar: {
              horizontal: true,
              distributed: true,
              dataLabels: {
                hideOverflowingLabels: false
              }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function(val, opts) {
              var label = opts.w.globals.labels[opts.dataPointIndex]
              var a = moment(val[0])
              var b = moment(val[1])
              var diff = b.diff(a, 'days')
              return label + ': ' + diff + (diff > 1 ? ' days' : ' day')
            },
            style: {
              colors: ['#f3f4f5', '#fff']
            }
          },
          xaxis: {
            type: 'datetime'
          },
          yaxis: {
            show: false
          },
          grid: {
            row: {
              colors: ['#f3f4f5', '#fff'],
              opacity: 1
            }
          }
        };
    return (
        <>
            {isClient && (  <div className="ReporteGrupoPresupuesto">
                                
                                    <div className="flex">
                                        <div className="Grafico Barras">
                                            {/* <MyDynamicTable 
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
                                            /> */}
                                        <BarGraphic options={optionsBar} series={seriesBar} client={isClient} height={300} width={750}/>
                                        </div>
                                        <div className="flex-1 shadow-md p-4 rounded border border-solid border-gray-300 max-h-750 transform transition-transform duration-100 ease-in  m-4">

                                        </div>  
                                    </div>
                                    

                                    <div className="flex-1 shadow-md p-4 rounded border border-solid border-gray-300 max-h-750 transform transition-transform duration-100 ease-in  m-4"></div>
                                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                                        <ModalContent>
                                            {(onClose) => (
                                                <>
                                                <ModalHeader className="flex flex-col gap-1">Lista de Entregables</ModalHeader>
                                                <ModalBody>
                                                    <TablaCronograma/>
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