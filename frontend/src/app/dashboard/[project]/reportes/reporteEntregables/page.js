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
import CardSelectedUser from "@/components/CardSelectedUser";
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
    const [listUsers, setListUsers] = useState([]);

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
                //setListUsers(response.data.entregables[0].)
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

                            <div className="flex flex-row items-center gap-3 mb-3">
                                <Progress
                                    size="md"
                                    aria-label="Loading..."
                                    value={30}
                                />
                                <p className="text-lg font-semibold tracking-widest text-mainHeaders">
                                    33%
                                </p>
                            </div>

                            <p className="text-gray-400">
                                Descripcion: Lorem ipsum dolor sit amet,
                                consectetur adipiscing elit. Vestibulum eget
                                felis in libero tincidunt vulputate.
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
                                className="w-full h-[30%] p-7 
                                bg-mainBackground rounded-xl 
                                flex justify-center
                                border-[1px] border-[#797979]
                                mb-3
                            "
                            >
                                <CircularProgress
                                    aria-label="circular"
                                    classNames={{
                                        svgWrapper: "h-full w-full",
                                        svg: "transition-all ease-in duration-300 w-full h-full dark:drop-shadow-md",
                                        indicator: "stroke-primary",
                                        track: "transition-all ease-in duration-300 stroke-mainSidebar",
                                        value: "text-3xl font-semibold text-mainHeaders",
                                    }}
                                    value={70}
                                    strokeWidth={4}
                                    showValueLabel={true}
                                />
                            </div>

                            <div
                                className="participantsContainer flex-1 w-full overflow-y-scroll 
                                pr-2 flex flex-col gap-y-2 pb-1
                            "
                            >
                                {listUsers.map((user) => {
                                    return (
                                        <CardSelectedUser
                                            key={user.idUsuario}
                                            isEditable={false}
                                            usuarioObject={user}
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
        //conseguimos a todos los usuarios de las tareas asociadas a este entregable

        //necesitamos un arreglo con todos los usuarios contribuyentes (sumamos a todos los participantes de las tareas sin repetirlos)
        // for (const tarea of entregable.tareasEntregable) {
        //     if (tarea.idEquipo !== null) {
        //         //caso especial
        //     } else {
        //         //caso de usuarios normales
        //         const contribuyentes = new Set();

        //         tasks.forEach((task) => {
        //             task.usuarios.forEach((usuario) => {
        //                 contribuyentes.add(usuario);
        //             });
        //         });

        //         // Convierte el Set de contribuyentes nuevamente a un array
        //         const listaContribuyentes = [...contribuyentes];
        //     }
        // }
        const contribuyentes = [];

        entregable.tareasEntregable.forEach((tarea) => {
            tarea.usuarios = tarea.usuarios.map((usuario) => {
                return {
                    ...usuario,
                    tareasAsignadas: 0,
                };
            });
            console.log("REMMAPEANDO USUARIOS:");
            console.log(tarea.usuarios);

            tarea.usuarios.forEach((usuario) => {
                usuario.tareasAsignadas = usuario.tareasAsignadas + 1;

                let flagHasBeenAdded = 0;
                for(const contribuyente of contribuyentes){
                    if(contribuyente.idUsuario === usuario.idUsuario){
                        flagHasBeenAdded = 1;
                        break;
                    }
                }

                if(flagHasBeenAdded === 0){
                    contribuyentes.push(usuario);
                }
            });
        });

        // //por usuario, scamos el porcentaje de contribucion por tarea * peso de tarea, y al final sumamos todos lesos porcentajes
        const listaContribuyentes = [...contribuyentes];
        for(const usuario of listaContribuyentes){

            let contribPorTarea = 0;
            for(const tarea of entregable.tareasEntregable){
                if(tarea.usuarios.includes(usuario)){
                    contribPorTarea += 1/tarea.usuarios.length * (1/entregable.tareasEntregable.length);
                }
            }
            usuario.porcentajeTotal = contribPorTarea * 100;
        }




        //porcentaje por cada tarea sumado

        console.log(JSON.stringify(listaContribuyentes, null, 2));
        setListUsers(listaContribuyentes);
    }
}

export default ReporteEntregables;
