"use client";
import { useContext, useEffect, useState } from "react";
import { SmallLoadingScreen } from "../../layout";
import { Button, Divider } from "@nextui-org/react";
import axios from "axios";
import ListTareasReporte from "@/components/dashboardComps/projectComps/reportesComps/reporteTareasComps/ListTareasReporte";
import TaskProgressReport from "@/components/dashboardComps/projectComps/reportesComps/reporteTareasComps/TaskProgressReport";
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

    const twStyle1 = "font-semibold text-xl text-mainHeaders";

    return (
        <div className="flex min-h-full flex-col p-[2.5rem] font-[Montserrat] gap-y-6 flex-1 border border-red-500">
            <div className="flex flex-row justify-between items-center">
                <p className="text-4xl text-mainHeaders font-semibold">
                    Reporte de tareas
                </p>
                <Button color="warning" className="text-white">
                    Guardar reporte
                </Button>
            </div>

            <Divider></Divider>

            <div className="flex-1 flex flex-col border-black border relative">

                <div className="flex flex-row absolute top-0 bottom-1/2 left-0 right-0">
                    <div className="w-full h-full  flex flex-col overflow-hidden">
                        <p className={twStyle1}>Listado de tareas</p>

                        <div className="flex-1  overflow-auto ">
                            <ListTareasReporte
                                listTareas={listTareas}
                                leftMargin={"0px"}
                                handleVerDetalle={()=>{console.log("xd")}}
                                handleAddNewSon={()=>{console.log("xd")}}
                                handleEdit={()=>{console.log("xd")}}
                                handleDelete={()=>{console.log("xd")}}
                            ></ListTareasReporte>
                        </div>
                    </div>

                    <TaskProgressReport/>
                </div>

                <div className="flex border border-purple-700 absolute top-1/2 bottom-0 left-0 right-0">
                    <p className={twStyle1}>
                        Grafico de culminacion por sprints
                    </p>
                </div>

            </div>
        </div>
    );
}
export default reporteTareas;
