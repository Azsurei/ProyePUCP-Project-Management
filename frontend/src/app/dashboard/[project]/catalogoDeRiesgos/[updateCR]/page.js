"use client";
import "@/styles/dashboardStyles/projectStyles/catalogoDeRiesgosStyles/registerCR.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { SmallLoadingScreen } from "../../layout";
import { Textarea, Avatar, Button } from "@nextui-org/react";
import MyCombobox from "@/components/ComboBox";
import { useRouter, useSearchParams } from "next/navigation";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/IconLabel";
import { Input } from "@nextui-org/react";
import { Switch } from "@nextui-org/react";
import ButtonIconLabel from "@/components/dashboardComps/projectComps/matrizComunicacionesComps/ButtonIconLabel";
import ModalUsersOne from "@/components/ModalUsersOne";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import ContainerContingencyPlans from "@/components/dashboardComps/projectComps/catalogoDeRiesgosComps/ContainerContingencyPlans";
import ContainerResponsePlans from "@/components/dashboardComps/projectComps/catalogoDeRiesgosComps/ContainerResponsePlans";
import { Toaster, toast } from "sonner";
axios.defaults.withCredentials = true;

export default function CatalogoDeRiesgosUpdate(props) {
    const keyParamURL = decodeURIComponent(props.params.updateCR);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    console.log("El id del proyecto es:", projectId);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [detail, setDetail] = useState("");
    const [probability, setProbability] = useState(null);
    const [valorProbability, setValorProbability] = useState(null);
    const [impact, setImpact] = useState(null);
    const [valorImpact, setValorImpact] = useState(null);
    const [selectedNameProbability, setSelectedNameProbability] = useState("");
    const [selectedNameImpact, setSelectedNameImpact] = useState("");
    const [fechaInicio, setFechaInicio] = useState(null);
    const [isSelected, setIsSelected] = useState(true);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [selectedMiembrosList, setSelectedMiembrosList] = useState([]); //solo un objeto contiene
    const [selectedMiembrosList1, setSelectedMiembrosList1] = useState([]);
    const [
        selectedMiembrosList1Originales,
        setSelectedMiembrosList1Originales,
    ] = useState([]);
    const [cause, setCause] = useState("");
    const [impactDetail, setImpactDetail] = useState("");
    const [responsePlans, setResponsePlans] = useState([]);
    const [responsePlansOriginales, setResponsePlansOriginales] = useState([]);
    const [contingencyPlans, setContingencyPlans] = useState([]);
    const [contingencyPlansOriginales, setContingencyPlansOriginales] =
        useState([]);

    const isTextTooLong1 = name.length > 400;
    const isTextTooLong2 = detail.length > 400;
    const isTextTooLong3 = cause.length > 400;
    const isTextTooLong4 = impactDetail.length > 400;
    const [quantity1, setQuantity1] = useState(0);
    const [quantity2, setQuantity2] = useState(0);
    const [catalogoRiesgos, setCatalogoRiesgos] = useState(null);

    useEffect(() => {
        if (catalogoRiesgos && catalogoRiesgos.riesgo) {
            const crData = catalogoRiesgos.riesgo;
            console.log("F: La data es:", crData);
            setProbability(crData.idProbabilidad);
            setValorProbability(crData.valorProbabilidad);
            setSelectedNameProbability(crData.nombreProbabilidad);
            setImpact(crData.idImpacto);
            setValorImpact(crData.valorImpacto);
            setSelectedNameImpact(crData.nombreImpacto);
            setName(crData.nombreRiesgo);
            setFechaInicio(
                new Date(crData.fechaIdentificacion).toISOString().split("T")[0]
            );
            console.log("Fecha FORMATO:", new Date(crData.fechaIdentificacion).toISOString().split("T")[0]);
            const miembro = {
                imgLink: crData.imgLink,
                correoElectronico: crData.correoElectronico,
                idUsuario: crData.duenoRiesgo,
                apellidos: crData.apellidos,
                nombres: crData.nombres,
            };
            setSelectedMiembrosList([miembro]);
            setDetail(crData.detalleRiesgo);
            setCause(crData.causaRiesgo);
            setImpactDetail(crData.impactoRiesgo);
            setIsSelected(crData.estado === "Activo" ? true : false);
            setSelectedMiembrosList1(crData.responsables);
            setSelectedMiembrosList1Originales(crData.responsables);
            const responsesPlansOriginal = crData.planRespuesta;
            const responsesPlansActualizados = responsesPlansOriginal.map(
                (responsesPlans) => ({
                    idPlanRespuesta: responsesPlans.idPlanRespuesta || "", // Puedes agregar un valor predeterminado en caso de que falte
                    responsePlans: responsesPlans.descripcion || "", // Puedes agregar un valor predeterminado en caso de que falte
                })
            );
            setResponsePlans(responsesPlansActualizados);
            setResponsePlansOriginales(responsesPlansActualizados);
            setQuantity1(responsesPlansActualizados.length);
            const contingencyPlansOriginal = crData.planContigencia;
            const contingencyPlansActualizados = contingencyPlansOriginal.map(
                (contingencyPlans) => ({
                    idPlanContingencia:
                        contingencyPlans.idPlanContingencia || "", // Puedes agregar un valor predeterminado en caso de que falte
                    contingencyPlans: contingencyPlans.descripcion || "", // Puedes agregar un valor predeterminado en caso de que falte
                })
            );
            setContingencyPlans(contingencyPlansActualizados);
            setContingencyPlansOriginales(contingencyPlansActualizados);
            setQuantity2(contingencyPlansActualizados.length);
            console.log("Terminó de cargar los datos");
            setIsLoadingSmall(false);
        }
    }, [catalogoRiesgos]);

    useEffect(() => {
        const numberPattern = /^\d+$/;
        const editPattern = /^\d+=edit$/;
        let stringURLCR;
        console.log("El keyParamURL es:", keyParamURL);
        if (numberPattern.test(keyParamURL)) {
            console.log("It's a number:", keyParamURL);
            setEditMode(false);
            stringURLCR =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/api/proyecto/catalogoRiesgos/listarunRiesgo/${props.params.updateCR}`;
        } else if (editPattern.test(keyParamURL)) {
            console.log("It's a number followed by '=edit':", keyParamURL);
            setEditMode(true);
            const updateId = parseInt(
                keyParamURL.substring(0, keyParamURL.lastIndexOf("="))
            );
            stringURLCR =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/api/proyecto/catalogoRiesgos/listarunRiesgo/${updateId}`;
        }
        axios
            .get(stringURLCR)
            .then(function (response) {
                const crData = response.data;
                console.log("ID CR:", props.params.updateCR);
                console.log("DATA:", crData);
                setCatalogoRiesgos(crData);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(() => {
                //setIsLoadingSmall(false);
                console.log("Finalizó la carga de datos");
            });
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
            name.trim() === "" ||
            responsePlans.some(
                (responsePlans) => responsePlans.responsePlans.trim() === ""
            ) ||
            contingencyPlans.some(
                (contingencyPlans) =>
                    contingencyPlans.contingencyPlans.trim() === ""
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
        const responsePlansOriginal = responsePlansOriginales;
        const responsePlan = responsePlans;
        const contingencyPlansOriginal = contingencyPlansOriginales;
        const contingencyPlan = contingencyPlans;
        const selectedMiembrosList1Original = selectedMiembrosList1Originales;
        const selectedMiembroList1 = selectedMiembrosList1;
        console.log("Original:", responsePlansOriginal);
        console.log("Nuevo:", responsePlan);
        console.log("Original1:", contingencyPlansOriginal);
        console.log("Nuevo1:", contingencyPlan);
        console.log("Original2:", selectedMiembrosList1Original);
        console.log("Nuevo2:", selectedMiembroList1);
        const {
            modifiedArray: modifiedArray,
            deletedArray: deletedArray,
            addedArray: addedArray,
        } = findModifiedDeletedAdded(
            responsePlansOriginal,
            responsePlan,
            "idPlanRespuesta"
        );

        const {
            modifiedArray: modifiedArray1,
            deletedArray: deletedArray1,
            addedArray: addedArray1,
        } = findModifiedDeletedAdded(
            contingencyPlansOriginal,
            contingencyPlan,
            "idPlanContingencia"
        );

        const {
            modifiedArray: modifiedArray2,
            deletedArray: deletedArray2,
            addedArray: addedArray2,
        } = findModifiedDeletedAdded(
            selectedMiembrosList1Original,
            selectedMiembroList1,
            "idUsuario"
        );

        console.log("Modified:", modifiedArray);
        console.log("Deleted:", deletedArray);
        console.log("Added:", addedArray);
        console.log("Modified1:", modifiedArray1);
        console.log("Deleted1:", deletedArray1);
        console.log("Added1:", addedArray1);
        console.log("Modified2:", modifiedArray2);
        console.log("Deleted2:", deletedArray2);
        console.log("Added2:", addedArray2);

        const putData = {
            idRiesgo: parseInt(props.params.updateCR),
            idProbabilidad: probability,
            idImpacto: impact,
            nombreRiesgo: name,
            fechaIdentificacion: fechaInicio,
            duenoRiesgo: selectedMiembrosList[0].idUsuario,
            detalleRiesgo: detail,
            causaRiesgo: cause,
            impactoRiesgo: impactDetail,
            estado: isSelected ? "Activo" : "Inactivo",
            planesRespuesta: modifiedArray,
            planesContingencia: modifiedArray1,
        };
        console.log("Actualizado correctamente");
        console.log(putData);
        const postData = {
            idRiesgo: parseInt(props.params.updateCR),
            planesRespuesta: addedArray,
            planesContingencia: addedArray1,
            responsables: addedArray2,
        };
        console.log("Agregado correctamente");
        console.log(postData);
        const deleteData = {
            idRiesgo: parseInt(props.params.updateCR),
            planesRespuesta: deletedArray,
            planesContingencia: deletedArray1,
            responsables: deletedArray2,
        };
        console.log("Eliminado correctamente");
        console.log(deleteData);
        axios
            .put(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/catalogoRiesgos/modificarRiesgoRRC",
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
        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/catalogoRiesgos/insertarRRC",
                postData
            )
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
        axios
            .delete(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/catalogoRiesgos/eliminarRRC",
                {
                    data: deleteData,
                }
            )
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

    return (
        <div className="containerRegisterCR">
            <div className="headerRegisterCR">
                Inicio / Proyectos / Nombre del proyecto / Catálogo de Riesgos/
                Registrar riesgo
            </div>
            <div className="riskRegisterCR">
                <div className="flex justify-between items-center">
                    <div className="titleRiskRegisterCR dark:text-white">
                        Actualizar nuevo riesgo
                    </div>
                    <div>
                        {!editMode && (
                            <Button
                                color="primary"
                                onPress={() => {
                                    router.push(
                                        "/dashboard/" +
                                            projectName +
                                            "=" +
                                            projectId +
                                            "/catalogoDeRiesgos/" +
                                            props.params.updateCR +
                                            "=edit"
                                    );
                                }}
                            >
                                Editar
                            </Button>
                        )}
                    </div>
                </div>
                <div>
                    <Textarea
                        isClearable
                        label="Nombre del riesgo"
                        variant={editMode ? "bordered" : "flat"}
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
                        {...(!editMode ? { isReadOnly: true } : {})}
                    />
                </div>
                <div>
                    <Textarea
                        label="Detalle del riesgo"
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
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
                        {...(!editMode ? { isReadOnly: true } : {})}
                    />
                </div>
                <div className="comboCR">
                    <div className="containerComboCR">
                        <IconLabel
                            icon="/icons/probabilityCR.svg"
                            label="Probabilidad"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/catalogoRiesgos/listarProbabilidades"
                            }
                            property="probabilidades"
                            nameDisplay="nombreProbabilidad"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeProbability}
                            onSelectValor={handleSelectedValorChangeProbability}
                            idParam="idProbabilidad"
                            valorParam="valorProbabilidad"
                            initialName={selectedNameProbability}
                            isDisabled={!editMode}
                        />
                    </div>
                    <div className="containerComboCR">
                        <IconLabel
                            icon="/icons/impactCR.svg"
                            label="Impacto"
                            className="iconLabel"
                        />
                        <MyCombobox
                            urlApi={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/catalogoRiesgos/listarImpacto"
                            }
                            property="impacto"
                            nameDisplay="nombreImpacto"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeImpact}
                            onSelectValor={handleSelectedValorChangeImpact}
                            idParam="idImpacto"
                            valorParam="valorImpacto"
                            initialName={selectedNameImpact}
                            isDisabled={!editMode}
                        />
                    </div>
                    <div className="containerComboCR">
                        <IconLabel
                            icon="/icons/datePB.svg"
                            label="Fecha identificada"
                            className="iconLabel"
                        />
                        <Input
                            type="date"
                            isRequired
                            variant={editMode ? "bordered" : "flat"}
                            radius="sm"
                            className="w-64"
                            name="datepicker"
                            value={fechaInicio}
                            onValueChange={setFechaInicio}
                            {...(!editMode ? { isReadOnly: true } : {})}
                        ></Input>
                    </div>
                    <div className="containerComboCR">
                        <IconLabel
                            icon="/icons/severityCR.svg"
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
                            icon="/icons/statePB.svg"
                            label="Estado"
                            className="iconLabel"
                        />
                        <Switch
                            isSelected={isSelected}
                            onValueChange={setIsSelected}
                            {...(!editMode
                                ? { isDisabled: true }
                                : { isDisabled: false })}
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
                            isDisabled={!editMode}
                        />
                        {selectedMiembrosList.length > 0 ? (
                            selectedMiembrosList.map((component) => (
                                <div className="iconLabel2CR">
                                    <Avatar
                                        className="transition-transform w-[2.5rem] min-w-[2.5rem] h-[2.5rem] min-h-[2.5rem]"
                                        src={component.imgLink}
                                        fallback={
                                            <p className="profilePicCR">
                                                {(component.nombres !== null
                                                    ? component.nombres[0]
                                                    : "") +
                                                    (component.apellidos !==
                                                    null
                                                        ? component.apellidos[0]
                                                        : "")}
                                            </p>
                                        }
                                    />
                                    <div className="labelDatoUsuarioCR">
                                        {capitalizeWords(
                                            `${
                                                component.nombres != null
                                                    ? component.nombres
                                                    : ""
                                            } ${
                                                component.apellidos !== null
                                                    ? component.apellidos
                                                    : ""
                                            }`
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
                <div className="titleButtonCR">
                    <h4 style={{ fontWeight: 600 }}>
                        Responsables del riesgo
                    </h4>
                </div>
                <div className="containerResponsables">
                    <ButtonIconLabel
                        icon="/icons/icon-searchBar.svg"
                        label1="Buscar"
                        label2="responsables"
                        className="iconLabelButtonMC"
                        onClickFunction={toggleModal1}
                        isDisabled={!editMode}
                    />
                    <div className="containerUserMultipleGrid">
                        {selectedMiembrosList1.length > 0 ? (
                            selectedMiembrosList1.map((component) => (
                                <div className="containerUserMultiple">
                                    <div className="iconLabel3CR">
                                        <Avatar
                                            className="transition-transform w-[2.5rem] min-w-[2.5rem] h-[2.5rem] min-h-[2.5rem]"
                                            src={component.imgLink}
                                            fallback={
                                                <p className="profilePicCR">
                                                    {component.nombres[0] +
                                                        (component.apellidos !==
                                                        null
                                                            ? component
                                                                  .apellidos[0]
                                                            : "")}
                                                </p>
                                            }
                                        />
                                        <div className="labelDatoUsuarioCR">
                                            {capitalizeWords(
                                                `${component.nombres} ${
                                                    component.apellidos !== null
                                                        ? component.apellidos
                                                        : ""
                                                }`
                                            )}
                                        </div>
                                    </div>
                                    {editMode && (
                                        <img
                                            src="/icons/icon-trash.svg"
                                            alt="delete"
                                            className="mb-4 cursor-pointer mr-2"
                                            onClick={() => {
                                                removeUser(component);
                                            }}
                                        />
                                    )}
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
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
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
                        {...(!editMode ? { isReadOnly: true } : {})}
                    />
                </div>
                <div>
                    <Textarea
                        isClearable
                        label="Impacto"
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
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
                        {...(!editMode ? { isReadOnly: true } : {})}
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
                                isDisabled={!editMode}
                            />
                        ))
                    )}
                    {editMode && (
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
                    )}
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
                                isDisabled={!editMode}
                            />
                        ))
                    )}
                    {editMode && (
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
                    )}
                </div>
                <div className="containerBottomCR">
                    {editMode && (
                        <div className="twoButtonsCR">
                            <div className="buttonContainerCR">
                                <Modal
                                    nameButton="Descartar"
                                    textHeader="Descartar Actualización"
                                    textBody="¿Seguro que quiere descartar la cactualización de la información?"
                                    colorButton="w-36 bg-slate-100 text-black"
                                    oneButton={false}
                                    secondAction={() =>
                                        router.push(
                                            "/dashboard/" +
                                                projectName +
                                                "=" +
                                                projectId +
                                                "/catalogoDeRiesgos"
                                        )
                                    }
                                    textColor="red"
                                />
                                <Modal
                                    nameButton="Aceptar"
                                    textHeader="Actualizar Información"
                                    textBody="¿Seguro que quiere actualizar la información?"
                                    colorButton="w-36 bg-blue-950 text-white"
                                    oneButton={false}
                                    secondAction={() => {
                                        onSubmit();
                                        router.push(
                                            "/dashboard/" +
                                                projectName +
                                                "=" +
                                                projectId +
                                                "/catalogoDeRiesgos"
                                        );
                                    }}
                                    textColor="blue"
                                    verifyFunction={() => {
                                        if (
                                            verifyFieldsEmpty() &&
                                            verifyFieldsExcessive()
                                        ) {
                                            toast.error(
                                                "Faltan completar campos y se excedió el límite de caractéres"
                                            );
                                            return false;
                                        } else if (
                                            verifyFieldsEmpty() &&
                                            !verifyFieldsExcessive()
                                        ) {
                                            toast.error(
                                                "Faltan completar campos"
                                            );
                                            return false;
                                        } else if (
                                            verifyFieldsExcessive() &&
                                            !verifyFieldsEmpty()
                                        ) {
                                            toast.error(
                                                "Se excedió el límite de caractéres"
                                            );
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    )}
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
            <Toaster
                position="bottom-left"
                richColors
                theme={"light"}
                closeButton={true}
                toastOptions={{
                    style: { fontSize: "1rem" },
                }}
            />
        </div>
    );
}
