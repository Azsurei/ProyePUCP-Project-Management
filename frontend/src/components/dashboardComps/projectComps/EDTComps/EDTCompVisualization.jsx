import { useContext, useEffect, useState } from "react";
import HeaderWithButtonsSamePage from "./HeaderWithButtonsSamePage";
import ListEditableInput from "./ListEditableInput";
import ButtonAddNew from "./ButtonAddNew";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDTCompVisualization.css";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";

import axios from "axios";
import { Textarea } from "@nextui-org/react";
import { SmallLoadingScreen } from "@/app/dashboard/[project]/layout";
axios.defaults.withCredentials = true;

export default function EDTCompVisualization({
    projectName,
    projectId,
    handlerReturn,
    idComponentToSee,
}) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);

    const [estadoEditar, setEstadoEditar] = useState(false);
    const [baseComponentDate, setBaseComponentData] = useState(null);
    //Variables para input
    const [inComponentName, setInComponentName] = useState("");
    const [inTipoComponente, setInTipoComponente] = useState("");
    const [inCodigoComponente, setInCodigoComponente] = useState("");
    const [inFechaInicio, setInFechaInicio] = useState("");
    const [inFechaFin, setInFechaFin] = useState("");
    const [inResponsables, setInResponsables] = useState("");
    const [inDescripcion, setInDescripcion] = useState("");
    const [inRecursos, setInRecursos] = useState("");
    const [inHito, setInHito] = useState("");
    const [inObservaciones, setInObservaciones] = useState("");

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

    const handleCancelEdit = () => {
        setEstadoEditar(!estadoEditar);
        handlerReturn();
    };

    const handleUpdateComp = () => {
        //imprimimos las variables para testear que se guardo todo
        console.log("NUEVAS VARIABLES =========");
        console.log(idComponentToSee);
        console.log(inDescripcion);
        console.log(inCodigoComponente);
        console.log(inObservaciones);
        console.log(inComponentName);
        console.log(inResponsables);
        console.log(inFechaInicio);
        console.log(inFechaFin);
        console.log(inRecursos);
        console.log(inHito);

        //idComponenteEDT, descripcion, codigo, observaciones, nombre, responsables,
        //fechaInicio, fechaFin, recursos, hito

        console.log(
            "Procediendo a actualizar datos del componenteEDT de id = " +
                idComponentToSee
        );
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/EDT/modificarComponenteEDT",
                {
                    idComponenteEDT: idComponentToSee,
                    descripcion: inDescripcion,
                    codigo: inCodigoComponente,
                    observaciones: inObservaciones,
                    nombre: inComponentName,
                    responsables: inResponsables,
                    fechaInicio: inFechaInicio,
                    fechaFin: inFechaFin,
                    recursos: inRecursos,
                    hito: inHito,
                }
            )
            .then(function (response) {
                console.log(response);

                handlerReturn();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(() => {
        //setIsLoadingSmall(true);
        console.log("Procediendo sacar informacion del componente");
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/EDT/verInfoComponenteEDT",
                {
                    idComponente: idComponentToSee,
                }
            )
            .then(function (response) {
                console.log(response);

                const { component, criteriosAceptacion, entregables } =
                    response.data.componenteEDT;

                setInComponentName(component.nombre);
                setInCodigoComponente(component.codigo);

                if (component.fechaInicio !== null) {
                    const dateObject = new Date(component.fechaInicio);
                    const dateString = dateObject.toLocaleDateString();
                    const parts = dateString.split("/");
                    if (parts[0].length === 1) {
                        parts[0] = "0" + parts[0];
                    }
                    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    console.log("NUEVA FECHA INICIO:" + formattedDate);
                    setInFechaInicio(formattedDate);
                } else {
                    setInFechaInicio("");
                }
                if (component.fechaFin !== null) {
                    const dateObject1 = new Date(component.fechaFin);
                    const dateString1 = dateObject1.toLocaleDateString();
                    const parts1 = dateString1.split("/");
                    if (parts1[0].length === 1) {
                        parts1[0] = "0" + parts1[0];
                    }
                    const formattedDate1 = `${parts1[2]}-${parts1[1]}-${parts1[0]}`;
                    console.log("NUEVA FECHA FIN:" + formattedDate1);
                    setInFechaFin(formattedDate1);
                } else {
                    setInFechaFin("");
                }

                setInResponsables(component.responsables);
                setInDescripcion(component.descripcion);
                setInRecursos(component.recursos);
                setInHito(component.hito);
                setInObservaciones(component.observaciones);

                setBaseComponentData(component);

                setListEntregables(
                    entregables.map((component, index) => {
                        return {
                            index: index + 1,
                            data: component.nombre,
                        };
                    })
                );

                setListCriterios(
                    criteriosAceptacion.map((component, index) => {
                        return {
                            index: index + 1,
                            data: component.descripcion,
                        };
                    })
                );

                console.log(
                    "haz conseguido la informacion de dicho componente con exito"
                );

                //setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    return (
        <div className="EDTNew">
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                }}
            >
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
                    Ver detalles de componente
                </HeaderWithButtonsSamePage>
                {!estadoEditar && (
                    <div
                        className="btnEditarComp"
                        onClick={() => {
                            setEstadoEditar(!estadoEditar);
                        }}
                    >
                        <img
                            src="/icons/icon-edit.svg"
                            alt="help"
                            className=""
                        />
                        <p>Editar</p>
                    </div>
                )}
            </div>

            <div className="EDTNewResponsiveContainer">
                <div className="NewEDTSection">
                    <p className="Header">Informacion basica</p>
                    <div className="FirstCardContainer">
                        <div className="FirstLeftCont">
                            <p>Nombre del componente</p>
                            {/* <textarea
                                rows="1"
                                className={
                                    estadoEditar
                                        ? "inputBoxGeneric editable"
                                        : "inputBoxGeneric nonEditable"
                                }
                                readOnly={!estadoEditar}
                                placeholder="Escribe aquí"
                                maxLength="70"
                                onChange={(e) => {
                                    setInComponentName(e.target.value);
                                }}
                                value={inComponentName}
                            /> */}
                            <Textarea
                                variant={"bordered"}
                                labelPlacement="outside"
                                placeholder="Escribe aquí"
                                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                value={inComponentName}
                                onValueChange={setInComponentName}
                                minRows={1}
                                size="sm"
                                readOnly={!estadoEditar}
                            />
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
                            {/* <textarea
                                rows="1"
                                className="inputBoxGeneric nonEditable"
                                readOnly={true}
                                value={inCodigoComponente}
                            ></textarea> */}
                            <Textarea
                                variant={"bordered"}
                                labelPlacement="outside"
                                placeholder="Escribe aquí"
                                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                value={inCodigoComponente}
                                minRows={1}
                                size="sm"
                                readOnly={true}
                            />
                        </div>
                        <div className="FirstRightCont">
                            <p>Fecha de inicio</p>
                            <input
                                type="date"
                                className={
                                    estadoEditar
                                        ? "inputBoxGeneric editable"
                                        : "inputBoxGeneric nonEditable"
                                }
                                readOnly={!estadoEditar}
                                name="datepicker"
                                onChange={(e) => {
                                    setInFechaInicio(e.target.value);
                                }}
                                value={inFechaInicio}
                            ></input>
                            <p>Fecha de fin</p>
                            <input
                                type="date"
                                className={
                                    estadoEditar
                                        ? "inputBoxGeneric editable"
                                        : "inputBoxGeneric nonEditable"
                                }
                                readOnly={!estadoEditar}
                                name="datepicker"
                                onChange={(e) => {
                                    setInFechaFin(e.target.value);
                                }}
                                value={inFechaFin}
                            ></input>
                            <p>Responsables</p>
                            {/* <textarea
                                rows="1"
                                className={
                                    estadoEditar
                                        ? "inputBoxGeneric editable"
                                        : "inputBoxGeneric nonEditable"
                                }
                                readOnly={!estadoEditar}
                                placeholder="Escribe aquí"
                                maxLength="70"
                                onChange={(e) => {
                                    setInResponsables(e.target.value);
                                }}
                                value={inResponsables}
                            /> */}
                            <Textarea
                                variant={"bordered"}
                                labelPlacement="outside"
                                placeholder="Escribe aquí"
                                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                value={inResponsables}
                                onValueChange={setInResponsables}
                                minRows={1}
                                size="sm"
                                readOnly={!estadoEditar}
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
                            className={
                                estadoEditar
                                    ? "inputBoxGeneric editable"
                                    : "inputBoxGeneric nonEditable"
                            }
                            readOnly={!estadoEditar}
                            placeholder="Escribe aquí"
                            maxLength="70"
                            onChange={(e) => {
                                setInDescripcion(e.target.value);
                            }}
                            value={inDescripcion}
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
                            readOnly={!estadoEditar}
                        />
                        <p>Recursos</p>
                        {/* <textarea
                            rows="1"
                            className={
                                estadoEditar
                                    ? "inputBoxGeneric editable"
                                    : "inputBoxGeneric nonEditable"
                            }
                            readOnly={!estadoEditar}
                            placeholder="Escribe aquí"
                            maxLength="70"
                            onChange={(e) => {
                                setInRecursos(e.target.value);
                            }}
                            value={inRecursos}
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
                            readOnly={!estadoEditar}
                        />
                        <p>Hito asociado</p>
                        {/* <textarea
                            rows="1"
                            className={
                                estadoEditar
                                    ? "inputBoxGeneric editable"
                                    : "inputBoxGeneric nonEditable"
                            }
                            readOnly={!estadoEditar}
                            placeholder="Escribe aquí"
                            maxLength="70"
                            onChange={(e) => {
                                setInHito(e.target.value);
                            }}
                            value={inHito}
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
                            readOnly={!estadoEditar}
                        />
                        <p>Observaciones</p>
                        {/* <textarea
                            rows="1"
                            className={
                                estadoEditar
                                    ? "inputBoxGeneric editable"
                                    : "inputBoxGeneric nonEditable"
                            }
                            readOnly={!estadoEditar}
                            placeholder="Escribe aquí"
                            maxLength="70"
                            onChange={(e) => {
                                setInObservaciones(e.target.value);
                            }}
                            value={inObservaciones}
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
                            readOnly={!estadoEditar}
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
                        {/* <button
                            onClick={handleAddEntregable}
                            className="btnEDTAnadir"
                        >
                            Anadir entregable
                        </button> */}
                    </div>

                    <div className="ThirdCardContainer">
                        <ListEditableInput
                            ListInputs={listEntregables}
                            typeName="Entregable"
                            typeFault="entregables"
                            handleChanges={handleChangeEntregable}
                            handleRemove={handleRemoveEntregable}
                            beEditable={false}
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
                        {/* <button
                            onClick={handleAddCriterio}
                            className="btnEDTAnadir"
                        >
                            Anadir criterio
                        </button> */}
                    </div>

                    <div className="FourthCardContainer">
                        <ListEditableInput
                            ListInputs={listCriterios}
                            typeName="Criterio"
                            typeFault="criterios"
                            handleChanges={handleChangeCriterio}
                            handleRemove={handleRemoveCriterio}
                            beEditable={false}
                        ></ListEditableInput>
                    </div>
                </div>
            </div>

            {estadoEditar && (
                <div className="twoButtons">
                    <Modal
                        nameButton="Descartar"
                        textHeader="Descartar Actualizacion"
                        textBody="¿Seguro que quiere descartarla actualización de el componente EDT?"
                        colorButton="w-36 bg-slate-100 text-black"
                        oneButton={false}
                        secondAction={() => {
                            handleCancelEdit();
                        }}
                        textColor="red"
                    />
                    <Modal
                        nameButton="Actualizar"
                        textHeader="Actualizar Componente"
                        textBody="¿Seguro que quiere desea actualizar este componente?"
                        colorButton="w-36 bg-blue-950 text-white"
                        oneButton={false}
                        secondAction={() => {
                            handleUpdateComp();
                        }}
                        textColor="blue"
                    />
                </div>
            )}
        </div>
    );
}
