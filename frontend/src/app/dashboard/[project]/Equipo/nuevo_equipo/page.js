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

import { useRouter } from "next/navigation";

axios.defaults.withCredentials = true;

/*
const miembros = [
    {
        id: 1,
        iconSrc: "/icons/usr-img.svg",
        nombre: "Augusto Victor Tong Yang",
        correo: "avtong@pucp.edu.pe",
    },
    {
        id: 2,
        iconSrc: "/icons/usr-img.svg",
        nombre: "Augusto Victor Tong Yang",
        correo: "avtong@pucp.edu.pe",
    },
    {
        id: 3,
        iconSrc: "/icons/usr-img.svg",
        nombre: "Augusto Victor Tong Yang",
        correo: "avtong@pucp.edu.pe",
    },
    {
        id: 4,
        iconSrc: "/icons/usr-img.svg",
        nombre: "Augusto Victor Tong Yang",
        correo: "avtong@pucp.edu.pe",
    },
];
*/

export default function crear_equipo(props) {
    const router = useRouter();

    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf("=") + 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    setIsLoadingSmall(false);

    const [teamName, setTeamName] = useState("");
    const [teamLeader, setTeamLeader] = useState("");

    const [isTeamNameFilled, setIsTeamNameFilled] = useState(false);
    const handleChangeTeamName = (e) => {
        const newTeamName = e.target.value;
        setTeamName(newTeamName);
        setIsTeamNameFilled(!!teamName); // Actualiza el estado basado en si el campo está lleno
    };

    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);

    const [selectedMiembrosList, setSelectedMiembrosList] = useState([]);

    const toggleModal1 = () => {
        setModal1(!modal1);
    };

    const toggleModal2 = () => {
        setModal2(!modal2);
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

    const [datosUsuario, setDatosUsuario] = useState({
        idUsuario: "",
        nombres: "",
        apellidos: "",
        correoElectronico: "",
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stringURL = "http://localhost:8080/api/usuario/verInfoUsuario";

        axios
            .get(stringURL)
            .then(function (response) {
                const userData = response.data.usuario[0];
                console.log(userData);
                console.log("el nombre del usuario es ", userData.nombres);
                console.log("el apellido del usuario es ", userData.apellidos);
                setDatosUsuario(userData);
                const leaderFullName =
                    userData.nombres + " " + userData.apellidos;
                setTeamLeader(leaderFullName);

                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const checkData = () => {
        console.log("Nombre del equipo = " + teamName);
        console.log("Líder del equipo = " + teamLeader);

        const nombreTeam = teamName;
        const encargado = teamLeader;
        const proyectoId = projectId;
        const nombreProyecto = projectName;
        // Esto es porque el procedure solo acepta ID
        const selectedMiembrosListWithIDs = selectedMiembrosList.map(
            (usuario) => {
                return { idUsuario: usuario.idUsuario };
            }
        );
        console.log("ProjectoId: ", proyectoId);
        console.log("NombreTeam: ", nombreTeam);
        console.log("LiderTeam: ", encargado);
        console.log(
            "IDs de Usuarios seleccionados:",
            selectedMiembrosListWithIDs
        );

        axios
            .post(
                "http://localhost:8080/api/proyecto/equipo/insertarEquipoYParticipantes",
                {
                    idProyecto: proyectoId,
                    nombre: nombreTeam,
                    descripcion: encargado,
                    usuarios: selectedMiembrosListWithIDs,
                }
            )
            .then(function (response) {
                console.log(response);
                console.log("Conexion correcta");
                //const backRoute = "/dashboard/"+{nombreProyecto}+"="+{proyectoId}+"/Equipo";
                router.back();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

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
            <div className="nombreEquipo">
                <h3>Nombre del equipo:</h3>
                <Input
                    className="mt-4"
                    placeholder="Ingrese el nombre del equipo"
                    onChange={handleChangeTeamName}
                    variant="bordered"
                />
            </div>
            <div style={{ marginBottom: "20px" }}></div>
            <div className="liderEquipo">
                <h3>Líder del Equipo</h3>
                <p>{teamLeader} (tú) </p>
            </div>
            <div className="participantes">
                <h3>Participantes:</h3>
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
                        {selectedMiembrosList.map((component) => {
                            return (
                                <CardSelectedUser
                                    key={component.idUsuario}
                                    name={component.nombres}
                                    lastName={component.apellidos}
                                    usuarioObject={component}
                                    email={component.correoElectronico}
                                    removeHandler={removeMiembro}
                                ></CardSelectedUser>
                            );
                        })}
                    </ul>
                </div>
            </div>
            <div style={{ marginBottom: "20px" }}></div>
            <div className="bottom">
                <button className="addTeamBtn" onClick={checkData}>
                    Crear Equipo
                </button>
            </div>

            {modal2 && (
                <ModalUser
                    handlerModalClose={toggleModal2}
                    handlerModalFinished={returnListOfMiembros}
                    excludedUsers={selectedMiembrosList}
                ></ModalUser>
            )}

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </div>
    );
}
