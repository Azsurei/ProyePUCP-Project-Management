"use client";
import "@/styles/dashboardStyles/projectStyles/catalogoDeRiesgosStyles/registerCR.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { SmallLoadingScreen } from "../../layout";
import { Textarea } from "@nextui-org/react";
import MyCombobox from "@/components/ComboBox";
import { useRouter } from "next/navigation";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
import { Input } from "@nextui-org/react";
import { Switch } from "@nextui-org/react";
import ButtonIconLabel from "@/components/dashboardComps/projectComps/matrizComunicacionesComps/ButtonIconLabel";
import ModalUsersOne from "@/components/ModalUsersOne";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import ContainerResponsePlans from "@/components/dashboardComps/projectComps/catalogoDeRiesgosComps/ContainerResponsePlans";
import ContainerContingencyPlans from "@/components/dashboardComps/projectComps/catalogoDeRiesgosComps/containerContingencyPlans";
import CardSelectedUser from "@/components/CardSelectedUser";
axios.defaults.withCredentials = true;

export default function CatalogoDeRiesgosRegister(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    console.log("El id del proyecto es:", projectId);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    const [name, setName] = useState("");
    const [detail, setDetail] = useState("");
    const [probability, setProbability] = useState(null);
    const [valorProbability, setValorProbability] = useState(null);
    const [impact, setImpact] = useState(null);
    const [valorImpact, setValorImpact] = useState(null);
    const [fechaInicio, setFechaInicio] = useState(null);
    const [isSelected, setIsSelected] = useState(true);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedMiembrosList, setSelectedMiembrosList] = useState([]); //solo un objeto contiene
    const [selectedMiembrosList1, setSelectedMiembrosList1] = useState([]);
    const [cause, setCause] = useState("");
    const [impactDetail, setImpactDetail] = useState("");
    const [responsePlans, setResponsePlans] = useState([]);
    const [contingencyPlans, setContingencyPlans] = useState([]);

    const isTextTooLong1 = name.length > 400;
    const isTextTooLong2 = detail.length > 400;
    const isTextTooLong3 = detail.length > 400;
    const isTextTooLong4 = detail.length > 400;
    const [fieldsEmpty, setFieldsEmpty] = useState(false);
    const [fieldsExcessive, setFieldsExcessive] = useState(false);
    const [quantity1, setQuantity1] = useState(0);
    const [quantity2, setQuantity2] = useState(0);

    useEffect(() => {
        setIsLoadingSmall(false);
    }, []);

    const handleSelectedValueChangeProbability = (value) => {
        setProbability(value);
    };

    const handleSelectedValorChangeProbability = (value) => {
        setValorProbability(value);
    };

    const handleSelectedValueChangeImpact = (value) => {
        setImpact(value);
    };

    const handleSelectedValorChangeImpact = (value) => {
        setValorImpact(value);
    };

    const toggleModal1 = () => {
        setModal1(!modal1);
    };

    const toggleModal2 = () => {
        setModal2(!modal2);
    };

    const returnListOfMiembros = (newMiembrosList) => {
        console.log("En return:", newMiembrosList[0]);

        // Verificar si newMiembrosList es un arreglo con contenido
        if (Array.isArray(newMiembrosList) && newMiembrosList.length > 0) {
            // Establecer el arreglo como un arreglo que contiene solo el nuevo objeto
            setSelectedMiembrosList([newMiembrosList[0]]);
        }

        setModal2(false);
    };

    const returnListOfUsers = (newUsersList) => {
        const newList = [...selectedMiembrosList1, ...newUsersList];

        setSelectedMiembrosList1(newList);
        setModal1(false);
    };

    const removeUser = (user) => {
        const newList = selectedMiembrosList1.filter(
            (item) => item.idUsuario !== user.idUsuario
        );
        setSelectedMiembrosList1(newList);
        console.log(newList);
    };

    function capitalizeWords(str) {
        // Dividimos la cadena en palabras usando el espacio como separador
        const words = str.split(" ");

        // Iteramos por cada palabra y aplicamos la capitalización
        const capitalizedWords = words.map((word) => {
            // Convierte la primera letra a mayúscula y el resto a minúscula
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });

        // Unimos las palabras nuevamente en una cadena
        return capitalizedWords.join(" ");
    }

    function addContainer1() {
        setResponsePlans([
            ...responsePlans,
            {
                idPlanRespuesta: `a${quantity1}`,
                responsePlans: "",
            },
        ]);
        setQuantity1(quantity1 + 1);
    }

    function addContainer2() {
        setContingencyPlans([
            ...contingencyPlans,
            {
                idPlanContingencia: `a${quantity2}`,
                contingencyPlans: "",
            },
        ]);
        setQuantity2(quantity2 + 1);
    }

    const updateResponsePlansField = (index, value) => {
        setResponsePlans((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index - 1].responsePlans = value;
            return updatedFields;
        });
    };

    const updateContingencyPlansField = (index, value) => {
        setContingencyPlans((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index - 1].contingencyPlans = value;
            return updatedFields;
        });
    };

    function removeContainer1(indice) {
        setQuantity1(quantity1 - 1);
        setResponsePlans((prevFields) => {
            const updatedFields = [...prevFields];
            // Elimina el elemento con el índice proporcionado
            updatedFields.splice(indice, 1);
            return updatedFields;
        });
    }

    function removeContainer2(indice) {
        setQuantity2(quantity2 - 1);
        setContingencyPlans((prevFields) => {
            const updatedFields = [...prevFields];
            // Elimina el elemento con el índice proporcionado
            updatedFields.splice(indice, 1);
            return updatedFields;
        });
    }

    function verifyFieldsEmpty() {
        return (
            name === "" ||
            detail === "" ||
            probability === null ||
            impact === null ||
            fechaInicio === null ||
            cause === "" ||
            impactDetail === "" ||
            selectedMiembrosList.length === 0 ||
            selectedMiembrosList1.length === 0 ||
            responsePlans.some(
                (responsePlans) => responsePlans.responsePlans === ""
            ) ||
            contingencyPlans.some(
                (contingencyPlans) => contingencyPlans.contingencyPlans === ""
            )
        );
    }

    function verifyFieldsExcessive() {
        return (
            name.length > 400 ||
            detail.length > 400 ||
            cause.length > 400 ||
            impactDetail.length > 400 ||
            responsePlans.some(
                (responsePlans) => responsePlans.responsePlans.length > 400
            ) ||
            contingencyPlans.some(
                (contingencyPlans) =>
                    contingencyPlans.contingencyPlans.length > 400
            )
        );
    }

    const onSubmit = () => {
        const postData = {
            idProyecto: parseInt(projectId),
            idProbabilidad: probability,
            idImpacto: impact,
            nombreRiesgo: name,
            fechaIdentificacion: fechaInicio,
            duenoRiesgo: selectedMiembrosList[0].idUsuario,
            detalleRiesgo: detail,
            causaRiesgo: cause,
            impactoRiesgo: impactDetail,
            estado: isSelected ? "Activo" : "Inactivo",
            responsables: selectedMiembrosList1,
            planesRespuesta: responsePlans,
            planesContigencia: contingencyPlans,
        };
        console.log("El postData es :", postData);
        axios
            .post(
                "http://localhost:8080/api/proyecto/catalogoRiesgos/insertarRiesgo",
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

    return (
        <div className="containerRegisterCR">
            <div className="headerRegisterCR">
                Inicio / Proyectos / Nombre del proyecto / Catálogo de Riesgos/
                Registrar riesgo
            </div>
            <div className="riskRegisterCR">
                <div className="titleRiskRegisterCR">Crear nuevo riesgo</div>
                <div>
                    <Textarea
                        isClearable
                        label="Nombre del riesgo"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-labelCR"
                        value={name}
                        onValueChange={setName}
                        maxLength="450"
                        isInvalid={isTextTooLong1}
                        errorMessage={
                            isTextTooLong1
                                ? "El texto debe ser como máximo de 400 caracteres."
                                : ""
                        }
                    />
                </div>
                <div>
                    <Textarea
                        label="Detalle del riesgo"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-labelCR"
                        minRows="5"
                        value={detail}
                        onValueChange={setDetail}
                        maxLength="450"
                        isInvalid={isTextTooLong2}
                        errorMessage={
                            isTextTooLong2
                                ? "El texto debe ser como máximo de 400 caracteres."
                                : ""
                        }
                    />
                </div>
                <div className="comboCR">
                    <div className="containerComboCR">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Probabilidad"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi="http://localhost:8080/api/proyecto/catalogoRiesgos/listarProbabilidades"
                            property="probabilidades"
                            nameDisplay="nombreProbabilidad"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeProbability}
                            onSelectValor={handleSelectedValorChangeProbability}
                            idParam="idProbabilidad"
                            valorParam="valorProbabilidad"
                            initialName="Seleccione una probabilidad"
                        />
                    </div>
                    <div className="containerComboCR">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Impacto"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi="http://localhost:8080/api/proyecto/catalogoRiesgos/listarImpacto"
                            property="impacto"
                            nameDisplay="nombreImpacto"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeImpact}
                            onSelectValor={handleSelectedValorChangeImpact}
                            idParam="idImpacto"
                            valorParam="valorImpacto"
                            initialName="Seleccione un impacto"
                        />
                    </div>
                    <div className="containerComboCR">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Fecha identificada"
                            className="iconLabel"
                        />
                        <Input
                            type="date"
                            isRequired
                            variant="bordered"
                            radius="sm"
                            className="w-64"
                            name="datepicker"
                            value={fechaInicio}
                            onValueChange={setFechaInicio}
                            isReadOnly={false}
                        ></Input>
                    </div>
                    <div className="containerComboCR">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Severidad"
                            className="iconLabel"
                        />
                        <div className="labelSinDataUsuarioCR">
                            {probability === null || impact === null ? (
                                "Severidad = Probabilidad x Impacto"
                            ) : valorProbability * valorImpact >= 0.18 ? (
                                <div className="text-red-500 font-semibold">
                                    Alta
                                </div>
                            ) : valorProbability * valorImpact >= 0.05 ? (
                                <div className="text-orange-500 font-semibold">
                                    Media
                                </div>
                            ) : (
                                <div className="text-green-500 font-semibold">
                                    Baja
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="containerComboCR">
                        <IconLabel
                            icon="/icons/priorityPB.svg"
                            label="Estado"
                            className="iconLabel"
                        />
                        <Switch
                            isSelected={isSelected}
                            onValueChange={setIsSelected}
                        >
                            {isSelected ? "Activo" : "Inactivo"}
                        </Switch>
                    </div>
                    <div className="containerComboCR">
                        <ButtonIconLabel
                            icon="/icons/icon-searchBar.svg"
                            label1="Buscar"
                            label2="dueño"
                            className="iconLabelButtonMC"
                            onClickFunction={toggleModal2}
                        />
                        {selectedMiembrosList.length > 0 ? (
                            selectedMiembrosList.map((component) => (
                                <div className="iconLabel2CR">
                                    <p className="profilePicCR">
                                        {component.nombres[0] +
                                            component.apellidos[0]}
                                    </p>
                                    <div className="labelDatoUsuarioCR">
                                        {capitalizeWords(
                                            `${component.nombres} ${component.apellidos}`
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="labelSinDataUsuarioCR">
                                ¡Seleccione un dueño del riesgo!
                            </div>
                        )}
                    </div>
                </div>
                <div className="containerResponsables">
                    <ButtonIconLabel
                        icon="/icons/icon-searchBar.svg"
                        label1="Buscar"
                        label2="responsables"
                        className="iconLabelButtonMC"
                        onClickFunction={toggleModal1}
                    />
                    <div className="containerUserMultipleGrid">
                        {selectedMiembrosList1.length > 0 ? (
                            selectedMiembrosList1.map((component) => (
                                <div className="containerUserMultiple">
                                    <div className="iconLabel3CR">
                                        <p className="profilePicCR">
                                            {component.nombres[0] +
                                                component.apellidos[0]}
                                        </p>
                                        <div className="labelDatoUsuarioCR">
                                            {capitalizeWords(
                                                `${component.nombres} ${component.apellidos}`
                                            )}
                                        </div>
                                    </div>
                                    <img
                                        src="/icons/icon-trash.svg"
                                        alt="delete"
                                        className="mb-4 cursor-pointer mr-2"
                                        onClick={() => {
                                            removeUser(component);
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="labelSinDataUsuarioCR">
                                ¡Seleccione los responsables del riesgo!
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <Textarea
                        isClearable
                        label="Causa"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-labelCR"
                        minRows="5"
                        value={cause}
                        onValueChange={setCause}
                        maxLength="450"
                        isInvalid={isTextTooLong3}
                        errorMessage={
                            isTextTooLong3
                                ? "El texto debe ser como máximo de 400 caracteres."
                                : ""
                        }
                    />
                </div>
                <div>
                    <Textarea
                        isClearable
                        label="Impacto"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-labelCR"
                        minRows="5"
                        value={impactDetail}
                        onValueChange={setImpactDetail}
                        maxLength="450"
                        isInvalid={isTextTooLong4}
                        errorMessage={
                            isTextTooLong4
                                ? "El texto debe ser como máximo de 400 caracteres."
                                : ""
                        }
                    />
                </div>
                <div>
                    <div className="titleButtonCR">
                        <h4 style={{ fontWeight: 600 }}>Planes de respuesta</h4>
                    </div>
                    {quantity1 === 0 ? (
                        <div className="flex justify-center items-center">
                            <div>
                                ¡Puede agregar algunos planes de respuesta!
                            </div>
                        </div>
                    ) : (
                        responsePlans.map((responsePlans, index) => (
                            <ContainerResponsePlans
                                key={index}
                                indice={index + 1}
                                updateResponsePlansField={
                                    updateResponsePlansField
                                }
                                responsePlans={responsePlans}
                                functionRemove={removeContainer1}
                            />
                        ))
                    )}
                    <div className="twoButtonsCR">
                        <div className="buttonContainerCR">
                            <button
                                onClick={addContainer1}
                                className="buttonTitleCR"
                                type="button"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="titleButtonCR">
                        <h4 style={{ fontWeight: 600 }}>
                            Planes de contingencia
                        </h4>
                    </div>
                    {quantity2 === 0 ? (
                        <div className="flex justify-center items-center">
                            <div>
                                ¡Puede agregar algunos planes de contingencia!
                            </div>
                        </div>
                    ) : (
                        contingencyPlans.map((contingencyPlans, index) => (
                            <ContainerContingencyPlans
                                key={index}
                                indice={index + 1}
                                updateContingencyPlansField={
                                    updateContingencyPlansField
                                }
                                contingencyPlans={contingencyPlans}
                                functionRemove={removeContainer2}
                            />
                        ))
                    )}
                    <div className="twoButtonsCR">
                        <div className="buttonContainerCR">
                            <button
                                onClick={addContainer2}
                                className="buttonTitleCR"
                                type="button"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
                <div className="containerBottomCR">
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
                    <div className="twoButtonsCR">
                        <div className="buttonContainerCR">
                            <Modal
                                nameButton="Descartar"
                                textHeader="Descartar Registro"
                                textBody="¿Seguro que quiere descartar el registro de la información?"
                                colorButton="w-36 bg-slate-100 text-black"
                                oneButton={false}
                                secondAction={() => router.back()}
                                textColor="red"
                            />
                            <Modal
                                nameButton="Aceptar"
                                textHeader="Registrar Información"
                                textBody="¿Seguro que quiere registrar la información?"
                                colorButton="w-36 bg-blue-950 text-white"
                                oneButton={false}
                                secondAction={() => {
                                    onSubmit();
                                    router.back();
                                }}
                                textColor="blue"
                                verifyFunction={() => {
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
            {modal1 && (
                <ModalUser
                    listAllUsers={false}
                    handlerModalClose={toggleModal1}
                    handlerModalFinished={returnListOfUsers}
                    excludedUsers={selectedMiembrosList1}
                    idProyecto={projectId}
                ></ModalUser>
            )}
            {modal2 && (
                <ModalUsersOne
                    listAllUsers={false}
                    handlerModalClose={toggleModal2}
                    handlerModalFinished={returnListOfMiembros}
                    excludedUsers={selectedMiembrosList}
                    idProyecto={projectId}
                ></ModalUsersOne>
            )}
        </div>
    );
}
