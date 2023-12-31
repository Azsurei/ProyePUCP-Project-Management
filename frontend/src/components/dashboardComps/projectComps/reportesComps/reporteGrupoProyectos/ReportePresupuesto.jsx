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
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";

import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
import CardContribuyente from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardContribuyente";
import PieChart from "@/components/PieChart";
import BarGraphic from "@/components/BarGraphic";
import AreaChart from "@/components/AreaChart";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import MyDynamicTable from "@/components/DynamicTable";
import { dbDateToDisplayDate } from "@/common/dateFunctions";
axios.defaults.withCredentials = true;
export default function ReportePresupuesto(props) {
    const [filterValue, setFilterValue] = React.useState("");
    const isClient = props.isClient;
    const idGrupoProyecto = props.groupProject;
    const proyectos = props.proyectos;
    const urlPrueba = "http://localhost:8080/api/proyecto/grupoProyectos/listarProyectosXGrupo/4"
    const [selectedKeysDrop, setSelectedKeysDrop] = React.useState(new Set(["0"]));
    const columns = [
        {
            name: 'Nombre',
            uid: 'nombreProyecto',
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
    const calcularTotales = (proyectos) => {
      return proyectos.map((proyecto) => {
        const totalIngresos = proyecto.ingresos.reduce((total, ingreso) => total + ingreso.monto, 0);
        const totalEgresos = proyecto.egresos.reduce((total, egreso) => total + egreso.costoReal, 0);
        const disponible = totalIngresos - totalEgresos;
  
        return {
          ...proyecto,
          totalIngresos,
          totalEgresos,
          disponible
        };
      });
    };
  //   const [proyectos, setProyectos] = useState([]);
  //   const DataProyectos = async () => {
  //     const fetchData = async () => {
  //         try {
  //           const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/grupoProyectos/listarProyectosXGrupo/${idGrupoProyecto}`);
  //           console.log("Id Grupo: ", idGrupoProyecto);
  //           const data = response.data.proyectos;
           
  //           // setProyectos(response.data.proyectos);
  //           const proyectosConTotales = calcularTotales(data);
  //           console.log("Paso1: ");
  //           setProyectos(proyectosConTotales);
  //           console.log(`Estos son los proyectos:`, data);
  //           setIsClient(true);
  //         } catch (error) {
  //           console.error('Error al obtener los proyectos:', error);
  //         }
  //       };
  //         fetchData();
  // };
  const selectedValue = React.useMemo(() => {
    const selectedIndex = Array.from(selectedKeysDrop)[0]; // Obtiene el índice del Set
    return proyectos[selectedIndex]?.nombreProyecto || '';
  }, [selectedKeysDrop, proyectos]);
    const data = [
        {
          idProyecto: 156,
          idPresupuesto: 36,  
          nombreProyecto: 'Grupo A',
          lineasIngreso: [],
          lineasEgreso: [],
          totalIngresos: 5000,
          totalEgresos: 3000,
          montoDisponible: 2000,
        },
        {
          idProyecto: 157,
          idPresupuesto: 37,
          nombreProyecto: 'Grupo B',
          lineasIngreso: [],
          lineasEgreso: [],
          totalIngresos: 8000,
          totalEgresos: 4000,
          montoDisponible: 4000,
        },
        {
          idProyecto: 158,  
          idPresupuesto: 38,
          nombreProyecto: 'Grupo C',
          lineasIngreso: [],
          lineasEgreso: [],
          totalIngresos: 6000,
          totalEgresos: 7000,
          montoDisponible: 4000,
        },
        // Puedes agregar más objetos según sea necesario
      ];
      const primerDato = data[0];
     const idPresupuestoPrimerDato = primerDato.idPresupuesto;
      const nombresProyectos = proyectos.map(item => item.nombreProyecto);
      const ingresos = proyectos.map(item => item.totalIngresos);
      const egresos = proyectos.map(item => item.totalEgresos);
      const presupuestoCounts = {
        "Dentro del Presupuesto": 0,
        "Sobre el Presupuesto": 0,
      };
      
      proyectos.forEach(proyecto => {
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
    //   const [lineasIngreso, setLineasIngreso] = useState([]);
    // const [lineasEgreso, setLineasEgreso] = useState([]);
    //   const DataTable = async (idPresupuesto) => {
    //     const fetchData = async () => {
    //         try {
    //           const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasIngresoYEgresoXIdPresupuesto/${idPresupuesto}`);
    //           const data = response.data.lineas;
    //           setLineasIngreso(response.data.lineas.lineasIngreso);
    //           setLineasEgreso(response.data.lineas.lineasEgreso);
    //           console.log(`Esta es la data:`, data);
    //             console.log(`Datos obtenidos exitosamente:`, response.data.lineasIngreso);
    //         } catch (error) {
    //           console.error('Error al obtener las líneas de ingreso:', error);
    //         }
    //       };
    //         fetchData();
    // };
   
      const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [toolsFilter, setToolsFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(4);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "descripcion",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    // Variables adicionales
    const pages = Math.ceil(proyectos.length / rowsPerPage);
    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = React.useMemo(() => {
        let filteredTemplates = [...proyectos];

        if (hasSearchFilter) {
            filteredTemplates = filteredTemplates.filter((data) =>
                data.nombreProyecto.toLowerCase().includes(filterValue.toLowerCase())
            );
        }
        if (
            toolsFilter !== "all" &&
            Array.from(toolsFilter).length !== toolsOptions.length
        ) {
            filteredTemplates = filteredTemplates.filter((data) =>
                Array.from(toolsFilter).includes(data.nombreProyecto)
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
    // useEffect(() => {
    //     console.log("Grupo proyecto: ", props.groupProject);
    //     setIsClient(false);
    //     // DataTable(idPresupuestoPrimerDato);
    //     DataProyectos();
    //     console.log("Proyectos Final", proyectos);
        
    //   }, [idPresupuestoPrimerDato, idGrupoProyecto]);
//       const lineasIngreso = proyectos.length > 0 ? proyectos[0].ingresos : [];
// const lineasEgreso = proyectos.length > 0 ? proyectos[0].egresos : [];
const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
    console.log(`Tab activa:`, index);
  };
  const [lineasIngreso, setLineasIngreso] = useState([]);
   const [lineasEgreso, setLineasEgreso] = useState([]);
  const [seriesArea, setSeriesArea] = useState([]);
  useEffect(() => {
    // Actualizar datos de seriesArea cuando cambie la pestaña/tab
    // const updateSeriesData = (index) => {// Obtener el proyecto correspondiente al índice de la pestaña
    //   if (proyectos && proyectos.length > index) {
    //     const proyecto = proyectos[index];
    //     if (proyecto && proyecto.ingresos && proyecto.egresos) {
    //       setLineasIngreso(proyecto.ingresos);
    //       setLineasEgreso(proyecto.egresos);
    //       const newSeriesArea = [
    //         {
    //           name: 'Ingresos',
    //           data: proyecto.ingresos.map(item => item.monto),
    //           color: '#16C78E'
    //         },
    //         {
    //           name: 'Egresos',
    //           data: proyecto.egresos.map(item => item.costoReal),
    //           color: '#FF4D4D'
    //         }
    //       ];
          
    //       // Actualizar seriesArea con los datos del proyecto seleccionado
    //       setSeriesArea(newSeriesArea);
    //     }
    //   }

    // };
    
    // // Lógica para cambiar la pestaña/tab y actualizar los datos
    // handleTabChange(activeTab);
    // updateSeriesData(activeTab);
    const selectedIndex = parseInt(Array.from(selectedKeysDrop)[0]);
    if (!isNaN(selectedIndex) && proyectos[selectedIndex]) {
      const proyecto = proyectos[selectedIndex];
      setLineasIngreso(proyecto.ingresos);
            setLineasEgreso(proyecto.egresos);
            const newSeriesArea = [
              {
                name: 'Ingresos',
                data: proyecto.ingresos.map(item => item.monto),
                color: '#16C78E'
              },
              {
                name: 'Egresos',
                data: proyecto.egresos.map(item => item.costoReal),
                color: '#FF4D4D'
              }
            ];
      setSeriesArea(newSeriesArea);
    }
    // Llamada inicial para establecer el primer proyecto al cargar
  }, [selectedKeysDrop, proyectos]); 
      // const seriesArea = [
      //   {
      //     name: 'Ingresos',
      //     data: lineasIngreso.map(item => item.monto),
      //     color: '#16C78E'
      //   },
      //   {
      //     name: 'Egresos',
      //     data: lineasEgreso.map(item => item.costoReal),
      //     color: '#FF4D4D'
      //   }
      // ];
      console.log('Series con datos de montos:', seriesArea);
      const uniqueDatesSet = new Set();

lineasIngreso.forEach(item => {
  uniqueDatesSet.add(item.fechaTransaccion); // Cambia al nombre correcto
});

lineasEgreso.forEach(item => {
  uniqueDatesSet.add(item.fechaRegistro); // Cambia al nombre correcto
});

const uniqueDatesArray = Array.from(uniqueDatesSet);
const formattedDates = uniqueDatesArray.map(date => {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('es').format(dateObj);
});
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
            categories: formattedDates,

          },
          tooltip: {
            x: {
              format: 'dd/MM/yy HH:mm'
            },
          },
      };
      
    return (
        <>
            {isClient ? (  <div className="ReporteGrupoPresupuesto">
                                <div className="flex">
                                    <div className="GraficoCircular ">
                                        
                                        <PieChart options={options} series={series} client={isClient} title={"Grafico Estado"} height={1500} width = {580}/>
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
                                        idKey="idProyecto"
                                        selectionMode="single"
                                    />
                                    </div>
                                </div>

                                
                                    <div className="GraficoBarras">
                                        <BarGraphic options={optionsBar} series={seriesBar} client={isClient} height={500} width={1750}/>
                                    </div>
                                    <div className=" GraficoDeLineas flex-1 shadow-md p-4 rounded border border-solid border-gray-300 max-h-750 transform transition-transform duration-100 ease-in  m-4">
                                    {/* <Tabs key="uniqueKeyForTabs" color="success" aria-label="Tabs colors" radius="full" selectedKey={activeTab} onSelectionChange={handleTabChange}>    
                                            {proyectos.map((proyecto, index) => (
                                                    <Tab key={index} title={proyecto.nombreProyecto}/>  
                                            ))}
                                        </Tabs> */}
                                        <Dropdown>
                                        <DropdownTrigger>
                                          <Button 
                                            variant="bordered" 
                                            className="capitalize"
                                          >
                                            {selectedValue}
                                          </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu 
                                          aria-label="Single selection example"
                                          variant="flat"
                                          disallowEmptySelection
                                          selectionMode="single"
                                          selectedKeys={selectedKeysDrop}
                                          onSelectionChange={setSelectedKeysDrop}
                                        >
                                          {proyectos.map((proyecto, index) => (
                                              <DropdownItem key={index} title={proyecto.nombreProyecto}>{proyecto.nombreProyecto}</DropdownItem>  
                                            ))}
                                        </DropdownMenu>
                                      </Dropdown>
                                        <AreaChart options={optionsArea} series={seriesArea} client={isClient} height={500} width={1750}/>
                                    </div>
                                

                            </div>
            ): (
              <div className="flex justify-center items-center h-full mt-32">
                <CircularProgress size="lg" aria-label="Loading..."/>
            </div>
            )}    
        </>                
    );
};