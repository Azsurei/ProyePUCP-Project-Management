"use client";
import "@/styles/dashboardStyles/projectStyles/catalogoDeInteresadosStyles/registerCI.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { HerramientasInfo, SmallLoadingScreen } from "../../layout";
import { Textarea, Input, Button } from "@nextui-org/react";
import MyCombobox from "@/components/ComboBox";
import { useRouter } from "next/navigation";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/IconLabel";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import ContainerRequirementsCI from "@/components/dashboardComps/projectComps/catalogoDeInteresadosComps/ContainerRequirementsCI";
import ContainerStrategiesCI from "@/components/dashboardComps/projectComps/catalogoDeInteresadosComps/ContainerStrategiesCI";
import MailIcon from "@/components/dashboardComps/projectComps/catalogoDeInteresadosComps/MailIcon";
import ListAdditionalFields, {
    getAdditionalFields,
    registerAdditionalFields,
} from "@/components/ListAdditionalFields";
import { Toaster, toast } from "sonner";

axios.defaults.withCredentials = true;
export default function CatalogoDeInteresadosRegister(props) {
    const keyParamURL = decodeURIComponent(props.params.updateCI);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    console.log("El id del proyecto es:", projectId);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const { herramientasInfo } = useContext(HerramientasInfo);
    const idCatalogoDeInteresados = herramientasInfo.find(
        (herramienta) => herramienta.idHerramienta === 6
    ).idHerramientaCreada;
    const router = useRouter();
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [organization, setOrganization] = useState("");
    const [charge, setCharge] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [contactInformation, setContactInformation] = useState("");
    const [autority, setAutority] = useState(null);
    const [selectedNameAutority, setSelectedNameAutority] = useState("");
    const [currentAdhesion, setCurrentAdhesion] = useState(null);
    const [selectedNameCurrentAdhesion, setSelectedNameCurrentAdhesion] =
        useState("");
    const [futureAdhesion, setFutureAdhesion] = useState(null);
    const [selectedNameFutureAdhesion, setSelectedNameFutureAdhesion] =
        useState("");
    const [requirements, setRequirements] = useState([]);
    const [requirementsOriginales, setRequirementsOriginales] = useState([]);
    const [strategies, setStrategies] = useState([]);
    const [strategiesOriginales, setStrategiesOriginales] = useState([]);

    const isTextTooLong1 = name.length > 100;
    const isTextTooLong2 = role.length > 100;
    const isTextTooLong3 = organization.length > 100;
    const isTextTooLong4 = charge.length > 100;
    const isTextTooLong5 = contactInformation.length > 400;
    const isTextTooLong6 = email.length > 100;
    const isTextTooLong7 = phone.length > 100;
    const [quantity1, setQuantity1] = useState(0);
    const [quantity2, setQuantity2] = useState(0);
    const [catalogoInteresados, setCatalogoInteresados] = useState(null);
    const [listAdditionalFields, setListAdditionalFields] = useState([]);

    function PlusIcon() {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        );
    }

    useEffect(() => {
        if (
            catalogoInteresados &&
            catalogoInteresados.interesado &&
            catalogoInteresados.requeriments &&
            catalogoInteresados.strategies
        ) {
            const ciData = catalogoInteresados.interesado[0];
            const ciData1 = catalogoInteresados.requeriments;
            const ciData2 = catalogoInteresados.strategies;
            console.log("F: La data es:", ciData);
            setAutority(ciData.idNivelAutoridad);
            setSelectedNameAutority(ciData.nombreAutoridad);
            setCurrentAdhesion(ciData.idNivelAdhesionActual);
            setSelectedNameCurrentAdhesion(ciData.nombreAdhesionActual);
            setFutureAdhesion(ciData.idNivelAdhesionDeseado);
            setSelectedNameFutureAdhesion(ciData.nombreAdhesionDeseado);
            setName(ciData.nombreCompleto);
            setRole(ciData.rolEnProyecto);
            setOrganization(ciData.organizacion);
            setCharge(ciData.cargo);
            setEmail(ciData.correo);
            setPhone(ciData.telefono);
            setContactInformation(ciData.datosContacto);

            const requirementsOriginal = ciData1;
            const requirementsActualizados = requirementsOriginal.map(
                (requirement) => ({
                    idRequirements: requirement.idRequerimiento || "", // Puedes agregar un valor predeterminado en caso de que falte
                    requirements: requirement.descripcion || "", // Puedes agregar un valor predeterminado en caso de que falte
                })
            );
            setRequirements(requirementsActualizados);
            setRequirementsOriginales(requirementsActualizados);
            setQuantity1(requirementsActualizados.length);

            const strategiesOriginal = ciData2;
            const strategiesActualizados = strategiesOriginal.map(
                (strategy) => ({
                    idStrategies: strategy.idEstrategia || "", // Puedes agregar un valor predeterminado en caso de que falte
                    strategies: strategy.descripcion || "", // Puedes agregar un valor predeterminado en caso de que falte
                })
            );
            setStrategies(strategiesActualizados);
            setStrategiesOriginales(strategiesActualizados);
            setQuantity2(strategiesActualizados.length);
            console.log("Terminó de cargar los datos");
            setIsLoadingSmall(false);
        }
        getAdditionalFields(
            idCatalogoDeInteresados,
            6,
            setListAdditionalFields,
            (response) => {
                console.log("response", response);
                setIsLoadingSmall(false);
            }
        );
    }, [catalogoInteresados]);

    useEffect(() => {
        const numberPattern = /^\d+$/;
        const editPattern = /^\d+=edit$/;
        let stringURLCI;
        console.log("El keyParamURL es:", keyParamURL);
        if (numberPattern.test(keyParamURL)) {
            console.log("It's a number:", keyParamURL);
            setEditMode(false);
            stringURLCI =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/api/proyecto/catalogoInteresados/listarInteresado/${props.params.updateCI}`;
        } else if (editPattern.test(keyParamURL)) {
            console.log("It's a number followed by '=edit':", keyParamURL);
            setEditMode(true);
            const updateId = parseInt(
                keyParamURL.substring(0, keyParamURL.lastIndexOf("="))
            );
            stringURLCI =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/api/proyecto/catalogoInteresados/listarInteresado/${updateId}`;
        }

        axios
            .get(stringURLCI)
            .then(function (response) {
                const ciData = response.data;
                console.log("ID CI:", props.params.updateCI);
                console.log("DATA:", ciData);
                setCatalogoInteresados(ciData);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(() => {
                //setIsLoadingSmall(false);
                console.log("Finalizó la carga de datos");
            });
    }, []);

    const handleSelectedValueChangeAutority = (value) => {
        setAutority(value);
    };

    const handleSelectedValueChangeCurrentAdhesion = (value) => {
        setCurrentAdhesion(value);
    };

    const handleSelectedValueChangeFutureAdhesion = (value) => {
        setFutureAdhesion(value);
    };

    function addContainer1() {
        setRequirements([
            ...requirements,
            {
                idRequirements: `a${quantity1}`,
                requirements: "",
            },
        ]);
        setQuantity1(quantity1 + 1);
    }

    function addContainer2() {
        setStrategies([
            ...strategies,
            {
                idStrategies: `a${quantity2}`,
                strategies: "",
            },
        ]);
        setQuantity2(quantity2 + 1);
    }

    const updateRequirementsField = (index, value) => {
        setRequirements((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index - 1].requirements = value;
            return updatedFields;
        });
    };

    const updateStrategiesField = (index, value) => {
        setStrategies((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index - 1].strategies = value;
            return updatedFields;
        });
    };

    function removeContainer1(indice) {
        setQuantity1(quantity1 - 1);
        setRequirements((prevFields) => {
            const updatedFields = [...prevFields];
            // Elimina el elemento con el índice proporcionado
            updatedFields.splice(indice, 1);
            return updatedFields;
        });
    }

    function removeContainer2(indice) {
        setQuantity2(quantity2 - 1);
        setStrategies((prevFields) => {
            const updatedFields = [...prevFields];
            // Elimina el elemento con el índice proporcionado
            updatedFields.splice(indice, 1);
            return updatedFields;
        });
    }

    function verifyFieldsEmpty() {
        return (
            name.trim() === "" ||
            requirements.some(
                (requirements) => requirements.requirements.trim() === ""
            ) ||
            strategies.some((strategies) => strategies.strategies.trim() === "")
        );
    }

    function verifyFieldsExcessive() {
        return (
            name.length > 100 ||
            role.length > 100 ||
            organization.length > 100 ||
            charge.length > 100 ||
            email.length > 100 ||
            phone.length > 100 ||
            contactInformation.length > 400 ||
            requirements.some(
                (requirements) => requirements.requirements.length > 400
            ) ||
            strategies.some((strategies) => strategies.strategies.length > 400)
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
        console.log("Original:", requirementsOriginales);
        console.log("Nuevo:", requirements);
        console.log("Original1:", strategiesOriginales);
        console.log("Nuevo1:", strategies);
        const {
            modifiedArray: modifiedArray,
            deletedArray: deletedArray,
            addedArray: addedArray,
        } = findModifiedDeletedAdded(
            requirementsOriginales,
            requirements,
            "idRequirements"
        );

        const {
            modifiedArray: modifiedArray1,
            deletedArray: deletedArray1,
            addedArray: addedArray1,
        } = findModifiedDeletedAdded(
            strategiesOriginales,
            strategies,
            "idStrategies"
        );

        console.log("Modified:", modifiedArray);
        console.log("Deleted:", deletedArray);
        console.log("Added:", addedArray);
        console.log("Modified1:", modifiedArray1);
        console.log("Deleted1:", deletedArray1);
        console.log("Added1:", addedArray1);

        const putData = {
            idInteresado: parseInt(props.params.updateCI),
            idAutoridad: autority,
            idAdhesionActual: currentAdhesion,
            idAdhesionDeseada: futureAdhesion,
            nombre: name,
            rol: role,
            organizacion: organization,
            cargo: charge,
            correoElectronico: email,
            numeroTelefono: phone,
            informacionContacto: contactInformation,
            requeriments: modifiedArray,
            strategies: modifiedArray1,
        };
        console.log("Actualizado correctamente");
        console.log(putData);
        const postData = {
            idInteresado: parseInt(props.params.updateCI),
            requeriments: addedArray,
            strategies: addedArray1,
        };
        console.log("Agregado correctamente");
        console.log(postData);
        const deleteData = {
            idInteresado: parseInt(props.params.updateCI),
            requeriments: deletedArray,
            strategies: deletedArray1,
        };
        console.log("Eliminado correctamente");
        console.log(deleteData);

        axios
            .put(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/catalogoInteresados/modificarInteresados",
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
                    "/api/proyecto/catalogoInteresados/insertarRequirementStrategies",
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
                    "/api/proyecto/catalogoInteresados/eliminarRequirementStrategies",
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

        registerAdditionalFields(
            listAdditionalFields,
            idCatalogoDeInteresados,
            6,
            1,
            (response) => {
                console.log("response", response);
            }
        );
    };

    return (
        <div className="containerRegisterCI">
            <div className="headerRegisterCI">
                Inicio / Proyectos / Nombre del proyecto / Catálogo de
                Interesados/ Actualizar interesado
            </div>
            <div className="interesedRegisterCI">
                <div className="flex justify-between items-center">
                    <div className="titleInteresedRegisterCI">
                        Actualizar interesado
                    </div>
                    <div>
                        {!editMode && (
                            <Button
                                color="primary"
                                onPress={() => {
                                    setIsLoadingSmall(true);
                                    router.push(
                                        "/dashboard/" +
                                            projectName +
                                            "=" +
                                            projectId +
                                            "/catalogoDeInteresados/" +
                                            props.params.updateCI +
                                            "=edit"
                                    );
                                }}
                            >
                                Editar
                            </Button>
                        )}
                    </div>
                </div>
                <div className="containerInputCI">
                    <Input
                        {...(editMode ? { isClearable: true } : {})}
                        label="Nombre completo"
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
                        className="custom-labelCI"
                        value={name}
                        onValueChange={setName}
                        maxLength="105"
                        isInvalid={isTextTooLong1}
                        errorMessage={
                            isTextTooLong1
                                ? "El texto debe ser como máximo de 100 caracteres."
                                : ""
                        }
                        {...(!editMode ? { isReadOnly: true } : {})}
                    />
                    <Input
                        {...(editMode ? { isClearable: true } : {})}
                        label="Rol en el proyecto"
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        className="custom-labelCI"
                        value={role}
                        onValueChange={setRole}
                        maxLength="105"
                        isInvalid={isTextTooLong2}
                        errorMessage={
                            isTextTooLong2
                                ? "El texto debe ser como máximo de 100 caracteres."
                                : ""
                        }
                        {...(!editMode ? { isReadOnly: true } : {})}
                    />
                    <Input
                        {...(editMode ? { isClearable: true } : {})}
                        label="Organización"
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        className="custom-labelCI"
                        value={organization}
                        onValueChange={setOrganization}
                        maxLength="105"
                        isInvalid={isTextTooLong3}
                        errorMessage={
                            isTextTooLong3
                                ? "El texto debe ser como máximo de 100 caracteres."
                                : ""
                        }
                        {...(!editMode ? { isReadOnly: true } : {})}
                    />
                    <Input
                        {...(editMode ? { isClearable: true } : {})}
                        label="Cargo"
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        className="custom-labelCI"
                        value={charge}
                        onValueChange={setCharge}
                        maxLength="105"
                        isInvalid={isTextTooLong4}
                        errorMessage={
                            isTextTooLong4
                                ? "El texto debe ser como máximo de 100 caracteres."
                                : ""
                        }
                        {...(!editMode ? { isReadOnly: true } : {})}
                    />
                    <Input
                        {...(editMode ? { isClearable: true } : {})}
                        type="email"
                        label="Correo electrónico"
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        startContent={
                            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        className="custom-labelCI"
                        value={email}
                        onValueChange={setEmail}
                        maxLength="105"
                        isInvalid={isTextTooLong6}
                        errorMessage={
                            isTextTooLong6
                                ? "El texto debe ser como máximo de 100 caracteres."
                                : ""
                        }
                        {...(!editMode ? { isReadOnly: true } : {})}
                    />
                    <Input
                        {...(editMode ? { isClearable: true } : {})}
                        type="tel"
                        label="Número de teléfono"
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        className="custom-labelCI"
                        value={phone}
                        onValueChange={setPhone}
                        maxLength="105"
                        isInvalid={isTextTooLong7}
                        errorMessage={
                            isTextTooLong7
                                ? "El texto debe ser como máximo de 100 caracteres."
                                : ""
                        }
                        {...(!editMode ? { isReadOnly: true } : {})}
                    />
                </div>
                <div>
                    <Textarea
                        label="Otros datos de contacto"
                        variant={editMode ? "bordered" : "flat"}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        className="custom-labelCI"
                        minRows="5"
                        maxRows="7"
                        value={contactInformation}
                        onValueChange={setContactInformation}
                        maxLength="450"
                        isInvalid={isTextTooLong5}
                        errorMessage={
                            isTextTooLong5
                                ? "El texto debe ser como máximo de 400 caracteres."
                                : ""
                        }
                        {...(!editMode ? { isReadOnly: true } : {})}
                    />
                </div>
                <div className="comboCI">
                    <div className="containerComboCI">
                        <IconLabel
                            icon="/icons/authorityIcon.svg"
                            label="Nivel de autoridad"
                            className="iconLabel4"
                        />
                        <MyCombobox
                            urlApi={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/catalogoInteresados/listarAutoridad"
                            }
                            property="autoridades"
                            nameDisplay="nombreAutoridad"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeAutority}
                            idParam="idInteresadoAutoridad"
                            initialName={selectedNameAutority}
                            isDisabled={!editMode}
                        />
                    </div>
                    <div className="containerComboCI">
                        <IconLabel
                            icon="/icons/adhesionIcon.svg"
                            label="Nivel de adhesión actual"
                            className="iconLabel4"
                        />
                        <MyCombobox
                            urlApi={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/catalogoInteresados/listarAdhesion"
                            }
                            property="adhesiones"
                            nameDisplay="nombreAdhesion"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeCurrentAdhesion}
                            idParam="idInteresadoAdhesionActual"
                            initialName={selectedNameCurrentAdhesion}
                            isDisabled={!editMode}
                        />
                    </div>
                    <div className="containerComboCI">
                        <IconLabel
                            icon="/icons/adhesionIcon.svg"
                            label="Nivel de adhesión deseado"
                            className="iconLabel4"
                        />
                        <MyCombobox
                            urlApi={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/catalogoInteresados/listarAdhesion"
                            }
                            property="adhesiones"
                            nameDisplay="nombreAdhesion"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeFutureAdhesion}
                            idParam="idInteresadoAdhesionActual"
                            initialName={selectedNameFutureAdhesion}
                            isDisabled={!editMode}
                        />
                    </div>
                </div>
                <div>
                    <div className="titleButtonCI">
                        <h4 style={{ fontWeight: 600 }}>Requerimientos</h4>
                    </div>
                    {quantity1 === 0 ? (
                        <div className="flex justify-center items-center">
                            <div>¡Puede agregar algunos requerimientos!</div>
                        </div>
                    ) : (
                        requirements.map((requirements, index) => (
                            <ContainerRequirementsCI
                                key={index}
                                indice={index + 1}
                                updateRequirementsField={
                                    updateRequirementsField
                                }
                                requirements={requirements}
                                functionRemove={removeContainer1}
                                isDisabled={!editMode}
                            />
                        ))
                    )}
                    {editMode === true && (
                        <div className="twoButtonsCI">
                            <div className="buttonContainerCI">
                                <Button
                                    onClick={addContainer1}
                                    color="warning"
                                    className="font-semibold text-white"
                                    endContent={<PlusIcon />}
                                >
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <div className="titleButtonCI">
                        <h4 style={{ fontWeight: 600 }}>Estrategias</h4>
                    </div>
                    {quantity2 === 0 ? (
                        <div className="flex justify-center items-center">
                            <div>¡Puede agregar algunas estrategias!</div>
                        </div>
                    ) : (
                        strategies.map((strategies, index) => (
                            <ContainerStrategiesCI
                                key={index}
                                indice={index + 1}
                                updateStrategiesField={updateStrategiesField}
                                strategies={strategies}
                                functionRemove={removeContainer2}
                                isDisabled={!editMode}
                            />
                        ))
                    )}
                    {editMode === true && (
                        <div className="twoButtonsCI">
                            <div className="buttonContainerCI">
                                <Button
                                    onClick={addContainer2}
                                    color="warning"
                                    className="font-semibold text-white"
                                    endContent={<PlusIcon />}
                                >
                                    Agregar
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <div className="flex items-center text-[16px] font-semibold mb-1">
                        Campos Adicionales
                    </div>
                    <ListAdditionalFields
                        editState={editMode}
                        baseFields={listAdditionalFields}
                        setBaseFields={setListAdditionalFields}
                    />
                </div>
                <div className="containerBottomCI">
                    {editMode === true && (
                        <div className="flex justify-end flex-1">
                            <div className="buttonContainerCI">
                                <Modal
                                    nameButton="Descartar"
                                    textHeader="Descartar Registro"
                                    textBody="¿Seguro que quiere descartar el registro de la información?"
                                    colorButton="w-36 bg-slate-100 text-black"
                                    oneButton={false}
                                    secondAction={() =>
                                        router.push(
                                            "/dashboard/" +
                                                projectName +
                                                "=" +
                                                projectId +
                                                "/catalogoDeInteresados"
                                        )
                                    }
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
                                        router.push(
                                            "/dashboard/" +
                                                projectName +
                                                "=" +
                                                projectId +
                                                "/catalogoDeInteresados"
                                        );
                                    }}
                                    textColor="blue"
                                    verifyFunction={() => {
                                        if (
                                            verifyFieldsEmpty() &&
                                            verifyFieldsExcessive()
                                        ) {
                                            toast.error(
                                                "Faltan completar campos y se excedió el límite de caractéres",
                                                { position: "bottom-left" }
                                            );
                                            return false;
                                        } else if (
                                            verifyFieldsEmpty() &&
                                            !verifyFieldsExcessive()
                                        ) {
                                            toast.error(
                                                "Faltan completar campos",
                                                {
                                                    position: "bottom-left",
                                                }
                                            );
                                            return false;
                                        } else if (
                                            verifyFieldsExcessive() &&
                                            !verifyFieldsEmpty()
                                        ) {
                                            toast.error(
                                                "Se excedió el límite de caractéres",
                                                { position: "bottom-left" }
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
        </div>
    );
}
