import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDT.css";


export default function Equipo() {
    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <div className="EDT">
            <HeaderWithButtons haveReturn={false} 
                               haveAddNew={true}
                               hrefToReturn={''}
                               hrefForButton={'/dashboard/project/Equipo/nuevo_equipo'}
                               breadcrump={'Inicio / Proyectos / Proyect X / Equipos'}
                               btnText={'Crear nuevo equipo'}>Equipos</HeaderWithButtons>
            <div className="componentSearchContainer">
                <input type="text" /> 
                <button>
                    Buscar
                </button>
            </div>
        </div>
    );
}