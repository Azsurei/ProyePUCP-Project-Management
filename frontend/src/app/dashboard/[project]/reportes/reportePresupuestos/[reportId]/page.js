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
    useDisclosure,
} from "@nextui-org/react";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
import BarGraphic from "@/components/BarGraphic";
import { HerramientasInfo, SmallLoadingScreen } from "../../../layout";
import { set } from "date-fns";
import axios from "axios";
import { id } from "date-fns/esm/locale";
import { useRouter } from "next/navigation";
import ModalSave from "@/components/dashboardComps/projectComps/reportesComps/ModalSave";
import { SessionContext } from "@/app/dashboard/layout";
axios.defaults.withCredentials = true;
export default function ReportePresupuestos(props) {
    const {setIsLoadingSmall} = useContext(SmallLoadingScreen);
    const router = useRouter();
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const { sessionData } = useContext(SessionContext);
    const [filterValue, setFilterValue] = React.useState("");
    const [isClient, setIsClient] = useState(false);
    const {herramientasInfo} = useContext(HerramientasInfo);
    // const idPresupuesto = herramientasInfo[12].idHerramientaCreada;
    const idPresupuesto = herramientasInfo.find(herramienta => herramienta.idHerramienta === 13).idHerramientaCreada;
    const [IngresosTotales, setIngresosTotales] = useState(null);
    const [EgresosTotales, setEgresosTotales] = useState(null);
    const [EstimacionTotales, setEstimacionTotales] = useState(null);
    const [lineasIngreso, setLineasIngreso] = useState([]);
    const [lineasEgreso, setLineasEgreso] = useState([]);
    const [lineasEstimacion, setLineasEstimacion] = useState([]);
    const [vistaReporte, setVistaReporte] = useState(false);
    const [presupuesto, setPresupuesto] = useState([]);
    const [presupuestoReporte, setPresupuestoReporte] = useState([]);
    const [nombreMoneda, setNombreMoneda] = useState("");
    const reportID = props.params.reportId;
    const [isNewReport, setIsNewReport] = useState(false);
    const [json, setJson] = useState(null);
    const {
      isOpen: isModalSaveOpen,
      onOpen: onModalSaveOpen,
      onOpenChange: onModalSaveOpenChange,
  } = useDisclosure();
    
  async function guardarReporte(reportName){
      const postData = {
        idProyecto: projectId,
        nombre: reportName,
        presupuesto:  {
          general: {
            idPresupuesto: idPresupuesto,
            idHerramienta: 13,
            nombreHerramienta: "Presupuesto",
            presupuestoInicial: presupuesto.presupuestoInicial,
            activo: 1,
            idProyecto: projectId,
            nombreProyecto: projectName,
            fechaCreacion: presupuesto.fechaCreacion,
            idMoneda: presupuesto.idMoneda,
            nombreMoneda: nombreMoneda,
            cantidadMeses: presupuesto.cantidadMeses,
          },
          lineasPresupuesto: {
            lineasIngreso: lineasIngreso,
            lineasEgreso: lineasEgreso,
            lineasEstimacionCosto: lineasEstimacion,
          }
        },
        idUsuarioCreador: sessionData.idUsuario,
       
    };
    console.log("El postData es :", postData);
    axios
        .post(
            process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/reporte/subirReportePresupuestoJSON",
            postData
        )
        .then((response) => {
            // Manejar la respuesta de la solicitud POST
            console.log("Respuesta del servidor:", response.data);
            console.log("Guardado del reporte correcto");
            router.back();
            // Realizar acciones adicionales si es necesario
        })
        .catch((error) => {
            // Manejar errores si la solicitud POST falla
            console.error("Error al realizar la solicitud POST:", error);
        });
    };
    
    const DataTable = async () => {
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasTodasXIdPresupuesto/${idPresupuesto}`);
              const data = response.data.lineas;
              setLineasIngreso(response.data.lineasPresupuesto.lineasIngreso);
              setLineasEgreso(response.data.lineasPresupuesto.lineasEgreso);
              setLineasEstimacion(response.data.lineasPresupuesto.lineasEstimacionCosto);
              console.log(`Esta son las lineas:`, data);
              console.log(`Esta son las lineas de ingreso:`, response.data.lineasPresupuesto.lineasIngreso);
              setIsLoadingSmall(false);
              setVistaReporte(true);
            } catch (error) {
              console.error('Error al obtener las líneas de ingreso:', error);
            }
          };
          
            fetchData();
    };
    
    const [isSelected, setIsSelected] = useState(false);
    const [montoInicial, setMontoInicial] = useState(0);
    const ObtenerPresupuesto = async () => {
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarPresupuesto/${idPresupuesto}`);
              const data = response.data.presupuesto;
              setPresupuesto(data);
              if (data.idMoneda === 1) {
                setIsSelected(false);
                setNombreMoneda("USD");
              } else {
                console.log("Se seleccionó el sol"); 
                setIsSelected(true);
                setNombreMoneda("PEN");
              }

              console.log(`Esta es la data de presupuesto:`, data);
                console.log(`Esta es la moneda:`, data.idMoneda);
                setMontoInicial(data.presupuestoInicial);
                console.log(`Este es el monto inicial:`, data.presupuestoInicial);
                console.log(`Datos obtenidos exitosamente:`, response.data.presupuesto);
            } catch (error) {
              console.error('Error al obtener presupuesto', error);
            }
          };
            fetchData();
    };
    const sacarInformacionReporte = async () => {
      setIsLoadingSmall(true);
      const fetchData = async () => {
          try {
              // Realiza la solicitud HTTP al endpoint del router
              const stringURL =
                  process.env.NEXT_PUBLIC_BACKEND_URL +
                  "/api/proyecto/reporte/obtenerJSONReportePresupuestoXIdArchivo/" +
                  reportID;
              console.log("URL: ", stringURL);
              const response = await axios.get(stringURL);

              // Actualiza el estado 'data' con los datos recibidos
              // setJson(response.data.jsonData);
              // setPresupuestoReporte(response.data.presupuesto.general);
              // setLineasIngreso(response.data.presupuesto.lineasPresupuesto.lineasIngreso);
              // setLineasEgreso(response.data.presupuesto.lineasPresupuesto.lineasEgreso);
              // setLineasEstimacion(response.data.presupuesto.lineasPresupuesto.lineasEstimacionCosto);
              const {
                presupuesto: {
                  general,
                  lineasPresupuesto: {
                    lineasIngreso,
                    lineasEgreso,
                    lineasEstimacionCosto,
                  },
                },
              } = response.data;
              setPresupuestoReporte(general);
              setLineasIngreso(lineasIngreso);
              setLineasEgreso(lineasEgreso);
              setLineasEstimacion(lineasEstimacionCosto);
              console.log(
                  `Datos obtenidos exitosamente:`,
                  response.data.jsonData
              );
              setVistaReporte(true);
              setIsLoadingSmall(false);
          } catch (error) {
              console.error("Error al obtener datos:", error);
          }
      };

      fetchData();
  };       
    useEffect(() => {
        console.log('useEffect ran on the client');
        console.log(herramientasInfo);
        console.log("Id presupuesto", idPresupuesto);
        setIsLoadingSmall(true);
        if (reportID === "nuevoReporte") {
          DataTable();
          ObtenerPresupuesto();
          setIsNewReport(true);
        } else if (!isNaN(reportID)) {
          sacarInformacionReporte();
          ObtenerPresupuesto();
          setIsNewReport(false);
        }

        setIsClient(true);
    }, [idPresupuesto]);
    const series = [
        {
          name: "Ingresos",
        //   data: [
        //     5550000,
        //     1203800,
        //     6903000,
        //     8836900,
        //     1674660,
        //     9326380,
        //     2055423,
        //     3343777,
        //     3845718,
        //   ],
        data: lineasIngreso.map(linea => linea.monto),
          color: '#29C85F'
        },
        {
          name: "Egresos",
        //   data: [-2800000, -2840000, -9394000, -427100, -760260, -191853, -501538, -1029651, -1255481],
        data: lineasEgreso.map(linea => -linea.costoReal), 
          color: '#CE3B3B'
        },

      ];
      const fechasIngreso = lineasIngreso.map(linea => {
        const fecha = new Date(linea.fechaTransaccion);
        return fecha.toISOString().split('T')[0];
      });
      
      const fechasEgreso = lineasEgreso.map(linea => {
        const fecha = new Date(linea.fechaRegistro);
        return fecha.toISOString().split('T')[0];
      });
      const options = {
        dataLabels: {
          enabled: false,
        },
        
        stroke: {
          curve: "smooth",
        },
       
        xaxis: {
          type: "datetime",
        //   categories: [
        //     "1/22/20",
        //     "2/1/20",
        //     "2/15/20",
        //     "3/1/20",
        //     "3/15/20",
        //     "4/1/20",
        //     "4/15/20",
        //     "5/1/20",
        //     "5/7/20",
        //   ],
        categories: [...fechasIngreso, ...fechasEgreso]
        },
        tooltip: {
          x: {
            format: "dd/MM/yy",
          },
        },
      };
      function calcularSumaSerie(serie) {
        return serie.data.reduce((total, valor) => total + valor, 0);
      }
      
      // Calcular la suma total de cada serie
      const sumaIngresos = calcularSumaSerie(series[0]);
      const sumaEgresos = calcularSumaSerie(series[1]);
      const sumaTotalEstimacion = lineasEstimacion.reduce((total, linea) => total + linea.subtotal, 0);
      const total = (sumaIngresos + sumaEgresos);
      const egresosConvertidos = -1.00*sumaEgresos;
      const performance = (sumaIngresos + sumaEgresos) / sumaIngresos * 100;
      const monedaSymbol = isSelected ? "S/ " : "$ "
      const [isExportLoading, setIsExportLoading] = useState(false);
      async function handlerExport() {
        try {
            setIsExportLoading(true);
            const exportURL =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/reporte/descargarExcelPresupuestoXIdArchivo";

            const response = await axios.post(
                exportURL,
                {
                  idArchivo: reportID,
                },
                {
                    responseType: "blob", // Important for binary data
                }
            );

            
        } catch (error) {
            setIsExportLoading(false);
            toast.error("Error al exportar tu reporte prespuesto");
            console.log(error);
        }
    }
    return (
        <>
        {vistaReporte && (
                    <div className="divHistorialReportes">
                    <div className="flex-1">
                            <Breadcrumbs>
                                <BreadcrumbsItem href="/" text="Inicio" />
                                <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                                <BreadcrumbsItem
                                    href={"/dashboard/" + projectName + "=" + projectId}
                                    text={projectName}
                                />
                                <BreadcrumbsItem href={"/dashboard/" + projectName + "=" + projectId + "/reportes"} text="Historial de Reportes" />
                            </Breadcrumbs>
                            <div className="flex flex-row justify-between items-center">
                                <div className="titleHistorialReporte text-mainHeaders">
                                    Reporte de Presupuesto
                                </div>
                                {isNewReport && (
                                    <Button color="warning" className="text-white" onClick={()=>onModalSaveOpen()}>
                                        Guardar reporte
                                    </Button>
                                )}
                                {!isNewReport && (
                                    <Button color="success" className="text-white" onClick={async () => {
                                      await handlerExport();
                                  }}>
                                      Exportar
                                </Button>
                                )
                                }

                             </div>
            
                            <div className="ReportesPresupuesto">
                                <BarGraphic options={options} series={series} client={isClient} height={700} width={"100%"}/>
                            <div className="flex-1 h-auto max-h-800">
                                <Card className="ProgressPresupuesto">
                                        <CardBody className=" mt-12 p-0 flex-none w-70">
                                            <CircularProgress
                                                classNames={{
                                                svg: "w-64 h-64 drop-shadow-md",
                                                indicator: "text-green-500",
                                                track: "stroke-current text-red-500",
                                                value: "text-3xl font-semibold",
                                            }}
                                            value={performance}
                                            strokeWidth={4}
                                            showValueLabel={true}
                                            />
                                        </CardBody>
                                        <div className="mt-4">
                                            <CardHeader className="p-0">
                                                <p className="titleHistorialReporte">Ingresos vs Egresos</p>
                                            </CardHeader>
                                            <Card className="mt-8">
                                                <CardBody>
                                                    <Chip color="success" variant="flat">
                                                        <div className="titleBalanceData" style={{ textAlign: "left" }}>Ingresos: </div>
                                                    </Chip >
                                                    <div className="titleBalanceData" style={{ color: "#29C85F", textAlign: "right" }}>{monedaSymbol} {sumaIngresos.toFixed(2)}</div>
                                                    <Chip color="danger" variant="flat">
                                                        <div className="titleBalanceData" style={{ textAlign: "left" }}>Egresos: </div>
                                                    </Chip>
                                                        
                                                    <div className="titleBalanceData" style={{color: "#CE3B3B", textAlign: "right" }}>{monedaSymbol} {egresosConvertidos.toFixed(2)}</div>
                                                    <Chip variant="flat">
                                                        <div className="titleBalanceData" style={{ textAlign: "left" }}>Disponible: </div>
                                                    </Chip>
                                                    <div className="titleBalanceData" style={{ textAlign: "right" }}>{monedaSymbol} {sumaIngresos + sumaEgresos > 0 ? ` ${total.toFixed(2)}` : 'Sin fondos disponibles'}</div>
                                                </CardBody>
                                            </Card> 
                                        </div>
        
                                </Card>
                                <div className="flex">
                                    <Card className="w-1/2 m-4" style={{ border: '2px solid #29C85F' }}>
                                        <CardHeader className="flex gap-3">
                                            <p className="titleBalanceData text-md"><strong>Presupuesto Inicial</strong></p>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody>
                                            {presupuesto && (
                                              <Chip color="success" variant="flat">
                                                <p className="titleBalanceData">{monedaSymbol} {montoInicial.toFixed(2)}</p>
                                              </Chip>
                                            )}
                                            
                                        </CardBody>
                                    </Card>
                                    <Card className="w-1/2 m-4" style={{ border: '2px solid #F0AE19' }}>
                                        <CardHeader className="flex gap-3">
                                            <p className="titleBalanceData text-md"><strong>Gasto planificado</strong></p>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody>
                                          <Chip color="primary" variant="flat">
                                            <p className="titleBalanceData">{monedaSymbol} {sumaTotalEstimacion.toFixed(2)}</p>
                                          </Chip>
                                        </CardBody>
                                    </Card>
                                </div>
                                <div className="flex">
                                    <Card className="w-1/2 m-4" style={{ border: '2px solid #CE3B3B' }}>
                                        <CardHeader className="flex gap-3">
                                          
                                            <p className="titleBalanceData text-md"><strong>Gasto total</strong></p>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody>
                                          <Chip color="danger" variant="flat">
                                            <p className="titleBalanceData">{monedaSymbol} {egresosConvertidos.toFixed(2)}</p>
                                          </Chip>
                                        </CardBody>
                                    </Card>
                                    <Card className="w-1/2 m-4" style={{ border: '2px solid #1962F0' }}>
                                        <CardHeader className="flex gap-3">
                                            <p className="titleBalanceData text-md"><strong>Estado del presupuesto</strong></p>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody>
                                          <Chip variant="flat">
                                            <p className="titleBalanceData">{sumaIngresos + sumaEgresos > 0 ? `Dentro del Presupuesto` : 'Sobre el Presupuesto'}</p>
                                          </Chip>
                                        </CardBody>
                                    </Card>
                                </div>  
                            </div>
          
                            </div>
                    </div>
                </div>
        )}
        <ModalSave
                isOpen={isModalSaveOpen}
                onOpenChange={onModalSaveOpenChange}
                guardarReporte={async (name) => {
                    return await guardarReporte(name);
                }}
                tipo = "Presupuesto"
            />
        {!vistaReporte && (
          <div>No hay reporte</div>
        )}

        </> 
        
    );
}