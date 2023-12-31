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
import ListAdditionalFields, { AsyncRegisterAdditionalFields, getAdditionalFields } from "@/components/ListAdditionalFields";
import ListEditableInputV4Crit from "./ListEditableInputV4Crit";
import { dbDateToInputDate } from "@/common/dateFunctions";
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
    const [listEntregables, setListEntregables] = useState([]);
    const [listCriterios, setListCriterios] = useState([]);

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
                //index: listCriterios.length + 1,
                //data: "",
                idComponenteEDT: idComponentToSee,
                idComponenteCriterioDeAceptacion: v4(),
                descripcion: "",
                activo: 1,
            },
        ];
        setListCriterios(newLista);
    };

    const handleChangeEntregable = (e, id) => {
        const updatedEntregables = [...listEntregables];
        updatedEntregables.find((item) => item.idEntregable === id).nombre =
            e.target.value;
        console.log(updatedEntregables);
        setListEntregables(updatedEntregables);
    };

    const handleRemoveEntregable = (id) => {
        const updatedEntregables = [...listEntregables];
        const newUpdated = updatedEntregables.filter(
            (item) => item.idEntregable.toString() !== id.toString()
        );
        console.log(newUpdated);
        setListEntregables(newUpdated);
    };

    const handleChangeCriterio = (e, id) => {
        const updatedCriterios = [...listCriterios];
        updatedCriterios.find(
            (item) => item.idComponenteCriterioDeAceptacion === id
        ).descripcion = e.target.value;
        console.log(updatedCriterios);
        setListCriterios(updatedCriterios);
    };

    const handleRemoveCriterio = (id) => {
        const updatedCriterios = [...listCriterios];
        const newUpdated = updatedCriterios.filter(
            (item) =>
                item.idComponenteCriterioDeAceptacion.toString() !==
                id.toString()
        );
        console.log(newUpdated);
        setListCriterios(updatedCriterios);
    };

    const handleCancelEdit = () => {
        setEstadoEditar(!estadoEditar);
        handlerReturn();
    };

    const findModifiedDeletedAdded = (
        originalArray,
        newArray,
        comparisonField
    ) => {
        const modifiedArray = [];
        const deletedArray = [];
        const addedArray = [];

        // Encuentra elementos modificados y eliminados
        originalArray.forEach((originalItem) => {
            const newItem = newArray.find(
                (newItem) =>
                    newItem[comparisonField] === originalItem[comparisonField]
            );

            if (newItem) {
                modifiedArray.push(newItem);
                /*                 if (JSON.stringify(originalItem) !== JSON.stringify(newItem)) {
                    modifiedArray.push(newItem);
                } */
            } else {
                deletedArray.push(originalItem);
            }
        });

        // Encuentra elementos añadidos
        newArray.forEach((newItem) => {
            if (
                !originalArray.some(
                    (originalItem) =>
                        originalItem[comparisonField] ===
                        newItem[comparisonField]
                )
            ) {
                addedArray.push(newItem);
            }
        });

        return { modifiedArray, deletedArray, addedArray };
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

        const { modifiedArray, deletedArray, addedArray } =
            findModifiedDeletedAdded(
                listEntregablesOld,
                listEntregables,
                "idEntregable"
            );
        console.log("MODIFIED  ");
        console.log(modifiedArray);
        console.log(" DELETED ");
        console.log(deletedArray);
        console.log(" ADDED");
        console.log(addedArray);
        console.log(
            "Procediendo a actualizar datos del componenteEDT de id = " +
                idComponentToSee
        );
        // axios
        //     .post(
        //         process.env.NEXT_PUBLIC_BACKEND_URL +
        //             "/api/proyecto/EDT/modificarComponenteEDT",
        //         {
        //             idComponenteEDT: idComponentToSee,
        //             descripcion: inDescripcion,
        //             codigo: inCodigoComponente,
        //             observaciones: inObservaciones,
        //             nombre: inComponentName,
        //             responsables: inResponsables,
        //             fechaInicio: inFechaInicio,
        //             fechaFin: inFechaFin,
        //             recursos: inRecursos,
        //             hito: inHito,
        //         }
        //     )
        //     .then(function (response) {
        //         console.log(response);

        //         handlerReturn();
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     });
    };

    const [isRegistering, setIsRegistering] = useState(false);
    async function testAsync() {
        try {
            setIsRegistering(true);

            const url =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/EDT/modificarComponenteEDT";

            const objToSend = {
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
                criterioAceptacion: listCriterios,
            };

            const response = await axios.post(url, objToSend);

            console.log(response);

            const urlInsert =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/EDT/insertarEntregables";

            const urlModify =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/EDT/modificarEntregables";

            const urlDelete =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/api/proyecto/EDT/eliminarEntregables";

            const { modifiedArray, deletedArray, addedArray } =
                findModifiedDeletedAdded(
                    listEntregablesOld,
                    listEntregables,
                    "idEntregable"
                );

            const responseI = await axios.post(urlInsert, {
                entregablesInsertar: addedArray,
                idComponente: idComponentToSee,
            });
            console.log(responseI);

            const responseM = await axios.put(urlModify, {
                entregablesModificar: modifiedArray
            });
            console.log(responseM);

            const responseD = await axios.delete(urlDelete, {
                data: {
                    entregablesEliminar: deletedArray
                },
            });
            console.log(responseD);

            const finalResponse = await AsyncRegisterAdditionalFields(taskAdditionalFields,idComponentToSee,2,1,(response)=>{
                console.log("Respuesta de registro de fields");
                console.log(response);
            })

            handlerReturn();
            setIsRegistering(false);
        } catch (e) {
            console.log(e);
            setIsRegistering(false);
        }
    }

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

                // if (component.fechaInicio !== null) {
                //     const dateObject = new Date(component.fechaInicio);
                //     const dateString = dateObject.toLocaleDateString();
                //     const parts = dateString.split("/");
                //     if (parts[0].length === 1) {
                //         parts[0] = "0" + parts[0];
                //     }
                //     const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                //     console.log("NUEVA FECHA INICIO:" + formattedDate);
                //     setInFechaInicio(formattedDate);
                // } else {
                //     setInFechaInicio("");
                // }
                // if (component.fechaFin !== null) {
                //     const dateObject1 = new Date(component.fechaFin);
                //     const dateString1 = dateObject1.toLocaleDateString();
                //     const parts1 = dateString1.split("/");
                //     if (parts1[0].length === 1) {
                //         parts1[0] = "0" + parts1[0];
                //     }
                //     const formattedDate1 = `${parts1[2]}-${parts1[1]}-${parts1[0]}`;
                //     console.log("NUEVA FECHA FIN:" + formattedDate1);
                //     setInFechaFin(formattedDate1);
                // } else {
                //     setInFechaFin("");
                // }
                setInFechaInicio(dbDateToInputDate(component.fechaInicio));
                setInFechaFin(dbDateToInputDate(component.fechaFin));   

                setInResponsables(component.responsables);
                setInDescripcion(component.descripcion);
                setInRecursos(component.recursos);
                setInHito(component.hito);
                setInObservaciones(component.observaciones);

                setBaseComponentData(component);

                console.log(entregables);
                setListEntregables(entregables);
                setListEntregablesOld(entregables);

                console.log(criteriosAceptacion);
                setListCriterios(criteriosAceptacion);

                console.log(
                    "haz conseguido la informacion de dicho componente con exito"
                );

                getAdditionalFields(idComponentToSee,2,setTaskAdditionalFields,(response)=>{
                    console.log("Respueste de campos adicionales listada con exito");
                    setIsLoadingSmall(false);
                });
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
                                Anadir criterio
                            </Button>
                        ) : null}
                    </div>

                    <div className="px-4 py-2">
                        <ListEditableInputV4Crit
                            ListInputs={listCriterios}
                            typeName="Criterio"
                            typeFault="criterios"
                            handleChanges={handleChangeCriterio}
                            handleRemove={handleRemoveCriterio}
                            beEditable={estadoEditar}
                        ></ListEditableInputV4Crit>
                    </div>
                    <div className="flex flex-row items-center gap-6 mt-5">
                        <p className={twTitle}>
                            Campos adicionales
                        </p>
                        {estadoEditar && (
                            <TemplatesAdditionalFields
                                editState={estadoEditar}
                                baseFields={taskAdditionalFields}
                                setBaseFields={setTaskAdditionalFields}
                            />
                        )}
                    </div>
                    <ListAdditionalFields
                        editState={estadoEditar}
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
                        secondAction={async () => {
                            await testAsync();
                        }}
                        textColor="blue"
                        isLoading={isRegistering}
                        closeSecondActionState={true}
                    />
                </div>
            )}
        </div>
    );
}
