"use client"

import "@/styles/dashboardStyles/projectStyles/EDTStyles/ListElementsEDT.css";
import { useState } from "react";



function CardEDT(props){
    let hasChilds;
    props.childList === null ? hasChilds=false : hasChilds=true;

    const [openChilds, setOpenChilds] = useState(false);
    const handleClick = ()=>{
        setOpenChilds(!openChilds);
    }


    return(
        <div>
            <li className="CardEDT" onClick={handleClick}>
                <div className="leftContainer">
                    <p className="cardTag" style={{backgroundColor: props.levelColor}}>{props.levelName}</p>
                    <div className="titleContainer">
                        <p className="cardNum">{props.levelCounter}.</p>
                        <p className="cardName">{props.name}</p>
                    </div>
                </div>
                
                <div className="buttonsContainer">
                    <button>Mas detalles</button>
                </div>

            </li>
            {hasChilds && openChilds && <ListElementsEDT listData={props.childList} initialMargin={20}></ListElementsEDT>}
        </div>
    )
}


//recuerda, en array ya tienes a la lista de hijos
//como la muestras?

export default function ListElementsEDT(props){
    const ListComps = props.listData;


    return(
        <ul className="ListElementsEDT" style={{marginLeft : props.initialMargin}}>
            {ListComps.map((component)=>{
                return (
                    <CardEDT key={component.id} 
                                name={component.componentName}
                                levelCounter={component.levelCounter}
                                levelName={component.levelName}
                                levelColor={component.levelColor}
                                childList={component.childsList}
                                initialMargin={component.initialMargin}>
                </CardEDT>
                );
            })} 
        </ul>
    );
}


//tu le das click a un CardEDT y se cargara la info de sus 
//hijos, repitiendo el ListElementsEDT