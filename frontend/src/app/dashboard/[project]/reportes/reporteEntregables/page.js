"use client";
import CardTareaDisplay from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardTareaDisplay";
import { Button, Chip, Divider } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SmallLoadingScreen } from "../../layout";
axios.defaults.withCredentials = true;

function ReporteEntregables(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [listTareas, setListTareas] = useState([]);

    useEffect(() => {
        const tareasURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/cronograma/listarTareasXidProyecto/" +
            projectId;
        axios
            .get(tareasURL)
            .then(function (response) {
                console.log(response.data.tareasOrdenadas);
                setListTareas(response.data.tareasOrdenadas);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <div className="flex h-full flex-col p-[2.5rem] font-[Montserrat] gap-y-6">
            <div className="flex flex-row justify-between items-center">
                <p className="text-4xl text-mainHeaders font-semibold">
                    Reporte de entregables
                </p>
                <Button color="warning" className="text-white">
                    Guardar reporte
                </Button>
            </div>

            <Divider></Divider>

            <div className="flex flex-row h-full gap-x-4 mt-2">
                <div className="w-[15%]">
                    <p>Entregable 1</p>
                    <p>Entregable 2</p>
                </div>

                <Divider orientation="vertical" />

                <div className="w-[85%] flex flex-col">
                    <div className="flex flex-row items-center gap-x-4">
                        <p className="text-3xl text-mainHeaders font-semibold">
                            Entregable X
                        </p>
                        <Chip
                            color="warning"
                            size="lg"
                            variant="flat"
                            radius="lg"
                            className=" min-h-[40px] text-lg"
                        >
                            Atrasado
                        </Chip>
                    </div>

                    <div className="flex flex-row h-full">
                        <div className="w-[60%] text-lg">
                            <p>
                                Descripcion: Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit. Vestibulum eget
                                felis in libero tincidunt vulputate.
                            </p>
                            <div className="flex flex-row item-center gap-3">
                                <p className="font-medium">
                                    Fechas del entregable
                                </p>
                                <Chip
                                    color="success"
                                    size="md"
                                    variant="flat"
                                    className="min-h-[35px] text-base"
                                >
                                    23/10/2023
                                </Chip>
                                <p>-</p>
                                <Chip
                                    color="danger"
                                    size="md"
                                    variant="flat"
                                    className="min-h-[35px] text-base"
                                >
                                    23/10/2023
                                </Chip>
                            </div>

                            <div className="flex flex-row py-[.4rem] px-[1rem] bg-mainSidebar rounded-xl text-base items-center mt-5 mb-2">
                                <p className="flex-1">Nombre</p>
                                <p className="w-[30%]">Asignados</p>
                                <p className="w-[20%]">Estado</p>
                                <p className="w-[20%]">Fechas</p>
                            </div> 

                            {listTareas.map((tarea) => {
                                return (
                                    <CardTareaDisplay
                                        key={tarea.idTarea}
                                        tarea={tarea}
                                    />
                                );
                            })}
                        </div>
                        <div className="w-[40%]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReporteEntregables;
