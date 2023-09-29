import "@/styles/dashboardStyles/projectStyles/productBacklog/productBacklog.css";
import Button from "@/components/Button";

export default function Project() {
    
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
                        <Button href="#tableroKanban" text="Tablero Kanban" className="btnBacklog"></Button>
                        <Button href="#sprintBacklog" text="Sprint Backlog" className="btnBacklog"></Button>
                        <Button href="#productBacklog" text="Product Backlog" className="btnBacklogPrimary"></Button>
                    </div>
                    <div className="navigationBacklogDerecha">
                        <Button href="/dashboard/project/productBacklog/registerPB" text="Añadir elemento" className="btnBacklogPrimary"></Button>
                    </div>
                </div>
                <div className="tableBacklog">
                    
                </div>
            </div>  
        </div>
    );
}






