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
import ComboBoxArray from "@/components/equipoComps/ComboBoxArray";
import PopUpRolEquipo from "@/components/equipoComps/PopUpRolEquipo";
import { Button } from "@nextui-org/react";
import { AddIcon } from "@/components/equipoComps/AddIcon";
import { Toaster, toast } from "sonner";

axios.defaults.withCredentials = true;

export default function crear_equipo(props) {
    const router = useRouter();
    const [leaderRoleId, setLeaderRoleId] = useState(null);
    const [leaderRole, setLeaderRole] = useState(null);
    const [memberRoleId, setMemberRoleId] = useState(null);
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    setIsLoadingSmall(false);

    const [activeDropdown, setActiveDropdown] = useState(null);

    const [teamName, setTeamName] = useState("");
    const [fieldsEmpty, setFieldsEmpty] = useState(false);

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

    const [rol, setRol] = useState({}); //Define un estado para almacenar el rol seleccionado [idRolEquipo
    const [roles, setRoles] = useState([]); //Define un estado para almacenar los roles disponibles
    const [rolesOriginales, setRolesOriginales] = useState([]); //Define un estado para almacenar los roles disponibles

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
    const handleAddRoles = (newRoles) => {
        setRoles(newRoles);
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

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/api/proyecto/equipo/listarRol/${projectId}`
            )
            .then((response) => {
                // Aquí puedes manejar la respuesta de la petición
                console.log(
                    "Respuesta de la petición de roles:",
                    response.data
                );
                // Filtra los roles para excluir el rol "Líder"
                const filteredRoles = response.data.roles.filter(
                    (role) => role.nombreRol !== "Líder"
                );

                setRoles(filteredRoles);
                setRolesOriginales(response.data.roles);
                // Busca el ID del líder y el miembro en la respuesta
                const rolesResponse = response.data.roles;
                const leaderRole = rolesResponse.find(
                    (role) => role.nombreRol === "Líder"
                );
                const memberRole = rolesResponse.find(
                    (role) => role.nombreRol === "Miembro"
                );

                if (leaderRole) {
                    setLeaderRole(leaderRole);
                    setLeaderRoleId(leaderRole.idRolEquipo);
                }
                if (memberRole) {
                    setMemberRoleId(memberRole.idRolEquipo);
                }
                // Puedes hacer lo que necesites con la respuesta, como asignarla a un estado o variable.
            })
            .catch(function (error) {
                console.log("Error al cargar el rol del equipo: ", error);
            });
        setIsLoading(false);
    }, []);

    function verifyFieldsEmpty() {
        return teamName === "";
    }

    function verifyFieldsExcessive() {
        return teamName.length > 50;
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
        const updatedRoles = [...roles, leaderRole];
        let todosUserRoleData;
        if (selectedUniqueMemberList.length !== 0) {
            todosUserRoleData = [
                {
                    idUsuario: selectedUniqueMemberList[0].idUsuario,
                    idRolEquipo: leaderRoleId,
                },
                ...userRoleData,
            ];
        } else {
            todosUserRoleData = userRoleData;
        }

        console.log("Post data: ", {
            idProyecto: parseInt(proyectoId),
            nombre: nombreTeam,
            roles: updatedRoles,
            usuariosXRol: todosUserRoleData,
            rolesOriginales: rolesOriginales,
        });

        axios
            .post(
                process.env.NEXT_PUBLIC_BACKEND_URL +
                    "/api/proyecto/equipo/insertarEquipoYParticipantes",
                {
                    idProyecto: parseInt(proyectoId),
                    nombre: nombreTeam,
                    roles: updatedRoles,
                    usuariosXRol: todosUserRoleData,
                    rolesOriginales: rolesOriginales,
                }
            )
            .then(function (response) {
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

    const handleAutoSelectedValueChangeRol = (value, userId) => {
        // Crear un objeto para el nuevo rol del usuario
        const newUserRole = {
            idUsuario: userId, // El ID del usuario
            idRolEquipo: value, // El ID del rol seleccionado
        };

        // Verificar si el usuario ya tiene un rol en el arreglo
        const userIndex = userRoleData.findIndex(
            (item) => item.idUsuario === userId
        );

        if (userIndex === -1) {
            // Si el usuario no tiene un rol, agrégalo al arreglo
            const updatedUserRoleData = [...userRoleData, newUserRole];
            setUserRoleData(updatedUserRoleData);
        }
    };

    const isTextTooLong1 = teamName.length > 50;

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
            <div className="title text-2xl">Crear Equipo</div>
            <div className="nombreEquipo text-xl flex flex-col gap-1">
                <h3 className="text-xl">
                    Nombre del equipo
                    <span className="text-red-500"> *</span>
                </h3>
                <Input
                    className="mt-1"
                    placeholder="Ingrese el nombre del equipo"
                    onChange={handleChangeTeamName}
                    variant="bordered"
                    isInvalid={isTextTooLong1}
                    maxLength="55"
                    errorMessage={
                        isTextTooLong1
                            ? "El texto debe ser como máximo de 50 caracteres."
                            : ""
                    }
                />
            </div>
            <div style={{ marginBottom: "20px" }}></div>
            <div className="flex flex-col gap-5">
                <div className="participantes flex flex-col gap-2">
                    <div className="flex flex-row items-center justify-start gap-2">
                        <h3 className="my-0 text-xl">Líder del Equipo</h3>
                        <Button
                            color="primary"
                            onClick={toggleModal1}
                            className="px-unit-5"
                        >
                            <p>Buscar nuevo líder</p>
                            <img
                                src="/icons/icon-searchBar.svg"
                                alt=""
                                className="icnSearch"
                                style={{ width: "20px" }}
                            />
                        </Button>
                    </div>
                    <div className="SelectedUsersContainer">
                        {selectedUniqueMemberList.length === 0 && (
                            <div className="flex justify-center items-center min-h-[100px] font-medium text-slate-500">
                                Añade un lider
                            </div>
                        )}
                        {selectedUniqueMemberList.map((component, index) => {
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
                                        email={component.correoElectronico}
                                        removeHandler={removeMiembroUnique}
                                        isEditable={true}
                                    ></CardSelectedUser>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* <div className="">
                    <h3 className="roles">Roles</h3>
                    <Button
                        color="primary"
                        startContent={<AddIcon />}
                        onClick={() => toggleModal()}
                        className="w-full"
                    >
                        Agregar roles
                    </Button>
                </div> */}
                <div className="participantes flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row items-center justify-start gap-2">
                            <h3 className="my-0 text-xl">Participantes</h3>
                            <Button
                                color="primary"
                                onClick={toggleModal2}
                                className="px-unit-5"
                            >
                                <p>Buscar nuevo participante</p>
                                <img
                                    src="/icons/icon-searchBar.svg"
                                    alt=""
                                    className="icnSearch"
                                    style={{ width: "20px" }}
                                />
                            </Button>
                        </div>

                        <div className="flex flex-row items-center gap-2">
                            <h3 className="roles text-xl">Roles</h3>
                            <Button
                                color="primary"
                                startContent={<AddIcon />}
                                onClick={() => toggleModal()}
                                className="w-full"
                            >
                                Agregar roles
                            </Button>
                        </div>
                    </div>
                    <div className="SelectedUsersContainer">
                        <ul
                            className="listUsersContainer"
                            style={{ width: "100%", padding: "0.2rem 0" }}
                        >
                            {selectedMiembrosList.length === 0 && (
                                <div className="flex justify-center items-center min-h-[100px] font-medium text-slate-500">
                                    Añade miembros
                                </div>
                            )}
                            {selectedMiembrosList.map((component, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="flex gap-2 items-center relative"
                                    >
                                        <CardSelectedUser
                                            key={component.idUsuario}
                                            name={component.nombres}
                                            lastName={component.apellidos}
                                            usuarioObject={component}
                                            email={component.correoElectronico}
                                            removeHandler={removeMiembro}
                                            isEditable={true}
                                        ></CardSelectedUser>
                                        <ComboBoxArray
                                            people={roles}
                                            onSelect={(value) =>
                                                handleSelectedValueChangeRol(
                                                    value,
                                                    component.idUsuario
                                                )
                                            }
                                            isDropdownActive={
                                                activeDropdown === index
                                            }
                                            setActiveDropdown={() => {
                                                setActiveDropdown(index);
                                            }}
                                            autoSelectedValue={{
                                                idRolEquipo: memberRoleId,
                                                nombreRol: "Miembro",
                                            }}
                                        >
                                            {handleAutoSelectedValueChangeRol(
                                                memberRoleId,
                                                component.idUsuario
                                            )}
                                        </ComboBoxArray>
                                    </div>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <div style={{ marginBottom: "20px" }}></div>
            <div className="containerButtonsCE">
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
                                router.back();
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
                                    toast.error("Faltan completar campos", {
                                        position: "bottom-left",
                                    });
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
                            closeSecondActionState={true}
                        />
                    </div>
                </div>
            </div>
            {modal && (
                <PopUpRolEquipo
                    modal={modal}
                    toggle={() => toggleModal()} // Pasa la función como una función de flecha
                    handleAddRoles={handleAddRoles}
                    initialListRoles={roles}
                    rolesOriginales={rolesOriginales}
                />
            )}
            {modal1 && (
                <ModalUsersOne
                    listAllUsers={false}
                    handlerModalClose={toggleModal1}
                    handlerModalFinished={returnUniqueListOfMiembros}
                    excludedUsers={selectedUniqueMemberList}
                    idProyecto={projectId}
                    excludedUniqueUser={selectedMiembrosList}
                    isExcludedUniqueUser={true}
                ></ModalUsersOne>
            )}
            {modal2 && (
                <ModalUser
                    listAllUsers={false}
                    handlerModalClose={toggleModal2}
                    handlerModalFinished={returnListOfMiembros}
                    excludedUsers={selectedMiembrosList}
                    idProyecto={projectId}
                    excludedUniqueUser={selectedUniqueMemberList}
                    isExcludedUniqueUser={true}
                ></ModalUser>
            )}
        </div>
    );
}
