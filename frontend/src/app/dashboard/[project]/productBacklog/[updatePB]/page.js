"use client"
import "@/styles/dashboardStyles/projectStyles/productBacklog/registerPB.css";
import ContainerAsWantFor from "@/components/dashboardComps/projectComps/productBacklog/containerAsWantFor";
import ContainerScenario from "@/components/dashboardComps/projectComps/productBacklog/containerScenario";
import ContainerRequirement2 from "@/components/dashboardComps/projectComps/productBacklog/containerRequirement2";
import DescriptionRequeriment from "@/components/dashboardComps/projectComps/productBacklog/descriptionRequirement";
import IconLabel from "@/components/dashboardComps/projectComps/productBacklog/iconLabel";
import { useEffect, useState } from "react";
import MyCombobox from "@/components/ComboBox";
import axios from "axios";
import { Spinner } from "@nextui-org/react";
import Modal from "@/components/dashboardComps/projectComps/productBacklog/Modal";
import {useRouter} from "next/navigation";
import ContainerScenario2 from "@/components/dashboardComps/projectComps/productBacklog/containerScenario2";
axios.defaults.withCredentials = true;

function getCurrentDate() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

export default function ProductBacklogUpdate(props) {
    const router=useRouter();
    const idHU= props.params.updatePB;
    const decodedUrl= decodeURIComponent(props.params.project); //borrar
    const projectId = decodedUrl.substring(decodedUrl.lastIndexOf('=') + 1);//borrar
    const stringURLEpics= `http://localhost:8080/api/proyecto/backlog/${projectId}/listarEpicas`;//borrar
    const [quantity, setQuantity] = useState(0);
    const [quantity1, setQuantity1] = useState(0);
    const [selectedValueEpic, setSelectedValueEpic] = useState(null);
    const [selectedValuePriority, setSelectedValuePriority] = useState(null);
    const [selectedValueState, setSelectedValueState] = useState(null);
    const [selectedNameEpic, setSelectedNameEpic] = useState("");
    const [selectedNamePriority, setSelectedNamePriority] = useState("");
    const [selectedNameState, setSelectedNameState] = useState("");
    const currentDate=getCurrentDate();
    const [scenarioFields, setScenarioFields] = useState([]);
    const [requirementFields, setRequirementFields] = useState([]);
    const [datosUsuario, setDatosUsuario] = useState(null);
    const [historiaUsuario, setHistoriaUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState("");
    const [como, setComo] = useState("");
    const [quiero, setQuiero] = useState("");
    const [para, setPara] = useState("");
    const [fieldsEmpty, setFieldsEmpty] = useState(false);

    useEffect(() => {
        if (historiaUsuario && historiaUsuario.hu) {
            setName(historiaUsuario.hu[0].descripcion);
            setSelectedNameEpic(historiaUsuario.hu[0].NombreEpica);
            setSelectedValueEpic(historiaUsuario.hu[0].idEpica);
            setSelectedNamePriority(historiaUsuario.hu[0].NombrePrioridad);
            setSelectedValuePriority(historiaUsuario.hu[0].idHistoriaPrioridad);
            setSelectedNameState(historiaUsuario.hu[0].DescripcionEstado);
            setSelectedValueState(historiaUsuario.hu[0].idHistoriaEstado);
            setComo(historiaUsuario.hu[0].como);
            setQuiero(historiaUsuario.hu[0].quiero);
            setPara(historiaUsuario.hu[0].para);
            setDatosUsuario(historiaUsuario.hu[0].NombreUsuario)
            const criteriosAceptacionOriginales= historiaUsuario.criteriosAceptacion;
            const scenarioFieldsActualizados = criteriosAceptacionOriginales.map((criterio) => ({
                idHistoriaCriterioDeAceptacion: criterio.idHistoriaCriterioDeAceptacion || '', // Puedes agregar un valor predeterminado en caso de que falte
                scenario: criterio.escenario || '', // Puedes agregar un valor predeterminado en caso de que falte
                dadoQue: criterio.dadoQue || '', // Puedes agregar un valor predeterminado en caso de que falte
                cuando: criterio.cuando || '', // Puedes agregar un valor predeterminado en caso de que falte
                entonces: criterio.entonces || '' // Puedes agregar un valor predeterminado en caso de que falte
            }));
            setScenarioFields(scenarioFieldsActualizados);
            const requerimientosOriginales= historiaUsuario.requirimientos;
            const requirementFieldsActualizados = requerimientosOriginales.map((requerimiento) => ({
                idHistoriaRequisito: requerimiento.idHistoriaRequisito || '', // Puedes agregar un valor predeterminado en caso de que falte
                requirement: requerimiento.descripcion || '', // Puedes agregar un valor predeterminado en caso de que falte
            }));
            setRequirementFields(requirementFieldsActualizados);
            console.log("Terminó de cargar los datos");
            setIsLoading(false);
        }
    }, [historiaUsuario]);

/*     useEffect(() => {
        const stringURLHU = `http://localhost:8080/api/proyecto/backlog/hu/${idHU}/listarHistoriaDeUsuario`;
        const stringURLUsuario = "http://localhost:8080/api/usuario/verInfoUsuario";
        Promise.all([
          axios.get(stringURLHU),
          axios.get(stringURLUsuario),
        ])
          .then(function (responses) {
            const huData = responses[0].data.historiaUsuario;
            const userData = responses[1].data.usuario[0];
            console.log("ID HU:", idHU);
            console.log("DATA:", huData);
            console.log("USUARIO:", userData);
            
            setHistoriaUsuario(huData);
            setDatosUsuario(userData);
            //setIsLoading(false);
          })
          .catch(function (error) {
            console.log(error);
          });
      }, []);     */

      useEffect(() => {
        const stringURLHU = `http://localhost:8080/api/proyecto/backlog/hu/${idHU}/listarHistoriaDeUsuario`;
        axios.get(stringURLHU)
        .then(function (response) {
          const huData = response.data.historiaUsuario;
          console.log("ID HU:", idHU);
          console.log("DATA:", huData);
          setHistoriaUsuario(huData);
          // Puedes manejar el estado de isLoading aquí
        })
        .catch(function (error) {
          console.log(error);
        });
    }, []); 
      //const [name, setName] = useState(historiaUsuario?.descripcion || "");


    
    function addContainer(){
        setQuantity(quantity+1);
        setScenarioFields((prevFields) => [
            ...prevFields,
            {
              idHistoriaCriterioDeAceptacion: '',
              scenario: '',
              dadoQue: '',
              cuando: '',
              entonces: '',
            }
          ]);
    }

    function addContainer1(){
        setQuantity1(quantity1+1);
        setRequirementFields([...requirementFields, { idHistoriaRequisito: '',requirement: '' }]);
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

    const onSubmit= ()=>{
        const idEpic=selectedValueEpic;
        const idPriority=selectedValuePriority;
        const idState=selectedValueState;
        const putData = {
            idHistoriaUsuario: parseInt(idHU),
            idEpic: idEpic,
            idPriority: idPriority,
            idState: idState,
            name: name,
            como: como,
            quiero: quiero,
            para: para,
            scenarioData: scenarioFields,
            requirementData: requirementFields
        };
        console.log("Actualizado correctamente");
        console.log(putData);
        axios.put("http://localhost:8080/api/proyecto/backlog/hu/modificarHistoriaDeUsuario", putData)
        .then((response) => {
          // Manejar la respuesta de la solicitud PUT
          console.log("Respuesta del servidor:", response.data);
          console.log("Registro correcto")
          // Realizar acciones adicionales si es necesario
        })
        .catch((error) => {
          // Manejar errores si la solicitud PUT falla
          console.error("Error al realizar la solicitud PUT:", error);
        });
    }; 

    return isLoading?(
        <div>Cargando datos...
            {console.log("Cargando")}
        </div>
        
    ):
    (
        <form  className="containerRegisterPB">
            <div className="headerRegisterPB">
                Inicio / Proyectos / Nombre del proyecto / Backlog / Product Backlog / Registrar elemento
            </div>
            <div className="backlogRegisterPB">
                <div className="titleBacklogRegisterPB">Editar elemento en el Backlog</div>
                { historiaUsuario ? (
                <div className="description">
                    <h4 style={{ fontWeight: 600 }}>Nombre de la historia de usuario<span className="text-red-500"> *</span></h4>
                    <DescriptionRequeriment name={name} onNameChange={setName}/>
                </div>
                ) : (
                    <div>Cargando datos...</div>
                )}
                <h4 style={{ fontWeight: 600 }}>Información de la historia de usuario<span className="text-red-500"> *</span></h4>
                <div className="combo">
                    <div className="epic containerCombo">
                        <IconLabel icon="/icons/epicPB.svg" label="Épica" className="iconLabel"/>
                        <MyCombobox urlApi={stringURLEpics} property="epicas" nameDisplay="nombre" hasColor={false} onSelect={handleSelectedValueChangeEpic} idParam="idEpica" initialName={selectedNameEpic}/>
                    </div>
                    {console.log("uwuwu",historiaUsuario.hu[0].idEpica)}
                    <div className="date containerCombo">
                        <IconLabel icon="/icons/datePB.svg" label="Fecha de creación" className="iconLabel"/>
                        <div className="dateOfCreation">{currentDate}</div>
                    </div>
                    <div className="priority containerCombo">
                        <IconLabel icon="/icons/priorityPB.svg" label="Prioridad" className="iconLabel"/>
                        <MyCombobox urlApi="http://localhost:8080/api/proyecto/backlog/hu/listarHistoriasPrioridad" property="historiasPrioridad" nameDisplay="nombre" hasColor={true} colorProperty="RGB" onSelect={handleSelectedValueChangePriority} idParam="idHistoriaPrioridad" initialName={selectedNamePriority}/>
                    </div>
                    <div className="createdBy containerCombo">
                        <IconLabel icon="/icons/createdByPB.svg" label="Creado por" className="iconLabel"/>
                        {isLoading ? (
                        <div className="flex gap-4">
                            <Spinner size="lg" />
                        </div>
                        )
                        :(
                            <div className="iconLabel2"> 
                                <p className="profilePic">
                                    {datosUsuario.split(' ')[0][0]+datosUsuario.split(' ')[1][0]}
                                </p>
                                <div className="label">
                                    {`${datosUsuario}`}
                                </div>
                            </div>
                        )
                        }
                        
                    </div>
                    <div className="state containerCombo">
                        <IconLabel icon="/icons/statePB.svg" label="Estado" className="iconLabel"/>
                        <MyCombobox urlApi="http://localhost:8080/api/proyecto/backlog/hu/listarHistoriasEstado" property="historiasEstado" nameDisplay="descripcion" onSelect={handleSelectedValueChangeState} idParam="idHistoriaEstado" initialName={selectedNameState}/>
                    </div>
                </div>
                <div className="userDescription">
                    <h4 style={{fontWeight: 600 }}>Descripción de usuario<span className="text-red-500"> *</span></h4>
                    <ContainerAsWantFor
                        como={como}
                        quiero={quiero}
                        para={para}
                        onComoChange={setComo}
                        onQuieroChange={setQuiero}
                        onParaChange={setPara}
                    />
                </div>  
                <div className="acceptanceCriteria">
                    <div className="titleButton">
                        <h4 style={{fontWeight: 600 }}>Criterios de aceptación</h4>
                    </div>
                    {scenarioFields.length===0? 
                        <div className="flex justify-center items-center">
                            <div>¡Puede agregar algunos criterios de aceptación!</div>
                        </div> 
                        :
                        historiaUsuario &&  scenarioFields.map((criterio, index) => (
                            <ContainerScenario2
                                key={index}
                                indice={index + 1}
                                onUpdateScenario={onUpdateScenario}
                                scenario={criterio}
                            />
                        ))
                    }
                    <div className="twoButtons">
                        <div className="buttonContainer">
                            <button onClick={addContainer} className="buttonTitle" type="button">Agregar</button>
                            <button onClick={removeContainer} className="buttonTitle" type="button">Eliminar</button>
                        </div>
                    </div>
                </div>
                <div className="requirements">
                    <div className="titleButton">
                        <h4 style={{fontWeight: 600 }}>Requerimientos funcionales</h4>
                    </div>
                    {requirementFields.length===0? 
                    <div className="flex justify-center items-center">
                        <div>¡Puede agregar algunos requerimientos!</div>
                    </div> 
                    :
                    historiaUsuario &&  requirementFields.map((requirement, index) => (
                        <ContainerRequirement2 key={index} indice={index+1} updateRequirementField={updateRequirementField} requirement={requirement}/>
                    ))}
                    <div className="twoButtons">
                        <div className="buttonContainer">
                            <button onClick={addContainer1} className="buttonTitle" type="button">Agregar</button>
                            <button onClick={removeContainer1} className="buttonTitle" type="button">Eliminar</button>
                        </div>
                    </div>
                </div>

                <div className="containerBottom">
                    {fieldsEmpty && <IconLabel icon="/icons/alert.svg" label="Faltan completar campos" className="iconLabel3"/>}
                    {/* {!fieldsEmpty && <div className="text-right justify-center items-center text-red-500 font-bold">Faltan completar campos</div>} */}
                    <div className="twoButtons1">
                        <div className="buttonContainer">
                            <Modal 
                            nameButton="Descartar" 
                            textHeader="Descartar Registro" 
                            textBody="¿Seguro que quiere descartar el registro de la historia de usuario?"
                            colorButton="w-36 bg-slate-100 text-black"
                            oneButton={false}
                            secondAction={() => router.back()}
                            textColor="red"
                            />
                            <Modal nameButton="Aceptar" 
                            textHeader="Registrar Historia de Usuario" 
                            textBody="¿Seguro que quiere registrar la historia de usuario?"
                            colorButton="w-36 bg-blue-950 text-white"
                            oneButton={false}
                            secondAction={() => {
                                onSubmit();
                                router.back();
                            }}
                            textColor="blue"
                            verifyFunction={() => {
                                if(name==="" || como==="" || quiero==="" || para==="" || selectedValueEpic===null || selectedValuePriority===null || selectedValueState===null){
                                    setFieldsEmpty(true);
                                    return false;
                                }else{
                                    setFieldsEmpty(false);
                                    return true;
                                }
                            }}
                            />
                        </div>
                    </div>
                </div>
            </div> 
        </form>
    );
}