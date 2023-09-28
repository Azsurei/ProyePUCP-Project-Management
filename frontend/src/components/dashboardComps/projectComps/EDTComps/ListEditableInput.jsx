

function EditableInput(props){
    //recibe props 'name', 'number' (?) y 'data'
    //if data === '' entonces poner un placeholder

    return(
        <li className="EditableInput">
            <p className="newInputEntrName">{props.typeName}</p>
            <div className="inputXdeleteContainer">
                <input className="newInputEntr"></input>
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
                <EditableInput key={item.number}
                               typeName={props.typeName} 
                               number={item.number}
                               data={item.data}>
                </EditableInput>
            );
            })}
        </ul>
    );
}