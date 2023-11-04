"use client";
import CardTareaDisplay from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardTareaDisplay";
import {
    Button,
    Chip,
    CircularProgress,
    Divider,
    Progress,
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { HerramientasInfo, SmallLoadingScreen } from "../../layout";
import "@/styles/dashboardStyles/projectStyles/reportesStyles/reporteEntregablesStyles/repEntregables.css";
import CardContribuyente from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/CardContribuyente";
import PieChart from "@/components/dashboardComps/projectComps/reportesComps/reporeEntregablesComps/PieChart";
import { dbDateToDisplayDate } from "@/common/dateFunctions";
axios.defaults.withCredentials = true;

const mockUsers = [
    {
        idUsuario: 4,
        nombres: "Renzo Gabriel",
        apellidos: "Pinto Quiroz",
        correoElectronico: "a20201491@pucp.edu.pe",
        imgLink: "/images/ronaldo_user.png",
    },
    {
        idUsuario: 5,
        nombres: "Renzo Gabriel",
        apellidos: "Pinto Quiroz",
        correoElectronico: "a20201491@pucp.edu.pe",
        imgLink: "/images/ronaldo_user.png",
    },
    {
        idUsuario: 6,
        nombres: "Renzo Gabriel",
        apellidos: "Pinto Quiroz",
        correoElectronico: "a20201491@pucp.edu.pe",
        imgLink: "/images/ronaldo_user.png",
    },
];

const mockEntregablesArray = [
    {
        idEntregable: 1,
        nombre: "El mejor entregable",
    },
    {
        idEntregable: 2,
        nombre: "Backlog",
    },
    {
        idEntregable: 3,
        nombre: "Historias de usuario",
    },
];

function ReporteEntregables(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const [selectedEntregable, setSelectedEntregable] = useState(null);
    const [listEntregables, setListEntregables] = useState([]);
    const [listTareas, setListTareas] = useState([]);
    const [listContribuyentes, setListContribuyentes] = useState([]);
    const [activeContribuyente, setActiveContribuyente] = useState(null);
    const [chartData, setChartData] = useState(null);

    //entregable general data
    const [entregableName, setEntregableName] = useState("");
    const [entregableChipColor, setEntregableChipColor] = useState("default");
    const [entregableProgress, setEntregableProgress] = useState(0);
    const [entregableComponentName, setEntregableComponentName] = useState("");
    const [entregableDescripcion, setEntregableDescripcion] = useState("");
    const [entregableFechaInicio, setEntregableFechaInicio] = useState("");
    const [entregableFechaFin, setEntregableFechaFin] = useState("");

    useEffect(() => {
        console.log("empezando en reporte");
        setIsLoadingSmall(true);
        const tareasURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/reportes/generarReporteEntregables/" +
            projectId;
        axios
            .get(tareasURL)
            .then(function (response) {
                console.log(JSON.stringify(response.data.entregables, null, 2));
                setListEntregables(response.data.entregables);
                setSelectedEntregable(
                    response.data.entregables[0].idEntregable
                );

                setListTareas(response.data.entregables[0].tareasEntregable);
                getEntregableStatistics(response.data.entregables[0]);
                setEntregableName(response.data.entregables[0].nombre);
                setEntregableComponentName(
                    response.data.entregables[0].ComponenteEDTNombre
                );
                setEntregableDescripcion(
                    response.data.entregables[0].descripcion
                );
                setEntregableFechaInicio(
                    response.data.entregables[0].fechaInicio
                );
                setEntregableFechaFin(response.data.entregables[0].fechaFin);

                setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const btnStyle =
        "group hover:underline  font-medium px-4 py-2 rounded-md cursor-pointer";
    const btnStyleActive =
        "font-medium px-4 py-2 rounded-md bg-[#F4F4F5] dark:bg-[#414141] cursor-pointer";

    return (
        <div className="flex h-full flex-col p-[2.5rem] font-[Montserrat] gap-y-6 min-h-[800px]">
            <div className="flex flex-row justify-between items-center">
                <p className="text-4xl text-mainHeaders font-semibold">
                    Reporte de entregables
                </p>
                <Button color="warning" className="text-white">
                    Guardar reporte
                </Button>
            </div>

            <Divider></Divider>

            <div className="flex flex-row overflow-hidden gap-x-4 mt-2 flex-1">
                <div className="w-[15%] flex flex-col space-y-1">
                    {listEntregables.map((entregable) => {
                        return (
                            <p
                                key={entregable.idEntregable}
                                className={
                                    selectedEntregable ===
                                    entregable.idEntregable
                                        ? btnStyleActive
                                        : btnStyle
                                }
                                onClick={() => {
                                    setSelectedEntregable(
                                        entregable.idEntregable
                                    );
                                    setListTareas(entregable.tareasEntregable);
                                    getEntregableStatistics(entregable);
                                    setEntregableName(entregable.nombre);
                                    setEntregableComponentName(
                                        entregable.ComponenteEDTNombre
                                    );
                                    setEntregableDescripcion(
                                        entregable.descripcion
                                    );
                                    setEntregableFechaInicio(
                                        entregable.fechaInicio
                                    );
                                    setEntregableFechaFin(entregable.fechaFin);
                                }}
                            >
                                {entregable.nombre}
                            </p>
                        );
                    })}
                </div>

                <Divider orientation="vertical" />

                <div className="w-[85%] flex flex-col">
                    <div className="flex flex-row h-full gap-5">
                        <div className="w-[70%] text-lg">
                            <div className="flex flex-row items-center gap-x-4 mb-3">
                                <p className="text-3xl text-mainHeaders font-semibold">
                                    {entregableName}
                                </p>
                                <Chip
                                    color={entregableChipColor}
                                    size="lg"
                                    variant="flat"
                                    radius="lg"
                                    className=" min-h-[40px] text-lg"
                                >
                                    {entregableProgress < 1 && "No iniciado"}
                                    {entregableProgress > 1 && entregableProgress < 100 && "En progreso"}
                                    {entregableProgress === 100 && "Finalizado"}
                                </Chip>
                            </div>

                            <div className="flex flex-row items-center gap-3 mb-3">
                                <Progress
                                    size="md"
                                    aria-label="Loading..."
                                    value={entregableProgress}
                                    color={entregableChipColor}
                                />
                                <p className="text-lg font-semibold text-mainHeaders">
                                    {entregableProgress + "%"}
                                </p>
                            </div>

                            <p className="text-gray-400">
                                {"Componente EDT asociado: " +
                                    entregableComponentName}
                            </p>

                            <p className="text-gray-400">
                                {"Descripcion: " + entregableDescripcion}
                            </p>
                            <div className="flex flex-row item-center gap-3 ">
                                <p className="font-medium flex items-center">
                                    Fechas del entregable
                                </p>
                                <Chip
                                    color="success"
                                    size="md"
                                    variant="flat"
                                    className="min-h-[35px] text-base"
                                >
                                    {dbDateToDisplayDate(entregableFechaInicio)}
                                </Chip>
                                <p>-</p>
                                <Chip
                                    color="danger"
                                    size="md"
                                    variant="flat"
                                    className="min-h-[35px] text-base"
                                >
                                    {dbDateToDisplayDate(entregableFechaFin)}
                                </Chip>
                            </div>

                            <div
                                className="flex flex-row py-[.4rem] px-[1rem] 
                                bg-mainSidebar rounded-xl text-sm tracking-wider 
                                items-center mt-5 mb-2 text-[#a1a1aa]"
                            >
                                <p className="flex-1">NOMBRE</p>
                                <p className="w-[30%]">ASIGNADOS</p>
                                <p className="w-[20%]">ESTADOS</p>
                                <p className="w-[20%]">FECHAS</p>
                            </div>

                            <div className="flex flex-col space-y-1">
                                {listTareas.map((tarea) => {
                                    return (
                                        <CardTareaDisplay
                                            key={tarea.idTarea}
                                            tarea={tarea}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <div
                            className="w-[30%] bg-mainSidebar rounded-xl p-3 
                            flex flex-col items-start"
                        >
                            <p className="text-xl font-semibold text-mainHeaders  mb-3">
                                Grafico de contribucion
                            </p>
                            <div
                                className="w-full h-[40%]
                                bg-mainBackground rounded-xl 
                                flex justify-center
                                border-[1px] border-[#797979]
                                mb-3
                            "
                            >
                                {chartData !== null && (
                                    <PieChart data={chartData} />
                                )}
                            </div>

                            <div
                                className="participantsContainer flex-1 w-full overflow-y-scroll 
                                pr-2 flex flex-col gap-y-2 pb-1
                            "
                            >
                                {listContribuyentes.map((contribuyente) => {
                                    return (
                                        <CardContribuyente
                                            key={contribuyente.idContribuyente}
                                            contribuyente={contribuyente}
                                            user={contribuyente.usuario}
                                            equipo={contribuyente.equipo}
                                            isEquipo={
                                                contribuyente.usuario === null
                                                    ? true
                                                    : false
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    function getEntregableStatistics(entregable) {
        const contribuyentes = [];

        //agregamos sin repetir a los equipos y usuarios al arreglo de contribuyentes
        const participanteEstructura = {
            idContribuyente: 1,
            usuario: 1,
            equipo: 1,
            tareasAsignadas: 1,
            porcentajeTotal: 1,
        };

        entregable.tareasEntregable.forEach((tarea) => {
            //iteramos tareas de un entregable
            if (tarea.idEquipo !== null) {
                let flagHasBeenAddedE = 0;
                for (const contribuyente of contribuyentes) {
                    if (contribuyente.equipo !== null) {
                        if (contribuyente.equipo.idEquipo === tarea.idEquipo) {
                            flagHasBeenAddedE = 1;
                            break;
                        }
                    }
                }

                if (flagHasBeenAddedE === 0) {
                    console.log(
                        "agregando nuevo equipo " + tarea.equipo.nombre
                    );
                    contribuyentes.push({
                        idContribuyente: contribuyentes.length + 1,
                        usuario: null,
                        equipo: tarea.equipo,
                        tareasAsignadas: 1,
                        porcentajeTotal: 0,
                    });
                } else {
                    //buscamos al equipo en contribuyentes y aumentamos su asigned +1
                    console.log(
                        "agregando +1 tarea a el equipo " + tarea.equipo.nombre
                    );
                    const indexYaAsignado = contribuyentes.findIndex(
                        (elemento) =>
                            elemento.equipo?.idEquipo === tarea.equipo.idEquipo
                    );
                    contribuyentes[indexYaAsignado].tareasAsignadas =
                        contribuyentes[indexYaAsignado].tareasAsignadas + 1;
                }
            } else {
                tarea.usuarios.forEach((usuario) => {
                    //itereamos usuarios de la tarea

                    let flagHasBeenAdded = 0;
                    for (const contribuyente of contribuyentes) {
                        if (
                            contribuyente.usuario?.idUsuario ===
                            usuario.idUsuario
                        ) {
                            flagHasBeenAdded = 1;
                            break;
                        }
                    }

                    if (flagHasBeenAdded === 0) {
                        console.log(
                            "agregando nuevo usuario " + usuario.nombres
                        );
                        contribuyentes.push({
                            idContribuyente: contribuyentes.length + 1,
                            usuario: usuario,
                            equipo: null,
                            tareasAsignadas: 1,
                            porcentajeTotal: 0,
                        });
                    } else {
                        //buscamos al usuario en contribuyentes y aumentamos su asigned +1
                        console.log(
                            "agregando +1 tarea a el usuario " + usuario.nombres
                        );

                        const indexYaAsignado = contribuyentes.findIndex(
                            (elemento) =>
                                elemento.usuario?.idUsuario ===
                                usuario.idUsuario
                        );
                        contribuyentes[indexYaAsignado].tareasAsignadas =
                            contribuyentes[indexYaAsignado].tareasAsignadas + 1;
                    }
                });
            }
        });

        const listaContribuyentes = [...contribuyentes];

        for (const contribuyente of listaContribuyentes) {
            let contribPorTarea = 0;
            for (const tarea of entregable.tareasEntregable) {
                if (tarea.idEquipo !== null) {
                    if (tarea.idEquipo === contribuyente.equipo?.idEquipo) {
                        contribPorTarea +=
                            1 / entregable.tareasEntregable.length;
                    }
                } else {
                    const usuarioEncontrado = tarea.usuarios.find(
                        (user) =>
                            user.idUsuario === contribuyente.usuario?.idUsuario
                    );

                    if (usuarioEncontrado) {
                        contribPorTarea +=
                            (1 / tarea.usuarios.length) *
                            (1 / entregable.tareasEntregable.length);
                    }
                }
            }
            contribuyente.porcentajeTotal = contribPorTarea * 100;
        }

        console.log(JSON.stringify(listaContribuyentes, null, 2));

        console.log("LISTA LABELS");
        console.log(
            listaContribuyentes.map((contrib) => {
                if (contrib.usuario === null) {
                    return contrib.equipo.nombre;
                } else {
                    return contrib.usuario.nombres;
                }
            })
        );
        console.log("LISTA DATA");
        console.log(
            listaContribuyentes.map((contrib) => {
                return contrib.porcentajeTotal;
            })
        );

        setChartData({
            labels: listaContribuyentes.map((contrib) => {
                if (contrib.usuario === null) {
                    return contrib.equipo.nombre;
                } else {
                    return contrib.usuario.nombres;
                }
            }),
            datasets: [
                {
                    label: "% Contribucion",
                    data: listaContribuyentes.map((contrib) => {
                        return contrib.porcentajeTotal;
                    }),
                    backgroundColor: listaContribuyentes.map((contrib) => {
                        return randomHex();
                    }),
                },
            ],
        });

        //get finished tasks / total tasks
        let finishedTasks = 0;
        let totalTasks = 0;
        entregable.tareasEntregable.forEach((tarea) => {
            if (tarea.idTareaEstado === 4) {
                finishedTasks++;
            }
            totalTasks++;
        });
        const finalProgress = (finishedTasks / totalTasks) * 100;
        const formattedProgress =
            typeof finalProgress === "number"
                ? finalProgress.toFixed(2)
                : finalProgress;
        setEntregableProgress(formattedProgress);

        //assign colors
        if(formattedProgress <= 10) setEntregableChipColor("danger");
        if(formattedProgress > 10 && formattedProgress <= 50) setEntregableChipColor("warning");
        if(formattedProgress > 50 && formattedProgress < 100) setEntregableChipColor("primary");
        if(formattedProgress === 100) setEntregableChipColor("success");

        setListContribuyentes(listaContribuyentes);
    }

    function randomHex() {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
}

export default ReporteEntregables;
