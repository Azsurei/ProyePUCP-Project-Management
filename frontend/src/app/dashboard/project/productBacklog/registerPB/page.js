"use client"
import "@/styles/dashboardStyles/projectStyles/productBacklog/registerPB.css";
import ContainerAsWantFor from "@/components/dashboardComps/projectComps/productBacklog/containerAsWantFor";
import ContainerScenario from "@/components/dashboardComps/projectComps/productBacklog/containerScenario";
import ContainerRequirement from "@/components/dashboardComps/projectComps/productBacklog/containerRequirement";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
import { useState, useRef } from "react";
import Link from "next/link";

export default function Project() {
    const [quantity, setQuantity] = useState(1);
    const [quantity1, setQuantity1] = useState(1);

    function addContainer(){
        setQuantity(quantity+1);
    }

    function addContainer1(){
        setQuantity1(quantity1+1);
    }

    return(
        <div className="container">
            <div className="header">
                Inicio / Proyectos / Nombre del proyecto / Backlog / Product Backlog / Registrar elemento
            </div>
            <div className="backlog">
                <div className="titleBacklog">Registrar nuevo elemento en el Backlog</div>
                <div className="combo">
                    <div className="epic">
                        <IconLabel icon="/icons/epicPB.svg" label="Épica"/>
                    </div>
                    <div className="date">
                        <IconLabel icon="/icons/datePB.svg" label="Fecha de creación"/>
                    </div>
                    <div className="priority">
                        <IconLabel icon="/icons/priorityPB.svg" label="Prioridad"/>
                    </div>
                    <div className="createdBy">
                        <IconLabel icon="/icons/createdByPB.svg" label="Creado por"/>
                    </div>
                    <div className="state">
                        <IconLabel icon="/icons/statePB.svg" label="Estado"/>
                    </div>
                    <div className="assignedTo">
                        <IconLabel icon="/icons/assignedToPB.svg" label="Asignado a"/>
                    </div>
                </div>
                <div className="userDescription">
                    <h4>Descripción de usuario</h4>
                    <ContainerAsWantFor/>
                </div>  
                <div className="acceptanceCriteria">
                    <div className="titleButton">
                        <h4>Criterios de aceptación</h4>
                        <button onClick={addContainer} className="buttonTitle">Agregar</button>
                    </div>
                    {Array.from({ length: quantity }, (_, index) => (
                        <ContainerScenario key={index} indice={index+1}/>
                    ))}
                </div>
                <div className="requirements">
                    <div className="titleButton">
                        <h4>Requerimientos funcionales</h4>
                        <button onClick={addContainer1} className="buttonTitle">Agregar</button>
                    </div>
                    {Array.from({ length: quantity1 }, (_, index) => (
                        <ContainerRequirement key={index} indice={index+1}/>
                    ))}
                </div>

                <div className="cancelarAceptar">
                    <div className="buttonContainer">
                        {/* Probablemente necesite usar router luego en vez de link */}
                        <Link href="#cancelar">
                            <button className="btnBacklogCancel" type="button">Cancelar</button>
                        </Link>
                        <Link href="#aceptar">
                            <button className="btnBacklogContinue" type="button">Aceptar</button>
                        </Link>
                    </div>
                </div>
            </div>  
        </div>
    );
}