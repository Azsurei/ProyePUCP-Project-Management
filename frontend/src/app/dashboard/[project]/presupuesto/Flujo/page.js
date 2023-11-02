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

const [Gestion, setGestion] = useState(0.00);

const [Reserva, setReserva] = useState(0.00);

const [IGV, setIGV] = useState(0.00);

const [Ganancia, setGanancia] = useState(0.00);



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
                setPresupuestoId(idHerramientaCreada)
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

    //Aqui va el data table de Iwa

    
    
const DataTable = async () => {
    const fetchData = async () => {
        try {
          const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasIngresoXIdPresupuesto/${presupuestoId}`);
          const data = response.data.lineasIngreso;
          setLineaIngreso(data);
          console.log(`Esta es la data:`, data);
            console.log(`Datos obtenidos exitosamente:`, response.data.lineasIngreso);
        } catch (error) {
          console.error('Error al obtener las líneas de ingreso:', error);
        }
      };
        fetchData();
};
useEffect(() => {
  DataTable();
}, [presupuestoId]);


const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre'
];

// Filtrar los meses a partir del mes actual
const mesesMostrados = meses.slice(mesActual - 1, mesActual - 1 + cantMeses);




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
              
            {lineaIngreso.map((row) => {

              return (
                <TableRow key={row.descripcion}>
                  <TableCell>{row.descripcion}</TableCell>
                  <TableCell align="left">{row.monto}</TableCell>
                </TableRow>
              );
              })}
            

 

            <TableRow>
              <TableCell className="conceptoCell" align="left">Total Ingresos</TableCell>

            </TableRow>


            <TableRow>
              <TableCell className="IngEgTexto" align="left">Egresos</TableCell>

            </TableRow>

            <TableRow>
              <TableCell className="conceptoCell" align="left">Total Egresos</TableCell>

            </TableRow>

            <TableRow>
              <TableCell className="conceptoCell" align="left">Total Acumulado</TableCell>

            </TableRow>

              </TableBody>
            </Table>
          </TableContainer>

          </div>
      </div>
    );
}