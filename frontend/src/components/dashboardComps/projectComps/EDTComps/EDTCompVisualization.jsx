import { useContext, useEffect, useState } from "react";
import HeaderWithButtonsSamePage from "./HeaderWithButtonsSamePage";
import ListEditableInput from "./ListEditableInput";
import ButtonAddNew from "./ButtonAddNew";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDTCompVisualization.css";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";

import axios from "axios";
import { Button, Textarea } from "@nextui-org/react";
import { SmallLoadingScreen } from "@/app/dashboard/[project]/layout";
import DateInput from "@/components/DateInput";
import { v4 } from "uuid";
import ListEditableInputV4 from "./ListEditableInputV4";
import TemplatesAdditionalFields from "@/components/TemplatesAdditionalFields";
import ListAdditionalFields from "@/components/ListAdditionalFields";
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
    const [stateSecond, setStateSecond] = useState(0);
    const [taskAdditionalFields, setTaskAdditionalFields] = useState([]);
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


    const [listEntregablesOld, setListEntregablesOld] = useState([]);
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
                idComponente: idComponentToSee,
                idEntregable: v4(),
                //index: listEntregables.length + 1,
                //: "",
                nombre: "",
                activo: 1,
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

    const handleChangeEntregable = (e, id) => {
        const updatedEntregables = [...listEntregables];
        updatedEntregables.find((item) => item.index === id).nombre = e.target.value;
        console.log(updatedEntregables);
        setListEntregables(updatedEntregables);
    };

    const handleRemoveEntregable = (index) => {
        const updatedEntregables = [...listEntregables];
        updatedEntregables.filter((item) => item.index !== index);
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
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/EDT/modificarComponenteEDT",
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
        setIsLoadingSmall(true);
        console.log("Procediendo sacar informacion del componente");
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/EDT/verInfoComponenteEDT",
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

                setIsLoadingSmall(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const twTitle = "text-mainHeaders text-xl font-semibold";
    const twSubtitle = "text-mainHeaders font-medium ";

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
                                    className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                    value={inCodigoComponente}
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
                                    variant={estadoEditar ? "bordered" : "flat"}
                                    labelPlacement="outside"
                                    placeholder="Escribe aquí"
                                    className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                    value={inComponentName}
                                    onValueChange={setInComponentName}
                                    minRows={1}
                                    size="sm"
                                    readOnly={!estadoEditar}
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
                                    isEditable={estadoEditar}
                                    className={""}
                                    isInvalid={false}
                                    value={inFechaInicio}
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
                                    isEditable={estadoEditar}
                                    className={""}
                                    isInvalid={false}
                                    value={inFechaFin}
                                    onChangeHandler={(e) => {
                                        setInFechaFin(e.target.value);
                                    }}
                                ></DateInput>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className={twSubtitle}>Responsables</p>
                            <Textarea
                                variant={estadoEditar ? "bordered" : "flat"}
                                labelPlacement="outside"
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

                <div className="flex flex-col">
                    <p className={twTitle}>Detalles del componente</p>
                    <div className="px-4 py-2">
                        <div className="flex flex-col">
                            <p className={twSubtitle}>Descripcion detallada</p>
                            <Textarea
                                variant={estadoEditar ? "bordered" : "flat"}
                                labelPlacement="outside"
                                placeholder="Escribe aquí"
                                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                value={inDescripcion}
                                onValueChange={setInDescripcion}
                                minRows={1}
                                size="sm"
                                readOnly={!estadoEditar}
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className={twSubtitle}>Recursos</p>
                            <Textarea
                                variant={estadoEditar ? "bordered" : "flat"}
                                labelPlacement="outside"
                                placeholder="Escribe aquí"
                                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                value={inRecursos}
                                onValueChange={setInRecursos}
                                minRows={1}
                                size="sm"
                                readOnly={!estadoEditar}
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className={twSubtitle}>Hito asociado</p>
                            <Textarea
                                variant={estadoEditar ? "bordered" : "flat"}
                                labelPlacement="outside"
                                placeholder="Escribe aquí"
                                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                                value={inHito}
                                onValueChange={setInHito}
                                minRows={1}
                                size="sm"
                                readOnly={!estadoEditar}
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className={twSubtitle}>Observaciones</p>
                            <Textarea
                                variant={estadoEditar ? "bordered" : "flat"}
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

                <div className="flex flex-col">
                    <div className="flex flex-row gap-2 items-center">
                        <p className={twTitle}>Entregables</p>
                        {estadoEditar === true ? (
                            <Button
                                className="bg-F0AE19 text-white font-semibold"
                                onClick={handleAddEntregable}
                                size="sm"
                            >
                                Anadir entregable
                            </Button>
                        ) : null}
                    </div>

                    <div className="px-4 py-2">
                        <ListEditableInputV4
                            ListInputs={listEntregables}
                            typeName="Entregable"
                            typeFault="entregables"
                            handleChanges={handleChangeEntregable}
                            handleRemove={handleRemoveEntregable}
                            beEditable={estadoEditar}
                        ></ListEditableInputV4>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-row gap-2 items-center">
                        <p className={twTitle}>Criterios de aceptacion</p>
                        {estadoEditar === true ? (
                            <Button
                                className="bg-F0AE19 text-white font-semibold"
                                onClick={handleAddCriterio}
                                size="sm"
                            >
                                Anadir entregable
                            </Button>
                        ) : null}
                    </div>

                    <div className="px-4 py-2">
                        <ListEditableInputV4
                            ListInputs={listCriterios}
                            typeName="Criterio"
                            typeFault="criterios"
                            handleChanges={handleChangeCriterio}
                            handleRemove={handleRemoveCriterio}
                            beEditable={estadoEditar}
                        ></ListEditableInputV4>
                    </div>
                    <div className="flex flex-row items-center gap-6 mt-5">
                <p className="font-semibold text-xl">
                    Campos adicionales
                </p>
                    {
                        estadoEditar && (
                            <TemplatesAdditionalFields
                            editState={stateSecond !== 2}
                            baseFields={taskAdditionalFields}
                            setBaseFields={setTaskAdditionalFields}
                        />
                        )
                    }
 
            </div>
            <ListAdditionalFields
                                editState={stateSecond !== 2}
                                baseFields={taskAdditionalFields}
                                setBaseFields={setTaskAdditionalFields}
                            />
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
