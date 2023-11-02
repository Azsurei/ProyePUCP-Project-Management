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
const stringUrlMonedas = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarMonedasTodas`;

const [Gestion, setGestion] = useState(0.00);
const [pGestion, setpGestion] = useState(0.00);

const [Reserva, setReserva] = useState(0.00);
const [pReserva, setpReserva] = useState(0.00);

const [IGV, setIGV] = useState(0.00);
const [pIGV, setpIGV] = useState(0.00);

const [Ganancia, setGanancia] = useState(0.00);
const [pGanancia, setpGanancia] = useState(0.00);



//Validciones
const [validGestion, setValidGestion] = useState(true);
const [validReserva, setValidReserva] = useState(true);
const [validIGV, setValidIGV] = useState(true);
const [validGanancia, setValidGanancia] = useState(true);



// Modales
const {
  isOpen: isModalConfigurarOpen,
  onOpen: ondModalConfigurar,
  onOpenChange: onModalConfigurarChange,
} = useDisclosure();

//Fin Modales
const [presupuestoId, setPresupuestoId] = useState("");
//const router=userRouter();
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

const rows = [
  createRow('Estimacion #1', 1, 500,1),
  createRow('Estimacion #2', 4, 50,2),
  createRow('Estimacion #3', 2, 200,3),
];
const [lineasEstimacion, setLineasEstimacion] = useState([]);

    //Aqui va el data table de Iwa
    
    
    const DataTable = async () => {
        const fetchData = async () => {
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasEstimacionCostoXIdPresupuesto/${presupuestoId}`);
              const data = response.data.lineasEstimacionCosto;
              setLineasEstimacion(data);
              console.log(`Esta es la data:`, data);
                console.log(`Datos obtenidos exitosamente:`, response.data.lineasEstimacionCosto);
            } catch (error) {
              console.error('Error al obtener las líneas de ingreso:', error);
            }
          };
            fetchData();
    };
    useEffect(() => {
      DataTable();
    }, [presupuestoId]);
//Calculos
const invoiceSubtotal = subtotal(lineasEstimacion);
const invoiceReserva = Reserva/100 * invoiceSubtotal;

const invoiceLineaBase = invoiceSubtotal + invoiceReserva;

const invoiceGestion = Gestion/100 * invoiceLineaBase;

const invoicePresupuesto= invoiceLineaBase + invoiceGestion;

const invoiceGanancia = Ganancia/100 * invoicePresupuesto;

const invoiceTotalGanancia= invoicePresupuesto + invoiceGanancia;

const invoiceIGV= IGV/100 * invoiceTotalGanancia;

const invoiceTotal=invoiceIGV+invoicePresupuesto;


//Fin Calculos

// Calcula el subtotal

    return (
        <div className="mainDivPresupuesto">
        <Toaster 
            richColors 
            closeButton={true}
            toastOptions={{
                style: { fontSize: "1rem" },
            }}
        />


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
                <TableCell align="right" colSpan={2}>
                  Cant. Recurso
                </TableCell>
                <TableCell align="right">Tarifa</TableCell>
                <TableCell align="right">Tiempo Req</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
              
            </TableHead>
            <TableBody>
            {lineasEstimacion.map((row) => {

              return (
                <TableRow key={row.descripcion}>
                  <TableCell>{row.descripcion}</TableCell>
                  <TableCell align="right">{row.cantidadRecurso}</TableCell>
                  <TableCell align="right">{row.tarifaUnitaria}</TableCell>
                  <TableCell align="right">{row.tiempoRequerido}</TableCell>
                  <TableCell align="right">{ccyFormat(row.subtotal)}</TableCell>
                </TableRow>
              );
            })}


              <TableRow>
                <TableCell rowSpan={3} />
                <TableCell colSpan={2} align="right">TOTAL</TableCell>
                <TableCell colSpan={2}
                  align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
              </TableRow>

          



              </TableBody>
            </Table>
          </TableContainer>

                </div>
        </div>
    );
}