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
    input,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import React, { useEffect, useState, useContext, useRef, use } from "react";
import axios from "axios";
import TablaCronograma from "@/components/dashboardComps/projectComps/reportesComps/reporteGrupoProyectos/TablaCronograma";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
import CardContribuyente from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardContribuyente";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import MyDynamicTable from "@/components/DynamicTable";
import { dbDateToDisplayDate, inputDateToDisplayDate } from "@/common/dateFunctions";
import BarGraphic from "@/components/BarGraphic";
import { set, differenceInDays  } from "date-fns";
import RangeBar from "@/components/RangeBar";
axios.defaults.withCredentials = true;
export default function ReporteCronograma(props) {
    const [filterValue, setFilterValue] = React.useState("");
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const isClient = props.isClient;
    const idGrupoProyecto = props.groupProject;
    const urlPrueba = "http://localhost:8080/api/proyecto/grupoProyectos/listarDatosProyectosXGrupo/6";
    // const [proyectos, setProyectos] = useState([]);
    const proyectos = props.proyectos;
    const [cantidadTarea, setCantidadTarea] = useState(0);
    const [primerNombreProyecto, setPrimerNombreProyecto] = useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["0"]));
    // const selectedValue = React.useMemo(
    //   () => Array.from(selectedKeys)
    //   [selectedKeys]
    // );
    // useEffect(() => {
    //   setIsClient(false);
    //     const fetchData = async () => {
    //         try {
    //           const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/grupoProyectos/listarDatosProyectosXGrupo/${idGrupoProyecto}`);
    //           console.log("Id Grupo: ", idGrupoProyecto);
    //           const data = response.data.proyectos;
    //           console.log(`Estos son los proyectos:`, data);
    //           setProyectos(data);
    //           setIsClient(true);
    //         } catch (error) {
    //           console.error('Error al obtener los proyectos:', error);
    //         }
    //       };
    //         fetchData();
        
    // }, []);
    const selectedValue = React.useMemo(() => {
      const selectedIndex = Array.from(selectedKeys)[0]; // Obtiene el índice del Set
      return proyectos[selectedIndex]?.nombre || '';
    }, [selectedKeys, proyectos]);
    const nombresProyectos = proyectos.map(proyecto => proyecto.nombre);
    console.log(nombresProyectos);

    const conteoTareas = proyectos.map(proyecto => (proyecto.cronograma && proyecto.cronograma.tareas) ? proyecto.cronograma.tareas.length : 0);
    console.log("cantidad de tareas", conteoTareas);
    const promedioProgresoPorProyecto = proyectos.map(proyecto => {
        const numeroTareas = proyecto.cronograma.tareas.length;
        const progresoTotal = proyecto.cronograma.tareas.reduce((total, tarea) => total + tarea.porcentajeProgreso, 0);
        const promedio = numeroTareas > 0 ? progresoTotal / numeroTareas : 0;
    
        return promedio;
    });
    
    console.log(promedioProgresoPorProyecto);

      
      const seriesBar = [
        {
          data: conteoTareas,
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
          categories: nombresProyectos,
        }
      };

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
          formatter: function (val, opts) {
            const label = opts.w.globals.labels[opts.dataPointIndex];
            const a = new Date(val[0]);
            const b = new Date(val[1]);
            const diff = differenceInDays(b, a);
            return label + ': ' + diff + (diff > 1 ? ' dias' : ' dia');
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
      const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (index) => {
    setActiveTab(index);
    console.log(`Tab activa:`, index);
  };
  const handleKeysChange = (index) => {
    setSelectedKeys(index);
    console.log(`Key activa:`, index);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const [seriesTime, setseriesTime,] = useState([]);
  useEffect(() => {console.log("Esta es la llave", selectedKeys)}, [selectedKeys]);
  useEffect(() => {
    const selectedIndex = parseInt(Array.from(selectedKeys)[0]);
  if (!isNaN(selectedIndex) && proyectos[selectedIndex]) {
    const proyecto = proyectos[selectedIndex];
    const newSeriesTime = [
      {
        data: proyecto.cronograma.tareas.map(task => ({
          x: task.sumillaTarea,
          y: [
            new Date(task.fechaInicio).getTime(),
            new Date(task.fechaFin).getTime()
          ],
          fillColor: getRandomColor()
        }))
      }
    ];
    setseriesTime(newSeriesTime); // Actualiza el estado con los datos del nuevo proyecto
  } // Llamada inicial para establecer el primer proyecto al cargar
  }, [ selectedKeys, proyectos]); 
    return (
        <>
            {isClient ? (  <div className="ReporteGrupoPresupuesto">
                                
                                    <div className="flex">
                                        <div className="Grafico Barras">
                                           
                                        <BarGraphic title="Cantidad de tareas" options={optionsBar} series={seriesBar} client={isClient} height={300} width={750}/>
                                        </div>
                                        <div className="Progreso flex-1 shadow-md p-4 rounded border border-solid border-gray-300 max-h-96 transform transition-transform duration-100 ease-in m-4 overflow-auto">
                                            <div className="titleBalanceData">Progreso de tareas</div>
                                            {proyectos.map((proyecto, index) => (
                                                <>
                                                    
                                                    <Progress
                                                    size="md"
                                                    radius="sm"
                                                    classNames={{
                                                      base: "w-full pt-4 pb-4",
                                                      track: "drop-shadow-md border border-default",
                                                      indicator: "bg-gradient-to-r from-pink-500 to-yellow-500",
                                                      label: "tracking-wider font-medium text-default-700",
                                                      value: "text-foreground/100",
                                                    }}
                                                    label={proyecto.nombre}
                                                    value={promedioProgresoPorProyecto[index]}
                                                    showValueLabel={true}
                                                  />
                                                </>
                                            ))}
                                        </div>  
                                    </div>
                                    

                                    <div className="flex-1 shadow-md p-4 rounded border border-solid border-gray-300 max-h-750 transform transition-transform duration-100 ease-in  m-4">
                                      <div className="flex gap-8">
                                      <p className="flex text-3xl font-bold font-montserrat">Duracion de las tareas</p>
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
                                          selectedKeys={selectedKeys}
                                          onSelectionChange={setSelectedKeys}
                                        >
                                          {proyectos.map((proyecto, index) => (
                                              <DropdownItem key={index} title={proyecto.nombre}>{proyecto.nombre}</DropdownItem>  
                                            ))}
                                        </DropdownMenu>
                                      </Dropdown>
                                      </div>
                                    
                                        <RangeBar options={optionsTime} series={seriesTime} client={isClient} height={500} width={1650}/>
                                    </div>
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
            ) : (
              <div className="flex justify-center items-center h-full mt-32">
                  <CircularProgress size="lg" aria-label="Loading..."/>
              </div>
            )}    
        </>                
    );
};