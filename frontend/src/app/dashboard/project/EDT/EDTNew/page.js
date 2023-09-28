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
                <p className="Header">Informacion basica</p>
                <div className="FirstCardContainer">
                    <div className="FirstLeftCont">

                        <p>Nombre del componente</p>
                        <input type='text'></input>
                        <p>Tipo de componente</p>
                        <p>FASE</p>
                        <div style={{display:'flex',flexDirection:'row'}}> 
                            <p>Posicion</p> 
                            <img src='/icons/icon-info.svg' alt='help'></img>
                        </div>
                        <input></input>

                    </div>
                    <div className="FirstRightCont">
                        <p>Fecha de inicio</p>
                        <input></input>
                        <p>Fecha de fin</p>
                        <input></input>
                        <p>Responsables</p>
                        <input></input>
                    </div>
                </div>
            </div>

            <div className="NewEDTSection">
                <p className="Header">Detalles del componente</p>
                <div className="SecondCardContainer">
                    <p>Descripcion detallada</p>
                    <input></input>
                    <p>Recursos</p>
                    <input></input>
                    <p>Hito asociado</p>
                    <input></input>
                    <p>Observaciones</p>
                    <input></input>
                </div>
            </div>

            <div className="NewEDTSection">
                <p className="Header">Entregables</p>
                <div className="ThirdCardContainer">

                </div>
            </div>

            <div className="NewEDTSection">
                <p className="Header">Criterios de aceptación</p>
                <div className="FourthCardContainer">

                </div>
            </div>
            <div className="ButtonsContainer">
                <ButtonAddNew>Cancelar</ButtonAddNew>
                <ButtonAddNew>Guardar elemento</ButtonAddNew>
            </div>
        </div>
    );
}