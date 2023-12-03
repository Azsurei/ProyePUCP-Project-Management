import "@/styles/dashboardStyles/projectStyles/EDTStyles/ListEditableInput.css";
import { Textarea } from "@nextui-org/react";

function EditableInputV4Crit(props) {
    //recibe props 'name', 'number' (?) y 'data'
    //if data === '' entonces poner un placeholder

    return (
        <li className="EditableInput">
            <p className="newInputEntrName">
                {props.typeName} #{props.number}
            </p>
            <div className="inputXdeleteContainer">
                <Textarea
                    isInvalid={false}
                    //errorMessage="Este campo no puede estar vacio"
                    key={"bordered"}
                    variant={props.beEditable === true ? "bordered" : "flat"}
                    labelPlacement="outside"
                    placeholder="Escribe aquí"
                    className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                    value={props.data}
                    onChange={(e) => {
                        props.handleChanges(e, props.id);
                    }}
                    minRows={1}
                    size="sm"
                    readOnly={!props.beEditable}
                />
                {props.beEditable && (
                    <img
                        src="/icons/icon-cross.svg"
                        alt="Eliminar"
                        className="iconDeleteInput"
                        onClick={() => {
                            props.handleRemove(props.id);
                        }}
                    />
                )}
            </div>
        </li>
    );
}

export default function ListEditableInputV4Crit(props) {
    //recibe un array con los entregables
    // 'number' y 'data'
    if (props.ListInputs.length === 0) {
        return <div>No cuenta con {props.typeFault}</div>;
    }
    return (
        <ul className="ListEditableInput">
            {props.ListInputs.map((item, index) => {
                return (
                    <EditableInputV4Crit
                        key={item.idComponenteCriterioDeAceptacion}
                        id={item.idComponenteCriterioDeAceptacion}
                        typeName={props.typeName}
                        number={index + 1}
                        data={item.descripcion}
                        handleChanges={props.handleChanges}
                        handleRemove={props.handleRemove}
                        beEditable={props.beEditable}
                    ></EditableInputV4Crit>
                );
            })}
        </ul>
    );
}
