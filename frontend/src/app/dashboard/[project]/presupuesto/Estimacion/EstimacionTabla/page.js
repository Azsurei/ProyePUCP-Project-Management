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


  
function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty, unit, time) {
  return qty * unit* time;
}

function createRow(desc, qty, unit,time) {
  const price = priceRow(qty, unit,time);
  return { desc, qty, unit, time, price };
}

function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow('Estimacion #1', 1, 500,1),
  createRow('Estimacion #2', 4, 50,2),
  createRow('Estimacion #3', 2, 200,3),
];

//Calculos
const invoiceSubtotal = subtotal(rows);
const invoiceReserva = Reserva/100 * invoiceSubtotal;

const invoiceLineaBase = invoiceSubtotal + invoiceReserva;

const invoiceGestion = Gestion/100 * invoiceLineaBase;

const invoicePresupuesto= invoiceLineaBase + invoiceGestion;

const invoiceGanancia = Ganancia/100 * invoicePresupuesto;

const invoiceTotalGanancia= invoicePresupuesto + invoiceGanancia;

const invoiceIGV= IGV/100 * invoiceTotalGanancia;

const invoiceTotal=invoiceIGV+invoicePresupuesto;



//Fin Calculos

    return (
        <div className="mainDivPresupuesto">
        <Toaster 
            richColors 
            closeButton={true}
            toastOptions={{
                style: { fontSize: "1rem" },
            }}
        />

        <Modal size="md" isOpen={isModalConfigurarOpen} onOpenChange={onModalConfigurarChange}>
              <ModalContent>
                {(onClose) => {
                  const finalizarModal = () => {
                    
                    let Isvalid = true;

                    if (parseFloat(pGestion) < 0 || isNaN(parseFloat(pGestion))) {
                        setValidGestion(false);
                        Isvalid = false;
                    }

                    if (parseFloat(pReserva) < 0 || isNaN(parseFloat(pReserva))) {
                        setValidReserva(false);
                        Isvalid = false;
                    }

                    if (parseFloat(pGanancia) < 0 || isNaN(parseFloat(pGanancia))) {
                        setValidGanancia(false);
                        Isvalid = false;
                    }

                    if (parseFloat(pIGV) > 0 && !(isNaN(parseFloat(pIGV)))) {

                        if(parseFloat(pGanancia)<=0){
                          setValidIGV(false);
                          setValidGanancia(false);
                          Isvalid = false;
                        }

                    }

                    if(Isvalid === true){
                      setGestion(pGestion);
                      setReserva(pReserva);
                      setIGV(pIGV);
                      setGanancia(pGanancia);
                      onClose();

                    }

                  };
                  return (
                    <>
                    <ModalHeader>Configuración</ModalHeader>
                      <ModalBody>

                        <p
                          style={{
                              color: "#494949",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                          }}
                          >
                          Eliga el porcentaje de los conceptos financieros:
                        </p>
                              
                      
                      <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "1rem",
                        }}>
                          <p style={{
                            color: "#002D74",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            flex: 0.5,
                          }}>
                            Reserva de Contingencia
                          </p>

                          <p style={{
                            color: "#002D74",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            flex: 0.4,
                          }}>
                            Reserva Gestión
                          </p>
                          
                        </div>

                      <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "0.2rem",
                          width: "100%",
                          paddingTop: "0.4rem",
                          gap: "4rem",
                        }}>

                          <Input
                            value={pReserva}
                            onValueChange={setpReserva}
                            labelPlacement="outside"
                            isInvalid={!validReserva}
                            onChange={() => { setValidReserva(true) }}
                            type="number"
                            errorMessage={!validReserva ? "Porcentaje inválido" : ""}
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">%</span>
                              </div>
                            }
                          />
                          
                          <Input
                            value={pGestion}
                            onValueChange={setpGestion}
                            labelPlacement="outside"
                            isInvalid={!validGestion}
                            onChange={() => { setValidGestion(true) }}
                            type="number"
                            errorMessage={!validGestion ? "Porcentaje inválido" : ""}
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">%</span>
                              </div>
                            }
                          />

                        </div>
                      
                      <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "1rem",
                        }}>
                          <p style={{
                            color: "#002D74",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            flex: 0.5,
                          }}>
                            Ganancia
                          </p>

                          <p style={{
                            color: "#002D74",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            flex: 0.4,
                          }}>
                            IGV
                          </p>
                          
                        </div>

                      <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "1rem",
                          width: "100%",
                          paddingTop: "0.4rem",
                          gap: "4rem",
                        }}>
                          
                          <Input
                            value={pGanancia}
                            onValueChange={setpGanancia}
                            labelPlacement="outside"
                            isInvalid={!validGanancia}
                            onChange={() => { setValidGanancia(true) ; setValidIGV(true)}}
                            type="number"
                            errorMessage={!validGanancia ? "Porcentaje inválido" : ""}
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">%</span>
                              </div>
                            }
                          />

                          <Input
                            value={pIGV}
                            onValueChange={setpIGV}
                            labelPlacement="outside"
                            isInvalid={!validIGV}
                            onChange={() => { setValidIGV(true) ; setValidGanancia(true) }}
                            type="number"
                            errorMessage={!validIGV ? "IGV necesita de % Ganancia" : ""}
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">%</span>
                              </div>
                            }
                          />



                        </div>    

          

                      </ModalBody>

                      <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={() => {
                                onClose(); // Cierra el modal

                            }}
                          >
                          Cancelar
                          </Button>

                                {pGanancia<0?setpGanancia(0.0):""}
                                {pIGV<0?setpIGV(0.0):""}
                                {pGestion<0?setpGestion(0.0):""}
                                {pReserva<0?setpReserva(0.0):""}
                          <Button
                              color="primary"
                              onPress={finalizarModal}
                              >
                              Guardar
                          </Button>
                      </ModalFooter>
                      </>
                        );
                      }}
                    </ModalContent>
        </Modal>

        <Breadcrumbs>
            <BreadcrumbsItem href="/" text="Inicio" />
            <BreadcrumbsItem href="/dashboard" text="Proyectos" />
            <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId}  text={projectName}/>
            <BreadcrumbsItem href="" text="Presupuesto" />

        </Breadcrumbs>

        <div className="presupuesto">
            <div className="titlePresupuesto">Presupuesto</div>

            <div className="buttonsPresu">
                <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto"}>
                        <button className="btnCommon btnFlujo  sm:w-1 sm:h-1" type="button">Flujo</button>
                </Link>

                <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Historial"}>
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

                    <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Estimacion"}>
                        <Button color="primary" startContent={<EditIcon />} className="btnEditarEstimacion">
                            Editar
                        </Button> 
                    </Link>

                    <Button onPress={ondModalConfigurar} color="primary" startContent={<BuildIcon />} className="btnEditEstimacion">
                      Configurar
                    </Button> 

                    <Button color="primary" startContent={<ExportIcon />} className="btnExportPresupuesto">
                      Exportar
                    </Button> 
                
                </div>
                
            </div>

            <div className="subtitlePresupuesto">Estimacion de Costos </div>
            
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
              {rows.map((row) => (
                <TableRow key={row.desc}>
                  <TableCell>{row.desc}</TableCell>
                  <TableCell align="right">{row.qty}</TableCell>
                  <TableCell align="right">{row.unit}</TableCell>
                  <TableCell align="right">{row.time}</TableCell>
                  <TableCell align="right">{ccyFormat(row.price)}</TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell rowSpan={9} />
                <TableCell colSpan={2} align="right">TOTAL</TableCell>
                <TableCell colSpan={2}
                  align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={2} align="right">Reserva Contingencia</TableCell>
                <TableCell align="right">{`${(Reserva*1).toFixed(0)} %`}</TableCell>
                <TableCell colSpan={1}
                align="right">{ccyFormat(invoiceReserva)}</TableCell>
              </TableRow>

              <TableRow>
                
                <TableCell colSpan={2} align="right">Linea Base de Costos</TableCell>
                <TableCell colSpan={2}
                align="right">{ccyFormat(invoiceLineaBase)}</TableCell>

              </TableRow>

              <TableRow>
                <TableCell colSpan={2} align="right">Reserva de Gestión</TableCell>
                <TableCell align="right">{`${(Gestion*1).toFixed(0)} %`}</TableCell>

                <TableCell colSpan={2}
                align="right">{ccyFormat(invoiceGestion)}</TableCell>
              </TableRow>


              <TableRow>
                <TableCell colSpan={2} align="right">Presupuesto</TableCell>
                <TableCell colSpan={2}
                align="right">{ccyFormat(invoicePresupuesto)}</TableCell>
              </TableRow>

              {Ganancia>0 &&
              <TableRow>
                <TableCell colSpan={2} align="right">Ganancia</TableCell>
                <TableCell align="right">{`${(Ganancia*1).toFixed(0)} %`}</TableCell>

                <TableCell colSpan={2}
                align="right">{ccyFormat(invoiceGanancia)}</TableCell>
              </TableRow>

              }

              {Ganancia>0 &&

                <TableRow>
                <TableCell colSpan={2} align="right">Total con Ganancia</TableCell>
                <TableCell colSpan={2}
                align="right">{ccyFormat(invoiceTotalGanancia)}</TableCell>
              </TableRow>

              }

              {IGV>0 &&
                <TableRow>
                <TableCell colSpan={2} align="right">IGV</TableCell>
                <TableCell align="right">{`${(IGV*1).toFixed(0)} %`}</TableCell>

                <TableCell colSpan={2}
                align="right">{ccyFormat(invoiceIGV)}</TableCell>
              </TableRow>
              }

              <TableRow>
                <TableCell colSpan={2} align="right">Total</TableCell>
                <TableCell colSpan={2}
                align="right">{ccyFormat(invoiceTotal)}</TableCell>
              </TableRow>



              </TableBody>
            </Table>
          </TableContainer>

                </div>
        </div>
    );
}