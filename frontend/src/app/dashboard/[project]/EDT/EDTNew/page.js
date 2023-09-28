import ButtonAddNew from "@/components/dashboardComps/projectComps/EDTComps/ButtonAddNew";
import HeaderWithButtons from "@/components/dashboardComps/projectComps/EDTComps/HeaderWithButtons";
import ListEditableInput from "@/components/dashboardComps/projectComps/EDTComps/ListEditableInput";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/EDTNew.css";

let conteoEntregables = 1;
const newEntregables=[
    {
        number: 1,
        data: ''
    }
];

let conteoCriterios = 1;
const newCriteriosAceptacion=[
    {
        number: 1,
        data: ''
    }
];


export default function EDTNew(props) {
    const projectName = props.params.project;


    const handleAddEntregable = ()=>{
        newEntregables.push({
            number: conteoEntregables + 1,
            data: ''
        })
        //falta implementarlo al onClick del boton (configurar el componente)
    }

    return (
        //aqui va el contenido dentro de la pagina de ruta /project
        <div className="EDTNew">
            <HeaderWithButtons haveReturn={true} 
                               haveAddNew={true}
                               hrefToReturn={'/dashboard/' + projectName + '/EDT'}
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
                <div style={{display:'flex', justifyContent:'space-between', alignContent:'center'}}>
                    <p className="Header">Entregables</p>
                    <ButtonAddNew>Añadir entregable</ButtonAddNew>
                </div>

                <div className="ThirdCardContainer">
                    <ListEditableInput ListInputs={newEntregables} typeName="Entregable"></ListEditableInput>
                </div>
            </div>

            <div className="NewEDTSection">
                <div style={{display:'flex', justifyContent:'space-between', alignContent:'center'}}>
                    <p className="Header">Criterios de aceptacion</p>
                    <ButtonAddNew>Añadir criterio</ButtonAddNew>
                </div>

                <div className="FourthCardContainer">
                <ListEditableInput ListInputs={newCriteriosAceptacion} typeName="Criterio"></ListEditableInput>
                </div>
            </div>
            <div className="ButtonsContainer">
                <ButtonAddNew>Cancelar</ButtonAddNew>
                <ButtonAddNew>Guardar elemento</ButtonAddNew>
            </div>
        </div>
    );
}