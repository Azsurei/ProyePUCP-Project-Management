"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { 
    Button,
    Input,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    CircularProgress,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Chip,
    Divider,
    Pagination,
    Avatar,
    AvatarGroup,
    Tooltip,
} from "@nextui-org/react";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
import { HerramientasInfo, SmallLoadingScreen } from "../../layout";
import { set } from "date-fns";
import axios from "axios";
import { id } from "date-fns/esm/locale";
import { SearchIcon } from "@/../public/icons/SearchIcon";
import MyDynamicTable from "@/components/DynamicTable";
import PieChart from "@/components/PieChart";
import BarGraphic from "@/components/BarGraphic";
axios.defaults.withCredentials = true;
export default function ReporteRiesgos(props) {
    const {setIsLoadingSmall} = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const [filterValue, setFilterValue] = React.useState("");
    const [isClient, setIsClient] = useState(false);
    const {herramientasInfo} = useContext(HerramientasInfo);
    const [responsables, setResponsables] = useState([]);
    const urlRiesgos = "http://localhost:8080/api/proyecto/catalogoRiesgos/listarRiesgos/156"
     const [data, setData] = useState([]);
    useEffect(() => {
        setIsLoadingSmall(false);
        setIsClient(true);
    } , []);
    function DataTable(){
        const fetchData = async () => {
          try {
            // Realiza la solicitud HTTP al endpoint del router
            const stringURL =
            process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/catalogoRiesgos/listarRiesgos/" +
            projectId;
            const response = await axios.get(stringURL);
    
            // Actualiza el estado 'data' con los datos recibidos
            // setIdMatriz(response.data.matrizComunicacion.idMatrizComunicacion);
            setData(response.data.riesgos);
            setIsLoadingSmall(false);
            console.log(`Esta es la data:`, data);
            console.log(`Datos obtenidos exitosamente:`, response.data.riesgos);
          } catch (error) {
            console.error('Error al obtener datos:', error);
          }
        };
    
        fetchData();
      };
    // useEffect(() => {
    //     DataTable();
    // }, [projectId]);
    useEffect(() => {
        setIsLoadingSmall(true);
        DataTable();
        setIsClient(true);
    }, [projectId]);
    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
        } else {
            setFilterValue("");
        }
    }, []);
    const listUsers = [
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
    const columns = [
        {
            name: 'Riesgo',
            uid: 'nombreRiesgo',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        
        {
            name: 'Responsable',
            uid: 'responsables',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
        {
            name: 'Fecha identificacion',
            uid: 'fechaIdentificacion',
            className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
            sortable: true
        },
    ];
    // const data = [
    //     {
    //         idRiesgo: 1,
    //         nombreRiesgo: 'Riesgos de recursos',
    //         fechaIdentificacion: '07/09/2023',
    //         responsables: listUsers.map((user) => ({
    //             idUsuario: user.idUsuario,
    //             nombres: user.nombres,
    //             apellidos: user.apellidos,
    //             correoElectronico: user.correoElectronico,
    //             imgLink: user.imgLink,
    //         })),
    //         impactoRiesgo: 'Insignificante',
    //         nombreProbabilidad: 'Muy Baja'
    //     },
    //     {
    //         idRiesgo: 2,
    //         nombreRiesgo: 'Riesgos de recursos',
    //         fechaIdentificacion: '07/09/2023',
    //         responsables: listUsers.map((user) => ({
    //             idUsuario: user.idUsuario,
    //             nombres: user.nombres,
    //             apellidos: user.apellidos,
    //             correoElectronico: user.correoElectronico,
    //             imgLink: user.imgLink,
    //         })),
    //         impactoRiesgo: 'Menor',
    //         nombreProbabilidad: 'Baja'
    //     },
    //     {
    //         idRiesgo: 3,
    //         nombreRiesgo: 'Riesgos de recursos',
    //         fechaIdentificacion: '07/09/2023',
    //         responsables: listUsers.map((user) => ({
    //             idUsuario: user.idUsuario,
    //             nombres: user.nombres,
    //             apellidos: user.apellidos,
    //             correoElectronico: user.correoElectronico,
    //             imgLink: user.imgLink,
    //         })),
    //         impactoRiesgo: 'Moderado',
    //         nombreProbabilidad: 'Muy Baja'
    //     },
    //     {
    //         idRiesgo: 4,
    //         nombreRiesgo: 'Riesgos de recursos',
    //         fechaIdentificacion: '07/09/2023',
    //         responsables: listUsers.map((user) => ({
    //             idUsuario: user.idUsuario,
    //             nombres: user.nombres,
    //             apellidos: user.apellidos,
    //             correoElectronico: user.correoElectronico,
    //             imgLink: user.imgLink,
    //         })),
    //         impactoRiesgo: 'Mayor',
    //         nombreProbabilidad: 'Media'
    //     },
    //     {
    //         idRiesgo: 5,
    //         nombreRiesgo: 'Riesgos de recursos',
    //         fechaIdentificacion: '07/09/2023',
    //         responsables: listUsers.map((user) => ({
    //             idUsuario: user.idUsuario,
    //             nombres: user.nombres,
    //             apellidos: user.apellidos,
    //             correoElectronico: user.correoElectronico,
    //             imgLink: user.imgLink,
    //         })),
    //         impactoRiesgo: 'Catastrofico',
    //         nombreProbabilidad: 'Alta'
    //     },
    //     {
    //         idRiesgo: 6,
    //         nombreRiesgo: 'Riesgos de recursos',
    //         fechaIdentificacion: '07/09/2023',
    //         responsables: listUsers.map((user) => ({
    //             idUsuario: user.idUsuario,
    //             nombres: user.nombres,
    //             apellidos: user.apellidos,
    //             correoElectronico: user.correoElectronico,
    //             imgLink: user.imgLink,
    //         })),
    //         impactoRiesgo: 'Insignificante',
    //         nombreProbabilidad: 'Muy Alta'
    //     },
    //     {
    //         idRiesgo: 7,
    //         nombreRiesgo: 'Riesgos de recursos',
    //         fechaIdentificacion: '07/09/2023',
    //         responsables: listUsers.map((user) => ({
    //             idUsuario: user.idUsuario,
    //             nombres: user.nombres,
    //             apellidos: user.apellidos,
    //             correoElectronico: user.correoElectronico,
    //             imgLink: user.imgLink,
    //         })),
    //         impactoRiesgo: 'Menor',
    //         nombreProbabilidad: 'Muy Baja'
    //     },
    //     {
    //         idRiesgo: 8,
    //         nombreRiesgo: 'Riesgos de recursos',
    //         fechaIdentificacion: '07/09/2023',
    //         responsables: listUsers.map((user) => ({
    //             idUsuario: user.idUsuario,
    //             nombres: user.nombres,
    //             apellidos: user.apellidos,
    //             correoElectronico: user.correoElectronico,
    //             imgLink: user.imgLink,
    //         })),
    //         impactoRiesgo: 'Moderado',
    //         nombreProbabilidad: 'Muy Baja'
    //     },
    // ];
    
    const impactoCounts = {
        "Insignificante": 0,
        "Menor": 0,
        "Moderado": 0,
        "Mayor": 0,
        "Catastrófico": 0,
      };
      
      data.forEach(linea => {
        console.log(linea.nombreImpacto);
        impactoCounts[linea.nombreImpacto]++;
        console.log(impactoCounts);
      });
      
      const series = Object.values(impactoCounts);
      const labels = Object.keys(impactoCounts);
      
      const options = {
     
        labels: labels,
        responsive: [{
          breakpoint: 1000,
          options: {
            chart: {
              width: 1000
            },
            legend: {
              position: 'bottom',
            },

          }
        }],
        // title: {
        //     text: 'Grafico de Impacto'
        //   },
          colors: ['#8DFFA6', '#16C78E', '#FFFA8D', '#F0AE19', '#FF4D4D'],
          legend: {
            position: 'right',
            offsetY: 0, // Adjust the offset as needed
            fontSize: '20px',
            horizontalAlign: 'center',
            formatter: function(val, opts) {
                return val + " - " + opts.w.globals.series[opts.seriesIndex]
              },
              containerClass: 'horizontal-legend-container',
          }
      };
      const uniqueDates = [...new Set(data.map(item => item.fechaIdentificacion))];
      const probabilities = ["Muy Baja", "Baja", "Media", "Alta", "Muy Alta"];
      const categorizedData = {};
      
      // Initialize categorizedData with a two-dimensional array
      for (const prob of probabilities) {
        categorizedData[prob] = new Array(uniqueDates.length).fill(0);
      }
      
      // Iterate over the data and fill the arrays based on dates and probabilities
      data.forEach(item => {
        const dateIndex = uniqueDates.indexOf(item.fechaIdentificacion);
        if (dateIndex !== -1) {
          const probCategory = item.nombreProbabilidad;
          categorizedData[probCategory][dateIndex]++;
        }
      });
      
      // Now you have categorizedData object containing arrays for each probability category
      // with their respective counts on each date.
      
      // For example, categorizedData["Alta"] will contain the data for "Alta" probability.
      
      console.log("Categoria", categorizedData["Alta"]);
      
      const seriesBar = [
        {
          name: "Muy Baja",
          data: Array.from(categorizedData["Muy Baja"], count => count),
          color: '#8DFFA6'
        },
        {
          name: "Baja",
          data: Array.from(categorizedData["Baja"], count => count),
          color: '#16C78E'
        },
        {
          name: "Media",
          data: Array.from(categorizedData["Media"], count => count),
          color: '#FFFA8D'
        },
        {
          name: "Alta",
          data: Array.from(categorizedData["Alta"], count => count),
          color: '#F0AE19'
        },
        {
          name: "Muy Alta",
          data: Array.from(categorizedData["Muy Alta"], count => count),
          color: '#FF4D4D'
        },
      ];
      
      // Now the `seriesBar` array contains the categorized data for each probability category.
      
      

      const fechasSet = new Set();

      data.forEach(data => {
        const fecha = new Date(data.fechaIdentificacion);
        fechasSet.add(fecha.toISOString().split('T')[0]);
        console.log("Fechas: ", fechasSet);
        console.log("Series: ", seriesBar)
      });
      
      const fechasRiesgos = Array.from(fechasSet);


      const optionsBar = {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
          },
          plotOptions: {
            bar: {
              horizontal: true,
              dataLabels: {
                total: {
                  enabled: true,
                  offsetX: 0,
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
            text: 'Grafico de Probabilidades'
          },
          xaxis: {
            categories: fechasRiesgos,
            labels: {
              formatter: function (val) {
                return val;
              }
            }
          },
          yaxis: {
            title: {
              text: undefined
            },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return val;
              }
            }
          },
          fill: {
            opacity: 1
          },
          legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40
          }
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

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);
    const renderCell = React.useCallback((data, columnKey) => {
        const cellValue = data[columnKey];
        
        switch (columnKey) {
                
            case "fechaIdentificacion":
                const date = new Date(cellValue);
                if (!isNaN(date)) {
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                }
            case "responsables":
              console.log("Responsables: ", cellValue.responsables);
                return (
                    <AvatarGroup
                        isBordered
                        isGrid
                        max={3}
                        renderCount={(count) => (
                            <Avatar
                                isBordered={false}
                                color={"primary"}
                                className="w-[35px] h-[35px] text-tiny"
                                fallback={<p id="MoreUsrsIcn">+{count}</p>}
                            />
                        )}
                    >
                      
                        {data.responsables.map((user) => {
                            return (
                                <div
                                    className="flex gap-4 items-center border-sm"
                                    key={user.idUsuario}
                                >
                                <Tooltip
                                    content={
                                        <div className="px-1 py-2">
                                            <div className="text-small font-bold">
                                                {user.nombres + " " + user.apellidos}
                                            </div>
                                            <div className="text-small">
                                                {user.correoElectronico}
                                            </div>
                                        </div>
                                    }
                                    classNames={{
                                        base: "border border-slate-700 dark:border-slate-400 bg-mainSidebar",
                                        arrow: "border border-slate-700 dark:border-slate-400 bg-mainSidebar"}}
                                    showArrow
                                    >
                                    <Avatar
                                        isBordered
                                        color="default"
                                        src={user.imgLink}
                                        className="w-[40px] h-[40px] text-tiny"
                                        fallback={
                                            <p id="UsrNoIcon">
                                                {user.nombres[0] + user.apellidos[0]}
                                            </p>
                                        }
                                    />
                                </Tooltip>
                                </div>
                            );
                        })}
                    </AvatarGroup>
                );
                    // return (
                    // <AvatarGroup isBordered>
                    //     <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                    //     <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                    //     <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                    //     <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                    //     <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                    //     <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                    // </AvatarGroup>
                    // );
                    
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
                        placeholder="Buscar por riesgo..."
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
    return (
        <>
        {isClient && (
            <div className="divHistorialReportes">
                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem
                                href={"/dashboard/" + projectName + "=" + projectId}
                                    text={projectName}
                    />
                    <BreadcrumbsItem href="" text="Historial de Reportes" />
                </Breadcrumbs>
                <div className="flex flex-row justify-between items-center">
                    <div className="titleHistorialReporte text-mainHeaders">
                            Reporte de Presupuesto
                    </div>
                        <Button color="warning" className="text-white">
                            Guardar reporte
                        </Button>
                </div>
                <div className="ReporteRiesgos">
                    <div className="ListadoDeRiesgos">
                        {/* <Input
                            isClearable
                            className="w-full sm:max-w-[44%] mt-4"
                            placeholder="Buscar por riesgo..."
                            startContent={<SearchIcon />}
                            value={filterValue}
                            onClear={() => onClear()}
                            onValueChange={onSearchChange}
                            variant='faded'
                        />
                        <div
                                className="flex flex-row py-[.4rem] px-[1rem] 
                                bg-mainSidebar rounded-xl text-sm tracking-wider 
                                items-center mt-5 mb-2 text-[#a1a1aa]"
                            >
                                <p className="flex-1">Riesgos</p>
                                <p className="w-[30%]">Responsables</p>
                                <p className="w-[20%]">Fecha Identificado</p>
                            </div> */}
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
                            idKey="idRiesgo"
                            selectionMode="single"
                        />
                    </div>
                    <div className="GraficosRiesgos">
                        <div className="GraficoCircular w-full flex">
                            <PieChart options={options} series={series} client={isClient} title={"Grafico Impacto"} height={700} width = {400}/>
                        </div>
                        <div className="GraficoBarras">
                            <BarGraphic options={optionsBar} series={seriesBar} client={isClient} height={300} width={650}/>
                        </div>
                    </div>
                </div>
            </div>
        )}

        </>
    );
};