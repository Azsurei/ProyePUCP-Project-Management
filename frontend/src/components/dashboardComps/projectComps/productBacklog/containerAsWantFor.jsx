import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";

export default function ContainerAsWantFor() {
    return (
        <div className="containerDescription">
            <div class="customInput">
                <label for="customPlaceholderInput1" class="placeholderLabel">Como...</label>
                <input type="text" id="customPlaceholderInput1" className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="50"/>
            </div>
            <div class="customInput">
                <label for="customPlaceholderInput2" class="placeholderLabel">Quiero...</label>
                <input type="text" id="customPlaceholderInput2" className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="50"/>
            </div>
            <div class="customInput">
                <label for="customPlaceholderInput3" class="placeholderLabel">Para...</label>
                <textarea rows="3" id="customPlaceholderInput3" className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="200"/>
            </div>
        </div>
    );
}
