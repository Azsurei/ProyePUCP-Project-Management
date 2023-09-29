import TextField from "@/components/TextField";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/ListEditableInput.css";

function EditableInput(props){
    //recibe props 'name', 'number' (?) y 'data'
    //if data === '' entonces poner un placeholder

    return(
        <li className="EditableInput">
            <p className="newInputEntrName">{props.typeName} #{props.number}</p>
            <div className="inputXdeleteContainer">
                <textarea rows="1" className="inputBox" placeholder="Escribe aquí" maxLength="70"/>
                {/* <TextField className="inputBox"></TextField> */}
                <img src="/icons/icon-cross.svg" alt="Eliminar" className="iconDeleteInput" />
            </div>
        </li>
    );
}

export default function ListEditableInput(props){
    //recibe un array con los entregables
    // 'number' y 'data'
    return(
        <ul className="ListEditableInput">
            {props.ListInputs.map((item)=>{return(
                <EditableInput key={item.index}
                               typeName={props.typeName} 
                               number={item.index}
                               data={item.data}>
                </EditableInput>
            );
            })}
        </ul>
    );
}