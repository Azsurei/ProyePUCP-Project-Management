import TextField from "@/components/TextField";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/ListEditableInput.css";

function EditableInput(props) {
    //recibe props 'name', 'number' (?) y 'data'
    //if data === '' entonces poner un placeholder

    return (
        <li className="EditableInput">
            <p className="newInputEntrName">
                {props.typeName} #{props.number}
            </p>
            <div className="inputXdeleteContainer">
                <textarea
                    rows="1"
                    className={props.beEditable === true ? "inputBox": "inputBox nonEditable"}
                    placeholder="Escribe aquí"
                    maxLength="70"
                    onChange={(e) => {
                        props.handleChanges(e, props.number);
                    }}
                    readOnly={!props.beEditable}
                    value={props.data}
                />
                {/* <TextField className="inputBox"></TextField> */}
                {props.beEditable && (
                    <img
                        src="/icons/icon-cross.svg"
                        alt="Eliminar"
                        className="iconDeleteInput"
                        onClick={() => {
                            props.handleRemove(props.number);
                        }}
                    />
                )}
            </div>
        </li>
    );
}

export default function ListEditableInput(props) {
    //recibe un array con los entregables
    // 'number' y 'data'
    if (props.ListInputs.length === 0) {
        return <div>No cuenta con {props.typeFault}</div>;
    }
    return (
        <ul className="ListEditableInput">
            {props.ListInputs.map((item) => {
                return (
                    <EditableInput
                        key={item.index}
                        typeName={props.typeName}
                        number={item.index}
                        data={item.data}
                        handleChanges={props.handleChanges}
                        handleRemove={props.handleRemove}
                        beEditable={props.beEditable}
                    ></EditableInput>
                );
            })}
        </ul>
    );
}
