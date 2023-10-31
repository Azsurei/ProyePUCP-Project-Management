"use client";
import "@/styles/dashboardStyles/projectStyles/catalogoDeInteresadosStyles/registerCI.css";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { SmallLoadingScreen } from "../../layout";
import { Textarea } from "@nextui-org/react";
import MyCombobox from "@/components/ComboBox";
import { useRouter } from "next/navigation";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/IconLabel";
import { Input } from "@nextui-org/react";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import ContainerRequirementsCI from "@/components/dashboardComps/projectComps/catalogoDeInteresadosComps/ContainerRequirementsCI";

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
    const [fieldsEmpty, setFieldsEmpty] = useState(false);
    const [fieldsExcessive, setFieldsExcessive] = useState(false);
    const [quantity1, setQuantity1] = useState(0);
    const [quantity2, setQuantity2] = useState(0);

    useEffect(() => {
        setIsLoadingSmall(false);
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

    const updateRequirementsField = (index, value) => {
        setRequirements((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index - 1].requirements = value;
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
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
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
                </div>
                <div>
                    <Textarea
                        label="Datos de contacto"
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
                            icon="/icons/probabilityCR.svg"
                            label="Nivel de autoridad"
                            className="iconLabel4"
                        />
                        <MyCombobox
                            urlApi={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/catalogoRiesgos/listarProbabilidades"
                            }
                            property="probabilidades"
                            nameDisplay="nombreProbabilidad"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeAutority}
                            idParam="idProbabilidad"
                            initialName="Seleccione un nivel"
                        />
                    </div>
                    <div className="containerComboCI">
                        <IconLabel
                            icon="/icons/probabilityCR.svg"
                            label="Nivel de adhesión actual"
                            className="iconLabel4"
                        />
                        <MyCombobox
                            urlApi={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/catalogoRiesgos/listarProbabilidades"
                            }
                            property="probabilidades"
                            nameDisplay="nombreProbabilidad"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeCurrentAdhesion}
                            idParam="idProbabilidad"
                            initialName="Seleccione un nivel"
                        />
                    </div>
                    <div className="containerComboCI">
                        <IconLabel
                            icon="/icons/probabilityCR.svg"
                            label="Nivel de adhesión deseado"
                            className="iconLabel4"
                        />
                        <MyCombobox
                            urlApi={
                                process.env.NEXT_PUBLIC_BACKEND_URL +
                                "/api/proyecto/catalogoRiesgos/listarProbabilidades"
                            }
                            property="probabilidades"
                            nameDisplay="nombreProbabilidad"
                            hasColor={false}
                            onSelect={handleSelectedValueChangeFutureAdhesion}
                            idParam="idProbabilidad"
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
                            <div>
                                ¡Puede agregar algunos requerimientos!
                            </div>
                        </div>
                    ) : (
                        requirements.map((requirements, index) => (
                            <ContainerRequirementsCI
                                key={index}
                                indice={index + 1}
                                updateRequirementsField={updateRequirementsField}
                                requirements={requirements}
                                functionRemove={removeContainer1}
                            />
                        ))
                    )}
                    <div className="twoButtonsCI">
                        <div className="buttonContainerCI">
                            <button
                                onClick={addContainer1}
                                className="buttonTitleCI"
                                type="button"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
