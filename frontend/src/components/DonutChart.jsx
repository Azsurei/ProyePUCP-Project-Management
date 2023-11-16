"useClient"
import React, { useEffect, useState, useContext, useRef } from "react";
import  ReactApexChart  from 'react-apexcharts'
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reportes.css"
export default function DonutChart(props) {
    return (
        <>
           {props.client && ( // Renderiza el gráfico solo en el lado del cliente
                <div className=" flex gap-4">
                    <div className="titleBalanceData">{props.title}</div>
                    <ReactApexChart
                        options={props.options}
                        series={props.series}
                        type="donut"
                        height={props.height}
                        width={props.width}
                    />
                </div>
            )}
        </>
    );
}