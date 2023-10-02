"use client"
import { createContext, useState } from "react";
import HeaderWithButtonsSamePage from "./HeaderWithButtonsSamePage";
import ListElementsEDT from "./ListElementsEDT";

export const OpenMenuContext = createContext();

export default function EDTVisualization({projectName,projectId, ListComps, handlerGoToNew}) {

    const [openMenuId, setOpenMenuId] = useState(null);

    const toggleMenu = (id) => {
        if(openMenuId === id){
            setOpenMenuId(null);
            console.log('CERRANDO MENU DE ID = '+id);
        }else{
            setOpenMenuId(id);
            console.log('abriendo menu de id = '+id);
        }
    }

    return (
        <div className="EDT">
            <HeaderWithButtonsSamePage
                haveReturn={false}
                haveAddNew={true}
                handlerAddNew={handlerGoToNew}
                newPrimarySon={ListComps.length+1}
                breadcrump={"Inicio / Proyectos / Proyect X"}
                btnText={"Agregar nueva fase"}
            >
                EDT y diccionario EDT
            </HeaderWithButtonsSamePage>
            <div className="componentSearchContainer">
                <input type="text" />
                <button>Buscar</button>
            </div>



            <OpenMenuContext.Provider value={{openMenuId, toggleMenu, handlerGoToNew}}>
                <ListElementsEDT
                    listData={ListComps}
                    initialMargin={0}
                ></ListElementsEDT>
            </OpenMenuContext.Provider>
            
        </div>
    );
}
