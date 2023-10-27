"use client";
import {  useState, useEffect } from "react";
import React, { Component } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/presupuesto/ingresosList.css";
import { format } from "date-fns";
import { es } from "date-fns/locale";
axios.defaults.withCredentials = true;
function CardEgreso({
    tipoEgreso,
    EgresoObject,
    cantidad,
    costoRealEgreso,
    horaEgreso,
    refresh,
}) {
    //const [isSelected, setIsSelected] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);



    const imageEgresoOptions = {
        "Licencia de Software": "/icons/icon-licencia.svg",
        "Ingeniero Industrial": "/icons/icon-ingeniero.svg",
        // Agrega más opciones según sea necesario
    };
    const isEgreso= ["Licencia de Software", "Ingeniero Industrial"].includes(tipoEgreso);
    const monedaSymbol = EgresoObject.nombreMoneda === "Dolar" ? "$" : "S/";
    return (
        <li
            className="IngresoCard"
        >
            <img
                className="imgageIngresoDefault"
                src={imageEgresoOptions[EgresoObject.descripcion]}
            />
            <div className="informacionIngreso">
                <div style={{ marginTop: "12px", marginLeft: "15px" }}>
                    <p className="titleTipoIngreso">{tipoEgreso}</p>
                    <p className={isEgreso ? "titleTipoPagoEgresoHistorial" : "titleTipoPago"}>Cant. {cantidad}</p>
                </div>
                <div style={{ marginTop: "12px", marginLeft: "auto" }}>
                    <p className={isEgreso ? "titleMontoEgresoHistorial" : "titleMontoEgreso"}>{monedaSymbol} {costoRealEgreso}</p>
                    <p className="titleHoraIngreso">{horaEgreso}</p>
                </div>
                
            </div>

        </li>
    );
}
function CardIngresos({
    tipoIngreso,
    IngresoObject,
    cantidad,
    montoIngreso,
    horaIngreso,
    refresh,
}) {
    //const [isSelected, setIsSelected] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedLinea, setSelectedLinea] = useState(null);


    const imageIngresoOptions = {
        "Efectivo": "/icons/icon-Efectivo.svg",
        "Transferencia": "/icons/icon-transferencia.svg",
        "Cheque": "/icons/icon-cheque.svg",
        "Licencia de Software": "/icons/icon-licencia.svg",
        "Ingeniero Industrial": "/icons/icon-ingeniero.svg",
        // Agrega más opciones según sea necesario
    };
    const isEgreso= ["Licencia de Software", "Ingeniero Industrial"].includes(tipoIngreso);
    const monedaSymbol = IngresoObject.nombreMoneda === "Dolar" ? "$" : "S/";
    return (
        <li
            className="IngresoCard"
        >
            <img
                className="imgageIngresoDefault"
                src={imageIngresoOptions[IngresoObject.descripcionTransaccionTipo]}
            />
            <div className="informacionIngreso">
                <div style={{ marginTop: "12px", marginLeft: "15px" }}>
                    <p className="titleTipoIngreso">{tipoIngreso}</p>
                    <p className={isEgreso ? "titleTipoPagoEgresoHistorial" : "titleTipoPago"}>{IngresoObject.descripcionTransaccionTipo}</p>
                </div>
                <div style={{ marginTop: "12px", marginLeft: "auto" }}>
                    <p className={isEgreso ? "titleMontoEgresoHistorial" : "titleMontoIngreso"}>{monedaSymbol} {montoIngreso}</p>
                    <p className="titleHoraIngreso">{IngresoObject.descripcionIngresoTipo}</p>
                </div>
            </div>
        </li>
    );
}
function groupByFecha({list, fechaProperty}) {
    const fechaGroups = {};
    list.forEach((component) => {
        const fechaTransaccion = new Date(component[fechaProperty]);
        const fechaKey = fechaTransaccion.toISOString().split('T')[0];

        if (!fechaGroups[fechaKey]) {
            fechaGroups[fechaKey] = [];
        }

        fechaGroups[fechaKey].push(component);
    });
    return fechaGroups;
}
function renderGroups(groups, fechaKeyProperty) {
    return Object.keys(groups).map((fechaKey) => {
        const fechaTransaccion = new Date(groups[fechaKey][0][fechaKeyProperty]);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const fechaFormateada = fechaTransaccion.toLocaleDateString('es-ES', options);

        const renderIngresos = (component) => {
            return (
                <CardIngresos
                    key={component.idLineaIngreso}
                    tipoIngreso={component.descripcion}
                    IngresoObject={component}
                    cantidad={component.cantidad}
                    montoIngreso={component.monto}
                />
            );
        };
        const renderEgresos = (component) => {
            return (
                <CardEgreso
                    key={component.idLineaEgreso}
                    tipoEgreso={component.descripcion}
                    EgresoObject={component}
                    cantidad={component.cantidad}
                    costoRealEgreso={component.costoReal}
                />
            );
        };

        return (
            <div key={fechaKey}>
                <div className="fechaCard">
                    <p className="fechaTransaccion">{fechaFormateada}</p>
                </div>
                <ul className="ListIngresosProject">
                    {fechaKeyProperty === "fechaTransaccion"
                        ? groups[fechaKey].map(renderIngresos)
                        : groups[fechaKey].map(renderEgresos) // Renderiza independientemente de la propiedad
                    }
                </ul>
            </div>
        );
    });
}

export default function HistorialList(props) {
    const router = useRouter();
    const { listaIngresos, listaEgreso , refresh} = props;
    useEffect(() => {
        const handleRefresh = async () => {
            refresh();
            console.log("refreshed");
        };
        handleRefresh();
    }, []);
    // Combina las listas de ingresos y egresos
    const combinedList = [...listaIngresos, ...listaEgreso];
  
    if (combinedList.length === 0) {
      return <p className="noResultsMessage">No se encontraron resultados.</p>;
    }
  
    // Agrupa los elementos por fecha
    const groupedByDate = {};
    combinedList.forEach((item) => {
      const fechaKey = item.fechaTransaccion || item.fechaRegistro; // Usar la fecha adecuada según el tipo
  
      if (!groupedByDate[fechaKey]) {
        groupedByDate[fechaKey] = [];
      }
  
      groupedByDate[fechaKey].push(item);
    });
  
    
    return (
      <div>
        {Object.keys(groupedByDate).map((fechaKey) => (
          <div key={fechaKey}>
            <div className="fechaCard">
              <p className="fechaIngreso">{format(new Date(fechaKey), "dd 'de' LLLL 'de' yyyy", { locale: es })}</p>
            </div>
            <ul className="ListIngresosProject">
              {groupedByDate[fechaKey].map((item) => {
                if (listaIngresos.includes(item)) {
                  // Es un ingreso
                  return (
                    <CardIngresos
                    key={item.idLineaIngreso}
                    tipoIngreso={item.descripcion}
                    IngresoObject={item}
                    cantidad={item.cantidad}
                    montoIngreso={item.monto}
                    />
                  );
                } else {
                  // Es un egreso
                  return (
                    <CardEgreso
                    key={item.idLineaEgreso}
                    tipoEgreso={item.descripcion}
                    EgresoObject={item}
                    cantidad={item.cantidad}
                    costoRealEgreso={item.costoReal}
                    />
                  );
                }
              })}
            </ul>
          </div>
        ))}
      </div>
    );
  }