"use client"

import React, { useState } from "react";
import "@/styles/dashboardStyles/projectStyles/ProjectSidebar.css";
import Link from "next/link";

const memberData = [
    {
        id: '1',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    },
    
    {
        id: '2',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    },
    {
        id: '3',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    }  ,
    {
        id: '4',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    } ,
    {
        id: '5',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    } ,
    {
        id: '6',
        name: 'Renzo',
        lastName: 'Pinto',
        profilePicture: '/images/ronald_user.png'
    }
];

function MemberIcon(props){
    return(
        <li className="memberContainer">
            <img 
                // src={props.profilePicture} 
                src="/images/ronaldo_user.png"
                alt="/icons/userDefaultIcon.png" 
                className="memberIcon"/>
        </li>
    );
}

function DropDownItem(props){
    return(
        <li className="DropDownItem">
            <Link href={props.goTo} style={{display:'flex', alignItems:"center"}}>
                <img src={props.icon} alt="icon" className="" />
                <p>{props.name}</p>
            </Link>
        </li>
    );
}


function DropDownMenu(props){
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
        <div className="DropTitleLeft">
          <img src={props.info.tittleIcon} alt="" className="DropIconLeft" />
          <p className="DropTitle"> {props.info.tittleTitle} </p>
        </div>
        <img src="/icons/epicPB.svg" alt="" className="DropIconRight" />
      </div>

      <ul className={open === true ? "ItemsContainer show" : "ItemsContainer"}>
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

    const handleButtonClick = () => {
        setIsOpen(prevState => !prevState);
        setIsTriangleBlue(true);
        setTimeout(() => {
            setIsTriangleBlue(false);
        }, 300);
    };


    const stringBase = '/dashboard/' + props.projectName+"="+props.projectId;

    const sideBar1Array = [
        {
            id: 9,
            position: 1,
            optIcon : '/icons/icon-goBack.svg',
            optName : 'Autoevaluacion del equipo',
            goTo    : `${stringBase}`
        },
        {
            id: 10,
            position: 2,
            optIcon : '/icons/icon-goBack.svg',
            optName : 'Registro de retrospectivas',
            goTo    : `${stringBase}`
        },
        {
            id: 11,
            position: 3,
            optIcon : '/icons/icon-goBack.svg',
            optName : 'Actas de reunion',
            goTo    : `${stringBase}`
        },
        {
            id: 50, /*SIN ID EN BASE DE DATOS PORQUE SIEMPRE DEBE ESTAR PRESENTE*/
            position: 4,
            optIcon : '/icons/icon-goBack.svg',
            optName : 'Reporte de avances',
            goTo    : `${stringBase}`
        },
    ];
    
    const sidebar1Data = {
        tittleIcon : '/icons/info-circle.svg',
        tittleTitle : 'Sobre proyecto',
        dataItems : sideBar1Array
    };
    
    const sideBar2Array = [
        {
            id: 1,
            position: 1,
            optIcon : '/icons/icon-notif.svg',
            optName : 'Gestion de backlog',
            goTo    : `${stringBase}/productBacklog`
        },
        {
            id: 3,
            position: 2,
            optIcon : '/icons/datePB.svg',
            optName : 'Acta de constitución',
            goTo    : `${stringBase}/actaConstitucion`
        },
        {
            id: 2,
            position: 3,
            optIcon : '/icons/icon-cross.svg',
            optName : 'EDT y diccionario EDT',
            goTo    : `${stringBase}/EDT`
        },
        
        {
            id: 4,
            position: 4,
            optIcon : '/icons/icon-help.svg',
            optName : 'Cronograma',
            goTo    : `${stringBase}/cronograma`
        },
        {
            id: 12,
            position: 5,
            optIcon : '/icons/icon-help.svg',
            optName : 'Registro de equipos',
            goTo    : `${stringBase}/Equipo`
        },
        {
            id: 13,
            position: 6,
            optIcon : '/icons/icon-help.svg',
            optName : 'Presupuesto',
            goTo    : `${stringBase}/presupuesto`
        },
        {
            id: 5,
            position: 7,
            optIcon : '/icons/icon-help.svg',
            optName : 'Catalogo de riesgos',
            goTo    : `${stringBase}/catalogoRiesgos`
        },
        {
            id: 6,
            position: 8,
            optIcon : '/icons/icon-help.svg',
            optName : 'Catalogo de interesados',
            goTo    : `${stringBase}/catalogoInteresados`
        },
        {
            id: 7,
            position: 9,
            optIcon : '/icons/icon-help.svg',
            optName : 'Matriz de responsabilidades',
            goTo    : `${stringBase}/matrizResponsabilidades`
        },
        {
            id: 8,
            position: 10,
            optIcon : '/icons/icon-help.svg',
            optName : 'Matriz de comunicaciones',
            goTo    : `${stringBase}/matrizComunicaciones`
        },
    ];
    
    const sidebar2Data = {
        tittleIcon : '/icons/icon-settings.svg',
        tittleTitle : 'Herramientas',
        dataItems : sideBar2Array
    };


    //entonces, recibes una lista de herramientas
    let arrayFromApi;
    function getArrayForSidebar(){
        //por cada item en el arrayFromApi, usamos su ID para jalar el que tenga
        //dicho ID en el arreglo de dataItems, y lo arreglamos al arreglo final
        let newDataArray = [];
        for(tool in arrayFromApi){
            newDataArray.push(sideBar2Array.find(item => item.id === tool.idHerramienta));
        }

        newDataArray.sort((a, b) => a.position - b.position);
    }

    
    return (
        <nav className={`ProjectSidebar ${isOpen ? 'openSidebar' : 'closedSidebar'}`}>
            <div className="contenedorTodo">
                <div className="btnOpenSidebar" onClick={handleButtonClick}>
                    <div className={`triangle ${isTriangleBlue ? 'triangle-blue' : ''}`}></div>
                </div>
                <p className="SidebarHeader">{props.projectName}</p>
                <p className="dates">13/09/2023  -  20/10/2023 (50 dias)</p>
                <div className="teamContainer">
                    <p className="teamHeader">Equipo:</p>
                    <p className="teamName">Los dibujitos</p>
                </div>
            </div>

            <ul className='members'>
                {memberData.map((member)=>{
                    return <MemberIcon 
                            name={member.name}
                            lastName={member.lastName}
                            profilePicture={member.profilePicture}
                            key={member.id}>
                    </MemberIcon>;
                })}
            </ul>

            <DropDownMenu info={sidebar1Data}></DropDownMenu>
            <DropDownMenu info={sidebar2Data}></DropDownMenu>
        </nav>
    );
}

export default ProjectSidebar;