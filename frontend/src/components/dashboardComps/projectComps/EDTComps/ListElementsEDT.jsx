"use client"

import "@/styles/dashboardStyles/projectStyles/EDTStyles/ListElementsEDT.css";
import { useRef, useState } from "react";



function CardEDT(props){
    let hasChilds;
    props.childList === null ? hasChilds=false : hasChilds=true;

    const iconRef = useRef(null);
    const [openChilds, setOpenChilds] = useState(false);
    const [openMoreInfo, setOpenMoreInfo] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const handleClick = ()=>{
        if(hasChilds === true)
            setOpenChilds(!openChilds);
    }

    const handleOpenMore = (e) =>{
        e.stopPropagation();
        
        const iconRect = iconRef.current.getBoundingClientRect();
        setMenuPosition({
            top: iconRect.bottom + window.scrollY,
            left: iconRect.left + window.scrollX,
        });

        setOpenMoreInfo(!openMoreInfo);
    }


    return(
        <div>
            <li className={openChilds === true ? "CardEDT active" : "CardEDT"} onClick={handleClick}>
                <div className="leftContainer">
                    <p className="cardTag" style={{backgroundColor: props.levelColor}}>{props.levelName}</p>
                    <div className="titleContainer">
                        <p className="cardNum">{props.levelCounter}.</p>
                        <p className="cardName">{props.name}</p>
                    </div>
                </div>
                
                <div className="buttonsContainer">
                    <img src="/icons/icon-seeMore.svg" alt="More" className="iconSeeMore" ref={iconRef} onClick={handleOpenMore}/>
                    
                
                </div>

                {openMoreInfo && (
                    <div
                        className="menu"
                        style={{
                            position: 'absolute',
                            top: `${menuPosition.top}px`, // Set the top position dynamically
                            left: `calc(${menuPosition.left}px-50%)`, // Set the left position dynamically
                            background: 'white',
                            border: '1px solid #ccc',
                            padding: '10px',
                            zIndex: 1,
                            height: '100px',
                            width: '100px'
                        }}
                    >
                        {/* Menu content */}
                        <button>Opción 1</button>
                    </div>
                )}

            </li>
            {hasChilds && openChilds && <ListElementsEDT listData={props.childList} initialMargin={30}></ListElementsEDT>}
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
                                name={component.descripcion}
                                levelCounter={component.codigo}
                                levelName="FASE"
                                levelColor="purple"
                                childList={component.componentesHijos}
                                initialMargin={component.initialMargin}>
                </CardEDT>
                );
            })} 
        </ul>
    );
}


//tu le das click a un CardEDT y se cargara la info de sus 
//hijos, repitiendo el ListElementsEDT