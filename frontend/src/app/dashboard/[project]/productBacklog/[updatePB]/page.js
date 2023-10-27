"use client";
import "@/styles/dashboardStyles/projectStyles/productBacklog/registerPB.css";
import ContainerAsWantFor from "@/components/dashboardComps/projectComps/productBacklog/ContainerAsWantFor";
import ContainerRequirement2 from "@/components/dashboardComps/projectComps/productBacklog/ContainerRequirement2";
import DescriptionRequeriment from "@/components/dashboardComps/projectComps/productBacklog/DescriptionRequirement";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/IconLabel";
import { useEffect, useState } from "react";
import MyCombobox from "@/components/ComboBox";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import { useRouter } from "next/navigation";
import ContainerScenario2 from "@/components/dashboardComps/projectComps/productBacklog/ContainerScenario2";
import PopUpEpica from "@/components/dashboardComps/projectComps/productBacklog/PopUpEpica";
import { useContext } from "react";
import { SmallLoadingScreen } from "../../layout";
axios.defaults.withCredentials = true;

function getCurrentDate() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

export default function ProductBacklogUpdate(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    const idHU = props.params.updatePB;
    const decodedUrl = decodeURIComponent(props.params.project); //borrar
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1); //borrar
    const stringURLEpics = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/backlog/${projectId}/listarEpicas`; //borrar
    const stringURLBacklog = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/backlog/${projectId}/listarBacklog`;
    const [quantity, setQuantity] = useState(0);
    const [quantity1, setQuantity1] = useState(0);
    const [selectedValueEpic, setSelectedValueEpic] = useState(null);
    const [selectedValuePriority, setSelectedValuePriority] = useState(null);
    const [selectedValueState, setSelectedValueState] = useState(null);
    const [selectedNameEpic, setSelectedNameEpic] = useState("");
    const [selectedNamePriority, setSelectedNamePriority] = useState("");
    const [selectedNameState, setSelectedNameState] = useState("");
    const currentDate = getCurrentDate();
    const [scenarioFields, setScenarioFields] = useState([]);
    const [scenarioFieldsOriginales, setScenarioFieldsOriginales] = useState(
        []
    );
    const [requirementFields, setRequirementFields] = useState([]);
    const [requirementFieldsOriginales, setRequirementFieldsOriginales] =
        useState([]);
    const [datosUsuario, setDatosUsuario] = useState(null);
    const [historiaUsuario, setHistoriaUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState("");
    const [como, setComo] = useState("");
    const [quiero, setQuiero] = useState("");
    const [para, setPara] = useState("");
    const [fieldsEmpty, setFieldsEmpty] = useState(false);
    const [fieldsExcessive, setFieldsExcessive] = useState(false);

    useEffect(() => {
        if (historiaUsuario && historiaUsuario.hu) {
            setName(historiaUsuario.hu[0].descripcion);
            setSelectedNameEpic(historiaUsuario.hu[0].NombreEpica);
            setSelectedValueEpic(historiaUsuario.hu[0].idEpica);
            setSelectedNamePriority(historiaUsuario.hu[0].NombrePrioridad);
            setSelectedValuePriority(historiaUsuario.hu[0].idHistoriaPrioridad);
            setSelectedNameState(historiaUsuario.hu[0].DescripcionEstado);
            setSelectedValueState(historiaUsuario.hu[0].idHistoriaEstado);
            setComo(historiaUsuario.hu[0].como);
            setQuiero(historiaUsuario.hu[0].quiero);
            setPara(historiaUsuario.hu[0].para);
            setDatosUsuario(historiaUsuario.hu[0].NombreUsuario);
            const criteriosAceptacionOriginales =
                historiaUsuario.criteriosAceptacion;
            const scenarioFieldsActualizados =
                criteriosAceptacionOriginales.map((criterio) => ({
                    idHistoriaCriterioDeAceptacion:
                        criterio.idHistoriaCriterioDeAceptacion || "", // Puedes agregar un valor predeterminado en caso de que falte
                    scenario: criterio.escenario || "", // Puedes agregar un valor predeterminado en caso de que falte
                    dadoQue: criterio.dadoQue || "", // Puedes agregar un valor predeterminado en caso de que falte
                    cuando: criterio.cuando || "", // Puedes agregar un valor predeterminado en caso de que falte
                    entonces: criterio.entonces || "", // Puedes agregar un valor predeterminado en caso de que falte
                }));
            setScenarioFields(scenarioFieldsActualizados);
            setScenarioFieldsOriginales(scenarioFieldsActualizados);
            setQuantity(scenarioFieldsActualizados.length);
            const requerimientosOriginales = historiaUsuario.requirimientos;
            const requirementFieldsActualizados = requerimientosOriginales.map(
                (requerimiento) => ({
                    idHistoriaRequisito:
                        requerimiento.idHistoriaRequisito || "", // Puedes agregar un valor predeterminado en caso de que falte
                    requirement: requerimiento.descripcion || "", // Puedes agregar un valor predeterminado en caso de que falte
                })
            );
            setRequirementFields(requirementFieldsActualizados);
            setRequirementFieldsOriginales(requirementFieldsActualizados);
            setQuantity1(requirementFieldsActualizados.length);
            console.log("Terminó de cargar los datos");
            setIsLoading(false);
            setIsLoadingSmall(false);
        }
    }, [historiaUsuario]);

    const [modal, setModal] = useState(false);
    const [backlog, setBacklog] = useState([]);

    useEffect(() => {
        const fetchBacklog = async () => {
            try {
                const response = await axios.get(stringURLBacklog);
                if (response.status === 200) {
                    setBacklog(response.data.backlog);
                    console.log(
                        "Se obtuvo el backlog correctamente",
                        response.data.backlog
                    );
                }
                setIsLoadingSmall(false);
            } catch (error) {
                setError("Error al obtener el backlog: " + error.message);
            }
        };

        fetchBacklog();
    }, []);
    const toggleModal = () => {
        setModal(!modal);
    };
    useEffect(() => {
        if (modal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        setIsLoadingSmall(false);
    }, [modal]);

    useEffect(() => {
        const stringURLHU = process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/backlog/hu/${idHU}/listarHistoriaDeUsuario`;
        axios
            .get(stringURLHU)
            .then(function (response) {
                const huData = response.data.historiaUsuario;
                console.log("ID HU:", idHU);
                console.log("DATA:", huData);
                setHistoriaUsuario(huData);
                setIsLoadingSmall(false);
                // Puedes manejar el estado de isLoading aquí
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    function addContainer() {
        setQuantity(quantity + 1);
        setScenarioFields((prevFields) => [
            ...prevFields,
            {
                idHistoriaCriterioDeAceptacion: `a${quantity}`,
                scenario: "",
                dadoQue: "",
                cuando: "",
                entonces: "",
            },
        ]);
    }

    function addContainer1() {
        setQuantity1(quantity1 + 1);
        setRequirementFields([
            ...requirementFields,
            {
                idHistoriaRequisito: `a${quantity1}`,
                requirement: "",
            },
        ]);
    }

    function removeContainer(indice) {
        setQuantity(quantity - 1);
        setScenarioFields((prevFields) => {
            const updatedFields = [...prevFields];
            // Elimina el elemento con el índice proporcionado
            updatedFields.splice(indice, 1);

            return updatedFields;
        });
    }

    function removeContainer1(indice) {
        setQuantity1(quantity1 - 1);
        setRequirementFields((prevFields) => {
            const updatedFields = [...prevFields];
            // Elimina el elemento con el índice proporcionado
            updatedFields.splice(indice, 1);

            return updatedFields;
        });
    }

    const handleSelectedValueChangeEpic = (value) => {
        setSelectedValueEpic(value);
    };

    const handleSelectedValueChangePriority = (value) => {
        setSelectedValuePriority(value);
    };

    const handleSelectedValueChangeState = (value) => {
        setSelectedValueState(value);
    };

    const onUpdateScenario = (index, field, value) => {
        setScenarioFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index - 1][field] = value;
            return updatedFields;
        });
    };

    const updateRequirementField = (index, value) => {
        setRequirementFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index - 1].requirement = value;
            return updatedFields;
        });
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

    const onSubmit = () => {
        const scenarioOriginal = scenarioFieldsOriginales;
        const scenario = scenarioFields;
        const requirementOriginal = requirementFieldsOriginales;
        const requirement = requirementFields;
        console.log("Original:", scenarioOriginal);
        console.log("Nuevo:", scenario);
        console.log("Original1:", requirementOriginal);
        console.log("Nuevo1:", requirement);
        const {
            modifiedArray: modifiedArray,
            deletedArray: deletedArray,
            addedArray: addedArray,
        } = findModifiedDeletedAdded(
            scenarioOriginal,
            scenario,
            "idHistoriaCriterioDeAceptacion"
        );
        const {
            modifiedArray: modifiedArray1,
            deletedArray: deletedArray1,
            addedArray: addedArray1,
        } = findModifiedDeletedAdded(
            requirementOriginal,
            requirement,
            "idHistoriaRequisito"
        );
        console.log("Modified:", modifiedArray);
        console.log("Deleted:", deletedArray);
        console.log("Added:", addedArray);
        console.log("Modified1:", modifiedArray1);
        console.log("Deleted1:", deletedArray1);
        console.log("Added1:", addedArray1);

        const idEpic = selectedValueEpic;
        const idPriority = selectedValuePriority;
        const idState = selectedValueState;
        const putData = {
            idHistoriaUsuario: parseInt(idHU),
            idEpic: idEpic,
            idPriority: idPriority,
            idState: idState,
            name: name,
            como: como,
            quiero: quiero,
            para: para,
            scenarioData: modifiedArray,
            requirementData: modifiedArray1,
        };
        console.log("Actualizado correctamente");
        console.log(putData);
        const postData = {
            idHistoriaUsuario: parseInt(idHU),
            scenarioData: addedArray,
            requirementData: addedArray1,
        };
        console.log("Agregado correctamente");
        console.log(postData);
        const deleteData = {
            idHistoriaUsuario: parseInt(idHU),
            scenarioData: deletedArray,
            requirementData: deletedArray1,
        };
        console.log("Eliminado correctamente");
        console.log(deleteData);
        axios
            .put(
                process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/backlog/hu/modificarHistoriaDeUsuario",
                putData
            )
            .then((response) => {
                // Manejar la respuesta de la solicitud PUT
                console.log("Respuesta del servidor:", response.data);
                console.log("Registro correcto");
                // Realizar acciones adicionales si es necesario
            })
            .catch((error) => {
                // Manejar errores si la solicitud PUT falla
                console.error("Error al realizar la solicitud PUT:", error);
            }); 
        axios.post(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/backlog/hu/insertarCriterioRequisito", postData)
            .then((response) => {
              // Manejar la respuesta de la solicitud POST
              console.log("Respuesta del servidor (POST):", response.data);
              console.log("Registro correcto (POST)");
              // Realizar acciones adicionales si es necesario
            })
            .catch((error) => {
              // Manejar errores si la solicitud POST falla
              console.error("Error al realizar la solicitud POST:", error);
            });
        axios.delete(process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/backlog/hu/eliminarCriterioRequisito", {
                data: deleteData
              })
                .then((response) => {
                  // Manejar la respuesta de la solicitud DELETE
                  console.log("Respuesta del servidor (DELETE):", response.data);
                  console.log("Eliminación correcta (DELETE)");
                  // Realizar acciones adicionales si es necesario
                })
                .catch((error) => {
                  // Manejar errores si la solicitud DELETE falla
                  console.error("Error al realizar la solicitud DELETE:", error);
            });
    };

    function verifyFieldsEmpty() {
        return (
            name === "" ||
            como === "" ||
            quiero === "" ||
            para === "" ||
            selectedValueEpic === null ||
            selectedValuePriority === null ||
            selectedValueState === null ||
            requirementFields.some(
                (requirement) => requirement.requirement === ""
            ) ||
            scenarioFields.some(
                (scenario) =>
                    scenario.scenario === "" ||
                    scenario.dadoQue === "" ||
                    scenario.cuando === "" ||
                    scenario.entonces === ""
            )
        );
    }

    function verifyFieldsExcessive() {
        return (
            name.length > 400 ||
            como.length > 400 ||
            quiero.length > 400 ||
            para.length > 400 ||
            requirementFields.some(
                (requirement) => requirement.requirement.length > 400
            ) ||
            scenarioFields.some(
                (scenario) =>
                    scenario.scenario.length > 400 ||
                    scenario.dadoQue.length > 400 ||
                    scenario.cuando.length > 400 ||
                    scenario.entonces.length > 400
            )
        );
    }

    return (
        <form className="containerRegisterPB">
            <div className="headerRegisterPB">
                Inicio / Proyectos / Nombre del proyecto / Backlog / Product
                Backlog / Registrar elemento
            </div>
            <div className="backlogRegisterPB">
                <div className="titleBacklogRegisterPB">
                    Editar elemento en el Backlog
                </div>
                {historiaUsuario ? (
                    <div>
                        <DescriptionRequeriment
                            name={name}
                            onNameChange={setName}
                        />
                    </div>
                ) : (
                    <div>Cargando datos...</div>
                )}
                <h4 style={{ fontWeight: 600 }}>
                    Información de la historia de usuario
                    <span className="text-red-500"> *</span>
                </h4>
                <div className="combo">
                    <div className="epic containerCombo">
                        <IconLabel
                            icon="/icons/epicPB.svg"
                            label="Épica"
                            className="iconLabel"
                        />
                        {/* <MyCombobox urlApi={stringURLEpics} property="epicas" nameDisplay="nombre" hasColor={false} onSelect={handleSelectedValueChangeEpic} idParam="idEpica" initialName={selectedNameEpic}/> */}
                        <div className="subcontainerCombo flex items-center">
                            <MyCombobox
                                urlApi={stringURLEpics}
                                property="epicas"
                                nameDisplay="nombre"
                                hasColor={false}
                                onSelect={handleSelectedValueChangeEpic}
                                idParam="idEpica"
                                initialName={selectedNameEpic}
                            />
                            <button
                                className="w-20 h-20"
                                type="button"
                                onClick={() => toggleModal()}
                            >
                                <img
                                    src="/icons/btnEditImagen.svg"
                                    alt="Descripción de la imagen"
                                />
                            </button>
                        </div>
                    </div>
                    <div className="date containerCombo">
                        <IconLabel
                            icon="/icons/datePB.svg"
                            label="Fecha de creación"
                            className="iconLabel"
                        />
                        <div className="dateOfCreation">{currentDate}</div>
                    </div>
                    <div className="priority containerCombo">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Prioridad"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi=process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/backlog/hu/listarHistoriasPrioridad"
                            property="historiasPrioridad"
                            nameDisplay="nombre"
                            hasColor={true}
                            colorProperty="RGB"
                            onSelect={handleSelectedValueChangePriority}
                            idParam="idHistoriaPrioridad"
                            initialName={selectedNamePriority}
                        />
                    </div>
                    <div className="createdBy containerCombo">
                        <IconLabel
                            icon="/icons/createdByPB.svg"
                            label="Creado por"
                            className="iconLabel"
                        />
                        {isLoading ? (
                            <div className="flex gap-4">
                                <Spinner size="lg" />
                            </div>
                        ) : (
                            <div className="iconLabel2">
                                <p className="profilePic">
                                    {datosUsuario.split(" ")[0][0] +
                                        datosUsuario.split(" ")[1][0]}
                                </p>
                                <div className="labelDatoUsuario">{`${datosUsuario}`}</div>
                            </div>
                        )}
                    </div>
                    <div className="state containerCombo">
                        <IconLabel
                            icon="/icons/statePB.svg"
                            label="Estado"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi=process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/backlog/hu/listarHistoriasEstado"
                            property="historiasEstado"
                            nameDisplay="descripcion"
                            onSelect={handleSelectedValueChangeState}
                            idParam="idHistoriaEstado"
                            initialName={selectedNameState}
                        />
                    </div>
                </div>
                <div className="userDescription">
                    <h4 style={{ fontWeight: 600 }}>
                        Descripción de usuario
                        <span className="text-red-500"> *</span>
                    </h4>
                    <ContainerAsWantFor
                        como={como}
                        quiero={quiero}
                        para={para}
                        onComoChange={setComo}
                        onQuieroChange={setQuiero}
                        onParaChange={setPara}
                    />
                </div>
                <div className="acceptanceCriteria">
                    <div className="titleButton">
                        <h4 style={{ fontWeight: 600 }}>
                            Criterios de aceptación
                        </h4>
                    </div>
                    {scenarioFields.length === 0 ? (
                        <div className="flex justify-center items-center">
                            <div>
                                ¡Puede agregar algunos criterios de aceptación!
                            </div>
                        </div>
                    ) : (
                        historiaUsuario &&
                        scenarioFields.map((criterio, index) => (
                            <ContainerScenario2
                                key={index}
                                indice={index + 1}
                                onUpdateScenario={onUpdateScenario}
                                scenario={criterio}
                                functionRemove={removeContainer}
                            />
                        ))
                    )}
                    {console.log("Scenario fields: ", scenarioFields)}
                    <div className="twoButtons">
                        <div className="buttonContainer">
                            <button
                                onClick={addContainer}
                                className="buttonTitle"
                                type="button"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
                <div className="requirements">
                    <div className="titleButton">
                        <h4 style={{ fontWeight: 600 }}>
                            Requerimientos funcionales
                        </h4>
                    </div>
                    {requirementFields.length === 0 ? (
                        <div className="flex justify-center items-center">
                            <div>¡Puede agregar algunos requerimientos!</div>
                        </div>
                    ) : (
                        historiaUsuario &&
                        requirementFields.map((requirement, index) => (
                            <ContainerRequirement2
                                key={index}
                                indice={index + 1}
                                updateRequirementField={updateRequirementField}
                                requirement={requirement}
                                functionRemove={removeContainer1}
                            />
                        ))
                    )}
                    {console.log("Requeriments Fields: ", requirementFields)}
                    <div className="twoButtons">
                        <div className="buttonContainer">
                            <button
                                onClick={addContainer1}
                                className="buttonTitle"
                                type="button"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="containerBottom">
                    {fieldsEmpty && !fieldsExcessive && (
                        <IconLabel
                            icon="/icons/alert.svg"
                            label="Faltan completar campos"
                            className="iconLabel3"
                        />
                    )}
                    {fieldsExcessive && !fieldsEmpty && (
                        <IconLabel
                            icon="/icons/alert.svg"
                            label="Se excedió el límite de caracteres"
                            className="iconLabel3"
                        />
                    )}
                    {fieldsExcessive && fieldsEmpty && (
                        <IconLabel
                            icon="/icons/alert.svg"
                            label="Faltan completar campos y se excedió el límite de caracteres"
                            className="iconLabel3"
                        />
                    )}
                    <div className="twoButtons1">
                        <div className="buttonContainer">
                            <Modal
                                nameButton="Descartar"
                                textHeader="Descartar Registro"
                                textBody="¿Seguro que quiere descartar la actualización de la historia de usuario?"
                                colorButton="w-36 bg-slate-100 text-black"
                                oneButton={false}
                                secondAction={() => router.back()}
                                textColor="red"
                            />
                            <Modal
                                nameButton="Aceptar"
                                textHeader="Registrar Historia de Usuario"
                                textBody="¿Seguro que quiere actualizar la historia de usuario?"
                                colorButton="w-36 bg-blue-950 text-white"
                                oneButton={false}
                                secondAction={() => {
                                    onSubmit();
                                    router.back();
                                }}
                                textColor="blue"
                                verifyFunction={() => {
                                    //FALTA HACER LA VERIFICACIÓN DE LOS CAMPOS
                                    if (
                                        verifyFieldsEmpty() &&
                                        verifyFieldsExcessive()
                                    ) {
                                        setFieldsEmpty(true);
                                        setFieldsExcessive(true);
                                        return false;
                                    } else if (
                                        verifyFieldsEmpty() &&
                                        !verifyFieldsExcessive()
                                    ) {
                                        setFieldsEmpty(true);
                                        setFieldsExcessive(false);
                                        return false;
                                    } else if (
                                        verifyFieldsExcessive() &&
                                        !verifyFieldsEmpty()
                                    ) {
                                        setFieldsExcessive(true);
                                        setFieldsEmpty(false);
                                        return false;
                                    } else {
                                        setFieldsExcessive(false);
                                        setFieldsEmpty(false);
                                        return true;
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                {modal && (
                    <PopUpEpica
                        modal={modal}
                        toggle={() => toggleModal()} // Pasa la función como una función de flecha
                        url={stringURLEpics}
                        backlogID={backlog[0].idProductBacklog}
                        urlEliminate={process.env.NEXT_PUBLIC_BACKEND_URL+`/api/proyecto/backlog/hu/eliminarEpica`}
                    />
                )}
            </div>
        </form>
    );
}
