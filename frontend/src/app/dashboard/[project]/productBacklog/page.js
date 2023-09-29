"use client"
import "@/styles/dashboardStyles/projectStyles/productBacklog/productBacklog.css";

import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
import { useState, useEffect } from "react";
import PopUpEliminateHU from "@/components/PopUpEliminateHU";
import Link from "next/link";

export default function Project() {
    
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
    };

    useEffect(() => {
        if(modal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [modal])

    

    const data1 = {
        name: 'Historia 1', 
        epic: 'Epic 1',
        priority: 'Must',
        state: 'No iniciado'
    }

    const data2 = {
        name: 'Historia 2', 
        epic: 'Epic 2',
        priority: 'Could',
        state: 'En progreso'
    }

    const data = [data1, data2];

    //const [datas, setDatas] = useState([]);

    return (
        //Aqui va el codigo del contenido del dashboard
        <div className="container">
            <div className="header">
                Inicio / Proyectos / Nombre del proyecto / Backlog / Product Backlog
            </div>
            <div className="backlog">
                <div className="titleBacklog">BACKLOG</div>
                <div className="navigationBacklog">
                    <div className="navigationBacklogIzquierda">
                        <Link href="#tableroKanban">
                            <button className="btnBacklog" type="button">Tablero Kanban</button>
                        </Link>
                        <Link href="#sprintBacklog">
                            <button className="btnBacklog" type="button">Sprint Backlog</button>
                        </Link>
                        <Link href="#productBacklog">
                            <button className="btnBacklogPrimary" type="button">Product Backlog</button>
                        </Link>
                    </div>
                    <div className="navigationBacklogDerecha">
                        <Link href="/dashboard/project/productBacklog/registerPB">
                            <button className="btnBacklogPrimary" type="button">Añadir elemento</button>
                        </Link>
                    </div>
                </div>

                <div className="tableBacklog overflow-x-auto overflow-y-auto rounded-lg shadow w-100">
                    <table className="table table-hover min-w-full">
                    <thead className="bg-blue-300 border-b-2 border-gray-200">
                        <tr>
                            <th scope="col" className="px-4  py-2 text-xl font-semibold tracking-wide text-left ">Historia de usuario</th>
                            <th scope="col" className="px-4 py-2 text-xl font-semibold tracking-wide text-left ">Epica</th>
                            <th scope="col" className="w-36 px-4 py-2 text-xl font-semibold tracking-wide text-left ">Prioridad</th>
                            <th scope="col" className="w-36 px-4 py-2 text-xl font-semibold tracking-wide text-left ">Estado</th>
                            <th scope="col" className="w-12 px-4 py-2 text-xl font-semibold tracking-wide text-left "></th>
                            <th scope="col" className="w-12 px-4 py-2 text-xl font-semibold tracking-wide text-left "></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((value, index) => (
                        <tr key={index} className="bg-gray-50 border-t">
                            <td className="px-4 py-2 text-xl text-gray-700 whitespace-nowrap ">{value.name}</td>
                            <td className="px-4 py-2 text-xl text-gray-700 whitespace-nowrap ">{value.epic}</td>
                            <td className=" px-4 py-2 text-lg text-gray-700 whitespace-nowrap ">
                                <span className="p-1.5 text-sm font-sm uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50">{value.priority}</span>
                            </td>
                            <td className=" px-4 py-2 text-lg text-gray-700 whitespace-nowrap ">
                                <span className="p-1.5 text-sm font-medium uppercase tracking-wider text-gray-800 bg-gray-200 rounded-lg bg-opacity-50">{value.state}</span>
                            </td>
                            <td className=" items-center whitespace-nowrap " style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                <IconLabel icon="/icons/editar.svg" className="iconEdition"/>
                            </td>
                            <td className=" items-center whitespace-nowrap " style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                <button onClick={toggleModal}>
                                <IconLabel icon="/icons/eliminar.svg" className="iconElimination"/>
                                </button>

                               
                            </td>
                            
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
            <PopUpEliminateHU
                modal = {modal} 
                toggle = {toggleModal}
            />
        </div>
    );
}






