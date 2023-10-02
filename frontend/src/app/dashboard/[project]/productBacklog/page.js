"use client"
import "@/styles/dashboardStyles/projectStyles/productBacklog/productBacklog.css";

//import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
import { useState, useEffect } from "react";
import PopUpEliminateHU from "@/components/PopUpEliminateHU";
import Link from "next/link";
import BacklogRow from "@/components/dashboardComps/projectComps/productBacklog/BacklogRow";
import TableComponent from "@/components/dashboardComps/projectComps/productBacklog/TableComponent";
import { data } from "autoprefixer";
export default function ProductBacklog(props) {
    const decodedUrl = decodeURIComponent(props.params.project);
    const projectId = decodedUrl.charAt(decodedUrl.length - 1);
    const projectName = decodedUrl.substring(0, decodedUrl.lastIndexOf("="));

    const stringURL = "http://localhost:8080/api/proyecto/77/6/backlog/epica/hu";

    const [modal, setModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const toggleModal = (task) => {
        setSelectedTask(task);
        setModal(!modal);
    };

    useEffect(() => {
        if(modal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }, [modal])

    
    
    const columns1 = {
        name: 'Nombre',
        className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
    }

    const columns2 = {
        name: 'Epica',
        className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
    }

    const columns3 = {
        name: 'Prioridad',
        className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
    }

    const columns4 = {
        name: 'Estado',
        className: 'px-4 py-2 text-xl font-semibold tracking-wide text-left',
    }
    const columns5 = {
        name: ' ',
        className: 'w-12 px-4 py-2 text-xl font-semibold tracking-wide text-left ',
    }
    const columns6 = {
        name: ' ',
        className: 'w-12 px-4 py-2 text-xl font-semibold tracking-wide text-left ',
    }


    const columns = [columns1, columns2, columns3, columns4, columns5, columns6];

    const data1 = {
        descripcion: 'Historia 1', 
        epic: 'Epic 1',
        priority: 'Must',
        state: 'No iniciado'
    }

    const data2 = {
        descripcion: 'Historia 2', 
        epic: 'Epic 2',
        priority: 'Could',
        state: 'En progreso'
    }

    const data3 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }

    const data4 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }

    const data5 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }

    const data6 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }
    const data7 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }
    const data8 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }
    const data9 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }

    const data10 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }

    const data11 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }

    const data12 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }

    const data13 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }

    const data14 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }

    const data15 = {
        descripcion: 'Historia 3', 
        epic: 'Epic 3',
        priority: 'Could',
        state: 'En progreso'
    }


    const data = [data1, data2, data3,data4,data5,data6,data7,data8, data9, data10, data11, data12, data13, data14, data15];

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
                            <button className="btnBacklog sm:w-1 sm:h-1" type="button">Tablero Kanban</button>
                        </Link>
                        <Link href="#sprintBacklog">
                            <button className="btnBacklog sm:w-1 sm:h-1" type="button">Sprint Backlog</button>
                        </Link>
                        <Link href="#productBacklog">
                            <button className="btnBacklogPrimary sm:w-1 sm:h-1" type="button">Product Backlog</button>
                        </Link>
                    </div>
                    <div className="navigationBacklogDerecha">
                        <Link href={"/dashboard/"+projectName+"="+projectId+"/productBacklog/registerPB"}>
                            <button className="btnBacklogPrimary sm:w-1 sm:h-1" type="button">Añadir elemento</button>
                        </Link>
                    </div>
                </div>
                <div>
                <TableComponent data={data} /*urlApi = {stringURL}*/ columns={columns} toggleModal={toggleModal} rowComponent={BacklogRow}/> {/* Pasa toggleModal como prop al componente TableComponent */}
                </div>
                
            </div>
            {modal && selectedTask && (
                <PopUpEliminateHU
                    modal = {modal} 
                    toggle={() => toggleModal(selectedTask)} // Pasa la función como una función de flecha
                    taskName={selectedTask.descripcion}
                />
            )}
            
        </div>
    );
}






