import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDTNew.css";

export default function EDTNew() {
    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <div className="EDTNew">
            <HeaderWithButtons haveReturn={true} 
                               haveAddNew={true}
                               hrefToReturn={'/dashboard/project/EDT'}
                               breadcrump={'Inicio / Proyectos / Proyect X / EDT y Diccionario EDT'}
                               btnText={'Agregar elemento'}>Crear nuevo componente</HeaderWithButtons>
        </div>
    );
}