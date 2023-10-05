import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";

export default function ContainerRequirement({indice,updateRequirementField}){
    const inputId1 = `customPlaceholderRequirementInput1-${indice}`;

    const handleInputChange = (value) => {
        updateRequirementField(indice, value);
    };

    return (
        <div className="containerDescription" >
            <div className="customInput">
                <label htmlFor={inputId1} className="placeholderLabel">{`Requerimiento ${indice}`}</label>
                <textarea rows="3" id={inputId1} className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="200" onChange={(e)=>handleInputChange(e.target.value)}/>
            </div>
        </div>    
    );
}