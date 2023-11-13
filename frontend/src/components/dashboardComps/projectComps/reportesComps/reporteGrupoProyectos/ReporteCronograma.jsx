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

} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import React, { useEffect, useState, useContext, useRef } from "react";
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
    const [isClient, setIsClient] = useState(false);
    const idGrupoProyecto = props.groupProject;
    const urlPrueba = "http://localhost:8080/api/proyecto/grupoProyectos/listarDatosProyectosXGrupo/6";
    const [proyectos, setProyectos] = useState([]);
    const [cantidadTarea, setCantidadTarea] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/grupoProyectos/listarDatosProyectosXGrupo/${idGrupoProyecto}`);
              console.log("Id Grupo: ", idGrupoProyecto);
              const data = response.data.proyectos;
              console.log(`Estos son los proyectos:`, data);
              setProyectos(data);
            } catch (error) {
              console.error('Error al obtener los proyectos:', error);
            }
          };
            fetchData();
        setIsClient(true);
    }, []);
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
      // const seriesTime = [
      //   {
      //     data: [
      //       {
      //         x: 'Analysis',
      //         y: [
      //           new Date('2019-02-27').getTime(),
      //           new Date('2019-03-04').getTime()
      //         ],
      //         fillColor: '#008FFB'
      //       },
      //       {
      //         x: 'Design',
      //         y: [
      //           new Date('2019-03-04').getTime(),
      //           new Date('2019-03-08').getTime()
      //         ],
      //         fillColor: '#00E396'
      //       },
      //       {
      //         x: 'Coding',
      //         y: [
      //           new Date('2019-03-07').getTime(),
      //           new Date('2019-03-10').getTime()
      //         ],
      //         fillColor: '#775DD0'
      //       },
      //       {
      //         x: 'Testing',
      //         y: [
      //           new Date('2019-03-08').getTime(),
      //           new Date('2019-03-12').getTime()
      //         ],
      //         fillColor: '#FEB019'
      //       },
      //       {
      //         x: 'Deployment',
      //         y: [
      //           new Date('2019-03-12').getTime(),
      //           new Date('2019-03-17').getTime()
      //         ],
      //         fillColor: '#FF4560'
      //       }
      //     ]
      //   }
      // ]
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
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const [seriesTime, setseriesTime,] = useState([]);
  useEffect(() => {
    // Actualizar datos de seriesArea cuando cambie la pestaña/tab
    const updateSeriesData = (index) => {// Obtener el proyecto correspondiente al índice de la pestaña
      if (proyectos && proyectos.length > index) {
        const proyecto = proyectos[index];
        if (proyecto && proyecto.cronograma && proyecto.cronograma.tareas) {

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
          
          // Actualizar seriesArea con los datos del proyecto seleccionado
          setseriesTime(newSeriesTime);
        }
      }

    };
    
    // Lógica para cambiar la pestaña/tab y actualizar los datos
    handleTabChange(activeTab);
    updateSeriesData(activeTab); // Llamada inicial para establecer el primer proyecto al cargar
  }, [ activeTab, proyectos]); 
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
                                      <Tabs key="uniqueKeyForTabs" color="warning" aria-label="Tabs colors" radius="full" selectedKey={activeTab} onSelectionChange={handleTabChange}>    
                                            {proyectos.map((proyecto, index) => (
                                                    <Tab key={index} title={proyecto.nombre}/>  
                                            ))}
                                        </Tabs>
                                        <RangeBar options={optionsTime} series={seriesTime} client={isClient} height={500} width={1450}/>
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
            )}    
        </>                
    );
};