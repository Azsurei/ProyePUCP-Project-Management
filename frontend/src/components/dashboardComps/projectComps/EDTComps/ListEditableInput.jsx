import TextField from "@/components/TextField";
import "@/styles/dashboardStyles/projectStyles/EDTStyles/ListEditableInput.css";
import { Textarea } from "@nextui-org/react";

function EditableInput(props) {
    //recibe props 'name', 'number' (?) y 'data'
    //if data === '' entonces poner un placeholder

    return (
        <li className="EditableInput">
            <p className="newInputEntrName">
                {props.typeName} #{props.number}
            </p>
            <div className="inputXdeleteContainer">
                {/* <textarea
                    rows="1"
                    className={
                        props.beEditable === true
                            ? "inputBox"
                            : "inputBox nonEditable"
                    }
                    placeholder="Escribe aquí"
                    maxLength="70"
                    onChange={(e) => {
                        props.handleChanges(e, props.number);
                    }}
                    readOnly={!props.beEditable}
                    value={props.data}
                /> */}

                <Textarea
                    isInvalid={false}
                    //errorMessage="Este campo no puede estar vacio"
                    key={"bordered"}
                    variant={"bordered"}
                    labelPlacement="outside"
                    placeholder="Escribe aquí"
                    className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                    value={props.data}
                    onChange={(e) => {
                        props.handleChanges(e, props.number);
                    }}
                    minRows={1}
                    size="sm"
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
