"use client"
import { useContext, useEffect, useState } from "react";
import HeaderWithButtonsSamePage from "./HeaderWithButtonsSamePage";
import ListEditableInput from "./ListEditableInput";
import ButtonAddNew from "./ButtonAddNew";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDTNew.css";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";

import axios from "axios";
import { Textarea } from "@nextui-org/react";
import { HerramientasInfo } from "@/app/dashboard/[project]/layout";
import { Toaster, toast } from "sonner";
axios.defaults.withCredentials = true;

export default function EDTNewVisualization({
    projectName,
    projectId,
    handlerReturn,
    codeNewComponent,
    idElementoPadre,
}) {
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

    const handleComponentRegister = () => {
        console.log("Procediendo con insertar el componente");
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/EDT/" +
                    projectId +
                    "/insertarComponenteEDT",
                {
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
                }
            )
            .then(function (response) {
                console.log(response);
                console.log(
                    "creo que se inserto tu componente, reza para que todo este en laa bd"
                );

                //cambiamos a la otra paginaa
                handlerReturn();
            })
            .catch(function (error) {
                console.log(error);
            });
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
                console.log("ENTREGABLES => " + JSON.stringify(entregablesArray,null,2));

            })
            .catch(function (error) {
                console.log(error);
            });
    },[]);

    const missingTextMsg = "Este campo no puede estar vacio";

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

            <div className="EDTNewResponsiveContainer text-mainHeaders font-medium">
                <div className="NewEDTSection text-mainHeaders font-medium">
                    <p className="Header text-mainHeaders font-medium">
                        Informacion basica
                    </p>
                    <div className="FirstCardContainer text-mainHeaders font-medium">
                        <div className="FirstLeftCont text-mainHeaders font-medium">
                            <div className="flex flex-row gap-1">
                                <p>Nombre del componente</p>
                                <p className="text-red-500 font-semibold">*</p>
                            </div>
                            {/* <textarea
                                rows="1"
                                id="inputBoxGeneric"
                                placeholder="Escribe aquí"
                                maxLength="70"
                                onChange={(e) => {
                                    setInComponentName(e.target.value);
                                }}
                            /> */}
                            <Textarea
                                isInvalid={!validName}
                                errorMessage={!validName ? missingTextMsg : ""}
                                variant={"bordered"}
                                labelPlacement="outside"
                                placeholder="Escribe aquí"
                                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                value={inComponentName}
                                onValueChange={setInComponentName}
                                minRows={1}
                                size="sm"
                            />
                            {/* <p>Tipo de componente</p>
                            <p>FASE</p> */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <p>Codigo</p>
                                {/* <img
                                    src="/icons/icon-info.svg"
                                    alt="help"
                                ></img> */}
                            </div>
                            <input
                                type="text"
                                value={codeNewComponent}
                                readOnly={true}
                            ></input>
                        </div>
                        <div className="FirstRightCont">
                            <div className="flex flex-row gap-1">
                                <p>Fecha de inicio</p>
                                <p className="text-red-500 font-semibold">*</p>
                            </div>
                            <input
                                type="date"
                                id="inputBoxGeneric"
                                className="EDTNewDatepickerInicio"
                                name="datepicker"
                                onChange={(e) => {
                                    setInFechaInicio(e.target.value);
                                }}
                            ></input>
                            <div className="flex flex-row gap-1">
                                <p>Fecha de fin</p>
                                <p className="text-red-500 font-semibold">*</p>
                            </div>
                            <input
                                type="date"
                                id="inputBoxGeneric"
                                className="EDTNewDatepickerFin"
                                name="datepicker"
                                onChange={(e) => {
                                    setInFechaFin(e.target.value);
                                }}
                            ></input>
                            <p>Responsables</p>
                            <textarea
                                rows="1"
                                id="inputBoxGeneric"
                                placeholder="Escribe aquí"
                                maxLength="70"
                                onChange={(e) => {
                                    setInResponsables(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="NewEDTSection">
                    <p className="Header">Detalles del componente</p>
                    <div className="SecondCardContainer">
                        <p>Descripcion detallada</p>
                        {/* <textarea
                            rows="1"
                            id="inputBoxGeneric"
                            placeholder="Escribe aquí"
                            maxLength="70"
                            onChange={(e) => {
                                setInDescripcion(e.target.value);
                            }}
                        /> */}
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
                        <p>Recursos</p>
                        {/* <textarea
                            rows="1"
                            id="inputBoxGeneric"
                            placeholder="Escribe aquí"
                            maxLength="70"
                            onChange={(e) => {
                                setInRecursos(e.target.value);
                            }}
                        /> */}
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
                        <p>Hito asociado</p>
                        {/* <textarea
                            rows="1"
                            id="inputBoxGeneric"
                            placeholder="Escribe aquí"
                            maxLength="70"
                            onChange={(e) => {
                                setInHito(e.target.value);
                            }}
                        /> */}
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
                        <p>Observaciones</p>
                        {/* <textarea
                            rows="1"
                            id="inputBoxGeneric"
                            placeholder="Escribe aquí"
                            maxLength="70"
                            onChange={(e) => {
                                setInObservaciones(e.target.value);
                            }}
                        /> */}
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

            <div className="EDTNewResponsiveContainer">
                <div className="NewEDTSection">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignContent: "center",
                        }}
                    >
                        <p className="Header">Entregables</p>
                        <button
                            onClick={handleAddEntregable}
                            className="btnEDTAnadir"
                        >
                            Anadir entregable
                        </button>
                    </div>

                    <div className="ThirdCardContainer">
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

                <div className="NewEDTSection">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignContent: "center",
                        }}
                    >
                        <p className="Header">Criterios de aceptacion</p>
                        <button
                            onClick={handleAddCriterio}
                            className="btnEDTAnadir"
                        >
                            Anadir criterio
                        </button>
                    </div>

                    <div className="FourthCardContainer">
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
                    secondAction={() => {
                        handleComponentRegister();
                    }}
                    verifyFunction={() => {
                        if (
                            inComponentName === "" ||
                            inFechaInicio === "" ||
                            inFechaFin === ""
                        ) {
                            toast.error("Faltan completar campos obligatorios");
                            return false;
                        } else {
                            for(const entregable of listEntregables){
                                if(listEntregablesBD.some(entr => entr.nombre?.includes(entregable.data))){
                                    toast.warning("Entregable ya registrado, intenta otro nombre");
                                    return false;
                                }
                            }

                            return true;
                        }
                    }}
                />
            </div>
            <Toaster richColors position="bottom-left" />
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
