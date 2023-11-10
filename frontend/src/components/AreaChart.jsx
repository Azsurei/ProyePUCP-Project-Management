"useClient"
import React, { useEffect, useState, useContext, useRef } from "react";
import  ReactApexChart  from 'react-apexcharts'
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
export default function AreaChart(props) {
    return (
        <>
           {props.client && ( // Renderiza el gráfico solo en el lado del cliente
                    <ReactApexChart
                        options={props.options}
                        series={props.series}
                        type="area"
                        height={props.height}
                        width={props.width}
                    />
            )}
        </>
    );
}