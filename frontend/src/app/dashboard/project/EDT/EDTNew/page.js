import ButtonAddNew from "@/components/dashboardComps/projectComps/EDTComps/ButtonAddNew";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDTNew.css";

export default function EDTNew() {
    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <div className="EDTNew">
            <HeaderWithButtons haveReturn={true} 
                               haveAddNew={true}
                               hrefToReturn={'/dashboard/project/EDT'}
                               hrefForButton={''}
                               breadcrump={'Inicio / Proyectos / Proyect X / EDT y Diccionario EDT'}
                               btnText={'Agregar elemento'}>Crear nuevo componente</HeaderWithButtons>

            <div className="NewEDTSection">
                <p className="Header">Informacion basica del elemento EDT</p>
                <div className="FirstCardContainer">

                </div>
            </div>
            <div className="NewEDTSection">
                <p className="Header">Detalles del elemento EDT</p>
                <div className="SecondCardContainer">

                </div>
            </div>
            <div className="NewEDTSection">
                <p className="Header">Detalles del elemento EDT</p>
                <div className="SecondCardContainer">

                </div>
            </div>
            <div className="NewEDTSection">
                <p className="Header">Detalles del elemento EDT</p>
                <div className="SecondCardContainer">

                </div>
            </div>
            <div className="ButtonsContainer">
                <ButtonAddNew>Cancelar</ButtonAddNew>
                <ButtonAddNew>Guardar elemento</ButtonAddNew>
            </div>
        </div>
    );
}