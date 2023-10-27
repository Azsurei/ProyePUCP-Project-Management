import "@/styles/dashboardStyles/projectStyles/EDTStyles/ListEditableInput.css";
import { Textarea, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

function EditableInput(props) {
    //recibe props 'name', 'number' (?) y 'data'
    //if data === '' entonces poner un placeholder

    const temasPrueba = [
        {
            key: "Tema1",
            descripcion: "Tema 1: Blababababa"
        },
        {   
            key: "Tema2",
            descripcion: "Tema 2: Ajuajuaju"
        },
        {
            key: "Tema3",
            descripcion: "Tema 3: Hemisferio norte"
        },
    ]

    return (
        <li className="EditableInput">
            <div className="inputXdeleteContainer flex items-center gap-5 pb-3">
                <p>Para el </p>
                {/* Creo que alguien hizo un ComboBox en algun lado. Puedes cambiarlo por eso*/}
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            variant="bordered"
                        >
                            Escoger Tema
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="DynamicActions" temas={temasPrueba}>
                        {(tema) => (
                            <DropdownItem
                                key={tema.key}
                            >{tema.descripcion}</DropdownItem>
                        )}
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="ml-2">
                <p className="newInputEntrName">
                    {props.typeName} #{props.number}
                </p>
                <div className="flex items-center gap-10 " >
                    <div className="inputXdeleteContainer max-w-[1000px] w-fullx">
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
                            readOnly={!props.beEditable}
                        />
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
                    {/* Edit Fecha y hora}
                                        <input
                                            type="date"
                                            id="datePicker"
                                            name="datePicker"
                                            min={getMinDate()}
                                            value={dateValue}
                                            onChange={handleChangeDate}
                                        ></input>
                                        <input
                                            type="time"
                                            id="timePicker"
                                            name="timePicker"
                                            min={getMinTime()}
                                            value={timeValue}
                                            onChange={handleChangeTime}
                                        ></input>
                                        */}
                    <div className="inputXdeleteContainer">
                        <input
                            type="date"
                            id="acuerdoDatePicker"
                            name="fecha"
                            value={props.fecha}
                            onChange={(e) => {
                                props.handleChanges(e, props.number);
                            }}
                            className="w-full col-span-12 md:col-span-6 mb-6 md:mb-0"
                        ></input>
                    </div>
                </div>      
            </div>
        </li>
    );
}

export default function AcuerdosListEditableInput(props) {
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
                        fecha={item.fecha}
                        tema={item.tema}
                    ></EditableInput>
                );
            })}
        </ul>
    );
}