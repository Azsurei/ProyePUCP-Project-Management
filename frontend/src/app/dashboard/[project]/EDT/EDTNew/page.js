"use client"
import ButtonAddNew from "@/components/dashboardComps/projectComps/EDTComps/ButtonAddNew";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import ListEditableInput from "@/components/dashboardComps/projectComps/EDTComps/ListEditableInput";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDTNew.css";
import { useState } from "react";

let conteoEntregables = 1;
const newEntregables=[
    {
        number: 1,
        data: ''
    }
];

let conteoCriterios = 1;
const newCriteriosAceptacion=[
    {
        number: 1,
        data: ''
    }
];


export default function EDTNew(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.charAt(decodedUrl.length - 1);
    const projectName= decodedUrl.substring(0, decodedUrl.lastIndexOf('='));

    const [listEntregables, setListEntregables] = useState([{index: 1, data: ''}]);
    const [listCriterios, setListCriterios] = useState([{index: 1, data: ''}]);


    const handleAddEntregable = ()=>{
        const newList = [
            ...listEntregables, 
            {
            index: listEntregables.length + 1,
            data: ''
            }
        ];
        setListEntregables(newList);
    }

    const handleAddCriterio = ()=>{
        const newLista = [
            ...listCriterios, 
            {
            index: listCriterios.length + 1,
            data: ''
            }
        ];
        setListCriterios(newLista);
    }




    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <div className="EDTNew">
            <HeaderWithButtons haveReturn={true} 
                               haveAddNew={true}
                               hrefToReturn={'/dashboard/' + projectName+'='+projectId + '/EDT'}
                               hrefForButton={''}
                               breadcrump={'Inicio / Proyectos / Proyect X / EDT y Diccionario EDT'}
                               btnText={'Agregar elemento'}>Crear nuevo componente</HeaderWithButtons>

            <div className="NewEDTSection">
                <p className="Header">Informacion basica</p>
                <div className="FirstCardContainer">
                    <div className="FirstLeftCont">

                        <p>Nombre del componente</p>
                        <input type='text'></input>
                        <p>Tipo de componente</p>
                        <p>FASE</p>
                        <div style={{display:'flex',flexDirection:'row'}}> 
                            <p>Posicion</p> 
                            <img src='/icons/icon-info.svg' alt='help'></img>
                        </div>
                        <input></input>

                    </div>
                    <div className="FirstRightCont">
                        <p>Fecha de inicio</p>
                        <input></input>
                        <p>Fecha de fin</p>
                        <input></input>
                        <p>Responsables</p>
                        <input></input>
                    </div>
                </div>
            </div>

            <div className="NewEDTSection">
                <p className="Header">Detalles del componente</p>
                <div className="SecondCardContainer">
                    <p>Descripcion detallada</p>
                    <input></input>
                    <p>Recursos</p>
                    <input></input>
                    <p>Hito asociado</p>
                    <input></input>
                    <p>Observaciones</p>
                    <input></input>
                </div>
            </div>


            <div className="NewEDTSection">
                <div style={{display:'flex', justifyContent:'space-between', alignContent:'center'}}>
                    <p className="Header">Entregables</p>
                    <button onClick={handleAddEntregable} style={{backgroundColor:'green'}}>Anadir entregable</button>
                </div>

                <div className="ThirdCardContainer">
                    <ListEditableInput ListInputs={listEntregables} typeName="Entregable"></ListEditableInput>
                </div>
            </div>


            <div className="NewEDTSection">
                <div style={{display:'flex', justifyContent:'space-between', alignContent:'center'}}>
                    <p className="Header">Criterios de aceptacion</p>
                    <button onClick={handleAddCriterio} style={{backgroundColor:'green'}}>Anadir criterio</button>
                </div>

                <div className="FourthCardContainer">
                    <ListEditableInput ListInputs={listCriterios} typeName="Criterio"></ListEditableInput>
                </div>
            </div>
            <div className="ButtonsContainer">
                <ButtonAddNew>Cancelar</ButtonAddNew>
                <ButtonAddNew>Guardar elemento</ButtonAddNew>
            </div>
        </div>
    );
}