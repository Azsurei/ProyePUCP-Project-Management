"useClient"
import React, { useEffect, useState, useContext, useRef } from "react";
import  ReactApexChart  from 'react-apexcharts'
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
export default function PieChart(props) {
    return (
        <>
           {props.client && ( // Renderiza el gráfico solo en el lado del cliente
                <div className="GraficoReportePresupuesto">
                    <ReactApexChart
                        options={props.options}
                        series={props.series}
                        type="pie"
                        height={700}
                        width={400}
                    />
                </div>
            )}
        </>
    );
}