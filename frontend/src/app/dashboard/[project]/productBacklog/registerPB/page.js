"use client"
import "@/styles/dashboardStyles/projectStyles/productBacklog/registerPB.css";
import ContainerAsWantFor from "@/components/dashboardComps/projectComps/productBacklog/containerAsWantFor";
import ContainerScenario from "@/components/dashboardComps/projectComps/productBacklog/containerScenario";
import ContainerRequirement from "@/components/dashboardComps/projectComps/productBacklog/containerRequirement";
import DescriptionRequeriment from "@/components/dashboardComps/projectComps/productBacklog/descriptionRequirement";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
import { useEffect, useState } from "react";
import MyCombobox from "@/components/ComboBox";
import Link from "next/link";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";

axios.defaults.withCredentials = true;

function getCurrentDate() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

export default function ProductBacklogRegister(props) {
    const decodedUrl= decodeURIComponent(props.params.project);
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf('=') + 1);
    const stringURLEpics= "http://localhost:8080/api/proyecto/backlog/1/listarEpicas";
    const [quantity, setQuantity] = useState(1);
    const [quantity1, setQuantity1] = useState(1);
    const [selectedValueEpic, setSelectedValueEpic] = useState(null);
    const [selectedValuePriority, setSelectedValuePriority] = useState(null);
    const [selectedValueState, setSelectedValueState] = useState(null);
    const currentDate=getCurrentDate();
    const [scenarioFields, setScenarioFields] = useState([{ scenario: '', dadoQue: '', cuando: '', entonces: '' }]);
    const [requirementFields, setRequirementFields] = useState([{ requirement: '' }]);
    const [datosUsuario, setDatosUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("ID RECOGIDO = " + projectId);

        const stringURLUsuario="http://localhost:8080/api/usuario/verInfoUsuario";

        axios.get(stringURLUsuario).
            then(function(response){
                const userData= response.data.usuario[0];
                setDatosUsuario(userData);
                setIsLoading(false);    
            })
            .catch(function(error){
                console.log(error);
            });
    },[]);    

    function addContainer(){
        setQuantity(quantity+1);
        setScenarioFields((prevFields) => [
            ...prevFields,
            {
              scenario: '',
              dadoQue: '',
              cuando: '',
              entonces: '',
            }
          ]);
    }

    function addContainer1(){
        setQuantity1(quantity1+1);
        setRequirementFields([...requirementFields, { requirement: '' }]);
    }

    function removeContainer() {
        setQuantity(quantity - 1);
        setScenarioFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields.pop(); // Eliminar el último elemento del arreglo
            return updatedFields;
        });
      }

    function removeContainer1(){
        setQuantity1(quantity1-1);
        setRequirementFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields.pop(); // Eliminar el último elemento del arreglo
            return updatedFields;
        });
    }
    const handleSelectedValueChangeEpic = (value) => {
        setSelectedValueEpic(value);
    };

    const handleSelectedValueChangePriority = (value) => {
        setSelectedValuePriority(value);
    };

    const handleSelectedValueChangeState = (value) => {
        setSelectedValueState(value);
    };

    const onUpdateScenario = (index, field, value) => {
        setScenarioFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index-1][field] = value;
            return updatedFields;
        });
      };
    
    const updateRequirementField = (index, value) => {
        setRequirementFields((prevFields) => {
            const updatedFields = [...prevFields];
            updatedFields[index-1].requirement = value;
            return updatedFields;
        });
    };

    const onSubmit=(e)=>{
        e.preventDefault();
        const idEpic=selectedValueEpic;
        const idPriority=selectedValuePriority;
        const idState=selectedValueState;
        const name=e.target.customPlaceholderInput9.value;
        const como=e.target.customPlaceholderInput1.value;
        const quiero=e.target.customPlaceholderInput2.value;
        const para=e.target.customPlaceholderInput3.value;
        const postData = {
            idEpic: idEpic,
            idPriority: idPriority,
            idState: idState,
            name: name,
            como: como,
            quiero: quiero,
            para: para,
            currentDate: currentDate,
            idUsuario: datosUsuario.idUsuario,
            scenarioData: scenarioFields,
            requirementData: requirementFields,
        };

        axios.post("http://localhost:8080/api/proyecto/backlog/hu/insertarHistoriaDeUsuario", postData)
        .then((response) => {
          // Manejar la respuesta de la solicitud POST
          console.log("Respuesta del servidor:", response.data);
          console.log("Registro correcto")
          // Realizar acciones adicionales si es necesario
        })
        .catch((error) => {
          // Manejar errores si la solicitud POST falla
          console.error("Error al realizar la solicitud POST:", error);
        });
    };

    return(
        <form onSubmit={onSubmit}  className="containerRegisterPB">
            <div className="headerRegisterPB">
                Inicio / Proyectos / Nombre del proyecto / Backlog / Product Backlog / Registrar elemento
            </div>
            <div className="backlogRegisterPB">
                <div className="titleBacklogRegisterPB">Registrar nuevo elemento en el Backlog</div>
                <div className="combo">
                    <div className="epic containerCombo">
                        <IconLabel icon="/icons/epicPB.svg" label="Épica" className="iconLabel"/>
                        <MyCombobox urlApi={stringURLEpics} property="epicas" nameDisplay="nombre" hasColor={false} onSelect={handleSelectedValueChangeEpic} idParam="idEpica"/>
                    </div>
                    <div className="date containerCombo">
                        <IconLabel icon="/icons/datePB.svg" label="Fecha de creación" className="iconLabel"/>
                        <div className="dateOfCreation">{currentDate}</div>
                    </div>
                    <div className="priority containerCombo">
                        <IconLabel icon="/icons/priorityPB.svg" label="Prioridad" className="iconLabel"/>
                        <MyCombobox urlApi="http://localhost:8080/api/proyecto/backlog/hu/listarHistoriasPrioridad" property="historiasPrioridad" nameDisplay="nombre" hasColor={true} colorProperty="RGB" onSelect={handleSelectedValueChangePriority} idParam="idHistoriaPrioridad"/>
                    </div>
                    <div className="createdBy containerCombo">
                        <IconLabel icon="/icons/createdByPB.svg" label="Creado por" className="iconLabel"/>
                        {isLoading ? (
                        <div className="flex gap-4">
                            <Spinner size="lg" />
                        </div>
                        )
                        :(
                            <IconLabel icon="/icons/icon-usr.svg" label={`${datosUsuario?.nombres} ${datosUsuario?.apellidos}`} className="iconLabel2"/>
                        )
                        }
                        
                    </div>
                    <div className="state containerCombo">
                        <IconLabel icon="/icons/statePB.svg" label="Estado" className="iconLabel"/>
                        <MyCombobox urlApi="http://localhost:8080/api/proyecto/backlog/hu/listarHistoriasEstado" property="historiasEstado" nameDisplay="descripcion" onSelect={handleSelectedValueChangeState} idParam="idHistoriaEstado"/>
                    </div>
                </div>
                <div className="description">
                    <h4>Nombre de historia de usuario</h4>
                    <DescriptionRequeriment/>
                </div>
                <div className="userDescription">
                    <h4>Descripción de usuario</h4>
                    <ContainerAsWantFor/>
                </div>  
                <div className="acceptanceCriteria">
                    <div className="titleButton">
                        <h4>Criterios de aceptación</h4>
                    </div>
                    {Array.from({ length: quantity }, (_, index) => (
                        <ContainerScenario key={index} indice={index+1} onUpdateScenario={onUpdateScenario}/>
                    ))}
                    <div className="twoButtons">
                        <div className="buttonContainer">
                            <button onClick={addContainer} className="buttonTitle" type="button">Agregar</button>
                            <button onClick={removeContainer} className="buttonTitle" type="button">Eliminar</button>
                        </div>
                    </div>
                </div>
                <div className="requirements">
                    <div className="titleButton">
                        <h4>Requerimientos funcionales</h4>
                    </div>
                    {Array.from({ length: quantity1 }, (_, index) => (
                        <ContainerRequirement key={index} indice={index+1} updateRequirementField={updateRequirementField}/>
                    ))}
                    <div className="twoButtons">
                        <div className="buttonContainer">
                            <button onClick={addContainer1} className="buttonTitle" type="button">Agregar</button>
                            <button onClick={removeContainer1} className="buttonTitle" type="button">Eliminar</button>
                        </div>
                    </div>
                </div>

                <div className="twoButtons">
                    <div className="buttonContainer">
                        {/* Probablemente necesite usar router luego en vez de link */}
                        <Modal/>
                        <button className="btnBacklogContinue" type="submit">Aceptar</button>
                    </div>
                </div>
            </div> 
        </form>
    );
}