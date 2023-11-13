"use client"
import DateInput from "@/components/DateInput";
import { Divider, Textarea } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { SmallLoadingScreen } from "../../layout";

export default function GeneralScreen() {
    const { setIsLoadingSmall } = useContext(SmallLoadingScreen);
    
    const twStyle1 = "text-lg font-medium";
    const [projectName, setProjectName] = useState("");
    const [validName, setValidName] = useState(true);
    const [msgEmptyField, setMsgEmptyField] = useState("Error");

    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [validFechas, setValidFechas] = useState(true);

    useEffect(()=>{
        setIsLoadingSmall(false);
    })

    return (
        <div className="flex flex-col flex-1 h-[100%] space-y-2">
            <div className="flex flex-col mb-3">
                <p className="text-2xl font-medium text-mainHeaders">
                    Configuración general
                </p>
                <p className="text-slate-400">
                    Modifica información de tu proyecto
                </p>
            </div>

            <Divider></Divider>

            <p className={twStyle1}>Nombre de proyecto</p>
            <Textarea
                variant={"bordered"}
                aria-label="name-lbl"
                isInvalid={!validName}
                errorMessage={!validName ? msgEmptyField : ""}
                labelPlacement="outside"
                label=""
                placeholder="Escriba aquí"
                classNames={{ label: "pb-0" }}
                value={projectName}
                onValueChange={setProjectName}
                minRows={1}
                size="md"
                onChange={() => {
                    setValidName(true);
                }}
            />

            <div className="flex flex-row justify-between gap-5">
                <div className="flex flex-col flex-1">
                    <p className={twStyle1}>Fechas inicio:</p>
                    <DateInput
                        isEditable={true}
                        className={""}
                        isInvalid={!validFechas}
                        onChangeHandler={(e) => {
                            setFechaInicio(e.target.value);
                            setValidFechas(true);
                        }}
                        value={fechaInicio}
                    ></DateInput>
                </div>
                <div className="flex flex-col flex-1">
                    <p className={twStyle1}>Fecha fin</p>
                    <DateInput
                        isEditable={true}
                        className={""}
                        isInvalid={!validFechas}
                        onChangeHandler={(e) => {
                            setFechaFin(e.target.value);
                            setValidFechas(true);
                        }}
                        value={fechaFin}
                    ></DateInput>
                </div>
            </div>
        </div>
    );
}