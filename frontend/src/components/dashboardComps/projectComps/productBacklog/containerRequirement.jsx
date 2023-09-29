import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";

export default function containerScenario({indice}){
    return (
        <div className="containerDescription" >
            <div className="customInput">
                <label for="customPlaceholderInput" className="placeholderLabel">{`Requerimiento ${indice}`}</label>
                <textarea rows="3" id="customPlaceholderInput" className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="200"/>
            </div>
        </div>    
    );
}