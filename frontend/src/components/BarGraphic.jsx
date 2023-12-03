"useClient"
import React, { useEffect, useState, useContext, useRef } from "react";
import  ReactApexChart  from 'react-apexcharts'
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
export default function BarGraphic(props) {
    return (
        <>
           {props.client && ( // Renderiza el gráfico solo en el lado del cliente
                <div className="GraficoReportePresupuesto">
                    <p className="flex text-3xl font-bold font-montserrat">{props.title}</p>
                    <ReactApexChart
                        options={props.options}
                        series={props.series}
                        type="bar"
                        height={props.height}
                        width={props.width}
                    />
                </div>
            )}
        </>
    );
}