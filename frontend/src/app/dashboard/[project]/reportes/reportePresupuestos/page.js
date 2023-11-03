"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import { SmallLoadingScreen } from "../../../layout";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import { PlusIcon } from "@/../public/icons/PlusIcon";
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
} from "@nextui-org/react";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
import { SearchIcon } from "@/../public/icons/SearchIcon";
import TuneIcon from '@mui/icons-material/Tune';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { ChevronDownIcon } from "@/../public/icons/ChevronDownIcon";
import AssessmentIcon from '@mui/icons-material/Assessment';
import HeaderWithButtonsSamePage from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtonsSamePage";
import BarGraphic from "@/components/BarGraphic";
export default function ReportesPresupuestos(props) {
    // const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const [filterValue, setFilterValue] = React.useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        console.log('useEffect ran on the client');
        setIsClient(true);
    }, []);
    const series = [
        {
          name: "Ingresos",
          data: [
            5550000,
            1203800,
            6903000,
            8836900,
            1674660,
            9326380,
            2055423,
            3343777,
            3845718,
          ],
          color: '#29C85F'
        },
        {
          name: "Egresos",
          data: [-2800000, -2840000, -9394000, -427100, -760260, -191853, -501538, -1029651, -1255481],
          color: '#CE3B3B'
        },

      ];
      const options = {
        dataLabels: {
          enabled: false,
        },
        
        stroke: {
          curve: "smooth",
        },
       
        xaxis: {
          type: "datetime",
          categories: [
            "1/22/20",
            "2/1/20",
            "2/15/20",
            "3/1/20",
            "3/15/20",
            "4/1/20",
            "4/15/20",
            "5/1/20",
            "5/7/20",
          ],
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

      const performance = (sumaIngresos + sumaEgresos) / sumaIngresos * 100;
    return (
        <React.Fragment>
        <div className="divHistorialReportes">
            <div className="flex-1 border border-green-400">
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
    
                    <div className="ReportesPresupuesto">
                        <BarGraphic options={options} series={series} client={isClient}/>
                    <div className="flex-1 h-auto max-h-800">
                        <Card className="ProgressPresupuesto">
                                {/* <CardHeader className="p-0">
                                    <p className="titleHistorialReporte">Balance</p>
                                </CardHeader> */}
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
                                            <div className="titleBalanceData" style={{ color: "#29C85F", textAlign: "right" }}>S/ {sumaIngresos}</div>
                                            <Chip color="danger" variant="flat">
                                                <div className="titleBalanceData" style={{ textAlign: "left" }}>Egresos: </div>
                                            </Chip>
                                                
                                            <div className="titleBalanceData" style={{color: "#CE3B3B", textAlign: "right" }}>S/ {-1*sumaEgresos}</div>
                                            <Chip variant="flat">
                                                <div className="titleBalanceData" style={{ textAlign: "left" }}>Disponible: </div>
                                            </Chip>
                                            <div className="titleBalanceData" style={{ textAlign: "right" }}>S/ {sumaIngresos + sumaEgresos > 0 ? ` ${sumaIngresos + sumaEgresos}` : 'Sin fondos disponibles'}</div>
                                        </CardBody>
                                    </Card> 
                                </div>

                        </Card>
                        <div className="flex">
                            <Card className="w-1/2 m-4" style={{ border: '2px solid #29C85F' }}>
                                <CardHeader className="flex gap-3">
                                    <p className="titleBalanceData text-md">Presupuesto Inicial</p>
                                </CardHeader>
                                <Divider/>
                                <CardBody>
                                    <p className="titleBalanceData">S/ 200000.00</p>
                                </CardBody>
                            </Card>
                            <Card className="w-1/2 m-4" style={{ border: '2px solid #F0AE19' }}>
                                <CardHeader className="flex gap-3">
                                    <p className="titleBalanceData text-md">Gasto planificado</p>
                                </CardHeader>
                                <Divider/>
                                <CardBody>
                                    <p className="titleBalanceData">S/ 150000.00</p>
                                </CardBody>
                            </Card>
                        </div>
                        <div className="flex">
                            <Card className="w-1/2 m-4" style={{ border: '2px solid #CE3B3B' }}>
                                <CardHeader className="flex gap-3">
                                    <p className="titleBalanceData text-md">Gasto total</p>
                                </CardHeader>
                                <Divider/>
                                <CardBody>
                                    <p className="titleBalanceData">S/ 100000.00</p>
                                </CardBody>
                            </Card>
                            <Card className="w-1/2 m-4" style={{ border: '2px solid #1962F0' }}>
                                <CardHeader className="flex gap-3">
                                    <p className="titleBalanceData text-md">Estado del presupuesto</p>
                                </CardHeader>
                                <Divider/>
                                <CardBody>
                                    <p className="titleBalanceData">Cumple</p>
                                </CardBody>
                            </Card>
                        </div>  
                    </div>
  
                    </div>
            </div>
        </div> 
        </React.Fragment>
    );
}