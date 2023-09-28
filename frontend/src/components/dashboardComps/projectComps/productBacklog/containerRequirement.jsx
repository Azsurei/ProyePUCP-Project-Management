import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";

export default function containerScenario({indice}){
    return (
        <div className="containerDescription" >
            <div class="customInput">
                <label for="customPlaceholderInput" class="placeholderLabel">{`Requerimiento ${indice}`}</label>
                <textarea rows="3" id="customPlaceholderInput" className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="200"/>
            </div>
        </div>    
    );
}