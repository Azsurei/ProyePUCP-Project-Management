"use client";
import { useContext, useEffect, useState } from "react";
import { SmallLoadingScreen } from "../../layout";
import {
    Button,
    Divider,
    Select,
    SelectItem,
    Tab,
    Tabs,
} from "@nextui-org/react";
import axios from "axios";
import ListTareasReporte from "@/components/dashboardComps/projectComps/reportesComps/reporteTareasComps/ListTareasReporte";
import TaskProgressReport from "@/components/dashboardComps/projectComps/reportesComps/reporteTareasComps/TaskProgressReport";
import TasksGraphicView from "@/components/dashboardComps/projectComps/reportesComps/reporteTareasComps/TasksGraphicView";
axios.defaults.withCredentials = true;

function reporteTareas(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [listTareas, setListTareas] = useState([]);

    useEffect(() => {
        setIsLoadingSmall(true);
        const tareasURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/cronograma/listarTareasXidProyecto/" +
            projectId;
        axios
            .get(tareasURL)
            .then(function (response) {
                console.log(response);
                setListTareas(response.data.tareasOrdenadas);
                console.log(response.data.tareasOrdenadas);

                setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const [chartGeneralData, setChartGeneralData] = useState({
        labels: ["No inciadas", "En progreso", "Atrasadas", "Finalizadas"],
        datasets: [
            {
                label: "Cantidad",
                data: [5, 2, 4, 1],
                backgroundColor: ["rgb(63, 63, 70)", "rgb(0, 112, 240)", "rgb(245, 165, 36)", "rgb(24, 201, 100)"],
            },
        ],
    });

    const twStyle1 = "font-semibold text-2xl text-mainHeaders";

    return (
        <div className="flex min-h-[1300px] flex-col p-[2.5rem] font-[Montserrat] gap-y-6 flex-1 ">
            <div className="flex flex-row justify-between items-center">
                <p className="text-4xl text-mainHeaders font-semibold">
                    Reporte de tareas
                </p>
                <Button color="warning" className="text-white">
                    Guardar reporte
                </Button>
            </div>

            <Divider></Divider>

            <div className="flex-1 flex flex-col items-center justify-center relative">
                <div className="flex flex-row absolute top-0 bottom-1/2 left-0 right-0 mb-4">
                    <div className="  flex flex-col overflow-hidden flex-1">
                        <p className={twStyle1}>Listado de tareas</p>

                        <div className="flex-1  overflow-auto ">
                            <ListTareasReporte
                                listTareas={listTareas}
                                leftMargin={"0px"}
                                handleVerDetalle={() => {
                                    console.log("xd");
                                }}
                                handleAddNewSon={() => {
                                    console.log("xd");
                                }}
                                handleEdit={() => {
                                    console.log("xd");
                                }}
                                handleDelete={() => {
                                    console.log("xd");
                                }}
                            ></ListTareasReporte>
                        </div>
                    </div>

                    <Divider orientation="vertical" className="mx-4"></Divider>

                    <TaskProgressReport />
                </div>

                <Divider></Divider>

                <div className="flex flex-col absolute top-1/2 bottom-0 left-0 right-0 mt-4">
                    <TasksGraphicView chartGeneralData={chartGeneralData} />
                </div>
            </div>
        </div>
    );
}
export default reporteTareas;
