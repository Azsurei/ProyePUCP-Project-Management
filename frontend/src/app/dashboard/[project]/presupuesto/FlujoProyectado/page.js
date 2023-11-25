"use client"
import { createContext, useContext, useEffect, useState } from "react";import Link from "next/link";
import React from "react";
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Toaster, toast } from "sonner";
import "@/styles/dashboardStyles/projectStyles/presupuesto/presupuesto.css";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
axios.defaults.withCredentials = true;
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import { SmallLoadingScreen } from "../../layout";
import { saveAs } from "file-saver";

import {
    Input,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@nextui-org/react";

import {ExportIcon} from "@/../public/icons/ExportIcon";
import BuildIcon from '@mui/icons-material/Build';
import { set } from "date-fns";
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function EstimacionTabla(props) {
const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

const decodedUrl = decodeURIComponent(props.params.project);
const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

const [presupuestoId, setPresupuestoId] = useState("");

const [cantMeses, setcantMeses] = useState(1);

const [mesActual, setmesActual] = useState("");


const [MonedaPresupuesto,setMonedaPresupuesto]=useState(0);

useEffect(() => {
    setIsLoadingSmall(false)
    const fetchData = async () => {
      let idHerramientaCreada;
      let flag=0;
      if(projectId!==""){

        try {
          const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/herramientas/${projectId}/listarHerramientasDeProyecto`);
          const herramientas = response.data.herramientas;
          for (const herramienta of herramientas) {
            if (herramienta.idHerramienta === 13) {
                idHerramientaCreada = herramienta.idHerramientaCreada;
                setPresupuestoId(idHerramientaCreada);
                console.log("idPresupuesto es:", idHerramientaCreada);
                flag = 1;
                break; // Puedes salir del bucle si has encontrado la herramienta
            }
        }
          console.log(`Esta es el id presupuesto:`, idHerramientaCreada);
          console.log(`Datos obtenidos exitosamente:`, response.data.presupuesto);
        } catch (error) {
          console.error('Error al obtener el presupuesto:', error);
        }

        if (flag === 1) {

          // Aquí encadenamos el segundo axios
          const stringURLListarPresupuesto = process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/presupuesto/listarPresupuesto/"+idHerramientaCreada;
          axios.get(stringURLListarPresupuesto)
              .then(response => {
                  const presupuesto = response.data.presupuesto;

                  const fechaCreacionString = presupuesto.fechaCreacion;
                  const fechaCreacion = new Date(fechaCreacionString);

                  const mes = fechaCreacion.getUTCMonth() + 1;
                  setcantMeses(presupuesto.cantidadMeses);
                  setmesActual(mes);

                  const moneda = presupuesto.idMoneda;
                  setMonedaPresupuesto(moneda);                  
              })
              .catch(error => {
                  console.error("Error al llamar a la API:", error);
              });
        }
      }
      };
      fetchData();

}, []);



const [lineaIngreso, setLineaIngreso] = useState([]);
const [lineaEgreso, setLineaEgreso] = useState([]);

const [lineaEstimacion, setLineaEstimacion] = useState([]);

const [totalIngresos, setTotalIngresos] = useState(0);
const [totalEgresos, setTotalEgresos] = useState(0);
const [totalAcumulado, setTotalAcumulado] = useState(0);

  
const DataTable = async () => {
    const fetchData = async () => {

      if(presupuestoId!==""){

          try {
            const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasIngresoXIdPresupuesto/${presupuestoId}`);
            const dataIngreso = response.data.lineasIngreso;
            setLineaIngreso(dataIngreso);
            

            const responseEgreso = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/proyecto/presupuesto/listarLineasEgresoXIdPresupuesto/${presupuestoId}`);
            const dataEgreso = responseEgreso.data.lineasEgreso;
            setLineaEgreso(dataEgreso);



            const responseEstimacion = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/proyecto/presupuesto/listarLineasEstimacionCostoXIdPresupuesto/${presupuestoId}`);
            const dataEstimacion=responseEstimacion.data.lineasEstimacionCosto;
            setLineaEstimacion(dataEstimacion);

            console.log(`Datos obtenidos exitosamente:`, dataEstimacion);


          } catch (error) {
            console.error('Error al obtener las líneas de ingreso o egreso:', error);
          }

        } 
    }

    fetchData();
};
useEffect(() => {
  DataTable();
}, [presupuestoId]);

useEffect(() => {
  // Calcula el total de ingresos
  const ingresosTotal = lineaIngreso.reduce((total, row) => {
    return total + row.monto;
  }, 0);
  setTotalIngresos(ingresosTotal);

  // Calcula el total de egresos
  const egresosTotal = lineaEgreso.reduce((total, row) => {
    return total + row.costoReal;
  }, 0);
  setTotalEgresos(egresosTotal);

  const totalAcumulado = ingresosTotal - egresosTotal;
  setTotalAcumulado(totalAcumulado);

}, [lineaIngreso, lineaEgreso]);


const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre'
];

// Filtrar los meses a partir del mes actual
const mesesMostrados = meses.slice(mesActual - 1, mesActual - 1 + cantMeses);

const ingresosPorTipo = {};


const [tipoCambioDolar,setTipoCambioDolar]=useState(0);
useEffect(() => {
  const tipoCambio = async () => {
    
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarMonedasTodas`;

        const response = await axios.get(url);
        const monedasData  = response.data.monedas;

        const monedaId1 = monedasData.find((moneda) => moneda.idMoneda === 1);
        setTipoCambioDolar(monedaId1.tipoCambio);
        console.log("Tipo de Cambio:" + monedaId1.tipoCambio);
      } catch (error) {
        console.error("Error al obtener las plantillas:", error);
      }

  };

  tipoCambio();
},[]);

function convertirTarifa(tarifa, idMoneda) {
    //Dolares
    if(MonedaPresupuesto===1){
      if(idMoneda===2){
        return tarifa/tipoCambioDolar;
      }
    }else if(MonedaPresupuesto===2){
      if(idMoneda===1){
        return tarifa*tipoCambioDolar;
      }
      
    }
}

// Iterar sobre las líneas de ingreso
lineaIngreso.forEach((row) => {
  // Comprobar si el tipo de ingreso ya existe en el objeto

  const fechaCreacion = new Date(row.fechaTransaccion);

  const mes = fechaCreacion.getUTCMonth() + 1;
  const mesReal = mes - mesActual + 1;
  const idTipo = row.idIngresoTipo;

  if (!ingresosPorTipo[idTipo]) {
    ingresosPorTipo[idTipo] = {};
  }

  if (!ingresosPorTipo[idTipo][mesReal]) {
    ingresosPorTipo[idTipo][mesReal] = 0;
  }

  ingresosPorTipo[idTipo][mesReal] += MonedaPresupuesto === row.idMoneda
      ? row.monto
      : convertirTarifa(row.monto, row.idMoneda);


});

function obtenerDescripcionPorTipo(idIngresoTipo) {
  const tiposDeIngreso = {
      1: 'Prestamo',
      2: 'Donaciones',
      3: 'Patrocinador',
      4: 'Pago Cliente',
      // Agrega más tipos de ingreso si es necesario
    };

  return tiposDeIngreso[idIngresoTipo] || 'Tipo de ingreso desconocido';
}

const descripcionTipo = {
  1: 'Prestamo',
  2: 'Donaciones',
  3: 'Patrocinador',
  4: 'Pago Cliente',
  // Agrega más tipos de ingreso si es necesario
};


function calcularTotalesPorMes(lineaEgreso, mesesMostrados, mesActual) {
  const totalEgresosPorMes = Array.from({ length: mesesMostrados.length }, () => 0);

  lineaEgreso.forEach((egreso) => {
      var i=0;
      

    if (mesReal >= 1 && mesReal <= mesesMostrados.length) {
      totalEgresosPorMes[mesReal - 1] += MonedaPresupuesto === egreso.idMoneda
      ? egreso.costoReal
      : convertirTarifa(egreso.costoReal, egreso.idMoneda);;
    }
  });

  return totalEgresosPorMes;
}

const totalEgresosPorMes = calcularTotalesPorMes(lineaEgreso, mesesMostrados, mesActual);

const accumulatedTotals = Array.from({ length: mesesMostrados.length }, () => 0);

for (let i = 0; i < mesesMostrados.length; i++) {
  let monthlyTotalIncome = 0;
  let monthlyTotalExpenses = 0;

  // Calculate total income for the current month
  Object.keys(descripcionTipo).forEach((idTipo) => {
    if (ingresosPorTipo[idTipo] && ingresosPorTipo[idTipo][i + 1] !== undefined) {
      monthlyTotalIncome += parseFloat(ingresosPorTipo[idTipo][i + 1]);
    }
  });

  // Calculate total expenses for the current month
  monthlyTotalExpenses = totalEgresosPorMes[i];

  // Calculate the accumulated total for the current month
  accumulatedTotals[i] = monthlyTotalIncome - monthlyTotalExpenses;
}


//Cambiar API
async function handlerExport() {
  try {
      const exportURL =
          process.env.NEXT_PUBLIC_BACKEND_URL +
          "/api/proyecto/reporte/crearExcelCajaEstimacion";

      const response = await axios.post(
          exportURL,
          {
            idPresupuesto: presupuestoId,
          },
          {
              responseType: "blob", // Important for binary data
          }
      );

      setTimeout(() => {
          const today = new Date();

          let day = today.getDate();
          let month = today.getMonth() + 1;
          let year = today.getFullYear();

          day = day < 10 ? "0" + day : day;
          month = month < 10 ? "0" + month : month;

          // Create the formatted date string
          let formattedDate = `${day}_${month}_${year}`;

          const fileName =
              projectName.split(" ").join("") +
              "_" +
              formattedDate +
              ".xlsx";
          console.log(fileName);
          saveAs(response.data, fileName);
          toast.success("Se exporto el Flujo de Caja con exito");
      }, 500);
  } catch (error) {
      toast.error("Error al exportar el Flujo de Caja");
      console.log(error);
  }
}

return (
        <div className="mainDivPresupuesto">

        <Breadcrumbs>
            <BreadcrumbsItem href="/" text="Inicio" />
            <BreadcrumbsItem href="/dashboard" text="Proyectos" />
            <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId}  text={projectName}/>
            <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}  text="Presupuesto"/>
            <BreadcrumbsItem href="" text="Flujo Proyectado" />

        </Breadcrumbs>

        <div className="presupuesto">
            <div className="titlePresupuesto">Presupuesto</div>

            <div className="buttonsPresu">

                <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}>
                        <button className="btnCommon btnHistorial sm:w-1 sm:h-1" type="button">Historial</button> 
                </Link>
                
                <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Ingreso"}>
                        <button className="btnCommon btnIngreso  sm:w-1 sm:h-1"   type="button">Ingresos</button>
                </Link>

                <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Egresos"}>
                        <button className="btnCommon btnEgreso sm:w-1 sm:h-1" type="button">Egresos</button>
                </Link>

                <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Estimacion"}>
                        <button className="btnCommon btnEstimacion   sm:w-1 sm:h-1"  type="button">Estimacion</button>
                </Link>

                
                <div className="buttonContainerEstimacionTabla">

                    <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Flujo"}>
                        <Button  color="primary" startContent={<AssessmentIcon />} className="btnAddIngreso">
                            Flujo Real
                        </Button>
                    </Link>

                    <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}>
                        <Button color="primary" startContent={<HistoryIcon />} className="btnEditarEstimacion">
                            Historial
                        </Button> 
                    </Link>

                    <Button color="primary" startContent={<ExportIcon />} 
                        onPress={async () => {
                          await handlerExport();
                      }}
                    
                    className="btnExportPresupuesto">
                      Exportar
                    </Button> 
                
                </div>
                
            </div>

        <div className="subtitlePresupuesto">Flujo de Caja Proyectado</div>
            
        <TableContainer component={Paper} >
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead>
              <TableRow>
              <TableCell>Meses</TableCell>

                {mesesMostrados.map((mes, index) => (
                <TableCell className="text-gray-800 text-sm not-italic font-medium" key={index} align="left">
                  {mes}
                </TableCell>
                  ))}

              </TableRow>
              
            </TableHead>

            <TableBody>

            <TableRow>
              <TableCell className="text-gray-800 text-sm not-italic font-medium" align="left">Ingresos</TableCell>
            </TableRow>
              
            {Object.keys(descripcionTipo).map((idTipo) => (
                <TableRow key={idTipo}>
                    <TableCell>{descripcionTipo[idTipo]}</TableCell>
                    {mesesMostrados.map((mes, index) => (
                    <TableCell key={index} align="left">
                                {ingresosPorTipo[idTipo] && ingresosPorTipo[idTipo][index + 1] !== undefined
                        ? parseFloat(ingresosPorTipo[idTipo][index + 1]).toFixed(2)
                        : 0}
                    </TableCell>
                    ))}
                </TableRow>
            ))}      

            <TableRow>
              <TableCell className="text-gray-800 text-sm not-italic font-extrabold bg-gray-200" align="left">Total Ingresos</TableCell>
              {mesesMostrados.map((mes, index) => (
  <TableCell className="text-gray-800 text-sm not-italic font-extrabold bg-gray-200" key={index} align="left">
    {ingresosPorTipo && Object.keys(descripcionTipo).reduce((total, idTipo) => {
      const ingresoPorTipo = ingresosPorTipo[idTipo];
      return total + (ingresoPorTipo && ingresoPorTipo[index + 1] ? parseFloat(ingresoPorTipo[index + 1]) : 0);
    }, 0)}
  </TableCell>
))}

            </TableRow>


            <TableRow>
              <TableCell className="text-gray-800 text-sm not-italic font-medium" align="left">Egresos Estimados</TableCell>



            </TableRow>

            {lineaEstimacion.map((estimacion, index) => (
  <TableRow key={index}>
    <TableCell>{estimacion.descripcion}</TableCell>
    {mesesMostrados.map((mes, mesIndex) => {
      const cantMeses = estimacion.tiempoRequerido;
      console.log(cantMeses);
      return (
        <TableCell key={mesIndex} align="left">
          {
            
            mesIndex <cantMeses
            ? MonedaPresupuesto === estimacion.idMoneda
              ? (parseFloat(estimacion.cantidadRecurso*estimacion.tarifaUnitaria).toFixed(2))
              : (convertirTarifa(estimacion.tarifaUnitaria*estimacion.cantidadRecurso, estimacion.idMoneda).toFixed(2))
            : 0            
          }
        </TableCell>
      );
    })}
  </TableRow>
))}

<TableRow>
  <TableCell className="text-gray-800 text-sm not-italic font-extrabold bg-gray-200" align="left">Total Egresos Estimados</TableCell>
  {totalEgresosPorMes.map((total, index) => (
    <TableCell className="text-gray-800 text-sm not-italic font-extrabold bg-gray-200" key={index} align="left">
      {total !== 0 ? total.toFixed(2) : "0"}

    </TableCell>
  ))}
</TableRow>

<TableRow>
  <TableCell className="text-gray-800 text-sm not-italic font-extrabold bg-gray-200" align="left">Total Acumulado</TableCell>
  {accumulatedTotals.map((total, index) => (
    <TableCell
      key={index}
      align="left"
      className={`text-gray-800 text-sm not-italic font-extrabold bg-gray-200 ${total > 0 ? 'text-green-600 text-base not-italic font-extrabold bg-gray-200' : total < 0 ? 'text-red-500 text-base not-italic font-extrabold bg-gray-200' : ''}`}
    >
      {total}
    </TableCell>
  ))}
</TableRow>



              </TableBody>
            </Table>
          </TableContainer>

          </div>
      </div>
  );
}