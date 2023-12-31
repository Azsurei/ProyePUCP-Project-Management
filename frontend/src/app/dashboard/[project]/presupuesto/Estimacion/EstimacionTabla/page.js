"use client"
import { useState, useEffect, useContext,useCallback, use } from "react";
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
import { SmallLoadingScreen } from "../../../layout";
import { NotificationsContext, SessionContext } from "@/app/dashboard/layout";
import CalculateIcon from '@mui/icons-material/Calculate';
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
import { saveAs } from "file-saver";


export default function EstimacionTabla(props) {

const { sessionData } = useContext(SessionContext);
const userId = sessionData.idUsuario.toString();
const rol = sessionData.rolInProject;


const { setIsLoadingSmall } = useContext(SmallLoadingScreen);


const decodedUrl = decodeURIComponent(props.params.project);
const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

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

const [MonedaPresupuesto,setMonedaPresupuesto]=useState(0);

const [tipoCambioDolar,setTipoCambioDolar]=useState(0);
useEffect(() => {
  const tipoCambio = async () => {
    
      try {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarMonedasTodas`;

        const response = await axios.get(url);
        const monedasData  = response.data.monedas;

        const monedaId1 = monedasData.find((moneda) => moneda.idMoneda === 1);
        setTipoCambioDolar(monedaId1.tipoCambio);
      } catch (error) {
        console.error("Error al obtener las plantillas:", error);
      }

  };

  tipoCambio();
},[]);


useEffect(() => {
  setIsLoadingSmall(false);

  const fetchData = async () => {
      let flag = 0; // Declarar la variable flag
      let idHerramientaCreada;
      if(projectId!==""){
      try {
          const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + `/api/herramientas/${projectId}/listarHerramientasDeProyecto`);
          const herramientas = response.data.herramientas;

          for (const herramienta of herramientas) {
              if (herramienta.idHerramienta === 13) {
                  idHerramientaCreada = herramienta.idHerramientaCreada;
                  setPresupuestoId(idHerramientaCreada);
                  console.log("idPresupuesto es:", idHerramientaCreada);
                  flag = 1;
                  break;
              }
          }
      } catch (error) {
          console.error('Error al obtener el presupuesto:', error);
      }

      if (flag === 1) {
          // Aquí encadenamos el segundo axios
          const stringURLListarPresupuesto = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/proyecto/presupuesto/listarPresupuesto/" + idHerramientaCreada;
          axios.get(stringURLListarPresupuesto)
              .then(response => {
                  const presupuesto = response.data.presupuesto;
                  const moneda = presupuesto.idMoneda;

                  //Porcentajes
                  const ReservaContingencia=presupuesto.reservaContingencia;
                  const PorcentajeReservaGestion=presupuesto.porcentajeReservaGestion;
                  const PorcentajeGanancia=presupuesto.porcentajeGanancia;
                  const Igv=presupuesto.IGV;


                  setReserva(ReservaContingencia);
                  setGestion(PorcentajeReservaGestion);
                  setGanancia(PorcentajeGanancia);
                  setIGV(Igv);


                  setMonedaPresupuesto(moneda);



              })
              .catch(error => {
                  console.error("Error al llamar a la API:", error);
              });
      }
    }
  };

  fetchData();
}, [projectId]);


  
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

function subtotal(items, MonedaPresupuesto) {
  return items.map(({ subtotal, cantidadRecurso,tarifaUnitaria,tiempoRequerido, idMoneda }) => {
    return MonedaPresupuesto === idMoneda
      ? subtotal
      : cantidadRecurso * convertirTarifa(tarifaUnitaria, idMoneda)* tiempoRequerido;
  }).reduce((sum, i) => sum + i, 0);
}

const [lineasEstimacion, setLineasEstimacion] = useState([]);

    //Aqui va el data table de Iwa
    
    
    const DataTable = async () => {
        const fetchData = async () => {
          if(presupuestoId!==""){
            try {
              const response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/presupuesto/listarLineasEstimacionCostoXIdPresupuesto/${presupuestoId}`);
              const data = response.data.lineasEstimacionCosto;
              setLineasEstimacion(data);
            } catch (error) {
              console.error('Error al obtener las líneas de ingreso:', error);
            }
          }
          };
            fetchData();
    };
    useEffect(() => {
      DataTable();
    }, [presupuestoId]);
//Calculos
const invoiceSubtotal = subtotal(lineasEstimacion, MonedaPresupuesto);
const invoiceReserva = parseFloat(Reserva) ;

const invoiceLineaBase = invoiceSubtotal + invoiceReserva;

const invoiceGestion = Gestion * invoiceLineaBase;

const invoicePresupuesto= invoiceLineaBase + invoiceGestion;

const invoiceGanancia = Ganancia * invoicePresupuesto;

const invoiceTotalGanancia= invoicePresupuesto + invoiceGanancia;

const invoiceIGV= IGV * invoiceTotalGanancia;

const invoiceTotal=invoiceIGV+invoicePresupuesto;


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

async function updatePorcentaje() {
      return new Promise((resolve, reject) => {
        setIsLoadingSmall(true);
        const stringUrlmodificaPresupuesto =
          process.env.NEXT_PUBLIC_BACKEND_URL +
          `/api/proyecto/presupuesto/modificarPorcentasjesPresupuestoXIdPresupuesto`;        
        
        let data = {
          idPresupuesto: presupuestoId,
          reservaContingencia: parseFloat(pReserva),
          porcentajeReservaGestion: parseFloat(pGestion / 100),
          porcentajeGanancia: parseFloat(pGanancia / 100),
          IGV: parseFloat(pIGV / 100)
        };

        const replacements = {
          reservaContingencia: Reserva,
          porcentajeReservaGestion: Gestion,
          porcentajeGanancia: Ganancia,
          IGV: IGV
        };

        for (const key in data) {
          if (data.hasOwnProperty(key) && data[key] <= 0.00) {
              data[key] = replacements[key];
          }
        }
    

        console.log(data);

        axios
          .put(stringUrlmodificaPresupuesto, data)
          .then((response) => {
            console.log(response.data.message);
            resolve(response);
          })
          .catch((error) => {
            console.error("Error al modificar el presupuesto:", error);
            reject(error);
          });
  });
}





const actualizarPorcentanjes = () => {
  toast.promise(updatePorcentaje, {
      loading: "Actualizando presupuesto...",
      success: (data) => {
          return "El presupuesto se actualizó con éxito!";
      },
      error: "Error al actualizar presupuesto",
      position: "bottom-right",
  });

};


async function handlerExport() {
  console.log(presupuestoId);
  try {
      const exportURL =
          process.env.NEXT_PUBLIC_BACKEND_URL +
          "/api/proyecto/reporte/crearExcelFlujoEstimacionCosto";

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
          saveAs(response.data, fileName);

          toast.success("Se exporto la Estimación de Costos con exito");
      }, 500);
  } catch (error) {
      toast.error("Error al exportar la Estimación de Costos");
      console.log(error);
  }
}



    return (
        <div className="mainDivPresupuesto">

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

                      if(pGestion>0){
                        setGestion(pGestion/100);
                      }
                      
                      if(pReserva>0){
                        setReserva(pReserva);
                      }
                     
                      if(pIGV>0){
                        setIGV(pIGV/100);

                      }

                      if(pGanancia>0){
                        setGanancia(pGanancia/100);
                      }


                      try {
                          actualizarPorcentanjes();     

                          
                      } catch (error) {
                          console.error('Error al registrar porcentajes:', error);
                      }

                      onClose();
                      setIsLoadingSmall(false);


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
                            defaultValue={Reserva}
                            onValueChange={setpReserva}
                            labelPlacement="outside"
                            isInvalid={!validReserva}
                            onChange={() => { setValidReserva(true) }}
                            type="number"
                            errorMessage={!validReserva ? "Monto inválido" : ""}
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small"></span>
                              </div>
                            }
                          />
                          
                          <Input
                            defaultValue={Gestion*100}
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
                            defaultValue={Ganancia*100}
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
                            defaultValue={(IGV * 100).toFixed(0)}
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
            <BreadcrumbsItem href={"/dashboard/"+projectName+"="+projectId+"/Estimacion"}  text="Estimación"/>
            <BreadcrumbsItem href="" text="Tabla Estimación" />

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


                  {rol !== 2 && (
                      <Button onPress={ondModalConfigurar} color="primary" startContent={<BuildIcon />} className="btnEditEstimacion">
                        Configurar
                      </Button> 
                      )
                  }


                    <Link href={"/dashboard/"+projectName+"="+projectId+"/presupuesto/Estimacion"}>
                        <Button color="primary" startContent={<CalculateIcon />} className="btnEditEstimacionSup">
                            Estimaciones
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

            <div className="subtitlePresupuesto">Estimación de Costos </div>
            
        <TableContainer component={Paper} >
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell className="text-gray-800 text-sm not-italic font-bold"  align="right" colSpan={2}>
                  Cant. Recurso
                </TableCell>
                <TableCell className="text-gray-800 text-sm not-italic font-bold"  align="right">Tarifa</TableCell>
                <TableCell className="text-gray-800 text-sm not-italic font-bold"  align="right">Tiempo Req</TableCell>
                <TableCell className="text-gray-800 text-sm not-italic font-bold"  align="right">Subtotal</TableCell>
              </TableRow>
              
            </TableHead>
            <TableBody>
            {lineasEstimacion.map((row) => {
              console.log(row);
              return (
                <TableRow key={row.descripcion}>
                  <TableCell className="text-gray-800 text-sm not-italic font-medium" >{row.descripcion}</TableCell>
                  <TableCell align="right">{row.cantidadRecurso}</TableCell>
                  <TableCell align="right">{MonedaPresupuesto === row.idMoneda

                    ? row.tarifaUnitaria
                    : convertirTarifa(row.tarifaUnitaria, row.idMoneda)}

                  </TableCell>
                  <TableCell align="right">{row.tiempoRequerido}</TableCell>
                  <TableCell className="text-gray-800 text-sm not-italic font-bold" align="right">{MonedaPresupuesto === row.idMoneda

                          ? ccyFormat(row.subtotal)
                          : ccyFormat(row.cantidadRecurso*convertirTarifa(row.tarifaUnitaria, row.idMoneda)*row.tiempoRequerido)
                          }
                    
                    </TableCell>
                </TableRow>
              );
            })}


              <TableRow>
                <TableCell rowSpan={9} />
                <TableCell  colSpan={2} align="right">Total</TableCell>
                <TableCell className="text-gray-800 text-sm not-italic font-bold" colSpan={2}
                  align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-gray-800 text-sm not-italic font-bold" colSpan={2} align="right">Reserva Contingencia</TableCell>
                <TableCell className="text-gray-800 text-sm not-italic font-bold" align="right">{`${(Reserva*1).toFixed(2)} `}</TableCell>
                <TableCell className="text-gray-800 text-sm not-italic font-bold" colSpan={1}
                align="right">{ccyFormat(invoiceReserva*1)}</TableCell>
              </TableRow>

              <TableRow>
                
                <TableCell colSpan={2} align="right">Linea Base de Costos</TableCell>
                <TableCell  colSpan={2}
                align="right">{ccyFormat(invoiceLineaBase)}</TableCell>

              </TableRow>

              <TableRow>
                <TableCell className="text-gray-800 text-sm not-italic font-bold" colSpan={2} align="right">Reserva de Gestión</TableCell>
                <TableCell className="text-gray-800 text-sm not-italic font-bold" align="right">{`${(Gestion*100).toFixed(0)} %`}</TableCell>

                <TableCell className="text-gray-800 text-sm not-italic font-bold" colSpan={2}
                align="right">{ccyFormat(invoiceGestion)}</TableCell>
              </TableRow>


              <TableRow>
                <TableCell colSpan={2} align="right">Presupuesto</TableCell>
                <TableCell colSpan={2}
                align="right">{ccyFormat(invoicePresupuesto)}</TableCell>
              </TableRow>

              {Ganancia>0 &&
              <TableRow>
                <TableCell className="text-gray-800 text-sm not-italic font-bold" colSpan={2} align="right">Ganancia</TableCell>
                <TableCell className="text-gray-800 text-sm not-italic font-bold" align="right">{`${(Ganancia*100).toFixed(0)} %`}</TableCell>

                <TableCell colSpan={2}
                className="text-gray-800 text-sm not-italic font-bold" align="right">{ccyFormat(invoiceGanancia)}</TableCell>
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
                <TableCell className="text-gray-800 text-sm not-italic font-bold" colSpan={2} align="right">IGV</TableCell>
                <TableCell className="text-gray-800 text-sm not-italic font-bold" align="right">{`${(IGV*100).toFixed(0)} %`}</TableCell>

                <TableCell className="text-gray-800 text-sm not-italic font-bold" colSpan={2}
                align="right">{ccyFormat(invoiceIGV)}</TableCell>
              </TableRow>
              }

              <TableRow>
                <TableCell className="text-gray-800 text-sm not-italic font-bold" colSpan={2} align="right">TOTAL</TableCell>
                <TableCell className="text-gray-800 text-sm not-italic font-bold" colSpan={2}
                align="right">{ccyFormat(invoiceTotal)}</TableCell>
              </TableRow>



              </TableBody>
            </Table>
          </TableContainer>

                </div>
        </div>
    );
}