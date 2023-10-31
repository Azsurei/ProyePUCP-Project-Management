"use client";
import "@/styles/dashboardStyles/projectStyles/catalogoDeInteresadosStyles/registerCI.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { SmallLoadingScreen } from "../../layout";
import { Textarea, Input, Button } from "@nextui-org/react";
import MyCombobox from "@/components/ComboBox";
import { useRouter } from "next/navigation";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/IconLabel";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import ContainerRequirementsCI from "@/components/dashboardComps/projectComps/catalogoDeInteresadosComps/ContainerRequirementsCI";
import ContainerStrategiesCI from "@/components/dashboardComps/projectComps/catalogoDeInteresadosComps/ContainerStrategiesCI";
import MailIcon from "@/components/dashboardComps/projectComps/catalogoDeInteresadosComps/MailIcon";
import { Toaster, toast } from "sonner";

axios.defaults.withCredentials = true;
export default function CatalogoDeInteresadosRegister(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    console.log("El id del proyecto es:", projectId);
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [organization, setOrganization] = useState("");
    const [charge, setCharge] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [contactInformation, setContactInformation] = useState("");
    const [autority, setAutority] = useState(null);
    const [currentAdhesion, setCurrentAdhesion] = useState(null);
    const [futureAdhesion, setFutureAdhesion] = useState(null);
    const [requirements, setRequirements] = useState([]);
    const [strategies, setStrategies] = useState([]);

    const isTextTooLong1 = name.length > 100;
    const isTextTooLong2 = role.length > 100;
    const isTextTooLong3 = organization.length > 100;
    const isTextTooLong4 = charge.length > 100;
    const isTextTooLong5 = contactInformation.length > 400;
    const isTextTooLong6 = email.length > 100;
    const isTextTooLong7 = phone.length > 100;
    const [fieldsEmpty, setFieldsEmpty] = useState(false);
    const [fieldsExcessive, setFieldsExcessive] = useState(false);
    const [quantity1, setQuantity1] = useState(0);
    const [quantity2, setQuantity2] = useState(0);
    const [catalogoInteresados, setCatalogoInteresados] = useState(null);

    useEffect(() => {
        const stringURLCI =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            `/api/proyecto/catalogoRiesgos/listarunRiesgo/${props.params.updateCI}`;
        axios
            .get(stringURLCI)
            .then(function (response) {
                const ciData = response.data;
                console.log("ID CI:", props.params.updateCI);
                console.log("DATA:", ciData);
                setCatalogoRiesgos(ciData);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(() => {
                //setIsLoadingSmall(false);
                console.log("Finalizó la carga de datos");
            });
    }, []);

    useEffect(() => {
        if (catalogoInteresados && catalogoInteresados.riesgo) {
            const ciData = catalogoInteresados.riesgo;
            console.log("F: La data es:", ciData);
            setProbability(ciData.idProbabilidad);
            setValorProbability(ciData.valorProbabilidad);
            setSelectedNameProbability(ciData.nombreProbabilidad);
            setImpact(ciData.idImpacto);
            setValorImpact(ciData.valorImpacto);
            setSelectedNameImpact(ciData.nombreImpacto);
            setName(ciData.nombreRiesgo);
            setFechaInicio(
                new Date(ciData.fechaIdentificacion).toISOString().split("T")[0]
            );
            const miembro = {
                correoElectronico: ciData.correoElectronico,
                idUsuario: ciData.duenoRiesgo,
                apellidos: ciData.apellidos,
                nombres: ciData.nombres,
            };
            setSelectedMiembrosList([miembro]);
            setDetail(ciData.detalleRiesgo);
            setCause(ciData.causaRiesgo);
            setImpactDetail(ciData.impactoRiesgo);
            setIsSelected(ciData.estado === "Activo" ? true : false);
            setSelectedMiembrosList1(ciData.responsables);
            setSelectedMiembrosList1Originales(ciData.responsables);
            const responsesPlansOriginal = ciData.planRespuesta;
            const responsesPlansActualizados = responsesPlansOriginal.map(
                (responsesPlans) => ({
                    idPlanRespuesta: responsesPlans.idPlanRespuesta || "", // Puedes agregar un valor predeterminado en caso de que falte
                    responsePlans: responsesPlans.descripcion || "", // Puedes agregar un valor predeterminado en caso de que falte
                })
            );
            setResponsePlans(responsesPlansActualizados);
            setResponsePlansOriginales(responsesPlansActualizados);
            setQuantity1(responsesPlansActualizados.length);
            const contingencyPlansOriginal = ciData.planContigencia;
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
    }, [catalogoInteresados]);

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
            name === "" ||
            requirements.some(
                (requirements) => requirements.requirements === ""
            ) ||
            strategies.some((strategies) => strategies.strategies === "")
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

    const onSubmit = () => {
        const postData = {
            idProyecto: parseInt(projectId),
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
            requeriments: requirements,
            strategies: strategies,
        };
        console.log("El postData es :", postData);
        /*         axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL+"/api/proyecto/catalogoRiesgos/insertarRiesgo",
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
            }); */
    };

    return (
        <div className="containerRegisterCI">
            <div className="headerRegisterCI">
                Inicio / Proyectos / Nombre del proyecto / Catálogo de
                Interesados/ Registrar interesado
            </div>
            <div className="interesedRegisterCI">
                <div className="titleInteresedRegisterCI">
                    Registrar nuevo interesado
                </div>
                <div className="containerInputCI">
                    <Input
                        isClearable
                        label="Nombre completo"
                        variant="bordered"
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
                    />
                    <Input
                        isClearable
                        label="Rol en el proyecto"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
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
                    />
                    <Input
                        isClearable
                        label="Organización"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
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
                    />
                    <Input
                        isClearable
                        label="Cargo"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
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
                    />
                    <Input
                        isClearable
                        type="email"
                        label="Correo electrónico"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        startContent={
                            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        isRequired
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
                    />
                    <Input
                        isClearable
                        type="tel"
                        label="Número de teléfono"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
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
                    />
                </div>
                <div>
                    <Textarea
                        label="Otros datos de contacto"
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        isRequired
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
                            initialName="Seleccione un nivel"
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
                            initialName="Seleccione un nivel"
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
                            initialName="Seleccione un nivel"
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
                            />
                        ))
                    )}
                    <div className="twoButtonsCI">
                        <div className="buttonContainerCI">
                            <Button
                                onClick={addContainer1}
                                className="buttonTitleCI"
                                type="button"
                            >
                                Agregar
                            </Button>
                        </div>
                    </div>
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
                            />
                        ))
                    )}
                    <div className="twoButtonsCI">
                        <div className="buttonContainerCI">
                            <Button
                                onClick={addContainer2}
                                className="buttonTitleCI2"
                                type="button"
                            >
                                Agregar
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="containerBottomCI">
                    <div className="twoButtonsCI">
                        <div className="buttonContainerCI">
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
                                    //router.back();
                                }}
                                textColor="blue"
                                verifyFunction={() => {
                                    if (
                                        verifyFieldsEmpty() &&
                                        verifyFieldsExcessive()
                                    ) {
                                        toast.error("Faltan completar campos y se excedió el límite de caractéres")
                                        return false;
                                    } else if (
                                        verifyFieldsEmpty() &&
                                        !verifyFieldsExcessive()
                                    ) {
                                        toast.error("Faltan completar campos")
                                        return false;
                                    } else if (
                                        verifyFieldsExcessive() &&
                                        !verifyFieldsEmpty()
                                    ) {
                                        toast.error("Se excedió el límite de caractéres")
                                        return false;
                                    } else {
                                        return true;
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
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
