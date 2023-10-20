"use client";

import React, { useContext, useEffect, useState } from "react";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";
import Link from "next/link";
import axios from "axios";
import GeneralLoadingScreen from "@/components/GeneralLoadingScreen";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { SmallLoadingScreen } from "@/app/dashboard/[project]/layout";
axios.defaults.withCredentials = true;

const memberData = [
    {
        id: "1",
        name: "Renzo",
        lastName: "Pinto",
        profilePicture: "/images/ronald_user.png",
    },

    {
        id: "2",
        name: "Renzo",
        lastName: "Pinto",
        profilePicture: "/images/ronald_user.png",
    },
    {
        id: "3",
        name: "Renzo",
        lastName: "Pinto",
        profilePicture: "/images/ronald_user.png",
    },
    {
        id: "4",
        name: "Renzo",
        lastName: "Pinto",
        profilePicture: "/images/ronald_user.png",
    },
    {
        id: "5",
        name: "Renzo",
        lastName: "Pinto",
        profilePicture: "/images/ronald_user.png",
    },
    {
        id: "6",
        name: "Renzo",
        lastName: "Pinto",
        profilePicture: "/images/ronald_user.png",
    },
];

function MemberIcon(props) {
    return (
        <li className="memberContainer">
            <p className="memberIcon">
                {props.name[0]}
                {props.lastName[0]}
            </p>
        </li>
    );
}

function DropDownItem(props) {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    const router = useRouter();
    const prenderLoadYPush = () => {
        setIsLoadingSmall(true);
        router.push(props.goTo);
    }
    return (
        <li className="DropDownItem" onClick={prenderLoadYPush}>
            {/* <Link
                href={props.goTo}
                style={{ display: "flex", alignItems: "center", gap: ".7rem" }}
            > */}
                <img src={props.icon} alt="icon" className="" />
                <p>{props.name}</p>
            {/* </Link> */}
        </li>
    );
}

function DropDownMenu(props) {
    //PARAMETROS QUE DEBE RECIBIR:
    //title-icon
    //title-tittle
    //array de items con estructura {optIcon, optName}
    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen(!open);
    };

    return (
        <div className="DropDownMenu">
            <div className="DropTitleContainer" onClick={toggleDropdown}>
                <img
                    src="/icons/chevron-down.svg"
                    alt=""
                    className="DropIconRight"
                />
                <img
                    src={props.info.tittleIcon}
                    alt=""
                    className="DropIconLeft"
                />
                <p className="DropTitle"> {props.info.tittleTitle} </p>
            </div>

            <ul
                className={
                    open === true ? "ItemsContainer show" : "ItemsContainer"
                }
            >
                {props.info.dataItems.map((item) => {
                    return (
                        <DropDownItem
                            key={item.id}
                            icon={item.optIcon}
                            name={item.optName}
                            goTo={item.goTo}
                        ></DropDownItem>
                    );
                })}
            </ul>
        </div>
    );
}

function ProjectSidebar(props) {
    const [isOpen, setIsOpen] = useState(true);
    const [isTriangleBlue, setIsTriangleBlue] = useState(false);
    const [listTools1, setListTools1] = useState({
        tittleIcon: "/icons/info-circle.svg",
        tittleTitle: "Sobre proyecto",
        dataItems: [],
    });
    const [listTools2, setListTools2] = useState({
        tittleIcon: "/icons/icon-settings.svg",
        tittleTitle: "Herramientas",
        dataItems: [],
    });

    const handleButtonClick = () => {
        setIsOpen((prevState) => !prevState);
        setIsTriangleBlue(true);
        setTimeout(() => {
            setIsTriangleBlue(false);
        }, 300);
    };

    const [membersData, setMembersData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let toolsArray;
        const stringURL =
            "http://localhost:8080/api/herramientas/" +
            props.projectId +
            "/listarHerramientasDeProyecto";
        axios
            .get(stringURL)
            .then(function (response) {
                console.log(response);
                toolsArray = response.data.herramientas;
                console.log(toolsArray);

                let newDataArray1 = [];
                let newDataArray2 = [];
                for (const tool of toolsArray) {
                    console.log("in first iteration");
                    if (
                        tool.idHerramienta === 9 ||
                        tool.idHerramienta === 10 ||
                        tool.idHerramienta === 11
                    ) {
                        newDataArray1.push(
                            sideBar1Array.find(
                                (item) => item.id === tool.idHerramienta
                            )
                        );
                    } else {
                        newDataArray2.push(
                            sideBar2Array.find(
                                (item) => item.id === tool.idHerramienta
                            )
                        );
                    }
                }

                newDataArray1.sort((a, b) => a.position - b.position);
                newDataArray2.sort((a, b) => a.position - b.position);

                newDataArray1.push(sideBar1Array[3]);

                setListTools1({
                    tittleIcon: "/icons/info-circle.svg",
                    tittleTitle: "Sobre proyecto",
                    dataItems: newDataArray1,
                });

                setListTools2({
                    tittleIcon: "/icons/icon-settings.svg",
                    tittleTitle: "Herramientas",
                    dataItems: newDataArray2,
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        const stringURL_2 =
            "http://localhost:8080/api/proyecto/listarUsuariosXidRolXidProyecto";

        axios
            .post(stringURL_2, {
                idRol: 3,
                idProyecto: props.projectId,
            })
            .then(function (response) {
                console.log(response);
                const members_data = response.data.usuarios;

                setMembersData(members_data);
                console.log(members_data);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const stringBase =
        "/dashboard/" + props.projectName + "=" + props.projectId;

    const sideBar1Array = [
        {
            id: 9,
            position: 1,
            optIcon: "/icons/sideBarDropDown_icons/sbdd1.svg",
            optName: "Autoevaluacion",
            goTo: `${stringBase}/autoevaluacionEquipo`,
        },
        {
            id: 10,
            position: 2,
            optIcon: "/icons/sideBarDropDown_icons/sbdd2.svg",
            optName: "Retrospectivas",
            goTo: `${stringBase}/toBeDefined`,
        },
        {
            id: 11,
            position: 3,
            optIcon: "/icons/sideBarDropDown_icons/sbdd3.svg",
            optName: "Actas de reunion",
            goTo: `${stringBase}/actaReunion`,
        },
        {
            id: 50 /*SIN ID EN BASE DE DATOS PORQUE SIEMPRE DEBE ESTAR PRESENTE*/,
            position: 4,
            optIcon: "/icons/sideBarDropDown_icons/sbdd4.svg",
            optName: "Reporte de avances",
            goTo: `${stringBase}/toBeDefined`,
        },
    ];

    const sidebar1Data = {
        tittleIcon: "/icons/info-circle.svg",
        tittleTitle: "Sobre proyecto",
        dataItems: sideBar1Array,
    };

    const sideBar2Array = [
        {
            id: 1,
            position: 1,
            optIcon: "/icons/sideBarDropDown_icons/sbdd5.svg",
            optName: "Gestion de backlog",
            goTo: `${stringBase}/productBacklog`,
        },
        {
            id: 3,
            position: 2,
            optIcon: "/icons/sideBarDropDown_icons/sbdd6.svg",
            optName: "Acta de constitución",
            goTo: `${stringBase}/actaConstitucion/info`,
        },
        {
            id: 2,
            position: 3,
            optIcon: "/icons/sideBarDropDown_icons/sbdd7.svg",
            optName: "EDT y diccionario EDT",
            goTo: `${stringBase}/EDT`,
        },

        {
            id: 4,
            position: 4,
            optIcon: "/icons/sideBarDropDown_icons/sbdd8.svg",
            optName: "Cronograma",
            goTo: `${stringBase}/cronograma`,
        },
        {
            id: 12,
            position: 5,
            optIcon: "/icons/sideBarDropDown_icons/sbdd9.svg",
            optName: "Registro de equipos",
            goTo: `${stringBase}/Equipo`,
        },
        {
            id: 13,
            position: 6,
            optIcon: "/icons/sideBarDropDown_icons/sbdd10.svg",
            optName: "Presupuesto",
            goTo: `${stringBase}/presupuesto`,
        },
        {
            id: 5,
            position: 7,
            optIcon: "/icons/sideBarDropDown_icons/sbdd11.svg",
            optName: "Catalogo de riesgos",
            goTo: `${stringBase}/catalogoDeRiesgos`,
        },
        {
            id: 6,
            position: 8,
            optIcon: "/icons/sideBarDropDown_icons/sbdd12.svg",
            optName: "Catalogo de interesados",
            goTo: `${stringBase}/toBeDefined`,
        },
        {
            id: 7,
            position: 9,
            optIcon: "/icons/sideBarDropDown_icons/sbdd13.svg",
            optName: "Matriz de responsabilidades",
            goTo: `${stringBase}/toBeDefined`,
        },
        {
            id: 8,
            position: 10,
            optIcon: "/icons/sideBarDropDown_icons/sbdd14.svg",
            optName: "Matriz de comunicaciones",
            goTo: `${stringBase}/matrizDeComunicaciones`,
        },
    ];

    const sidebar2Data = {
        tittleIcon: "/icons/icon-settings.svg",
        tittleTitle: "Herramientas",
        dataItems: sideBar2Array,
    };

    return (
        <nav
            className={`ProjectSidebar ${
                isOpen ? "openSidebar" : "closedSidebar"
            }`}
        >
            <div className="contenedorTodo">
                <div className="btnOpenSidebar" onClick={handleButtonClick}>
                    <div
                        className={`triangle ${
                            isTriangleBlue ? "triangle-blue" : ""
                        }`}
                    ></div>
                </div>
                <p className="SidebarHeader">{props.projectName}</p>
                <p className="dates">13/09/2023 - 20/10/2023 (50 dias)</p>
                <div className="teamContainer">
                    <p className="teamHeader">Equipo:</p>
                    <p className="teamName">Los dibujitos</p>
                </div>
            </div>

            <ul className="members">
                {membersData.map((member) => {
                    return (
                        <MemberIcon
                            key={member.idUsuario}
                            name={member.nombres}
                            lastName={member.apellidos}
                        ></MemberIcon>
                    );
                })}
                <div className="addNewMContainer">
                    +
                </div>
            </ul>

            {/* <DropDownMenu info={listTools1}></DropDownMenu>
            <DropDownMenu info={listTools2}></DropDownMenu> */}
            <Accordion selectionMode="multiple"  variant="bordered">
                <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    title="Sobre proyecto"
                >
                    {listTools1.dataItems.map((item) => {
                        return (
                            <DropDownItem
                                key={item.id}
                                icon={item.optIcon}
                                name={item.optName}
                                goTo={item.goTo}
                            ></DropDownItem>
                        );
                    })}
                </AccordionItem>
                <AccordionItem
                    key="2"
                    aria-label="Accordion 2"
                    title="Herramientas"
                >
                    {listTools2.dataItems.map((item) => {
                        return (
                            <DropDownItem
                                key={item.id}
                                icon={item.optIcon}
                                name={item.optName}
                                goTo={item.goTo}
                            ></DropDownItem>
                        );
                    })}
                </AccordionItem>
            </Accordion>

            <GeneralLoadingScreen isLoading={isLoading}></GeneralLoadingScreen>
        </nav>
    );
}

export default ProjectSidebar;
