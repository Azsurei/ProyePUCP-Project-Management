"use client";
import { useContext, useEffect, useState } from "react";
import HeaderWithButtonsSamePage from "./HeaderWithButtonsSamePage";
import ListEditableInput from "./ListEditableInput";
import ButtonAddNew from "./ButtonAddNew";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDTNew.css";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";

import axios from "axios";
import { Button, Textarea } from "@nextui-org/react";
import { HerramientasInfo } from "@/app/dashboard/[project]/layout";
import { Toaster, toast } from "sonner";
import DateInput from "@/components/DateInput";
axios.defaults.withCredentials = true;

export default function EDTNewVisualization({
    projectName,
    projectId,
    handlerReturn,
    codeNewComponent,
    idElementoPadre,
}) {
    const [screenMode, setScreenMode] = useState(1);
    //1 es visualizacion
    //2 es edicion

    //Variables para input
    const [inComponentName, setInComponentName] = useState("");
    const [validName, setValidName] = useState(true);

    const [inTipoComponente, setInTipoComponente] = useState("");
    const [inCodigoComponente, setInCodigoComponente] =
        useState(codeNewComponent);
    const [inFechaInicio, setInFechaInicio] = useState("");
    const [validFechaInicio, setValidFechaInicio] = useState(true);

    const [inFechaFin, setInFechaFin] = useState("");
    const [validFechaFin, setValidFechaFin] = useState(true);

    const [inResponsables, setInResponsables] = useState("");
    const [validResponsables, setValidResponsables] = useState(true);

    const [inDescripcion, setInDescripcion] = useState("");
    const [validDescripcion, setValidDescripcion] = useState(true);

    const [inRecursos, setInRecursos] = useState("");
    const [validRecursos, setValidRecursos] = useState(true);

    const [inHito, setInHito] = useState("");
    const [validHito, setValidHito] = useState(true);

    const [inObservaciones, setInObservaciones] = useState("");
    const [validObservaciones, setValidObservaciones] = useState(true);

    const [listEntregables, setListEntregables] = useState([
        { index: 1, data: "" },
    ]);
    const [listCriterios, setListCriterios] = useState([
        { index: 1, data: "" },
    ]);

    const [isRegistering, setIsRegistering] = useState(false);

    const [datosComponente, setDatosComponente] = useState(null);

    const handleChangeTipoComponente = (e) => {
        //tengo que investigar como se hace en un combo box
    };

    const handleChangeFechaInicio = () => {
        const datepickerInput = document.getElementsByClassName(
            "EDTNewDatepickerInicio"
        );
        const selectedDate = datepickerInput.value;
        setInFechaInicio(selectedDate);
    };

    const handleChangeFechaFin = () => {
        const datepickerInputF = document.getElementsByClassName(
            "EDTNewDatepickerFin"
        );
        const selectedDateF = datepickerInputF.value;
        setInFechaFin(selectedDateF);
    };

    const printAllVariables = () => {
        console.log(inComponentName);
        console.log(inFechaInicio);
        console.log(inFechaFin);
        console.log(inDescripcion);
        console.log(inRecursos);
        console.log(inHito);
        console.log(inObservaciones);
    };

    const handleAddEntregable = () => {
        const newList = [
            ...listEntregables,
            {
                index: listEntregables.length + 1,
                data: "",
            },
        ];
        setListEntregables(newList);
    };

    const handleAddCriterio = () => {
        const newLista = [
            ...listCriterios,
            {
                index: listCriterios.length + 1,
                data: "",
            },
        ];
        setListCriterios(newLista);
    };

    const handleChangeEntregable = (e, index) => {
        const updatedEntregables = [...listEntregables];
        updatedEntregables[index - 1].data = e.target.value;
        console.log(updatedEntregables);
        setListEntregables(updatedEntregables);
    };

    const handleRemoveEntregable = (index) => {
        const updatedEntregables = [...listEntregables];
        updatedEntregables.splice(index - 1, 1); // Remove the element at the given index
        for (let i = index - 1; i < updatedEntregables.length; i++) {
            updatedEntregables[i].index = updatedEntregables[i].index - 1;
        }
        console.log(updatedEntregables);
        setListEntregables(updatedEntregables);
    };

    const handleChangeCriterio = (e, index) => {
        const updatedCriterios = [...listCriterios];
        updatedCriterios[index - 1].data = e.target.value;
        console.log(updatedCriterios);
        setListCriterios(updatedCriterios);
    };

    const handleRemoveCriterio = (index) => {
        const updatedCriterios = [...listCriterios];
        updatedCriterios.splice(index - 1, 1); // Remove the element at the given index
        for (let i = index - 1; i < updatedCriterios.length; i++) {
            updatedCriterios[i].index = updatedCriterios[i].index - 1;
        }
        console.log(updatedCriterios);
        setListCriterios(updatedCriterios);
    };

    const axiosOptions = {
        method: "post", // El método de solicitud puede variar según tus necesidades
        url:
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/" +
            projectId +
            "/insertarComponenteEDT",
        headers: {
            "Content-Type": "application/json",
        },
        // Otros parámetros de la solicitud, como los datos JSON, deben agregarse aquí
    };

    const handleComponentRegister = async () => {
        setIsRegistering(true);
        console.log("Procediendo con insertar el componente");

        const registerURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/EDT/" +
            projectId +
            "/insertarComponenteEDT";

        const objToSend = {
            idElementoPadre: idElementoPadre,
            idProyecto: projectId,
            descripcion: inDescripcion,
            codigo: inCodigoComponente,
            observaciones: inObservaciones,
            nombre: inComponentName,
            responsables: inResponsables,
            fechaInicio: inFechaInicio,
            fechaFin: inFechaFin,
            recursos: inRecursos,
            hito: inHito,
            criterioAceptacion: listCriterios,
            entregables: listEntregables,
        };

        try {
            const response = await axios.post(registerURL, objToSend);

            console.log(response);
            toast.success("Componente registrado con exito");

            //cambiamos a la otra paginaa
            setIsRegistering(false);
            handlerReturn();
        } catch (e) {
            console.log(e);
            toast.error("Error al registrar componente");
            setIsRegistering(false);
            handlerReturn();
        }
    };

    const [listEntregablesBD, setListEntregablesBD] = useState([]);

    useEffect(() => {
        const entregablesURL =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/api/proyecto/cronograma/listarEntregablesXidProyecto/" +
            projectId;
        axios
            .get(entregablesURL)
            .then(function (response) {
                console.log(response);
                console.log("Respuesta conseguida");
                const entregablesArray = response.data.entregables.map(
                    (entregable) => {
                        return {
                            ...entregable,
                            idEntregableString:
                                entregable.idEntregable.toString(),
                        };
                    }
                );

                setListEntregablesBD(entregablesArray);
                console.log(
                    "ENTREGABLES => " +
                        JSON.stringify(entregablesArray, null, 2)
                );
            })
            .catch(function (error) {
                console.log(error);
            });

        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // console.log("Procediendo sacar informacion del componente");
        // axios
        //     .post(
        //         process.env.NEXT_PUBLIC_BACKEND_URL +
        //             "/api/proyecto/EDT/verInfoComponenteEDT",
        //         {
        //             idComponente: idComponentToSee,
        //         }
        //     )
        //     .then(function (response) {
        //         console.log(response);

        //         const { component, criteriosAceptacion, entregables } =
        //             response.data.componenteEDT;

        //         setInComponentName(component.nombre);
        //         setInCodigoComponente(component.codigo);

        //         if (component.fechaInicio !== null) {
        //             const dateObject = new Date(component.fechaInicio);
        //             const dateString = dateObject.toLocaleDateString();
        //             const parts = dateString.split("/");
        //             if (parts[0].length === 1) {
        //                 parts[0] = "0" + parts[0];
        //             }
        //             const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        //             console.log("NUEVA FECHA INICIO:" + formattedDate);
        //             setInFechaInicio(formattedDate);
        //         } else {
        //             setInFechaInicio("");
        //         }
        //         if (component.fechaFin !== null) {
        //             const dateObject1 = new Date(component.fechaFin);
        //             const dateString1 = dateObject1.toLocaleDateString();
        //             const parts1 = dateString1.split("/");
        //             if (parts1[0].length === 1) {
        //                 parts1[0] = "0" + parts1[0];
        //             }
        //             const formattedDate1 = `${parts1[2]}-${parts1[1]}-${parts1[0]}`;
        //             console.log("NUEVA FECHA FIN:" + formattedDate1);
        //             setInFechaFin(formattedDate1);
        //         } else {
        //             setInFechaFin("");
        //         }

        //         setInResponsables(component.responsables);
        //         setInDescripcion(component.descripcion);
        //         setInRecursos(component.recursos);
        //         setInHito(component.hito);
        //         setInObservaciones(component.observaciones);

        //         setBaseComponentData(component);

        //         setListEntregables(
        //             entregables.map((component, index) => {
        //                 return {
        //                     index: index + 1,
        //                     data: component.nombre,
        //                 };
        //             })
        //         );

        //         setListCriterios(
        //             criteriosAceptacion.map((component, index) => {
        //                 return {
        //                     index: index + 1,
        //                     data: component.descripcion,
        //                 };
        //             })
        //         );

        //         console.log(
        //             "haz conseguido la informacion de dicho componente con exito"
        //         );

        //         //setIsLoadingSmall(false);
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
    }, []);

    const missingTextMsg = "Este campo no puede estar vacio";
    const twTitle = "text-mainHeaders text-xl font-semibold";
    const twSubtitle = "text-mainHeaders font-medium ";

    return (
        <div className="EDTNew">
            <HeaderWithButtonsSamePage
                haveReturn={true}
                haveAddNew={false}
                handlerReturn={handlerReturn}
                breadcrump={
                    "Inicio / Proyectos / " +
                    projectName +
                    " / EDT y Diccionario EDT"
                }
                btnText={"Agregar elemento"}
            >
                Crear nuevo componente
            </HeaderWithButtonsSamePage>

            <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                    <p className={twTitle}>Informacion basica</p>
                    <div className="px-4 py-2">
                        <div className="flex flex-row gap-5">
                            <div className="flex flex-col max-w-[80px]">
                                <p className={twSubtitle}>Codigo</p>
                                <Textarea
                                    readOnly={true}
                                    variant={"flat"}
                                    labelPlacement="outside"
                                    placeholder=""
                                    className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                    value={codeNewComponent}
                                    minRows={1}
                                    size="sm"
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <div className="flex flex-row gap-1">
                                    <p className={twSubtitle}>
                                        Nombre del componente
                                    </p>
                                    <p className="text-red-500 font-semibold">
                                        *
                                    </p>
                                </div>
                                <Textarea
                                    isInvalid={!validName}
                                    errorMessage={
                                        !validName ? missingTextMsg : ""
                                    }
                                    variant={"bordered"}
                                    labelPlacement="outside"
                                    placeholder="Escribe aquí"
                                    className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                    value={inComponentName}
                                    onValueChange={setInComponentName}
                                    minRows={1}
                                    size="sm"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-3">
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-1">
                                    <p className={twSubtitle}>
                                        Fecha de inicio
                                    </p>
                                    <p className="text-red-500 font-semibold">
                                        *
                                    </p>
                                </div>
                                <DateInput
                                    //value={fechaInicio}
                                    isEditable={true}
                                    className={""}
                                    isInvalid={false}
                                    onChangeHandler={(e) => {
                                        setInFechaInicio(e.target.value);
                                    }}
                                ></DateInput>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-1">
                                    <p className={twSubtitle}>Fecha de fin</p>
                                    <p className="text-red-500 font-semibold">
                                        *
                                    </p>
                                </div>
                                <DateInput
                                    //value={fechaInicio}
                                    isEditable={true}
                                    className={""}
                                    isInvalid={false}
                                    onChangeHandler={(e) => {
                                        setInFechaFin(e.target.value);
                                    }}
                                ></DateInput>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className={twSubtitle}>Responsables</p>
                            <Textarea
                                variant="bordered"
                                minRows={1}
                                placeholder="Escribe aquí"
                                onChange={(e) => {
                                    setInResponsables(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <p className={twTitle}>Detalles del componente</p>
                    <div className="px-4 py-2">
                        <div className="flex flex-col">
                            <p className={twSubtitle}>Descripcion detallada</p>
                            <Textarea
                                variant={"bordered"}
                                labelPlacement="outside"
                                placeholder="Escribe aquí"
                                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                value={inDescripcion}
                                onValueChange={setInDescripcion}
                                minRows={1}
                                size="sm"
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className={twSubtitle}>Recursos</p>
                            <Textarea
                                variant={"bordered"}
                                labelPlacement="outside"
                                placeholder="Escribe aquí"
                                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                value={inRecursos}
                                onValueChange={setInRecursos}
                                minRows={1}
                                size="sm"
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className={twSubtitle}>Hito asociado</p>
                            <Textarea
                                variant={"bordered"}
                                labelPlacement="outside"
                                placeholder="Escribe aquí"
                                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                value={inHito}
                                onValueChange={setInHito}
                                minRows={1}
                                size="sm"
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className={twSubtitle}>Observaciones</p>
                            <Textarea
                                variant={"bordered"}
                                labelPlacement="outside"
                                placeholder="Escribe aquí"
                                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                value={inObservaciones}
                                onValueChange={setInObservaciones}
                                minRows={1}
                                size="sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-row gap-2 items-center">
                        <p className={twTitle}>Entregables</p>
                        <Button
                            className="bg-F0AE19 text-white font-semibold"
                            onClick={handleAddEntregable}
                            size="sm"
                        >
                            Anadir entregable
                        </Button>
                    </div>

                    <div className="px-4 py-2">
                        <ListEditableInput
                            ListInputs={listEntregables}
                            typeName="Entregable"
                            typeFault="entregables"
                            handleChanges={handleChangeEntregable}
                            handleRemove={handleRemoveEntregable}
                            beEditable={true}
                        ></ListEditableInput>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-row gap-2 items-center">
                        <p className={twTitle}>Criterios de aceptacion</p>
                        <Button
                            className="bg-F0AE19 text-white font-semibold"
                            size="sm"
                            onClick={handleAddCriterio}
                        >
                            Anadir criterio
                        </Button>
                    </div>

                    <div className="px-4 py-2">
                        <ListEditableInput
                            ListInputs={listCriterios}
                            typeName="Criterio"
                            typeFault="criterios"
                            handleChanges={handleChangeCriterio}
                            handleRemove={handleRemoveCriterio}
                            beEditable={true}
                        ></ListEditableInput>
                    </div>
                </div>
            </div>

            <div>
                xd
            </div>
            
            <div className="twoButtons">
                <Modal
                    nameButton="Descartar"
                    textHeader="Descartar Registro"
                    textBody="¿Seguro que quiere descartar el registro de el componente EDT?"
                    colorButton="w-36 bg-slate-100 text-black"
                    oneButton={false}
                    secondAction={handlerReturn}
                />
                <Modal
                    nameButton="Aceptar"
                    textHeader="Registrar Componente"
                    textBody="¿Seguro que quiere desea registrar el componente?"
                    colorButton="w-36 bg-blue-950 text-white"
                    oneButton={false}
                    isLoading={isRegistering}
                    secondAction={async () => {
                        await handleComponentRegister();
                    }}
                    closeSecondActionState={true}
                    verifyFunction={() => {
                        if (
                            inComponentName === "" ||
                            inFechaInicio === "" ||
                            inFechaFin === ""
                        ) {
                            toast.error("Faltan completar campos obligatorios");
                            return false;
                        } else {
                            for (const entregable of listEntregables) {
                                if (
                                    entregable.data !== "" &&
                                    listEntregablesBD.some((entr) =>
                                        entr.nombre?.includes(entregable.data)
                                    )
                                ) {
                                    toast.warning(
                                        "Entregable ya registrado, intenta otro nombre"
                                    );
                                    return false;
                                }
                            }

                            return true;
                        }
                    }}
                />
            </div>

            
        </div>
    );

    function registerComponent() {
        const { herramientasInfo } = useContext(HerramientasInfo);
        //verificamos si entregable no se repite en proyecto
        for (const entregable of listEntregables) {
            const objToSend = {
                idEDT: herramientasInfo.find(
                    (tool) => (tool.idHerramienta = 2)
                ),
                nombreEntregable: entregable.data,
            };

            axios.post(link);
        }
    }
}
