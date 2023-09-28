import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";

export default function containerScenario({indice}){
    return (
        <div className="containerDescription" >
            <div class="customInput">
                <label for="customPlaceholderInput1" class="placeholderLabel">{`Escenario ${indice}:`}</label>
                <input type="text" id="customPlaceholderInput1" className="customPlaceholderInput" placeholder="Escribe aquí"/>
            </div>
            <div class="customInput">
                <label for="customPlaceholderInput3" class="placeholderLabel">Dado que...</label>
                <textarea rows="2" id="customPlaceholderInput3" className="customPlaceholderInput" placeholder="Escribe aquí"/>
            </div>
            <div class="customInput">
                <label for="customPlaceholderInput3" class="placeholderLabel">Cuando...</label>
                <textarea rows="2" id="customPlaceholderInput3" className="customPlaceholderInput" placeholder="Escribe aquí"/>
            </div>
            <div class="customInput">
                <label for="customPlaceholderInput3" class="placeholderLabel">Entonces...</label>
                <textarea rows="3" id="customPlaceholderInput3" className="customPlaceholderInput" placeholder="Escribe aquí"/>
            </div>
        </div>    
    );
}