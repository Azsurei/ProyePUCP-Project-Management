"use client";

import React, { useState, useEffect, useContext } from "react";
import Card from "@/components/Card";
import CardParticipantes from "@/components/equipoComps/CardParticipantes";
import axios from "axios";
import TextField from "@/components/TextField";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
import "@/styles/dashboardStyles/projectStyles/EquipoStyles/CrearEquipo.css";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";
import ChoiceUser from "@/components/dashboardComps/projectComps/projectCreateComps/ChoiceUser";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import { SmallLoadingScreen } from "../../layout";
import { Input } from "@nextui-org/react";
import ModalUser from "@/components/dashboardComps/projectComps/projectCreateComps/ModalUsers";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/ChoiceUser.css";
import CardSelectedUser from "@/components/CardSelectedUser";
import ModalUsersOne from "@/components/ModalUsersOne";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/IconLabel";
import { useRouter } from "next/navigation";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import MyCombobox from "@/components/ComboBox";
import PopUpRolEquipo from "@/components/equipoComps/PopUpRolEquipo";

axios.defaults.withCredentials = true;

export default function crear_equipo(props) {
    const router = useRouter();

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    setIsLoadingSmall(false);

    const [teamName, setTeamName] = useState("");
    const [teamLeader, setTeamLeader] = useState("");
    const [fieldsEmpty, setFieldsEmpty] = useState(false);
    const [fieldsEmpty2, setFieldsEmpty2] = useState(false);

    const [isTeamNameFilled, setIsTeamNameFilled] = useState(false);
    const handleChangeTeamName = (e) => {
        const newTeamName = e.target.value;
        setTeamName(newTeamName);
        setIsTeamNameFilled(!!teamName); // Actualiza el estado basado en si el campo está lleno
    };

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);

    const [selectedMiembrosList, setSelectedMiembrosList] = useState([]);
    const [selectedUniqueMemberList, setSelectedUniqueMemberList] = useState(
        []
    );
    const [selectedValueRol, setSelectedValueRol] = useState("");
    const [reloadData, setReloadData] = useState(false);

    const [roles, setRoles] = useState([]);
    const [rol, setRol] = useState("");

    const [addParticipantesState, setAddParticipantesState] = useState(false);

    const [idEquipoInsertado, setIdEquipoInsertado] = useState("");

    const [userRoleData, setUserRoleData] = useState([]); //Define un estado para almacenar los datos del usuario y el rol asociado

    const handleReloadData = () => {
        setReloadData(true);
    };

    const toggleModal = () => {
        handleReloadData();
        setModal(!modal);
    };

    const toggleModal1 = () => {
        setModal1(!modal1);
    };

    const toggleModal2 = () => {
        setModal2(!modal2);
    };

    //roles es un arreglo de roles, en este caso paso como parametro el conjunto de roles
    const handleAddRoles = (roles) => {
        setRoles(roles);
        console.log("Roles: ", roles);
    };

    const returnUniqueListOfMiembros = (newMiembrosList) => {
        console.log("En return:", newMiembrosList[0]);

        // Verificar si newMiembrosList es un arreglo con contenido
        if (Array.isArray(newMiembrosList) && newMiembrosList.length > 0) {
            // Establecer el arreglo como un arreglo que contiene solo el nuevo objeto
            setSelectedUniqueMemberList([newMiembrosList[0]]);
        }

        setModal1(false);
    };

    const returnListOfMiembros = (newMiembrosList) => {
        const newMembrsList = [...selectedMiembrosList, ...newMiembrosList];

        setSelectedMiembrosList(newMembrsList);
        setModal2(!modal2);
    };

    const removeMiembro = (miembro) => {
        const newMembrsList = selectedMiembrosList.filter(
            (item) => item.idUsuario !== miembro.idUsuario
        );
        setSelectedMiembrosList(newMembrsList);
        console.log(newMembrsList);
    };

    const removeMiembroUnique = (user) => {
        const newList = selectedUniqueMemberList.filter(
            (item) => item.idUsuario !== user.idUsuario
        );
        setSelectedUniqueMemberList(newList);
        console.log(newList);
    };

    const [datosUsuario, setDatosUsuario] = useState({
        idUsuario: "",
        nombres: "",
        apellidos: "",
        correoElectronico: "",
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    function verifyFieldsEmpty() {
        return teamName === "" || selectedUniqueMemberList.length === 0;
    }

    function verifyFieldsEmpty2() {
        return userRoleData.length === 0;
    }

    useEffect(() => {
        if (modal) {
            document.body.style.overflow = "hidden";
            setReloadData(true);
        } else {
            document.body.style.overflow = "auto";
            setReloadData(false);
        }
        setIsLoadingSmall(false);
    }, [modal]);

    const checkData = () => {
        const nombreTeam = teamName;
        const proyectoId = projectId;
        // Esto es porque el procedure solo acepta ID
        /*         const selectedMiembrosListWithIDs = selectedMiembrosList.map(
            (usuario) => {
                return { idUsuario: usuario.idUsuario };
            }
        ); */

        /*         axios
            .post(
                "http://localhost:8080/api/proyecto/equipo/insertarEquipoYParticipantes",
                {
                    idProyecto: proyectoId,
                    nombre: nombreTeam,
                    idLider: selectedUniqueMemberList[0].idUsuario,
                    usuarios: selectedMiembrosListWithIDs,
                }
            )
            .then(function (response) {
                console.log(response);
                console.log("Conexion correcta");
            })
            .catch(function (error) {
                console.log(error);
            }); */
        console.log("Post data: ", {
            idProyecto: parseInt(proyectoId),
            nombre: nombreTeam,
            idLider: selectedUniqueMemberList[0].idUsuario,
        });
        axios
            .post("http://localhost:8080/api/proyecto/equipo/insertarEquipo", {
                idProyecto: parseInt(proyectoId),
                nombre: nombreTeam,
                idLider: selectedUniqueMemberList[0].idUsuario,
            })
            .then(function (response) {
                setIdEquipoInsertado(response.data.idEquipo);
                setAddParticipantesState(true);
                console.log(
                    "El id del equipo creado es:",
                    response.data.idEquipo
                );
                console.log(response.data.message);
                console.log("Conexion correcta");
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const handleSelectedValueChangeRol = (value, userId) => {
        // Crear un objeto para el nuevo rol del usuario
        const newUserRole = {
            idUsuario: userId, // El ID del usuario
            idRolEquipo: value, // El ID del rol seleccionado
        };

        // Verificar si el usuario ya tiene un rol en el arreglo
        const userIndex = userRoleData.findIndex(
            (item) => item.idUsuario === userId
        );

        if (userIndex !== -1) {
            // Si el usuario ya tiene un rol, actualiza el rol existente
            const updatedUserRoleData = [...userRoleData];
            updatedUserRoleData[userIndex] = newUserRole;
            setUserRoleData(updatedUserRoleData);
        } else {
            // Si el usuario no tiene un rol, agrégalo al arreglo
            setUserRoleData([...userRoleData, newUserRole]);
        }
    };

    //ahora se registrara los participantes con su rol
    const checkData2 = () => {
        // Esto es porque el procedure solo acepta ID


        axios
            .post(
                "http://localhost:8080/api/proyecto/equipo/insertarParticipantes",
                {
                    participantes: idEquipoInsertado,
                }
            )
            .then(function (response) {
                console.log(response);
                console.log("Conexion correcta");
                router.push(
                    `/dashboard/Proyectos/Proyecto?id=${projectId}&name=${projectName}`
                );
            })
            .catch(function (error)
            {
                console.log(error);
            }
            );
    }



    return (
        <div className="crear_equipo">
            <div className="header">
                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem
                        href="/dashboard/Proyectos"
                        text="Proyecto"
                    />
                    <BreadcrumbsItem
                        href="/dashboard/Proyectos/Proyecto"
                        text="Equipos"
                    />
                </Breadcrumbs>
            </div>
            <div className="title">Crear Equipo</div>

            {!addParticipantesState ? (
                <>
                    <div className="nombreEquipo">
                        <h3>
                            Nombre del equipo
                            <span className="text-red-500"> *</span>
                        </h3>
                        <Input
                            className="mt-4"
                            placeholder="Ingrese el nombre del equipo"
                            onChange={handleChangeTeamName}
                            variant="bordered"
                        />
                    </div>
                    <div style={{ marginBottom: "20px" }}></div>
                    <div className="participantes">
                        <h3>
                            Líder del Equipo
                            <span className="text-red-500"> *</span>
                        </h3>
                        <div className="SelectedUsersContainer">
                            <div
                                className="containerToPopUpUsrSearch"
                                style={{ width: "100%", padding: "0.2rem 0" }}
                                onClick={toggleModal1}
                            >
                                <p>Buscar nuevo líder</p>
                                <img
                                    src="/icons/icon-searchBar.svg"
                                    alt=""
                                    className="icnSearch"
                                    style={{ width: "20px" }}
                                />
                            </div>

                            {selectedUniqueMemberList.map(
                                (component, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="flex gap-2 items-center"
                                        >
                                            <CardSelectedUser
                                                key={component.idUsuario}
                                                name={component.nombres}
                                                lastName={component.apellidos}
                                                usuarioObject={component}
                                                email={
                                                    component.correoElectronico
                                                }
                                                removeHandler={
                                                    removeMiembroUnique
                                                }
                                                isEditable={true}
                                            ></CardSelectedUser>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="participantes">
                        <h3>Participantes</h3>
                        <div className="SelectedUsersContainer">
                            <div
                                className="containerToPopUpUsrSearch"
                                style={{ width: "100%", padding: "0.2rem 0" }}
                                onClick={toggleModal2}
                            >
                                <p>Buscar nuevo participante</p>
                                <img
                                    src="/icons/icon-searchBar.svg"
                                    alt=""
                                    className="icnSearch"
                                    style={{ width: "20px" }}
                                />
                            </div>

                            <ul
                                className="listUsersContainer"
                                style={{ width: "100%", padding: "0.2rem 0" }}
                            >
                                {selectedMiembrosList.map(
                                    (component, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="flex gap-2 items-center"
                                            >
                                                <CardSelectedUser
                                                    key={component.idUsuario}
                                                    name={component.nombres}
                                                    lastName={
                                                        component.apellidos
                                                    }
                                                    usuarioObject={component}
                                                    email={
                                                        component.correoElectronico
                                                    }
                                                    removeHandler={
                                                        removeMiembro
                                                    }
                                                    isEditable={true}
                                                ></CardSelectedUser>
                                                <MyCombobox
                                                    urlApi={`http://localhost:8080/api/proyecto/equipo/listarRol/${idEquipoInsertado}`}
                                                    property="roles"
                                                    nameDisplay="nombreRol"
                                                    hasColor={false}
                                                    onSelect={
                                                        handleSelectedValueChangeRol
                                                    }
                                                    idParam="idRolEquipo"
                                                    reloadData={reloadData}
                                                    initialName="Seleccione un rol"
                                                />
                                                <button
                                                    className="w-20 h-20"
                                                    type="button"
                                                    onClick={() =>
                                                        toggleModal()
                                                    }
                                                >
                                                    <img
                                                        src="/icons/btnEditImagen.svg"
                                                        alt="Descripción de la imagen"
                                                    />
                                                </button>
                                            </div>
                                        );
                                    }
                                )}
                            </ul>
                        </div>
                    </div>
                </>
            )}
            <div style={{ marginBottom: "20px" }}></div>
            <div className="containerButtonsCE">
                {!addParticipantesState ? (
                    <>
                        {fieldsEmpty && (
                            <IconLabel
                                icon="/icons/alert.svg"
                                label="Faltan completar campos"
                                className="iconLabel3"
                            />
                        )}
                        <div className="twoButtonsCE">
                            <div className="buttonContainerCE">
                                <Modal
                                    nameButton="Descartar"
                                    textHeader="Descartar Registro"
                                    textBody="¿Seguro que quiere descartar el registro del equipo?"
                                    colorButton="w-36 bg-slate-100 text-black"
                                    oneButton={false}
                                    secondAction={() => router.back()}
                                    textColor="red"
                                />
                                <Modal
                                    nameButton="Aceptar"
                                    textHeader="Registrar Equipo"
                                    textBody="¿Seguro que quiere registrar el nuevo equipo?"
                                    colorButton="w-36 bg-blue-950 text-white"
                                    oneButton={false}
                                    secondAction={() => {
                                        checkData();
                                    }}
                                    textColor="blue"
                                    verifyFunction={() => {
                                        if (verifyFieldsEmpty()) {
                                            setFieldsEmpty(true);
                                            return false;
                                        } else {
                                            setFieldsEmpty(false);
                                            return true;
                                        }
                                    }}
                                    closeSecondActionState={true}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {fieldsEmpty2 && (
                            <IconLabel
                                icon="/icons/alert.svg"
                                label="Faltan completar campos"
                                className="iconLabel3"
                            />
                        )}
                        <div className="twoButtonsCE">
                            <div className="buttonContainerCE">
                                <Modal
                                    nameButton="Descartar"
                                    textHeader="Descartar Registro"
                                    textBody="¿Seguro que quiere descartar el registro de los participantes?"
                                    colorButton="w-36 bg-slate-100 text-black"
                                    oneButton={false}
                                    secondAction={() => router.back()}
                                    textColor="red"
                                />
                                <Modal
                                    nameButton="Aceptar"
                                    textHeader="Registrar Participantes"
                                    textBody="¿Seguro que quiere registrar los participantes?"
                                    colorButton="w-36 bg-blue-950 text-white"
                                    oneButton={false}
                                    secondAction={() => {
                                        checkData2();
                                    }}
                                    textColor="blue"
                                    verifyFunction={() => {
                                        if (verifyFieldsEmpty2()) {
                                            setFieldsEmpty2(true);
                                            return false;
                                        } else {
                                            setFieldsEmpty2(false);
                                            return true;
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            {modal && (
                <PopUpRolEquipo
                    modal={modal}
                    toggle={() => toggleModal()} // Pasa la función como una función de flecha
                    idEquipo={idEquipoInsertado}
                />
            )}
            {modal1 && (
                <ModalUsersOne
                    listAllUsers={false}
                    handlerModalClose={toggleModal1}
                    handlerModalFinished={returnUniqueListOfMiembros}
                    excludedUsers={selectedUniqueMemberList}
                    idProyecto={projectId}
                ></ModalUsersOne>
            )}
            {modal2 && (
                <ModalUser
                    listAllUsers={false}
                    handlerModalClose={toggleModal2}
                    handlerModalFinished={returnListOfMiembros}
                    excludedUsers={selectedMiembrosList}
                    idProyecto={projectId}
                ></ModalUser>
            )}

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </div>
    );
}
