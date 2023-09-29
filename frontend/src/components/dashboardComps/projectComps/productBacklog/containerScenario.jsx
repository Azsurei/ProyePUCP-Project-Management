import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";

export default function containerScenario({indice}){
    return (
        <div className="containerDescription" >
            <div className="customInput">
                <label for="customPlaceholderInput1" className="placeholderLabel">{`Escenario ${indice}:`}</label>
                <input type="text" id="customPlaceholderInput1" className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="50"/>
            </div>
            <div className="customInput">
                <label for="customPlaceholderInput3" className="placeholderLabel">Dado que...</label>
                <textarea rows="2" id="customPlaceholderInput3" className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="150"/>
            </div>
            <div className="customInput">
                <label for="customPlaceholderInput3" className="placeholderLabel">Cuando...</label>
                <textarea rows="2" id="customPlaceholderInput3" className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="150"/>
            </div>
            <div className="customInput">
                <label for="customPlaceholderInput3" className="placeholderLabel">Entonces...</label>
                <textarea rows="3" id="customPlaceholderInput3" className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="200"/>
            </div>
        </div>    
    );
}