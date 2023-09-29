import "@/styles/dashboardStyles/projectStyles/productBacklog/ContainerAsWantFor.css";

export default function ContainerAsWantFor() {
    return (
        <div className="containerDescription">
            <div className="customInput">
                <label for="customPlaceholderInput1" className="placeholderLabel">Como...</label>
                <input type="text" id="customPlaceholderInput1" className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="50"/>
            </div>
            <div className="customInput">
                <label for="customPlaceholderInput2" className="placeholderLabel">Quiero...</label>
                <input type="text" id="customPlaceholderInput2" className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="50"/>
            </div>
            <div className="customInput">
                <label for="customPlaceholderInput3" className="placeholderLabel">Para...</label>
                <textarea rows="3" id="customPlaceholderInput3" className="customPlaceholderInput" placeholder="Escribe aquí"  maxLength="200"/>
            </div>
        </div>
    );
}
