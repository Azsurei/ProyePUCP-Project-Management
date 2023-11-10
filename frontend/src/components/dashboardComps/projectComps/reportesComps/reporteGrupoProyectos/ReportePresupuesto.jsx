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
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";

import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
import CardContribuyente from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardContribuyente";
import PieChart from "@/components/PieChart";
import BarGraphic from "@/components/BarGraphic";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import MyDynamicTable from "@/components/DynamicTable";
import { dbDateToDisplayDate } from "@/common/dateFunctions";
axios.defaults.withCredentials = true;
export default function ReportePresupuesto(props) {
    const [filterValue, setFilterValue] = React.useState("");
    const [isClient, setIsClient] = useState(false);
    const columns = [
        {
            name: 'Nombre',
            uid: 'nombre',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        
        {
            name: 'Total Ingresos',
            uid: 'totalIngresos',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: 'Total Egresos',
            uid: 'totalEgresos',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: 'Monto Disponible',
            uid: 'montoDisponible',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
    ];
    const listProyectos = [
        {
            idUsuario: 1,
            nombres: "Juan",
            apellidos: "Perez",
            correoElectronico: "juan.perez@example.com",
            imgLink: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        },
        {
            idUsuario: 2,
            nombres: "María",
            apellidos: "González",
            correoElectronico: "maria.gonzalez@example.com",
            imgLink: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        },
        // Otros usuarios...
    ];
    const data = [
        {
          id: 156,
          idPresupuesto: 36,  
          nombre: 'Grupo A',
          totalIngresos: 5000,
          totalEgresos: 3000,
          montoDisponible: 2000,
        },
        {
          id: 157,
          idPresupuesto: 37,
          nombre: 'Grupo B',
          totalIngresos: 8000,
          totalEgresos: 4000,
          montoDisponible: 4000,
        },
        {
          id: 158,  
          idPresupuesto: 38,
          nombre: 'Grupo C',
          totalIngresos: 6000,
          totalEgresos: 7000,
          montoDisponible: 4000,
        },
        // Puedes agregar más objetos según sea necesario
      ];
      const primerDato = data[0];
     const idPresupuestoPrimerDato = primerDato.idPresupuesto;
      const nombresProyectos = data.map(item => item.nombre);
      const ingresos = data.map(item => item.totalIngresos);
      const egresos = data.map(item => item.totalEgresos);
      const presupuestoCounts = {
        "Dentro del Presupuesto": 0,
        "Sobre el Presupuesto": 0,
      };
      
      data.forEach(proyecto => {
        if ((proyecto.totalIngresos - proyecto.totalEgresos) > 0) {
          presupuestoCounts["Dentro del Presupuesto"]++;
        } else {
          presupuestoCounts["Sobre el Presupuesto"]++;
        }
      });
      
      // Verifica las etiquetas y series después de calcular
      const labels = Object.keys(presupuestoCounts);
      const series = Object.values(presupuestoCounts);
      
      console.log("Labels:", labels);
      console.log("Series:", series);

      
      const options = {
     
        labels: labels,
        responsive: [{
          breakpoint: 1000,
          options: {
            chart: {
              width: 1000
            },
            legend: {
              position: 'right',
            },

          }
        }],
        // title: {
        //     text: 'Grafico de Impacto'
        //   },
          colors: ['#16C78E', '#FF4D4D'],
          legend: {
            position: 'right',
            offsetY: 0, // Adjust the offset as needed
            fontSize: '16px',
            horizontalAlign: 'center',
            formatter: function(val, opts) {
                return val
              },
              containerClass: 'horizontal-legend-container',
          }
      };

      const seriesBar = [
        {
          name: 'Ingresos',
          data: ingresos,
          color: '#16C78E'
        },
        {
          name: 'Egresos',
          data: egresos,
          color: '#FF4D4D'
        }
      ];
      const optionsBar = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
                show: true
              },
              zoom: {
                enabled: true
              }
          },
          responsive: [{
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }],
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 10,
              dataLabels: {
                total: {
                  enabled: true,
                //   offsetX: 0,
                  style: {
                    fontSize: '13px',
                    fontWeight: 900
                  }
                }
              }
            },
          },
          stroke: {
            width: 1,
            colors: ['#fff']
          },
          title: {
            text: 'Ingresos y Egresos'
          },
          xaxis: {
            categories: nombresProyectos,
            labels: {
              formatter: function (val) {
                return val;
              }
            }
          },
          fill: {
            opacity: 1
          },
          legend: {
            position: 'right',
            offsetY: 40
          }
      };
      const [lineasIngreso, setLineasIngreso] = useState([]);
    const [lineasEgreso, setLineasEgreso] = useState([]);
      const DataTable = async () => {
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasIngresoYEgresoXIdPresupuesto/${idPresupuestoPrimerDato}`);
              const data = response.data.lineas;
              setLineasIngreso(response.data.lineas.lineasIngreso);
              setLineasEgreso(response.data.lineas.lineasEgreso);
              console.log(`Esta es la data:`, data);
                console.log(`Datos obtenidos exitosamente:`, response.data.lineasIngreso);
            } catch (error) {
              console.error('Error al obtener las líneas de ingreso:', error);
            }
          };
            fetchData();
    };
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
                
            case "montoDisponible":
                return (data.totalIngresos - data.totalEgresos).toFixed(2) ;
                    
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
        DataTable();
        setIsClient(true);
      }, [idPresupuestoPrimerDato]);

      const seriesArea = [
        {
          name: 'Ingresos',
          data: lineasIngreso.map(item => item.monto),
          color: '#16C78E'
        },
        {
          name: 'Egresos',
          data: lineasEgreso.map(item => item.monto),
          color: '#FF4D4D'
        }
      ];
      console.log('Series con datos de montos:', seriesArea);
      const uniqueDatesSet = new Set();

lineasIngreso.forEach(item => {
  uniqueDatesSet.add(item.fechaTransaccion); // Cambia al nombre correcto
});

lineasEgreso.forEach(item => {
  uniqueDatesSet.add(item.fechaRegistro); // Cambia al nombre correcto
});

const uniqueDatesArray = Array.from(uniqueDatesSet);
console.log('Fechas únicas:', uniqueDatesArray);
      const optionsArea = {
        chart: {
            type: 'area',
            height: 350,
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'Historia de Ingresos y Egresos'
          },
          xaxis: {
            type: 'date',
            categories: uniqueDatesArray,

          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
      };
    return (
        <>
            {isClient && (  <div className="ReporteGrupoPresupuesto">
                                <div className="flex">
                                    <div className="GraficoDeLineas flex-1 shadow-md p-4 rounded border border-solid border-gray-300 max-h-750 transform transition-transform duration-100 ease-in  m-4">

                                    </div>
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
                                </div>

                                <div className="flex">
                                    <div className="GraficoBarras">
                                        <BarGraphic options={optionsBar} series={seriesBar} client={isClient} height={300} width={680}/>
                                    </div>
                                    <div className="GraficoCircular">
                                        <PieChart options={options} series={series} client={isClient} title={"Grafico Estado"} height={1500} width = {580}/>
                                    </div>
                                </div>

                            </div>
            )}    
        </>                
    );
};