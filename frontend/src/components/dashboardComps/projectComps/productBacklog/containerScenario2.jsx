import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";

export default function ContainerScenario({indice,onUpdateScenario, scenario}){
    const inputId1 = `customPlaceholderScenarioInput1-${indice}`;
    const inputId2 = `customPlaceholderScenarioInput2-${indice}`;
    const inputId3 = `customPlaceholderScenarioInput3-${indice}`;
    const inputId4 = `customPlaceholderScenarioInput4-${indice}`;

    const handleInputChange = (field, value) => {
        onUpdateScenario(indice, field, value);
    };

    return (
        <div className="containerDescription" >
            <div className="customInput">
                <label htmlFor={inputId1} className="placeholderLabel">{`Escenario ${indice}:`}</label>
                <input type="text" id={inputId1}  className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="200" onChange={(e)=>handleInputChange('scenario',e.target.value)} value={scenario.scenario}/>
            </div>
            <div className="customInput">
                <label htmlFor={inputId2}  className="placeholderLabel">Dado que...</label>
                <textarea rows="2" id={inputId2}  className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="200" onChange={(e)=>handleInputChange('dadoQue',e.target.value)} value={scenario.dadoQue}/>
            </div>
            <div className="customInput">
                <label htmlFor={inputId3} className="placeholderLabel">Cuando...</label>
                <textarea rows="2" id={inputId3} className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="200" onChange={(e)=>handleInputChange('cuando',e.target.value)} value={scenario.cuando}/>
            </div>
            <div className="customInput">
                <label htmlFor={inputId4} className="placeholderLabel">Entonces...</label>
                <textarea rows="3" id={inputId4} className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="400" onChange={(e)=>handleInputChange('entonces',e.target.value)} value={scenario.entonces}/>
            </div>
        </div>    
    );
}