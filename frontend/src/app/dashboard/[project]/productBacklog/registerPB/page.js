"use client";
import "@/styles/dashboardStyles/projectStyles/productBacklog/registerPB.css";
import ContainerAsWantFor from "@/components/dashboardComps/projectComps/productBacklog/containerAsWantFor";
import ContainerScenario from "@/components/dashboardComps/projectComps/productBacklog/containerScenario";
import ContainerRequirement from "@/components/dashboardComps/projectComps/productBacklog/containerRequirement";
import DescriptionRequeriment from "@/components/dashboardComps/projectComps/productBacklog/descriptionRequirement";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
import { useEffect, useState } from "react";
import MyCombobox from "@/components/ComboBox";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import { useRouter } from "next/navigation";

axios.defaults.withCredentials = true;

function getCurrentDate() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

export default function ProductBacklogRegister(props) {
    const router = useRouter();
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const stringURLEpics = `http://localhost:8080/api/proyecto/backlog/${projectId}/listarEpicas`;
    const [quantity, setQuantity] = useState(0);
    const [quantity1, setQuantity1] = useState(0);
    const [selectedValueEpic, setSelectedValueEpic] = useState(null);
    const [selectedValuePriority, setSelectedValuePriority] = useState(null);
    const [selectedValueState, setSelectedValueState] = useState(null);
    const currentDate = getCurrentDate();
    const [scenarioFields, setScenarioFields] = useState([]);
    const [requirementFields, setRequirementFields] = useState([]);
    const [datosUsuario, setDatosUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState("");
    const [como, setComo] = useState("");
    const [quiero, setQuiero] = useState("");
    const [para, setPara] = useState("");
    const [fieldsEmpty, setFieldsEmpty] = useState(false);
    const [fieldsExcessive, setFieldsExcessive] = useState(false);

    useEffect(() => {
        const stringURLUsuario =
            "http://localhost:8080/api/usuario/verInfoUsuario";

        axios
            .get(stringURLUsuario)
            .then(function (response) {
                const userData = response.data.usuario[0];
                setDatosUsuario(userData);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    function addContainer() {
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
        setQuantity(quantity + 1);
    }

    function addContainer1() {
        setRequirementFields([
            ...requirementFields,
            {
                idHistoriaRequisito: `a${quantity1}`,
                requirement: "",
            },
        ]);
        setQuantity1(quantity1 + 1);
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
            console.log("XD",indice);
            console.log("XD",updatedFields);
            updatedFields.splice(indice, 1);
            console.log("XD2",updatedFields);
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

    const onSubmit = () => {
        const idEpic = selectedValueEpic;
        const idPriority = selectedValuePriority;
        const idState = selectedValueState;
        const postData = {
            idEpic: idEpic,
            idPriority: idPriority,
            idState: idState,
            name: name,
            como: como,
            quiero: quiero,
            para: para,
            idUsuarioCreador: datosUsuario.idUsuario,
            scenarioData: scenarioFields,
            requirementData: requirementFields,
        };
        console.log("Registrado correctamente");
        console.log(postData);
        axios
            .post(
                "http://localhost:8080/api/proyecto/backlog/hu/insertarHistoriaDeUsuario",
                postData
            )
            .then((response) => {
                // Manejar la respuesta de la solicitud POST
                console.log("Respuesta del servidor:", response.data);
                console.log("Registro correcto");
                // Realizar acciones adicionales si es necesario
            })
            .catch((error) => {
                // Manejar errores si la solicitud POST falla
                console.error("Error al realizar la solicitud POST:", error);
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
        <form onSubmit={onSubmit} className="containerRegisterPB">
            <div className="headerRegisterPB">
                Inicio / Proyectos / Nombre del proyecto / Backlog / Product
                Backlog / Registrar elemento
            </div>
            <div className="backlogRegisterPB">
                <div className="titleBacklogRegisterPB">
                    Registrar nuevo elemento en el Backlog
                </div>
                <div className="description">
                    <h4 style={{ fontWeight: 600 }}>
                        Nombre de la historia de usuario
                        <span className="text-red-500"> *</span>
                    </h4>
                    <DescriptionRequeriment
                        name={name}
                        onNameChange={setName}
                    />
                </div>
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
                        <MyCombobox
                            urlApi={stringURLEpics}
                            property="epicas"
                            nameDisplay="nombre"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeEpic}
                            idParam="idEpica"
                        />
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
                            urlApi="http://localhost:8080/api/proyecto/backlog/hu/listarHistoriasPrioridad"
                            property="historiasPrioridad"
                            nameDisplay="nombre"
                            hasColor={true}
                            colorProperty="RGB"
                            onSelect={handleSelectedValueChangePriority}
                            idParam="idHistoriaPrioridad"
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
                                    {datosUsuario?.nombres[0] +
                                        datosUsuario?.apellidos[0]}
                                </p>
                                <div className="label">
                                    {`${datosUsuario?.nombres} ${datosUsuario?.apellidos}`}
                                </div>
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
                            urlApi="http://localhost:8080/api/proyecto/backlog/hu/listarHistoriasEstado"
                            property="historiasEstado"
                            nameDisplay="descripcion"
                            onSelect={handleSelectedValueChangeState}
                            idParam="idHistoriaEstado"
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
                    {quantity === 0 ? (
                        <div className="flex justify-center items-center">
                            <div>
                                ¡Puede agregar algunos criterios de aceptación!
                            </div>
                        </div>
                    ) : (
                        scenarioFields.map((criterio, index) => (
                            <ContainerScenario
                                key={index}
                                indice={index + 1}
                                onUpdateScenario={onUpdateScenario}
                                scenario={criterio}
                                functionRemove={removeContainer}
                            />
                        ))
                    )}
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
                    {quantity1 === 0 ? (
                        <div className="flex justify-center items-center">
                            <div>¡Puede agregar algunos requerimientos!</div>
                        </div>
                    ) : (
                        requirementFields.map((requirement, index) => (
                            <ContainerRequirement
                                key={index}
                                indice={index + 1}
                                updateRequirementField={updateRequirementField}
                                requirement={requirement}
                                functionRemove={removeContainer1}
                            />
                        ))
                    )}
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
                                textBody="¿Seguro que quiere descartar el registro de la historia de usuario?"
                                colorButton="w-36 bg-slate-100 text-black"
                                oneButton={false}
                                secondAction={() => router.back()}
                                textColor="red"
                            />
                            <Modal
                                nameButton="Aceptar"
                                textHeader="Registrar Historia de Usuario"
                                textBody="¿Seguro que quiere registrar la historia de usuario?"
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
            </div>
        </form>
    );
}
