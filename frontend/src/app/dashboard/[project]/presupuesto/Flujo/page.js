"use client"
import { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
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

export default function EstimacionTabla(props) {
// const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

const decodedUrl = decodeURIComponent(props.params.project);
const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

const [presupuestoId, setPresupuestoId] = useState("");

const [cantMeses, setcantMeses] = useState(1);

const [mesActual, setmesActual] = useState("");

let idHerramientaCreada;
let flag=0;
useEffect(() => {
    const fetchData = async () => {
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
          console.log(`Esta es el id presupuesto:`, data);
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

                  const fechaCreacionString = presupuesto[0].fechaCreacion;
                  const fechaCreacion = new Date(fechaCreacionString);

                  const mes = fechaCreacion.getUTCMonth() + 1;
                  console.log("Cantidad Meses:"+presupuesto[0].cantidadMeses);
                  setcantMeses(presupuesto[0].cantidadMeses);

                  console.log("Mes:"+mes);
                  setmesActual(mes);
                  
              })
              .catch(error => {
                  console.error("Error al llamar a la API:", error);
              });
        }

      };
      fetchData();

}, []);


  
function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function subtotalRow(cantidadRecurso, tarifaUnitaria, tiempoRequerido) {
  return cantidadRecurso * tarifaUnitaria* tiempoRequerido;
}

function createRow(descripcion, cantidadRecurso, tarifaUnitaria,tiempoRequerido) {
  const subtotal = subtotalRow(cantidadRecurso, tarifaUnitaria,tiempoRequerido);
  return { descripcion, cantidadRecurso, tarifaUnitaria, tiempoRequerido, subtotal };
}

function subtotal(items) {
  return items.map(({ subtotal }) => subtotal).reduce((sum, i) => sum + i, 0);
}




const [lineaIngreso, setLineaIngreso] = useState([]);
const [lineaEgreso, setLineaEgreso] = useState([]);
const [totalIngresos, setTotalIngresos] = useState(0);
const [totalEgresos, setTotalEgresos] = useState(0);
const [totalAcumulado, setTotalAcumulado] = useState(0);

  
const DataTable = async () => {
    const fetchData = async () => {
        try {
          const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasIngresoXIdPresupuesto/${presupuestoId}`);
          const dataIngreso = response.data.lineasIngreso;
          setLineaIngreso(dataIngreso);
          console.log(`Datos obtenidos exitosamente:`, dataIngreso);
          

          const responseEgreso = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/proyecto/presupuesto/listarLineasEgresoXIdPresupuesto/${presupuestoId}`);
          
          const dataEgreso = responseEgreso.data.lineasEgreso;
          setLineaEgreso(dataEgreso);
          console.log('Líneas de Egreso obtenidas exitosamente:', dataEgreso);

        } catch (error) {
          console.error('Error al obtener las líneas de ingreso o egreso:', error);
        }

        console.log('Data Ingreso:', lineaIngreso);
        console.log('Data Egreso:', lineaEgreso);

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

// Iterar sobre las líneas de ingreso
lineaIngreso.forEach((row) => {
  // Comprobar si el tipo de ingreso ya existe en el objeto
  if (ingresosPorTipo[row.idIngresoTipo]) {
    // Si existe, suma el monto al tipo de ingreso existente
    ingresosPorTipo[row.idIngresoTipo].monto += row.monto;
  } else {
    // Si no existe, crea una nueva entrada en el objeto
    ingresosPorTipo[row.idIngresoTipo] = {
      descripcion: obtenerDescripcionPorTipo(row.idIngresoTipo), // Reemplaza obtenerDescripcionPorTipo con la lógica real
      monto: row.monto,
    };
  }
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




return (
        <div className="mainDivPresupuesto">

        <Breadcrumbs>
            <BreadcrumbsItem href="/" text="Inicio" />
            <BreadcrumbsItem href="/dashboard" text="Proyectos" />
            <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId}  text={projectName}/>
            <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}  text="Presupuesto"/>
            <BreadcrumbsItem href="" text="Flujo" />

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

                    <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}>
                        <Button color="primary" startContent={<HistoryIcon />} className="btnEditarEstimacion">
                            Historial
                        </Button> 
                    </Link>

                    <Button color="primary" startContent={<ExportIcon />} className="btnExportPresupuesto">
                      Exportar
                    </Button> 
                
                </div>
                
            </div>

        <div className="subtitlePresupuesto">Flujo de Caja</div>
            
        <TableContainer component={Paper} >
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead>
              <TableRow>
              <TableCell>Meses</TableCell>

                {mesesMostrados.map((mes, index) => (
                <TableCell className="Meses" key={index} align="left">
                  {mes}
                </TableCell>
                  ))}

              </TableRow>
              
            </TableHead>

            <TableBody>

            <TableRow>
              <TableCell className="IngEgTexto" align="left">Ingresos</TableCell>
            </TableRow>
              
{Object.values(ingresosPorTipo).map((tipoIngreso, index) => (
  <TableRow key={index}>
    <TableCell>{tipoIngreso.descripcion}</TableCell>
    <TableCell align="left">{tipoIngreso.monto}</TableCell>
  </TableRow>
))}
            

            <TableRow>
              <TableCell className="conceptoCell" align="left">Total Ingresos</TableCell>
              <TableCell className="Totales" align="left">{totalIngresos}</TableCell>

            </TableRow>


            <TableRow>
              <TableCell className="IngEgTexto" align="left">Egresos</TableCell>



            </TableRow>

            {lineaEgreso.map((row) => {

                return (
                  <TableRow key={row.descripcion}>
                    <TableCell>{row.descripcion}</TableCell>
                    <TableCell align="left">{row.costoReal}</TableCell>
                  </TableRow>
                );
              })}

            <TableRow>
              <TableCell className="conceptoCell" align="left">Total Egresos</TableCell>
              <TableCell className="Totales" align="left">{totalEgresos}</TableCell>

            </TableRow>

            <TableRow>
              <TableCell className="conceptoCell" align="left">Total Acumulado</TableCell>
              <TableCell className="Totales" align="left">{totalAcumulado}</TableCell>


            </TableRow>

              </TableBody>
            </Table>
          </TableContainer>

          </div>
      </div>
  );
}