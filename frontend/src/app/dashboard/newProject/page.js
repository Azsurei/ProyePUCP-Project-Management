"use client";
import axios from "axios";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/projectMenu.css";
import "@/styles/dashboardStyles/projectStyles/projectCreateStyles/newProjects.css";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/Breadcrumb";

import ListTools from "@/components/dashboardComps/projectComps/projectCreateComps/ListTools";
import CardCreateProject from "@/components/dashboardComps/projectComps/projectCreateComps/CardCreateProject";
import ChoiceUser from "@/components/dashboardComps/projectComps/projectCreateComps/ChoiceUser";

import Link from "next/link";
import { useState } from "react";
import * as React from "react";
import TracerNewProject from "@/components/TracerNewProject";
import { useRouter } from "next/navigation";
import TextField from "@/components/TextField";
import { useEffect } from "react";

axios.defaults.withCredentials = true;

const items = [
    {
        id: "1",
        label: "Informacion General",
        percentageComplete: 0,
        status: "current",
        href: "#",
    },
    {
        id: "2",
        label: "Herramientas",
        percentageComplete: 0,
        status: "unvisited",
        href: "#",
    },
    {
        id: "3",
        label: "Participantes",
        percentageComplete: 0,
        status: "unvisited",
        href: "#",
    },
];

const items2 = [
    {
        id: "1",
        label: "Informacion General",
        percentageComplete: 100,
        status: "visited",
        href: "#",
    },
    {
        id: "2",
        label: "Herramientas",
        percentageComplete: 0,
        status: "current",
        href: "#",
    },
    {
        id: "3",
        label: "Participantes",
        percentageComplete: 0,
        status: "unvisited",
        href: "#",
    },
];

const items3 = [
    {
        id: "1",
        label: "Informacion General",
        percentageComplete: 100,
        status: "visited",
        href: "#",
    },
    {
        id: "2",
        label: "Herramientas",
        percentageComplete: 100,
        status: "visited",
        href: "#",
    },
    {
        id: "3",
        label: "Participantes",
        percentageComplete: 0,
        status: "current",
        href: "#",
    },
];

export default function newProject() {
    const router = useRouter();

    const [nameProject, setNameProject] = useState("");
    //const [dueñoProyecto, setOwner] = useState(""); en backend lo pueden sacar con el jwt
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const [estadoProgress, setEstadoProgress] = useState(1);
    const cambiarEstadoAdelante = () => {
        if (estadoProgress != 3) {
            setEstadoProgress(estadoProgress + 1);
        }
    };
    const camibarEstadoAtras = () => {
        if (estadoProgress != 1) {
            setEstadoProgress(estadoProgress - 1);
        }
    };

    const handleChangeProjectName = (e) => {
        setNameProject(e.target.value);
    };

    const handleChangesFechaInicio = (e) => {
        setFechaInicio(e.target.value);
    };

    const handleChangesFechaFin = (e) => {
        setFechaFin(e.target.value);
    };

    const checkData = () => {
        console.log("NOMBRE DE PROYECTO = " + nameProject);
        console.log("FECHA INICIO = " + fechaInicio);
        console.log("FECHA FIN = " + fechaFin);
    };

    //al cargar la pagina, cargaremos toda la info necesaria (datos de usuario y listado de herramientas)
    //para evitar loading times en los cambios entre niveles

	
	const [datosUsuario, setDatosUsuario] = useState({
		nombres: '',
		apellidos: '',
		correoElectronico: ''
	});

    useEffect(() => {
        const stringURL = "http://localhost:8080/api/usuario/verInfoUsuario";

        axios
            .get(stringURL)
            .then(function (response) {
                const userData = response.data.usuario[0];
                console.log(userData);
				console.log("el nombre del usuario es ",userData.nombres);
				console.log("el apellido del usuario es ",userData.apellidos);
                setDatosUsuario(userData);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);
	

    return (
        <div className="mainDivNewProject">
            <div className="headerDiv">
                <Breadcrumbs>
                    <BreadcrumbsItem href="/" text="Inicio" />
                    <BreadcrumbsItem href="/dashboard" text="Proyectos" />
                    <BreadcrumbsItem
                        href="/dashboard/newProject"
                        text="Nuevo Proyecto"
                    />
                </Breadcrumbs>
                <p className="textProject2">Crea un Proyecto</p>
            </div>

            <div className="trackerBar">
                {estadoProgress === 1 && (
                    <TracerNewProject items={items}></TracerNewProject>
                )}
                {estadoProgress === 2 && (
                    <TracerNewProject items={items2}></TracerNewProject>
                )}
                {estadoProgress === 3 && (
                    <TracerNewProject items={items3}></TracerNewProject>
                )}
            </div>

            <div className="containerInfoBox">
                <div
                    className="buttonContainerPrev"
                    style={{ opacity: estadoProgress != 1 ? "100" : "0" }}
                >
                    <button className="myButton" onClick={camibarEstadoAtras}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="79"
                            height="79"
                            viewBox="0 0 79 79"
                            fill="none"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.58268 39.4993C6.58268 21.32 21.32 6.58268 39.4993 6.58268C57.6787 6.58268 72.416 21.32 72.416 39.4993C72.416 57.6787 57.6787 72.416 39.4993 72.416C21.32 72.416 6.58268 57.6787 6.58268 39.4993ZM45.8317 48.1374C45.6654 47.7399 45.4218 47.3794 45.1149 47.0768L37.4552 39.4829L45.0853 31.922C45.3921 31.6194 45.6358 31.2589 45.8021 30.8613C45.9684 30.4638 46.054 30.0372 46.054 29.6063C46.054 29.1754 45.9684 28.7487 45.8021 28.3512C45.6358 27.9537 45.3921 27.5931 45.0853 27.2906C44.463 26.6755 43.6232 26.3305 42.7482 26.3305C41.8732 26.3305 41.0335 26.6755 40.4111 27.2906L30.6843 36.9352C30.3479 37.2687 30.0809 37.6656 29.8987 38.1029C29.7164 38.5402 29.6226 39.0092 29.6226 39.4829C29.6226 39.9566 29.7164 40.4257 29.8987 40.863C30.0809 41.3002 30.3479 41.6971 30.6843 42.0307L40.4441 51.7082C41.0662 52.3223 41.9053 52.6666 42.7795 52.6666C43.6537 52.6666 44.4927 52.3223 45.1149 51.7082C45.4218 51.4056 45.6654 51.0451 45.8317 50.6476C45.998 50.25 46.0836 49.8234 46.0836 49.3925C46.0836 48.9616 45.998 48.5349 45.8317 48.1374Z"
                                fill="#F0AE19"
                            />
                        </svg>
                    </button>
                </div>

                <div className="infoBox">
                    {estadoProgress === 1 && (
                        <CardCreateProject
                            handleChangesNombre={handleChangeProjectName}
                            handleChangesFechaInicio={handleChangesFechaInicio}
                            handleChangesFechaFin={handleChangesFechaFin}
							projectOwnerData={datosUsuario}
                        ></CardCreateProject>
                    )}
                    {estadoProgress === 2 && <ListTools></ListTools>}
                    {estadoProgress === 3 && <ChoiceUser></ChoiceUser>}
                </div>
                <div className="buttonContainer">
                    <button
                        className="myButton"
                        onClick={cambiarEstadoAdelante}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="79"
                            height="79"
                            viewBox="0 0 79 79"
                            fill="none"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M72.4173 39.5007C72.4173 57.68 57.68 72.4173 39.5007 72.4173C21.3213 72.4173 6.58398 57.68 6.58398 39.5007C6.58398 21.3213 21.3213 6.58398 39.5007 6.58398C57.68 6.58398 72.4173 21.3213 72.4173 39.5007ZM33.1683 30.8626C33.3346 31.2601 33.5782 31.6206 33.8851 31.9232L41.5448 39.5171L33.9147 47.078C33.6079 47.3806 33.3642 47.7411 33.1979 48.1387C33.0316 48.5362 32.946 48.9628 32.946 49.3937C32.946 49.8246 33.0316 50.2513 33.1979 50.6488C33.3642 51.0463 33.6079 51.4069 33.9147 51.7094C34.537 52.3245 35.3768 52.6695 36.2518 52.6695C37.1268 52.6695 37.9665 52.3245 38.5889 51.7094L48.3157 42.0648C48.6521 41.7313 48.9191 41.3344 49.1013 40.8971C49.2836 40.4598 49.3774 39.9908 49.3774 39.5171C49.3774 39.0434 49.2836 38.5743 49.1013 38.137C48.9191 37.6998 48.6521 37.3029 48.3157 36.9693L38.5559 27.2918C37.9338 26.6777 37.0947 26.3334 36.2205 26.3334C35.3463 26.3334 34.5073 26.6777 33.8851 27.2918C33.5782 27.5944 33.3346 27.9549 33.1683 28.3524C33.002 28.75 32.9164 29.1766 32.9164 29.6075C32.9164 30.0384 33.002 30.4651 33.1683 30.8626Z"
                                fill="#F0AE19"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="buttonContainerCreate">
                <button className="createProjectButtonEnd" onClick={checkData}>
                    Crear Proyecto
                </button>
            </div>
        </div>
    );
}
